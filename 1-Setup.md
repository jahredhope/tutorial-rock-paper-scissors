# Chapter 1 - Setup

This chapter gets you setup with with a basic development environment with a canvas and render loop.

## Step 1. Initial Setup

> **Warning**
> This Tutorial assumes you have [pnpm](https://pnpm.io/) installed. In most cases you can replace `pnpm` with `npm`. The former is just my current prefered solution.

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

> ⁉️ **Working?**
>
> At this point you should be able to load the page but you wont have anything displayed yet. Try adding a `console.log()` command in the render loop. You should find it's called 60-120 times per second. (RIP your console history)

## Chapter Summary

At this point you won't have much. You should be able to open up the page and see a canvas, but it won't have anything drawn yet. That comes in the next chapter.

Prev: [Introduction](./README.md)

Next: [Chapter Two - Drawing](./2-Drawing.md)

By [@jahredhope](https://jahred.me/)
