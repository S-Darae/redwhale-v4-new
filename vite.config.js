import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/redwhale-v4-new/",
  root: ".", // ✅ 루트를 현재 폴더로 변경
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});
