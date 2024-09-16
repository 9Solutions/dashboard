const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            target: 'http://192.168.15.56:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/node-api',
        createProxyMiddleware({
            target: 'http://192.168.15.56:9999',
            changeOrigin: true,
        })
    );
};