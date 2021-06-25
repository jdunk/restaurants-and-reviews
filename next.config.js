module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:any*',
          destination: '/',
        },
      ]
    };
  },
  webpack(config, { dev }) {
    // modify it!
    return config
  }
};