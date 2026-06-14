import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Check User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const isRoblox = userAgent.includes("Roblox");
    const isBrowser = userAgent.includes("Mozilla") && !isRoblox;

    // Serve Lua script only to Roblox
    if (isRoblox) {
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(luaContent);
    } 
    else if (isBrowser) {
      const html = `<!DOCTYPE html>
      <html>
      <head><title>nolag.wtf</title></head>
      <body><h1>Nothing to see here</h1><p>This domain is used for a Roblox script.</p></body>
      </html>`;
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    } 
    else {
      return res.status(403).send("Forbidden: This endpoint is for Roblox only.");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
}
