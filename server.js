const https = require('https');
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'POST' && req.url === '/api') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        }
      };
      const preq = https.request(options, pres => {
        let data = '';
        pres.on('data', d => data += d);
        pres.on('end', () => { res.writeHead(200, {'Content-Type':'application/json'}); res.end(data); });
      });
      preq.write(body);
      preq.end();
    });
  } else {
    res.writeHead(404); res.end();
  }
});

server.listen(process.env.PORT || 10000, '0.0.0.0');
