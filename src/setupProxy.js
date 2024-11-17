const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            target: 'http://10.0.0.164:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/lambda-services',
        createProxyMiddleware({
            target: 'https://pk0cpzwo89.execute-api.us-east-1.amazonaws.com',
            changeOrigin: true,
        })
    );
};