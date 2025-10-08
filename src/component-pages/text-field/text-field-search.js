import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./text-field.scss";

/* ==========================
   헬퍼 함수
   ========================== */
function addFields(containerId, commonOptions, fieldList) {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  fieldList.forEach((opt) => {
    container.insertAdjacentHTML(
      "beforeend",
      createTextField({ ...commonOptions, ...opt })
    );
  });
}

/* ==========================
   Search (Normal)
   ========================== */
const searchNormalFields = [
  {
    id: "search-normal-base",
    label: "베이스",
    placeholder: "검색",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "search-normal-caution",
    label: "경고",
    state: "caution",
    placeholder: "검색",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "search-normal-error",
    label: "에러",
    state: "error",
    placeholder: "검색",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "search-normal-success",
    label: "성공",
    state: "success",
    value: "검색어",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "search-normal-tooltip",
    label: "툴팁",
    placeholder: "검색",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "search-normal-clearfalse",
    label: "X 버튼 숨김",
    placeholder: "검색",
    clearable: false,
  },
  { id: "search-normal-nolabel", placeholder: "노레이블" },
  {
    id: "search-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "검색",
    disabled: true,
  },
  {
    id: "search-normal-disabled-value",
    label: "비활성화 (입력)",
    value: "검색어",
    disabled: true,
  },
];

addFields(
  "search-normal-container",
  { variant: "search", size: "normal" },
  searchNormalFields
);

/* ==========================
   Search (Small)
   ========================== */
const searchSmallFields = searchNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "search-small-container",
  { variant: "search", size: "small" },
  searchSmallFields
);
