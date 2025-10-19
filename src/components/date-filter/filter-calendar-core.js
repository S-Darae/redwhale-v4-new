import "../date-picker/date-picker.scss";

/* =====================================================================
📅 Class: FilterCalendarCore
=====================================================================
- 캘린더의 핵심 로직을 담당하는 순수 JS 클래스 (UI 독립형)
- 단일 날짜(`single`) 또는 날짜 범위(`range`) 선택 모드 지원
- 오늘 날짜 기준으로 렌더링 및 선택 상태를 자동 업데이트
- 외부 컴포넌트(date-picker 등)에서 mount() 호출로 DOM에 부착

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
    @Output() dateSelect = new EventEmitter<{ start: Date; end?: Date }>();

4️⃣ Angular 주요 로직 대응
    - render(), update() → 템플릿 렌더링 및 changeDetection
    - bindGridEvents() → (click), (mousemove) 등 template event binding
    - onSelect 콜백 → EventEmitter.emit()으로 대체

===================================================================== */

export default class FilterCalendarCore {
  /**
   * @param {Object} [config]
   * @param {"single"|"range"} [config.mode="range"]
   *   - "single" : 단일 날짜 선택
   *   - "range"  : 시작일~종료일 범위 선택
   */
  constructor({ mode = "range" } = {}) {
    /* ---------------------------------------------------------------
       📌 상태 변수 초기화
       --------------------------------------------------------------- */
    this.mode = mode; // 캘린더 모드
    this.currentDate = this.todayLocal(); // 현재 표시 월
    this.today = this.todayLocal(); // 오늘 (비교용)
    this.selectedRange = { start: null, end: null }; // 선택된 날짜
    this.hoverDate = null; // 마우스 hover 중 날짜
    this._gridBound = false; // 이벤트 바인딩 중복 방지
    this.onSelect = null; // 외부 콜백
  }

  /* ============================================================
     📅 오늘 날짜 반환 (시간 제거)
     ------------------------------------------------------------
     - ex) 2025-10-19  →  new Date(2025, 9, 19)
     - Angular: 내부 헬퍼 함수로 유지 가능
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
    this.render(); // 기본 UI 생성
    this.update(); // 현재 월 데이터 렌더링
    this.bindGridEvents(); // 날짜 클릭/hover 이벤트 등록
  }

  /* ============================================================
     🧱 render()
     ------------------------------------------------------------
     - 캘린더 기본 뼈대(연/월 네비게이션 + 요일 + grid) 생성
     - 버튼 클릭 시 month/year 이동 이벤트 설정
     - Angular: 템플릿 내 버튼 (click) 이벤트로 대체
  ============================================================ */
  render() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <!-- 연/월 이동 버튼 -->
          <button class="btn--icon-utility prev-year-btn"><i class="icon--caret-double-left icon"></i></button>
          <button class="btn--icon-utility prev-month-btn"><i class="icon--caret-left icon"></i></button>

          <!-- 현재 월 표시 + 오늘 버튼 -->
          <div class="calendar-header__center">
            <span class="current-month"></span>
            <button class="today-btn">오늘</button>
          </div>

          <button class="btn--icon-utility next-month-btn"><i class="icon--caret-right icon"></i></button>
          <button class="btn--icon-utility next-year-btn"><i class="icon--caret-double-right icon"></i></button>
        </div>

        <!-- 요일 표시 -->
        <div class="calendar-weekdays">
          ${["일", "월", "화", "수", "목", "금", "토"].map((d) => `<div>${d}</div>`).join("")}
        </div>

        <!-- 날짜 grid -->
        <div class="calendar-grid"></div>
      </div>
    `;

    /* ------------------------------------------------------------
       📅 연/월 네비게이션 버튼 동작
       ------------------------------------------------------------ */
    this.container.querySelector(".prev-year-btn").addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
      this.update();
    });

    this.container.querySelector(".next-year-btn").addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
      this.update();
    });

    this.container.querySelector(".prev-month-btn").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.update();
    });

    this.container.querySelector(".next-month-btn").addEventListener("click", () => {
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
     - 날짜 클릭 및 hover 이벤트 처리
     - Angular: template 내 (click)="onDateClick(date)" 형태로 교체 가능
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

      if (this.mode === "single") {
        // 단일 날짜 모드
        this.selectedRange = { start: date, end: null };
      } else {
        // 범위 모드
        let { start, end } = this.selectedRange;
        if (!start && !end) {
          // 첫 클릭 → 시작일
          this.selectedRange = { start: date, end: null };
        } else if (start && !end) {
          // 두 번째 클릭 → 종료일
          if (date.getTime() < start.getTime()) {
            // 두 번째 클릭이 시작일보다 이전
            this.selectedRange = { start: date, end: null };
          } else {
            this.selectedRange = { start, end: date };
          }
        } else {
          // 이미 선택 후 다시 클릭 → 리셋
          this.selectedRange = { start: date, end: null };
        }
      }

      this.hoverDate = null;
      this.update();

      // 외부 콜백 실행
      if (this.onSelect) this.onSelect(this.selectedRange);
    });

    // ✅ hover 중 → 범위 미리보기
    grid.addEventListener("mousemove", (e) => {
      if (this.mode === "single") return;
      const cell = e.target.closest(".calendar-cell");
      if (!cell) return;
      const { start, end } = this.selectedRange;

      if (start && !end) {
        const newHover = this.parseYmd(cell.dataset.date);
        if (!this.hoverDate || this.fmt(this.hoverDate) !== this.fmt(newHover)) {
          this.hoverDate = newHover;
          this.update();
        }
      }
    });

    // ✅ hover 해제 시 초기화
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
     - 캘린더의 날짜 grid를 다시 그림
     - 현재 월, 선택된 범위, hover 상태에 따라 스타일 갱신
     - Angular: *ngFor + class 바인딩으로 대체 가능
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
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("div"));
    }

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
      if (start && this.fmt(date) === this.fmt(start)) cell.classList.add("selected-start");
      if (end && this.fmt(date) === this.fmt(end)) cell.classList.add("selected-end");

      // 범위 내부
      if (this.mode === "range" && start && previewEnd) {
        const a = start.getTime(), b = previewEnd.getTime();
        const min = Math.min(a, b), max = Math.max(a, b), t = date.getTime();
        if (t > min && t < max) cell.classList.add("in-range");
      }

      grid.appendChild(cell);
    }
  }

  /* ============================================================
     ⚙️ setRange({ start, end })
     ------------------------------------------------------------
     - 외부에서 선택 범위를 강제로 지정
     - Angular: @Input() selectedRange 변경 시 호출
  ============================================================ */
  setRange({ start, end }) {
    this.selectedRange = { start, end };
    if (start) this.currentDate = new Date(start);
    this.update();
    if (this.onSelect) this.onSelect(this.selectedRange);
  }

  /* ============================================================
     ♻️ clearRange()
     ------------------------------------------------------------
     - 선택 범위를 초기화하고 렌더링 갱신
     - Angular: reset() 메서드로 매핑 가능
  ============================================================ */
  clearRange() {
    this.selectedRange = { start: null, end: null };
    this.update();
  }
}
