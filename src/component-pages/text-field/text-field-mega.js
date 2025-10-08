import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./text-field.scss";

/* ==========================
   헬퍼 함수
   ========================== */
function addFields(containerId, fields) {
  const container = document.querySelector(containerId);
  if (!container) return;

  fields.forEach((field) => {
    container.insertAdjacentHTML("beforeend", createTextField(field));
  });
}

/* ==========================
   Mega (Normal)
   ========================== */
const megaNormalFields = [
  {
    id: "mega-normal-base",
    variant: "mega",
    size: "normal",
    label: "베이스",
    required: true,
    onlyNumber: true,
  },
  {
    id: "mega-normal-caution",
    variant: "mega",
    size: "normal",
    label: "경고",
    state: "caution",
    onlyNumber: true,
  },
  {
    id: "mega-normal-error",
    variant: "mega",
    size: "normal",
    label: "에러",
    state: "error",
    onlyNumber: true,
  },
  {
    id: "mega-normal-success",
    variant: "mega",
    size: "normal",
    label: "성공",
    state: "success",
    value: "1",
    onlyNumber: true,
  },
  {
    id: "mega-normal-default",
    variant: "mega",
    size: "normal",
    label: "디폴트",
    onlyNumber: true,
  },
  {
    id: "mega-normal-nolabel",
    variant: "mega",
    size: "normal",
    onlyNumber: true,
  },
  {
    id: "mega-normal-disabled-placeholder",
    variant: "mega",
    size: "normal",
    label: "비활성화 (미입력)",
    disabled: true,
    onlyNumber: true,
  },
  {
    id: "mega-normal-disabled-value",
    variant: "mega",
    size: "normal",
    label: "비활성화 (입력)",
    value: "1",
    disabled: true,
    onlyNumber: true,
  },
];

addFields("#mega-normal-container", megaNormalFields);

/* ==========================
   Mega (Small)
   ========================== */
const megaSmallFields = megaNormalFields.map((field) => ({
  ...field,
  id: field.id.replace("normal", "small"),
  size: "small",
}));

addFields("#mega-small-container", megaSmallFields);

/* ==========================
   Mega Demo (인증번호)
   ========================== */
const megaDemoContainer = document.querySelector("#mega-demo-container");
if (megaDemoContainer) {
  for (let i = 0; i < 4; i++) {
    megaDemoContainer.insertAdjacentHTML(
      "beforeend",
      createTextField({
        id: `mega-normal-base-${i}`,
        variant: "mega",
        size: "normal",
        label: i === 0 ? "인증번호" : "",
        required: true,
        onlyNumber: true,
      })
    );
  }
}
