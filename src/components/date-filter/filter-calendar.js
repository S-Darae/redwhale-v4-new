import "../../components/radio-button/radio-button.scss";
import "../date-picker/date-picker.scss";
import "../date-picker/filter-calendar.scss";
import { createRadioButton } from "../radio-button/create-radio-button.js";
import FilterCalendarCore from "./filter-calendar-core.js";

/* =====================================================================
📅 Component: FilterCalendar (날짜 필터 팝오버 달력)
=====================================================================
- 입력 필드 클릭 시 팝오버 형태로 캘린더를 표시하는 UI 컴포넌트
- “상세 기간 조회 / 월별 조회” 탭 구조를 포함
- FilterCalendarCore를 내부에 포함하여 실제 날짜 선택 로직 처리
- 숏컷 버튼(오늘/이번주/이번달 등) 및 월별 버튼을 통한 빠른 선택 지원

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 예시
    <app-filter-calendar
      [mode]="'range'"
      [useShortcuts]="true"
      (change)="onDateChange($event)">
    </app-filter-calendar>

2️⃣ Angular @Input() 속성
    @Input() mode: 'single' | 'range' = 'range';
    @Input() useShortcuts = true;

3️⃣ Angular @Output() 이벤트
    @Output() change = new EventEmitter<{ start: Date; end: Date; formatted: string }>();

4️⃣ Angular 내부 구성
    - <input class="filter-range-input" readonly />
    - 팝오버: *ngIf="isOpen" + absolute positioning
    - 자식 컴포넌트: <app-calendar-core> (FilterCalendarCore 대체)
    - <app-radio-group>으로 shortcuts / months 구현

5️⃣ 주요 로직 대응
    - mount() → ngAfterViewInit()
    - open/close() → (focus)/(blur) 또는 버튼 클릭 이벤트로 제어
    - renderShortcuts(), renderMonths() → ngFor + (change)로 대체
===================================================================== */


/* ============================================================
   🧮 날짜 포맷터: Date → 한국어 날짜
   ------------------------------------------------------------
   ex) 2025.10.19 → "25년 10월 19일 (일)"
   Angular: DatePipe + custom pipe 대체 가능
============================================================ */
function formatKoreanDate(date) {
  if (!(date instanceof Date)) return "";
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[date.getDay()];
  return `${yy}년 ${mm}월 ${dd}일 (${day})`;
}

/* ============================================================
   📅 주 단위 계산기 (월요일 시작 기준)
   ------------------------------------------------------------
   offsetWeeks: 0 → 이번 주, -1 → 지난 주
============================================================ */
function getWeekRange(baseDate, offsetWeeks = 0) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday + offsetWeeks * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

/* ============================================================
   🔒 전역 상태: 동시에 하나만 열리도록 제어
============================================================ */
let activeCalendar = null;

/* =====================================================================
📦 Class: FilterCalendar
===================================================================== */
export default class FilterCalendar {
  /**
   * @param {HTMLElement} containerEl - 필터 캘린더 컨테이너 (필수)
   * @param {Object} [config]
   * @param {"single"|"range"} [config.mode="range"] - 캘린더 모드
   * @param {boolean} [config.shortcuts=true] - 숏컷 버튼 사용 여부
   * @param {Function} [config.onChange] - 날짜 변경 시 콜백
   */
  constructor(containerEl, { mode = "range", shortcuts = true, onChange = null } = {}) {
    /* ------------------------------------------------------------
       📌 속성 및 상태값 초기화
       ------------------------------------------------------------ */
    this.container = containerEl;
    this.mode = mode;
    this.shortcuts = shortcuts;
    this.onChange = onChange;

    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.core = null; // FilterCalendarCore 인스턴스
    this.uid = Math.random().toString(36).substr(2, 6); // 라디오 그룹 고유키

    this.init();
  }

  /* ============================================================
     ⚙️ init()
     ------------------------------------------------------------
     - 인풋 필드 감지 및 캘린더 구조 생성
     - FilterCalendarCore mount()
     - 숏컷/월별 버튼 렌더링
  ============================================================ */
  init() {
    this.input = this.container.querySelector(".filter-range-input");
    if (!this.input) return;

    // 팝오버 컨테이너 생성
    this.calendarWrap = document.createElement("div");
    this.calendarWrap.className = "filter-calendar-container";
    this.calendarWrap.innerHTML = this.renderCalendar();
    this.container.appendChild(this.calendarWrap);

    // 내부 Core 캘린더 mount
    const detailEl = this.calendarWrap.querySelector("#detail-calendar");
    if (detailEl) {
      this.core = new FilterCalendarCore({ mode: this.mode });
      this.core.mount(detailEl);

      // Core → 날짜 선택 콜백 연결
      this.core.onSelect = ({ start, end }) => {
        // 라디오 버튼 선택 해제 (수동 변경 시)
        this.calendarWrap.querySelectorAll("input[type=radio]").forEach((r) => (r.checked = false));

        // 인풋 값 업데이트
        let text = "";
        if (this.mode === "single" && start) text = formatKoreanDate(start);
        else if (start && end) text = `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`;
        else if (start) text = formatKoreanDate(start);

        this.input.value = text;
        if (this.onChange) this.onChange({ start, end, formatted: text });
      };
    }

    // 기본 이벤트 및 탭/버튼 초기화
    this.bindEvents();
    if (this.shortcuts) this.renderShortcuts();
    this.renderMonths();
  }

  /* ============================================================
     🧱 renderCalendar()
     ------------------------------------------------------------
     - 상단 탭(기간 상세 조회 / 월별 조회)
     - 내부 캘린더 + 숏컷 + 월별 버튼 UI 생성
  ============================================================ */
  renderCalendar() {
    return `
      <section class="filter-calendar">
        <div class="line-tab small" role="tablist">
          <button class="line-tab__tab is-active" data-target="panel-detail">기간 상세 조회</button>
          <button class="line-tab__tab" data-target="panel-month">월별 조회</button>
        </div>

        <div class="line-tab__content">
          <!-- 상세 조회 -->
          <div id="panel-detail" class="line-tab__panel is-visible">
            <div class="filter-calendar__calendar" id="detail-calendar"></div>
            ${this.shortcuts ? `<div class="filter-calendar__shortcuts"></div>` : ""}
          </div>

          <!-- 월별 조회 -->
          <div id="panel-month" class="line-tab__panel" hidden>
            <div class="filter-calendar__year-nav">
              <button class="btn--icon-utility year-prev-btn"><i class="icon--caret-left icon"></i></button>
              <span class="year">${this.currentYear}년</span>
              <button class="btn--icon-utility year-next-btn"><i class="icon--caret-right icon"></i></button>
            </div>
            <div class="filter-calendar__months"></div>
          </div>
        </div>
      </section>
    `;
  }

  /* ============================================================
     🧭 bindEvents()
     ------------------------------------------------------------
     - 인풋 클릭 → 달력 열기
     - 외부 클릭 → 닫기
     - 탭 전환 / 연도 네비게이션 처리
     - Angular: (clickOutside), (tabChange)로 대체 가능
  ============================================================ */
  bindEvents() {
    if (!this.input) return;

    // 인풋 클릭 → 캘린더 열기
    this.input.addEventListener("click", (e) => {
      e.stopPropagation();
      this.open();
    });

    // 외부 클릭 → 닫기
    document.addEventListener("click", (e) => {
      if (activeCalendar === this.calendarWrap && !this.calendarWrap.contains(e.target) && e.target !== this.input) {
        this.close();
      }
    });

    // 탭 전환
    this.calendarWrap.querySelectorAll(".line-tab__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.target;

        this.calendarWrap.querySelectorAll(".line-tab__tab").forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        this.calendarWrap.querySelectorAll(".line-tab__panel").forEach((p) => {
          p.classList.remove("is-visible");
          p.hidden = true;
        });

        const activePanel = this.calendarWrap.querySelector(`#${target}`);
        if (activePanel) {
          activePanel.classList.add("is-visible");
          activePanel.hidden = false;
        }
      });
    });

    // 연도 네비게이션
    const yearEl = this.calendarWrap.querySelector(".year");
    const updateYearLabel = () => (yearEl.textContent = `${this.currentDate.getFullYear()}년`);
    this.calendarWrap.querySelector(".year-prev-btn")?.addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
      updateYearLabel();
    });
    this.calendarWrap.querySelector(".year-next-btn")?.addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
      updateYearLabel();
    });
  }

  /* ============================================================
     ⚡ renderShortcuts()
     ------------------------------------------------------------
     - 오늘, 어제, 이번 주, 지난 달 등 빠른 선택 라디오 버튼 생성
     - Angular: *ngFor + (change)="onShortcutSelect(value)" 로 대체
  ============================================================ */
  renderShortcuts() {
    const shortcuts = ["전체", "오늘", "어제", "올해", "작년", "이번 주", "지난 주", "이번 달", "지난 달"];
    const wrap = this.calendarWrap.querySelector(".filter-calendar__shortcuts");
    if (!wrap) return;

    shortcuts.forEach((label, i) => {
      wrap.insertAdjacentHTML(
        "beforeend",
        createRadioButton({
          id: `shortcut-${this.uid}-${i}`,
          name: `filter-shortcuts-${this.uid}`,
          value: label,
          variant: "card-border",
          label,
        })
      );
    });

    // 선택 시 날짜 계산 및 업데이트
    wrap.addEventListener("change", (e) => {
      if (e.target && e.target.type === "radio") {
        const label = e.target.value;
        let start = null,
          end = null;
        const today = new Date();

        switch (label) {
          case "오늘": start = end = new Date(today); break;
          case "어제": start = end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1); break;
          case "이번 달": start = new Date(today.getFullYear(), today.getMonth(), 1);
                          end = new Date(today.getFullYear(), today.getMonth() + 1, 0); break;
          case "지난 달": start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                          end = new Date(today.getFullYear(), today.getMonth(), 0); break;
          case "올해": start = new Date(today.getFullYear(), 0, 1);
                       end = new Date(today.getFullYear(), 11, 31); break;
          case "작년": start = new Date(today.getFullYear() - 1, 0, 1);
                       end = new Date(today.getFullYear() - 1, 11, 31); break;
          case "이번 주": ({ start, end } = getWeekRange(today, 0)); break;
          case "지난 주": ({ start, end } = getWeekRange(today, -1)); break;
          case "전체": start = end = null; break;
        }

        const formatted = start && end ? `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}` : "전체";
        this.input.value = formatted;
        if (this.onChange) this.onChange({ start, end, formatted });
        this.core.setRange({ start, end });
      }
    });
  }

  /* ============================================================
     🗓 renderMonths()
     ------------------------------------------------------------
     - 1~12월 라디오 버튼 생성 (월별 조회)
     - Angular: *ngFor + (change)="onMonthSelect(month)" 로 대체
  ============================================================ */
  renderMonths() {
    const monthWrap = this.calendarWrap.querySelector(".filter-calendar__months");
    if (!monthWrap) return;

    for (let i = 1; i <= 12; i++) {
      monthWrap.insertAdjacentHTML(
        "beforeend",
        createRadioButton({
          id: `month-${this.uid}-${i}`,
          name: `filter-months-${this.uid}`,
          value: i,
          variant: "card-border",
          label: `${i}월`,
        })
      );
    }

    monthWrap.addEventListener("change", (e) => {
      if (e.target && e.target.type === "radio") {
        const month = parseInt(e.target.value, 10) - 1;
        const year = this.currentDate.getFullYear();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        const formatted = `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`;
        this.input.value = formatted;
        if (this.onChange) this.onChange({ start, end, formatted });
        this.core.setRange({ start, end });
      }
    });
  }

  /* ============================================================
     🎯 open() / close()
     ------------------------------------------------------------
     - 팝오버 달력 열기/닫기
     - Angular: [class.active], *ngIf로 제어 가능
  ============================================================ */
  open() {
    if (activeCalendar && activeCalendar !== this.calendarWrap)
      activeCalendar.classList.remove("active");

    this.calendarWrap.classList.add("active");
    activeCalendar = this.calendarWrap;

    const rect = this.input.getBoundingClientRect();
    const margin = 4;
    const calendarWidth = this.calendarWrap.offsetWidth || 320;
    const calendarHeight = this.calendarWrap.offsetHeight || 340;

    let top = rect.bottom + window.scrollY + margin;
    let left = rect.left + window.scrollX;
    if (top + calendarHeight > window.scrollY + window.innerHeight)
      top = rect.top + window.scrollY - calendarHeight - margin;
    if (left + calendarWidth > window.scrollX + window.innerWidth)
      left = rect.right + window.scrollX - calendarWidth;

    this.calendarWrap.style.position = "absolute";
    this.calendarWrap.style.top = `${top}px`;
    this.calendarWrap.style.left = `${left}px`;
  }

  close() {
    this.calendarWrap.classList.remove("active");
    if (activeCalendar === this.calendarWrap) activeCalendar = null;
  }
}
