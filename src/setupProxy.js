const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            target: 'http://26.68.212.183:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/node-api',
        createProxyMiddleware({
            target: 'http://26.68.212.183:9999',
            changeOrigin: true,
        })
    );
};