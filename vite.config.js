import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";;
import viteCompression from 'vite-plugin-compression';

import importToCDN from 'vite-plugin-cdn-import'
// https://vitejs.dev/config/
export default defineConfig({

  //   server:{
  // proxy:{
  //   '/authentication':{
  //     target:'https://ser-ihgj.onrender.com',
  //     changeOrigin:true
  //   }
  // }
  //   },
  plugins: [react(), commonjs(),
  viteCompression(),
  visualizer({
    gzipSize: true,
    brotliSize: true,
    emitFile: false,
    filename: "test.html",
    title: '打包分析3',
    open: true
  },
    importToCDN({
      modules: [
        {
          name: 'react',
          var: 'React',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js'
        },
        {
          name: 'moment',
          var: 'Moment',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js'
        },
        {
          name: 'react-dom',
          var: 'React-dom',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
        },
        {
          name: 'react-router-dom',
          var: 'React-router-dom',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.22.3/react-router-dom.production.min.js'
        },
        {
          name: 'chart',
          var: 'Chart',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js'
        },
        {
          name: 'react-data-table-component',
          var: 'React-data-table-component',
          path: 'https://cdn.jsdelivr.net/npm/react-data-table-component@7.6.2/dist/index.cjs.min.js'
        },
        {
          name: 'react-query',
          var: 'React-query',
          path: 'https://cdn.jsdelivr.net/npm/react-query@3.39.3/+esm'
        },
        {
          name: 'styled-components',
          var: 'Styled-components',
          path: 'https://cdn.jsdelivr.net/npm/styled-components@6.1.8/dist/styled-components.browser.cjs.min.js'
        },
        {
          name: "react-toastify",
          var: "react-toastify",
          path: "https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/react-toastify.min.js",
          css: "https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.min.css"
        }

      ]
    }))],
  resolve: {
    alias: {
      '@style': resolve(__dirname, 'src/assets/scss/style.module.scss'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@authentication': resolve(__dirname, 'src/Authentication'),
      '@context': resolve(__dirname, 'src/context'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@error': resolve(__dirname, 'src/Errors')

    },


  },
  esbuild: {
    drop: ["console", "debugger"]
  },

  build: {
    outDir: 'dist',

    rollupOptions: {

      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 让每个插件都打包成独立的文件
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },

      },
      input: resolve(__dirname, "index.html"),

      // external: ['react-dom', 'moment', 'react-router-dom', 'chart', 'react-query', 'styled-components', 'react-data-table-component'],
      // output: {
      //   paths: {
      //     moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js',
      //     "react-dom":'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
      //     "react-router-dom":'https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.22.3/react-router-dom.production.min.js',
      //     chart:'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js'
      //   }
      // }
    },
  },
  server: {
    open: true,
    hmr: true,
    host: true
  },

})
