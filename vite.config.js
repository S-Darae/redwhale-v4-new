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
        includePaths: [path.resolve(__dirname, "src")],
        additionalData: `
          @use "foundation/color" as *;
          @use "foundation/shadow" as *;
          @use "foundation/icon" as *;
          @use "foundation/index" as *;
        `,
      },
    },
  },
});
