import "./color.scss";
import "../common/top-button.scss";
import "../../components/feedback/toast.scss";

const colorChips = document.querySelectorAll(".color-chip");

colorChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const colorValue = chip.querySelector("span:nth-child(1)").innerText;
    navigator.clipboard.writeText(colorValue).then(() => {
      // 전역 showToast 호출
      showToast(`🎨 ${colorValue} 색상값 복사`);
    });
  });
});
