import { showSnackbar } from "./snackbar.js";
import { showToast } from "./toast.js";

// ======================================================================
// 🔔 Feedback Initialization (Snackbar & Toast 초기화 모듈)
// ----------------------------------------------------------------------
// ✅ 역할:
// - 페이지 내 모든 [data-snackbar], [data-toast] 버튼을 자동 탐색하여
//   클릭 시 Snackbar 또는 Toast 알림을 표시한다.
// - 알림 타입(type), 액션(actionType), 버튼 텍스트(buttonText) 등은
//   각 버튼의 data-* 속성을 통해 동적으로 지정 가능하다.
// ----------------------------------------------------------------------
// 🧩 Angular 변환 가이드
// 1️⃣ showSnackbar(), showToast() → FeedbackService로 통합 관리
//     → `this.feedbackService.showSnackbar({ type, message, action })`
//     → `this.feedbackService.showToast({ message, action })`
// 2️⃣ data-* 속성 바인딩 → `[attr.data-snackbar]` or `@Input()`로 변경
// 3️⃣ initializeFeedback() → `FeedbackDirective`로 변환
//     → 각 버튼에 `appFeedbackTrigger` 디렉티브를 적용
// 4️⃣ DOMContentLoaded 초기화 → `ngAfterViewInit`로 대체
// ----------------------------------------------------------------------
// 📌 지원하는 옵션 요약:
// data-snackbar        : 표시할 스낵바 메시지
// data-snackbar-type   : 스낵바 타입 (info | success | caution | error)
// data-toast           : 표시할 토스트 메시지
// data-action          : 액션 버튼 타입 (undo | retry | custom)
// data-button-text     : custom 액션 버튼 표시 텍스트
// ======================================================================

export function initializeFeedback() {
  /* =========================================================
     🧱 Snackbar 초기화
     ---------------------------------------------------------
     - data-snackbar 속성이 있는 모든 버튼에 클릭 이벤트 등록
     - 클릭 시 showSnackbar() 호출
     - data 속성 기반으로 알림 메시지/타입/액션 설정
     ---------------------------------------------------------
     ✅ Angular 변환 시:
        - (click)="feedbackService.showSnackbar({ type, message, action })"
  ========================================================= */
  document.querySelectorAll("[data-snackbar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // dataset 속성 값 추출
      const type = btn.dataset.snackbarType || "info"; // caution | error | success | info
      const message = btn.dataset.snackbar || "기본 메시지";
      const actionType = btn.dataset.action || null; // undo | retry | custom
      const buttonText = btn.dataset.buttonText || null;

      // Snackbar 표시
      showSnackbar(type, message, {
        actionType,
        buttonText,
        // custom 버튼 클릭 시 핸들러
        onButtonClick:
          actionType === "custom" && buttonText
            ? () => alert(`👉 ${buttonText} 클릭`)
            : null,
      });
    });
  });

  /* =========================================================
     🧱 Toast 초기화
     ---------------------------------------------------------
     - data-toast 속성이 있는 모든 버튼에 클릭 이벤트 등록
     - 클릭 시 showToast() 호출
     - data-action 및 data-button-text를 옵션으로 전달
     ---------------------------------------------------------
     ✅ Angular 변환 시:
        - (click)="feedbackService.showToast({ message, action })"
  ========================================================= */
  document.querySelectorAll("[data-toast]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // dataset 속성 값 추출
      const message = btn.dataset.toast || "토스트 메시지";
      const actionType = btn.dataset.action || null; // undo | retry | custom
      const buttonText = btn.dataset.buttonText || null;

      // Toast 표시
      showToast(message, {
        actionType,
        buttonText,
      });
    });
  });
}

/* =========================================================
   🚀 페이지 로드 시 자동 초기화
   ---------------------------------------------------------
   - DOMContentLoaded 이벤트 발생 시 initializeFeedback() 호출
   - 정적 페이지 또는 SPA 초기 구동 시점에서 자동 등록됨
   ---------------------------------------------------------
   ✅ Angular 변환 시:
      - ngAfterViewInit() { this.feedbackService.bindFeedbackTriggers(); }
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initializeFeedback();
});
