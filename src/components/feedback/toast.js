import "../button/button";
import "./toast.scss";

// ======================================================================
// 🍞 Toast Utility (토스트 알림 표시 함수)
// ----------------------------------------------------------------------
// ✅ 역할:
// - 화면 하단(또는 상단)에 잠시 표시되는 Toast 알림 메시지를 생성한다.
// - Snackbar보다 짧고 간단한 피드백에 사용된다.
// - undo / retry / custom 액션 버튼과 닫기 버튼을 포함할 수 있다.
// - 일정 시간(duration) 후 자동으로 사라진다.
// ----------------------------------------------------------------------
// ⚙️ 주요 인자:
// @param {string} message - 표시할 텍스트 메시지
// @param {Object} [options]
// @param {"undo"|"retry"|"custom"|null} [options.actionType=null] - 액션 버튼 타입
// @param {string|null} [options.buttonText=null] - custom 버튼 텍스트
// @param {number} [options.duration=3000] - 자동 제거까지 대기 시간(ms)
// ----------------------------------------------------------------------
// 🧩 Angular 변환 가이드
// 1️⃣ showToast() → ToastService.show({ message, actionType, buttonText })
// 2️⃣ DOM 조작 부분 → <app-toast> 컴포넌트 템플릿 렌더링으로 대체
// 3️⃣ container(#toast-container) → Angular Portal / Service Outlet로 변경
// 4️⃣ fade-in/out 애니메이션은 Angular Animation trigger로 전환
// 5️⃣ 클릭 이벤트(alert)는 Output EventEmitter(`(actionClick)`)로 연결
// ----------------------------------------------------------------------
// 📌 사용 예시:
// showToast("저장 완료!");
// showToast("저장 실패", { actionType: "retry" });
// showToast("삭제 취소", { actionType: "undo" });
// showToast("네트워크 오류", { actionType: "custom", buttonText: "다시 시도" });
// ======================================================================
export function showToast(message, options = {}) {
  const { actionType = null, buttonText = null, duration = 3000 } = options;

  /* =========================================================
     📦 컨테이너 생성 (없으면 동적으로 추가)
     ---------------------------------------------------------
     - 페이지 내 #toast-container 없을 경우 body 하단에 새로 추가
     ========================================================= */
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  /* =========================================================
     🧱 토스트 본체 생성
     ---------------------------------------------------------
     - 메시지 영역(toast__message)
     - 버튼 영역(toast__actions)
     ========================================================= */
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

  /* =========================================================
     🎛️ 액션 버튼 처리
     ---------------------------------------------------------
     - actionType 값에 따라 버튼 생성
       - undo / retry → 기본 버튼
       - custom → 사용자 지정 텍스트 버튼
     ========================================================= */
  if (actionType === "undo" || actionType === "retry") {
    // 실행 취소 / 재시도 버튼
    const actionBtn = document.createElement("button");
    actionBtn.className = "toast__action-btn";
    actionBtn.textContent = actionType === "undo" ? "실행 취소" : "재시도";
    actionWrap.appendChild(actionBtn);

    // 클릭 → 로딩 스피너 표시 후 자동 닫힘
    actionBtn.addEventListener("click", () => {
      clearTimeout(autoRemoveTimer);
      actionBtn.disabled = true;
      actionBtn.innerHTML = `
        ${actionBtn.textContent}
        <div class="toast__spinner"></div>
      `;
      setTimeout(() => toast.remove(), 1500);
    });
  }

  // --------------------------------------------------
  // (2) 커스텀 버튼
  // --------------------------------------------------
  else if (actionType === "custom" && buttonText) {
    const customBtn = document.createElement("button");
    customBtn.className = "toast__action-btn";
    customBtn.textContent = buttonText;
    actionWrap.appendChild(customBtn);

    // ⚙️ 기본 예시: alert 출력
    // Angular 변환 시 → Output EventEmitter('actionClick')
    customBtn.addEventListener("click", () => {
      alert(`👉 ${buttonText} 클릭`);
    });
  }

  /* =========================================================
     ❌ 닫기 버튼 (공통)
     ---------------------------------------------------------
     - 모든 토스트 우측에 표시되는 X 버튼
     - 클릭 시 즉시 제거
     ========================================================= */
  const closeBtn = document.createElement("button");
  closeBtn.className = "toast__close-btn";
  closeBtn.innerHTML = `<div class="icon--x icon"></div>`;
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoRemoveTimer);
    toast.remove();
  });
  actionWrap.appendChild(closeBtn);

  /* =========================================================
     🧩 구성 합치기 (message + actions)
     ========================================================= */
  toast.appendChild(msgWrap);
  toast.appendChild(actionWrap);
  container.appendChild(toast);

  /* =========================================================
     🎞️ 애니메이션 (fade-in)
     ---------------------------------------------------------
     - 약간의 지연 후 .show 클래스 추가
     - CSS transition에 따라 부드럽게 표시됨
     ========================================================= */
  setTimeout(() => toast.classList.add("show"), 50);

  /* =========================================================
     ⏰ 자동 제거 (duration 이후)
     ---------------------------------------------------------
     - 지정된 시간 후 DOM에서 제거
     - Angular에서는 RxJS timer() 기반으로 관리 가능
     ========================================================= */
  autoRemoveTimer = setTimeout(() => toast.remove(), duration);
}
