import "./date-picker.scss";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

/* =====================================================================
📅 Component: Calendar
=====================================================================
- 단일 날짜(single) 및 범위(range) 선택 모드를 지원하는 핵심 달력 UI.
- 연/월 이동 버튼, “오늘” 버튼, 프리셋(+7일, +30일 등) 기능 제공.
- hover 시 기간 미리보기 및 footer 안내문 표시.
- FilterCalendarCore, DatePicker 등 상위 컴포넌트에서 직접 사용.

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 예시
    <app-calendar
      [mode]="'range'"
      [showPresets]="true"
      [selecting]="'end'"
      (select)="onDateSelect($event)">
    </app-calendar>

2️⃣ Angular @Input() 속성
    @Input() mode: 'single' | 'range' = 'single';
    @Input() selecting: 'start' | 'end' = 'start';
    @Input() showPresets = false;

3️⃣ Angular @Output() 이벤트
    @Output() select = new EventEmitter<Date | { start: Date; end: Date }>();

4️⃣ 주요 기능 대응
    - mount() → ngAfterViewInit()
    - update() → 자동 ChangeDetection
    - bindEvents() → (click) 이벤트 바인딩으로 대체
    - footer / hover 표시 → template 상태바인딩 ([class])
===================================================================== */

export default class Calendar {
  /**
   * @param {Object} options - 초기화 설정
   * @param {"single"|"range"} [options.mode="single"] - 달력 모드
   * @param {Function} [options.onSelect=()=>{}] - 날짜 클릭 시 호출되는 콜백
   * @param {"start"|"end"} [options.selecting="start"] - range 모드 선택 포지션
   * @param {boolean} [options.presets=false] - 프리셋 버튼 표시 여부
   */
  constructor({
    mode = "single",
    onSelect = () => {},
    selecting = "start",
    presets = false,
  }) {
    /* ------------------------------------------------------------
       📌 기본 상태값
       ------------------------------------------------------------ */
    this.mode = mode;
    this.onSelect = onSelect;
    this.selecting = selecting;
    this.currentDate = todayLocal(); // 현재 표시할 달
    this.today = todayLocal(); // 오늘 (비교용)
    this.selectedRange = { start: null, end: null }; // range 모드용
    this.selectedDate = null; // single 모드용
    this.hoverDate = null; // hover 상태 날짜
    this.presets = presets; // 프리셋 버튼 사용 여부
  }

  /* ============================================================
     🧭 mount(container)
     ------------------------------------------------------------
     - 초기 렌더링 실행 (HTML 삽입 + 첫 업데이트)
     - Angular: ngAfterViewInit() 시점에서 자동 호출 가능
  ============================================================ */
  mount(container) {
    this.container = container;
    this.render();
    this.update();
  }

  /* ============================================================
     🧱 render()
     ------------------------------------------------------------
     - 달력 기본 HTML 구조 삽입
     - 헤더(연/월 이동, 오늘 버튼), 요일 행, 날짜 grid, 프리셋, footer 포함
     - Angular: 템플릿으로 변환 시 ngIf + *ngFor로 대응
  ============================================================ */
  render() {
    this.container.innerHTML = `
      <div class="calendar">
        <!-- 헤더: 연/월 이동, 오늘 버튼 -->
        <div class="calendar-header">
          <button class="btn--icon-utility prev-year"><i class="icon--caret-double-left icon"></i></button>
          <button class="btn--icon-utility prev-month"><i class="icon--caret-left icon"></i></button>
          <div class="calendar-header__center">
            <span class="current-month"></span>
            <button class="today-btn">오늘</button>
          </div>
          <button class="btn--icon-utility next-month"><i class="icon--caret-right icon"></i></button>
          <button class="btn--icon-utility next-year"><i class="icon--caret-double-right icon"></i></button>
        </div>

        <!-- 요일 헤더 -->
        <div class="calendar-weekdays">
          ${["일", "월", "화", "수", "목", "금", "토"]
            .map((d) => `<div>${d}</div>`)
            .join("")}
        </div>

        <!-- 날짜가 채워질 그리드 -->
        <div class="calendar-grid"></div>

        <!-- 프리셋 버튼 (옵션일 때만) -->
        ${
          this.presets
            ? `
          <div class="calendar-presets hidden">
            ${[7, 10, 30, 365]
              .map(
                (d) =>
                  `<button class="preset-btn" data-days="${d}">+${d}일</button>`
              )
              .join("")}
          </div>`
            : ""
        }

        <!-- footer 안내 -->
        <div class="calendar-footer">
          <span class="calendar-info"></span>
        </div>
      </div>
    `;
    this.bindEvents();
  }

  /* ============================================================
     ⚙️ bindEvents()
     ------------------------------------------------------------
     - 모든 버튼/셀 이벤트 바인딩
     - Angular에서는 (click), (mouseenter), (mouseleave)로 대체
  ============================================================ */
  bindEvents() {
    // 연/월 이동
    this.container.querySelector(".prev-year").addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
      this.update();
    });
    this.container.querySelector(".next-year").addEventListener("click", () => {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
      this.update();
    });
    this.container
      .querySelector(".prev-month")
      .addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.update();
      });
    this.container
      .querySelector(".next-month")
      .addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.update();
      });

    // 오늘 버튼
    this.container.querySelector(".today-btn").addEventListener("click", () => {
      this.currentDate = todayLocal();
      this.update();
    });

    // 프리셋 버튼 클릭 (+7일, +10일 등)
    if (this.presets) {
      this.container.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const days = parseInt(btn.dataset.days, 10);
          if (this.selectedRange.start) {
            let newEnd;

            // 종료일 없으면 start 기준으로 days 추가
            if (!this.selectedRange.end) {
              newEnd = new Date(this.selectedRange.start);
              newEnd.setDate(this.selectedRange.start.getDate() + days - 1);
            } else {
              newEnd = new Date(this.selectedRange.end);
              newEnd.setDate(this.selectedRange.end.getDate() + days);
            }

            this.selectedRange.end = newEnd;
            this.hoverDate = null;
            this.currentDate = new Date(newEnd);

            this.onSelect(newEnd, { preset: true });
            this.update();
          }
        });
      });
    }
  }

  /* ============================================================
     🔄 update()
     ------------------------------------------------------------
     - 달력 날짜 grid 전체를 다시 그림
     - 선택/hover 상태에 따라 클래스 동적으로 부여
     - Angular: *ngFor, [class] 바인딩으로 대체 가능
  ============================================================ */
  update() {
    const grid = this.container.querySelector(".calendar-grid");
    const label = this.container.querySelector(".current-month");
    grid.innerHTML = "";

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    label.textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay(); // 1일의 요일
    const lastDate = new Date(year, month + 1, 0).getDate(); // 마지막 날짜

    // 빈칸 채우기 (1일 시작 전)
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("div"));
    }

    // 날짜 셀 생성
    for (let d = 1; d <= lastDate; d++) {
      const date = new Date(year, month, d);
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      cell.dataset.date = this.format(date);

      const span = document.createElement("span");
      span.textContent = d;
      cell.appendChild(span);

      // 오늘 표시
      if (this.format(date) === this.format(this.today)) {
        cell.classList.add("today");
      }

      // 단일 선택 표시
      if (
        this.mode === "single" &&
        this.selectedDate &&
        this.format(date) === this.format(this.selectedDate)
      ) {
        cell.classList.add("selected");
      }

      // 범위 선택 표시
      if (this.mode === "range") {
        const { start, end } = this.selectedRange;
        if (start && this.format(date) === this.format(start))
          cell.classList.add("selected-start");
        if (end && this.format(date) === this.format(end))
          cell.classList.add("selected-end");

        // 범위 내부
        if (start && end) {
          if (date > start && date < end) cell.classList.add("in-range");
          if (this.format(date) === this.format(start))
            cell.classList.add("with-end");
          if (this.format(date) === this.format(end))
            cell.classList.add("with-start");
        }

        // hover 중일 때 미리보기
        if (this.selecting === "end" && start && !end && this.hoverDate) {
          const min = start < this.hoverDate ? start : this.hoverDate;
          const max = start < this.hoverDate ? this.hoverDate : start;
          if (date > min && date < max) cell.classList.add("in-range");
          if (this.format(date) === this.format(this.hoverDate))
            cell.classList.add("hover-end");
        }

        // 종료일 선택 중인데 start보다 이전 → disabled
        if (this.selecting === "end" && start && date < start) {
          if (this.format(date) !== this.format(start))
            cell.classList.add("disabled");
        }
      }

      // 셀 클릭 / hover 이벤트
      cell.addEventListener("click", () => {
        if (!cell.classList.contains("disabled")) {
          this.onSelect(date);
          this.update();
        }
      });
      cell.addEventListener("mouseenter", () => {
        if (
          this.mode === "range" &&
          this.selecting === "end" &&
          this.selectedRange.start
        ) {
          this.hoverDate = date;
          this.applyHover();
          this.updateFooterInfo();
        }
      });
      cell.addEventListener("mouseleave", () => {
        if (this.mode === "range" && this.selecting === "end") {
          this.hoverDate = null;
          this.applyHover();
          this.updateFooterInfo();
        }
      });

      grid.appendChild(cell);
    }

    // footer 안내 갱신
    this.updateFooterInfo();

    // 프리셋 영역 show/hide (종료일 선택 중에만 표시)
    if (this.presets) {
      const presetArea = this.container.querySelector(".calendar-presets");
      if (presetArea) {
        if (
          this.mode === "range" &&
          this.selecting === "end" &&
          this.selectedRange.start
        ) {
          presetArea.classList.remove("hidden");
        } else {
          presetArea.classList.add("hidden");
        }
      }
    }
  }

  /* ============================================================
     🖱 applyHover()
     ------------------------------------------------------------
     - hover 상태에 따라 in-range / hover-end 클래스 갱신
  ============================================================ */
  applyHover() {
    const { start, end } = this.selectedRange;
    const cells = this.container.querySelectorAll(".calendar-cell");

    cells.forEach((cell) => {
      cell.classList.remove("hover-end", "in-range");
      const date = parseLocalDate(cell.dataset.date);

      // hover 중인 종료일 표시
      if (
        this.mode === "range" &&
        this.selecting === "end" &&
        start &&
        this.hoverDate
      ) {
        const min = start < this.hoverDate ? start : this.hoverDate;
        const max = start < this.hoverDate ? this.hoverDate : start;
        if (date > min && date < max) cell.classList.add("in-range");
        if (this.format(date) === this.format(this.hoverDate))
          cell.classList.add("hover-end");
      }

      // 확정된 범위 내부 표시
      if (this.mode === "range" && start && end && date > start && date < end) {
        cell.classList.add("in-range");
      }
    });
  }

  /* ============================================================
     📜 updateFooterInfo()
     ------------------------------------------------------------
     - footer 안내문 (hover/확정) 텍스트 동적 변경
     - Angular: {{footerText}} + [class] 바인딩으로 대체 가능
  ============================================================ */
  updateFooterInfo() {
    const footer = this.container.querySelector(".calendar-footer");
    const info = footer.querySelector(".calendar-info");
    const { start, end } = this.selectedRange;

    footer.classList.remove("visible");
    info.textContent = "";
    info.classList.remove("confirmed", "hovering");

    if (this.mode !== "range" || this.selecting !== "end" || !start) return;

    // 기본 문구
    info.textContent = "종료일 선택";
    footer.classList.add("visible");

    // hover 중 안내문
    if (start && this.hoverDate) {
      const diffDays =
        Math.floor((this.hoverDate - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        info.textContent = `시작일로부터 +${diffDays}일`;
        info.classList.add("hovering");
        return;
      }
    }

    // 종료일 확정 시 안내문
    if (start && end) {
      const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        info.textContent = `시작일로부터 +${diffDays}일`;
        info.classList.add("confirmed");
      }
    }
  }

  /* ============================================================
     ⚙️ setDate(date)
     ------------------------------------------------------------
     - 외부에서 단일 날짜 지정 시 호출
     - Angular: @Input() selectedDate 로 매핑 가능
  ============================================================ */
  setDate(date) {
    this.selectedDate = date;
    this.currentDate = new Date(date);
    this.update();
  }

  /* ============================================================
     ⚙️ setRange(range, selecting)
     ------------------------------------------------------------
     - 외부에서 범위 지정 시 호출
     - Angular: @Input() selectedRange 로 매핑 가능
  ============================================================ */
  setRange(range, selecting = "start") {
    this.selectedRange = range;
    this.selecting = selecting;
    this.update();
  }

  /* ============================================================
     🔢 format(date)
     ------------------------------------------------------------
     - Date → YYYY-MM-DD 문자열 변환
     - Angular: dateUtilsService.fmt()로 대체 가능
  ============================================================ */
  format(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}
