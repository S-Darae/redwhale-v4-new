/**
 * ======================================================================
 * 📢 notice.js — 센터 공지 페이지 스크립트
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 메뉴 내 “공지” 페이지 초기화 및 UI 기능 관리
 * - 검색창 토글, 작성 사이드바 필드(입력/드롭다운/날짜 선택) 생성 및 초기화
 * - 센터 기본 정보 수정 모달(fetch 로드)
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 센터 기본 정보 수정 모달 로드 (loadCenterBasicInfoModal)
 * 2️⃣ 공지 검색창 열기/닫기/ESC 닫기 기능
 * 3️⃣ 검색 입력 필드 생성 (createTextField)
 * 4️⃣ 사이드바 입력 필드 (제목/내용/기간)
 * 5️⃣ 작성자 검색형 드롭다운 (createDropdownMenu + initializeDropdownSearch)
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-notice-page>` 컴포넌트로 변환 시
 *   → `<app-center-setting-menu>`와 함께 구성
 *   → 검색창 토글은 @ViewChild 기반 상태 관리
 *   → createTextField → `<app-text-field>`
 *   → createDropdownMenu → `<app-dropdown withSearch>`
 *   → createDateField → `<app-date-range-picker>`
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
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";

/* ======================================================================
   🏁 초기화 — 센터 설정 “공지” 페이지
   ----------------------------------------------------------------------
   ✅ 기능:
   - 페이지 로드 시 기본 정보 수정 모달 자동 로드
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal();
});

/* ======================================================================
   🔍 공지 검색창 토글
   ----------------------------------------------------------------------
   ✅ 기능:
   - 검색 버튼 클릭 → 검색창 열기
   - 닫기 버튼 클릭 → 검색창 닫기
   - ESC 입력 → 검색창 닫기
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document
    .querySelector(".notice-card-search-open-btn .icon--search.icon")
    ?.closest("button");
  const searchWrap = document.querySelector(".notice-card-search-wrap");
  const closeBtn = document.querySelector(".notice-card-search-close-btn");
  const searchInput = document.querySelector(".notice-card-search-wrap input");

  if (!openBtn || !searchWrap || !closeBtn || !searchInput) return;

  // 🔸 열기
  const openSearch = () => {
    searchWrap.classList.add("active");
    searchInput.focus();
  };

  // 🔸 닫기
  const closeSearch = () => {
    searchWrap.classList.remove("active");
    searchInput.blur();
  };

  // 🔸 버튼 이벤트
  openBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  // 🔸 ESC 키로 닫기
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
   - variant: search → 돋보기 아이콘 자동 포함
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
   📝 사이드바 — 공지 제목 입력 필드
   ----------------------------------------------------------------------
   ✅ 기능:
   - line variant → 라인형 입력 필드
   - autofocus: 사이드바 열릴 때 자동 포커스
   - dirty: true → 수정 감지 (confirm-exit 연동)
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--title");
  if (el) {
    el.innerHTML = createTextField({
      id: "line-normal-title",
      variant: "line",
      size: "normal",
      placeholder: "공지 제목",
      autofocus: true, // 사이드바 열릴 때 포커스
      dirty: true,
    });
  }
}

/* ======================================================================
   📅 사이드바 — 공지 기간 (Date Range Picker)
   ----------------------------------------------------------------------
   ✅ 기능:
   - createDateField(type: "range") → 기간 선택 필드 생성
   - showDuration=false → 종료일 뒤 “, N일” 표시 숨김
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--duration");
  if (el) {
    el.innerHTML = createDateField({
      id: "date-range-picker-small-notice-duration",
      type: "range",
      size: "small",
      label: "공지 기간",
      showDuration: false, // “N일” 표시 숨김
      dirty: true,
    });
  }
}

/* ======================================================================
   💬 사이드바 — 공지 내용 입력 필드 (textarea)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 멀티라인 입력 variant: textarea
   - dirty=true → 수정 감지 (confirm-exit)
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
   👤 사이드바 — 작성자 드롭다운 (검색형)
   ----------------------------------------------------------------------
   ✅ 기능:
   1️⃣ 드롭다운 토글 버튼 생성 (createTextField)
   2️⃣ 드롭다운 메뉴 생성 (withSearch + withAvatar)
   3️⃣ initializeDropdownSearch() + initializeDropdowns() 초기화
   ====================================================================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--staff");
  if (el) {
    // 드롭다운 토글 생성
    el.innerHTML = createTextField({
      id: "dropdown-normal-notice-staff",
      variant: "dropdown",
      size: "small",
      label: "작성자",
      placeholder: "강사 선택",
      dirty: true,
    });

    // 드롭다운 메뉴 생성
    const dropdownToggle = el.querySelector(".dropdown__toggle");
    if (dropdownToggle) {
      const staffItems = [
        {
          title: "김지민",
          subtitle: "010-5774-7421",
          avatar: "/assets/images/user.jpg",
          selected: true,
        },
        {
          title: "김정아",
          subtitle: "010-7825-1683",
          avatar: "/assets/images/user.jpg",
        },
        {
          title: "김태형",
          subtitle: "010-3658-5442",
          avatar: "/assets/images/user.jpg",
        },
        {
          title: "송지민",
          subtitle: "010-3215-5747",
          avatar: "/assets/images/user.jpg",
        },
        {
          title: "이서",
          subtitle: "010-2583-0042",
          avatar: "/assets/images/user.jpg",
        },
        {
          title: "이휘경",
          subtitle: "010-3658-5442",
          avatar: "/assets/images/user.jpg",
        },
      ];

      const menu = createDropdownMenu({
        id: "dropdown-normal-notice-staff-menu",
        size: "small",
        withSearch: true, // 검색 기능 포함
        withAvatar: true, // 아바타 표시
        items: staffItems,
      });

      // 토글 아래에 메뉴 삽입
      dropdownToggle.insertAdjacentElement("afterend", menu);

      // 초기화 (검색 + 드롭다운 동작 연결)
      initializeDropdownSearch(menu);
      initializeDropdowns(el);
    }
  }
}
