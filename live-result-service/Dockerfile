FROM node:12.4
WORKDIR /usr/src/app
ENV NODE_ENV production
ENV NODE_PORT 8080
COPY package*.json ./
RUN npm install
COPY ./dist .
EXPOSE 8080
CMD [ "node", "main.js" ]