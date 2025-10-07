import { showSnackbar } from "./snackbar.js";
import { showToast } from "./toast.js";

/**
 * 페이지 내 [data-snackbar], [data-toast] 버튼을 찾아
 * 클릭 이벤트를 바인딩하고, 알맞은 Snackbar / Toast 알림을 띄워준다.
 *
 * 👉 사용법:
 * <button
 *   data-snackbar="저장 완료"
 *   data-snackbar-type="success"
 *   data-action="undo">
 *   스낵바 버튼
 * </button>
 *
 * <button
 *   data-toast="삭제되었습니다."
 *   data-action="custom"
 *   data-button-text="되돌리기">
 *   토스트 버튼
 * </button>
 */
export function initializeFeedback() {
  /* ==========================
     Snackbar 초기화
     ========================== */
  document.querySelectorAll("[data-snackbar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // dataset 속성 값 추출
      const type = btn.dataset.snackbarType || "info";
      // caution | error | success | info
      const message = btn.dataset.snackbar || "기본 메시지";
      const actionType = btn.dataset.action || null;
      // undo | retry | custom
      const buttonText = btn.dataset.buttonText || null;

      // Snackbar 표시
      showSnackbar(type, message, {
        actionType,
        buttonText,
        // custom 버튼일 경우 onButtonClick 전달
        onButtonClick:
          actionType === "custom" && buttonText
            ? () => alert(`👉 ${buttonText} 클릭`)
            : null,
      });
    });
  });

  /* ==========================
     Toast 초기화
     ========================== */
  document.querySelectorAll("[data-toast]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // dataset 속성 값 추출
      const message = btn.dataset.toast || "토스트 메시지";
      const actionType = btn.dataset.action || null;
      // undo | retry | custom
      const buttonText = btn.dataset.buttonText || null;

      // Toast 표시
      showToast(message, {
        actionType,
        buttonText,
      });
    });
  });
}

/* ==========================
   페이지 로드 시 자동 초기화
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  initializeFeedback();
});
