FROM node:20.11.1-alpine AS builder

COPY . /app
WORKDIR /app

ARG BACKEND_URL
RUN sed -i "s|{BACKEND_URL}|$BACKEND_URL|g" src/environments/environment.ts

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
