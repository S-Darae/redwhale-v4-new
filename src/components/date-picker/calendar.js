import "./date-picker.scss";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

/**
 * 📅 Calendar 컴포넌트
 * - 단일 날짜 선택(single) 또는 범위 선택(range) 지원
 * - "오늘" 버튼, 연/월 이동 버튼 제공
 * - range 모드에서 프리셋(+7일, +30일 등) 옵션 제공 가능
 * - footer 영역에 hover/확정 시 안내문 출력
 */
export default class Calendar {
  /**
   * @param {Object} options
   * @param {"single"|"range"} [options.mode="single"] - 달력 모드
   * @param {Function} [options.onSelect=()=>{}] - 날짜 클릭 시 호출되는 콜백
   * @param {"start"|"end"} [options.selecting="start"] - range 모드에서 현재 선택 중인 포지션
   * @param {boolean} [options.presets=false] - 프리셋 버튼 표시 여부
   */
  constructor({
    mode = "single",
    onSelect = () => {},
    selecting = "start",
    presets = false,
  }) {
    this.mode = mode;
    this.onSelect = onSelect;
    this.selecting = selecting;
    this.currentDate = todayLocal(); // 현재 보여줄 달 (기본: 오늘이 속한 달)
    this.today = todayLocal(); // 오늘 날짜
    this.selectedRange = { start: null, end: null }; // 범위 선택용
    this.selectedDate = null; // 단일 선택용
    this.hoverDate = null; // hover 중인 날짜 (range 종료일 선택 시)
    this.presets = presets;
  }

  /* ==========================
     달력 mount (최초 렌더링)
     ========================== */
  mount(container) {
    this.container = container;
    this.render();
    this.update();
  }

  /* ==========================
     렌더링: 기본 HTML 구조 삽입
     ========================== */
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

  /* ==========================
     이벤트 바인딩
     ========================== */
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

    // 프리셋 버튼
    if (this.presets) {
      this.container.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const days = parseInt(btn.dataset.days, 10);
          if (this.selectedRange.start) {
            let newEnd;

            // 종료일 없으면 start 기준으로 days 더함
            if (!this.selectedRange.end) {
              newEnd = new Date(this.selectedRange.start);
              newEnd.setDate(this.selectedRange.start.getDate() + days - 1);
            } else {
              newEnd = new Date(this.selectedRange.end);
              newEnd.setDate(this.selectedRange.end.getDate() + days);
            }

            this.selectedRange.end = newEnd;
            this.hoverDate = null;

            // 종료일 달로 이동
            this.currentDate = new Date(newEnd);

            this.onSelect(newEnd, { preset: true });
            this.update();
          }
        });
      });
    }
  }

  /* ==========================
     달력 업데이트 (날짜 그리드 새로 그림)
     ========================== */
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

    // 날짜 채우기
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

      // 단일 선택
      if (
        this.mode === "single" &&
        this.selectedDate &&
        this.format(date) === this.format(this.selectedDate)
      ) {
        cell.classList.add("selected");
      }

      // 범위 선택
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

        // 종료일 선택 중 → hover 상태
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

      // 이벤트: 클릭 / hover
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

    // footer 업데이트
    this.updateFooterInfo();

    // 프리셋 show/hide: 종료일 선택 중일 때만 표시
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

  /* ==========================
     hover 스타일 적용
     ========================== */
  applyHover() {
    const { start, end } = this.selectedRange;
    const cells = this.container.querySelectorAll(".calendar-cell");

    cells.forEach((cell) => {
      cell.classList.remove("hover-end", "in-range");
      const date = parseLocalDate(cell.dataset.date);

      // 종료일 선택 hover 상태
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

      // 확정된 범위 내부
      if (this.mode === "range" && start && end && date > start && date < end) {
        cell.classList.add("in-range");
      }
    });
  }

  /* ==========================
     footer 안내문 업데이트
     ========================== */
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

    // hover 중 → hoverDate 기준
    if (start && this.hoverDate) {
      const diffDays =
        Math.floor((this.hoverDate - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        info.textContent = `시작일로부터 +${diffDays}일`;
        info.classList.add("hovering");
        return;
      }
    }

    // 종료일 확정 → end 기준
    if (start && end) {
      const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        info.textContent = `시작일로부터 +${diffDays}일`;
        info.classList.add("confirmed");
      }
    }
  }

  /* ==========================
     외부에서 값 세팅
     ========================== */
  setDate(date) {
    this.selectedDate = date;
    this.currentDate = new Date(date); // 해당 달로 이동
    this.update();
  }

  setRange(range, selecting = "start") {
    this.selectedRange = range;
    this.selecting = selecting;
    this.update();
  }

  /* ==========================
     YYYY-MM-DD 포맷 변환
     ========================== */
  format(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}
