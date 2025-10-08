/* ==========================
   ⏱ 타이머 표시 포맷 함수
   - 숫자(초) → "MM:SS" 형식 문자열로 변환
   - 이미 "MM:SS" 형태 문자열이 들어오면 그대로 반환
   ========================== */
function formatTime(timerValue) {
  if (typeof timerValue === "string" && timerValue.includes(":")) {
    return timerValue;
  }
  const seconds = parseInt(timerValue, 10) || 0;
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

/* ==========================
   ✏️ 텍스트 필드 / 드롭다운 토글 생성 함수
   - 옵션 기반으로 다양한 변형(variant, size, state 등)을 가진
     텍스트 입력 컴포넌트를 HTML 문자열로 생성
   - 생성된 HTML은 innerHTML/insertAdjacentHTML 등으로 삽입하여 사용
   ========================== */
function createTextField(options) {
  const {
    id,
    // 공통 속성
    variant = "standard", // standard | search | textarea | password | mega | date-picker | date-range-picker | dropdown | stepper | leading-select | tailing-select | filter-range
    size = "normal", // normal | small
    label = "",
    required = false,
    state = "base",
    placeholder = "",
    tooltip = "",
    helper = "",
    timer = "",
    maxlength = null,
    disabled = false,
    value = "",
    onlyNumber = false,
    comma = false,
    align = "left",
    clearable = true,
    unit = "",
    leadingText = "",
    leadingSelect = null,
    tailingSelect = null,
    autofocus = false,
    tailingButtonLabel = "",
    extraAttrs = "",
    items = [],
    defaultValue = "",
    dirty = false,
  } = options;

  /* ==========================
     📦 wrapper 클래스 세팅
     ========================== */
  const classes = ["text-field"];
  if (variant) classes.push(`text-field--${variant}`);
  if (size) classes.push(size);
  if (state !== "base") classes.push(state);
  if (disabled) classes.push("disabled");

  /* ==========================
     🏷 라벨 영역
     ========================== */
  const labelHtml = label
    ? `<label for="${id}" class="text-field__label">
       ${label}${required ? '<span class="required">*</span>' : ""}
     </label>`
    : "";

  /* ==========================
     ◀️ leading 영역
     ========================== */
  let leadingHtml = "";
  if (variant === "search") {
    leadingHtml = `<div class="icon--search-bold icon"></div>`;
  } else if (variant === "leading-select" && leadingSelect) {
    const initialText =
      defaultValue || leadingSelect.default || leadingSelect.options[0] || "";
    leadingHtml = `
      <div class="text-field__select text-field__select--leading">
        <button 
          id="${id}"
          type="button"
          class="text-field__select-toggle"
          aria-expanded="false"
          aria-controls="${id}-menu"
          data-dropdown-target="${id}-menu"
          data-default-value="${initialText}"
          ${dirty ? `data-dirty-field="true"` : ""}
        >
          ${initialText}
        </button>
      </div>`;
  } else if (leadingText) {
    leadingHtml = `<div class="leading">${leadingText}</div>`;
  } else if (variant === "date-picker" || variant === "date-range-picker") {
    leadingHtml = `<div class="icon--calendar icon"></div>`;
  }

  /* ==========================
     ⌨️ input / textarea / dropdown 본문
     ========================== */
  let inputHtml = "";

  if (variant === "textarea") {
    // 멀티라인
    const textareaAttr = [
      `id="${id}"`,
      `class="text-field__input"`,
      placeholder ? `placeholder="${placeholder}"` : "",
      maxlength ? `maxlength="${maxlength}"` : "",
      required ? "required" : "",
      disabled ? "disabled" : "",
      autofocus ? "autofocus" : "",
      dirty ? `data-dirty-field="true"` : "",
      extraAttrs,
    ]
      .filter(Boolean)
      .join(" ");
    inputHtml = `<textarea ${textareaAttr}>${value || ""}</textarea>`;
  } else if (variant === "mega") {
    // OTP/코드 입력
    const megaAttr = [
      `type="number"`,
      `id="${id}"`,
      `class="text-field__input"`,
      placeholder ? `placeholder="${placeholder}"` : "",
      maxlength ? `maxlength="${maxlength}"` : `maxlength="1"`,
      required ? "required" : "",
      disabled ? "disabled" : "",
      value ? `value="${value}"` : "",
      dirty ? `data-dirty-field="true"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    inputHtml = `<input ${megaAttr} />`;
  } else if (variant === "date-picker") {
    // 단일 날짜
    inputHtml = `<input
      type="text"
      id="${id}"
      class="text-field__input date-input"
      placeholder="${placeholder || ""}"
      value="${value || ""}"
      ${required ? "required" : ""}
      ${disabled ? "disabled" : ""}
      ${dirty ? `data-dirty-field="true"` : ""}
      readonly
    />`;
  } else if (variant === "date-range-picker") {
    // 시작/종료 2개
    inputHtml = `
      <div class="date-range-field">
        <div class="date-range-field__start">
          <div class="icon--calendar icon"></div>
          <input
            type="text"
            id="${id}-start"
            class="text-field__input date-range-input"
            placeholder="시작일"
            ${dirty ? `data-dirty-field="true"` : ""}
            readonly
          />
        </div>
        <span class="icon--arrow-right"></span>
        <div class="date-range-field__end">
          <div class="icon--calendar icon"></div>
          <input
            type="text"
            id="${id}-end"
            class="text-field__input date-range-input"
            placeholder="종료일"
            ${dirty ? `data-dirty-field="true"` : ""}
            readonly
          />
        </div>
      </div>`;
  } else if (variant === "filter-range") {
    // 필터 캘린더 전용 (시작/종료 합친 단일 input)
    inputHtml = `<input
      type="text"
      id="${id}"
      class="text-field__input filter-range-input"
      placeholder="${placeholder || "기간 선택"}"
      ${dirty ? `data-dirty-field="true"` : ""}
      readonly
    />`;
  } else if (variant === "dropdown") {
    // 드롭다운
    const initialValue = defaultValue || "";
    const displayText = initialValue || placeholder || "옵션 선택";
    const isPlaceholder = !initialValue;

    inputHtml = `
      <button
        id="${id}"
        type="button"
        class="text-field__input dropdown__toggle ${
          isPlaceholder ? "is-placeholder" : ""
        }"
        aria-expanded="false"
        aria-controls="${id}-menu"
        data-dropdown-target="${id}-menu"
        data-placeholder="${placeholder || "옵션 선택"}"
        ${disabled ? "disabled" : ""}
        ${dirty ? `data-dirty-field="true"` : ""}
      >
        ${displayText}
      </button>`;
  } else {
    // 기본 input
    const inputType = variant === "password" ? "password" : "text";
    const inputAttr = [
      `type="${inputType}"`,
      `id="${id}"`,
      `class="text-field__input" style="text-align:${align};"`,
      placeholder ? `placeholder="${placeholder}"` : "",
      maxlength ? `maxlength="${maxlength}"` : "",
      required ? "required" : "",
      disabled ? "disabled" : "",
      value ? `value="${value}"` : "",
      onlyNumber ? `inputmode="numeric"` : "",
      comma ? `data-comma="true"` : "",
      autofocus ? "autofocus" : "",
      tailingButtonLabel ? "readonly" : "",
      dirty ? `data-dirty-field="true"` : "",
      extraAttrs,
    ]
      .filter(Boolean)
      .join(" ");
    inputHtml = `<input ${inputAttr} />`;
  }

  /* ==========================
     ▶️ tailing-select
     ========================== */
  let tailingSelectHtml = "";
  if (variant === "tailing-select" && tailingSelect) {
    const initialText =
      defaultValue || tailingSelect.default || tailingSelect.options[0] || "";
    tailingSelectHtml = `
      <div class="text-field__select text-field__select--tailing">
        <button 
          id="${id}"
          type="button"
          class="text-field__select-toggle"
          aria-expanded="false"
          aria-controls="${id}-menu"
          data-dropdown-target="${id}-menu"
          data-default-value="${initialText}"
          ${dirty ? `data-dirty-field="true"` : ""}
        >
          ${initialText}
        </button>
      </div>`;
  }

  /* ==========================
     ➡️ tailing 공통 요소
     ========================== */
  let tailingHtml = "";
  if (variant !== "mega" && variant !== "date-range-picker") {
    tailingHtml = `<div class="tailing">`;

    if (unit) {
      tailingHtml += `<span class="unit">${unit}</span>`;
    }

    if (timer) {
      const formattedTimer = formatTime(timer);
      tailingHtml += `<div class="timer" data-timer="${timer}">${formattedTimer}</div>`;
    }

    if (
      clearable &&
      variant !== "textarea" &&
      variant !== "mega" &&
      variant !== "date-picker" &&
      variant !== "dropdown"
    ) {
      tailingHtml += `
        <button class="btn--icon-utility btn--icon-only--x" aria-label="입력 내용 삭제">
          <div class="icon--x-circle-fill icon"></div>
        </button>`;
    }

    if (tailingButtonLabel) {
      tailingHtml += `
        <button class="btn btn--ghost btn--primary btn--small">
          ${tailingButtonLabel}
        </button>`;
    }

    if (variant === "password") {
      tailingHtml += `
        <button class="btn--icon-utility btn--view" aria-label="비밀번호 보이기">
          <div class="icon--eye icon"></div>
          <div class="icon--eye-slash icon"></div>
        </button>`;
    }

    if (state === "caution" || state === "error") {
      tailingHtml += `<span class="icon--warning tailing-icon--status"></span>`;
    }
    if (state === "success") {
      tailingHtml += `<span class="icon--check tailing-icon--status"></span>`;
    }

    if (tooltip) {
      tailingHtml += `
        <button class="btn--icon-utility tooltip__icon" data-tooltip="${tooltip}" aria-label="도움말 열기">
          <div class="icon--question icon"></div>
        </button>`;
    }

    if (variant === "stepper") {
      tailingHtml += `
        <div class="text-field__stepper">
          <button class="text-field__stepper-btn text-field__stepper-btn--up" aria-label="Increase">
            <div class="icon--caret-up text-field__stepper-icon"></div>
          </button>
          <button class="text-field__stepper-btn text-field__stepper-btn--down" aria-label="Decrease" disabled>
            <div class="icon--caret-down text-field__stepper-icon"></div>
          </button>
        </div>`;
    }

    tailingHtml += `</div>`;
  }

  /* ==========================
     ℹ️ helper 영역
     ========================== */
  let helperHtml = "";
  if (helper || maxlength) {
    helperHtml = `<div class="helper">`;

    if (helper) helperHtml += `<div class="hint-text">${helper}</div>`;
    if (maxlength) {
      helperHtml += `
        <div class="count">
          <span class="char-count">${value.length}</span> /
          <span class="max-length">${maxlength}</span>
        </div>`;
    }

    helperHtml += `</div>`;
  }

  /* ==========================
     🏁 최종 반환
     ========================== */
  return `
    <div class="${classes.join(" ")}">
      ${labelHtml}
      <div class="text-field__wrapper">
        ${leadingHtml}
        ${inputHtml}
        ${tailingSelectHtml}
        ${tailingHtml}
      </div>
      ${helperHtml}
    </div>`;
}

window.createTextField = createTextField;
export { createTextField };
