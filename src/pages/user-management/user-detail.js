import "../../pages/common/main-menu.js";
import "./tabs/tabs.js";
import "./user-detail-tab.js";
import "./user-detail.scss";

import "../../components/button/button.js";
import "../../components/tab/tab.js";
import "../../components/tooltip/tooltip.js";

import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ==========================
   회원 메모 필드
   ========================== */
document.querySelector("#member-info__field--memo").innerHTML = createTextField(
  {
    id: "textarea-small-memo",
    variant: "textarea",
    size: "small",
    placeholder: "회원 메모",
    value: "홈에서 표는 최대 7줄까지",
  }
);

/* ==========================
   회원 주요 정보 (토글)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".member-info__summary-header");
  const body = document.querySelector(".member-info__summary-body");
  const icon = header.querySelector(".icon");

  header.addEventListener("click", () => {
    const isCollapsed = body.classList.toggle("collapsed");

    icon.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
  });
});
