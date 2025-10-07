import "../button/button";
import "./toast.scss";

/**
 * 토스트(Toast) 메시지를 화면에 표시
 * @param {string} message - 표시할 텍스트 메시지
 * @param {Object} [options]
 * @param {"undo"|"retry"|"custom"|null} [options.actionType=null] - 액션 버튼 타입
 * @param {string|null} [options.buttonText=null] - actionType이 "custom"일 때 버튼 텍스트
 * @param {number} [options.duration=3000] - 자동 제거까지 대기 시간(ms)
 *
 * @example
 * showToast("저장 완료!");
 * showToast("저장 실패", { actionType: "retry" });
 * showToast("삭제 취소", { actionType: "undo" });
 * showToast("네트워크 오류", { actionType: "custom", buttonText: "다시 시도" });
 */
export function showToast(message, options = {}) {
  const { actionType = null, buttonText = null, duration = 3000 } = options;

  /* ==========================
     컨테이너 생성 (없으면 추가)
     ========================== */
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  /* ==========================
     토스트 본체 생성
     ========================== */
  const toast = document.createElement("div");
  toast.className = "toast";

  // 메시지 영역
  const msgWrap = document.createElement("div");
  msgWrap.className = "toast__message";
  msgWrap.textContent = message;

  // 액션 버튼 영역
  const actionWrap = document.createElement("div");
  actionWrap.className = "toast__actions";

  // 자동 제거 타이머 핸들러
  let autoRemoveTimer;

  /* ==========================
     액션 버튼 처리
     ========================== */
  if (actionType === "undo" || actionType === "retry") {
    // 실행 취소 / 재시도
    const actionBtn = document.createElement("button");
    actionBtn.className = "toast__action-btn";
    actionBtn.textContent = actionType === "undo" ? "실행 취소" : "재시도";
    actionWrap.appendChild(actionBtn);

    // 클릭 → 스피너 표시 후 자동 닫힘
    actionBtn.addEventListener("click", () => {
      clearTimeout(autoRemoveTimer);
      actionBtn.disabled = true;
      actionBtn.innerHTML = `
        ${actionBtn.textContent}
        <div class="toast__spinner"></div>
      `;
      setTimeout(() => toast.remove(), 1500);
    });
  } else if (actionType === "custom" && buttonText) {
    // 커스텀 버튼
    const customBtn = document.createElement("button");
    customBtn.className = "toast__action-btn";
    customBtn.textContent = buttonText;
    actionWrap.appendChild(customBtn);

    // 클릭 → 원하는 동작 실행 (예: alert)
    customBtn.addEventListener("click", () => {
      alert(`👉 ${buttonText} 클릭`);
    });
  }

  /* ==========================
     닫기 버튼 (공통)
     ========================== */
  const closeBtn = document.createElement("button");
  closeBtn.className = "toast__close-btn";
  closeBtn.innerHTML = `<div class="icon--x icon"></div>`;
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoRemoveTimer);
    toast.remove();
  });
  actionWrap.appendChild(closeBtn);

  /* ==========================
     합치기
     ========================== */
  toast.appendChild(msgWrap);
  toast.appendChild(actionWrap);
  container.appendChild(toast);

  /* ==========================
     애니메이션 (fade-in)
     ========================== */
  setTimeout(() => toast.classList.add("show"), 50);

  /* ==========================
     자동 제거 (duration 이후)
     ========================== */
  autoRemoveTimer = setTimeout(() => toast.remove(), duration);
}
