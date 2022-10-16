# Tutorial: Rock Paper Scissors

A step-by-step tutorial on creating your own rock paper scissors animation.

Three main parts:

- **Render loop:** How to create a render loop using Canvas and `requestAnimationFrame`.

- **Vector logic:** Adding, subtracting and multiplying points in a 2D space.

- **Update behaviour:** Configuring each piece to independently decide how to move.

![Example screenshot](./rock-paper-scissors-example.png)

**No dependencies.** This tutorial is focused on learning how things work under the hood. For production code, I'd strongly consider using stable and well tested libraries.

For a working example, check out [the complete source-code](/Users/jhope/code/tutorial-canvas-rps/src/main.ts).

## Step 1. Initial Setup

You'll need a place to write your:

- HTML and CSS,

- TypeScript (or JavaScript).

I'd recommend [Vite](https://vitejs.dev/guide/) as it's quick to get started with whilst still giving you nice features like auto-refreshing your page when you make changes.

Just run

```bash

pnpm create vite

```

And select Vanilla and TypeScript.

Then select and delete the content in `main.ts` except `import "./style.css";`.

Then select and delete all the content in `style.css`.

Once you do this, run the dev built to start developing.

```bash

pnpm dev

```

## Step 2. Add Boilerplate HTML

Create the HTML with a `<canvas>` tag with an id and a `<script>` tag to your code.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rock Paper Scissors Animation</title>
    <style>
      body {
        background: #222222;
      }
      canvas {
        background: #333333;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" height="700" width="700"></canvas>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Step 3. Get Canvas and Context

Get a reference to your canvas and create a context to draw to it.

```ts
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Missing canvas in HTML");
}

const ctx = canvas.getContext("2d")!;
```

## Step 4. Add a Render Loop

Create a function called `render` and have it request itself be drawn in the next animation frame.

```ts
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update
  // ... TODO in Step 12

  // Draw
  // ... TODO in Step 9

  requestAnimationFrame(render);
}

render();
```

## Step 5. Define a Vector

In this context a 2D Vector will be how we store values for our 2D plane. Stored as an x (horizontal) and y (vertical) value.

A vector might be:

- A position on the board

- A distance between two positions on a board

I like to use a class, to add all the related logic. Though just using an interface and functions works fine to.

```ts
class Vector {
  constructor(public x: number, public y: number) {}
}
```

## Step 6. Define a Piece

This will be the thing that moves around the screen. It'll have a type for whether it is rock, paper, or scissors.

Eventually it'll given the ability to update itself and draw itself.

```ts
type Type = "rock" | "paper" | "scissors";

class Piece {
  constructor(public pos: Vector, public type: Type) {}

  public update() {
    // Update itself
    // TODO in step 11
  }

  public draw() {
    // Draw itself
    // TODO in Step 8
  }
}
```

## Step 7. Setup the Board with Pieces

To start seeing the results of our work, we'll need to create some pieces. In the example below, we create them at a random location, but it's up to you.

We'll set an item `count` of 21, and divide by 3 as we are drawing three items every loop. This makes sure it's a fair division.

```ts
const count = 21;

const pieces: Piece[] = [];

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
```

## Step 8. Teach a Piece to draw itself

In this case, we are using emoji to represent pieces. Which are drawn to the screen just like text.

We'll align the text in the centre and grab a related emoji from a private function.

```ts
const size = 25;

class Piece {
  constructor(public pos: Vector, public type: Type) {}

  public update() {
    // Update itself
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
```

## Step 9. Draw the Pieces on the Board

We now have some pieces, and they know how to draw themselves. We just need to call their draw method every loop.

```ts
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update
  // ... TODO in Step 12

  // Draw
  pieces.forEach((p) => p.draw(ctx));
  requestAnimationFrame(render);
}

render();
```

## Step 10. Implement Vector Logic

Before we start updating pieces, you'll need to be able to reason about the 2D space. There are plenty of libraries that will provide this logic for you if you want to skip this step.

```ts
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
```

## Step 11. Allow Pieces to Move

Add a private method for working how which item is closest.

```ts
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
```

Then find each item.

```ts
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

// ...

public update() {
  const prey = this.getClosestByType(mapItemToPrey[this.type]);
  const predator = this.getClosestByType(mapItemToPredator[this.type]);
  const ally = this.getClosestByType(this.type);

  // ...

}

```

Once we have each item, we want to find out which direction we should move. In this tutorial, we'll say we want to move towards the nearest prey, and away from the nearest predator. And we'll weight these values by how far they are.

For example:

- If a prey is close, and a predator is far away: Move more towards the prey than away from the predator.

- If the predator is close, and the prey if far away: Move more towards the predator than away from the prey.

```ts
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
```

While we are in the area lets give the pieces a little motivation to spread out.

```ts
// Spread out a bit
if (ally && ally.distance < size * 2) {
  directionToMove = directionToMove
    .add(this.pos.difference(ally.piece.pos).normalize().multiply(1))
    .normalize();
}
```

And now apply the total to our position.

```ts
this.pos = this.pos.add(directionToMove);
```

And if we have moved out of bounds, let's just put the piece back in-bounds.

```ts
// Stay inside the borders
if (this.pos.x < size) this.pos.x = size;
if (this.pos.y < size) this.pos.y = size;
if (this.pos.x > canvas.width - size) this.pos.x = canvas.width - size;
if (this.pos.y > canvas.height - size) this.pos.y = canvas.height - size;
```

## Step 12. Check for Successful Take-overs

```ts
let winner: Type | null = null;

// ...

public update() {
  if (winner) return;

  // ...

  if (!prey) throw new Error("Missing prey. Game has likely ended");
  if (!predator) throw new Error("Missing predator. Game has likely ended");

  // Check if we've taken anything
  if (prey.distance < size) {

    // Check if this is the last piece
    if (pieces.filter((p) => p.type === prey.piece.type).length === 1) {
      winner = this.type;
    }

    prey.piece.type = this.type;
  }
}

```

Now we can update the render loop to update our pieces. And even display the winner once complete.

```ts
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
```

## Step 13: Deploying the Site

If you've got this far, you should probably publish your work somewhere, so people can see what you've built.

One of my favourite ways to publish a quick site is using [Surge](https://surge.sh).

Don't forget to replace `<your_subdomain_here>` with your own name. You don't need to register anything beforehand, as long as it's not already taken.

```bash

pnpm build

```

```bash

pnpx surge --domain <your_subdomain_here>.surge.sh dist

```

## Next steps

If you want to do more to make the app unique, perhaps consider some of the following challenges:

- Fit the canvas to the screen. Don't forget to update on screen resize.

- Performance optimize the code for 1000+ pieces. Making use of Chrome/Firefox Profiler Flame Charts can be a great place to start.

- Add buttons and inputs to allow the user to pause, reset, or configure the game.
