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
  const api_url =
    "https://api.giphy.com/v1/gifs/random?api_key=oHQGDCthzzwKl3V0PgnLnPuyYI6fJOjs&tag=&rating=PG";
  https
    .get(api_url, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.stringify(JSON.parse(data)["data"]["embed_url"]));
        return JSON.stringify(JSON.parse(data)["data"]["embed_url"]);
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}

function download(url, file_name) {
  request
    .get(url)
    .on("error", function(err) {
      console.error(err);
    })
    .pipe(fs.createWriteStream(file_name));
}

// Start your engines!
http.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
  getGIF();
  // download(getGIF(), "test.gif");
});
