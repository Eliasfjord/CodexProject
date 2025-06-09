const http = require('http');
const fs = require('fs');
const path = require('path');

function express() {
  const middlewares = [];
  const routes = { GET: [], POST: [] };

  const app = {};

  app.use = (mw) => {
    middlewares.push(mw);
  };

  app.get = (route, handler) => {
    routes.GET.push([route, handler]);
  };

  app.post = (route, handler) => {
    routes.POST.push([route, handler]);
  };

  app.listen = (port, cb) => {
    const server = http.createServer((req, res) => {
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (obj) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
      };

      let idx = 0;
      function next() {
        const mw = middlewares[idx++];
        if (mw) return mw(req, res, next);
        dispatch();
      }

      function dispatch() {
        const url = req.url.split('?')[0];
        const handlers = routes[req.method] || [];
        for (const [route, handler] of handlers) {
          if (route === url) return handler(req, res);
        }
        res.status(404).end('Not Found');
      }

      next();
    });
    return server.listen(port, cb);
  };

  return app;
}

express.static = function(root) {
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    let filePath = req.url.split('?')[0];
    if (filePath === '/' || filePath === '') filePath = '/Index.html';
    const fullPath = path.join(root, filePath);
    fs.readFile(fullPath, (err, data) => {
      if (err) return next();
      res.status(200);
      res.end(data);
    });
  };
};

express.json = function() {
  return (req, res, next) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      if (data) {
        try {
          req.body = JSON.parse(data);
        } catch (e) {
          res.status(400).end('Invalid JSON');
          return;
        }
      }
      next();
    });
  };
};

module.exports = express;
