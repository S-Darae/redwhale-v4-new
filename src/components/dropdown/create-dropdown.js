import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeTextFields,
} from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./dropdown.scss";

/* =====================================================================
📂 Dropdown Utility Functions
=====================================================================
드롭다운 UI 컴포넌트를 구성하는 공통 유틸 함수 모음.
- 사이즈 매핑
- 토글 버튼 생성
- 메뉴 리스트 생성
- 다중선택(checkbox) 시 chip 표시 갱신 등

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 형태
    <app-dropdown
      [items]="options"
      [size]="'small'"
      [withCheckbox]="true"
      [withSearch]="false"
      (change)="onSelect($event)">
    </app-dropdown>

2️⃣ Angular Inputs
    @Input() items: any[] = [];
    @Input() size: 'normal' | 'small' | 'xs' = 'normal';
    @Input() withCheckbox = false;
    @Input() withAvatar = false;
    @Input() withSearch = false;
    @Input() required = false;
    @Input() disabled = false;

3️⃣ Angular Outputs
    @Output() change = new EventEmitter<any>();

4️⃣ Angular 내부 구조
    - createDropdownToggle() → Template `<button>` 로 대체
    - createDropdownMenu() → Template `<ul>` + `ngFor` 렌더링
    - 이벤트 바인딩 및 상태관리 → Component 내부에서 직접 처리
===================================================================== */

/* ============================================================
   🧩 드롭다운 사이즈 → 체크박스 사이즈 매핑
   ------------------------------------------------------------
   dropdown size 값에 따른 checkbox 크기 변환
   - normal → medium
   - small / xs → small
   Angular에서는 Pipe or Utility 함수로 유지 가능
============================================================ */
function mapDropdownSizeToCheckboxSize(dropdownSize) {
  switch (dropdownSize) {
    case "normal":
      return "medium";
    case "small":
    case "xs":
      return "small";
    default:
      return "medium";
  }
}

/* ============================================================
   🧩 드롭다운 사이즈 → 아바타 사이즈 매핑
   ------------------------------------------------------------
   dropdown size를 avatar 컴포넌트의 사이즈로 변환
   - normal/small/xs → 그대로 사용
   - 그 외 → normal 기본값
============================================================ */
function mapDropdownSizeToAvatarSize(dropdownSize) {
  switch (dropdownSize) {
    case "normal":
    case "small":
    case "xs":
      return dropdownSize;
    default:
      return "normal";
  }
}

/* ============================================================
   🔽 드롭다운 토글 생성 함수
   ------------------------------------------------------------
   드롭다운을 여는 버튼을 동적으로 생성함.
   - variant: dropdown / leading-select / tailing-select
   - required 표시, disabled 속성, placeholder 지원
   Angular에서는 Template 상단의 <button>으로 변환됨.
============================================================ */
export function createDropdownToggle({
  id,
  placeholder = "옵션을 선택하세요.",
  size = "normal",
  required = false,
  disabled = false,
  variant = "dropdown",
  defaultValue = null,
  items = [],
}) {
  const button = document.createElement("button");
  button.className = `dropdown__toggle is-placeholder${
    size !== "normal" ? ` ${size}` : ""
  }`;
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", id);
  button.dataset.dropdownTarget = id;
  if (disabled) button.setAttribute("disabled", "true");

  /* ------------------------------------------------------------
     variant별 초기 텍스트 표시
     - dropdown → 항상 placeholder 표시
     - leading/tailing-select → defaultValue 또는 첫 번째 아이템 표시
  ------------------------------------------------------------ */
  if (variant === "dropdown") {
    button.textContent = placeholder + (required ? " *" : "");
    button.dataset.placeholder = placeholder + (required ? " *" : "");
    button.classList.add("is-placeholder");
  } else {
    const initialValue =
      defaultValue ||
      (Array.isArray(items) && items.length > 0 ? items[0] : "");
    if (initialValue) {
      button.textContent = initialValue;
      button.classList.remove("is-placeholder");
      button.dataset.defaultValue = initialValue;
    } else {
      button.textContent = placeholder + (required ? " *" : "");
      button.classList.add("is-placeholder");
    }
    button.dataset.placeholder = placeholder + (required ? " *" : "");
  }

  // Chip container (선택된 값 표시용 영역)
  const chipContainer = document.createElement("div");
  chipContainer.className = "dropdown-chip-container";
  button.appendChild(chipContainer);

  return button;
}

/* ============================================================
   📋 드롭다운 메뉴 생성 함수
   ------------------------------------------------------------
   옵션 목록 UI를 구성하며, 검색, 아바타, 체크박스 등 기능을 지원함.
   - withSearch → 검색창 포함
   - withAvatar → 아바타 표시
   - withCheckbox → 다중선택
   Angular에서는 <ul><li *ngFor="let item of items"></li></ul> 구조로 대체
============================================================ */
export function createDropdownMenu({
  id,
  size = "normal",
  items = [],
  withSearch = false,
  withAvatar = false,
  withCheckbox = false,
  unit = "개",
  autoAppend = true,
}) {
  /* ------------------------------------------------------------
     메뉴 Modifier 클래스 설정
  ------------------------------------------------------------ */
  let modifiers = [];
  if (withSearch) modifiers.push("dropdown__menu--search");
  if (withAvatar && withCheckbox) {
    modifiers.push("dropdown__menu--avatar-checkbox");
  } else if (withAvatar) {
    modifiers.push("dropdown__menu--avatar");
  } else if (withCheckbox) {
    modifiers.push("dropdown__menu--checkbox");
  }

  const menu = document.createElement("div");
  menu.className = `dropdown__menu${
    size !== "normal" ? ` ${size}` : ""
  } ${modifiers.join(" ")}`.trim();
  menu.id = id;
  menu.setAttribute("role", "menu");

  /* ============================================================
     🔍 검색 필드 추가
     ------------------------------------------------------------
     - withSearch=true 일 때 상단 검색창 생성
     - TextField 컴포넌트 기반으로 구성
     - Angular: <app-text-field variant="search">로 대체
  ============================================================ */
  if (withSearch) {
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "dropdown__search";
    searchWrapper.innerHTML = createTextField({
      id: `${id}-search`,
      variant: "search",
      size: "small",
      placeholder: "검색",
    });

    const input = searchWrapper.querySelector(".text-field__input");
    if (input) input.classList.add("dropdown__search-input");

    menu.appendChild(searchWrapper);

    // TextField 초기화
    if (typeof initializeTextFields === "function") {
      initializeTextFields(searchWrapper);
    }
    if (typeof adjustInputPadding === "function") {
      setTimeout(() => adjustInputPadding(), 0);
    }
  }

  /* ============================================================
     📄 리스트 아이템 생성
     ------------------------------------------------------------
     - 단일/다중 선택, 아이콘, 아바타, 부제(subtitle) 지원
     - Angular: *ngFor 반복문으로 대체
  ============================================================ */
  const ul = document.createElement("ul");
  ul.className = "dropdown__list";

  const checkboxSize = mapDropdownSizeToCheckboxSize(size);

  items.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "dropdown__item";
    li.setAttribute("role", "menuitem");
    li.dataset.value =
      typeof item === "string" ? item : item.value || item.title || item.label;

    const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);

    // defaultValue 기반 초기 선택
    if (
      toggle?.dataset.defaultValue &&
      toggle.dataset.defaultValue === li.dataset.value
    ) {
      li.classList.add("selected");
    }

    // item.selected 속성 기반 선택
    if (typeof item === "object" && item.selected) {
      li.classList.add("selected");
    }

    /* ------------------------------------------------------------
       ✅ 체크박스 (다중선택 지원)
    ------------------------------------------------------------ */
    if (withCheckbox) {
      const checkboxHTML = createCheckbox({
        id: `${id}-chk${idx}`,
        label: "",
        checked: item.checked || false,
        disabled: item.disabled || false,
        size: checkboxSize,
        variant: "standard",
      });

      const temp = document.createElement("div");
      temp.innerHTML = checkboxHTML;

      const checkboxEl = temp.firstElementChild.querySelector(
        "input[type=checkbox]"
      );
      checkboxEl.value =
        typeof item === "string"
          ? item
          : item.value || item.title || item.label || "";

      li.appendChild(temp.firstElementChild);

      if (checkboxEl.checked) li.classList.add("checked");

      checkboxEl.addEventListener("change", () => {
        li.classList.toggle("checked", checkboxEl.checked);
      });
    }

    /* ------------------------------------------------------------
       🧑 아바타
       - item.avatar 존재 시 이미지 표시
       - Angular: <img [src]="item.avatar">
    ------------------------------------------------------------ */
    if (withAvatar && item.avatar) {
      const avatarSize = mapDropdownSizeToAvatarSize(size);
      const img = document.createElement("img");
      img.src = item.avatar;
      img.alt = typeof item === "string" ? item : item.title || "";
      img.className = `dropdown__avatar size-${avatarSize}`;
      li.appendChild(img);
    }

    /* ------------------------------------------------------------
       ➡️ Leading Icon
    ------------------------------------------------------------ */
    if (typeof item === "object" && item.leadingIcon) {
      const iconEl = document.createElement("i");
      iconEl.className = `${item.leadingIcon} icon`;
      li.appendChild(iconEl);
      li.classList.add("has-leading-icon");
    }

    /* ------------------------------------------------------------
       🏷 텍스트 영역 (title, subtitle)
    ------------------------------------------------------------ */
    const textWrap = document.createElement("div");
    textWrap.className = "dropdown__text-wrap";

    const title = document.createElement("div");
    title.className = "dropdown__title";
    title.textContent =
      typeof item === "string" ? item : item.title || item.label || "";
    textWrap.appendChild(title);

    if (typeof item !== "string" && item.subtitle) {
      li.classList.add("has-subtitle");
      const subtitle = document.createElement("div");
      subtitle.className = "dropdown__subtitle";
      subtitle.textContent = item.subtitle;
      textWrap.appendChild(subtitle);
    }

    li.appendChild(textWrap);

    /* ------------------------------------------------------------
       ⏩ Tailing Icon
    ------------------------------------------------------------ */
    if (typeof item === "object" && item.tailingIcon) {
      const iconEl = document.createElement("i");
      iconEl.className = `${item.tailingIcon} icon dropdown__icon--tailing`;
      li.appendChild(iconEl);
      li.classList.add("has-tailing-icon");
    }

    ul.appendChild(li);
  });

  menu.appendChild(ul);

  /* ============================================================
     🧮 체크박스 선택 시 → 토글 버튼 chip 업데이트
     ------------------------------------------------------------
     - 선택된 값이 많을 경우 chip 형태로 일부만 표시
     - 나머지는 "외 n개/명" 형태로 축약
     - Angular: @Output change.emit(selectedValues)
  ============================================================ */
  if (autoAppend) {
    const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);
    if (toggle?.parentElement) {
      toggle.parentElement.appendChild(menu);

      if (withCheckbox) {
        const defaultPlaceholder = toggle.textContent.trim();

        menu.addEventListener("change", () => {
          const checkedBoxes = menu.querySelectorAll(
            "input[type=checkbox]:checked"
          );
          const values = Array.from(checkedBoxes).map((chk) => {
            const label = menu.querySelector(`label[for="${chk.id}"]`);
            return label ? label.textContent.trim() : chk.value.trim();
          });

          let container = toggle.querySelector(".dropdown-chip-container");
          if (!container) {
            container = document.createElement("div");
            container.className = "dropdown-chip-container";
            toggle.innerHTML = "";
            toggle.appendChild(container);
          } else {
            container.innerHTML = "";
          }

          if (values.length === 0) {
            toggle.textContent = defaultPlaceholder;
            toggle.classList.add("is-placeholder");
            return;
          }

          toggle.classList.remove("is-placeholder");

          // 📏 chip 최대 너비 계산
          const maxWidth = toggle.clientWidth - 70;
          let usedWidth = 0;
          let hiddenCount = 0;

          for (let i = 0; i < values.length; i++) {
            const text = values[i];
            const chip = document.createElement("span");
            chip.className = "dropdown-chip";
            chip.textContent = text;
            container.appendChild(chip);

            const chipWidth = chip.getBoundingClientRect().width + 4;
            if (usedWidth + chipWidth <= maxWidth) {
              usedWidth += chipWidth;
            } else {
              chip.remove();
              hiddenCount = values.length - i;
              break;
            }
          }

          // … 외 n개 / n명 표시
          if (hiddenCount > 0) {
            const more = document.createElement("span");
            more.className = "dropdown-chip dropdown-chip--more";
            more.textContent = `외 ${hiddenCount}${unit}`;
            container.appendChild(more);
          }
        });
      }
    }
  }

  return menu;
}
