import "../../components/button/button.js";
import "../tooltip/tooltip.js";
import "./sidebar-init.js";
import "./sidebar.scss";

/**
 * Sidebar 컴포넌트
 *
 * 사용 규칙:
 * 1. 사이드바는 <aside class="sidebar" id="..."> 형태로 작성
 * 2. 열기 버튼은 [data-open-target="sidebarId"] 속성을 가짐
 * 3. 닫기 버튼은 모두 .sidebar-close-btn 클래스를 가짐 (X 버튼, 취소 버튼 등)
 * 4. 저장 버튼은 .btn--primary 사용 → 고정 상태가 아니면 닫힘
 * 5. data-width 속성으로 너비 지정 (예: data-width="360")
 * 6. 고정 버튼은 .sidebar-pin-btn 클래스로 식별
 * 7. confirm-exit은 data-dirty-field가 하나라도 있으면 자동 활성화
 */
export default class Sidebar {
  constructor(sidebarEl) {
    this.sidebar = sidebarEl;
    this.width = sidebarEl.dataset.width || "330";
    this.isPinned = false;
    this.isDirty = false; // 입력값 변경 여부

    /** 닫기 버튼 */
    this.sidebar
      .querySelectorAll(".sidebar-close-btn")
      .forEach((btn) => btn.addEventListener("click", () => this.close()));

    /** 저장 버튼 */
    const saveBtn = this.sidebar.querySelector(
      "button.btn--solid.btn--primary"
    );
    saveBtn?.addEventListener("click", () => {
      this.isDirty = false; // 저장하면 dirty 초기화
      if (!this.isPinned) {
        this.close(true);
      }
      // 👉 TODO: 저장 로직 추가
    });

    /** 고정 버튼 */
    this.pinBtn = this.sidebar.querySelector(".sidebar-pin-btn");
    if (this.pinBtn) {
      this.pinBtn.addEventListener("click", () => this.togglePin());
    }

    /** dirty 감지 필드 */
    this.sidebar.querySelectorAll("[data-dirty-field]").forEach((field) => {
      field.addEventListener("input", () => (this.isDirty = true));
      field.addEventListener("change", () => (this.isDirty = true));
    });

    /** confirm-exit 버튼 이벤트 */
    this.bindConfirmExitEvents();

    /** 리사이즈 대응 */
    window.addEventListener("resize", () => {
      if (this.sidebar.classList.contains("active")) {
        this.applyWidth();
      }
    });
  }

  /** 열기 */
  open() {
    // 다른 사이드바 닫기
    document
      .querySelectorAll("aside.sidebar.active")
      .forEach((sb) => sb.classList.remove("active"));

    this.sidebar.classList.add("active");
    const width = this.sidebar.dataset.width || this.width;
    document.body.style.setProperty("--sidebar-width", `${width}px`);
    document.body.classList.add("sidebar-open");
    this.isDirty = false; // 새로 열릴 때는 clean 상태

    // 오토포커싱 적용
    setTimeout(() => {
      const focusTarget =
        this.sidebar.querySelector("input[autofocus]") ||
        this.sidebar.querySelector("input[name], input, textarea");
      if (focusTarget) focusTarget.focus();
    }, 50);
  }

  /** 닫기 */
  close(force = false) {
    const hasDirtyFields = this.sidebar.querySelector("[data-dirty-field]");

    // dirty + dirty필드 존재 → confirm-exit 적용
    if (hasDirtyFields && this.isDirty && !force) {
      this.showConfirmExit();
      return;
    }

    this.hideConfirmExit();
    this.sidebar.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    document.body.style.removeProperty("--sidebar-width");
  }

  /** confirm-exit 열기 */
  showConfirmExit() {
    this.sidebar.classList.add("confirm-exit-active");
    const overlay = this.sidebar.querySelector(".sidebar__confirm-overlay");
    const exitBox = this.sidebar.querySelector(".sidebar__confirm-exit");

    overlay?.classList.add("active");
    exitBox?.classList.add("active");

    // "나가기" 버튼에 포커스 이동
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

  /** confirm-exit 닫기 */
  hideConfirmExit() {
    this.sidebar.classList.remove("confirm-exit-active");
    this.sidebar
      .querySelector(".sidebar__confirm-overlay")
      ?.classList.remove("active");
    this.sidebar
      .querySelector(".sidebar__confirm-exit")
      ?.classList.remove("active");
  }

  /** confirm-exit 버튼 이벤트 */
  bindConfirmExitEvents() {
    this.sidebar.addEventListener("click", (e) => {
      if (e.target.closest("[data-exit-confirm]")) {
        this.hideConfirmExit(); // 계속 작성
      }
      if (e.target.closest("[data-exit-cancel]")) {
        this.isDirty = false;
        this.close(true); // 강제 닫기
      }
    });
  }

  /** 리사이즈 시 너비 다시 적용 */
  applyWidth() {
    const width = this.sidebar.dataset.width || this.width;
    document.body.style.setProperty("--sidebar-width", `${width}px`);
    document.body.classList.add("sidebar-open");
  }

  /** 고정 토글 */
  togglePin() {
    this.isPinned = !this.isPinned;
    const icon = this.pinBtn?.querySelector("i");
    if (icon) {
      icon.classList.toggle("icon--push-pin-fill", this.isPinned);
      icon.classList.toggle("icon--push-pin", !this.isPinned);
    }
  }
}
