import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || "";
    const acceptHeader = req.headers["accept"] || "";
    
    // ----- DETECT ROBLOX (priority) -----
    const isRoblox = userAgent.includes("Roblox") || 
                     userAgent.includes("GameClient") ||
                     userAgent.toLowerCase().includes("roblox") ||
                     userAgent.includes("RBX") ||
                     acceptHeader.includes("application/octet-stream");
    
    // ----- DETECT BROWSERS (comprehensive list) -----
    const browserPatterns = [
      "Mozilla", "Chrome", "Safari", "Firefox", "Edge", "Opera",
      "Brave", "Vivaldi", "Chromium", "Internet Explorer", "Trident",
      "Edg", "OPR", "SamsungBrowser", "UCBrowser", "QQBrowser",
      "Baidu", "Maxthon", "SeaMonkey", "Konqueror", "PaleMoon",
      "Waterfox", "Iceweasel", "Camino", "Epiphany", "Lynx",
      "Curl", "Wget", "Postman", "Insomnia"  // Common API tools
    ];
    
    let isBrowser = false;
    
    // Check if User-Agent matches any browser pattern
    for (const pattern of browserPatterns) {
      if (userAgent.includes(pattern)) {
        isBrowser = true;
        break;
      }
    }
    
    // Additional browser detection via Accept header
    const hasHtmlAccept = acceptHeader.includes("text/html");
    const hasXmlHttp = acceptHeader.includes("XMLHttpRequest");
    
    // Also detect common mobile browsers
    const mobilePatterns = ["Android", "iPhone", "iPad", "iPod", "BlackBerry", "Windows Phone", "Mobile"];
    for (const pattern of mobilePatterns) {
      if (userAgent.includes(pattern)) {
        isBrowser = true;
        break;
      }
    }
    
    // Default to browser if it has typical browser characteristics
    if (hasHtmlAccept && !isRoblox) {
      isBrowser = true;
    }
    
    // ----- SERVE CONTENT BASED ON DETECTION -----
    if (isRoblox) {
      // Serve Lua file to Roblox
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(200).send(luaContent);
    } 
    else if (isBrowser) {
      // Redirect browsers to Discord
      res.setHeader("Location", "https://discord.gg/mW9MJnpUPj");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(302).send();
    }
    else {
      // Fallback for unknown clients - assume it's a script and serve Lua
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(luaContent);
    }
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
