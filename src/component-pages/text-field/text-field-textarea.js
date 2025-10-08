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
   Textarea (Normal)
   ========================== */
const textareaNormalFields = [
  {
    id: "textarea-normal-base",
    label: "베이스",
    placeholder: "플레이스 홀더",
    required: true,
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
    maxlength: 300,
  },
  {
    id: "textarea-normal-caution",
    label: "경고",
    placeholder: "플레이스 홀더",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "textarea-normal-error",
    label: "에러",
    placeholder: "플레이스 홀더",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "textarea-normal-success",
    label: "성공",
    placeholder: "플레이스 홀더",
    value: "입력한 정보",
    state: "success",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "textarea-normal-default",
    label: "디폴트",
    placeholder: "플레이스 홀더",
  },
  {
    id: "textarea-normal-required",
    label: "필수",
    placeholder: "필수 입력",
    required: true,
  },
  {
    id: "textarea-normal-tooltip",
    label: "툴팁",
    placeholder: "플레이스 홀더",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "textarea-normal-help",
    label: "도움말",
    placeholder: "플레이스 홀더",
    helper: "도움말을 입력하세요.",
  },
  {
    id: "textarea-normal-length",
    label: "글자 수 제한",
    placeholder: "최대 300자",
    maxlength: 300,
  },
  { id: "textarea-normal-nolabel", placeholder: "노레이블" },
  {
    id: "textarea-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "플레이스 홀더",
    disabled: true,
  },
  {
    id: "textarea-normal-disabled-value",
    label: "비활성화 (입력)",
    value: "입력한 정보",
    disabled: true,
  },
];

addFields(
  "textarea-normal-container",
  { variant: "textarea", size: "normal" },
  textareaNormalFields
);

/* ==========================
   Textarea (Small)
   ========================== */
const textareaSmallFields = textareaNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "textarea-small-container",
  { variant: "textarea", size: "small" },
  textareaSmallFields
);
