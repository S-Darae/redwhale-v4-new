import Calendar from "./calendar.js";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

// 📌 현재 열려 있는 캘린더 추적용 (전역)
//   → 동시에 여러 RangePicker가 있어도 한 번에 하나만 열리도록 관리
let activeCalendar = null;

export default class DateRangePicker {
  /**
   * @param {HTMLInputElement} startInput - 시작일 input
   * @param {HTMLInputElement} endInput   - 종료일 input
   * @param {Object} [options]
   * @param {boolean} [options.presets=false] - 프리셋 버튼 사용 여부 (+7일, +30일 등)
   * @param {Date|null} [options.defaultStart=null] - 초기 시작일
   * @param {Date|null} [options.defaultEnd=null]   - 초기 종료일
   * @param {boolean} [options.showDuration=true]   - 종료일에 ", N일" 같이 기간 표시 여부
   */
  constructor(
    startInput,
    endInput,
    {
      presets = false,
      defaultStart = null,
      defaultEnd = null,
      showDuration = true,
    } = {}
  ) {
    this.startInput = startInput;
    this.endInput = endInput;

    // 현재 선택 모드: "start" | "end"
    this.selecting = "start";

    // 선택된 기간 값
    this.selectedRange = { start: null, end: null };

    this.today = todayLocal();
    this.showDuration = showDuration; // 옵션 저장

    // 내부 캘린더 인스턴스
    this.calendar = new Calendar({
      mode: "range", // 기간 선택 전용
      onSelect: (date, opt) => this.handleSelect(date, opt),
      selecting: this.selecting,
      presets,
    });

    this.init(defaultStart, defaultEnd);
  }

  /* ==========================
     초기화
     ========================== */
  init(defaultStart, defaultEnd) {
    // 캘린더 DOM 컨테이너 생성 후 body에 붙이기
    this.container = document.createElement("div");
    this.container.className = "date-range-picker-calendar";
    document.body.appendChild(this.container);

    this.calendar.mount(this.container);

    // 기본 날짜 세팅 → 종료일 > 시작일 우선
    if (defaultEnd) {
      this.calendar.currentDate = defaultEnd;
      this.calendar.update();
    } else if (defaultStart) {
      this.calendar.currentDate = defaultStart;
      this.calendar.update();
    }

    // 시작일 input 클릭
    this.startInput.addEventListener("click", (e) => {
      e.stopPropagation();
      this.selecting = "start";
      this.open(this.startInput);
    });

    // 종료일 input 클릭
    this.endInput.addEventListener("click", (e) => {
      e.stopPropagation();
      this.selecting = "end";
      this.open(this.endInput);
    });

    // 캘린더 외부 클릭 → 닫기
    document.addEventListener("click", (e) => {
      if (
        activeCalendar === this.container &&
        !this.container.contains(e.target) &&
        e.target !== this.startInput &&
        e.target !== this.endInput
      ) {
        this.close();
      }
    });
  }

  /* ==========================
     캘린더 열기
     ========================== */
  open(input) {
    // 이미 다른 캘린더 열려 있으면 닫기
    if (activeCalendar && activeCalendar !== this.container) {
      activeCalendar.classList.remove("active");
    }

    this.container.classList.add("active");
    activeCalendar = this.container;

    // 📌 input 위치 기반으로 캘린더 배치
    const rect = input.getBoundingClientRect();
    const margin = 4;
    const calendarWidth = this.container.offsetWidth || 320;
    const calendarHeight = this.container.offsetHeight || 340;

    let top = rect.bottom + window.scrollY + margin;
    let left = rect.left + window.scrollX;

    // 화면 하단 넘어가면 → 위쪽에 표시
    if (top + calendarHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - calendarHeight - margin;
    }
    // 화면 우측 넘어가면 → 오른쪽 정렬
    if (left + calendarWidth > window.scrollX + window.innerWidth) {
      left = rect.right + window.scrollX - calendarWidth;
    }

    this.container.style.position = "absolute";
    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;

    // 📌 캘린더 기준 월 결정
    if (input === this.startInput) {
      this.selecting = "start";
      this.calendar.currentDate = this.selectedRange.start
        ? new Date(this.selectedRange.start)
        : this.selectedRange.end
        ? new Date(this.selectedRange.end)
        : this.today;
    } else if (input === this.endInput) {
      this.selecting = "end";
      this.calendar.currentDate = this.selectedRange.end
        ? new Date(this.selectedRange.end)
        : this.selectedRange.start
        ? new Date(this.selectedRange.start)
        : this.today;
    }

    this.calendar.setRange(this.selectedRange, this.selecting);
  }

  /* ==========================
     캘린더 닫기
     ========================== */
  close() {
    this.container.classList.remove("active");
    if (activeCalendar === this.container) {
      activeCalendar = null;
    }
  }

  /* ==========================
     날짜 선택 처리
     ========================== */
  handleSelect(date, opt = {}) {
    const parsed = typeof date === "string" ? parseLocalDate(date) : date;
    if (!parsed) return;

    // 시작일 선택
    if (this.selecting === "start") {
      this.selectedRange.start = parsed;
      this.startInput.value = this.formatDate(parsed);

      // 종료일보다 늦으면 → 종료일 초기화
      if (this.selectedRange.end && parsed > this.selectedRange.end) {
        this.selectedRange.end = null;
        this.endInput.value = "";
      }
      this.selecting = "end";

      // 종료일 선택
    } else {
      if (!this.selectedRange.start) {
        // 시작일 없이 종료일 먼저 선택 시 → 종료일만 기록
        this.selectedRange.end = parsed;
        this.endInput.value = this.formatDate(parsed);
        this.selecting = "start";
      } else if (parsed < this.selectedRange.start) {
        // 종료일이 시작일보다 빠르면 → 종료일을 시작일로 교체
        this.selectedRange.start = parsed;
        this.startInput.value = this.formatDate(parsed);
        this.selectedRange.end = null;
        this.endInput.value = "";
        this.selecting = "end";
      } else {
        // 정상 범위 선택
        this.selectedRange.end = parsed;

        // 📌 기간 길이 계산
        const diffDays =
          Math.floor(
            (this.selectedRange.end - this.selectedRange.start) /
              (1000 * 60 * 60 * 24)
          ) + 1;

        // showDuration 옵션 적용
        this.endInput.value = this.showDuration
          ? `${this.formatDate(parsed)}, ${diffDays}일`
          : this.formatDate(parsed);
      }
    }

    // 캘린더에 선택 상태 반영
    if (this.selectedRange.start && this.selectedRange.end) {
      this.calendar.setRange(this.selectedRange, "end");
    } else if (!opt.preset) {
      this.calendar.setRange(this.selectedRange, this.selecting);
    } else {
      this.calendar.setRange(this.selectedRange, "end");
    }
  }

  /* ==========================
     날짜 포맷
     → YY년 MM월 DD일 (요일)
     ========================== */
  formatDate(date) {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    let y = date.getFullYear().toString().slice(2);
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let w = weekdays[date.getDay()];
    return `${y}년 ${m}월 ${d}일 (${w})`;
  }

  /* ==========================
     외부에서 값 세팅
     ========================== */
  setRange(start, end) {
    if (start) {
      const s = start instanceof Date ? start : parseLocalDate(start);
      this.selectedRange.start = s;
      this.startInput.value = this.formatDate(s);
    }
    if (end) {
      const e = end instanceof Date ? end : parseLocalDate(end);
      this.selectedRange.end = e;

      // 기간 일수 계산
      const diffDays =
        this.selectedRange.start && e
          ? Math.floor((e - this.selectedRange.start) / (1000 * 60 * 60 * 24)) +
            1
          : null;

      // showDuration 적용
      this.endInput.value =
        diffDays && this.showDuration
          ? `${this.formatDate(e)}, ${diffDays}일`
          : this.formatDate(e);
    }
    this.calendar.setRange(this.selectedRange, "end");
  }
}
