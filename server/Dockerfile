# Stage 1 - builder
FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /tmp/api ./cmd/api

FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /tmp/api /usr/local/bin/api

EXPOSE 8080

CMD ["/usr/local/bin/api"]

### Alternative Dockerfile for development environment

# FROM golang:1.26-alpine

# RUN apk add --no-cache bash

# WORKDIR /app

# CMD ["bash"]
