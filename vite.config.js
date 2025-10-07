import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  root: ".",
  resolve: {
    alias: { src: path.resolve(__dirname, "src") },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        button: path.resolve(__dirname, "src/components/button/button.html"),
        componentPageMenu: path.resolve(__dirname, "src/component-pages/common/menu.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `` },
    },
  },
});
