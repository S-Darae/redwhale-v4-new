import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeTextFields,
} from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";
import "./dropdown.scss";

/* ==========================
   드롭다운 사이즈 → 체크박스 사이즈 매핑
   ========================== */
/**
 * dropdown 크기를 checkbox 크기로 매핑
 * - normal → medium
 * - small, xs → small
 */
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

/* ==========================
   드롭다운 사이즈 → 아바타 사이즈 매핑
   ========================== */
/**
 * dropdown 크기를 avatar 크기로 매핑
 * - normal/small/xs → 그대로 사용
 * - 그 외 → normal
 */
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

/* ==========================
   드롭다운 토글 생성
   ========================== */
/**
 * 드롭다운 열기 버튼(토글) 생성
 * @param {Object} options
 * @param {string} options.id - 연결될 menu id
 * @param {string} [options.placeholder] - placeholder 텍스트
 * @param {string} [options.size] - 사이즈 (normal | small | xs)
 * @param {boolean} [options.required] - 필수 여부
 * @param {boolean} [options.disabled] - 비활성화 여부
 * @param {string} [options.variant] - dropdown | leading-select | tailing-select
 * @param {string} [options.defaultValue] - 기본 선택값
 * @param {Array} [options.items] - 아이템 목록
 * @returns {HTMLButtonElement}
 */
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

  // === variant별 초기 표시 ===
  if (variant === "dropdown") {
    // 기본 드롭다운 → 무조건 placeholder 표시
    button.textContent = placeholder + (required ? " *" : "");
    button.dataset.placeholder = placeholder + (required ? " *" : "");
    button.classList.add("is-placeholder");
  } else {
    // leading-select / tailing-select → defaultValue > items[0] 우선
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

  // 칩 컨테이너 항상 유지 (선택값 업데이트는 여기 안에서만 갱신)
  const chipContainer = document.createElement("div");
  chipContainer.className = "dropdown-chip-container";
  button.appendChild(chipContainer);

  return button;
}

/* ==========================
   드롭다운 메뉴 생성
   ========================== */
/**
 * 드롭다운 메뉴 생성
 * @param {Object} options
 * @param {string} options.id - menu id
 * @param {string} [options.size] - normal | small | xs
 * @param {Array} [options.items] - 아이템 목록 (string | object)
 * @param {boolean} [options.withSearch] - 검색 필드 포함 여부
 * @param {boolean} [options.withAvatar] - 아바타 포함 여부
 * @param {boolean} [options.withCheckbox] - 체크박스 포함 여부
 * @param {string} [options.unit] - 다중선택 단위 ("명" | "개"), 기본값 "개"
 * @param {boolean} [options.autoAppend] - toggle 옆에 자동 삽입 여부
 * @returns {HTMLDivElement}
 */
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
  // === 메뉴 modifier 클래스 ===
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

  /* ==========================
     검색 필드
     ========================== */
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

    // 텍스트 필드 초기화
    if (typeof initializeTextFields === "function") {
      initializeTextFields(searchWrapper);
    }
    if (typeof adjustInputPadding === "function") {
      // 안전하게 패딩 보정
      setTimeout(() => adjustInputPadding(), 0);
    }
  }

  /* ==========================
     리스트 아이템
     ========================== */
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

    // === defaultValue 기반 선택 표시 ===
    if (
      toggle?.dataset.defaultValue &&
      toggle.dataset.defaultValue === li.dataset.value
    ) {
      li.classList.add("selected");
    }

    // === item.selected 플래그 ===
    if (typeof item === "object" && item.selected) {
      li.classList.add("selected");
    }

    /* 체크박스 */
    if (withCheckbox) {
      const checkboxHTML = createCheckbox({
        id: `${id}-chk${idx}`,
        label: "", // 라벨은 숨김
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

    /* 아바타 */
    if (withAvatar && item.avatar) {
      const avatarSize = mapDropdownSizeToAvatarSize(size);
      const img = document.createElement("img");
      img.src = item.avatar;
      img.alt = typeof item === "string" ? item : item.title || "";
      img.className = `dropdown__avatar size-${avatarSize}`;
      li.appendChild(img);
    }

    /* leadingIcon */
    if (typeof item === "object" && item.leadingIcon) {
      const iconEl = document.createElement("i");
      iconEl.className = `${item.leadingIcon} icon`;
      li.appendChild(iconEl);
      li.classList.add("has-leading-icon");
    }

    /* 텍스트 */
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

    /* tailingIcon */
    if (typeof item === "object" && item.tailingIcon) {
      const iconEl = document.createElement("i");
     iconEl.className = `${item.tailingIcon} icon dropdown__icon--tailing`;
      li.appendChild(iconEl);
      li.classList.add("has-tailing-icon");
    }

    ul.appendChild(li);
  });

  menu.appendChild(ul);

  /* ==========================
     체크박스 선택값 → 토글 버튼 업데이트
     ========================== */
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

          // === chip container 준비 ===
          let container = toggle.querySelector(".dropdown-chip-container");
          if (!container) {
            container = document.createElement("div");
            container.className = "dropdown-chip-container";
            toggle.innerHTML = ""; // 기존 텍스트 제거
            toggle.appendChild(container);
          } else {
            container.innerHTML = "";
          }

          if (values.length === 0) {
            // 선택 없음 → placeholder 복원
            toggle.textContent = defaultPlaceholder;
            toggle.classList.add("is-placeholder");
            return;
          }

          toggle.classList.remove("is-placeholder");

          // 최대 너비 (화살표 아이콘 + 여유 공간 확보)
          const maxWidth = toggle.clientWidth - 70;
          let usedWidth = 0;
          let hiddenCount = 0;

          for (let i = 0; i < values.length; i++) {
            const text = values[i];
            const chip = document.createElement("span");
            chip.className = "dropdown-chip";
            chip.textContent = text;
            container.appendChild(chip);

            const chipWidth = chip.getBoundingClientRect().width + 4; // gap 보정
            if (usedWidth + chipWidth <= maxWidth) {
              usedWidth += chipWidth; // 공간 내 → 유지
            } else {
              chip.remove(); // 공간 초과 → 제거
              hiddenCount = values.length - i; // 남은 개수 전부
              break; // 루프 종료 (더 이상 반복 불필요)
            }
          }

          // … 외 n명/개 표시
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
