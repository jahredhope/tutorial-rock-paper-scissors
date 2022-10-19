[Introduction](./README.md)

[Chapter One - Setup](./1-Setup.md)

[Chapter Two - Drawing](./2-Drawing.md)

[Chapter Three - Behaviour](./3-Behaviour.md)

[Chapter Four - Next Steps](./4-Next-Steps.md)

# Chapter Three - Behaviour

In this chapter you'll make each piece move itself. It'll decide where to move by looking at it's closest neighbours.

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

And now apply the total to our position.

```ts
this.pos = this.pos.add(directionToMove);
```

## Step 12. Spread pieces out

While we are in the area lets give the pieces a little motivation to spread out. If we don't do this allies will just clump together which doesn't look as nice.

```ts
// Spread out a bit
if (ally && ally.distance < size * 2) {
  directionToMove = directionToMove
    .add(this.pos.difference(ally.piece.pos).normalize().multiply(1))
    .normalize();
}
```

## Step 13. Check for out-of-bounds

At this point you'll likely have pieces running away off screen indefinitely.

For a simple solution we can just add an extra check after we've applied out move.

If we have moved out of bounds, let's just put the piece back in-bounds.

```ts
// Stay inside the borders
if (this.pos.x < size) this.pos.x = size;
if (this.pos.y < size) this.pos.y = size;
if (this.pos.x > canvas.width - size) this.pos.x = canvas.width - size;
if (this.pos.y > canvas.height - size) this.pos.y = canvas.height - size;
```

## Step 14. Check for Successful Take-overs

Things aren't going to look to interesting if nothing changes when it's overtaken.

If a piece has moved within the space of it's prey we should change it over to the current pieces type.

Now that we are changing pieces though we probably need some way to acknowledge that there is no pieces left. To do this we'll say there is a winner when a type has successfully overtaken all it's prey.

E.g. 🪨 wins when there is no more ✂️.

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
  pieces.forEach((p) => p.draw());

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

## Chapter Summary

You should now have rocks, papers and scissors moving about the screen. Once one side wins you'll need to refresh to start again.

> **Note** Not working? Checkout the [Complete Example Code](example-complete/src/main.ts).

Prev: [Chapter Two - Drawing](./2-Drawing.md)

Next: [Chapter Four - Next Steps](./4-Next-Steps.md)

By [@jahredhope](https://jahred.me/)
