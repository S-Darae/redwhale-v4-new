import "../button/button.scss";
import "./modal.scss";

// ======================================================================
// 🧩 Modal Class (공통 모달 관리 로직)
// ----------------------------------------------------------------------
// ✅ 역할:
// - 모든 모달의 열기/닫기 동작 제어
// - 입력값 변경 여부(dirty) 감지
// - dirty 상태에서 닫을 경우 “나가기 확인(confirm-exit)” 처리
// - focus trap 및 접근성 제어
// ----------------------------------------------------------------------
// 🧭 Angular 변환 가이드
// 1️⃣ Modal → <app-modal> 컴포넌트 (portal/outlet 기반 렌더링)
// 2️⃣ ModalService → open(id), close(force) 로직 이관
// 3️⃣ confirm-exit → 별도 <app-confirm-exit> 컴포넌트로 분리
// 4️⃣ MutationObserver → Angular lifecycle (ngAfterViewInit + ViewChild)로 대체
// 5️⃣ isDirty → FormGroup.dirty / ngModelChange 이벤트로 감지
// 6️⃣ focus trap → Angular CDK FocusTrap 사용
// ----------------------------------------------------------------------
// 📌 HTML 사용 예시:
//
// <button data-modal-open="user-add">열기</button>
// <div class="modal-overlay" data-modal="user-add">
//   <div class="modal"> ... </div>
// </div>
// ----------------------------------------------------------------------
// ⚙️ 주요 포인트
// 1. dirty 상태 감지
//    - data-dirty-field 속성이 붙은 input/select/textarea 등 자동 감지
//    - dropdown__toggle 클릭 시도 dirty 처리
// 2. 닫기 로직
//    - dirty=false → 바로 닫기
//    - dirty=true → confirm-exit 활성화
// 3. confirm-exit 동작
//    - 계속 작성(data-exit-confirm) → confirm-exit 닫기
//    - 나가기(data-exit-cancel) → 강제 닫기
// ======================================================================
class Modal {
  constructor() {
    this.activeModal = null; // 현재 열린 modal overlay 엘리먼트
    this.isDirty = false; // 입력값 변경 여부 (true면 confirm-exit 필요)

    /**
     * 📡 MutationObserver
     * ----------------------------------------------------------
     * JS로 동적으로 생성된 필드에서도 dirty 감지가 되도록 처리
     * data-dirty-field 속성이 추가되면 input 이벤트를 자동 등록
     * ----------------------------------------------------------
     * Angular 변환 시 → ngAfterViewInit + Reactive Forms 로 대체 가능
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

    this.bindEvents(); // 전역 문서 이벤트 초기화
  }

  // =========================================================
  // 📤 모달 열기
  // ---------------------------------------------------------
  // @param {string} id - data-modal 속성에 매칭되는 모달 ID
  // ---------------------------------------------------------
  // - overlay, modal 클래스 활성화
  // - confirm-exit 초기화
  // - autofocus 및 focus trap 설정
  // - dirty 감지 이벤트 등록
  // =========================================================
  open(id) {
    const overlay = document.querySelector(
      `.modal-overlay[data-modal="${id}"]`
    );
    if (!overlay) return;

    this.activeModal = overlay;
    this.isDirty = false; // 매번 clean 상태로 초기화

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    const modal = overlay.querySelector(".modal");
    setTimeout(() => modal.classList.add("active"), 20); // transition용 딜레이

    // confirm-exit 초기화
    this.hideConfirmExit(modal);

    // 🧭 자동 포커스 (data-no-autofocus 있으면 무시)
    if (!modal.hasAttribute("data-no-autofocus")) {
      const focusable = modal.querySelector(
        '[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
    }

    // 포커스 트랩 활성화
    this.trapFocus(modal);

    /**
     * dirty 감지 이벤트 등록
     * - input/change 이벤트: text-field, select 등
     * - click 이벤트: dropdown toggle 버튼용
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

  // =========================================================
  // 📥 모달 닫기
  // ---------------------------------------------------------
  // @param {boolean} [force=false]
  // - force = true → confirm-exit 무시하고 강제 닫기
  // - false이면 dirty 여부에 따라 confirm-exit 표시
  // =========================================================
  close(force = false) {
    if (!this.activeModal) return;

    const overlay = this.activeModal;
    const modal = overlay.querySelector(".modal");

    // dirty 상태인데 강제 닫기가 아닐 경우 confirm-exit 표시
    if (this.isDirty && !force) {
      this.showConfirmExit(modal);
      return;
    }

    // confirm-exit 숨기기 및 상태 초기화
    this.hideConfirmExit(modal);
    this.isDirty = false;

    modal.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    // 🔁 포커스를 모달 열기 버튼으로 복귀
    const modalId = overlay.dataset.modal;
    const opener = document.querySelector(`[data-modal-open="${modalId}"]`);
    if (opener) {
      opener.focus({ preventScroll: true });
    } else {
      document.body.focus();
    }

    // 트랜지션 후 overlay 비활성화 및 상태 초기화
    setTimeout(() => {
      overlay.classList.remove("active");
      this.activeModal = null;
    }, 200);
  }

  // =========================================================
  // ⚠️ confirm-exit 열기 / 닫기
  // ---------------------------------------------------------
  // "계속 작성" / "나가기" 선택 시 각각의 동작 처리
  // Angular 변환 시 <app-confirm-exit>로 분리 가능
  // =========================================================
  showConfirmExit(modal) {
    modal.classList.add("confirm-exit-active");
    const confirmExit = modal.querySelector(".modal__confirm-exit");
    if (!confirmExit) return;
    confirmExit.classList.add("active");

    // transition 종료 후 “나가기” 버튼에 포커스 이동
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

  // =========================================================
  // 🧭 이벤트 바인딩 (전역)
  // ---------------------------------------------------------
  // 모든 모달 공통 클릭/키보드 이벤트 처리
  // - data-modal-open → 모달 열기
  // - data-modal-cancel / data-modal-close → 닫기
  // - data-exit-confirm → confirm-exit 닫기
  // - data-exit-cancel → 강제 닫기
  // =========================================================
  bindEvents() {
    document.addEventListener("click", (e) => {
      // [열기 버튼]
      const openBtn = e.target.closest("[data-modal-open]");
      if (openBtn) {
        const id = openBtn.getAttribute("data-modal-open");
        this.open(id);
      }

      // [취소], [X], [닫기]
      if (
        e.target.closest("[data-modal-cancel]") ||
        e.target.closest("[data-modal-close]")
      ) {
        this.close();
      }

      // confirm-exit → "계속 작성"
      if (e.target.closest("[data-exit-confirm]")) {
        const modal = e.target.closest(".modal");
        this.hideConfirmExit(modal);
      }

      // confirm-exit → "나가기"
      if (e.target.closest("[data-exit-cancel]")) {
        this.close(true);
      }
    });

    // [오버레이 영역 클릭 → 닫기]
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal-overlay") &&
        e.target.classList.contains("active")
      ) {
        this.close();
      }
    });

    // [ESC 키]
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        const modal = this.activeModal.querySelector(".modal");
        const confirmExit = modal.querySelector(".modal__confirm-exit");

        // confirm-exit가 열려있으면 → 닫기만
        if (confirmExit && confirmExit.classList.contains("active")) {
          this.hideConfirmExit(modal);
          return;
        }

        this.close();
      }
    });
  }

  // =========================================================
  // 🔒 포커스 트랩 (접근성)
  // ---------------------------------------------------------
  // 모달 내부에서만 Tab 이동 허용
  // Angular 변환 시 → CDK FocusTrap 사용
  // =========================================================
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

// =========================================================
// 🚀 초기화
// ---------------------------------------------------------
// - 페이지 진입 시 Modal 인스턴스 1회 생성
// - 전역 모달 관리 (다중 모달 X)
// =========================================================
const modal = new Modal();
export default modal;
