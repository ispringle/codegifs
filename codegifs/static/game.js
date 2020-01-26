var socket = io();
socket.on("message", function(data) {
  console.log(data);
});

socket.emit("new player");

function sendClick(click) {
  socket.emit("image_clicked", click);
  console.log(click);
}

socket.on("state", function(players) {
  context.clearRect(0, 0, 800, 600);
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fillStyle = player.color;
    context.fill();
  }
});
