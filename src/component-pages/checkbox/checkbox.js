import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import "./checkbox.scss";

// Helper 함수
function addCheckbox(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createCheckbox(options));
}

/* ==========================
   Standard - with Label
   ========================== */
// Medium
addCheckbox("standard-medium", {
  id: "chk-standard-medium1",
  size: "medium",
  variant: "standard",
  label: "체크박스",
});
addCheckbox("standard-medium", {
  id: "chk-standard-medium2",
  size: "medium",
  variant: "standard",
  label: "체크박스",
  checked: true,
});
addCheckbox("standard-medium", {
  id: "chk-standard-medium4",
  size: "medium",
  variant: "standard",
  label: "체크박스",
  disabled: true,
});
addCheckbox("standard-medium", {
  id: "chk-standard-medium5",
  size: "medium",
  variant: "standard",
  label: "체크박스",
  checked: true,
  disabled: true,
});

// Small
addCheckbox("standard-small", {
  id: "chk-standard-small1",
  size: "small",
  variant: "standard",
  label: "체크박스",
});
addCheckbox("standard-small", {
  id: "chk-standard-small2",
  size: "small",
  variant: "standard",
  label: "체크박스",
  checked: true,
});
addCheckbox("standard-small", {
  id: "chk-standard-small4",
  size: "small",
  variant: "standard",
  label: "체크박스",
  disabled: true,
});
addCheckbox("standard-small", {
  id: "chk-standard-small5",
  size: "small",
  variant: "standard",
  label: "체크박스",
  checked: true,
  disabled: true,
});

/* ==========================
   Standard - no Label
   ========================== */
// Medium
addCheckbox("standard-medium-nolabel", {
  id: "chk-standard-medium-nolabel1",
  size: "medium",
  variant: "standard",
});
addCheckbox("standard-medium-nolabel", {
  id: "chk-standard-medium-nolabel2",
  size: "medium",
  variant: "standard",
  checked: true,
});
addCheckbox("standard-medium-nolabel", {
  id: "chk-standard-medium-nolabel4",
  size: "medium",
  variant: "standard",
  disabled: true,
});
addCheckbox("standard-medium-nolabel", {
  id: "chk-standard-medium-nolabel5",
  size: "medium",
  variant: "standard",
  checked: true,
  disabled: true,
});

// Small
addCheckbox("standard-small-nolabel", {
  id: "chk-standard-small-nolabel1",
  size: "small",
  variant: "standard",
});
addCheckbox("standard-small-nolabel", {
  id: "chk-standard-small-nolabel2",
  size: "small",
  variant: "standard",
  checked: true,
});
addCheckbox("standard-small-nolabel", {
  id: "chk-standard-small-nolabel4",
  size: "small",
  variant: "standard",
  disabled: true,
});
addCheckbox("standard-small-nolabel", {
  id: "chk-standard-small-nolabel5",
  size: "small",
  variant: "standard",
  checked: true,
  disabled: true,
});

/* ==========================
   Ghost - with Label
   ========================== */
// Medium
addCheckbox("ghost-medium", {
  id: "chk-ghost-medium1",
  size: "medium",
  variant: "ghost",
  label: "체크박스",
});
addCheckbox("ghost-medium", {
  id: "chk-ghost-medium2",
  size: "medium",
  variant: "ghost",
  label: "체크박스",
  checked: true,
});
addCheckbox("ghost-medium", {
  id: "chk-ghost-medium4",
  size: "medium",
  variant: "ghost",
  label: "체크박스",
  disabled: true,
});
addCheckbox("ghost-medium", {
  id: "chk-ghost-medium5",
  size: "medium",
  variant: "ghost",
  label: "체크박스",
  checked: true,
  disabled: true,
});

// Small
addCheckbox("ghost-small", {
  id: "chk-ghost-small1",
  size: "small",
  variant: "ghost",
  label: "체크박스",
});
addCheckbox("ghost-small", {
  id: "chk-ghost-small2",
  size: "small",
  variant: "ghost",
  label: "체크박스",
  checked: true,
});
addCheckbox("ghost-small", {
  id: "chk-ghost-small4",
  size: "small",
  variant: "ghost",
  label: "체크박스",
  disabled: true,
});
addCheckbox("ghost-small", {
  id: "chk-ghost-small5",
  size: "small",
  variant: "ghost",
  label: "체크박스",
  checked: true,
  disabled: true,
});

/* ==========================
   Ghost - no Label
   ========================== */
// Medium
addCheckbox("ghost-medium-nolabel", {
  id: "chk-ghost-medium-nolabel1",
  size: "medium",
  variant: "ghost",
});
addCheckbox("ghost-medium-nolabel", {
  id: "chk-ghost-medium-nolabel2",
  size: "medium",
  variant: "ghost",
  checked: true,
});
addCheckbox("ghost-medium-nolabel", {
  id: "chk-ghost-medium-nolabel4",
  size: "medium",
  variant: "ghost",
  disabled: true,
});
addCheckbox("ghost-medium-nolabel", {
  id: "chk-ghost-medium-nolabel5",
  size: "medium",
  variant: "ghost",
  checked: true,
  disabled: true,
});

// Small
addCheckbox("ghost-small-nolabel", {
  id: "chk-ghost-small-nolabel1",
  size: "small",
  variant: "ghost",
});
addCheckbox("ghost-small-nolabel", {
  id: "chk-ghost-small-nolabel2",
  size: "small",
  variant: "ghost",
  checked: true,
});
addCheckbox("ghost-small-nolabel", {
  id: "chk-ghost-small-nolabel4",
  size: "small",
  variant: "ghost",
  disabled: true,
});
addCheckbox("ghost-small-nolabel", {
  id: "chk-ghost-small-nolabel5",
  size: "small",
  variant: "ghost",
  checked: true,
  disabled: true,
});
