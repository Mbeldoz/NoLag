import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";

  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);
  if (!success) {
    return res.status(429).send("Too many requests. Try again later.");
  }

  const userAgent = req.headers["user-agent"] || "";
  const isRoblox = userAgent.includes("Roblox");
  const isBrowser = userAgent.includes("Mozilla") && !isRoblox;

  if (isRoblox) {
    try {
      const luaPath = path.join(process.cwd(), "script.lua");
      const luaContent = fs.readFileSync(luaPath, "utf8");

      res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(luaContent);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  } 
  else if (isBrowser) {
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>nolag.wtf</title>
      <style>body{font-family:sans-serif;text-align:center;padding:2rem}</style>
    </head>
    <body>
      <h1>Nothing to see here</h1>
      <p>This domain is used for a Roblox script. If you are a human, please move along.</p>
    </body>
    </html>`;
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } 
  else {
    return res.status(403).send("Forbidden: This endpoint is for Roblox only.");
  }
}
