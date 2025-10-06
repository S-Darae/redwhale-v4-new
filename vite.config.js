import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/redwhale-v4-new/",
  root: ".", // ✅ 루트는 현재 폴더
  build: {
    outDir: "dist", // ✅ dist 폴더는 루트 바로 아래로 생성
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // ✅ 루트 기준으로 변경
        button: path.resolve(__dirname, "src/components/button/button.html"), // 예시
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "src/foundation/index" as *;
        `,
      },
    },
  },
});
