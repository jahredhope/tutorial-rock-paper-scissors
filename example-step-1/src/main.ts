const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Missing canvas in HTML");
}

const ctx = canvas.getContext("2d")!;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 100, 100);

  // Update
  // ... TODO in Step 12

  // Draw
  // ... TODO in Step 9

  requestAnimationFrame(render);
}

render();
