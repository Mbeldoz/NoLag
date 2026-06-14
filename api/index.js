import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || "";
    
    // Only treat as Roblox if it clearly is Roblox
    const isRoblox = userAgent.includes("Roblox") || 
                     userAgent.toLowerCase().includes("roblox") ||
                     userAgent.includes("GameClient");
    
    if (isRoblox) {
      // Serve Lua file to Roblox
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      
      // NO CACHING for Lua responses (prevents browser cache issue)
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(luaContent);
    } else {
      // Redirect browsers to Discord
      res.setHeader("Location", "https://discord.gg/mW9MJnpUPj");
      // Also prevent caching of redirects
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      return res.status(302).send();
    }
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
