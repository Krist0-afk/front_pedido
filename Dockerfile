FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Va como SAN del certificado: los navegadores ignoran el CN.
ARG TLS_HOST=3.213.91.126

# Sin https, MSAL no encuentra crypto.subtle y la app no arranca.
RUN apk add --no-cache openssl \
 && mkdir -p /etc/nginx/certs \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
      -keyout /etc/nginx/certs/server.key \
      -out /etc/nginx/certs/server.crt \
      -subj "/CN=${TLS_HOST}" \
      -addext "subjectAltName=IP:${TLS_HOST},DNS:localhost"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/snippets/app.conf
COPY --from=build /app/dist/pedidos360/browser /usr/share/nginx/html

EXPOSE 80 443
