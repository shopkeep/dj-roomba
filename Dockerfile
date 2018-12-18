FROM node:11-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/dj-roomba
COPY package.json package-lock.json ./

RUN npm install

COPY . .
