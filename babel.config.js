module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        root: ["./"],
        alias: {
          "^~(.+)": "./src/\\1",
          tests: "./__tests__",
          assets: "./assets",
        },
      },
    ],
  ],
};
