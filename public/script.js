let canvas = document.getElementById("canvas");
canvas.width = 0.98 * window.innerWidth;
canvas.height = 0.98 * window.innerHeight;

var io = io.connect("http://localhost:8080");

let context = canvas.getContext("2d");

/*  How to draw on board
---> context.moveTo(100, 100);
---> context.lineTo(200, 200);
---> context.stroke();
*/

let mouseDown = false;

window.onmousedown = (e) => {
  context.moveTo(x, y);
  io.emit("down", { x, y });
  mouseDown = true;
};

window.onmouseup = (e) => {
  mouseDown = false;
};

io.on("ondraw", ({ x, y }) => {
  context.lineTo(x, y);
  context.stroke();
});

io.on("ondown", ({ x, y }) => {
  context.moveTo(x, y);
});

window.onmousemove = (e) => {
  x = e.clientX;
  y = e.clientY;

  if (mouseDown) {
    io.emit("draw", { x, y });
    context.lineTo(x, y);
    context.stroke();
  }
};
