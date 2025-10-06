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
        // 🚨 중요: additionalData 내용을 제거하여 _index.scss 파일에
        // 자기 자신을 @use 하는 구문이 강제로 주입되는 것을 막습니다.
        // 이로써 무한 모듈 루프(Module loop) 문제를 해결합니다.
        // 참고: 이제 다른 SCSS 파일에서 Foundation 요소를 사용하려면
        // 해당 파일 상단에 @use "src/foundation/index" as *; 를 수동으로 추가해야 합니다.
        additionalData: ``, 
      },
    },
  },
});
