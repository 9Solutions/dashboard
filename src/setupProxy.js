const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/java-api',
        createProxyMiddleware({
            //10.0.0.164
            target: 'http://10.0.0.176:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/lambda-services',
        createProxyMiddleware({
            target: 'https://3w3cti31mk.execute-api.us-east-1.amazonaws.com',
            changeOrigin: true,
        })
    );
};
