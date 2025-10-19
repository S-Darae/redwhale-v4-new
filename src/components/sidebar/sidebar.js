import "../../components/button/button.js";
import "../tooltip/tooltip.js";
import "./sidebar-init.js";
import "./sidebar.scss";

/**
 * ======================================================================
 * 🧭 Sidebar Class (공통 사이드바 로직)
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 사이드바 열기, 닫기, 고정, confirm-exit(나가기 확인) 기능을 통합 관리
 * - 사이드바 내 dirty 필드(입력값 변경 필드) 감지
 * - 창 크기 변경 시 사이드바 너비 자동 재적용
 * ----------------------------------------------------------------------
 * 📘 사용 규칙:
 * 1️⃣ `<aside class="sidebar" id="...">` 구조 필수
 * 2️⃣ 열기 버튼 → `[data-open-target="sidebarId"]`  
 * 3️⃣ 닫기 버튼 → `.sidebar-close-btn` (X버튼, 취소버튼 등)
 * 4️⃣ 저장 버튼 → `.btn--primary` (저장 후 자동 닫힘, 단 isPinned=false일 경우)
 * 5️⃣ 너비 설정 → `data-width="360"` 속성 사용
 * 6️⃣ 고정 버튼 → `.sidebar-pin-btn` (핀 고정/해제)
 * 7️⃣ confirm-exit → `data-dirty-field`가 하나라도 있으면 활성화
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - Sidebar 클래스는 Angular 컴포넌트로 직접 변환
 *   → `<app-sidebar>` + SidebarService 구조로 전환 권장
 * - 상태 관리 (`isDirty`, `isPinned`)는 Component state로 관리
 * - 이벤트 (`click`, `input`, `resize`)는 Angular 바인딩 `(click)` / `(input)`으로 대체
 * - confirm-exit은 `<app-confirm-exit>` 별도 컴포넌트로 분리 가능
 * ----------------------------------------------------------------------
 * 📘 Angular 구성 예시:
 * <app-sidebar [width]="360" [pinned]="false" (close)="onClose()">
 *   <app-confirm-exit *ngIf="isDirty"></app-confirm-exit>
 * </app-sidebar>
 * ======================================================================
 */
export default class Sidebar {
  constructor(sidebarEl) {
    // ----------------------------------------------------------
    // 🔧 초기 속성
    // ----------------------------------------------------------
    this.sidebar = sidebarEl; // 사이드바 root element (<aside>)
    this.width = sidebarEl.dataset.width || "330"; // 기본 너비
    this.isPinned = false; // 핀 고정 상태
    this.isDirty = false; // 입력 변경 여부

    /* =========================================================
       ❌ 닫기 버튼 이벤트
       ---------------------------------------------------------
       - .sidebar-close-btn 클릭 시 → this.close()
       ========================================================= */
    this.sidebar
      .querySelectorAll(".sidebar-close-btn")
      .forEach((btn) => btn.addEventListener("click", () => this.close()));

    /* =========================================================
       💾 저장 버튼 이벤트
       ---------------------------------------------------------
       - .btn--solid.btn--primary 클릭 시 저장 처리
       - 저장 후 dirty 초기화
       - isPinned=false이면 자동으로 닫힘
       ========================================================= */
    const saveBtn = this.sidebar.querySelector(
      "button.btn--solid.btn--primary"
    );
    saveBtn?.addEventListener("click", () => {
      this.isDirty = false; // 저장 후 clean 상태로 초기화
      if (!this.isPinned) {
        this.close(true);
      }
      // 👉 TODO: 실제 저장 로직 추가 (API 연동 등)
    });

    /* =========================================================
       📌 고정 버튼 이벤트
       ---------------------------------------------------------
       - .sidebar-pin-btn 클릭 시 togglePin() 호출
       ========================================================= */
    this.pinBtn = this.sidebar.querySelector(".sidebar-pin-btn");
    if (this.pinBtn) {
      this.pinBtn.addEventListener("click", () => this.togglePin());
    }

    /* =========================================================
       🧩 dirty 감지 필드
       ---------------------------------------------------------
       - data-dirty-field 속성이 있는 모든 입력 요소 감시
       - input/change 이벤트 시 isDirty = true
       ========================================================= */
    this.sidebar.querySelectorAll("[data-dirty-field]").forEach((field) => {
      field.addEventListener("input", () => (this.isDirty = true));
      field.addEventListener("change", () => (this.isDirty = true));
    });

    /* =========================================================
       ⚠️ confirm-exit 버튼 이벤트 (나가기 확인)
       ---------------------------------------------------------
       - "계속 작성" / "나가기" 버튼 처리
       ========================================================= */
    this.bindConfirmExitEvents();

    /* =========================================================
       📐 창 크기 변경 대응
       ---------------------------------------------------------
       - 활성화된 상태에서 리사이즈 시 사이드바 너비 다시 계산
       ========================================================= */
    window.addEventListener("resize", () => {
      if (this.sidebar.classList.contains("active")) {
        this.applyWidth();
      }
    });
  }

  /* =========================================================
     📤 open() : 사이드바 열기
     ---------------------------------------------------------
     - 다른 사이드바 닫고 현재 사이드바만 active 처리
     - body에 sidebar-open 클래스 추가
     - --sidebar-width CSS 변수 적용
     - autofocus 입력 필드 포커싱
     ========================================================= */
  open() {
    // 다른 사이드바 모두 닫기
    document
      .querySelectorAll("aside.sidebar.active")
      .forEach((sb) => sb.classList.remove("active"));

    this.sidebar.classList.add("active");

    const width = this.sidebar.dataset.width || this.width;
    document.body.style.setProperty("--sidebar-width", `${width}px`);
    document.body.classList.add("sidebar-open");
    this.isDirty = false; // 새로 열릴 때 clean 상태로 초기화

    // 자동 포커스 적용 (첫 번째 입력 필드 또는 autofocus 지정 필드)
    setTimeout(() => {
      const focusTarget =
        this.sidebar.querySelector("input[autofocus]") ||
        this.sidebar.querySelector("input[name], input, textarea");
      if (focusTarget) focusTarget.focus();
    }, 50);
  }

  /* =========================================================
     📥 close(force = false) : 사이드바 닫기
     ---------------------------------------------------------
     - force=false → dirty 상태일 경우 confirm-exit 표시
     - force=true → confirm-exit 무시하고 즉시 닫기
     - body에서 sidebar-open 클래스 제거
     ========================================================= */
  close(force = false) {
    const hasDirtyFields = this.sidebar.querySelector("[data-dirty-field]");

    // dirty 상태 + dirty 필드 존재 + 강제 닫기 아님 → confirm-exit 표시
    if (hasDirtyFields && this.isDirty && !force) {
      this.showConfirmExit();
      return;
    }

    // confirm-exit 숨기기 및 초기화
    this.hideConfirmExit();
    this.sidebar.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    document.body.style.removeProperty("--sidebar-width");
  }

  /* =========================================================
     ⚠️ showConfirmExit() : 나가기 확인 표시
     ---------------------------------------------------------
     - sidebar__confirm-overlay / sidebar__confirm-exit 활성화
     - “나가기” 버튼으로 포커스 이동
     ========================================================= */
  showConfirmExit() {
    this.sidebar.classList.add("confirm-exit-active");

    const overlay = this.sidebar.querySelector(".sidebar__confirm-overlay");
    const exitBox = this.sidebar.querySelector(".sidebar__confirm-exit");

    overlay?.classList.add("active");
    exitBox?.classList.add("active");

    // transition 후 "나가기" 버튼 포커싱
    const exitButton = exitBox?.querySelector("[data-exit-cancel]");
    if (exitButton) {
      const onTransitionEnd = () => {
        exitButton.focus({ preventScroll: true });
        exitButton.classList.add("focus-visible");
        exitButton.addEventListener(
          "blur",
          () => exitButton.classList.remove("focus-visible"),
          { once: true }
        );
        exitBox.removeEventListener("transitionend", onTransitionEnd);
      };
      exitBox.addEventListener("transitionend", onTransitionEnd);
    }
  }

  /* =========================================================
     🧹 hideConfirmExit() : 나가기 확인 숨기기
     ---------------------------------------------------------
     - confirm-exit-active 클래스 제거
     - overlay / exit 박스 비활성화
     ========================================================= */
  hideConfirmExit() {
    this.sidebar.classList.remove("confirm-exit-active");
    this.sidebar
      .querySelector(".sidebar__confirm-overlay")
      ?.classList.remove("active");
    this.sidebar
      .querySelector(".sidebar__confirm-exit")
      ?.classList.remove("active");
  }

  /* =========================================================
     🎛️ bindConfirmExitEvents() : confirm-exit 버튼 이벤트 바인딩
     ---------------------------------------------------------
     - data-exit-confirm → 계속 작성
     - data-exit-cancel → 강제 닫기
     ========================================================= */
  bindConfirmExitEvents() {
    this.sidebar.addEventListener("click", (e) => {
      if (e.target.closest("[data-exit-confirm]")) {
        this.hideConfirmExit(); // “계속 작성”
      }
      if (e.target.closest("[data-exit-cancel]")) {
        this.isDirty = false;
        this.close(true); // “나가기” (강제 닫기)
      }
    });
  }

  /* =========================================================
     📐 applyWidth() : 리사이즈 시 너비 재적용
     ---------------------------------------------------------
     - 활성화된 사이드바의 data-width를 다시 body에 반영
     ========================================================= */
  applyWidth() {
    const width = this.sidebar.dataset.width || this.width;
    document.body.style.setProperty("--sidebar-width", `${width}px`);
    document.body.classList.add("sidebar-open");
  }

  /* =========================================================
     📌 togglePin() : 고정 버튼 토글
     ---------------------------------------------------------
     - isPinned 상태 전환
     - 아이콘 변경 (push-pin ↔ push-pin-fill)
     ========================================================= */
  togglePin() {
    this.isPinned = !this.isPinned;
    const icon = this.pinBtn?.querySelector("i");
    if (icon) {
      icon.classList.toggle("icon--push-pin-fill", this.isPinned);
      icon.classList.toggle("icon--push-pin", !this.isPinned);
    }
  }
}
