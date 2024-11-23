FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start"]