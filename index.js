let express = require("express");
const { connections } = require("mongoose");
let app = express();

// in the require()() first set of () is used to call the function and second () is used to call the returned value of first function.
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let activeConnections = [];

io.on("connect", (socket) => {
  activeConnections.push(socket);
  console.log(`${socket.id} has connected`);

  socket.on("draw", (data) => {
    activeConnections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    activeConnections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} is disconnected`);
    activeConnections = activeConnections.filter((con) => con.id !== socket.id);
  });
});

app.use(express.static("public")); //Here the 'public' is the folder name

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
