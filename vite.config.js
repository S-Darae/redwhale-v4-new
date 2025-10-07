import fg from "fast-glob";
import path from "path";
import { defineConfig } from "vite";

// ===============================
// 🔍 1️⃣ src 내부 모든 HTML 자동 탐색
// ===============================
const htmlFiles = fg.sync(["index.html", "src/**/*.html"]);

const input = Object.fromEntries(
  htmlFiles.map((file) => [
    path.basename(file, ".html"), // 파일 이름을 키로
    path.resolve(__dirname, file), // 절대경로로 변환
  ])
);

// ===============================
// 🚀 2️⃣ Vite Config
// ===============================
export default defineConfig({
  base: "/", // Netlify용 절대경로
  root: ".", // 프로젝트 루트
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@component-pages": path.resolve(__dirname, "src/component-pages"),
      "@foundation": path.resolve(__dirname, "src/foundation"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input, // ✅ 자동 등록된 HTML 엔트리들
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // ✅ Foundation index를 전역으로 자동 import
        additionalData: `
          @use "src/foundation/index" as *;
        `,
      },
    },
  },
});
