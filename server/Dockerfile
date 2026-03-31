# # Stage 1 - builder
# FROM golang:1.26-alpine AS builder

# WORKDIR /app

# # Copia dependências
# COPY go.mod go.sum ./
# RUN go mod download

# # Copia o restante do código
# COPY . .

# # Compila
# RUN CGO_ENABLED=0 GOOS=linux go build -o /app/api ./cmd/api

# # Stage 2 - runner
# FROM alpine:latest

# WORKDIR /app

# # Instala certificados necessários para chamadas HTTPS estáticas (opcional)
# RUN apk --no-cache add ca-certificates tzdata

# # Copia o binário do builder
# COPY --from=builder /app/api /app/api

# EXPOSE 8080

# CMD ["/app/api"]

FROM golang:1.26-alpine

RUN apk add --no-cache bash

WORKDIR /app

CMD ["bash"]
