# Chapter - Next Steps

At this point you've basically finished. It's up to you what to do next. I'd recommend deploying the site so other people can see your work. And if you still want to practice more, checkout optional things you could do.

## Step 15: Deploying the Site

If you've got this far, you should probably publish your work somewhere, so people can see what you've built.

One of my favourite ways to publish a quick site is using [Surge](https://surge.sh).

Don't forget to replace `<your_subdomain_here>` with your own name. You don't need to register anything beforehand, as long as it's not already taken.

```bash

pnpm build

```

```bash

pnpx surge --domain <your_subdomain_here>.surge.sh dist

```

If you do publish your site I'd love to see it. [Send me a tweet](https://twitter.com/intent/tweet?text=%40jahredhope%0A) and I'll check it out.

## Optional Improvements

If you want to do more to make the app unique, perhaps consider some of the following challenges:

- Fit the canvas to the screen. Don't forget to update on screen resize.

- Performance optimize the code for 1000+ pieces. Making use of Chrome/Firefox Profiler Flame Charts can be a great place to start.

- Add buttons and inputs to allow the user to pause, reset, or configure the game.

Prev: [Chapter Three - Behaviour](./3-Behaviour.md)

By [@jahredhope](https://jahred.me/)
