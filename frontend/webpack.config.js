const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        REACT_APP_GOOGLE_MAPS_API_KEY: JSON.stringify(
          process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
            "AIzaSyC_M4bm9U_MZgTZcvpZ6Lo9IZXWTzzsWps"
        ),
      },
    }),
  ],
};
