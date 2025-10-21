import "../date-picker/date-picker.scss";

/* =====================================================================
📅 Class: FilterCalendarCore
=====================================================================
- 캘린더 핵심 로직을 담당하는 순수 JS 클래스 (UI 독립형)
- 단일 날짜(`single`) 또는 날짜 범위(`range`) 선택 모드 지원
- 오늘 날짜 기준으로 렌더링 및 선택 상태 자동 업데이트
- 외부(date-picker 등)에서 mount()로 DOM 부착
- 날짜 직접 선택 시 onSelect 콜백 호출 (출처 플래그 포함)

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 예시
    <app-calendar-core
      [mode]="'range'"
      (dateSelect)="onDateSelect($event)">
    </app-calendar-core>

2️⃣ Angular @Input() 속성
    @Input() mode: 'single' | 'range' = 'range';

3️⃣ Angular @Output() 이벤트
    @Output() dateSelect = new EventEmitter<{
      start: Date;
      end?: Date;
      fromShortcut?: boolean;
      fromMonth?: boolean;
    }>();

4️⃣ Angular 주요 로직 대응
    - render(), update() → 템플릿 렌더링 및 changeDetection
    - bindGridEvents() → (click), (mousemove) 등 template event binding
    - onSelect → EventEmitter.emit()으로 대체
===================================================================== */

export default class FilterCalendarCore {
  /**
   * @param {Object} [config]
   * @param {"single"|"range"} [config.mode="range"]
   *   - "single": 단일 날짜 선택
   *   - "range" : 시작일~종료일 범위 선택
   */
  constructor({ mode = "range" } = {}) {
    /* ---------------------------------------------------------------
       📌 상태 변수 초기화
       --------------------------------------------------------------- */
    this.mode = mode; // 캘린더 모드
    this.currentDate = this.todayLocal(); // 현재 표시 중 월
    this.today = this.todayLocal(); // 오늘 (비교용)
    this.selectedRange = { start: null, end: null }; // 선택된 날짜
    this.hoverDate = null; // hover 중 날짜
    this._gridBound = false; // 이벤트 중복 방지
    this.onSelect = null; // 외부 콜백 함수
  }

  /* ============================================================
     📅 오늘 날짜 반환 (시간 제거)
     ------------------------------------------------------------
     - ex) 2025-10-19 → new Date(2025, 9, 19)
  ============================================================ */
  todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /* ============================================================
     🔄 "YYYY-MM-DD" → Date 변환
     ------------------------------------------------------------
     - 문자열을 Date 객체로 변환
  ============================================================ */
  parseYmd(ymd) {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  /* ============================================================
     🔄 Date → "YYYY-MM-DD" 포맷 변환
     ------------------------------------------------------------
     - 날짜 비교나 data-attribute 저장용 포맷팅
  ============================================================ */
  fmt(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /* ============================================================
     🧭 mount(container)
     ------------------------------------------------------------
     - 캘린더를 지정된 DOM 컨테이너에 렌더링
     - Angular: ngAfterViewInit()에서 초기화 로직으로 대체 가능
  ============================================================ */
  mount(container) {
    this.container = container;
    this.render(); // UI 생성
    this.update(); // 현재 월 렌더링
    this.bindGridEvents(); // 날짜 클릭/hover 이벤트 바인딩
  }

  /* ============================================================
     🧱 render()
     ------------------------------------------------------------
     - 캘린더 기본 구조(헤더 + 요일 + grid) 생성
     - 월/년 이동 및 오늘 버튼 이벤트 설정
     - Angular: (click) 바인딩으로 대체
  ============================================================ */
  render() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <button class="btn--icon-utility prev-year-btn"><i class="icon--caret-double-left icon"></i></button>
          <button class="btn--icon-utility prev-month-btn"><i class="icon--caret-left icon"></i></button>
          <div class="calendar-header__center">
            <span class="current-month"></span>
            <button class="today-btn">오늘</button>
          </div>
          <button class="btn--icon-utility next-month-btn"><i class="icon--caret-right icon"></i></button>
          <button class="btn--icon-utility next-year-btn"><i class="icon--caret-double-right icon"></i></button>
        </div>

        <div class="calendar-weekdays">
          ${["일", "월", "화", "수", "목", "금", "토"]
            .map((d) => `<div>${d}</div>`)
            .join("")}
        </div>

        <div class="calendar-grid"></div>
      </div>
    `;

    // 📅 연/월 이동 버튼 이벤트
    this.container
      .querySelector(".prev-year-btn")
      .addEventListener("click", () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.update();
      });
    this.container
      .querySelector(".next-year-btn")
      .addEventListener("click", () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.update();
      });
    this.container
      .querySelector(".prev-month-btn")
      .addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.update();
      });
    this.container
      .querySelector(".next-month-btn")
      .addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.update();
      });

    // 오늘 버튼 → 현재 월로 이동
    this.container.querySelector(".today-btn").addEventListener("click", () => {
      this.currentDate = this.todayLocal();
      this.update();
    });
  }

  /* ============================================================
     🎯 bindGridEvents()
     ------------------------------------------------------------
     - 날짜 셀 클릭 및 hover 이벤트 처리
     - Angular: template 내 (click)="onDateClick(date)" 대체 가능
     - onSelect() 호출 시 출처 플래그(fromShortcut, fromMonth) 전달
  ============================================================ */
  bindGridEvents() {
    if (this._gridBound) return;
    this._gridBound = true;

    const grid = this.container.querySelector(".calendar-grid");

    // ✅ 날짜 클릭 이벤트
    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".calendar-cell");
      if (!cell) return;
      const date = this.parseYmd(cell.dataset.date);

      // 📌 단일 모드 or 범위 모드 처리
      if (this.mode === "single") {
        this.selectedRange = { start: date, end: null };
      } else {
        let { start, end } = this.selectedRange;
        if (!start && !end) {
          this.selectedRange = { start: date, end: null };
        } else if (start && !end) {
          if (date.getTime() < start.getTime()) {
            this.selectedRange = { start: date, end: null };
          } else {
            this.selectedRange = { start, end: date };
          }
        } else {
          this.selectedRange = { start: date, end: null };
        }
      }

      this.hoverDate = null;
      this.update();

      /* ------------------------------------------------------------
         ✅ 날짜 클릭 시 onSelect 호출
         - fromShortcut: false (직접 선택)
         - fromMonth: false (월 변경 아님)
      ------------------------------------------------------------ */
      if (this.onSelect)
        this.onSelect({
          ...this.selectedRange,
          fromShortcut: false,
          fromMonth: false,
        });
    });

    // hover → 범위 미리보기
    grid.addEventListener("mousemove", (e) => {
      if (this.mode === "single") return;
      const cell = e.target.closest(".calendar-cell");
      if (!cell) return;
      const { start, end } = this.selectedRange;

      if (start && !end) {
        const newHover = this.parseYmd(cell.dataset.date);
        if (
          !this.hoverDate ||
          this.fmt(this.hoverDate) !== this.fmt(newHover)
        ) {
          this.hoverDate = newHover;
          this.update();
        }
      }
    });

    // hover 해제 시 초기화
    grid.addEventListener("mouseleave", () => {
      if (this.hoverDate) {
        this.hoverDate = null;
        this.update();
      }
    });
  }

  /* ============================================================
     🔄 update()
     ------------------------------------------------------------
     - 현재 월의 날짜 grid 렌더링
     - 선택된 범위 및 hover 상태에 따라 스타일 갱신
  ============================================================ */
  update() {
    const grid = this.container.querySelector(".calendar-grid");
    const label = this.container.querySelector(".current-month");
    grid.innerHTML = "";

    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    label.textContent = `${y}년 ${m + 1}월`;

    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();

    // 앞쪽 공백 채우기
    for (let i = 0; i < firstDay; i++)
      grid.appendChild(document.createElement("div"));

    const { start, end } = this.selectedRange;
    const previewEnd = end || this.hoverDate;

    // 날짜 셀 생성
    for (let d = 1; d <= lastDate; d++) {
      const date = new Date(y, m, d);
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      cell.dataset.date = this.fmt(date);

      const span = document.createElement("span");
      span.textContent = d;
      cell.appendChild(span);

      // 오늘
      if (this.fmt(date) === this.fmt(this.today)) cell.classList.add("today");

      // 시작/종료일
      if (start && this.fmt(date) === this.fmt(start))
        cell.classList.add("selected-start");
      if (end && this.fmt(date) === this.fmt(end))
        cell.classList.add("selected-end");

      // 범위 내부
      if (this.mode === "range" && start && previewEnd) {
        const a = start.getTime(),
          b = previewEnd.getTime();
        const min = Math.min(a, b),
          max = Math.max(a, b),
          t = date.getTime();
        if (t > min && t < max) cell.classList.add("in-range");
      }
      grid.appendChild(cell);
    }
  }

  /* ============================================================
     ⚙️ setRange({ start, end })
     ------------------------------------------------------------
     - 외부에서 날짜 범위를 강제 지정
     - fromShortcut: true (단축선택 버튼 등)
  ============================================================ */
  setRange({ start, end }) {
    this.selectedRange = { start, end };
    if (start) this.currentDate = new Date(start);
    this.update();

    if (this.onSelect) this.onSelect({ start, end, fromShortcut: true });
  }

  /* ============================================================
     ♻️ clearRange()
     ------------------------------------------------------------
     - 선택된 범위를 초기화하고 캘린더 갱신
  ============================================================ */
  clearRange() {
    this.selectedRange = { start: null, end: null };
    this.update();
  }
}
