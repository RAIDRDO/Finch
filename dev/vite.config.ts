import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),checker({typescript: true})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build:{
    assetsInlineLimit: 0,
    cssCodeSplit:false,
    outDir:"build",

    rollupOptions:{
      output:{
        manualChunks:undefined,
        inlineDynamicImports: true,
        entryFileNames:"static/js/main.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.split(".")[1] == "css" ) {
            return 'static/css/main.[ext]';
          } else {
            return 'static/media/[name].[ext]';
          }
        },
      }
    }
  }
})
