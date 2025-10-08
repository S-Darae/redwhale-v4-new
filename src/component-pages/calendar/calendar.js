import "../../components/button/button.js";
import FilterCalendar from "../../components/date-filter/filter-calendar.js";
import { createDateField } from "../../components/date-picker/create-date-field.js";
import "../../components/tab/tab.js";
import "../../components/text-field/text-field.scss";
import "./calendar.scss";

/* ==========================
   캘린더
   ========================== */
// 싱글 필드
document.querySelector("#date-picker-container").innerHTML = createDateField({
  id: "date-picker-single",
  type: "single",
  size: "small",
  placeholder: "날짜 선택",
  label: "single",
});

// 레인지 필드
document.querySelector("#date-range-picker-container").innerHTML =
  createDateField({
    id: "date-picker-range",
    type: "range",
    size: "small",
    label: "range",
  });

// 필터 캘린더 (전용 필드)
document.querySelector("#date-filter-container").innerHTML = createDateField({
  id: "filter-calendar-input",
  type: "filter",
  size: "small",
  placeholder: "기간 선택",
});

/* ==========================
   캘린더 항상 열기 (데모 전용)
   ========================== */
requestAnimationFrame(() => {
  // 싱글
  const singleInput = document.getElementById("date-picker-single");
  if (singleInput && singleInput._picker) {
    singleInput._picker.open(singleInput);
    singleInput._picker.close = () => {}; // 닫히지 않게
  }

  // 레인지
  const startInput = document.getElementById("date-picker-range-start");
  if (startInput && startInput._picker) {
    startInput._picker.open(startInput);
    startInput._picker.close = () => {};
    startInput._picker.selecting = "start";
  }
});

/* ==========================
   필터 캘린더 mount
   ========================== */
const filterWrapper = document.getElementById("date-filter-container");
const filterInput = document.getElementById("filter-calendar-input");

if (filterWrapper && filterInput) {
  const fc = new FilterCalendar(filterWrapper, {
    mode: "range",
    shortcuts: true,
    onChange: ({ start, end, formatted }) => {
      filterInput.value = formatted || "";
    },
  });

  // DatePicker와 동일하게 접근할 수 있게
  filterInput._picker = fc;

  // 데모: 항상 열기
  requestAnimationFrame(() => {
    fc.open();
  });
}
