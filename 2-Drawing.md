# Chapter 2 - Drawing

In this chapter you'll ensure each piece is drawn on screen. Pieces won't be moving yet, but at-least you can see them.

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

Eventually it'll given the ability to update itself and draw itself. But for now lets just create a class with two methods.

`update` will allow the piece to decide what to do in the next tick.

`draw` will allow the piece to draw itself to the screen.

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
  pieces.forEach((p) => p.draw());
  requestAnimationFrame(render);
}

render();
```

## Chapter Summary

At this point you should have some rocks, papers, and scissors displayed on the screen. They won't be moving yet. That comes in the next chapter.

> **Note** Not working? Checkout the [Step 2 Example Code](example-step-2/src/main.ts).

Prev: [Chapter One - Setup](./1-Setup.md)

Next: [Chapter Three - Behaviour](./3-Behaviour.md)

By [@jahredhope](https://jahred.me/)
