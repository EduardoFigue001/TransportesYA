// custom-webpack.config.js
const webpack = require('webpack');

module.exports = {
  // Ajustes de resolución para módulos nativos de Node que quieras usar en el navegador.
  resolve: {
    fallback: {
      // Para usar 'crypto' en el navegador
      crypto: require.resolve('crypto-browserify'),
      // Para 'stream'
      stream: require.resolve('stream-browserify'),
      // Para 'assert'
      assert: require.resolve('assert'),
      // Para 'http'
      http: require.resolve('stream-http'),
      // Para 'https'
      https: require.resolve('https-browserify'),
      // Para 'os'
      os: require.resolve('os-browserify/browser'),
     
    },
  },
  plugins: [
    // Provee variables globales como process y Buffer en el navegador
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),

    // Si deseas inyectar variables de entorno, podrías usar DefinePlugin:
    // new webpack.DefinePlugin({
    //   'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // }),

    // Otros plugins que necesites
  ],
};
