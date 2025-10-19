/**
 * ======================================================================
 * 👥 staff.js — 센터 설정 > 직원 관리 페이지
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 메뉴 중 “직원 관리” 페이지의 주요 스크립트
 * - 센터 기본 정보 수정 모달 로드
 * - 직원 테이블(페이지네이션 / 행 수 선택)
 * - 직원 추가 사이드바(토글 / 입력 필드 / 전화번호 포맷)
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 센터 기본 정보 수정 모달(fetch 로드)
 * 2️⃣ 직원 테이블 페이지네이션 및 행 수 선택
 * 3️⃣ 직원 추가 사이드바 입력 필드/토글/전화번호 포맷팅
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-staff-page>` 컴포넌트로 구성
 *   → `<app-center-setting-menu>` 포함
 * - createTextField → `<app-text-field>`
 * - createToggle → `<app-toggle>`
 * - 전화번호 포맷(initPhoneInputs) → `Directive`로 전환
 * - createPagination / createDropdownMenu → `<app-pagination>`, `<app-dropdown>`
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - staff.scss
 * - dropdown.scss / text-field.scss / pagination.scss / toggle.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import "../../pages/common/main-menu.js";
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./staff.scss";

import "../../components/badge/badge.js";
import "../../components/button/button.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tab/tab.js";
import "../../components/toggle/toggle.js";
import "../../components/tooltip/tooltip.js";

import "../../components/text-field/create-text-field.js";
import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/dropdown/dropdown.scss";

import { createPagination } from "../../components/button/create-pagination.js";
import "../../components/button/pagination.scss";

import { createToggle } from "../../components/toggle/create-toggle.js";

/* ======================================================================
   🏁 초기화: 센터 설정 페이지 (직원 관리)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 센터 기본 정보 수정 모달(fetch 로드)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal();
});

/* ======================================================================
   📊 직원 테이블 관련
   ----------------------------------------------------------------------
   ✅ 기능:
   - 페이지네이션 생성
   - 행 수 선택 드롭다운 생성 및 선택 시 표시 변경
   ====================================================================== */

/**
 * 📄 페이지네이션 초기화
 */
document.addEventListener("DOMContentLoaded", () => {
  const pagination = createPagination(1, 1, "small", (p) =>
    console.log("페이지:", p)
  );
  document.getElementById("staff-table__pagination")?.appendChild(pagination);
});

/**
 * 📋 행 수 선택 드롭다운 초기화
 */
document.addEventListener("DOMContentLoaded", () => {
  createDropdownMenu({
    id: "staff-table-rows-menu",
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
});

/**
 * 🧮 행 수 변경 처리 (데이터 연동 시 수정)
 */
function setRowsPerPage(n) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}

/* ======================================================================
   👤 직원 추가 사이드바 (Staff Add Sidebar)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 계정 연동 토글
   - 이름 / 전화번호 / 이메일 입력 필드 생성
   - 전화번호 필드에 포맷팅 로직(initPhoneInputs) 적용
   ====================================================================== */

/* --------------------------------------------------
   1️⃣ 계정 연동 토글 생성
   -------------------------------------------------- */
{
  const toggleContainer = document.getElementById(
    "staff-add-sidebar__toggle--account"
  );
  if (toggleContainer) {
    toggleContainer.insertAdjacentHTML(
      "beforeend",
      createToggle({
        id: "toggle-staff-account",
        size: "small",
        variant: "standard",
        label: "계정 연동",
      })
    );
  }
}

/* --------------------------------------------------
   2️⃣ 이름 입력 필드
   -------------------------------------------------- */
{
  const el = document.querySelector("#staff-add-sidebar__field--name");
  if (el) {
    el.innerHTML = createTextField({
      id: "line-small-name",
      variant: "line",
      size: "small",
      placeholder: "이름",
      autofocus: true, // 사이드바 열릴 때 자동 포커스
      dirty: true, // 변경 감지 (confirm-exit)
    });
  }
}

/* --------------------------------------------------
   3️⃣ 전화번호 입력 필드 (포맷팅 적용)
   -------------------------------------------------- */
{
  const el = document.querySelector("#staff-add-sidebar__field--phone");
  if (el) {
    el.innerHTML = createTextField({
      id: "standard-small-phone",
      variant: "standard",
      size: "small",
      label: "전화번호",
      dirty: true,
      extraAttrs: 'data-format="tel"', // 전화번호 포맷 지정
    });

    // 전화번호 포맷팅 + 유효성 검사 로직 적용
    initPhoneInputs(el);
  }
}

/* --------------------------------------------------
   4️⃣ 이메일 입력 필드
   -------------------------------------------------- */
{
  const el = document.querySelector("#staff-add-sidebar__field--email");
  if (el) {
    el.innerHTML = createTextField({
      id: "standard-small-email",
      variant: "standard",
      size: "small",
      label: "이메일 주소",
      dirty: true,
    });
  }
}
