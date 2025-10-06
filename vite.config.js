import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages 배포용 base 경로 (레포 이름과 정확히 일치해야 함)
  base: "/redwhale-v4-new/",

  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // 메인 엔트리
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "foundation/typography" as *;
          @use "foundation/color" as *;
          @use "foundation/shadow" as *;
          @use "foundation/icon" as *;
        `,
        includePaths: [path.resolve(__dirname, ".")],
      },
    },
  },

  server: {
    open: true, // npm run dev 시 자동 브라우저 열림
    port: 5173,
  },
});
