/**
 * ======================================================================
 * 📢 notice.js — 센터 공지 페이지 스크립트
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 하위 메뉴 중 "공지" 페이지 초기화 스크립트
 * - 검색창 토글, 공지 작성 사이드바 입력 필드/드롭다운/기간 선택 기능 관리
 * - 기본 정보 수정 모달(fetch 로드) 포함
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 센터 기본 정보 수정 모달 로드 (loadCenterBasicInfoModal)
 * 2️⃣ 공지 검색창 열기/닫기/ESC 닫기 기능
 * 3️⃣ 공지 검색 입력 필드(createTextField)
 * 4️⃣ 사이드바 내부 입력 필드 및 날짜 선택(createDateField)
 * 5️⃣ 작성자 드롭다운 생성 + 초기화 (createDropdownMenu + initializeDropdowns)
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-notice-page>` 컴포넌트 구성
 *   → `<app-center-setting-menu>`와 조합
 * - 검색창 토글은 `@ViewChild` 기반 상태 제어
 * - createTextField → `<app-text-field>` 변환
 * - createDropdownMenu → `<app-dropdown>` 변환
 * - Date range picker → `<app-date-range-picker>`
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - notice.scss
 * - dropdown.scss / text-field.scss / date-picker.scss (공통)
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import "../../pages/common/main-menu.js";
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./notice.scss";

import "../../components/button/button.js";
import "../../components/dropdown/dropdown.js";
import "../../components/dropdown/dropdown.scss";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";

import "../../components/date-picker/calendar.js";
import { createDateField } from "../../components/date-picker/create-date-field.js";

import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

/* ======================================================================
   🏁 초기화: 센터 설정 페이지 (공지)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 페이지 로드 시 기본 정보 수정 모달 로드
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal();
});

/* ======================================================================
   🔍 공지 검색 영역 토글
   ----------------------------------------------------------------------
   ✅ 기능:
   - 검색 버튼 클릭 → 검색창 열림
   - 닫기 버튼 클릭 → 검색창 닫힘
   - ESC 키 입력 → 검색창 닫힘
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document
    .querySelector(".notice-card-search-open-btn .icon--search.icon")
    ?.closest("button");
  const searchWrap = document.querySelector(".notice-card-search-wrap");
  const closeBtn = document.querySelector(".notice-card-search-close-btn");
  const searchInput = document.querySelector(".notice-card-search-wrap input");

  if (!openBtn || !searchWrap || !closeBtn || !searchInput) return;

  // 검색창 열기
  const openSearch = () => {
    searchWrap.classList.add("active");
    searchInput.focus();
  };

  // 검색창 닫기
  const closeSearch = () => {
    searchWrap.classList.remove("active");
    searchInput.blur();
  };

  // 버튼 클릭 시 열기/닫기
  openBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchWrap.classList.contains("active")) {
      closeSearch();
    }
  });
});

/* ======================================================================
   🧾 검색 입력 필드 생성
   ----------------------------------------------------------------------
   ✅ 기능:
   - 상단 공지 검색 영역에 텍스트 필드 생성
   - variant: search → 검색 아이콘 포함
   ====================================================================== */
{
  const el = document.querySelector("#notice-card-search");
  if (el) {
    el.innerHTML = createTextField({
      id: "search-normal-notice-card-search",
      variant: "search",
      size: "normal",
      placeholder: "공지 제목, 내용 검색",
    });
  }
}

/* ======================================================================
   📝 사이드바 - 공지 제목 입력 필드
   ----------------------------------------------------------------------
   ✅ 기능:
   - line variant → 라인형 입력 필드
   - autofocus: 사이드바 열릴 때 자동 포커스
   - dirty: true → 수정 감지 (confirm-exit)
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--title");
  if (el) {
    el.innerHTML = createTextField({
      id: "line-normal-title",
      variant: "line",
      size: "normal",
      placeholder: "공지 제목",
      autofocus: true,
      dirty: true,
    });
  }
}

/* ======================================================================
   📅 사이드바 - 공지 기간 (날짜 range picker)
   ----------------------------------------------------------------------
   ✅ 기능:
   - createDateField(type: "range")로 기간 선택 필드 생성
   - showDuration=false → “N일” 표시 숨김
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--duration");
  if (el) {
    el.innerHTML = createDateField({
      id: "date-range-picker-small-notice-duration",
      type: "range",
      size: "small",
      label: "공지 기간",
      showDuration: false,
      dirty: true,
    });
  }
}

/* ======================================================================
   💬 사이드바 - 공지 내용 입력 필드 (textarea)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 멀티라인 입력 variant: textarea
   - dirty=true → 수정 감지
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--body");
  if (el) {
    el.innerHTML = createTextField({
      id: "textarea-small-notice-body",
      variant: "textarea",
      size: "small",
      label: "공지 내용",
      dirty: true,
    });
  }
}

/* ======================================================================
   👤 사이드바 - 작성자 드롭다운
   ----------------------------------------------------------------------
   ✅ 기능:
   1️⃣ 드롭다운 토글 버튼(createTextField)
   2️⃣ 드롭다운 메뉴(createDropdownMenu)
   3️⃣ initializeDropdowns()로 토글 ↔ 메뉴 연결
   ----------------------------------------------------------------------
   - withAvatar: true → 작성자 아바타 표시
   - selected: true → 기본 선택 항목 지정
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--staff");
  if (el) {
    // 1️⃣ 드롭다운 토글 생성
    el.innerHTML = createTextField({
      id: "dropdown-normal-notice-staff",
      variant: "dropdown",
      size: "small",
      label: "작성자",
      placeholder: "강사 선택",
      dirty: true,
    });

    // 2️⃣ 드롭다운 메뉴 생성
    const toggle = document.getElementById("dropdown-normal-notice-staff");
    if (toggle) {
      const menu = createDropdownMenu({
        id: "dropdown-normal-notice-staff-menu",
        size: "small",
        withAvatar: true,
        items: [
          {
            title: "김지민",
            avatar: "/assets/images/user.jpg",
            selected: true,
          },
          { title: "김정아", avatar: "/assets/images/user.jpg" },
          { title: "김태형", avatar: "/assets/images/user.jpg" },
          { title: "송지민", avatar: "/assets/images/user.jpg" },
          { title: "이서", avatar: "/assets/images/user.jpg" },
          { title: "이휘경", avatar: "/assets/images/user.jpg" },
        ],
      });

      // 3️⃣ 토글과 메뉴 연결 (aria + data-dropdown-target)
      toggle.setAttribute("aria-controls", "dropdown-normal-notice-staff-menu");
      toggle.setAttribute(
        "data-dropdown-target",
        "dropdown-normal-notice-staff-menu"
      );
      toggle.insertAdjacentElement("afterend", menu);
    }

    // 4️⃣ 드롭다운 초기화 (토글 ↔ 메뉴 동작 연결)
    initializeDropdowns();
  }
}
