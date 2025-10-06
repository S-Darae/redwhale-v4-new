import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/redwhale-v4-new/",
  root: "src", // ✅ src 폴더를 루트로 인식하게 설정
  build: {
    outDir: "../dist", // ✅ 빌드 결과물이 dist로 나가게
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.html"), // 루트 index.html
        button: path.resolve(__dirname, "src/components/button/button.html"), // 버튼 데모
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "foundation/index" as *;
        `,
      },
    },
  },
});
