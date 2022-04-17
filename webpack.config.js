const path = require('path');

module.exports = {
  entry: './public/js/index.js',
  output: {
      path: path.resolve(__dirname, 'public/js/dist'),
      filename: 'bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  watch: true,
};
