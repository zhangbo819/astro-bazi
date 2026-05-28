import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/Vue-Map/",
  base: "./", // 相对路径解决打包找不到资源的情况
  resolve: {
    // 设置别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()], // 按需加载
    }),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用,相当于开关在这里
      threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b，1b=8B, 1B=1024KB  那我们这里相当于 9kb多吧，就会压缩
      algorithm: "gzip", // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: ".gz", // 文件后缀
    }),
  ],
  server: {
    host: "127.0.0.1", // 这块必须得加否则无法热更新
    port: 8088, //启动端口
    hmr: {
      host: "127.0.0.1",
      port: 8088,
    },
    // // 设置 https 代理
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:9000",
    //     changeOrigin: true,
    //     // rewrite: (path: string) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
  build: {
    outDir: "dist", // 输出目录名
    // minify: "terser", // 压缩方式
    terserOptions: {
      // keep_fnames: true, // 打包后的仍保持原函数名，debug 用
      compress: {
        drop_console: true, // 剔除 console 和 debugger
        drop_debugger: true,
      },
    },
    // 分包
    rollupOptions: {
      output: {
        // 资源 分开放
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // 1. 这种方式将所有 node_modules 的包放在一个文件夹下，请求数最少，但更新一个会影响到整体 hash
            // return "vendor";
            // 2. 这种将所有的 node_modules 包单独打包，请求数会增多，但好处是单独请求，更新某一个不影响其他的
            return id
              .toString()
              .split("node_modules/.pnpm/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
