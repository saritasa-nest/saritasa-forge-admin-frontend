// See the proxy configuration https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
export default [
	{
		context: ['/api'],

		// TODO (Template): Replace this placeholder with your backend target.
		target: 'https://api.example.com',
		secure: false,
		changeOrigin: true,
		cookieDomainRewrite: 'localhost',
	},
	{
		context: ['/hubs'],

		// TODO (Template): Replace this placeholder with your backend target.
		target: 'https://api.example.com',
		secure: false,
		changeOrigin: true,
		ws: true,
		cookieDomainRewrite: 'localhost',
	},
];
