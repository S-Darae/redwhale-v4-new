/* ==========================
   Import (필요한 컴포넌트 / 모듈)
   ========================== */
import "../../pages/common/main-menu.js";
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./payments.scss";

import "../../components/badge/badge.js";
import "../../components/button/button.js";
import "../../components/modal/modal.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";

import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/dropdown/dropdown.scss";

import { createPagination } from "../../components/button/create-pagination.js";
import "../../components/button/pagination.scss";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

import modal from "../../components/modal/modal.js";
import "../../components/modal/modal.scss";

/* ==========================
   초기화: 센터 설정 페이지
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal(); // 센터 기본정보 수정 모달
  initPagination(); // 페이지네이션
  initRowsDropdown(); // 테이블 행 수 선택 드롭다운
  initReceiptModal(); // 결제 상세 모달
  initPaycardFields(); // 결제수단 추가 모달 (필드 + 검증)
  initPaycardDeleteToggle(); // 사이드바 삭제 버튼
  initPaycardRadios(); // 사이드바 라디오 버튼
});

/* ==========================
   직원 테이블 관련
   ========================== */
function initPagination() {
  const pagination = createPagination(1, 1, "small", (p) =>
    console.log("페이지:", p)
  );
  document
    .getElementById("payments-table__pagination")
    ?.appendChild(pagination);
}

function initRowsDropdown() {
  createDropdownMenu({
    id: "payments-table-rows-menu",
    size: "xs",
    items: [
      { title: "10줄씩 보기", action: () => setRowsPerPage(10) },
      {
        title: "15줄씩 보기",
        selected: true,
        action: () => setRowsPerPage(15),
      },
      { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
      { title: "50줄씩 보기", action: () => setRowsPerPage(50) },
    ],
  });
  initializeDropdowns();
}

function setRowsPerPage(n) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}

/* ==========================
   결제 상세 정보 모달
   ========================== */
function initReceiptModal() {
  const modalOverlay = document.querySelector('[data-modal="receipt"]');
  if (!modalOverlay) return;

  const previews = modalOverlay.querySelectorAll(".receipt-preview");

  document.querySelectorAll(".payments-table--body").forEach((row) => {
    row.addEventListener("click", () => {
      const typeClass = [...row.classList].find(
        (cls) =>
          cls.startsWith("payments-table--") && cls !== "payments-table--body"
      );
      const type = typeClass?.replace("payments-table--", "");
      if (!type) return;

      previews.forEach((preview) => preview.classList.remove("active"));
      const target = modalOverlay.querySelector(`.receipt-preview--${type}`);
      if (target) {
        target.classList.add("active");
        modal.open("receipt");
      }
    });
  });
}

/* ==========================
   결제수단 추가 모달 (필드 + 검증)
   ========================== */
function initPaycardFields() {
  const paycardModal = document.querySelector(".add-paycard-modal");
  if (!paycardModal) return;

  // 카드번호
  const cardNumberWrapper = paycardModal.querySelector(".card-number-inputs");
  if (cardNumberWrapper) {
    cardNumberWrapper.innerHTML = `
      <label class="input-label">카드번호</label>
      <div class="card-number-field">
        ${createTextField({
          id: "paycard__number-1",
          size: "small",
          maxlength: 4,
          autofocus: true,
          clearable: false,
          onlyNumber: true,
        })}
        <span>-</span>
        ${createTextField({
          id: "paycard__number-2",
          size: "small",
          maxlength: 4,
          clearable: false,
          onlyNumber: true,
        })}
        <span>-</span>
        ${createTextField({
          id: "paycard__number-3",
          size: "small",
          maxlength: 4,
          clearable: false,
          onlyNumber: true,
        })}
        <span>-</span>
        ${createTextField({
          id: "paycard__number-4",
          size: "small",
          maxlength: 4,
          clearable: false,
          onlyNumber: true,
        })}
      </div>
    `;
  }

  // 생년월일
  const birthWrapper = paycardModal.querySelector(".birth-input");
  if (birthWrapper) {
    birthWrapper.innerHTML = createTextField({
      id: "paycard__birth",
      size: "small",
      label: "생년월일 6자리",
      placeholder: "예) 900101",
      maxlength: 6,
      helper: "생년월일을 확인해주세요.",
      clearable: false,
      onlyNumber: true,
    });
  }

  // 유효기간
  const expiryWrapper = paycardModal.querySelector(".expiry-inputs");
  if (expiryWrapper) {
    expiryWrapper.innerHTML = `
      <label class="input-label">유효기간</label>
      <div class="expiry-field">
        ${createTextField({
          id: "paycard__expiry-mm",
          size: "small",
          placeholder: "MM",
          maxlength: 2,
          clearable: false,
          onlyNumber: true,
        })}
        <span>/</span>
        ${createTextField({
          id: "paycard__expiry-yy",
          size: "small",
          placeholder: "YY",
          maxlength: 2,
          clearable: false,
          onlyNumber: true,
        })}
      </div>
      <div class="helper"><div class="hint-text">유효기간을 확인해주세요.</div></div>
    `;
  }

  // CVC
  const cvcWrapper = paycardModal.querySelector(".cvc-input");
  if (cvcWrapper) {
    cvcWrapper.innerHTML = createTextField({
      id: "paycard__cvc",
      size: "small",
      label: "CVC (카드 뒷면 3자리)",
      maxlength: 3,
      clearable: false,
      onlyNumber: true,
    });
  }

  // 비밀번호 앞 2자리
  const pwWrapper = paycardModal.querySelector(".password-input");
  if (pwWrapper) {
    pwWrapper.innerHTML = `
      <label class="input-label">비밀번호 앞 2자리</label>
      <div class="password-field">
        ${createTextField({
          id: "paycard__password",
          size: "small",
          maxlength: 2,
          clearable: false,
          onlyNumber: true,
        })}
        <span>**</span>
      </div>
    `;
  }

  // 필드 초기화
  initializeTextFields(paycardModal);

  /* --------------------------
     입력 이벤트 (포커스/검증)
     -------------------------- */
  const inputs = [...paycardModal.querySelectorAll("input.text-field__input")];

  inputs.forEach((input, index) => {
    if (input._bound) return;
    input._bound = true;

    const maxLength = parseInt(input.getAttribute("maxlength"), 10) || null;

    input.addEventListener("input", (e) => {
      // 일반 필드 → maxlength 채우면 다음 필드로 이동
      if (
        ![
          "paycard__birth",
          "paycard__expiry-mm",
          "paycard__expiry-yy",
        ].includes(input.id) &&
        maxLength &&
        e.target.value.length === maxLength &&
        index < inputs.length - 1
      ) {
        inputs[index + 1].focus();
      }

      // 생년월일 → 6자리 입력 후 검증 통과해야 다음 필드
      if (input.id === "paycard__birth" && e.target.value.length === 6) {
        if (validateBirth(input) && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }

      // 유효기간 MM → 자동 YY로 이동
      if (input.id === "paycard__expiry-mm" && e.target.value.length === 2) {
        const yy = paycardModal.querySelector("#paycard__expiry-yy");
        if (yy) yy.focus();
      }

      // 유효기간 YY → MM+YY 검증 후 통과 시 다음 필드로 이동
      if (input.id === "paycard__expiry-yy" && e.target.value.length === 2) {
        const mm = paycardModal.querySelector("#paycard__expiry-mm");
        const yy = paycardModal.querySelector("#paycard__expiry-yy");
        if (validateExpiry(mm, yy) && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });

    // Backspace → 이전 필드 포커스
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  /* --------------------------
     검증 함수
  -------------------------- */
  function setErrorState(inputEl, message) {
    const field = inputEl.closest(".text-field");
    if (!field) return;
    const helper = field.querySelector(".hint-text");
    field.classList.add("caution");
    if (helper) helper.textContent = message;
  }

  function clearErrorState(inputEl) {
    const field = inputEl.closest(".text-field");
    if (!field) return;
    const helper = field.querySelector(".hint-text");
    field.classList.remove("caution");
    if (helper) helper.textContent = "";
  }

  function validateBirth(input) {
    const value = input.value;
    if (!/^\d{6}$/.test(value)) {
      setErrorState(input, "생년월일을 확인해주세요.");
      return false;
    }
    const mm = parseInt(value.slice(2, 4), 10);
    const dd = parseInt(value.slice(4, 6), 10);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
      setErrorState(input, "생년월일을 확인해주세요.");
      return false;
    }
    clearErrorState(input);
    return true;
  }

  function validateExpiry(mmInput, yyInput) {
    const mm = parseInt(mmInput.value, 10);
    const yy = parseInt(yyInput.value, 10);
    let isValid = true;

    if (!(mm >= 1 && mm <= 12)) {
      isValid = false;
    } else {
      const now = new Date();
      const currentYear = parseInt(now.getFullYear().toString().slice(2), 10);
      const currentMonth = now.getMonth() + 1;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        isValid = false;
      }
    }

    const group = mmInput.closest(".expiry-inputs");
    if (!group) return false;

    if (!isValid) {
      group.classList.add("caution");
      group.querySelector(".hint-text").textContent =
        "유효기간을 확인해주세요.";
      return false;
    }

    group.classList.remove("caution");
    group.querySelector(".hint-text").textContent = "";
    return true;
  }
}

/* ==========================
   결제수단 관리 사이드바 > 삭제 버튼 토글
   ========================== */
function initPaycardDeleteToggle() {
  const sidebar = document.querySelector(".payment-method-setting-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const btn = e.target.closest(".paycard-delete-btn");
    if (!btn) return;

    const card = btn.closest(".paycard");
    if (!card) return;

    const isDeleting = card.classList.toggle("deleting");
    btn.textContent = isDeleting ? "삭제 취소" : "삭제";
  });
}

/* ==========================
   결제수단 관리 사이드바 > 라디오 버튼
   ========================== */
function initPaycardRadios() {
  const paycards = document.querySelectorAll(".paycard");

  paycards.forEach((card, index) => {
    const cardName = card.querySelector(".paycard-name").textContent.trim();
    const radioWrapper = card.querySelector(".paycard__radio");
    if (!radioWrapper) return;

    const radioHTML = createRadioButton({
      id: `paycard-radio-${index + 1}`,
      name: "payment-method",
      size: "small",
      variant: "standard",
      checked: index === 0,
      value: cardName,
    });

    radioWrapper.innerHTML = radioHTML;
  });
}
