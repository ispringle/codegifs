FROM node:latest
MAINTAINER Ian Pringle <pard@0x44.pw>

COPY codegifs/ /app/
RUN npm install --save express socket.io

EXPOSE 8080
CMD ["node", "/app/server.js"]
