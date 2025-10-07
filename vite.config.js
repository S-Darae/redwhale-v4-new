import fg from "fast-glob";
import path from "path";
import { defineConfig } from "vite";

// ===============================
// 🔍 1️⃣ src 내부 모든 HTML 자동 탐색
// ===============================
const htmlFiles = fg.sync(["index.html", "src/**/*.html"]);

const input = Object.fromEntries(
  htmlFiles.map((file) => [
    // 파일 이름을 키로 (예: button, menu, index 등)
    path.basename(file, ".html"),
    path.resolve(__dirname, file),
  ])
);

// ===============================
// 🚀 2️⃣ Vite Config
// ===============================
export default defineConfig({
  base: "/", // Netlify용 — 절대경로
  root: ".", // 루트 기준 현재 폴더
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
});
