package main

import (
	"bytes"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
)

type receiver struct {
	Host string
	um   ptrace.Unmarshaler
	init sync.Once
}

func (r *receiver) TraceHandler() http.HandlerFunc {
	r.init.Do(func() {
		r.um = ptrace.NewProtoUnmarshaler()
	})

	var handler = http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		body := bytes.Buffer{}

		_, err := body.ReadFrom(request.Body)
		if err != nil {
			log.Printf("error reading request body: %v", err)
			writer.WriteHeader(http.StatusInternalServerError)
			return
		}
		request.Body.Close()
		tt, err := r.um.UnmarshalTraces(body.Bytes())
		if err != nil {
			log.Printf("error unmarshaling traces: %v", err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}

		for i := 0; i < tt.ResourceSpans().Len(); i++ {
			e := tt.ResourceSpans().At(i)
			r := e.Resource()
			v, ok := r.Attributes().Get("service.name")
			if !ok {
				log.Printf(`could not find resource attribute "service.name"`)
				continue
			}
			serviceName := v.AsString()
			if !strings.HasPrefix(serviceName, "benchd-worker") {
				continue
			}
			c := strings.Split(serviceName, ".")
			if len(c) != 3 {
				log.Printf(`malformed service.name attribute "%s"`, serviceName)
			}
			id, err := strconv.Atoi(c[2])
			if err != nil {
				log.Printf(`malformed id in service.name attribute "%s"`, serviceName)
				continue

			}
		}
		writer.WriteHeader(http.StatusOK)
	})

	return handler
}
