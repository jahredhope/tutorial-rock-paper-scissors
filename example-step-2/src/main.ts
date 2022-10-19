const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const count = 21;
const pieces: Piece[] = [];
const size = 25;

if (!canvas) {
  throw new Error("Missing canvas in HTML");
}

const ctx = canvas.getContext("2d")!;

class Vector {
  constructor(public x: number, public y: number) {}
}

type Type = "rock" | "paper" | "scissors";

class Piece {
  constructor(public pos: Vector, public type: Type) {}

  public update() {
    // Update itself
    // TODO in step 11
  }

  public draw() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${size}px Georgia`;
    ctx.fillText(this.getIcon(), this.pos.x, this.pos.y, size);
  }

  private getIcon() {
    if (this.type === "paper") return "📄";
    if (this.type === "rock") return "🪨";
    return "✂️";
  }
}

for (let i = 0; i < count / 3; i++) {
  pieces.push(
    ...(["paper", "rock", "scissors"] as const).map(
      (type) =>
        new Piece(
          new Vector(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          ),
          type
        )
    )
  );
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update
  // ... TODO in Step 12

  // Draw
  pieces.forEach((p) => p.draw());

  requestAnimationFrame(render);
}

render();
