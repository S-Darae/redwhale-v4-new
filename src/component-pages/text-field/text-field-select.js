import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";
import "./text-field.scss";

/* ==========================
   헬퍼 함수
   ========================== */
function addFields(containerId, commonOptions, fieldList) {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  fieldList.forEach((opt) => {
    const fullOpt = { ...commonOptions, ...opt };
    const { id, variant } = fullOpt;

    // 텍스트필드 추가
    container.insertAdjacentHTML("beforeend", createTextField(fullOpt));

    // 드롭다운 메뉴 추가
    if (["dropdown", "leading-select", "tailing-select"].includes(variant)) {
      const items =
        fullOpt.items ||
        fullOpt.leadingSelect?.options ||
        fullOpt.tailingSelect?.options ||
        [];
      if (items.length > 0) {
        const target = document.getElementById(id);
        if (target) {
          const menuId = `${id}-menu`;
          target.insertAdjacentElement(
            "afterend",
            createDropdownMenu({
              id: menuId,
              items,
              placeholder: fullOpt.placeholder || "옵션 선택",
              size: fullOpt.menuSize || fullOpt.size || "normal",
            })
          );
        }
      }
    }
  });
}

/* ==========================
   공통 셀렉트 옵션
   ========================== */
const leadingSelectConfig = {
  options: ["옵션 1", "옵션 2", "옵션 3"],
  default: "옵션 1",
};

const tailingSelectConfig = {
  options: ["옵션 1", "옵션 2", "옵션 3"],
  default: "옵션 1",
};

/* ==========================
   Leading Select (Normal)
   ========================== */
const leadingSelectNormalFields = [
  {
    id: "leading-select-normal-base",
    label: "베이스",
    placeholder: "플레이스 홀더",
    maxlength: 50,
    required: true,
    timer: "03:00",
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-caution",
    label: "경고",
    placeholder: "플레이스 홀더",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-error",
    label: "에러",
    placeholder: "플레이스 홀더",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-success",
    label: "성공",
    placeholder: "플레이스 홀더",
    state: "success",
    value: "입력한 정보",
    helper: "성공 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-default",
    label: "디폴트",
    placeholder: "플레이스 홀더",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-required",
    label: "필수",
    placeholder: "필수 입력",
    required: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-tooltip",
    label: "툴팁",
    placeholder: "플레이스 홀더",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-timer",
    label: "타이머",
    placeholder: "플레이스 홀더",
    timer: "03:00",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-help",
    label: "도움말",
    placeholder: "플레이스 홀더",
    helper: "도움말을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-length",
    label: "글자 수 제한",
    placeholder: "최대 50자",
    maxlength: 50,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-number",
    label: "숫자",
    placeholder: "숫자만 입력",
    onlyNumber: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-amount",
    label: "숫자 (단위)",
    align: "right",
    placeholder: "0",
    onlyNumber: true,
    unit: "원",
    comma: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-clearfalse",
    label: "X 버튼 숨김",
    placeholder: "플레이스 홀더",
    clearable: false,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-nolabel",
    placeholder: "노레이블",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "플레이스 홀더",
    disabled: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "leading-select-normal-disabled-value",
    label: "비활성화 (입력)",
    value: "입력한 정보",
    disabled: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
];

addFields(
  "leading-select-normal-container",
  {
    variant: "leading-select",
    size: "small",
    leadingSelect: leadingSelectConfig,
    defaultValue: leadingSelectConfig.default,
  },
  leadingSelectNormalFields
);

/* ==========================
   Leading Select (Small)
   ========================== */
const leadingSelectSmallFields = leadingSelectNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "leading-select-small-container",
  {
    variant: "leading-select",
    size: "small",
    leadingSelect: leadingSelectConfig,
    defaultValue: tailingSelectConfig.default,
  },
  leadingSelectSmallFields
);

/* ==========================
   Tailing Select (Normal)
   ========================== */
const tailingSelectNormalFields = [
  {
    id: "tailing-select-normal-base",
    label: "베이스",
    placeholder: "플레이스 홀더",
    maxlength: 50,
    required: true,
    timer: "03:00",
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-caution",
    label: "경고",
    placeholder: "플레이스 홀더",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-error",
    label: "에러",
    placeholder: "플레이스 홀더",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-success",
    label: "성공",
    placeholder: "플레이스 홀더",
    state: "success",
    value: "입력한 정보",
    helper: "성공 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-default",
    label: "디폴트",
    placeholder: "플레이스 홀더",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-required",
    label: "필수",
    placeholder: "필수 입력",
    required: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-tooltip",
    label: "툴팁",
    placeholder: "플레이스 홀더",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-timer",
    label: "타이머",
    placeholder: "플레이스 홀더",
    timer: "03:00",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-help",
    label: "도움말",
    placeholder: "플레이스 홀더",
    helper: "도움말을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-length",
    label: "글자 수 제한",
    placeholder: "최대 50자",
    maxlength: 50,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-number",
    label: "숫자",
    placeholder: "숫자만 입력",
    onlyNumber: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-amount",
    label: "숫자 (단위)",
    align: "right",
    placeholder: "0",
    onlyNumber: true,
    unit: "원",
    comma: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-clearfalse",
    label: "X 버튼 숨김",
    placeholder: "플레이스 홀더",
    clearable: false,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-nolabel",
    placeholder: "노레이블",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "플레이스 홀더",
    disabled: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "tailing-select-normal-disabled-value",
    label: "비활성화 (입력)",
    value: "입력한 정보",
    disabled: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
];

addFields(
  "tailing-select-normal-container",
  {
    variant: "tailing-select",
    size: "small",
    tailingSelect: tailingSelectConfig,
  },
  tailingSelectNormalFields
);

/* ==========================
   Tailing Select (Small)
   ========================== */
const tailingSelectSmallFields = tailingSelectNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "tailing-select-small-container",
  {
    variant: "tailing-select",
    size: "small",
    tailingSelect: tailingSelectConfig,
  },
  tailingSelectSmallFields
);

/* ==========================
   Dropdown (Normal)
   ========================== */
const dropdownNormalFields = [
  {
    id: "dropdown-normal-base",
    label: "베이스",
    placeholder: "옵션 선택",
    required: true,
    helper: "도움말을 입력하세요.",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-caution",
    label: "경고",
    placeholder: "옵션 선택",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-error",
    label: "에러",
    placeholder: "옵션 선택",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-success",
    label: "성공",
    placeholder: "옵션 선택",
    state: "success",
    helper: "성공 메시지를 입력하세요.",
    items: [
      {
        title: "옵션 1",
      },
      {
        title: "옵션 2",
        selected: true,
      },
      {
        title: "옵션 3",
      },
    ],
  },
  {
    id: "dropdown-normal-default",
    label: "디폴트",
    placeholder: "옵션 선택",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-required",
    label: "필수",
    placeholder: "필수 선택",
    required: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-tooltip",
    label: "툴팁",
    placeholder: "옵션 선택",
    tooltip: "툴팁 내용을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-timer",
    label: "타이머",
    placeholder: "옵션 선택",
    timer: "03:00",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-help",
    label: "도움말",
    placeholder: "옵션 선택",
    helper: "도움말을 입력하세요.",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-nolabel",
    placeholder: "노레이블",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-disabled-placeholder",
    label: "비활성화 (미입력)",
    placeholder: "옵션 선택",
    disabled: true,
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
  {
    id: "dropdown-normal-disabled-value",
    label: "비활성화 (입력)",
    placeholder: "옵션 선택",
    disabled: true,
    value: "옵션 1",
    items: ["옵션 1", "옵션 2", "옵션 3"],
  },
];

addFields(
  "dropdown-normal-container",
  { variant: "dropdown", size: "normal" },
  dropdownNormalFields
);

/* ==========================
   Dropdown (Small)
   ========================== */
const dropdownSmallFields = dropdownNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "dropdown-small-container",
  { variant: "dropdown", size: "small" },
  dropdownSmallFields
);

/* ==========================
   Select Demo
   ========================== */
addFields(
  "select-demo-container",
  {
    variant: "leading-select",
    size: "small",
    label: "전화번호",
    leadingSelect: {
      options: ["010", "011", "016", "017", "018", "019"],
      default: "010",
    },
    items: ["010", "011", "016", "017", "018", "019"],
  },
  [{ id: "leading-select-demo" }]
);

addFields(
  "select-demo-container",
  {
    variant: "tailing-select",
    size: "small",
    label: "기간",
    onlyNumber: true,
    clearable: false,
    placeholder: "0",
    tailingSelect: { options: ["일", "주", "월"], default: "일" },
    items: ["일", "주", "월"],
  },
  [{ id: "tailing-select-demo" }]
);

/* ==========================
   전화번호 입력 포맷 (leading-select 연동)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(
    "input.text-field__input#leading-select-demo"
  );

  if (input) {
    input.addEventListener("input", () => {
      let raw = input.value.replace(/\D/g, "").slice(0, 8); // 최대 8자리

      if (raw.length <= 3) {
        input.value = raw;
      } else if (raw.length <= 7) {
        input.value = raw.slice(0, 3) + "-" + raw.slice(3);
      } else {
        input.value = raw.slice(0, 4) + "-" + raw.slice(4);
      }
    });
  }

  initializeDropdowns();
});
