import "../button/button.js";
import "./snackbar.scss";

// ======================================================================
// 🍞 Snackbar Utility (스낵바 표시 함수)
// ----------------------------------------------------------------------
// ✅ 역할:
// - 화면 하단에 일시적으로 메시지를 표시하는 Snackbar를 생성한다.
// - 타입(success/error/caution/info)에 따라 아이콘/스타일이 달라진다.
// - undo / retry / custom 등의 액션 버튼을 옵션으로 추가할 수 있다.
// - 자동 사라짐(duration) 및 수동 닫기 기능을 포함한다.
// ----------------------------------------------------------------------
// ⚙️ 주요 인자:
// @param {string} type           - 스낵바 타입 ("success" | "error" | "caution" | "info")
// @param {string} message        - 표시할 텍스트 메시지
// @param {Object} [options]      - 추가 옵션
// @param {string|null} [options.buttonText=null] - custom 버튼 텍스트
// @param {string|null} [options.actionType=null] - 버튼 동작 ("undo" | "retry" | "custom")
// @param {number} [options.duration=3000]        - 자동 제거까지 대기 시간(ms)
// ----------------------------------------------------------------------
// 🧩 Angular 변환 가이드
// 1️⃣ showSnackbar() → SnackbarService.show({ type, message, options })
// 2️⃣ Snackbar DOM 생성 → <app-snackbar> 컴포넌트 템플릿으로 대체
// 3️⃣ container(#snackbar-container) → Angular CDK PortalOutlet 사용
// 4️⃣ 애니메이션은 Angular Animation (fadeIn / fadeOut)으로 대체
// 5️⃣ 버튼 클릭 이벤트(alert 등)는 Output EventEmitter로 처리
// ----------------------------------------------------------------------
// 📌 사용 예시:
// showSnackbar("success", "저장되었습니다.");
// showSnackbar("error", "저장 실패!", { actionType: "retry" });
// showSnackbar("info", "다시 실행하시겠습니까?", { actionType: "custom", buttonText: "확인" });
// ======================================================================
export function showSnackbar(type, message, options = {}) {
  const { buttonText = null, actionType = null, duration = 3000 } = options;
  const container = document.getElementById("snackbar-container");

  // --------------------------------------------------
  // 📌 필수 요소 확인
  // - 스낵바가 표시될 컨테이너(#snackbar-container)가 없으면 경고 출력
  // --------------------------------------------------
  if (!container) {
    console.warn("⚠️ snackbar-container가 존재하지 않음");
    return;
  }

  // --------------------------------------------------
  // 🧱 스낵바 요소 생성
  // --------------------------------------------------
  const snackbar = document.createElement("div");
  snackbar.className = `snackbar ${type}`;

  /* =========================================================
     🎨 아이콘 설정 (type별)
     ---------------------------------------------------------
     - caution | error → warning 아이콘
     - success → check 아이콘
     - info → info 아이콘
     ========================================================= */
  let iconClass = "";
  if (type === "caution") iconClass = "icon--warning";
  if (type === "error") iconClass = "icon--warning";
  if (type === "success") iconClass = "icon--check";
  if (type === "info") iconClass = "icon--info";

  /* =========================================================
     🧩 본문 영역 (아이콘 + 메시지)
     ---------------------------------------------------------
     - snackbar__content 내부에 아이콘 + 메시지 텍스트 구성
     ========================================================= */
  const content = document.createElement("div");
  content.className = "snackbar__content";
  content.innerHTML = `<div class="${iconClass} icon"></div><span>${message}</span>`;

  /* =========================================================
     🎛️ tailing 영역 (버튼 + 닫기 버튼)
     ---------------------------------------------------------
     - undo / retry / custom 액션 버튼
     - 닫기(x) 버튼은 항상 표시됨
     ========================================================= */
  const tailing = document.createElement("div");
  tailing.className = "snackbar__tailing";

  // --------------------------------------------------
  // (1) 실행 취소 / 재시도 버튼
  // --------------------------------------------------
  if (actionType === "undo" || actionType === "retry") {
    const actionBtn = document.createElement("button");
    actionBtn.className =
      "btn btn--outlined btn--neutral btn--small snackbar-btn";
    actionBtn.textContent = actionType === "undo" ? "실행 취소" : "재시도";
    tailing.appendChild(actionBtn);

    // 버튼 클릭 시 → 로딩 스피너 표시 후 자동 닫기
    actionBtn.addEventListener("click", () => {
      actionBtn.disabled = true;
      actionBtn.innerHTML = `
        ${actionBtn.textContent}
        <div class="snackbar__spinner"></div>
      `;
      setTimeout(() => snackbar.remove(), 1500);
    });
  }

  // --------------------------------------------------
  // (2) 커스텀 버튼 (사용자 정의 텍스트)
  // --------------------------------------------------
  else if (actionType === "custom" && buttonText) {
    const customBtn = document.createElement("button");
    customBtn.className =
      "btn btn--outlined btn--neutral btn--small snackbar-btn";
    customBtn.textContent = buttonText;
    tailing.appendChild(customBtn);

    // ⚙️ 기본 예시: 클릭 시 alert 출력
    // Angular 변환 시: Output EventEmitter("clickCustom")로 대체
    customBtn.addEventListener("click", () => {
      alert(`👉 ${buttonText} 클릭`);
    });
  }

  // --------------------------------------------------
  // (3) 닫기 버튼 (공통)
  // --------------------------------------------------
  const closeBtn = document.createElement("button");
  closeBtn.className = "btn--icon-utility snackbar__close-btn";
  closeBtn.innerHTML = `<div class="icon--x icon"></div>`;
  closeBtn.addEventListener("click", () => snackbar.remove());
  tailing.appendChild(closeBtn);

  // --------------------------------------------------
  // 🧩 구성 합치기 (content + tailing)
  // --------------------------------------------------
  snackbar.appendChild(content);
  snackbar.appendChild(tailing);
  container.appendChild(snackbar);

  /* =========================================================
     🎞️ 애니메이션 (fade-in)
     ---------------------------------------------------------
     - 약간의 지연 후 show 클래스 추가 → CSS 트랜지션 실행
     ========================================================= */
  setTimeout(() => snackbar.classList.add("show"), 50);

  /* =========================================================
     ⏰ 자동 제거 (duration 이후)
     ---------------------------------------------------------
     - 기본 3초 후 DOM에서 제거
     - Angular에서는 AnimationBuilder + RxJS timer 로 대체 가능
     ========================================================= */
  setTimeout(() => snackbar.remove(), duration);
}
