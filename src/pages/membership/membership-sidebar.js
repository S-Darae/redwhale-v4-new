/* ======================================================================
   📦 membership-sidebar.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원권 추가/수정 사이드바 내부의 드롭다운, 색상 선택, 무제한 체크박스,
     옵션 추가·수정 토글, 메모 토글 등 전반적인 UI 로직 제어
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - Dropdown → @Input() + Output()으로 바인딩
   - TooltipDirective → [attr.data-tooltip] 형태로 대체 가능
   - setupUnlimitedCheckboxToggle → FormControl.disable()/enable() 기반 처리
   - setupOptionToggle → 탭별 상태 관리 로직을 컴포넌트화
   ====================================================================== */

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

/* ======================================================================
   📂 폴더 선택 드롭다운
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원권 등록 시 폴더 선택용 드롭다운 초기화
   - 기본 폴더 리스트를 항목으로 표시
   ====================================================================== */
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

/* ======================================================================
   🎨 색상 선택 드롭다운
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원권 색상 지정용 컬러 드롭다운 생성
   - tooltip으로 색상 선택 안내 표시
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card-color-dropdown");
  if (container) {
    // toggle 생성
    const toggle = createColorDropdownToggle({
      id: "membership-add-sidebar-color-menu",
    });
    toggle.setAttribute("data-tooltip", "회원권 색상");
    toggle.setAttribute("data-tooltip-direction", "top");

    container.innerHTML = "";
    container.appendChild(toggle);

    // color menu 생성
    createColorDropdownMenu({
      id: "membership-add-sidebar-color-menu",
      size: "xs",
    });
  }
  initializeDropdowns();
});

/* ======================================================================
   ✅ 무제한 체크박스 토글
   ----------------------------------------------------------------------
   ✅ 역할:
   - 체크박스가 ON이면 stepper 및 dropdown을 disable 처리
   - OFF 시 다시 활성화
   - 적용 대상: sidebar + 옵션 모달 공통
   ====================================================================== */
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
    const dropdownToggle = group.querySelector(".dropdown__toggle");

    if (!field || !input || !stepperBtns || !checkbox) return;

    // 필드 상태 토글
    const toggleInputDisabled = () => {
      const unlimitedChecked = checkbox.checked;

      if (unlimitedChecked) {
        // stepper 비활성화
        input.disabled = true;
        stepperBtns.forEach((btn) => (btn.disabled = true));
        field.classList.add("disabled");

        // dropdown 비활성화
        if (dropdownToggle) {
          dropdownToggle.setAttribute("disabled", "true");
          dropdownToggle.classList.add("disabled");
        }
      } else {
        // stepper 활성화
        input.disabled = false;
        stepperBtns.forEach((btn) => (btn.disabled = false));
        field.classList.remove("disabled");

        // stepper 하단 (-) 버튼 활성화 여부 갱신
        const value = input.value.trim();
        const num = parseInt(value, 10);
        const minusBtn = field.querySelector(".text-field__stepper-btn--down");
        if (minusBtn) {
          minusBtn.disabled = !value || isNaN(num) || num <= 0;
        }

        // dropdown 활성화
        if (dropdownToggle) {
          dropdownToggle.removeAttribute("disabled");
          dropdownToggle.classList.remove("disabled");
        }
      }
    };

    // 초기 상태 반영
    toggleInputDisabled();

    // 체크박스 상태 변경 시 갱신
    checkbox.addEventListener("change", toggleInputDisabled);

    // 직접 입력 시 버튼 상태 다시 갱신
    input.addEventListener("input", () => {
      if (!checkbox.checked) toggleInputDisabled();
    });
  });
}

/* ======================================================================
   ✅ 옵션 추가 / 수정 토글
   ----------------------------------------------------------------------
   ✅ 역할:
   - 탭 내부 “옵션 추가 / 수정” 버튼 표시 전환
   - 추가된 상태 → 편집 버튼 / 옵션 영역 표시
   - 비추가 상태 → 추가 버튼 / empty 상태 표시
   - 버튼 클릭 시 대응 모달 열림
   ====================================================================== */
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

  // 데이터 상태 확인
  const isUsedAdded = tab.dataset.usedOptionState === "added";
  const isUnusedAdded = tab.dataset.unusedOptionState === "added";

  // 버튼 표시 상태 갱신
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

  // 모달 열기 함수
  const openModal = (type) => {
    const modalId =
      type === "used"
        ? "membership-option-modal--reserv-used"
        : "membership-option-modal--reserv-unused";
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (modal) modal.classList.add("active");
  };

  // 버튼 이벤트 세팅
  const setupButton = (addBtn, editBtn, type) => {
    if (!addBtn || !editBtn) return;

    // 추가 버튼 → 상태 변경 + 모달 열기
    addBtn.addEventListener("click", () => {
      if (type === "used") tab.dataset.usedOptionState = "added";
      else tab.dataset.unusedOptionState = "added";

      setupOptionToggle(tabId);
      openModal(type);
    });

    // 수정 버튼 → 모달 바로 열기
    editBtn.addEventListener("click", () => openModal(type));
  };

  setupButton(addBtnUsed, editBtnUsed, "used");
  setupButton(addBtnUnused, editBtnUnused, "unused");
}

/* ======================================================================
   📑 탭 전환 이후 동작 처리
   ----------------------------------------------------------------------
   ✅ 역할:
   - tab.js에서 탭 전환 시 발생하는 “tab-updated” 이벤트 감지
   - 전환된 탭(panel) 내에서 무제한 체크박스 및 옵션 토글 재적용
   ====================================================================== */
document.addEventListener("tab-updated", (e) => {
  const panel = document.querySelector(`#${e.detail.targetId}`);
  if (!panel) return;

  // 무제한 체크박스 동작 적용
  setupUnlimitedCheckboxToggle(panel);

  // 옵션 추가/수정 버튼 상태 갱신
  setupOptionToggle(e.detail.targetId);
});

/* ======================================================================
   📝 메모 (기본 접힘 상태)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 메모 영역을 접힘/펼침 상태로 토글
   - 접힘 시 첫 줄 요약만 표시
   - caret 아이콘 회전 애니메이션 제어
   ====================================================================== */
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

  // 상태 갱신 함수
  function updateState() {
    if (expanded) {
      memoField.hidden = false;
      if (memoSummary) memoSummary.hidden = true;
      caretIcon?.classList.add("rotated");
    } else {
      memoField.hidden = true;

      // 메모 첫 줄 요약 표시
      const textarea = memoField.querySelector("textarea");
      const text = textarea?.value.trim() || "";
      if (memoSummary) {
        memoSummary.textContent = text ? text.split("\n")[0] : "";
        memoSummary.hidden = !text;
      }

      caretIcon?.classList.remove("rotated");
    }
  }

  // 클릭 시 토글
  memoRow.addEventListener("click", () => {
    expanded = !expanded;
    updateState();
  });

  // 초기 상태 반영
  updateState();
});
