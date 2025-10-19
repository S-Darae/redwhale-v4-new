import { showToast } from "../../components/feedback/toast.js";
import "./color.scss";

const colorChips = document.querySelectorAll(".color-chip");

colorChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const colorValue = chip.querySelector("span:nth-child(1)").innerText;
    navigator.clipboard.writeText(colorValue).then(() => {
      showToast(`🎨 ${colorValue} 색상값 복사`);
    });
  });
});
