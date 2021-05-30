module.exports = {
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  webpack(config, { dev }) {
    // modify it!
    return config
  }
};