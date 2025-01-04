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
              "default-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.google.com",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com https://apis.google.com https://accounts.google.com https://www.gstatic.com https://*.firebaseapp.com",
              "connect-src 'self' https://*.firebaseapp.com wss://*.firebaseio.com https://*.googleapis.com https://*.firebase.com https://accounts.google.com https://*.gstatic.com ws://localhost:* http://localhost:* http://localhost:3000",
              "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://apis.google.com",
              "img-src 'self' data: https: blob: https://*.google.com https://*.gstatic.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "form-action 'self' https://accounts.google.com https://*.google.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "media-src 'self' blob:",
              "manifest-src 'self'",
              "base-uri 'self'"
            ].join('; '),
          }
        ],
      },
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
