FROM node:alpine

WORKDIR /backend

COPY package*.json ./

# RUN npm install --silent
RUN npm install

COPY . ./

CMD [ "npm", "start" ]