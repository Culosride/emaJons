const nodeExternals = require("webpack-node-externals")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const typicalReact = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"]
        }
      }
    },
    {
      test: /\.s(a|c)ss$/,
      use: [
        process.env.NODE_ENV !== "production"
          ? "style-loader"
          : MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            modules: true
          },
        },
          "sass-loader",
      ],
    }
  ],
}

const clientConfig = {
  entry: "/src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js"
  },
  mode: "development",
  module: typicalReact,
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
    },
    extensions: ['.jsx', '.js', ".scss"],
  }
}

const serverConfig = {
  entry: "./server.js",
  output: {
    path: __dirname,
    filename: "server-compiled.js"
  },
  externals: [nodeExternals()],
  target: "node",
  mode: "production",
  module: typicalReact,
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
}


module.exports = [clientConfig, serverConfig]
