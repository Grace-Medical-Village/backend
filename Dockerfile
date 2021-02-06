FROM node:alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install --silent

COPY . ./

CMD [ "npm", "start" ]