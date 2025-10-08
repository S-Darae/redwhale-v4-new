import "../../components/modal/modal.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeMegaFields,
  initializePasswordToggle,
  initializeSteppers,
  initializeTextFields,
} from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js"; //

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

/* ==========================
   공통 필드 렌더 함수
   --------------------------
   - selector 위치에 지정한 type의 필드를 렌더링
   - Checkbox / Radio / Dropdown / 일반 TextField 지원
   - scope(기본: document) 내에서 검색
   - dataset.initialized="1"로 중복 렌더링 방지
   ========================== */
function renderField(selector, options, scope = document) {
  const el = scope.querySelector(selector);
  if (!el) return;

  // 이미 렌더링된 경우 덮어쓰기 방지
  if (el.dataset.initialized === "1") return;

  // ==========================
  // 체크박스
  // ==========================
  if (options.type === "checkbox") {
    el.innerHTML = createCheckbox(options);
    el.dataset.initialized = "1";
    return;
  }

  // ==========================
  // 라디오 버튼
  // ==========================
  if (options.type === "radio") {
    el.innerHTML = createRadioButton(options);
    el.dataset.initialized = "1";
    return;
  }

  // ==========================
  // 드롭다운
  // --------------------------
  // - TextField + DropdownMenu 조합
  // - toggle과 menu를 연결 후 initializeDropdowns 호출
  // ==========================
  if (options.type === "dropdown") {
    el.innerHTML = createTextField({
      id: options.id,
      variant: "dropdown",
      size: options.size || "small",
      label: options.label,
      placeholder: options.placeholder || "옵션 선택",
    });

    // scope 안에서 toggle 검색
    const toggle = scope.querySelector(`#${options.id}`);
    if (toggle) {
      const menuId = `${options.id}-menu`;
      const menu = createDropdownMenu({
        id: menuId,
        size: options.size || "small",
        withAvatar: options.withAvatar || false,
        withCheckbox: options.withCheckbox || false,
        unit: options.unit || "개",
        items: options.items || [],
      });

      // 메뉴 삽입 (toggle 바로 뒤에)
      toggle.insertAdjacentElement("afterend", menu);

      // toggle <-> menu 연결
      toggle.setAttribute("aria-controls", menuId);
      toggle.setAttribute("data-dropdown-target", menuId);

      // selected 값 반영
      const selectedItem = menu.querySelector(".dropdown__item.selected");
      if (selectedItem) {
        const value =
          selectedItem.dataset.value || selectedItem.textContent.trim();
        toggle.textContent = value;
        toggle.classList.remove("is-placeholder");
      } else {
        toggle.textContent = options.placeholder || "옵션 선택";
        toggle.classList.add("is-placeholder");
      }

      // 반드시 전역 초기화 실행
      initializeDropdowns(document);
    }

    el.dataset.initialized = "1";
    return;
  }

  // ==========================
  // 기본 필드(text, stepper, textarea 등)
  // ==========================
  el.innerHTML = createTextField(options);

  // dirty 속성 자동 추가 (변경 감지용)
  el.querySelectorAll(
    "input, select, textarea, button.dropdown__toggle"
  ).forEach((fld) => fld.setAttribute("data-dirty-field", "true"));

  el.dataset.initialized = "1";
}

/* ==========================
   공통 필드 초기화 (mount 이후)
   --------------------------
   - textField, stepper, password toggle, mega field 초기화
   - padding 보정 포함
   ========================== */
function initFieldBehaviors(scope = document) {
  initializeTextFields(scope);
  adjustInputPadding();
  initializePasswordToggle();
  initializeMegaFields(scope);
  initializeSteppers(scope);
}

/* ==========================
   초기 고정 필드
   --------------------------
   - DOMContentLoaded 시점에 항상 존재하는 필드 렌더링
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 헤더 검색
  renderField("#membership-card-search__field", {
    id: "search-normal-nolabel",
    variant: "search",
    size: "normal",
    placeholder: "회원권 이름 검색",
  });

  // 회원권 추가 모달 검색
  renderField("#membership-add-ticket-modal__field--search", {
    id: "ticket-search",
    variant: "search",
    size: "small",
    placeholder: "회원권 이름 검색",
  });

  // 사이드바: 회원권 이름
  renderField("#membership-add-sidebar__field--name", {
    id: "line-normal-membership-name",
    variant: "line",
    size: "normal",
    placeholder: "회원권 이름",
    autofocus: true,
    dirty: true,
  });

  // 폴더 편집 (6개 예시)
  renderField("#folder-edit-item__field-1", {
    id: "standard-small-folder-name-1",
    variant: "standard",
    size: "small",
    value: "새해 이벤트",
    placeholder: "새해 이벤트",
  });
  renderField("#folder-edit-item__field-2", {
    id: "standard-small-folder-name-2",
    variant: "standard",
    size: "small",
    value: "연말 이벤트",
    placeholder: "연말 이벤트",
  });
  renderField("#folder-edit-item__field-3", {
    id: "standard-small-folder-name-3",
    variant: "standard",
    size: "small",
    value: "현금",
    placeholder: "현금",
  });
  renderField("#folder-edit-item__field-4", {
    id: "standard-small-folder-name-4",
    variant: "standard",
    size: "small",
    value: "카드",
    placeholder: "카드",
  });
  renderField("#folder-edit-item__field-5", {
    id: "standard-small-folder-name-5",
    variant: "standard",
    size: "small",
    value: "일회권",
    placeholder: "일회권",
  });
  renderField("#folder-edit-item__field-6", {
    id: "standard-small-folder-name-6",
    variant: "standard",
    size: "small",
    value: "커스텀",
    placeholder: "커스텀",
  });

  // 공통 필드 초기화
  initFieldBehaviors(document);
});

/* ==========================
   탭 패널 mount 시 동적 필드
   --------------------------
   - tab-updated 커스텀 이벤트 발생 시 실행
   - 각 탭별로 필요한 필드를 동적으로 렌더링
   ========================== */
document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;
  const panel = document.querySelector(`#${targetId}`);
  if (!panel) return;

  // --------------------------
  // 예약 사용 탭
  // --------------------------
  if (targetId === "membership-content1") {
    renderField("#membership-add-sidebar__field--daily-reserv", {
      id: "stepper-small-membership-daily-reserv",
      variant: "stepper",
      size: "small",
      label: "일일 예약",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      required: true,
      dirty: true,
    });
    renderField("#membership-add-sidebar__field--daily-reserv-checkbox", {
      id: "checkbox-unlimited-daily-reserv",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    });

    renderField("#membership-add-sidebar__field--weekly-reserv", {
      id: "stepper-small-membership-weekly-reserv",
      variant: "stepper",
      size: "small",
      label: "주간 예약",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      required: true,
      dirty: true,
    });
    renderField("#membership-add-sidebar__field--weekly-reserv-checkbox", {
      id: "checkbox-unlimited-weekly-reserv",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    });

    renderField("#membership-add-sidebar__field--concurrent-reserv", {
      id: "stepper-small-membership-concurrent-reserv",
      variant: "stepper",
      size: "small",
      label: "동시 예약",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      required: true,
      dirty: true,
    });
    renderField("#membership-add-sidebar__field--concurrent-reserv-checkbox", {
      id: "checkbox-unlimited-concurrent-reserv",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    });
  }

  // --------------------------
  // 예약 미사용 탭
  // --------------------------
  if (targetId === "membership-content2") {
    renderField("#membership-add-sidebar__field--daily-attendance", {
      id: "stepper-small-membership-daily-attendance",
      variant: "stepper",
      size: "small",
      label: "일일 출석",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      required: true,
      dirty: true,
    });
    renderField("#membership-add-sidebar__field--daily-attendance-checkbox", {
      id: "checkbox-unlimited-daily-attendance",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    });

    renderField("#membership-add-sidebar__field--weekly-attendance", {
      id: "stepper-small-membership-weekly-attendance",
      variant: "stepper",
      size: "small",
      label: "주간 출석",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      required: true,
      dirty: true,
    });
    renderField("#membership-add-sidebar__field--weekly-attendance-checkbox", {
      id: "checkbox-unlimited-weekly-attendance",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    });
  }

  // --------------------------
  // 공통 메모 필드
  // --------------------------
  renderField("#membership-add-sidebar__field--memo", {
    id: "textarea-small-membership-memo",
    variant: "textarea",
    size: "small",
    dirty: true,
  });

  // 필드 초기화
  initFieldBehaviors(panel);
});

/* ==========================
   옵션 모달 전용 필드 (예약 사용)
   --------------------------
   - renderReservUsedFields(scope)
   - scope: 모달 내부 row 단위
   - Stepper + Dropdown + Checkbox 조합
   ========================== */
export function renderReservUsedFields(scope) {
  renderField(
    "#membership-option-modal__field--used-duration",
    {
      id: `reserv-used-stepper-duration-${Date.now()}`,
      variant: "stepper",
      size: "small",
      placeholder: "0",
      align: "right",
      clearable: false,
      dirty: true,
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-duration-unit",
    {
      id: `reserv-used-dropdown-duration-unit-${Date.now()}`,
      type: "dropdown",
      size: "small",
      items: [
        { title: "일", selected: true },
        { title: "개월" },
        { title: "년" },
      ],
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-duration-unlimited",
    {
      id: `reserv-used-checkbox-duration-unlimited-${Date.now()}`,
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-reserv",
    {
      id: `reserv-used-stepper-reserv-${Date.now()}`,
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      dirty: true,
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-reserv-unlimited",
    {
      id: `reserv-used-checkbox-reserv-unlimited-${Date.now()}`,
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-reserv-cancel",
    {
      id: `reserv-used-stepper-cancel-${Date.now()}`,
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      dirty: true,
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-cancel-unlimited",
    {
      id: `reserv-used-checkbox-cancel-unlimited-${Date.now()}`,
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-price-type",
    {
      id: `reserv-used-dropdown-price-type-${Date.now()}`,
      type: "dropdown",
      size: "small",
      items: [
        { title: "카드", selected: true },
        { title: "현금" },
        { title: "계좌이체" },
        { title: "미수금" },
      ],
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--used-price",
    {
      id: `reserv-used-price-${Date.now()}`,
      variant: "standard",
      size: "small",
      placeholder: "0",
      align: "right",
      onlyNumber: true,
      unit: "원",
      comma: true,
      dirty: true,
    },
    scope
  );

  initFieldBehaviors(scope);
  setupUnlimitedCheckboxToggle(scope);
}

/* ==========================
   옵션 모달 전용 필드 (예약 미사용)
   --------------------------
   - renderReservUnusedFields(scope)
   - 예약 미사용용 duration, attendance, price 세팅
   ========================== */
export function renderReservUnusedFields(scope) {
  renderField(
    "#membership-option-modal__field--unused-duration",
    {
      id: `reserv-unused-stepper-duration-${Date.now()}`,
      variant: "stepper",
      size: "small",
      placeholder: "0",
      align: "right",
      clearable: false,
      dirty: true,
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-duration-unit",
    {
      id: `reserv-unused-dropdown-duration-unit-${Date.now()}`,
      type: "dropdown",
      size: "small",
      items: [
        { title: "일", selected: true },
        { title: "개월" },
        { title: "년" },
      ],
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-duration-unlimited",
    {
      id: `reserv-unused-checkbox-duration-unlimited-${Date.now()}`,
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-attendance",
    {
      id: `reserv-unused-stepper-attendance-${Date.now()}`,
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "회",
      align: "right",
      clearable: false,
      dirty: true,
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-attendance-unlimited",
    {
      id: `reserv-unused-checkbox-attendance-unlimited-${Date.now()}`,
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "무제한",
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-price-type",
    {
      id: `reserv-unused-dropdown-price-type-${Date.now()}`,
      type: "dropdown",
      size: "small",
      items: [
        { title: "카드", selected: true },
        { title: "현금" },
        { title: "계좌이체" },
        { title: "미수금" },
      ],
    },
    scope
  );

  renderField(
    "#membership-option-modal__field--unused-price",
    {
      id: `reserv-unused-price-${Date.now()}`,
      variant: "standard",
      size: "small",
      placeholder: "0",
      align: "right",
      onlyNumber: true,
      unit: "원",
      comma: true,
      dirty: true,
    },
    scope
  );

  initFieldBehaviors(scope);
  setupUnlimitedCheckboxToggle(scope);
}

export { initFieldBehaviors, renderField };

/* ==========================
   옵션 모달: 무제한 체크박스 제어
   --------------------------
   - "무제한" 체크박스가 켜지면
     → 해당 그룹의 input/stepper/dropdown 비활성화
   - 꺼지면 다시 활성화
   - UI: .disabled 클래스 추가/제거
   ========================== */
function setupUnlimitedCheckboxToggle(scope) {
  if (!scope) return;

  const rows = scope.querySelectorAll(".membership-option-modal__row");
  rows.forEach((row) => {
    const checkboxes = row.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const group = checkbox.closest(
          ".membership-option-modal__duration, " +
            ".membership-option-modal__reserv-limit, " +
            ".membership-option-modal__reserv-cancel-limit, " +
            ".membership-option-modal__attendance-limit"
        );
        if (!group) return;

        const isChecked = checkbox.checked;

        group
          .querySelectorAll(
            ".text-field__input, .text-field__stepper-btn, .dropdown__toggle"
          )
          .forEach((el) => {
            el.disabled = isChecked;
            if (isChecked) {
              el.closest(".text-field")?.classList.add("disabled");
            } else {
              el.closest(".text-field")?.classList.remove("disabled");
            }
          });
      });
    });
  });
}
