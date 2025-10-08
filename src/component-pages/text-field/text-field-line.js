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
   Line (Normal)
   ========================== */
const lineNormalFields = [
  {
    id: "line-normal-base",
    label: "베이스",
    placeholder: "플레이스 홀더",
    maxlength: 50,
    required: true,
    timer: "03:00",
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "line-normal-caution",
    label: "경고",
    placeholder: "플레이스 홀더",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "line-normal-error",
    label: "에러",
    placeholder: "플레이스 홀더",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "line-normal-success",
    label: "성공",
    placeholder: "플레이스 홀더",
    state: "success",
    value: "입력한 정보",
    helper: "성공 메시지를 입력하세요.",
  },
  { id: "line-normal-default", label: "디폴트", placeholder: "플레이스 홀더" },
  {
    id: "line-normal-required",
    label: "필수",
    placeholder: "필수 입력",
    required: true,
  },
  {
    id: "line-normal-tooltip",
    label: "툴팁",
    placeholder: "플레이스 홀더",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "line-normal-timer",
    label: "타이머",
    placeholder: "플레이스 홀더",
    timer: "03:00",
  },
  {
    id: "line-normal-help",
    label: "도움말",
    placeholder: "플레이스 홀더",
    helper: "도움말을 입력하세요.",
  },
  {
    id: "line-normal-length",
    label: "글자 수 제한",
    placeholder: "최대 50자",
    maxlength: 50,
  },
  {
    id: "line-normal-number",
    label: "숫자",
    placeholder: "숫자만 입력",
    onlyNumber: true,
  },
  {
    id: "line-normal-amount",
    label: "숫자 (단위)",
    align: "right",
    placeholder: "0",
    onlyNumber: true,
    unit: "원",
    comma: true,
  },
  {
    id: "line-normal-leading",
    label: "리딩 텍스트",
    placeholder: "플레이스 홀더",
    leadingText: "http://",
  },
  {
    id: "line-normal-clearfalse",
    label: "X 버튼 숨김",
    placeholder: "플레이스 홀더",
    clearable: false,
  },
  { id: "line-normal-nolabel", placeholder: "노레이블" },
  {
    id: "line-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "플레이스 홀더",
    disabled: true,
  },
  {
    id: "line-normal-disabled-value",
    label: "비활성화 (입력)",
    value: "입력한 정보",
    disabled: true,
  },
];

addFields(
  "line-normal-container",
  { variant: "line", size: "normal" },
  lineNormalFields
);

/* ==========================
   Line (Small)
   ========================== */
const lineSmallFields = lineNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "line-small-container",
  { variant: "line", size: "small" },
  lineSmallFields
);
