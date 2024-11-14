FROM node:20.11.1-alpine

COPY . /app
WORKDIR /app

RUN npm install && npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
