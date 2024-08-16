const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    library: "helloWorld",
    path: path.resolve(__dirname, 'dist'),
  },
};
