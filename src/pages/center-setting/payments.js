import "../../pages/common/main-menu.js";
import { initAddPaycardModal } from "./add-paycard-modal.js";
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./payments.scss";

import "../../components/badge/badge.js";
import "../../components/button/button.js";
import "../../components/modal/modal.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/dropdown/dropdown.scss";

import { createPagination } from "../../components/button/create-pagination.js";
import "../../components/button/pagination.scss";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

import modal from "../../components/modal/modal.js";
import "../../components/modal/modal.scss";

/* =========================================================
   🧩 초기화: 센터 설정 페이지
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal(); // 센터 기본정보 수정 모달
  initPagination(); // 페이지네이션
  initRowsDropdown(); // 테이블 행 수 선택 드롭다운
  initReceiptModal(); // 결제 상세 모달
  initPaycardDeleteToggle(); // 사이드바 삭제 버튼
  initPaycardRadios(); // 사이드바 라디오 버튼
});

/* =========================================================
   📊 직원 테이블 관련
========================================================= */
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

/* =========================================================
   🧾 결제 상세 정보 모달
========================================================= */
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

/* =========================================================
   🗑️ 결제수단 관리 사이드바 > 삭제 버튼 토글
========================================================= */
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

/* =========================================================
   🔘 결제수단 관리 사이드바 > 라디오 버튼
========================================================= */
function initPaycardRadios() {
  const paycards = document.querySelectorAll(".paycard");

  paycards.forEach((card, index) => {
    const cardName = card.querySelector(".paycard-name")?.textContent.trim();
    const radioWrapper = card.querySelector(".paycard__radio");
    if (!radioWrapper || !cardName) return;

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

/* =========================================================
   💳 결제수단 추가 모달 (공통 모듈)
   ---------------------------------------------------------
   - add-paycard-modal.html 템플릿을 body에 append
   - initAddPaycardModal() 호출로 필드/검증 초기화
   - data-modal-open="add-paycard" 버튼과 연결
========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("./add-paycard-modal.html");
  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);

  initAddPaycardModal(); // 필드 초기화

  // 버튼 클릭으로 모달 열기
  document
    .querySelector('[data-modal-open="add-paycard"]')
    ?.addEventListener("click", () => modal.open("add-paycard"));
});
