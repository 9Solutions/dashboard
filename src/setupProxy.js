const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            target: 'http://192.168.56.1:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/lambda-services',
        createProxyMiddleware({
            target: 'https://1cj3hzfx8k.execute-api.us-east-1.amazonaws.com',
            changeOrigin: true,
        })
    );
};