import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || "";
    
    // Detect Roblox - look for common Roblox User-Agent patterns
    const isRoblox = userAgent.includes("Roblox") || 
                     userAgent.includes("GameClient") ||
                     userAgent.toLowerCase().includes("roblox");
    
    // Also check if it's a browser (has Mozilla and accepts HTML)
    const isBrowser = userAgent.includes("Mozilla") && 
                      req.headers.accept?.includes("text/html");
    
    if (isRoblox || !isBrowser) {
      // Serve Lua file to Roblox (or any non-browser)
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(200).send(luaContent);
    } else {
      // Serve HTML page to browsers
      const html = `<!DOCTYPE html>
      <html>
      <head>
        <title>nolag.wtf</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <h1>Nothing to see here</h1>
        <p>This domain is used for a Roblox script.</p>
        <p>If you're a human, there's nothing for you here.</p>
      </body>
      </html>`;
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
