FROM node:14
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

RUN mkdir logs
COPY src/ ./src
COPY .env* ./
CMD npm run startdocker
