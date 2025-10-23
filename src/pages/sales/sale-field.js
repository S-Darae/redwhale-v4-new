/* ==================================================
📅 Sales Date Range Initialization
-----------------------------------------------------
💡 Angular 참고:
- <app-date-field [value]="[start, end]" />
- ngAfterViewInit()에서 FilterCalendar 숏컷 자동 선택 처리
- <app-text-field variant="search" /> 로 검색 필드 구성
================================================== */

import "../../components/date-filter/filter-calendar.js";
import { createDateField } from "../../components/date-picker/create-date-field.js";
import "../../components/date-picker/filter-calendar.scss";

import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ==================================================
🗓️ 헤더 - 기본 날짜 범위: 이번 달
================================================== */

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

function formatYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 헤더 DateField 생성 (기본값: 이번 달)
document.querySelector("#sales-header__duration").innerHTML = createDateField({
  id: "date-range-picker-small-header-duration",
  type: "filter",
  size: "small",
  value: [formatYMD(startOfMonth), formatYMD(endOfMonth)],
  placeholder: "기간 선택",
});

/* ==================================================
🏷️ FilterCalendar - “이번 달” 숏컷 자동 선택
================================================== */

requestAnimationFrame(() => {
  const wrapper = document.querySelector("#sales-header__duration");
  const input = document.getElementById(
    "date-range-picker-small-header-duration"
  );

  if (wrapper && input && input._picker) {
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

/* ==================================================
🎛️ 필터 사이드바 - 필드 초기화
================================================== */
// 날짜 필드
document.querySelector("#sales-filter__field--duration").innerHTML =
  createDateField({
    id: "date-filter-small-filter-duration",
    type: "filter",
    size: "small",
    showDuration: false,
    value: ["2025-01-01", "2025-01-31"],
    placeholder: "기간 선택",
  });

// 회원 검색 필드
document.querySelector("#sales-filter__field--user").innerHTML =
  createTextField({
    id: "search-small-sales-user",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  });

// 상품 검색 필드
document.querySelector("#sales-filter__field--product").innerHTML =
  createTextField({
    id: "search-small-sales-product",
    variant: "search",
    size: "small",
    placeholder: "상품 이름 검색",
  });

/* ==================================================
📊 통계 사이드바 - 필드 초기화
================================================== */
document.querySelector("#sales-stats-sidebar__duration").innerHTML =
  createDateField({
    id: "date-filter-small-stats-duration",
    type: "filter",
    size: "small",
    showDuration: false,
    value: ["2025-01-01", "2025-01-31"],
    placeholder: "기간 선택",
  });
