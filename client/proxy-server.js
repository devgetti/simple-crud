var http = require('http');
var httpProxy = require('http-proxy');

httpProxy.createServer({
  changeOrigin: true,
  hostRewrite: true,
  autoRewrite: true,
  ws: true,
  target: 'http://localhost:3000'
}).listen(process.env.PORT || 3002);