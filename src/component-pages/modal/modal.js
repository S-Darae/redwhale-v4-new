import "../../components/modal/modal.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./modal.scss";

document.querySelector("#modal-field").innerHTML = createTextField({
  id: "form-field-test",
  size: "small",
  label: "값 입력 후 취소 테스트",
  placeholder: "",
  dirty: true,
});
