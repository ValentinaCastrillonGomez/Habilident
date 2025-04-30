FROM node:20.11.1-alpine

WORKDIR /app
COPY . .

RUN npm install angular-http-server@latest -g

EXPOSE 8080
ENTRYPOINT ["angular-http-server"]
