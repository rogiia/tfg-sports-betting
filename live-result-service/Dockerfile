FROM node:12.4
WORKDIR /usr/src/app
ENV NODE_ENV production
ENV NODE_PORT 8080
COPY package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN npm run build
COPY src/grpc/protos ./dist/grpc/protos
EXPOSE 8080
CMD [ "node", "dist/main.js" ]
