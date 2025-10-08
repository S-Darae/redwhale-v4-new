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
   Stepper (Normal)
   ========================== */
const stepperNormalFields = [
  {
    id: "stepper-normal-base",
    label: "베이스",
    placeholder: "0",
    required: true,
    unit: "회",
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
    timer: "03:00",
  },
  {
    id: "stepper-normal-caution",
    label: "경고",
    placeholder: "0",
    unit: "회",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "stepper-normal-error",
    label: "에러",
    placeholder: "0",
    unit: "회",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "stepper-normal-success",
    label: "성공",
    placeholder: "0",
    unit: "회",
    state: "success",
    value: "10",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "stepper-normal-default",
    label: "디폴트",
    placeholder: "0",
    unit: "회",
  },
  {
    id: "stepper-normal-required",
    label: "필수",
    placeholder: "0",
    unit: "회",
    required: true,
  },
  {
    id: "stepper-normal-tooltip",
    label: "툴팁",
    placeholder: "0",
    unit: "회",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "stepper-normal-timer",
    label: "타이머",
    placeholder: "0",
    unit: "회",
    timer: "03:00",
  },
  {
    id: "stepper-normal-help",
    label: "도움말",
    placeholder: "0",
    unit: "회",
    helper: "도움말을 입력하세요.",
  },
  {
    id: "stepper-normal-amount",
    label: "단위 구분",
    placeholder: "0",
    unit: "회",
    comma: true,
  },
  {
    id: "stepper-normal-clearfalse",
    label: "X 버튼 숨김",
    placeholder: "0",
    unit: "회",
    clearable: false,
  },
  { id: "stepper-normal-nolabel", placeholder: "0", unit: "회" },
  {
    id: "stepper-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "0",
    unit: "회",
    disabled: true,
  },
  {
    id: "stepper-normal-disabled-value",
    label: "비활성화 (입력)",
    placeholder: "0",
    unit: "회",
    value: "10",
    disabled: true,
  },
];

addFields(
  "stepper-normal-container",
  { variant: "stepper", size: "normal" },
  stepperNormalFields
);

/* ==========================
   Stepper (Small)
   ========================== */
const stepperSmallFields = stepperNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "stepper-small-container",
  { variant: "stepper", size: "small" },
  stepperSmallFields
);
