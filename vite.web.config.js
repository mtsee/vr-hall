import { defineConfig } from "vite";
import path from "path";
import vitePluginImp from "vite-plugin-imp";
const resolve = (url) => path.resolve(__dirname, url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginImp({
      libList: [
        {
          libName: "three",
          libDirectory: "src",
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
    outDir: "www",
    rollupOptions: {
      input: {
        main: resolve("index.html"),
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  base: "/", // 公共基础路径
});
