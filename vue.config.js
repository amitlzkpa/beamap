module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                ws: true,
                changeOrigin: true,
                progress: false
            }
        }
    },

    configureWebpack: {
        devtool: 'source-map',
    },

    assetsDir: 'static'
}