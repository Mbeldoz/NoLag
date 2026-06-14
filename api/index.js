
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  const isScript = !userAgent.includes('Mozilla') || userAgent.includes('Roblox');

  if (isScript) {

    const fs = require('fs');
    const path = require('path');
    const luaContent = fs.readFileSync(path.join(process.cwd(), 'script.lua'), 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaContent);
  } else {

    const html = `<!DOCTYPE html>
    <html>
    <head><title>nolag.wtf</title></head>
    <body>
      <h1>This is not a Lua script endpoint</h1>
      <p>If you're a human, go away. If you're a script, use the correct URL.</p>
    </body>
    </html>`;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  }
}
