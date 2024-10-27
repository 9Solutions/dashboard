const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            target: 'http://3.235.132.240:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/lambda-services',
        createProxyMiddleware({
            target: 'https://f9zmnx2q3a.execute-api.us-east-1.amazonaws.com',
            changeOrigin: true,
        })
    );
};