const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'promptsforeveryone.vercel.app'],
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com https://apis.google.com https://accounts.google.com https://www.gstatic.com https://*.firebaseapp.com https://*.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://lh3.googleusercontent.com https://api.producthunt.com",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src 'self' https://*.firebaseapp.com https://*.stripe.com",
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com https://*.stripe.com https://*.google-analytics.com"
            ].join('; ')
          }
        ]
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
