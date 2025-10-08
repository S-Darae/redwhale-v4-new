import FilterCalendar from "../date-filter/filter-calendar.js";
import "./calendar.js";
import Calendar from "./calendar.js"; // calendar-only 용
import DatePicker from "./date-picker.js";
import "./date-picker.scss";
import DateRangePicker from "./date-range-picker.js";
import { parseLocalDate } from "./utils/date-utils.js";

/**
 * 📌 createDateField
 * - 날짜 입력 전용 텍스트 필드 생성 함수
 * - type에 따라 single / range / calendar / filter 지원
 */
export function createDateField({
  id,
  type = "single", // "single" | "range" | "calendar" | "filter"
  label = "",
  endLabel = false,
  placeholder = "",
  helper = "",
  presets = true,
  state = "",
  size = "",
  required = false,
  tooltip = "",
  disabled = false,
  value = "",
  layout = "flex",
  separator = "inline",
  showDuration = true,
  showIcon = true,
}) {
  let html = "";

  // 상태/사이즈 class
  const stateClass = state ? ` ${state}` : "";
  const sizeClass = size ? ` ${size}` : "";

  /* ==========================
     tailing (상태 아이콘 + 툴팁)
     ========================== */
  const renderTailing = () => {
    const icons = [];
    if (state === "caution" || state === "error") {
      icons.push(`<span class="icon--warning tailing-icon--status"></span>`);
    }
    if (state === "success") {
      icons.push(`<span class="icon--check tailing-icon--status"></span>`);
    }
    if (tooltip) {
      icons.push(`
        <button
          class="btn--icon-utility tooltip__icon"
          data-tooltip="${tooltip}"
          aria-label="도움말 열기"
        >
          <div class="icon--question icon"></div>
        </button>
      `);
    }
    return icons.length ? `<div class="tailing">${icons.join("")}</div>` : "";
  };

  /* ==========================
     helper (하단 메시지)
     ========================== */
  const renderHelper = () =>
    helper
      ? `<div class="helper"><div class="hint-text">${helper}</div></div>`
      : "";

  /* ==========================
     단일 날짜 (single)
     ========================== */
  if (type === "single") {
    const disabledAttr = disabled ? "disabled" : "";
    html = `
      <div class="text-field text-field--date-picker${stateClass}${sizeClass}${
      !showIcon ? " no-icon" : ""
    }${disabled ? " disabled" : ""}">
        ${
          label
            ? `<label for="${id}" class="text-field__label">
                 ${label}${required ? '<span class="required">*</span>' : ""}
               </label>`
            : ""
        }
        <div class="text-field__wrapper">
         ${showIcon ? `<div class="icon--calendar icon"></div>` : ""}
          <input
            type="text"
            id="${id}"
            class="text-field__input date-input"
            placeholder="${placeholder}"
            ${value && typeof value === "string" ? `value="${value}"` : ""}
            ${required ? "required" : ""}
            ${disabledAttr}
            readonly
          />
          ${renderTailing()}
        </div>
        ${renderHelper()}
      </div>
    `;

    requestAnimationFrame(() => {
      const input = document.getElementById(id);
      if (input) {
        const parsed =
          value && typeof value === "string" ? parseLocalDate(value) : null;
        const picker = new DatePicker(input, parsed);
        if (parsed) picker.setDate(parsed);
        input._picker = picker;
      }
    });
  }

  /* ==========================
     기간 날짜 (range)
     ========================== */

  // 안전 초기화 함수 (DOM이 늦게 잡혀도 반복 시도)
  const safeInitRangePicker = (id, value, presets, showDuration) => {
    const startInput = document.getElementById(`${id}-start`);
    const endInput = document.getElementById(`${id}-end`);
    if (!startInput || !endInput) {
      requestAnimationFrame(() =>
        safeInitRangePicker(id, value, presets, showDuration)
      );
      return;
    }

    const start =
      value && Array.isArray(value) ? parseLocalDate(value[0]) : null;
    const end = value && Array.isArray(value) ? parseLocalDate(value[1]) : null;

    const picker = new DateRangePicker(startInput, endInput, {
      presets,
      defaultStart: start,
      defaultEnd: end,
      showDuration,
    });
    if (start || end) picker.setRange(start, end);

    startInput._picker = picker;
    endInput._picker = picker;
  };

  if (type === "range") {
    const isDisabledObj = typeof disabled === "object";
    const startDisabledAttr =
      (isDisabledObj && disabled.start) || disabled === true ? "disabled" : "";
    const endDisabledAttr =
      (isDisabledObj && disabled.end) || disabled === true ? "disabled" : "";

    const startField = `
    <div class="text-field text-field--date-range text-field--date-range-start${stateClass}${sizeClass}${
      !showIcon ? " no-icon" : ""
    }${startDisabledAttr ? " disabled" : ""}${!label ? " nolabel" : ""}">
        ${
          label
            ? `<label for="${id}-start" class="text-field__label">
                 ${label}${required ? '<span class="required">*</span>' : ""}
               </label>`
            : ""
        }
        <div class="text-field__wrapper">
          ${showIcon ? `<div class="icon--calendar icon"></div>` : ""}
          <input
            type="text"
            id="${id}-start"
            class="text-field__input date-input"
            placeholder="시작일"
            ${required ? "required" : ""}
            ${startDisabledAttr}
            readonly
          />
          ${renderTailing()}
        </div>
        ${renderHelper()}
      </div>
  `;

    const endField = `
    <div class="text-field text-field--date-range text-field--date-range-end${stateClass}${sizeClass}${
      !showIcon ? " no-icon" : ""
    }${endDisabledAttr ? " disabled" : ""}${!label ? " nolabel" : ""}">
        ${
          endLabel && label
            ? `<label for="${id}-end" class="text-field__label">
                 ${label}${required ? '<span class="required">*</span>' : ""}
               </label>`
            : label && !endLabel
            ? `<label for="${id}-end" class="text-field__label visually-hidden">${label}</label>`
            : ""
        }
        <div class="text-field__wrapper">
          ${showIcon ? `<div class="icon--calendar icon"></div>` : ""}
          <input
            type="text"
            id="${id}-end"
            class="text-field__input date-input"
            placeholder="종료일"
            ${required ? "required" : ""}
            ${endDisabledAttr}
            readonly
          />
          ${renderTailing()}
        </div>
        ${renderHelper()}
      </div>
  `;

    if (layout === "stack") {
      html = `<div class="date-range-stack">${startField}${endField}</div>`;
    } else {
      if (separator === "inline") {
        html = `<div class="date-range-flex">${startField}<span class="date-range-separator"> ~ </span>${endField}</div>`;
      } else if (separator === "text") {
        html = `<div class="date-range-flex">${startField}<span class="date-range-separator">부터</span>${endField}<span class="date-range-separator">까지</span></div>`;
      } else {
        html = `<div class="date-range-flex">${startField}${endField}</div>`;
      }
    }

    // 안전 초기화 실행
    requestAnimationFrame(() => {
      safeInitRangePicker(id, value, presets, showDuration);
    });
  }

  /* ==========================
     캘린더 only (독립형)
     ========================== */
  if (type === "calendar") {
    html = `<div id="${id}" class="calendar-standalone"></div>`;

    requestAnimationFrame(() => {
      const container = document.getElementById(id);
      if (container) {
        const picker = new Calendar({
          mode: "single",
          onSelect: (date) => {
            console.log("calendar-only 선택:", date);
          },
        });
        picker.mount(container);
        container._picker = picker;
      }
    });
  }

  /* ==========================
     필터 캘린더 전용
     ========================== */
  if (type === "filter") {
    html = `
    <div id="${id}-wrapper" class="text-field text-field--date-picker text-field--date-filter${stateClass}${sizeClass}">
      ${
        label
          ? `<label for="${id}" class="text-field__label">${label}</label>`
          : ""
      }
      <div class="text-field__wrapper">
        ${showIcon ? `<div class="icon--calendar icon"></div>` : ""}
        <input
          type="text"
          id="${id}"
          class="text-field__input filter-range-input"
          placeholder="${placeholder || "기간 선택"}"
          readonly
        />
        ${renderTailing()}
      </div>
      ${renderHelper()}
    </div>`;

    requestAnimationFrame(() => {
      const container = document.getElementById(`${id}-wrapper`);
      const input = document.getElementById(id);

      if (container && input) {
        const picker = new FilterCalendar(container, {
          mode: "range",
          shortcuts: true,
          onChange: ({ start, end, formatted }) => {
            input.value = formatted || "";
          },
        });
        input._picker = picker;
      }
    });
  }

  return html;
}
