/* =========================================================
   💳 Add Paycard Modal (결제수단 추가 모달)
   ---------------------------------------------------------
   - 결제수단 추가 모달 초기화 + 입력 검증 + 자동 포커스 이동
   - 어떤 페이지에서도 import + initAddPaycardModal() 호출로 재사용 가능
========================================================= */
import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./add-paycard-modal.scss";

/* =========================================================
   결제수단 추가 모달 초기화 (필드 + 검증)
========================================================= */
export function initAddPaycardModal() {
  const paycardModal = document.querySelector(".add-paycard-modal");
  if (!paycardModal) return;

  /* --------------------------
     1️⃣ 카드번호 입력 필드
  -------------------------- */
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

  /* --------------------------
     2️⃣ 생년월일 입력
  -------------------------- */
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

  /* --------------------------
     3️⃣ 유효기간 (MM/YY)
  -------------------------- */
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

  /* --------------------------
     4️⃣ CVC 입력
  -------------------------- */
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

  /* --------------------------
     5️⃣ 비밀번호 앞 2자리
  -------------------------- */
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

  /* --------------------------
     6️⃣ 필드 초기화
  -------------------------- */
  initializeTextFields(paycardModal);

  /* --------------------------
     7️⃣ 입력 이벤트 (포커스 이동 + 검증)
  -------------------------- */
  const inputs = [...paycardModal.querySelectorAll("input.text-field__input")];

  inputs.forEach((input, index) => {
    if (input._bound) return;
    input._bound = true;

    const maxLength = parseInt(input.getAttribute("maxlength"), 10) || null;

    // 입력 시 자동 포커스 이동 / 검증
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

      // 생년월일 → 6자리 입력 후 검증
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

      // 유효기간 YY → 검증 후 다음 필드
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
     8️⃣ 검증 함수
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

  // 🔹 생년월일 검증
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

  // 🔹 유효기간 검증
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
