import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/modal/modal.js";
import {
  initFieldBehaviors,
  renderReservUnusedFields,
  renderReservUsedFields,
} from "./membership-field.js";
import { setupUnlimitedCheckboxToggle } from "./membership-sidebar.js";

/* ==========================
   📝 옵션 모달 이벤트 제어
   --------------------------
   - 모달 열림 시 기본 옵션 row 생성
   - 옵션 행 추가 / 삭제
   - 금액 행 추가 / 삭제
   - 드롭다운 & 입력 필드 초기화
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const modalBtns = document.querySelectorAll("[data-modal-open]");
  const handledModalIds = new Set(); // 동일 모달에 중복 바인딩 방지

  modalBtns.forEach((btn) => {
    const modalId = btn.dataset.modalOpen;
    const modalOverlay = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modalOverlay) return;

    const addRowBtn = modalOverlay.querySelector(".add-option-row-btn");
    const tableBody = modalOverlay.querySelector(
      ".membership-option-modal__table-body"
    );
    if (!addRowBtn || !tableBody) return;

    /* --------------------------
       📌 모달 열림 → 기본 1줄 생성
       - 처음 열 때만 실행 (dataset.inited 체크)
    -------------------------- */
    btn.addEventListener("click", () => {
      if (!modalOverlay.dataset.inited) {
        const newRow = createNewRow(tableBody, modalId);
        tableBody.appendChild(newRow);

        bindRowEvents(newRow, modalId);
        renderOptionFields(newRow, modalId);
        updateRowDeleteBtns(tableBody);

        modalOverlay.dataset.inited = "1";

        // 첫 열림에서도 드롭다운이 바로 작동하도록 강제 초기화
        requestAnimationFrame(() => {
          initializeDropdowns(document);
        });
      }
    });

    /* --------------------------
       ➕ 옵션 행 추가
       - add-option-row-btn 클릭 시
    -------------------------- */
    if (!handledModalIds.has(modalId)) {
      handledModalIds.add(modalId);

      addRowBtn.addEventListener("click", () => {
        const newRow = createNewRow(tableBody, modalId);
        tableBody.appendChild(newRow);

        bindRowEvents(newRow, modalId);
        renderOptionFields(newRow, modalId);
        updateRowDeleteBtns(tableBody);

        // ✅ 새 row가 붙은 직후 드롭다운 초기화
        requestAnimationFrame(() => {
          initializeDropdowns(document);
        });
      });
    }

    /* --------------------------
       행 단위 이벤트 바인딩
       (삭제 / 금액 추가·삭제)
    -------------------------- */
    function bindRowEvents(row, modalId) {
      // 옵션 행 삭제
      const deleteBtn = row.querySelector(".row-delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          row.remove();
          updateRowDeleteBtns(tableBody);
        });
      }

      // 금액 추가/삭제 제어
      const price = row.querySelector(".membership-option-modal__price");
      if (!price) return;

      const wrapper = price.querySelector(
        ".membership-option-modal__price-row-wrap"
      );
      const priceTemplate = wrapper.querySelector(
        ".membership-option-modal__price-row.template"
      );
      const addBtn = price.querySelector(".price-add-btn");

      // 삭제 버튼 활성/비활성 관리
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
          newPriceRow.style.display = ""; // 보이게 설정
          resetRowInputs(newPriceRow);
          wrapper.appendChild(newPriceRow);

          // 금액 row 삭제 버튼
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

/* ==========================
   🆕 새 옵션 row 생성
   --------------------------
   - row template 복제 후 필드 렌더링
   - 금액 row 최소 1줄 보장
   - 드롭다운 초기화 강제 실행
   ========================== */
function createNewRow(tableBody, modalId) {
  const rowTemplate = tableBody.querySelector(
    ".membership-option-modal__row.template"
  );
  const newRow = rowTemplate.cloneNode(true);

  newRow.classList.remove("template");
  newRow.style.display = "";
  resetRowInputs(newRow);

  // 1️⃣ 행 전체 필드 렌더링
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

    // 첫 금액 row 삭제 버튼 이벤트
    const delBtn = firstPriceRow.querySelector(".price-delete-btn");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        firstPriceRow.remove();
        updatePriceDeleteState();
      });
    }
  }

  // 드롭다운 강제 초기화 (첫 로우에서도 메뉴 열리도록)
  initializeDropdowns(document);

  return newRow;
}

/* ==========================
   🔄 필드 초기화
   --------------------------
   - input 값 리셋
   - checkbox 해제
   - dataset.initialized = 0으로 초기화
   - 삭제 버튼 다시 활성화
   ========================== */
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

  // 삭제 버튼 활성화
  const deleteBtn = row.querySelector(".row-delete-btn");
  if (deleteBtn) deleteBtn.disabled = false;
}

/* ==========================
   🎨 필드 렌더링
   --------------------------
   - 탭 종류(modalId)에 따라 다른 필드 세팅
   - 공통 text-field/stepper 초기화
   - 무제한 체크박스 제어 로직 바인딩
   ========================== */
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

/* ==========================
   🗑 옵션 삭제 버튼 상태 관리
   --------------------------
   - 옵션 row가 1개 이하이면 삭제 버튼 비활성화
   - 2개 이상일 때는 모두 활성화
   ========================== */
function updateRowDeleteBtns(tableBody) {
  const rows = tableBody.querySelectorAll(
    ".membership-option-modal__row:not(.template)"
  );
  const disable = rows.length <= 1;

  rows.forEach((row) => {
    const btn = row.querySelector(".row-delete-btn");
    if (btn) {
      // 초기 disabled 속성 무시하고 JS에서 제어
      btn.disabled = disable;
    }
  });
}

export { renderOptionFields };
