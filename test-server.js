const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>Test Server Works!</h1>
        <p>URL: ${req.url}</p>
        <p>Method: ${req.method}</p>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
});