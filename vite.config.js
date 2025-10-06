import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/redwhale-v4-new/",
  root: ".",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        button: path.resolve(__dirname, "src/components/button/button.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "src/foundation/color" as *;
          @use "src/foundation/typography" as *;
          @use "src/foundation/shadow" as *;
          @use "src/foundation/icon" as *;
        `,
      },
    },
  },
});
