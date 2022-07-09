FROM golang:1.18-alpine AS builder

WORKDIR /build

COPY . .

RUN go mod download

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
RUN go build -ldflags="-s -w" -o penguin *.go

FROM scratch

COPY --from=builder ["/build/penguin", "/"]

# Command to run when starting the container.
ENTRYPOINT ["/penguin"]
