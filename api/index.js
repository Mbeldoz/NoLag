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
      // REDIRECT browsers to Discord
      res.setHeader("Location", "https://discord.gg/mW9MJnpUPj");
      return res.status(302).send(); // 302 = Temporary redirect
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
