# Zulu

A tiny Bun + Gun page for the Zulu Time Trial.

## Quick Start

```sh
docker pull ghcr.io/skorotkiewicz/zulu
```

```sh
docker run --rm --name zulu \
  -p 8765:8765 \
  -v zulu-data:/app/data \
  ghcr.io/skorotkiewicz/zulu
```

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
