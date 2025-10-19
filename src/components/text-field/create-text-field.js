/* ======================================================================
   ⏱ formatTime()
   ----------------------------------------------------------------------
   ✅ 역할:
   - 숫자(초)를 "MM:SS" 형식 문자열로 변환
   - 이미 "MM:SS" 형태 문자열이 들어오면 그대로 반환
   ----------------------------------------------------------------------
   📘 예시:
   formatTime(90) → "01:30"
   formatTime("03:15") → "03:15"
   ====================================================================== */
function formatTime(timerValue) {
  if (typeof timerValue === "string" && timerValue.includes(":")) {
    return timerValue;
  }
  const seconds = parseInt(timerValue, 10) || 0;
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

/**
 * ======================================================================
 * ✏️ createTextField()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 텍스트 필드 / 드롭다운 / 스텝퍼 등 다양한 variant를 지원하는
 *   다형성 입력 컴포넌트를 HTML 문자열 형태로 생성한다.
 * - 생성된 HTML은 innerHTML, insertAdjacentHTML 등으로 삽입하여 사용.
 * ----------------------------------------------------------------------
 * ⚙️ 주요 특징:
 * - variant / size / state / dirty / tooltip / helper 등 다양한 속성 지원
 * - leading / tailing 영역 자동 구성
 * - 드롭다운, 스텝퍼, 타이머, 비밀번호 보기 버튼 등 내장 기능 포함
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - 본 함수는 Template Generator 역할이므로
 *   Angular에서는 `<app-text-field>` 컴포넌트로 변환
 * - variant는 `@Input()`으로 전달
 * - 이벤트(`input`, `change`)는 `@Output()`으로 바인딩
 * - `data-dirty-field` → ReactiveForm의 `dirty` 상태로 대체
 * ----------------------------------------------------------------------
 * 📘 예시:
 * createTextField({
 *   id: "username",
 *   label: "이름",
 *   placeholder: "입력하세요",
 *   required: true,
 *   helper: "실명 입력 필수",
 * });
 * ======================================================================
 *
 * @param {Object} options - 텍스트 필드 설정 옵션 객체
 * @returns {string} - 생성된 HTML 문자열
 */
function createTextField(options) {
  const {
    /* -----------------------------------------------------
       🏷️ 기본 정보
       ----------------------------------------------------- */
    id, // 필드 고유 ID
    variant = "standard", // 필드 타입
    size = "normal", // 크기 ("normal" | "small")

    /* -----------------------------------------------------
       🧱 상태 및 표시 속성
       ----------------------------------------------------- */
    label = "", // 라벨 텍스트
    required = false, // 필수 여부 (* 표시)
    state = "base", // 상태 (base | caution | error | success)
    placeholder = "", // placeholder 텍스트
    tooltip = "", // 툴팁 아이콘 설명
    helper = "", // 하단 보조 텍스트
    timer = "", // 타이머 표시 (초 단위)
    maxlength = null, // 글자수 제한
    disabled = false, // 비활성화 여부
    value = "", // 초기값
    onlyNumber = false, // 숫자만 입력 허용
    comma = false, // 천단위 콤마 표시 여부
    align = "left", // 텍스트 정렬
    clearable = true, // clear 버튼 노출 여부
    dirty = false, // data-dirty-field 속성 부착 여부

    /* -----------------------------------------------------
       🎨 부가 표시요소
       ----------------------------------------------------- */
    unit = "", // 단위 표시 (예: 원, 개월 등)
    leadingText = "", // 입력 앞 텍스트
    tailingButtonLabel = "", // 버튼 텍스트 (예: 인증 요청)
    autofocus = false, // 자동 포커스 여부

    /* -----------------------------------------------------
       📦 구조 관련
       ----------------------------------------------------- */
    leadingSelect = null, // 앞쪽 셀렉트 객체 (leading-select variant 전용)
    tailingSelect = null, // 뒤쪽 셀렉트 객체 (tailing-select variant 전용)
    extraAttrs = "", // 추가 HTML 속성
    defaultValue = "", // 기본 표시값
  } = options;

  /* =========================================================
     🧱 Wrapper 클래스 세팅
     ---------------------------------------------------------
     - variant / size / state / disabled 여부에 따라 클래스 구성
     ========================================================= */
  const classes = ["text-field"];
  if (variant) classes.push(`text-field--${variant}`);
  if (size) classes.push(size);
  if (state !== "base") classes.push(state);
  if (disabled) classes.push("disabled");

  /* =========================================================
     🏷 Label 영역
     ---------------------------------------------------------
     - label 값이 있을 때만 렌더링
     - required=true이면 * 표시 추가
     ========================================================= */
  const labelHtml = label
    ? `<label for="${id}" class="text-field__label">
       ${label}${required ? '<span class="required">*</span>' : ""}
     </label>`
    : "";

  /* =========================================================
     ◀️ Leading 영역
     ---------------------------------------------------------
     - variant에 따라 아이콘/텍스트/셀렉트 생성
     ========================================================= */
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

  /* =========================================================
     ⌨️ Input / Textarea / Dropdown 본문
     ---------------------------------------------------------
     - variant 별로 input 형태 분기 처리
     - textarea, mega, date-picker, dropdown 등 각각 다른 구조
     ========================================================= */
  let inputHtml = "";

  if (variant === "textarea") {
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
    inputHtml = `<input
      type="text"
      id="${id}"
      class="text-field__input filter-range-input"
      placeholder="${placeholder || "기간 선택"}"
      ${dirty ? `data-dirty-field="true"` : ""}
      readonly
    />`;
  } else if (variant === "dropdown") {
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

  /* =========================================================
     ▶️ Tailing Select (오른쪽 셀렉트)
     ---------------------------------------------------------
     - tailing-select variant인 경우만 렌더링
     ========================================================= */
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

  /* =========================================================
     ➡️ Tailing 공통 요소
     ---------------------------------------------------------
     - unit, timer, clear, password toggle, stepper 등
     ========================================================= */
  let tailingHtml = "";
  if (variant !== "mega" && variant !== "date-range-picker") {
    tailingHtml = `<div class="tailing">`;

    if (unit) tailingHtml += `<span class="unit">${unit}</span>`;
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

  /* =========================================================
     ℹ️ Helper 영역
     ---------------------------------------------------------
     - hint 텍스트 및 글자수 카운트(maxlength)
     ========================================================= */
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

  /* =========================================================
     🏁 최종 반환
     ========================================================= */
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

/* ======================================================================
   🌐 전역 등록 및 export
   ----------------------------------------------------------------------
   - 전역에서 window.createTextField로 접근 가능
   - 모듈 환경에서는 named export로 사용 가능
   ====================================================================== */
window.createTextField = createTextField;
export { createTextField };
