import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // 🔹 Netlify에서 배포 시 경로 설정
  // 루트 도메인에서 바로 열고 싶으면 "/" 로 변경 가능
  base: "/redwhale-v4-new/",

  // 🔹 index.html이 프로젝트 루트에 있으므로 root를 현재 폴더로 설정
  root: ".",

  // 🔹 절대경로 alias 추가 (scss, js에서 "src/..."로 import 가능)
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },

  // 🔹 빌드 설정
  build: {
    outDir: "dist", // 빌드 결과물 위치
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // 루트 index.html
        button: path.resolve(__dirname, "src/components/button/button.html"), // 추가 데모 페이지
      },
    },
  },

  // 🔹 SCSS 설정
  css: {
    preprocessorOptions: {
      scss: {
        // src 밑 foundation/index.scss 를 전역으로 자동 import
        additionalData: `
          @use "src/foundation/index" as *;
        `,
      },
    },
  },
});
