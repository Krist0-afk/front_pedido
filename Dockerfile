FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Va como SAN del certificado: los navegadores ignoran el CN.
ARG TLS_HOST=44.207.141.228

# Sin https, MSAL no encuentra crypto.subtle y la app no arranca.
RUN apk add --no-cache openssl \
 && mkdir -p /etc/nginx/certs /etc/nginx/snippets \
 && if echo "${TLS_HOST}" | grep -Eq '^[0-9]+(\.[0-9]+){3}$'; then \
      SAN="IP:${TLS_HOST},DNS:localhost"; \
    else \
      SAN="DNS:${TLS_HOST},DNS:localhost"; \
    fi \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
      -keyout /etc/nginx/certs/server.key \
      -out /etc/nginx/certs/server.crt \
      -subj "/CN=${TLS_HOST}" \
      -addext "subjectAltName=${SAN}"

# app.conf es una plantilla: al arrancar, nginx reemplaza ${ANALYTICS_UPSTREAM}
ENV ANALYTICS_UPSTREAM=127.0.0.1:8091
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/snippets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/templates/app.conf.template
COPY --from=build /app/dist/pedidos360/browser /usr/share/nginx/html

EXPOSE 80 443
