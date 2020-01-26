// Dependencies
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const https = require("https");
const io = require("socket.io")(http);
const fs = require("fs");
const request = require("request");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function(req, res) {
  res.sendFile("index.html", { root: __dirname });
});

// Add the WebSocket handlers
io.on("connection", function(socket) {
  console.log(`a user has connected on socket ${socket.id}`);
});

function hashSocket(sock) {
  var hash = 0;
  for (var i = 0; i < sock.length; i++) {
    hash = sock.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

var players = {};
io.on("connection", function(socket) {
  socket.on("new player", function() {
    players[socket.id] = {
      x: 300,
      y: 300,
      color: `#${intToRGB(hashSocket(socket.id))}`
    };
  });
  socket.on("movement", function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit("state", players);
}, 1000 / 60);

function getGIF() {
  return new Promise((resolve, rej) => {
    const api_url =
      "https://api.giphy.com/v1/gifs/random?api_key=oHQGDCthzzwKl3V0PgnLnPuyYI6fJOjs&tag=&rating=PG";

    request.get(api_url, { json: true }, (err, res, body) => {
      if (err) {
        return console.error(err);
      }
      resolve(body.data.images.downsized_large.url);
    });
  });
}

function download(url, file_name) {
  const location = __dirname + "/static/" + file_name;
  request
    .get(url)
    .on("error", function(err) {
      console.error(err);
    })
    .pipe(fs.createWriteStream(location));
}

// Start your engines!
http.listen(PORT, async function() {
  console.log(`listening on *:${PORT}`);
  for (i = 1; i < 26; i++) {
    download(await getGIF(), `image${i}.gif`);
  }
});
