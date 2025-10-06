import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // 🚨 수정: Netlify는 서브 경로를 사용하지 않으므로, base를 루트 경로 '/'로 되돌립니다.
  base: "/",
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
        // additionalData 제거는 모듈 루프 해결을 위해 유지합니다.
        additionalData: ``,
      },
    },
  },
});
