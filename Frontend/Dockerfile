FROM node:20.11.1-alpine AS builder

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
