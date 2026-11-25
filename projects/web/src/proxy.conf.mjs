// See the proxy configuration https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
export default [
    {
        context: ['/api'],

        // NetForge demo host. The admin panel API lives under `/admin/api`.
        target: 'https://localhost:5001',
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        pathRewrite: {
            '^/api': '/admin/api',
        },
    },
];
