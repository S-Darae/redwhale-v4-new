/* ======================================================================
   📦 membership-option-modal.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원권 옵션 모달(예약 사용 / 예약 미사용) 내부 행 제어
   - 옵션 행 추가 / 삭제 / 금액 행 추가·삭제
   - 드롭다운 및 필드 초기화 관리
   - 무제한 체크박스 제어 연동
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 행 리스트 → *ngFor 기반으로 TemplateRef 복제 대신 컴포넌트 렌더링
   - createNewRow() → addRow() 메서드로 변환
   - resetRowInputs() → FormGroup.reset() 대체
   - initializeDropdowns() → 커스텀 DropdownDirective로 관리 가능
   ====================================================================== */

import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/modal/modal.js";
import {
  initFieldBehaviors,
  renderReservUnusedFields,
  renderReservUsedFields,
} from "./membership-field.js";
import { setupUnlimitedCheckboxToggle } from "./membership-sidebar.js";

/* ======================================================================
   📝 옵션 모달 이벤트 제어
   ----------------------------------------------------------------------
   ✅ 역할:
   - 모달 열릴 때 기본 1개의 옵션 row 자동 생성
   - “옵션 추가” 버튼으로 행 추가
   - 각 행 내 금액 row 추가 / 삭제
   - 드롭다운 및 필드 초기화 처리
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const modalBtns = document.querySelectorAll("[data-modal-open]");
  const handledModalIds = new Set(); // 동일 모달 중복 바인딩 방지

  modalBtns.forEach((btn) => {
    const modalId = btn.dataset.modalOpen;
    const modalOverlay = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modalOverlay) return;

    const addRowBtn = modalOverlay.querySelector(".add-option-row-btn");
    const tableBody = modalOverlay.querySelector(
      ".membership-option-modal__table-body"
    );
    if (!addRowBtn || !tableBody) return;

    /* ======================================================================
       📌 모달 열림 시 기본 1행 생성
       ----------------------------------------------------------------------
       ✅ 설명:
       - 처음 열릴 때만 실행 (dataset.inited로 중복 방지)
       - 필드 렌더링 + 이벤트 바인딩 + 드롭다운 초기화
       ====================================================================== */
    btn.addEventListener("click", () => {
      if (!modalOverlay.dataset.inited) {
        const newRow = createNewRow(tableBody, modalId);
        tableBody.appendChild(newRow);

        bindRowEvents(newRow, modalId);
        renderOptionFields(newRow, modalId);
        updateRowDeleteBtns(tableBody);

        modalOverlay.dataset.inited = "1";

        // 드롭다운이 첫 열림에서도 정상 작동하도록 강제 초기화
        requestAnimationFrame(() => {
          initializeDropdowns(document);
        });
      }
    });

    /* ======================================================================
       ➕ 옵션 행 추가
       ----------------------------------------------------------------------
       ✅ 설명:
       - “추가” 버튼 클릭 시 새 옵션 행 생성
       - 기존 내용 복제 후 새 row append
       - 필드/이벤트/드롭다운 모두 재초기화
       ====================================================================== */
    if (!handledModalIds.has(modalId)) {
      handledModalIds.add(modalId);

      addRowBtn.addEventListener("click", () => {
        const newRow = createNewRow(tableBody, modalId);
        tableBody.appendChild(newRow);

        bindRowEvents(newRow, modalId);
        renderOptionFields(newRow, modalId);
        updateRowDeleteBtns(tableBody);

        // 새로 추가된 row에서도 드롭다운 즉시 작동
        requestAnimationFrame(() => {
          initializeDropdowns(document);
        });
      });
    }

    /* ======================================================================
       🎛 행 단위 이벤트 바인딩
       ----------------------------------------------------------------------
       ✅ 역할:
       - 옵션 row 내 삭제 / 금액 추가·삭제 이벤트 연결
       ====================================================================== */
    function bindRowEvents(row, modalId) {
      // ------------------------------
      // 🗑 옵션 행 삭제
      // ------------------------------
      const deleteBtn = row.querySelector(".row-delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          row.remove();
          updateRowDeleteBtns(tableBody);
        });
      }

      // ------------------------------
      // 💰 금액 추가 / 삭제 제어
      // ------------------------------
      const price = row.querySelector(".membership-option-modal__price");
      if (!price) return;

      const wrapper = price.querySelector(
        ".membership-option-modal__price-row-wrap"
      );
      const priceTemplate = wrapper.querySelector(
        ".membership-option-modal__price-row.template"
      );
      const addBtn = price.querySelector(".price-add-btn");

      // 삭제 버튼 활성/비활성 상태 갱신
      const updatePriceDeleteState = () => {
        const all = wrapper.querySelectorAll(
          ".membership-option-modal__price-row:not(.template)"
        );
        const disable = all.length < 2;
        all.forEach((r) => {
          const btn = r.querySelector(".price-delete-btn");
          if (btn) btn.disabled = disable;
        });
      };

      updatePriceDeleteState();

      // ➕ 금액 row 추가
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const newPriceRow = priceTemplate.cloneNode(true);
          newPriceRow.classList.remove("template");
          newPriceRow.style.display = ""; // 표시
          resetRowInputs(newPriceRow);
          wrapper.appendChild(newPriceRow);

          // 금액 row 삭제 버튼 이벤트 등록
          const delBtn = newPriceRow.querySelector(".price-delete-btn");
          if (delBtn) {
            delBtn.addEventListener("click", () => {
              newPriceRow.remove();
              updatePriceDeleteState();
            });
          }

          // 새 금액 row 필드 렌더링
          renderOptionFields(newPriceRow, modalId);
          updatePriceDeleteState();
        });
      }
    }
  });
});

/* ======================================================================
   🆕 새 옵션 row 생성
   ----------------------------------------------------------------------
   ✅ 역할:
   - row template 복제 → 신규 row 생성
   - 금액 row 최소 1줄 보장
   - 필드 렌더링 및 드롭다운 강제 초기화
   ====================================================================== */
function createNewRow(tableBody, modalId) {
  const rowTemplate = tableBody.querySelector(
    ".membership-option-modal__row.template"
  );
  const newRow = rowTemplate.cloneNode(true);

  newRow.classList.remove("template");
  newRow.style.display = "";
  resetRowInputs(newRow);

  // 1️⃣ 전체 필드 렌더링
  renderOptionFields(newRow, modalId);

  // 2️⃣ 금액 row 최소 1줄 생성
  const priceWrapper = newRow.querySelector(
    ".membership-option-modal__price-row-wrap"
  );
  const priceTemplate = priceWrapper.querySelector(
    ".membership-option-modal__price-row.template"
  );

  if (priceTemplate) {
    const firstPriceRow = priceTemplate.cloneNode(true);
    firstPriceRow.classList.remove("template");
    firstPriceRow.style.display = "";
    resetRowInputs(firstPriceRow);
    priceWrapper.appendChild(firstPriceRow);

    renderOptionFields(firstPriceRow, modalId);

    // 첫 금액 row 삭제 버튼
    const delBtn = firstPriceRow.querySelector(".price-delete-btn");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        firstPriceRow.remove();
        updatePriceDeleteState();
      });
    }
  }

  // 드롭다운 초기화 (첫 로우에서도 메뉴 정상 작동)
  initializeDropdowns(document);

  return newRow;
}

/* ======================================================================
   🔄 필드 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - 모든 input 값 및 placeholder 초기화
   - 체크박스 해제
   - dataset.initialized 값 초기화
   - 삭제 버튼 활성화 복원
   ====================================================================== */
function resetRowInputs(row) {
  row.querySelectorAll(".text-field__input").forEach((input) => {
    input.value = "";
    input.placeholder = "0";
  });

  row.querySelectorAll("input[type=checkbox]").forEach((chk) => {
    chk.checked = false;
  });

  row
    .querySelectorAll('div[id^="membership-option-modal__field--"]')
    .forEach((el) => {
      el.dataset.initialized = "0";
    });

  // 삭제 버튼 다시 활성화
  const deleteBtn = row.querySelector(".row-delete-btn");
  if (deleteBtn) deleteBtn.disabled = false;
}

/* ======================================================================
   🎨 필드 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - modalId(예약 사용 / 미사용)에 따라 다른 필드 세팅
   - stepper / dropdown / checkbox 렌더링 후
     text-field, 무제한 체크박스 로직 초기화
   ====================================================================== */
function renderOptionFields(scope, modalId) {
  if (modalId === "membership-option-modal--reserv-used") {
    renderReservUsedFields(scope);
  }
  if (modalId === "membership-option-modal--reserv-unused") {
    renderReservUnusedFields(scope);
  }

  initFieldBehaviors(scope);
  setupUnlimitedCheckboxToggle(scope);
}

/* ======================================================================
   🗑 옵션 삭제 버튼 상태 관리
   ----------------------------------------------------------------------
   ✅ 역할:
   - 옵션 row 개수가 1개 이하일 경우 삭제 버튼 비활성화
   - 2개 이상일 때는 다시 활성화
   ====================================================================== */
function updateRowDeleteBtns(tableBody) {
  const rows = tableBody.querySelectorAll(
    ".membership-option-modal__row:not(.template)"
  );
  const disable = rows.length <= 1;

  rows.forEach((row) => {
    const btn = row.querySelector(".row-delete-btn");
    if (btn) {
      // 초기 disabled 속성 무시하고 JS에서 직접 제어
      btn.disabled = disable;
    }
  });
}

// 외부에서 renderOptionFields 직접 호출 가능
export { renderOptionFields };
