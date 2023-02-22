import { defineConfig } from "vite";
import path from "path";
import { viteExternalsPlugin } from "vite-plugin-externals";
// import vitePluginImp from "vite-plugin-imp";
const resolve = (url) => path.resolve(__dirname, url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins:
    process.env.NODE_ENV === "production"
      ? [
          viteExternalsPlugin({
            three: "THREE",
          }),
        ]
      : [],
  css: {
    modules: {
      generateScopedName: "[name]__[local]__[hash:5]",
    },
    preprocessorOptions: {
      less: {
        // 支持内联 javascript
        javascriptEnabled: true,
      },
    },
  },
  // 入口
  build: {
    lib: {
      entry: resolve("src/vrhall/index.js"),
      name: "VRHall",
      fileName: (format) => `lib/vrhall.${format}.js`,
    },
  },
  base: "/", // 公共基础路径
  server: {
    host: "0.0.0.0",
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "https://www.h5ds.com",
    //     changeOrigin: true,
    //   },
    // },
  },
});
