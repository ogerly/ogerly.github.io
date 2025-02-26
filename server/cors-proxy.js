const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS unterstützen
app.use(cors());

// Proxy middleware für RSS-Feed
app.use('/rss', createProxyMiddleware({
  target: 'https://imsumpf.blogspot.com',
  changeOrigin: true,
  pathRewrite: {
    '^/rss': '/feeds/posts/default?alt=rss'
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Server starten
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CORS Proxy läuft auf http://localhost:${port}`);
  console.log(`RSS Feed erreichbar unter: http://localhost:${port}/rss`);
});
