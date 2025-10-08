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
   Password (Normal)
   ========================== */
const passwordNormalFields = [
  {
    id: "password-normal-base",
    label: "베이스",
    placeholder: "플레이스 홀더",
    required: true,
    helper: "도움말을 입력하세요.",
    timer: "03:00",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "password-normal-caution",
    label: "경고",
    placeholder: "플레이스 홀더",
    state: "caution",
    helper: "경고 메시지를 입력하세요.",
  },
  {
    id: "password-normal-error",
    label: "에러",
    placeholder: "플레이스 홀더",
    state: "error",
    helper: "에러 메시지를 입력하세요.",
  },
  {
    id: "password-normal-success",
    label: "성공",
    placeholder: "플레이스 홀더",
    value: "password",
    state: "success",
    helper: "성공 메시지를 입력하세요.",
  },
  {
    id: "password-normal-default",
    label: "디폴트",
    placeholder: "플레이스 홀더",
  },
  {
    id: "password-normal-required",
    label: "필수",
    placeholder: "플레이스 홀더",
    required: true,
  },
  {
    id: "password-normal-tooltip",
    label: "툴팁",
    placeholder: "플레이스 홀더",
    tooltip: "툴팁 내용을 입력하세요.",
  },
  {
    id: "password-normal-timer",
    label: "타이머",
    placeholder: "플레이스 홀더",
    timer: "03:00",
  },
  {
    id: "password-normal-help",
    label: "도움말",
    placeholder: "플레이스 홀더",
    helper: "도움말을 입력하세요.",
  },
  { id: "password-normal-nolabel", placeholder: "노레이블" },
  {
    id: "password-normal-disabled-placeholder",
    label: "비활성화 (플레이스 홀더)",
    placeholder: "플레이스 홀더",
    disabled: true,
  },
  {
    id: "password-normal-disabled-value",
    label: "비활성화 (입력한 정보)",
    placeholder: "플레이스 홀더",
    value: "password",
    disabled: true,
  },
];

addFields(
  "password-normal-container",
  { variant: "password", size: "normal" },
  passwordNormalFields
);

/* ==========================
   Password (Small)
   ========================== */
const passwordSmallFields = passwordNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
}));

addFields(
  "password-small-container",
  { variant: "password", size: "small" },
  passwordSmallFields
);
