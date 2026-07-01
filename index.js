const { createServer } = require("node:http");
const path = require("node:path");
const Gun = require("gun");

const port = Number(process.env.PORT || 8765);
const indexPath = path.join(__dirname, "index.html");
const gunPath = path.join(__dirname, "node_modules/gun/gun.js");

const server = createServer();

Gun({ file: "data", web: server });

server.on("request", async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const file = Bun.file(indexPath);
    if (!(await file.exists())) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("index.html not found");
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(await file.text());
    return;
  }

  if (url.pathname === "/gun.js") {
    const file = Bun.file(gunPath);
    res.writeHead(200, { "content-type": "application/javascript; charset=utf-8" });
    res.end(await file.text());
    return;
  }

  if (url.pathname.startsWith("/gun")) return;

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, () => {
  console.log(`Serving http://localhost:${port}`);
  console.log(`Gun relay http://localhost:${port}/gun`);
});
