module.exports = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: "empty"
    };
    config.module.rules.push({
      test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file-loader",
      exclude: [/node_modules/, /lib/],
      options: {
        name: "[name].[ext]",
        outputPath: "static/fonts/"
      }
    });

    // config.module.rules.push({
    //             test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    //             use: [{
    //                 loader: 'file-loader',
    //                 options: {
    //                     name: '[name].[ext]',
    //                     outputPath: 'static/fonts/'
    //                 }
    //             }]
    //         });
    return config;
  }
};
