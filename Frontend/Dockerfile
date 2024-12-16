FROM node:20.11.1-alpine

COPY . /app
WORKDIR /app

RUN npm install angular-http-server@latest -g

EXPOSE 8080
ENTRYPOINT ["angular-http-server"]
