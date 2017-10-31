module.exports = {
    entry: './client/index.tsx',
    output: {
      filename: './public/dist/bundle.js'
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { 
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }
      ]
    }
  }