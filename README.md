# Zulu

A tiny Bun + Gun page for the Zulu Time Trial.

## Run

```sh
bun install
bun start
```

Open `http://localhost:8765`.

If that port is busy:

```sh
PORT=8766 bun start
```

## Files

`index.html` is the page.

`index.js` is the default server. It hosts the page and lets Gun run its normal relay adapter.

`index.ts` is the Bun-native version. It hosts the page and bridges Bun WebSockets into Gun's mesh by hand.

Gun data lives in `data/`.
