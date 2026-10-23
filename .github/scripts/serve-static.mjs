import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(process.argv[2] || "apps/mobile/dist");
const port = Number(process.argv[3] || 8081);
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".png":"image/png",".svg":"image/svg+xml",".woff":"font/woff",".woff2":"font/woff2"};
http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
  let file = path.resolve(root, "." + pathname);
  if (!file.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(root, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, {"content-type":types[path.extname(file)] || "application/octet-stream", "cache-control":"no-store"});
  fs.createReadStream(file).pipe(res);
}).listen(port,"127.0.0.1",()=>console.log("Serving " + root + " on " + port));
