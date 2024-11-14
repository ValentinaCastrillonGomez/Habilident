FROM node:20.11.1-alpine

COPY . /app
WORKDIR /app

ARG BACKEND_URL
RUN sed -i "s|{BACKEND_URL}|$BACKEND_URL|g" src/environments/environment.ts

RUN npm install && npm run build && npm install angular-http-server@latest -g
WORKDIR /app/dist

EXPOSE 8080
ENTRYPOINT ["angular-http-server"]
