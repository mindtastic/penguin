package main

import (
	"embed"
	_ "embed"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"time"
)

var addr = flag.String("addr", ":7666", "address to listen on")
var buffSize = flag.Duration("lookback", 5*time.Minute, "time to look look into the past to build map")

//go:embed index.html
var static embed.FS

type appServer struct {
	rb        *RingBuffer
	s         http.Server
	startTime time.Time
}

func main() {
	flag.Parse()

	a := appServer{
		rb:        NewBuffer(int((*buffSize).Milliseconds() / 1000)), // One slot for every second.
		s:         http.Server{Addr: *addr},
		startTime: time.Now(),
	}

	mux := &http.ServeMux{}
	mux.Handle("/v1/traces", a.TraceHandler())
	mux.Handle("/api/map", a.handleServiceMap())
	mux.Handle("/", http.FileServer(http.FS(static)))
	a.s.Handler = mux

	log.Printf("listening on %s", *addr)
	log.Fatalf("error serving: %v", a.s.ListenAndServe())
}

func (a *appServer) handleServiceMap() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		serviceMap := NewServiceMap()

		for i := 0; i <= a.rb.Size(); i++ {
			m := a.rb.ReadAt(i)
			if m.Paths == nil {
				continue
			}
			serviceMap.Join(m)
		}

		e := json.NewEncoder(writer)
		if err := e.Encode(serviceMap); err != nil {
			log.Printf("error encoding map: %v", err)
			writer.WriteHeader(http.StatusInternalServerError)
		}
	}
}
