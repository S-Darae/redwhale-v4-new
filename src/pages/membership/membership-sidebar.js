import {
  createColorDropdownMenu,
  createColorDropdownToggle,
} from "../../components/dropdown/create-dropdown-color.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import "../../components/dropdown/dropdown-color.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/dropdown/dropdown.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";

/* ==========================
   📂 폴더 선택 드롭다운
   ========================== */
createDropdownMenu({
  id: "membership-add-sidebar-folder-menu",
  size: "xs",
  items: [
    { title: "새해 이벤트", leadingIcon: "icon--folder-fill", selected: true },
    { title: "연말 이벤트", leadingIcon: "icon--folder-fill" },
    { title: "현금", leadingIcon: "icon--folder-fill" },
    { title: "카드", leadingIcon: "icon--folder-fill" },
    { title: "일회권", leadingIcon: "icon--folder-fill" },
    { title: "커스텀", leadingIcon: "icon--folder-fill" },
  ],
});
initializeDropdowns();

/* ==========================
   🎨 색상 선택 드롭다운
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card-color-dropdown");
  if (container) {
    const toggle = createColorDropdownToggle({
      id: "membership-add-sidebar-color-menu",
    });
    toggle.setAttribute("data-tooltip", "회원권 색상");
    toggle.setAttribute("data-tooltip-direction", "top");
    container.innerHTML = "";
    container.appendChild(toggle);

    createColorDropdownMenu({
      id: "membership-add-sidebar-color-menu",
      size: "xs",
    });
  }
  initializeDropdowns();
});

/* ==========================
   ✅ 무제한 체크박스 토글
   - stepper + 버튼 + 드롭다운 disable 처리
   ========================== */
export function setupUnlimitedCheckboxToggle(container) {
  if (!container) return;

  const fieldGroups = container.querySelectorAll(
    ".membership-add-sidebar__field-group, " +
      ".membership-option-modal__duration, " +
      ".membership-option-modal__reserv-limit, " +
      ".membership-option-modal__reserv-cancel-limit, " +
      ".membership-option-modal__attendance-limit"
  );

  fieldGroups.forEach((group) => {
    const field = group.querySelector(".text-field"); // stepper 필드
    const input = field?.querySelector("input.text-field__input");
    const stepperBtns = field?.querySelectorAll(".text-field__stepper-btn");
    const checkbox = group.querySelector("input[type='checkbox']");
    const dropdownToggle = group.querySelector(".dropdown__toggle"); // 드롭다운

    if (!field || !input || !stepperBtns || !checkbox) return;

    const toggleInputDisabled = () => {
      const unlimitedChecked = checkbox.checked;

      if (unlimitedChecked) {
        // stepper
        input.disabled = true;
        stepperBtns.forEach((btn) => (btn.disabled = true));
        field.classList.add("disabled");

        // dropdown
        if (dropdownToggle) {
          dropdownToggle.setAttribute("disabled", "true");
          dropdownToggle.classList.add("disabled");
        }
      } else {
        // stepper
        input.disabled = false;
        stepperBtns.forEach((btn) => (btn.disabled = false));
        field.classList.remove("disabled");

        const value = input.value.trim();
        const num = parseInt(value, 10);
        const minusBtn = field.querySelector(".text-field__stepper-btn--down");
        if (minusBtn) {
          minusBtn.disabled = !value || isNaN(num) || num <= 0;
        }

        // dropdown
        if (dropdownToggle) {
          dropdownToggle.removeAttribute("disabled");
          dropdownToggle.classList.remove("disabled");
        }
      }
    };

    toggleInputDisabled();
    checkbox.addEventListener("change", toggleInputDisabled);
    input.addEventListener("input", () => {
      if (!checkbox.checked) toggleInputDisabled();
    });
  });
}

/* ==========================
   ✅ 옵션 추가/수정 토글
   ========================== */
function setupOptionToggle(tabId) {
  const tab = document.getElementById(tabId);
  if (!tab) return;

  const addBtnUsed = tab.querySelector(".add-option-btn--reserv-used");
  const editBtnUsed = tab.querySelector(".edit-option-btn--reserv-used");
  const addBtnUnused = tab.querySelector(".add-option-btn--reserv-unused");
  const editBtnUnused = tab.querySelector(".edit-option-btn--reserv-unused");

  const emptyWrap = tab.querySelector(
    ".membership-add-sidebar__option-wrap--empty"
  );
  const optionWrap = tab.querySelector(".membership-add-sidebar__option-wrap");

  const isUsedAdded = tab.dataset.usedOptionState === "added";
  const isUnusedAdded = tab.dataset.unusedOptionState === "added";

  // 버튼 표시 상태
  if (addBtnUsed)
    addBtnUsed.style.display = isUsedAdded ? "none" : "inline-flex";
  if (editBtnUsed)
    editBtnUsed.style.display = isUsedAdded ? "inline-flex" : "none";

  if (addBtnUnused)
    addBtnUnused.style.display = isUnusedAdded ? "none" : "inline-flex";
  if (editBtnUnused)
    editBtnUnused.style.display = isUnusedAdded ? "inline-flex" : "none";

  if (emptyWrap)
    emptyWrap.style.display = isUsedAdded || isUnusedAdded ? "none" : "block";
  if (optionWrap)
    optionWrap.style.display = isUsedAdded || isUnusedAdded ? "block" : "none";

  const openModal = (type) => {
    const modalId =
      type === "used"
        ? "membership-option-modal--reserv-used"
        : "membership-option-modal--reserv-unused";
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (modal) modal.classList.add("active");
  };

  const setupButton = (addBtn, editBtn, type) => {
    if (!addBtn || !editBtn) return;

    addBtn.addEventListener("click", () => {
      if (type === "used") tab.dataset.usedOptionState = "added";
      else tab.dataset.unusedOptionState = "added";

      setupOptionToggle(tabId);
      openModal(type);
    });

    editBtn.addEventListener("click", () => openModal(type));
  };

  setupButton(addBtnUsed, editBtnUsed, "used");
  setupButton(addBtnUnused, editBtnUnused, "unused");
}

/* ==========================
   📑 탭 전환 이후 동작 처리
   ========================== */
document.addEventListener("tab-updated", (e) => {
  const panel = document.querySelector(`#${e.detail.targetId}`);
  if (!panel) return;

  // 무제한 체크박스 토글
  setupUnlimitedCheckboxToggle(panel);

  // 옵션 토글
  setupOptionToggle(e.detail.targetId);
});

/* ==========================
   📝 메모 (기본 접힘)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const memoRow = document.querySelector(
    ".membership-add-sidebar__row-header.membership-add-sidebar__memo-toggle"
  );
  const memoWrap = document.querySelector(".membership-add-sidebar__memo-wrap");
  const memoSummary = memoWrap?.querySelector(
    ".membership-add-sidebar__memo-summary"
  );
  const memoField = memoWrap?.querySelector(
    "#membership-add-sidebar__field--memo"
  );
  const caretIcon = memoRow?.querySelector(".icon");

  if (!memoRow || !memoWrap || !memoField) return;

  let expanded = false;
  function updateState() {
    if (expanded) {
      memoField.hidden = false;
      if (memoSummary) memoSummary.hidden = true;
      caretIcon?.classList.add("rotated");
    } else {
      memoField.hidden = true;
      const textarea = memoField.querySelector("textarea");
      const text = textarea?.value.trim() || "";
      if (memoSummary) {
        memoSummary.textContent = text ? text.split("\n")[0] : "";
        memoSummary.hidden = !text;
      }
      caretIcon?.classList.remove("rotated");
    }
  }

  memoRow.addEventListener("click", () => {
    expanded = !expanded;
    updateState();
  });

  updateState();
});
