import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";
import "./radio-button.scss";

// Helper 함수
function addRadio(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createRadioButton(options));
}

/* ==========================
   Standard - with Label
   ========================== */
// Medium
addRadio("standard-medium", {
  id: "radio-standard-medium1",
  name: "options_standard_medium_label1",
  size: "medium",
  variant: "standard",
  label: "라디오",
});
addRadio("standard-medium", {
  id: "radio-standard-medium2",
  name: "options_standard_medium_label1",
  size: "medium",
  variant: "standard",
  label: "라디오",
  checked: true,
});
addRadio("standard-medium", {
  id: "radio-standard-medium3",
  name: "options_standard_medium_label2",
  size: "medium",
  variant: "standard",
  label: "라디오",
  disabled: true,
});
addRadio("standard-medium", {
  id: "radio-standard-medium4",
  name: "options_standard_medium_label2",
  size: "medium",
  variant: "standard",
  label: "라디오",
  checked: true,
  disabled: true,
});

// Small
addRadio("standard-small", {
  id: "radio-standard-small1",
  name: "options_standard_small_label1",
  size: "small",
  variant: "standard",
  label: "라디오",
});
addRadio("standard-small", {
  id: "radio-standard-small2",
  name: "options_standard_small_label1",
  size: "small",
  variant: "standard",
  label: "라디오",
  checked: true,
});
addRadio("standard-small", {
  id: "radio-standard-small3",
  name: "options_standard_small_label2",
  size: "small",
  variant: "standard",
  label: "라디오",
  disabled: true,
});
addRadio("standard-small", {
  id: "radio-standard-small4",
  name: "options_standard_small_label2",
  size: "small",
  variant: "standard",
  label: "라디오",
  checked: true,
  disabled: true,
});

/* ==========================
   Standard - no Label
   ========================== */
// Medium
addRadio("standard-medium-nolabel", {
  id: "radio-standard-medium-nolabel1",
  name: "options_standard_medium_no_label1",
  size: "medium",
  variant: "standard",
});
addRadio("standard-medium-nolabel", {
  id: "radio-standard-medium-nolabel2",
  name: "options_standard_medium_no_label1",
  size: "medium",
  variant: "standard",
  checked: true,
});
addRadio("standard-medium-nolabel", {
  id: "radio-standard-medium-nolabel3",
  name: "options_standard_medium_no_label2",
  size: "medium",
  variant: "standard",
  disabled: true,
});
addRadio("standard-medium-nolabel", {
  id: "radio-standard-medium-nolabel4",
  name: "options_standard_medium_no_label2",
  size: "medium",
  variant: "standard",
  checked: true,
  disabled: true,
});

// Small
addRadio("standard-small-nolabel", {
  id: "radio-standard-small-nolabel1",
  name: "options_standard_small_no_label1",
  size: "small",
  variant: "standard",
});
addRadio("standard-small-nolabel", {
  id: "radio-standard-small-nolabel2",
  name: "options_standard_small_no_label1",
  size: "small",
  variant: "standard",
  checked: true,
});
addRadio("standard-small-nolabel", {
  id: "radio-standard-small-nolabel3",
  name: "options_standard_small_no_label2",
  size: "small",
  variant: "standard",
  disabled: true,
});
addRadio("standard-small-nolabel", {
  id: "radio-standard-small-nolabel4",
  name: "options_standard_small_no_label2",
  size: "small",
  variant: "standard",
  checked: true,
  disabled: true,
});

/* ==========================
   Card
   ========================== */
// Border
addRadio("card-border", {
  id: "radio-card-border1",
  name: "options_card_border_label1",
  variant: "card-border",
  label: "라디오",
});
addRadio("card-border", {
  id: "radio-card-border2",
  name: "options_card_border_label1",
  variant: "card-border",
  label: "라디오",
  checked: true,
});
addRadio("card-border", {
  id: "radio-card-border3",
  name: "options_card_border_label2",
  variant: "card-border",
  label: "라디오",
  disabled: true,
});
addRadio("card-border", {
  id: "radio-card-border4",
  name: "options_card_border_label2",
  variant: "card-border",
  label: "라디오",
  checked: true,
  disabled: true,
});

// No Border
addRadio("card-no-border", {
  id: "radio-card-no-border1",
  name: "options_card_no_border_label1",
  variant: "card-no-border",
  label: "라디오",
});
addRadio("card-no-border", {
  id: "radio-card-no-border2",
  name: "options_card_no_border_label1",
  variant: "card-no-border",
  label: "라디오",
  checked: true,
});
addRadio("card-no-border", {
  id: "radio-card-no-border3",
  name: "options_card_no_border_label2",
  variant: "card-no-border",
  label: "라디오",
  disabled: true,
});
addRadio("card-no-border", {
  id: "radio-card-no-border4",
  name: "options_card_no_border_label2",
  variant: "card-no-border",
  label: "라디오",
  checked: true,
  disabled: true,
});
