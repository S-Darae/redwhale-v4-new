import FilterCalendar from "../date-filter/filter-calendar.js";
import "./calendar.js";
import Calendar from "./calendar.js";
import DatePicker from "./date-picker.js";
import "./date-picker.scss";
import DateRangePicker from "./date-range-picker.js";
import { parseLocalDate } from "./utils/date-utils.js";

/* =====================================================================
📅 Function: createDateField
=====================================================================
날짜 입력용 Text Field를 생성하는 공통 함수

📌 지원 타입
---------------------------------------------------------------------
- "single"  → 단일 날짜 선택 (DatePicker)
- "range"   → 기간 선택 (DateRangePicker)
- "calendar"→ 독립 캘린더 (Calendar)
- "filter"  → 필터 전용 캘린더 (FilterCalendar)

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 형태
    <app-date-field
      [type]="'range'"
      [label]="'기간'"
      [presets]="true"
      [showIcon]="true"
      (change)="onDateChange($event)">
    </app-date-field>

2️⃣ Angular @Input() 제안
    @Input() type: 'single' | 'range' | 'calendar' | 'filter' = 'single';
    @Input() label = '';
    @Input() placeholder = '';
    @Input() presets = true;
    @Input() showIcon = true;
    @Input() disabled = false;

3️⃣ Angular @Output() 제안
    @Output() change = new EventEmitter<any>();

4️⃣ JS → Angular 구조 대응
    - renderTailing() → ngIf + ngSwitch로 template 대응
    - safeInitRangePicker() → AfterViewInit + @ViewChild(DateRangePicker)
    - requestAnimationFrame() → setTimeout 0 or Angular zone 안정화로 대체
===================================================================== */

/**
 * @param {Object} options - 필드 설정 옵션
 * @returns {string} HTML 문자열
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

  // 상태 / 사이즈 class 조합
  const stateClass = state ? ` ${state}` : "";
  const sizeClass = size ? ` ${size}` : "";

  /* ============================================================
     🎯 tailing (상태 아이콘 + 툴팁 버튼)
     ------------------------------------------------------------
     - 상태(caution/error/success)에 따라 아이콘 표시
     - tooltip 옵션 시 ? 버튼 표시
     - Angular: ngIf, ngSwitchCase, [attr.data-tooltip]으로 대응
  ============================================================ */
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

  /* ============================================================
     💬 helper (하단 메시지)
     ------------------------------------------------------------
     - 필드 하단 보조 텍스트 표시
     - Angular: <p class="hint-text">{{helper}}</p>
  ============================================================ */
  const renderHelper = () =>
    helper
      ? `<div class="helper"><div class="hint-text">${helper}</div></div>`
      : "";

  /* ============================================================
     📆 단일 날짜 필드 (type="single")
     ------------------------------------------------------------
     - DatePicker 인스턴스와 연결됨
     - Angular: <app-date-picker-single>
  ============================================================ */
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

    // 비동기 초기화 (DOM 렌더 후 DatePicker 인스턴스 연결)
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

  /* ============================================================
     ⏱ 기간 선택 필드 (type="range")
     ------------------------------------------------------------
     - 시작일/종료일 input 2개 렌더링
     - DateRangePicker 인스턴스와 연결
     - Angular: <app-date-range-picker>
  ============================================================ */

  // 안전 초기화 함수 (DOM 로드 타이밍 안정화)
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

    // 레이아웃 조합 (inline / text / stack)
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

    // 안전 초기화 실행 (비동기)
    requestAnimationFrame(() => {
      safeInitRangePicker(id, value, presets, showDuration);
    });
  }

  /* ============================================================
     🗓 캘린더 Only (독립형)
     ------------------------------------------------------------
     - 단일 Calendar 컴포넌트 렌더링
     - Angular: <app-calendar-standalone>
  ============================================================ */
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

  /* ============================================================
     🔍 필터 캘린더 전용 (type="filter")
     ------------------------------------------------------------
     - FilterCalendarCore와 연동
     - Angular: <app-filter-calendar>
  ============================================================ */
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

        // 초기값 세팅
        if (value && Array.isArray(value) && value.length === 2) {
          const [startStr, endStr] = value;
          const start = new Date(startStr);
          const end = new Date(endStr);

          // 캘린더 내부 상태 업데이트
          if (picker.core) {
            picker.core.setRange({ start, end });
          } else {
            // FilterCalendar 내부 코어가 아직 mount 전이라면 약간 지연
            requestAnimationFrame(() => {
              if (picker.core) picker.core.setRange({ start, end });
            });
          }

          // 인풋 값도 바로 표시
          const formatKoreanDate = (date) => {
            const yy = String(date.getFullYear()).slice(2);
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const days = ["일", "월", "화", "수", "목", "금", "토"];
            const day = days[date.getDay()];
            return `${yy}년 ${mm}월 ${dd}일 (${day})`;
          };
          input.value = `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`;
        }

        input._picker = picker;
      }
    });
  }

  // 최종 HTML 반환
  return html;
}
