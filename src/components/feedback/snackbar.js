import "../button/button";
import "./snackbar.scss";

/**
 * 스낵바 표시 함수
 * @param {string} type - 스낵바 타입 ("success" | "error" | "caution" | "info")
 * @param {string} message - 표시할 메시지 텍스트
 * @param {Object} [options]
 * @param {string|null} [options.buttonText=null] - actionType이 "custom"일 때 표시할 버튼 텍스트
 * @param {string|null} [options.actionType=null] - 버튼 동작 타입 ("undo" | "retry" | "custom")
 * @param {number} [options.duration=3000] - 자동 제거까지 대기 시간(ms)
 *
 * @example
 * showSnackbar("success", "저장되었습니다.");
 * showSnackbar("error", "저장 실패!", { actionType: "retry" });
 * showSnackbar("info", "다시 실행하시겠습니까?", { actionType: "custom", buttonText: "확인" });
 */
export function showSnackbar(type, message, options = {}) {
  const { buttonText = null, actionType = null, duration = 3000 } = options;
  const container = document.getElementById("snackbar-container");

  // 스낵바 컨테이너 필수
  if (!container) {
    console.warn("⚠️ snackbar-container가 존재하지 않습니다.");
    return;
  }

  // 스낵바 요소 생성
  const snackbar = document.createElement("div");
  snackbar.className = `snackbar ${type}`;

  /* ==========================
     아이콘 설정 (type별)
     ========================== */
  let iconClass = "";
  if (type === "caution") iconClass = "icon--warning";
  if (type === "error") iconClass = "icon--warning";
  if (type === "success") iconClass = "icon--check";
  if (type === "info") iconClass = "icon--info";

  /* ==========================
     본문 (아이콘 + 메시지)
     ========================== */
  const content = document.createElement("div");
  content.className = "snackbar__content";
  content.innerHTML = `<div class="${iconClass} icon"></div><span>${message}</span>`;

  /* ==========================
     tailing (버튼 + 닫기)
     ========================== */
  const tailing = document.createElement("div");
  tailing.className = "snackbar__tailing";

  // (1) 실행 취소 / 재시도 버튼
  if (actionType === "undo" || actionType === "retry") {
    const actionBtn = document.createElement("button");
    actionBtn.className =
      "btn btn--outlined btn--neutral btn--small snackbar-btn";
    actionBtn.textContent = actionType === "undo" ? "실행 취소" : "재시도";
    tailing.appendChild(actionBtn);

    // 버튼 클릭 시 → 로딩 스피너 표시 후 자동 닫힘
    actionBtn.addEventListener("click", () => {
      actionBtn.disabled = true;
      actionBtn.innerHTML = `
        ${actionBtn.textContent}
        <div class="snackbar__spinner"></div>
      `;
      setTimeout(() => snackbar.remove(), 1500);
    });
  }
  // (2) 커스텀 버튼
  else if (actionType === "custom" && buttonText) {
    const customBtn = document.createElement("button");
    customBtn.className =
      "btn btn--outlined btn--neutral btn--small snackbar-btn";
    customBtn.textContent = buttonText;
    tailing.appendChild(customBtn);

    // 예시: 커스텀 버튼 클릭 시 알림
    customBtn.addEventListener("click", () => {
      alert(`👉 ${buttonText} 클릭`);
    });
  }

  // (3) 닫기 버튼 (공통)
  const closeBtn = document.createElement("button");
  closeBtn.className = "btn--icon-utility snackbar__close-btn";
  closeBtn.innerHTML = `<div class="icon--x icon"></div>`;
  closeBtn.addEventListener("click", () => snackbar.remove());
  tailing.appendChild(closeBtn);

  // === 합치기 ===
  snackbar.appendChild(content);
  snackbar.appendChild(tailing);
  container.appendChild(snackbar);

  /* ==========================
     애니메이션 (fade-in)
     ========================== */
  setTimeout(() => snackbar.classList.add("show"), 50);

  /* ==========================
     자동 제거 (duration 이후)
     ========================== */
  setTimeout(() => snackbar.remove(), duration);
}
