[Introduction](./README.md)

[Chapter One - Setup](./1-Setup.md)

[Chapter Two - Drawing](./2-Drawing.md)

[Chapter Three - Behaviour](./3-Behaviour.md)

[Chapter Four - Next Steps](./4-Next-Steps.md)

# Chapter 1 - Setup

This chapter gets you setup with with a basic development environment with a canvas and render loop.

## Step 1. Initial Setup

To get started lets create a place to write some code. For this tutorial you'll need a HTML file that can load some TypeScript.

Browsers typically can't load TypeScript directly, so you'll need some way to compile your code, alternatively just use JavaScript if that's your preference.

I'd recommend [Vite](https://vitejs.dev/guide/) as it's quick to get started compiling TypeScript whilst still giving you nice features like auto-refreshing your page when you make changes.

To do this you'll want to have [Node JS](https://nodejs.org/en/) installed:

Then run

```bash

npm create vite@latest

```

Then:

1. Select **Vanilla** and **TypeScript**.

2. Select and delete the content in `main.ts` except `import "./style.css";`.

3. Select and delete all the content in `style.css`.

Once finished, run the dev built to start developing. This should open up a web server listening on [localhost:5173](http://localhost:5173/).

```bash

npm run dev

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

In this case we'll use a 2D context which will allow us to draw things on the X (horizontal) and Y (vertical axis). Where 0,0 will be the top left of the screen.

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

At this point you should be able to load the page but you wont have anything displayed yet. Try adding a `console.log()` command in the render loop. You should find it's called 60-120 times per second. RIP your console history. You might want to delete that console log before you go any further.

If you'd like to confirm things are working you could draw something simple to the screen, the below code would draw a red square at x:50 and y:50 that is 100 wide and 100 tall.

```ts
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ...

  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 100, 100);

  // ..
  requestAnimationFrame(render);
}
```

## Chapter Summary

At this point you won't have much. You should be able to open up the page and see a canvas, but it won't have anything drawn yet. That comes in the next chapter.

> **Note** Not working? Checkout the [Step 1 Example Code](example-step-1/src/main.ts).

Prev: [Introduction](./README.md)

Next: [Chapter Two - Drawing](./2-Drawing.md)

By [@jahredhope](https://jahred.me/)
