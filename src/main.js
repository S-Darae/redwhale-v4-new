// ==============================
// 🧱 Redwhale V4 Main Entry
// ------------------------------
// - Vite가 가장 먼저 불러오는 엔트리 파일
// - 전역 스타일 및 기본 설정을 import
// - 공통 초기화 스크립트 실행 위치
// ==============================

// ✅ 전역 SCSS (foundation 전체)
import "./foundation/_index.scss";

// ✅ (선택) 공통 모듈 초기화 코드가 있다면 여기에
// import "./modules/init.js";

// ✅ 콘솔 확인용
console.log("✅ Redwhale V4 loaded successfully");
