/* ======================================================================
   📦 membership-field.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원권 등록/옵션 모달/탭 내 모든 입력 필드의 공통 렌더링 & 초기화 관리
   - TextField, Stepper, Dropdown, Checkbox, Radio 등 UI 컴포넌트 통합
   - DOM 기반으로 selector를 찾아 필드를 삽입하고 초기화
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - renderField() → <app-field [config]="{type:'stepper',...}">
   - initFieldBehaviors() → AfterViewInit 시 공통 초기화 로직
   - setupUnlimitedCheckboxToggle() → Reactive Form 상태 제어로 대체
   ====================================================================== */

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
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

/* ======================================================================
   🧱 공통 필드 렌더 함수
   ----------------------------------------------------------------------
   ✅ 역할:
   - 지정된 selector 위치에 type별 필드(checkbox, radio, dropdown, text) 삽입
   - dataset.initialized="1"로 중복 렌더 방지
   - scope 인자(document 기본): 특정 DOM 내부 한정 렌더링 지원
   ====================================================================== */
function renderField(selector, options, scope = document) {
  const el = scope.querySelector(selector);
  if (!el) return;

  // 중복 렌더 방지
  if (el.dataset.initialized === "1") return;

  /* --------------------------------------------------
     ✅ Checkbox
     -------------------------------------------------- */
  if (options.type === "checkbox") {
    el.innerHTML = createCheckbox(options);
    el.dataset.initialized = "1";
    return;
  }

  /* --------------------------------------------------
     ✅ Radio
     -------------------------------------------------- */
  if (options.type === "radio") {
    el.innerHTML = createRadioButton(options);
    el.dataset.initialized = "1";
    return;
  }

  /* --------------------------------------------------
     ✅ Dropdown
     --------------------------------------------------
     - createTextField(variant: dropdown) + createDropdownMenu 조합
     - toggle <-> menu 연결 후 initializeDropdowns()로 전체 초기화
     -------------------------------------------------- */
  if (options.type === "dropdown") {
    // 1️⃣ dropdown용 TextField 생성
    el.innerHTML = createTextField({
      id: options.id,
      variant: "dropdown",
      size: options.size || "small",
      label: options.label,
      placeholder: options.placeholder || "옵션 선택",
    });

    // 2️⃣ toggle 및 menu 연결
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

      toggle.insertAdjacentElement("afterend", menu);

      // toggle ↔ menu 연결
      toggle.setAttribute("aria-controls", menuId);
      toggle.setAttribute("data-dropdown-target", menuId);

      // 선택값 반영
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

      // 전역 드롭다운 초기화
      initializeDropdowns(document);
    }

    el.dataset.initialized = "1";
    return;
  }

  /* --------------------------------------------------
     ✅ 일반 TextField / Stepper / Textarea
     -------------------------------------------------- */
  el.innerHTML = createTextField(options);

  // dirty 감지 필드 자동 등록
  el.querySelectorAll(
    "input, select, textarea, button.dropdown__toggle"
  ).forEach((fld) => fld.setAttribute("data-dirty-field", "true"));

  el.dataset.initialized = "1";
}

/* ======================================================================
   ⚙️ 공통 필드 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - 모든 텍스트필드/스텝퍼/비밀번호 토글 등 상호작용 로직 초기화
   - padding 보정 포함 (아이콘, 단위 텍스트 간격 자동 계산)
   ====================================================================== */
function initFieldBehaviors(scope = document) {
  initializeTextFields(scope);
  adjustInputPadding();
  initializePasswordToggle();
  initializeMegaFields(scope);
  initializeSteppers(scope);
}

/* ======================================================================
   🧭 초기 고정 필드 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - 페이지 진입 시 항상 표시되는 필드 렌더링
   - 검색, 폴더명, 회원권명 등 고정 영역
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 🔍 헤더 검색
  renderField("#membership-card-search__field", {
    id: "search-normal-nolabel",
    variant: "search",
    size: "normal",
    placeholder: "회원권 이름 검색",
  });

  // 🔎 예약 가능한 수업 검색
  renderField("#membership-add-ticket-modal__field--search", {
    id: "ticket-search",
    variant: "search",
    size: "small",
    placeholder: "수업 이름 검색",
  });

  // 🧾 사이드바: 회원권 이름
  renderField("#membership-add-sidebar__field--name", {
    id: "line-normal-membership-name",
    variant: "line",
    size: "normal",
    placeholder: "회원권 이름",
    autofocus: true,
    dirty: true,
  });

  // 📁 폴더명 편집 (6개 예시)
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

  // 초기화 실행
  initFieldBehaviors(document);
});

/* ======================================================================
   🧩 탭 패널 mount 시 동적 필드 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - tab-updated 이벤트 발생 시 각 탭(targetId)에 맞는 필드 렌더링
   - 예약 사용 / 미사용 탭 별도 세팅
   ====================================================================== */
document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;
  const panel = document.querySelector(`#${targetId}`);
  if (!panel) return;

  /* --------------------------------------------------
     🗓 예약 사용 탭
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     🧍 예약 미사용 탭
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     📝 공통 메모 필드
     -------------------------------------------------- */
  renderField("#membership-add-sidebar__field--memo", {
    id: "textarea-small-membership-memo",
    variant: "textarea",
    size: "small",
    dirty: true,
  });

  // 필드 초기화
  initFieldBehaviors(panel);
});

/* ======================================================================
   ⚙️ 옵션 모달 전용 필드 (예약 사용)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원권 옵션 모달 내 "예약 사용" 탭 전용 필드 렌더링
   - Stepper + Dropdown + Checkbox 조합
   - scope: 모달 내부 row 영역 기준
   ====================================================================== */
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

/* ======================================================================
   ⚙️ 옵션 모달 전용 필드 (예약 미사용)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원권 옵션 모달 내 "예약 미사용" 탭 전용 필드 렌더링
   - duration, attendance, price 관련 필드 구성
   ====================================================================== */
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

/* ======================================================================
   🧾 내보내기
   ----------------------------------------------------------------------
   - 외부 스크립트에서 공통 렌더링/초기화 함수 사용 가능
   ====================================================================== */
export { initFieldBehaviors, renderField };

/* ======================================================================
   ♾️ 옵션 모달: “무제한” 체크박스 제어
   ----------------------------------------------------------------------
   ✅ 역할:
   - "무제한" 체크박스 선택 시 해당 그룹 내 입력/스텝퍼/드롭다운 비활성화
   - 해제 시 다시 활성화
   - 비활성 상태에서는 .disabled 클래스 추가 (시각적 표현)
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - Reactive Forms로 제어 시, formControl.disable() / enable()로 대체 가능
   - UI 단에서는 [class.disabled]="isUnlimited" 형태로 구현
   ====================================================================== */
function setupUnlimitedCheckboxToggle(scope) {
  if (!scope) return;

  const rows = scope.querySelectorAll(".membership-option-modal__row");
  rows.forEach((row) => {
    const checkboxes = row.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // 상위 그룹 영역 탐색 (종류별 구분)
        const group = checkbox.closest(
          ".membership-option-modal__duration, " +
            ".membership-option-modal__reserv-limit, " +
            ".membership-option-modal__reserv-cancel-limit, " +
            ".membership-option-modal__attendance-limit"
        );
        if (!group) return;

        const isChecked = checkbox.checked;

        // 그룹 내 필드 전체 비활성화 / 활성화 처리
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
