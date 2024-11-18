// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 'global' 모듈을 브라우저에서 사용할 수 있도록 설정
      global: "global/window",
    },
  },
  server: {
    https: false, // HTTPS 비활성화
  },
  define: {
    // 'globalThis'는 브라우저 환경에서 'global'을 대체하는 객체
    global: "globalThis",
  },
});
