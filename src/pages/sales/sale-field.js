/* ==================================================
📅 Sales Header Query Initialization (with Tabs)
--------------------------------------------------
💡 Angular 참고:
- <app-date-field [value]="[start, end]" />
- ngAfterViewInit()에서 FilterCalendar 숏컷 자동 선택 처리
- <app-text-field variant="search" /> 로 검색 필드 구성
================================================== */

import "../../components/date-filter/filter-calendar.js";
import { createDateField } from "../../components/date-picker/create-date-field.js";
import "../../components/date-picker/filter-calendar.scss";

import "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeTextFields,
} from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ==================================================
🗓️ 공통 유틸
--------------------------------------------------
- 오늘 날짜 기준으로 이번 달 시작일·종료일 계산
- YYYY-MM-DD 포맷으로 반환
================================================== */
function formatYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

/* ==================================================
🎛️ 헤더 탭: 검색 / 기간 필드 렌더링
--------------------------------------------------
- “검색” / “기간” 탭 전환 시 각각의 필드 생성
- createTextField(), createDateField() 기반 동적 렌더링
- tab.js의 CustomEvent("tab-updated") 이벤트에 반응
================================================== */

document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;

  /* ----------------------------
  🔍 검색 탭 mount 시 렌더
  ---------------------------- */
  if (targetId === "search-mode-panel-search") {
    const searchContainer = document.querySelector("#sales-header__search");
    if (searchContainer && !searchContainer.hasChildNodes()) {
      searchContainer.innerHTML = createTextField({
        id: "search-small-sales-header-user",
        variant: "search",
        size: "small",
        placeholder: "회원 이름, 전화번호, 상품 검색",
      });

      // 텍스트필드 초기화 (패딩, clear 버튼, placeholder 애니메이션 등)
      initializeTextFields(searchContainer);
      adjustInputPadding(searchContainer);
    }
  }

  /* ----------------------------
  📅 기간 탭 mount 시 렌더
  ---------------------------- */
  if (targetId === "search-mode-panel-date") {
    const dateContainer = document.querySelector("#sales-header__duration");
    if (dateContainer && !dateContainer.hasChildNodes()) {
      dateContainer.innerHTML = createDateField({
        id: "date-range-picker-small-header-duration",
        type: "filter",
        size: "small",
        value: [formatYMD(startOfMonth), formatYMD(endOfMonth)],
        placeholder: "기간 선택",
      });

      // DateField 렌더 완료 후 FilterCalendar 접근
      requestAnimationFrame(() => {
        const input = document.getElementById(
          "date-range-picker-small-header-duration"
        );

        if (input && input._picker) {
          const fc = input._picker; // FilterCalendar 인스턴스

          // “이번 달” 숏컷 요소 탐색
          const shortcutInput = fc.calendarWrap.querySelector(
            ".filter-calendar__shortcuts input[value='이번 달']"
          );
          const shortcutLabel = fc.calendarWrap.querySelector(
            ".filter-calendar__shortcuts label[for='" + shortcutInput?.id + "']"
          );

          // 기본 선택 상태 적용
          if (shortcutInput && shortcutLabel) {
            shortcutInput.checked = true;
            shortcutLabel.classList.add("is-active");
          }

          // 내부 상태 동기화
          fc.core.setRange({
            start: startOfMonth,
            end: endOfMonth,
            fromShortcut: true,
          });
        }
      });
    }
  }
});

/* ==================================================
🎛️ 필터 사이드바 - 필드 초기화
--------------------------------------------------
- sales-filter-sidebar 내의 검색·기간 필드 렌더링
- header query와는 별도 독립 구조
================================================== */

// 날짜 필드
const sidebarDate = document.querySelector("#sales-filter__field--duration");
if (sidebarDate) {
  sidebarDate.innerHTML = createDateField({
    id: "date-filter-small-filter-duration",
    type: "filter",
    size: "small",
    showDuration: false,
    value: ["2025-01-01", "2025-01-31"],
    placeholder: "기간 선택",
  });
}

// 회원 검색 필드
const sidebarUser = document.querySelector("#sales-filter__field--user");
if (sidebarUser) {
  sidebarUser.innerHTML = createTextField({
    id: "search-small-sales-user",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  });
  initializeTextFields(sidebarUser);
  adjustInputPadding(sidebarUser);
}

// 상품 검색 필드
const sidebarProduct = document.querySelector("#sales-filter__field--product");
if (sidebarProduct) {
  sidebarProduct.innerHTML = createTextField({
    id: "search-small-sales-product",
    variant: "search",
    size: "small",
    placeholder: "상품 이름 검색",
  });
  initializeTextFields(sidebarProduct);
  adjustInputPadding(sidebarProduct);
}

/* ==================================================
📊 통계 사이드바 - 필드 초기화
--------------------------------------------------
- sales-stats-sidebar 내 기간 필드 렌더링
================================================== */
const statsDuration = document.querySelector("#sales-stats-sidebar__duration");
if (statsDuration) {
  statsDuration.innerHTML = createDateField({
    id: "date-filter-small-stats-duration",
    type: "filter",
    size: "small",
    showDuration: false,
    value: ["2025-01-01", "2025-01-31"],
    placeholder: "기간 선택",
  });
}
