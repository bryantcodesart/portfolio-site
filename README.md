# Disclaimer
Fork away, reverse engineer, have a blast, reach out to me with questions! 

But. Please do not just replace the content (e.g. with your crypto marketing) and republish the site as your own.  I wish I were joking, but this has happened twice. That I know of.

# bryantcodes.art

Hello! This is my portfolio site [bryantcodes.art](https://bryantcodes.art). It is a wild work in progress (currently barely at an MVP stage) and also my safe place to experiment with new things I wanna try. Examine the code if you dare. Ha! I'm slowly going through and commenting/cleaning things I hastily created. There are actually a few novel solutions lurking in there that I'm proud of--maybe future blog posts!

Want to know how any particular thing was acheived? You should [write me](mailto:hello@bryantcodes.art) because I love nerding out about this stuff and my gf and dog are honestly sick of hearing about it.

# Great libraries you should try

In no particular order, here are some cool things I found and liked:

- Once you go [Typescript](https://www.typescriptlang.org/), you never go back.
- CMS is [Sanity](https://www.sanity.io/).
- Typesafety in sanity via [sanity-codegen](https://github.com/ricokahler/sanity-codegen).
- Frontend is currently [Next.js](https://nextjs.org/), maybe one day soon it will be [Astro](https://astro.build/).
- Hosted on [Vercel](https://vercel.com/).
- 3D rendering via [Three.js](https://threejs.org/) and the AMAZING declarative implementation [React Three Fiber](https://github.com/pmndrs/react-three-fiber).
- UNBELIEVABLY VALUABLE SET OF THREE.JS TOOLS: [Drei](https://github.com/pmndrs/drei). Must have. I used it to embed HTML in the 3D space, to quickly spin up GLSL shader materials, to draw text, and loads more.
- 3D accessibility tools via [@react-three/a11y](https://github.com/pmndrs/react-three-a11y).
- Useful a11y hooks via [react-aria](https://react-spectrum.adobe.com/react-aria/).
- Best way to handle complex touch/click interactions: [@use-gesture/react](https://www.npmjs.com/package/@use-gesture/react). (E.g. used here for the drawing canvas.)
- Not for everyone, but I wrote nearly all the CSS with [Tailwind](https://tailwindcss.com/) and I love it. Haters? Let's debate. lol!
- My new favorite way to manage state: [Zustand](https://github.com/pmndrs/zustand). I used to use Redux and/or Context, but Zustand beats both for nearly all my state abstraction use cases!
- Loads of great, typesafe react hooks [usehooks-ts](https://usehooks-ts.com/).
- Still trying to decide which I like better between [framer-motion](https://www.framer.com/motion/) and [react-spring](https://react-spring.dev/).
- Observe font loading with [use-font-face-observer](https://www.npmjs.com/package/use-font-face-observer). Helps me wait for Roboto to load before I paint to canvas.
- Great SEO solution for Next.js you probably already found: [next-seo](https://github.com/garmeeh/next-seo).
- I stole my loading spinner from [Pure CSS Spinners](https://loading.io/css/)
- Something I use to quickly spin up UIs to tweak e.g. animation variables in the browser while developing: [Leva](https://github.com/pmndrs/leva).

Notice something? Like 50% of the coolest things come from [pmndrs](https://github.com/pmndrs/). I am a HUGE fan of these cats.

# Dev

Its a "monorepo" (sorta?) with a frontend and backend dir. I like em together so I can easily facilitate typesafety and version changes that are tightly coupled.

## Frontend - Next.js

TODO: Probably Astro would be better for this site, since I only really SSG a single page in the MVP. (Technically, I opened up endpoints for each 3D scene, but those are really only meant for dev convenience. I dont think I want users drilling into a particular scene directly.) And I'm totally abusing `_app`. I'm entertaining a few future features, though, for which Next.js might come in handy... So iunno. It's fine for now.

The usual commands in the `frontend` dir:

```bash
# Build, useful for checking if you have deploy-blocking issues
yarn build
# Work on the site
yarn dev
```

## Backend - Sanity

IMPORTANT: Don't forget to generate types if you change the Sanity schema! See below.

In the `backend` dir:

```bash
# Basically I aliased the sanity CLI commands:
yarn dev
yarn deploy
yarn build

# Codegen for cross-stack type-safety,
# run this any time you edit the schema
# to generates types used in the frontend code.
yarn build:types
```
