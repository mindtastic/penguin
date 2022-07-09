package main

import (
	"bytes"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	conventions "go.opentelemetry.io/collector/semconv/v1.6.1"
	"log"
	"net/http"
)

const (
	attrCategories          = "tilt.categories"
	attrLegalBases          = "tilt.legal_bases"
	attrLegitimateInterests = "tilt.legitimate_interests"
	attrStorages            = "tilt.storage_durations"
	attrPurposes            = "tilt.purposes"
	attrAutomatedDecision   = "tilt.automated_decision_making"
)

type serviceSpan struct {
	span ptrace.Span
	name string
	root bool
}

func (a *appServer) TraceHandler() http.HandlerFunc {
	um := ptrace.NewProtoUnmarshaler()
	var handler = http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		body := bytes.Buffer{}

		_, err := body.ReadFrom(request.Body)
		if err != nil {
			log.Printf("error reading request body: %v", err)
			writer.WriteHeader(http.StatusInternalServerError)
			return
		}
		request.Body.Close()
		tt, err := um.UnmarshalTraces(body.Bytes())
		if err != nil {
			log.Printf("error unmarshaling traces: %v", err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		serviceMap := NewServiceMap()
		spanMap := map[string]serviceSpan{}
		var rootSpanName string

		rss := tt.ResourceSpans()
		for i := 0; i < rss.Len(); i++ {
			rs := rss.At(i)
			resource := rs.Resource()

			name, ok := resource.Attributes().Get(conventions.AttributeServiceName)
			if !ok {
				continue
			}
			serviceName := name.AsString()
			serviceMap.AddNode(serviceName)

			ilss := rs.ScopeSpans()
			for j := 0; j < ilss.Len(); j++ {
				ils := ilss.At(j)
				spans := ils.Spans()
				for k := 0; k < spans.Len(); k++ {
					span := spans.At(k)
					parent := span.ParentSpanID()
					root := false
					if parent.IsEmpty() {
						rootSpanName = span.Name()
						root = true
					}
					spanMap[span.SpanID().HexString()] = serviceSpan{
						span: span,
						name: serviceName,
						root: root,
					}
				}
			}
		}

		for _, serviceSpan := range spanMap {
			serviceName := serviceSpan.name
			isRoot := serviceSpan.root
			parent := serviceSpan.span.ParentSpanID()

			s, ok := spanMap[parent.HexString()]
			if !ok && !isRoot {
				continue
			}
			attributeSpan := s.span
			if isRoot {
				attributeSpan = serviceSpan.span
			}

			attr := make(map[string][]string)
			attributeSpan.Attributes().Range(func(k string, val pcommon.Value) bool {
				attr[k] = make([]string, 0)
				switch val.Type() {
				case pcommon.ValueTypeSlice:
					sl := val.SliceVal()
					for i := 0; i <= sl.Len(); i++ {
						v := sl.At(i)
						attr[k] = append(attr[k], v.AsString())
					}
				default:
					sl := val.AsString()
					attr[k] = append(attr[k], sl)
				}
				return true
			})

			serviceMap.AddPathEdge(rootSpanName, s.name, serviceName, attr)
		}

		a.rb.Write(serviceMap)
		writer.WriteHeader(http.StatusOK)
	})

	return handler
}
