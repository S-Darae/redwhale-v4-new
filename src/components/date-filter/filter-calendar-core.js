import "../date-picker/date-picker.scss";

export default class FilterCalendarCore {
  constructor({ mode = "range" } = {}) {
    // 캘린더 동작 모드
    // - "single": 단일 날짜 선택
    // - "range" : 시작일~종료일 범위 선택
    this.mode = mode;

    // 현재 표시 중인 달 (year, month)
    this.currentDate = this.todayLocal();

    // 오늘 날짜 (비교용)
    this.today = this.todayLocal();

    // 선택된 날짜 범위
    this.selectedRange = { start: null, end: null };

    // hover 시점 (범위 선택 중 마우스 올린 셀)
    this.hoverDate = null;

    // 이벤트 바인딩 중복 방지
    this._gridBound = false;

    // 날짜 선택 시 외부에 전달되는 콜백
    this.onSelect = null;
  }

  /* ==============================
     오늘 날짜 반환 (시간 제거)
     ============================== */
  todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /* ==============================
     "YYYY-MM-DD" → Date 변환
     ============================== */
  parseYmd(ymd) {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  /* ==============================
     Date → "YYYY-MM-DD" 변환
     ============================== */
  fmt(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /* ==============================
     캘린더 mount
     ============================== */
  mount(container) {
    this.container = container;
    this.render(); // 캘린더 뼈대 HTML 생성
    this.update(); // 현재 월 데이터 렌더링
    this.bindGridEvents(); // 날짜 클릭/hover 이벤트 연결
  }

  /* ==============================
     캘린더 UI 렌더링
     ============================== */
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
          ${["일", "월", "화", "수", "목", "금", "토"]
            .map((d) => `<div>${d}</div>`)
            .join("")}
        </div>

        <!-- 날짜 grid -->
        <div class="calendar-grid"></div>
      </div>
    `;

    // 연/월 네비게이션 버튼 동작
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

  /* ==============================
     grid 이벤트 바인딩
     ============================== */
  bindGridEvents() {
    if (this._gridBound) return;
    this._gridBound = true;

    const grid = this.container.querySelector(".calendar-grid");

    // 날짜 클릭
    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".calendar-cell");
      if (!cell) return;
      const date = this.parseYmd(cell.dataset.date);

      if (this.mode === "single") {
        // 단일 선택 모드
        this.selectedRange = { start: date, end: null };
      } else {
        // 범위 선택 모드
        let { start, end } = this.selectedRange;
        if (!start && !end) {
          // 첫 클릭 → 시작일
          this.selectedRange = { start: date, end: null };
        } else if (start && !end) {
          // 두 번째 클릭 → 종료일
          if (date.getTime() < start.getTime()) {
            // 두 번째 클릭이 시작일보다 이전 → 시작일 갱신
            this.selectedRange = { start: date, end: null };
          } else {
            this.selectedRange = { start, end: date };
          }
        } else {
          // 이미 선택된 상태에서 다시 클릭 → 새 시작일로 초기화
          this.selectedRange = { start: date, end: null };
        }
      }

      this.hoverDate = null;
      this.update();
      if (this.onSelect) this.onSelect(this.selectedRange);
    });

    // 마우스 hover (범위 미리보기)
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

    // hover 해제
    grid.addEventListener("mouseleave", () => {
      if (this.hoverDate) {
        this.hoverDate = null;
        this.update();
      }
    });
  }

  /* ==============================
     grid 업데이트 (날짜 다시 그림)
     ============================== */
  update() {
    const grid = this.container.querySelector(".calendar-grid");
    const label = this.container.querySelector(".current-month");
    grid.innerHTML = "";

    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    label.textContent = `${y}년 ${m + 1}월`;

    const firstDay = new Date(y, m, 1).getDay(); // 1일의 요일
    const lastDate = new Date(y, m + 1, 0).getDate(); // 마지막 날짜

    // 앞쪽 공백 (해당 월 시작 요일까지)
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

      // 오늘 표시
      if (this.fmt(date) === this.fmt(this.today)) cell.classList.add("today");

      // 시작일 / 종료일 표시
      if (start && this.fmt(date) === this.fmt(start))
        cell.classList.add("selected-start");
      if (end && this.fmt(date) === this.fmt(end))
        cell.classList.add("selected-end");

      // 범위 안쪽 하이라이트
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

  /* ==============================
     외부 API: 날짜 범위 강제 지정
     (숏컷, 월 선택에서 호출)
     ============================== */
  setRange({ start, end }) {
    this.selectedRange = { start, end };
    if (start) this.currentDate = new Date(start); // 해당 월로 이동
    this.update();
    if (this.onSelect) this.onSelect(this.selectedRange);
  }

  /* ==============================
     외부 API: 범위 초기화
     ============================== */
  clearRange() {
    this.selectedRange = { start: null, end: null };
    this.update();
  }
}
