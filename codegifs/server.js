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
