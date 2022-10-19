const count = 24;
const size = 25;
const pieces: Piece[] = [];
let winner: Type | null = null;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Missing canvas in HTML");
}
const ctx = canvas.getContext("2d")!;

/**
 * Vector
 */

class Vector {
  constructor(public x: number, public y: number) {}
  /**
   * How far between two points as a Vector.
   */
  difference(p: Vector) {
    return new Vector(this.x - p.x, this.y - p.y);
  }
  /**
   * Total length of a Vector as a single number.
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Shorten or lengthen a Vector until it has a magnitude of 1.
   */
  normalize(): Vector {
    var length = this.magnitude();
    return new Vector(this.x / length || 0, (this.y = this.y / length || 0));
  }
  /**
   * How far between two points as a single number.
   */
  distance(p: Vector): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }
  /**
   * Add two Vectors together to get a new Vector.
   */
  add(p: Vector): Vector {
    return new Vector(this.x + p.x, this.y + p.y);
  }
  /**
   * Multiply a Vector's length by some value. Keeping the direction the same.
   */
  multiply(multiple: number): Vector {
    return new Vector(this.x * multiple, this.y * multiple);
  }
}

/**
 * Piece and update logic
 */

type Type = "rock" | "paper" | "scissors";

const mapItemToPrey: Record<Type, Type> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};
const mapItemToPredator: Record<Type, Type> = {
  scissors: "rock",
  paper: "scissors",
  rock: "paper",
};

class Piece {
  constructor(public pos: Vector, public type: Type) {}
  public update() {
    if (winner) return;

    // Find nearby items
    const prey = this.getClosestByType(mapItemToPrey[this.type]);
    const predator = this.getClosestByType(mapItemToPredator[this.type]);
    const ally = this.getClosestByType(this.type);

    if (!prey) throw new Error("Missing prey. Game has likely ended");
    if (!predator) throw new Error("Missing predator. Game has likely ended");

    // Check if we've taken anything
    if (prey.distance < size) {
      if (pieces.filter((p) => p.type === prey.piece.type).length === 1) {
        winner = this.type;
      }
      prey.piece.type = this.type;
    }

    // Force from Prey
    const dirFromPrey = prey.piece.pos.difference(this.pos).normalize();
    const magnitudeFromPrey =
      predator.distance / (predator.distance + prey.distance);
    const forceFromPrey = dirFromPrey.multiply(magnitudeFromPrey);

    // Force from Predator
    const dirFromPredator = this.pos.difference(predator.piece.pos).normalize();
    const magnitudeFromPredator =
      prey.distance / (predator.distance + prey.distance);
    const forceFromPredator = dirFromPredator.multiply(magnitudeFromPredator);

    let directionToMove = forceFromPrey.add(forceFromPredator).normalize();

    // Spread out a bit
    if (ally && ally.distance < size * 2) {
      directionToMove = directionToMove
        .add(this.pos.difference(ally.piece.pos).normalize().multiply(1))
        .normalize();
    }

    this.pos = this.pos.add(directionToMove);

    // Stay inside the borders
    if (this.pos.x < size) this.pos.x = size;
    if (this.pos.y < size) this.pos.y = size;
    if (this.pos.x > canvas.width - size) this.pos.x = canvas.width - size;
    if (this.pos.y > canvas.height - size) this.pos.y = canvas.height - size;
  }
  public draw(ctx: CanvasRenderingContext2D) {
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
  private getClosestByType(type: Type) {
    let closestDistance = Number.MAX_VALUE;
    let closest;

    for (let p of pieces) {
      if (p.type !== type) continue;

      const distance = this.pos.distance(p.pos);

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = p;
      }
    }

    if (!closest) return null;
    return { piece: closest, distance: closestDistance };
  }
}

/**
 * Setup and Render Loop
 */

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
  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If no winner, keep playing
  if (!winner) pieces.forEach((p) => p.update());

  // Draw the pieces
  pieces.forEach((p) => p.draw(ctx));

  // Display the winner
  if (winner) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${size}px Georgia`;
    ctx.fillStyle = "#EEEEEE";
    ctx.fillText(
      `Winner: ${winner}!`,
      canvas.width / 2,
      canvas.height / 2,
      200
    );
  }
  requestAnimationFrame(render);
}

render();
