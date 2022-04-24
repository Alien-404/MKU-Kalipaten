const path = require('path');

module.exports = {
  entry: './controller/sensors/webpack-firedb.js',
  output: {
      path: path.resolve(__dirname, 'public/js/dist'),
      filename: 'bundle.js'
  },
  mode: 'production',
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  watch: true,
};
