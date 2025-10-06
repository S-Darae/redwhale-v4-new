import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.html"),
        button: path.resolve(__dirname, "src/components/button/button.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "foundation/index" as *;` },
    },
  },
});
