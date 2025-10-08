/* ==========================
   Import (필요한 컴포넌트 / 모듈)
   ========================== */
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

/* ==========================
   초기화: 센터 설정 페이지
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 센터 기본 정보 수정 모달 로드
  loadCenterBasicInfoModal();
});

/* ==========================
   검색 영역 토글
   - 검색 버튼 클릭 → 검색창 열림
   - 닫기 버튼 클릭 → 검색창 닫힘
   - ESC 키 → 검색창 닫힘
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document
    .querySelector(".notice-card-search-open-btn .icon--search.icon")
    ?.closest("button");
  const searchWrap = document.querySelector(".notice-card-search-wrap");
  const closeBtn = document.querySelector(".notice-card-search-close-btn");
  const searchInput = document.querySelector(".notice-card-search-wrap input");

  if (!openBtn || !searchWrap || !closeBtn || !searchInput) return;

  const openSearch = () => {
    searchWrap.classList.add("active");
    searchInput.focus();
  };

  const closeSearch = () => {
    searchWrap.classList.remove("active");
    searchInput.blur();
  };

  openBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchWrap.classList.contains("active")) {
      closeSearch();
    }
  });
});

/* ==========================
   검색 입력 필드 생성
   ========================== */
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

/* ==========================
   사이드바 - 공지 제목 입력 필드
   ========================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--title");
  if (el) {
    el.innerHTML = createTextField({
      id: "line-normal-title",
      variant: "line",
      size: "normal",
      placeholder: "공지 제목",
      autofocus: true, // 사이드바 열릴 때 자동 포커스
      dirty: true,
    });
  }
}

/* ==========================
   사이드바 - 공지 기간 (날짜 range picker)
   ========================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--duration");
  if (el) {
    el.innerHTML = createDateField({
      id: "date-range-picker-small-notice-duration",
      type: "range",
      size: "small",
      label: "공지 기간",
      showDuration: false, // 종료일 뒤 ", N일" 표시 숨김
      dirty: true,
    });
  }
}

/* ==========================
   사이드바 - 공지 내용 입력 필드 (textarea)
   ========================== */
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

/* ==========================
   사이드바 - 작성자 드롭다운
   1) 드롭다운 토글 버튼 생성
   2) 드롭다운 메뉴 추가 (아바타 포함)
   3) initializeDropdowns() 로 토글 <-> 메뉴 연결
   ========================== */
{
  const el = document.querySelector("#notice-add-sidebar__field--staff");
  if (el) {
    // 1) 드롭다운 토글 버튼 생성
    el.innerHTML = createTextField({
      id: "dropdown-normal-notice-staff",
      variant: "dropdown",
      size: "small",
      label: "작성자",
      placeholder: "강사 선택",
      dirty: true,
    });

    // 2) 드롭다운 메뉴 생성
    const toggle = document.getElementById("dropdown-normal-notice-staff");
    if (toggle) {
      const menu = createDropdownMenu({
        id: "dropdown-normal-notice-staff-menu",
        size: "small",
        withAvatar: true, // 아바타 표시
        items: [
          {
            title: "김지민",
            avatar: "../../assets/images/user.jpg",
            selected: true,
          },
          { title: "김정아", avatar: "../../assets/images/user.jpg" },
          { title: "김태형", avatar: "../../assets/images/user.jpg" },
          { title: "송지민", avatar: "../../assets/images/user.jpg" },
          { title: "이서", avatar: "../../assets/images/user.jpg" },
          { title: "이휘경", avatar: "../../assets/images/user.jpg" },
        ],
      });

      // 토글과 메뉴 연결 (aria + data-dropdown-target)
      toggle.setAttribute("aria-controls", "dropdown-normal-notice-staff-menu");
      toggle.setAttribute(
        "data-dropdown-target",
        "dropdown-normal-notice-staff-menu"
      );

      toggle.insertAdjacentElement("afterend", menu);
    }

    // 3) 드롭다운 초기화 (토글 <-> 메뉴 이벤트 연결)
    initializeDropdowns();
  }
}
