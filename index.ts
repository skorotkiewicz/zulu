import Gun from "gun";
import type { ServerWebSocket } from "bun";

type Peer = {
  id?: string;
  wire: ServerWebSocket<{ peer?: Peer }>;
};

const port = Number(Bun.env.PORT || 8765);
const indexFile = Bun.file(new URL("./index.html", import.meta.url));
const faviconFile = Bun.file(new URL("./favicon.svg", import.meta.url));
const gunFile = Bun.file(new URL(import.meta.resolve("gun/gun.js")));
const gun = Gun({ file: "data" });
const mesh = (gun as any)._.root.opt.mesh;
const decoder = new TextDecoder();

Bun.serve<{ peer?: Peer }>({
  port,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/gun") {
      return server.upgrade(req, { data: {} }) ? undefined : new Response("Upgrade required", { status: 426 });
    }

    if (url.pathname === "/gun.js") {
      return new Response(gunFile, {
        headers: { "content-type": "application/javascript; charset=utf-8" },
      });
    }

    if (url.pathname === "/favicon.svg") {
      return new Response(faviconFile, {
        headers: { "content-type": "image/svg+xml; charset=utf-8" },
      });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(indexFile, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
  websocket: {
    open(ws) {
      const peer = { wire: ws };
      ws.data.peer = peer;
      mesh.hi(peer);
    },
    message(ws, message) {
      const peer = ws.data.peer;
      if (!peer) return;
      mesh.hear(typeof message === "string" ? message : decoder.decode(message), peer);
    },
    close(ws) {
      const peer = ws.data && ws.data.peer;
      if (peer) mesh.bye(peer);
    },
  },
});

console.log(`Serving http://localhost:${port}`);
console.log(`Gun relay ws://localhost:${port}/gun`);
