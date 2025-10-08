import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";

// 센터 이름
document.querySelector("#center-create__field--name").innerHTML =
  createTextField({
    id: "line-normal-name",
    variant: "line",
    size: "normal",
    placeholder: "센터 이름을 입력해 주세요.",
    autofocus: true,
  });

// 전화번호
const contactField = document.querySelector("#center-create__field--contact");
contactField.insertAdjacentHTML(
  "beforeend",
  createTextField({
    id: "standard-small-contact",
    variant: "standard",
    size: "small",
    extraAttrs: 'data-format="tel"',
  })
);

initPhoneInputs(contactField);

// 주소
document.querySelector("#center-create__field--address-1").innerHTML =
  createTextField({
    id: "standard-small-address-1",
    variant: "standard",
    size: "small",
    leadingText: "(48400)",
    value: "부산 남구 전포대로 133",
    disabled: true,
  });

document.querySelector("#center-create__field--address-2").innerHTML =
  createTextField({
    id: "standard-small-address-1",
    variant: "standard",
    size: "small",
    placeholder: "상세 주소",
    value: "13층",
  });
