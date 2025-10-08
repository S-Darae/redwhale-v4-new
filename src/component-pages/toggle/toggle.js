import { createToggle } from "../../components/toggle/create-toggle.js";
import "../../components/toggle/toggle.scss";
import "./toggle.scss";

function addToggle(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createToggle(options));
}

/* ==========================
   Standard - with Label
   ========================== */
// Large
addToggle("standard-large", {
  id: "toggle-standard-large1",
  size: "large",
  variant: "standard",
  label: "토글",
});
addToggle("standard-large", {
  id: "toggle-standard-large2",
  size: "large",
  variant: "standard",
  label: "토글",
  checked: true,
});
addToggle("standard-large", {
  id: "toggle-standard-large3",
  size: "large",
  variant: "standard",
  label: "토글",
  disabled: true,
});
addToggle("standard-large", {
  id: "toggle-standard-large4",
  size: "large",
  variant: "standard",
  label: "토글",
  checked: true,
  disabled: true,
});

// Medium
addToggle("standard-medium", {
  id: "toggle-standard-medium1",
  size: "medium",
  variant: "standard",
  label: "토글",
});
addToggle("standard-medium", {
  id: "toggle-standard-medium2",
  size: "medium",
  variant: "standard",
  label: "토글",
  checked: true,
});
addToggle("standard-medium", {
  id: "toggle-standard-medium3",
  size: "medium",
  variant: "standard",
  label: "토글",
  disabled: true,
});
addToggle("standard-medium", {
  id: "toggle-standard-medium4",
  size: "medium",
  variant: "standard",
  label: "토글",
  checked: true,
  disabled: true,
});

// Small
addToggle("standard-small", {
  id: "toggle-standard-small1",
  size: "small",
  variant: "standard",
  label: "토글",
});
addToggle("standard-small", {
  id: "toggle-standard-small2",
  size: "small",
  variant: "standard",
  label: "토글",
  checked: true,
});
addToggle("standard-small", {
  id: "toggle-standard-small3",
  size: "small",
  variant: "standard",
  label: "토글",
  disabled: true,
});
addToggle("standard-small", {
  id: "toggle-standard-small4",
  size: "small",
  variant: "standard",
  label: "토글",
  checked: true,
  disabled: true,
});

/* ==========================
   Standard - no Label
   ========================== */
// Large
addToggle("standard-large-nolabel", {
  id: "toggle-standard-large-nolabel1",
  size: "large",
  variant: "standard",
});
addToggle("standard-large-nolabel", {
  id: "toggle-standard-large-nolabel2",
  size: "large",
  variant: "standard",
  checked: true,
});
addToggle("standard-large-nolabel", {
  id: "toggle-standard-large-nolabel3",
  size: "large",
  variant: "standard",
  disabled: true,
});
addToggle("standard-large-nolabel", {
  id: "toggle-standard-large-nolabel4",
  size: "large",
  variant: "standard",
  checked: true,
  disabled: true,
});

// Medium
addToggle("standard-medium-nolabel", {
  id: "toggle-standard-medium-nolabel1",
  size: "medium",
  variant: "standard",
});
addToggle("standard-medium-nolabel", {
  id: "toggle-standard-medium-nolabel2",
  size: "medium",
  variant: "standard",
  checked: true,
});
addToggle("standard-medium-nolabel", {
  id: "toggle-standard-medium-nolabel3",
  size: "medium",
  variant: "standard",
  disabled: true,
});
addToggle("standard-medium-nolabel", {
  id: "toggle-standard-medium-nolabel4",
  size: "medium",
  variant: "standard",
  checked: true,
  disabled: true,
});

// Small
addToggle("standard-small-nolabel", {
  id: "toggle-standard-small-nolabel1",
  size: "small",
  variant: "standard",
});
addToggle("standard-small-nolabel", {
  id: "toggle-standard-small-nolabel2",
  size: "small",
  variant: "standard",
  checked: true,
});
addToggle("standard-small-nolabel", {
  id: "toggle-standard-small-nolabel3",
  size: "small",
  variant: "standard",
  disabled: true,
});
addToggle("standard-small-nolabel", {
  id: "toggle-standard-small-nolabel4",
  size: "small",
  variant: "standard",
  checked: true,
  disabled: true,
});
