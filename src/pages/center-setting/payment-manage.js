/**
 * ======================================================================
 * 💳 payments.js — 센터 설정 > 결제 관리 페이지
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 메뉴 중 “이용권 결제 관리” 페이지의 핵심 스크립트
 * - 테이블, 페이지네이션, 드롭다운, 결제 상세 모달, 사이드바 내 라디오/삭제버튼 기능 관리
 * - 결제수단 추가 모달(add-paycard-modal.html) 연동
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 센터 기본 정보 수정 모달(fetch 로드)
 * 2️⃣ 페이지네이션 초기화 (createPagination)
 * 3️⃣ 테이블 행 수 선택 드롭다운 (createDropdownMenu)
 * 4️⃣ 결제 상세 모달(receipt) 미리보기 전환
 * 5️⃣ 결제수단 관리 사이드바 — 삭제 버튼 토글
 * 6️⃣ 결제수단 관리 사이드바 — 라디오 버튼 동적 생성
 * 7️⃣ 결제수단 추가 모달(add-paycard-modal) 동적 로드 및 초기화
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-payments-page>` 컴포넌트로 구성
 *   → `<app-center-setting-menu>` 포함
 * - pagination, dropdown, modal, radio는 각각 재사용 가능한 컴포넌트로 분리
 * - fetch → `HttpClient`로 템플릿 로드 (ng-template 사용)
 * - modal.open() → Angular ModalService 기반으로 전환
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - payments.scss
 * - modal.scss / button.scss / radio-button.scss / dropdown.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import "../common/main-menu.js";
import { initAddPaycardModal } from "./add-paycard-modal.js";
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./payment-manage.scss";

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

/* ======================================================================
   🏁 초기화: 센터 설정 페이지 (결제 관리)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 주요 초기화 함수 실행
   - 모달, 테이블, 드롭다운, 사이드바 등 구성요소 활성화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal(); // 센터 기본정보 수정 모달 로드
  initPagination(); // 페이지네이션 초기화
  initRowsDropdown(); // 테이블 행 수 선택 드롭다운
  initReceiptModal(); // 결제 상세 모달
  initPaycardDeleteToggle(); // 결제수단 삭제 버튼 토글
  initPaycardRadios(); // 결제수단 라디오 버튼 초기화
});

/* ======================================================================
   📊 결제내역 테이블 관련
   ----------------------------------------------------------------------
   ✅ 기능:
   - 페이지네이션 생성
   - 행 수 선택 드롭다운 생성 및 이벤트 처리
   ====================================================================== */

/**
 * 📄 페이지네이션 생성
 */
function initPagination() {
  const pagination = createPagination(1, 1, "small", (p) =>
    console.log("페이지:", p)
  );
  document
    .getElementById("payments-table__pagination")
    ?.appendChild(pagination);
}

/**
 * 📋 테이블 행 수 선택 드롭다운 초기화
 */
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

/**
 * 🧮 선택된 행 수 적용
 * @param {number} n - 한 페이지당 행 수
 */
function setRowsPerPage(n) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}

/* ======================================================================
   🧾 결제 상세 정보 모달 (Receipt Modal)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 결제내역 행 클릭 시 상세 모달 열기
   - 클릭된 행의 type 클래스(payments-table--{type})를 기준으로
     해당 receipt-preview 활성화
   ====================================================================== */
function initReceiptModal() {
  const modalOverlay = document.querySelector('[data-modal="receipt"]');
  if (!modalOverlay) return;

  const previews = modalOverlay.querySelectorAll(".receipt-preview");

  // 각 결제 행 클릭 시 모달 열기
  document.querySelectorAll(".payments-table--body").forEach((row) => {
    row.addEventListener("click", () => {
      // type 추출 (예: payments-table--refund → refund)
      const typeClass = [...row.classList].find(
        (cls) =>
          cls.startsWith("payments-table--") && cls !== "payments-table--body"
      );
      const type = typeClass?.replace("payments-table--", "");
      if (!type) return;

      // 모든 preview 숨기기
      previews.forEach((preview) => preview.classList.remove("active"));

      // 해당 type preview 활성화 후 모달 열기
      const target = modalOverlay.querySelector(`.receipt-preview--${type}`);
      if (target) {
        target.classList.add("active");
        modal.open("receipt");
      }
    });
  });
}

/* ======================================================================
   🗑️ 결제수단 관리 사이드바 > 삭제 버튼 토글
   ----------------------------------------------------------------------
   ✅ 기능:
   - “삭제” 버튼 클릭 시 paycard에 deleting 클래스 토글
   - 텍스트도 “삭제” ↔ “삭제 취소”로 전환
   ====================================================================== */
function initPaycardDeleteToggle() {
  const sidebar = document.querySelector(".payment-method-setting-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const btn = e.target.closest(".paycard-delete-btn");
    if (!btn) return;

    const card = btn.closest(".paycard");
    if (!card) return;

    // 삭제 모드 토글
    const isDeleting = card.classList.toggle("deleting");
    btn.textContent = isDeleting ? "삭제 취소" : "삭제";
  });
}

/* ======================================================================
   🔘 결제수단 관리 사이드바 > 라디오 버튼 생성
   ----------------------------------------------------------------------
   ✅ 기능:
   - 각 paycard 요소 내부에 radio-button 삽입
   - 첫 번째 항목은 checked 기본 선택
   ====================================================================== */
function initPaycardRadios() {
  const paycards = document.querySelectorAll(".paycard");

  paycards.forEach((card, index) => {
    const cardName = card.querySelector(".paycard-name")?.textContent.trim();
    const radioWrapper = card.querySelector(".paycard__radio");
    if (!radioWrapper || !cardName) return;

    // 라디오 버튼 생성
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

/* ======================================================================
   💳 결제수단 추가 모달 (공통 모듈)
   ----------------------------------------------------------------------
   ✅ 기능:
   - add-paycard-modal.html 템플릿 fetch로 로드 후 body에 append
   - initAddPaycardModal() 호출로 필드 및 검증 로직 초기화
   - data-modal-open="add-paycard" 버튼 클릭 시 모달 오픈
   ====================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("./add-paycard-modal.html");
  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);

  // 필드 초기화 및 검증 로직 등록
  initAddPaycardModal();

  // 버튼 클릭으로 모달 열기
  document
    .querySelector('[data-modal-open="add-paycard"]')
    ?.addEventListener("click", () => modal.open("add-paycard"));
});
