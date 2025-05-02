FROM node:20.11.1-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY dist ./dist

RUN npm install angular-http-server@latest -g

EXPOSE 8080
ENTRYPOINT ["angular-http-server"]
