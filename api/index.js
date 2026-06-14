import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || "";
    const isRoblox = userAgent.includes("Roblox");

    // Serve the Lua script ONLY to Roblox
    if (isRoblox) {
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      // Cache for 1 full day to reduce function calls even more
      res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(luaContent);
    }
    
    // Serve a simple HTML page to anyone else (browsers, bots)
    const html = `<!DOCTYPE html>
    <html>
    <head><title>nolag.wtf</title></head>
    <body>
      <h1>Nothing to see here</h1>
      <p>This domain is for a Roblox script.</p>
    </body>
    </html>`;
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
