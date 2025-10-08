import "../button/button.scss";
import "./modal.scss";

/**
 * Modal Class
 *
 * 공통 모달 관리 로직
 * - 모달 열기/닫기
 * - 입력값 변경 여부(dirty) 감지 및 확인창(confirm-exit) 처리
 *
 * 사용 예시:
 *  <button data-modal-open="user-add">열기</button>
 *  <div class="modal-overlay" data-modal="user-add"> ... </div>
 *
 * 주요 포인트:
 *  1. dirty 상태
 *     - input, select, textarea 등에 data-dirty-field 속성을 붙이면
 *       값 변경 시 this.isDirty = true 로 감지됨
 *     - 드롭다운(toggle button) 같은 경우 click 이벤트로도 dirty 처리
 *  2. 닫기 동작
 *     - dirty = false → 바로 닫기
 *     - dirty = true → confirm-exit 영역 슬라이드업
 *  3. confirm-exit
 *     - "계속 작성" → confirm-exit 닫기
 *     - "나가기" → 강제로 모달 닫기
 */
class Modal {
  constructor() {
    this.activeModal = null; // 현재 열린 모달 overlay element
    this.isDirty = false; // 입력값 변경 여부 (true = confirm-exit 필요)

    /**
     * MutationObserver
     * - JS로 필드가 동적으로 생성되는 경우에도 dirty 감지를 위해 사용
     * - data-dirty-field 속성을 가진 요소가 추가되면 이벤트 리스너 자동 등록
     */
    this.globalObserver = new MutationObserver((mutations) => {
      if (!this.activeModal) return;
      const modal = this.activeModal.querySelector(".modal");
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches?.("[data-dirty-field]")) {
              node.addEventListener("input", () => (this.isDirty = true));
            }
            node.querySelectorAll?.("[data-dirty-field]").forEach((field) => {
              field.addEventListener("input", () => (this.isDirty = true));
            });
          }
        });
      });
    });
    this.globalObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.bindEvents(); // 문서 전체 전역 이벤트 바인딩
  }

  /* ==========================
     모달 열기
     ========================== */
  open(id) {
    const overlay = document.querySelector(
      `.modal-overlay[data-modal="${id}"]`
    );
    if (!overlay) return;

    this.activeModal = overlay;
    this.isDirty = false; // 매번 초기화 (새로 열릴 때는 clean 상태)

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    const modal = overlay.querySelector(".modal");
    setTimeout(() => modal.classList.add("active"), 20); // transition 위해 지연

    // 🔑 혹시 남아있을 confirm-exit 강제 초기화
    this.hideConfirmExit(modal);

    // 오토포커스
    // - data-no-autofocus 속성이 모달에 있으면 무시
    if (!modal.hasAttribute("data-no-autofocus")) {
      const focusable = modal.querySelector(
        '[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
    }

    this.trapFocus(modal);

    /**
     * dirty 감지 이벤트 등록
     * - input/change: text-field, select 등
     * - click: 드롭다운 toggle 같은 경우 (dropdown__toggle 클래스)
     */
    modal.querySelectorAll("[data-dirty-field]").forEach((field) => {
      field.addEventListener("input", () => (this.isDirty = true));
      field.addEventListener("change", () => (this.isDirty = true));
      field.addEventListener("click", () => {
        if (field.classList.contains("dropdown__toggle")) {
          this.isDirty = true;
        }
      });
    });
  }

  /* ==========================
     모달 닫기
      - force = true → confirm-exit 무시하고 강제 닫기
      - 닫힐 때: aria-hidden 처리 + opener 버튼으로 포커스 복귀
     ========================== */
  close(force = false) {
    if (!this.activeModal) return;

    const overlay = this.activeModal;
    const modal = overlay.querySelector(".modal");

    // dirty인데 강제 닫기가 아니면 confirm-exit 띄움
    if (this.isDirty && !force) {
      this.showConfirmExit(modal);
      return;
    }

    this.hideConfirmExit(modal);
    this.isDirty = false;

    modal.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    // 🔑 포커스를 모달 열기 버튼으로 되돌림
    const modalId = overlay.dataset.modal;
    const opener = document.querySelector(`[data-modal-open="${modalId}"]`);
    if (opener) {
      opener.focus({ preventScroll: true });
    } else {
      document.body.focus();
    }

    setTimeout(() => {
      overlay.classList.remove("active");
      this.activeModal = null;
    }, 200);
  }

  /* ==========================
     confirm-exit 열기/닫기
     ========================== */
  showConfirmExit(modal) {
    modal.classList.add("confirm-exit-active");
    const confirmExit = modal.querySelector(".modal__confirm-exit");
    if (!confirmExit) return;
    confirmExit.classList.add("active");

    // transition 끝난 후 "나가기" 버튼 포커스
    const onTransitionEnd = () => {
      const exitButton = confirmExit.querySelector("[data-exit-cancel]");
      if (exitButton) {
        exitButton.focus({ preventScroll: true });
        exitButton.classList.add("focus-visible");
        exitButton.addEventListener(
          "blur",
          () => exitButton.classList.remove("focus-visible"),
          { once: true }
        );
      }
      confirmExit.removeEventListener("transitionend", onTransitionEnd);
    };
    confirmExit.addEventListener("transitionend", onTransitionEnd);
  }

  hideConfirmExit(modal) {
    modal.classList.remove("confirm-exit-active");
    const confirmExit = modal.querySelector(".modal__confirm-exit");
    if (confirmExit) confirmExit.classList.remove("active");
  }

  /* ==========================
     이벤트 바인딩 (전역)
     - 열린 모달에 관계없이 document 전체에서 처리
     ========================== */
  bindEvents() {
    document.addEventListener("click", (e) => {
      // [열기 버튼]
      const openBtn = e.target.closest("[data-modal-open]");
      if (openBtn) {
        const id = openBtn.getAttribute("data-modal-open");
        this.open(id);
      }

      // [취소], [X], [강제닫기]
      if (
        e.target.closest("[data-modal-cancel]") ||
        e.target.closest("[data-modal-close]")
      ) {
        this.close(); // dirty 여부 따라 confirm-exit 표시
      }

      // confirm-exit → "계속 작성"
      if (e.target.closest("[data-exit-confirm]")) {
        const modal = e.target.closest(".modal");
        this.hideConfirmExit(modal);
      }

      // confirm-exit → "나가기"
      if (e.target.closest("[data-exit-cancel]")) {
        this.close(true); // 강제 닫기
      }
    });

    // [오버레이 클릭]
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal-overlay") &&
        e.target.classList.contains("active")
      ) {
        this.close(); // dirty 여부 따라 confirm-exit 표시
      }
    });

    // [ESC]
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        const modal = this.activeModal.querySelector(".modal");
        const confirmExit = modal.querySelector(".modal__confirm-exit");

        // confirm-exit 열려있으면 → confirm-exit만 닫기
        if (confirmExit && confirmExit.classList.contains("active")) {
          this.hideConfirmExit(modal);
          return;
        }

        this.close(); // dirty 여부 따라 confirm-exit 표시
      }
    });
  }

  /* ==========================
     포커스 트랩
     - 모달 안에서만 Tab 이동 가능하게 제한
     ========================== */
  trapFocus(modal) {
    const focusableEls = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });
  }
}

// 초기화 실행
const modal = new Modal();
export default modal;
