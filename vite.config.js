import { defineConfig } from "vite";
import path from "path";
import vitePluginImp from "vite-plugin-imp";

//@ts-ignore
const resolve = (url) => path.resolve(__dirname, url);
// import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [
    vitePluginImp({
      libList: [
        {
          libName: "three",
          libDirectory: "",
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
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
      entry: resolve("src/VRHall.js"),
      name: "vrHall",
      fileName: (format) => `core/vrHall.${format}.js`,
    },
    rollupOptions: {
      input: {
        main: resolve("index.html"),
      },
    },
  },
  base: "/", // 公共基础路径
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "https://www.h5ds.com",
        changeOrigin: true,
      },
    },
  },
});
