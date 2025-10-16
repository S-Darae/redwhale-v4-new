/* =========================================================
   📦 Import (필요한 컴포넌트 / 모듈)
========================================================= */
import "./pay.scss";

import "../../components/badge/badge.js";
import "../../components/button/button.js";
import "../../components/table/table.js";

import "../../components/checkbox/checkbox.js";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import modal from "../../components/modal/modal.js";
import "../../components/modal/modal.scss";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.js";

import { initAddPaycardModal } from "../../pages/center-setting/add-paycard-modal.js";

/* =========================================================
   💳 결제수단 추가 모달 (공통 모듈)
========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  // 결제수단 모달 불러오기
  const res = await fetch("../../pages/center-setting/add-paycard-modal.html");
  if (!res.ok) return;

  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);
  initAddPaycardModal();

  // 버튼 클릭 시 모달 열기
  const openBtn = document.querySelector('[data-modal-open="add-paycard"]');
  if (openBtn) {
    openBtn.addEventListener("click", () => modal.open("add-paycard"));
  }

  // 라디오 버튼 / 체크박스 컴포넌트 렌더링
  initRadioAndCheckbox();
});

/* =========================================================
   🧩 라디오 버튼 & 체크박스 생성
========================================================= */
function initRadioAndCheckbox() {
  /* -----------------------------
     결제 방식 라디오 버튼 세트
  ----------------------------- */
  const radioContainer = document.querySelector(".payment-method-group");
  if (radioContainer) {
    const radios = [
      createRadioButton({
        id: "pay-method-card",
        name: "pay-method",
        size: "small",
        label: "신용카드",
        checked: true,
      }),
      createRadioButton({
        id: "pay-method-other",
        name: "pay-method",
        size: "small",
        label: "다른 결제 방식 옵션",
      }),
    ];
    radioContainer.innerHTML = radios.join("");
  }

  /* -----------------------------
     자동결제 동의 체크박스
  ----------------------------- */
  const checkboxContainer = document.querySelector(
    ".checkout-summary__checkbox"
  );
  if (checkboxContainer) {
    checkboxContainer.innerHTML = createCheckbox({
      id: "auto-payment-agree",
      size: "medium",
      label: "매달 자동 결제에 동의합니다.",
    });
  }
}

/* -----------------------------
     뒤로 가기
  ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".page-header__back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back(); // 브라우저 이전 페이지로 이동
      } else {
        window.location.href = "../../pages/center-home/center-home.html"; // 히스토리 없으면 기본 홈으로
      }
    });
  }
});
