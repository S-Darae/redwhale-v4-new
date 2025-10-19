/* ======================================================================
   📦 pay.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 결제 페이지 내 결제수단 모달 불러오기 및 초기화
   - 라디오 버튼 / 체크박스 생성
   - 뒤로가기(이전 페이지 이동) 기능 제어
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 모달(fetch) → <app-add-paycard-modal> 컴포넌트로 대체 가능
   - 라디오 / 체크박스 → <app-radio>, <app-checkbox> 바인딩 가능
   - 뒤로가기 → Router.navigateBack() or Location.back() 활용 가능
   ====================================================================== */

/* =========================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ---------------------------------------------------------
   - SCSS 및 JS 컴포넌트 로드
   - 결제수단 추가 모달(fetch용) 모듈 포함
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

/* ======================================================================
   💳 결제수단 추가 모달 (공통 모듈)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 외부 HTML 파일(fetch)로 모달 로드
   - 모달 내부 init 함수(initAddPaycardModal) 실행
   - “결제수단 추가” 버튼 클릭 시 모달 열기
   - 라디오 버튼 / 체크박스 렌더링
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - fetch → <app-modal-add-paycard> 컴포넌트 직접 임포트
   - modal.open() → Service 기반 Dialog.open() 방식으로 교체
   ====================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ 결제수단 모달 HTML 불러오기
  const res = await fetch("../../pages/center-setting/add-paycard-modal.html");
  if (!res.ok) return;

  // 2️⃣ HTML을 body 하단에 삽입
  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);

  // 3️⃣ 모달 내부 로직 초기화 (버튼, 입력 필드 등)
  initAddPaycardModal();

  // 4️⃣ “결제수단 추가” 버튼 클릭 시 모달 오픈
  const openBtn = document.querySelector('[data-modal-open="add-paycard"]');
  if (openBtn) {
    openBtn.addEventListener("click", () => modal.open("add-paycard"));
  }

  // 5️⃣ 라디오 / 체크박스 컴포넌트 렌더링
  initRadioAndCheckbox();
});

/* ======================================================================
   🧩 라디오 버튼 & 체크박스 생성
   ----------------------------------------------------------------------
   ✅ 역할:
   - 결제 방식 선택용 라디오 버튼 그룹 생성
   - 자동결제 동의 체크박스 생성
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - [(ngModel)]으로 양방향 데이터 바인딩 가능
   - 라디오 그룹은 FormControlName="payMethod" 로 관리 가능
   ====================================================================== */
function initRadioAndCheckbox() {
  /* ------------------------------------------------------
     💳 결제 방식 라디오 버튼 세트
     ------------------------------------------------------
     - 신용카드, 다른 결제 방식 옵션 2개 렌더링
     - createRadioButton() 활용
  ------------------------------------------------------ */
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

  /* ------------------------------------------------------
     ☑️ 자동결제 동의 체크박스
     ------------------------------------------------------
     - “매달 자동 결제에 동의합니다.” 문구 포함
     - createCheckbox()로 컴포넌트 생성
  ------------------------------------------------------ */
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

/* ======================================================================
   🔙 뒤로 가기 버튼
   ----------------------------------------------------------------------
   ✅ 역할:
   - 헤더의 .page-header__back-btn 클릭 시 이전 페이지로 이동
   - 히스토리 없을 경우 → 센터 홈으로 이동
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - Location.back() 또는 Router.navigate(['/center-home'])
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".page-header__back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (window.history.length > 1) {
        // 브라우저 히스토리 존재 → 이전 페이지로 이동
        window.history.back();
      } else {
        // 히스토리 없을 경우 → 기본 홈 페이지로 이동
        window.location.href = "../../pages/center-home/center-home.html";
      }
    });
  }
});
