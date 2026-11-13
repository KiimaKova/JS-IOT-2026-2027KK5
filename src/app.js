const http = require('http');
const url = require('url');
const fs = require('fs');

const app = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  const q = url.parse(req.url, true);

  if (q.pathname === '/calc') {
    const { operation, a, b } = q.query;
    const numA = Number(a);
    const numB = Number(b);
    let result;

    if (operation === 'add') {
      result = numA + numB;
    } else if (operation === 'sub') {
      result = numA - numB;
    } else if (operation === 'mul') {
      result = numA * numB;
    } else if (operation === 'div') {
      result = numA / numB;
    } else {
      res.statusCode = 400;
      return res.end('Operation unknown');
    }

    res.statusCode = 200;
    return res.end(String(result));
  }

  if (q.pathname === '/fs') {
    const { operation, filename, text } = q.query;

    if (operation === 'create') {
      fs.writeFileSync(filename, text || '');
      res.statusCode = 201;
      return res.end(`${filename} was created`);
    } else if (operation === 'read') {
      if (fs.existsSync(filename)) {
        const content = fs.readFileSync(filename, 'utf-8');
        res.statusCode = 201;
        return res.end(content);
      } else {
        res.statusCode = 400;
        return res.end('File not found');
      }
    } else {
      res.statusCode = 400;
      return res.end('Operation unknown');
    }
  }

  res.statusCode = 400;
  res.end('Operation unknown');
});

module.exports = app;
