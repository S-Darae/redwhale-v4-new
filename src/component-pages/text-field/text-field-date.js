import { createDateField } from "../../components/date-picker/create-date-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./text-field.scss";

/* ==========================
   공통 헬퍼
   ========================== */
function addFields(containerId, commonOptions, fieldList) {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  fieldList.forEach((opt) => {
    container.insertAdjacentHTML(
      "beforeend",
      createDateField({ ...commonOptions, ...opt })
    );
  });
}

/* ==========================
   Date (Normal)
   ========================== */
const dateNormalFields = [
  {
    id: "date-picker-normal-base",
    label: "베이스",
    placeholder: "날짜 선택",
    required: true,
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "date-picker-normal-caution",
    label: "경고",
    placeholder: "날짜 선택",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "date-picker-normal-error",
    label: "에러",
    placeholder: "날짜 선택",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "date-picker-normal-success",
    label: "성공",
    value: "2025-01-01",
    placeholder: "날짜 선택",
    state: "success",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "date-picker-normal-default",
    label: "디폴트",
    placeholder: "날짜 선택",
  },
  {
    id: "date-picker-normal-required",
    label: "필수",
    placeholder: "날짜 선택",
    required: true,
  },
  {
    id: "date-picker-normal-tooltip",
    label: "툴팁",
    placeholder: "날짜 선택",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "date-picker-normal-help",
    label: "도움말",
    placeholder: "날짜 선택",
    helper: "도움말을 입력하세요.",
  },
  {
    id: "date-picker-normal-nolabel",
    placeholder: "노레이블",
  },
  {
    id: "date-picker-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "날짜 선택",
    disabled: true,
  },
  {
    id: "date-picker-normal-disabled-value",
    label: "비활성화 (입력)",
    placeholder: "날짜 선택",
    value: "2025-01-01",
    disabled: true,
  },
];
addFields(
  "date-picker-normal-container",
  { type: "single", size: "normal" },
  dateNormalFields
);

/* ==========================
   Date (Small)
   ========================== */
const dateSmallFields = dateNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "date-picker-small-container",
  { type: "single", size: "small" },
  dateSmallFields
);

/* ==========================
   Date-Range (Normal)
   ========================== */
const dateRangeNormalFields = [
  {
    id: "date-range-picker-normal-base",
    label: "베이스",
    placeholder: "기간 선택",
    required: true,
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "date-range-picker-normal-caution",
    label: "경고",
    placeholder: "기간 선택",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "date-range-picker-normal-error",
    label: "에러",
    placeholder: "기간 선택",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "date-range-picker-normal-success",
    label: "성공",
    value: ["2025-01-01", "2025-01-10"],
    placeholder: "기간 선택",
    state: "success",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "date-range-picker-normal-default",
    label: "디폴트",
    placeholder: "기간 선택",
  },
  {
    id: "date-range-picker-normal-required",
    label: "필수",
    placeholder: "기간 선택",
    required: true,
  },
  {
    id: "date-range-picker-normal-tooltip",
    label: "툴팁",
    placeholder: "기간 선택",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "date-range-picker-normal-help",
    label: "도움말",
    placeholder: "기간 선택",
    helper: "도움말을 입력하세요.",
  },
  {
    id: "date-range-picker-normal-no-preset",
    label: "종료일 프리셋 숨김",
    placeholder: "기간 선택",
    presets: false,
  },
  {
    id: "date-range-picker-normal-nolabel",
    placeholder: "노레이블",
  },
  {
    id: "date-range-picker-normal-disabled-placeholder",
    label: "비활성화 - 미입력",
    placeholder: "기간 선택",
    disabled: true,
  },
  {
    id: "date-range-picker-normal-disabled-value",
    label: "비활성화 - 입력",
    placeholder: "기간 선택",
    value: ["2025-01-01", "2025-01-10"],
    disabled: true,
  },
  {
    id: "date-range-picker-normal-disabled-start",
    label: "시작일만 비활성화",
    placeholder: "기간 선택",
    value: ["2025-01-01", ""],
    disabled: { start: true },
  },
  {
    id: "date-range-picker-normal-disabled-end",
    label: "종료일만 비활성화",
    placeholder: "기간 선택",
    value: ["", "2025-01-01"],
    disabled: { end: true },
  },
];
addFields(
  "date-range-picker-normal-container",
  { type: "range", size: "normal" },
  dateRangeNormalFields
);

/* ==========================
   Date-Range (Small)
   ========================== */
const dateRangeSmallFields = dateRangeNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "date-range-picker-small-container",
  { type: "range", size: "small" },
  dateRangeSmallFields
);
