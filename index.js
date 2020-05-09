const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  socket.on("JOIN", (user) => {
    socket.broadcast.emit("JOIN", user);
    socket.broadcast.emit("REPORT_REQUEST");
  });
  socket.on("USER_DATA", (userData) =>
    socket.broadcast.emit("USER_DATA", userData)
  );
  socket.on("LEAVE", (user) => socket.broadcast.emit("LEAVE", user));

  socket.on("MESSAGE", (chat) =>
    socket.broadcast.emit("MESSAGE", `${chat.user}: ${chat.message}`)
  );
  socket.on("WRITING", (user) => socket.broadcast.emit("WRITING", user));
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
