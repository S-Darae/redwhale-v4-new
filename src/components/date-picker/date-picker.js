import Calendar from "./calendar.js";
import "./date-picker.scss";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

// 📌 현재 열려 있는 캘린더 추적용 (전역 변수)
// - 동시에 여러 DatePicker가 있을 때, 한 번에 하나만 열리도록 관리
let activeCalendar = null;

export default class DatePicker {
  /**
   * @param {HTMLInputElement} input        - 연결할 input 요소
   * @param {Date|null} [defaultValue=null] - 기본 선택 날짜
   */
  constructor(input, defaultValue = null) {
    this.input = input;
    this.today = todayLocal();

    // 내부 Calendar 인스턴스 생성
    // - mode: "single" → 단일 날짜 선택 전용
    // - onSelect: 날짜 선택 시 input value 세팅 후 닫힘
    this.calendar = new Calendar({
      mode: "single",
      onSelect: (date) => this.setDate(date),
    });

    this.init(defaultValue);
  }

  /* ==========================
     초기화
     ========================== */
  init(defaultValue) {
    // 📌 캘린더 DOM 컨테이너 생성 후 body에 붙이기
    this.container = document.createElement("div");
    this.container.className = "date-picker-calendar";
    document.body.appendChild(this.container);

    // 캘린더 mount
    this.calendar.mount(this.container);

    // 기본값 있으면 해당 날짜를 현재 달로 설정
    if (defaultValue) {
      this.calendar.currentDate = defaultValue;
      this.calendar.update();
    }

    // input 클릭 → 캘린더 열기
    this.input.addEventListener("click", (e) => {
      e.stopPropagation(); // 버블링 방지
      this.open();
    });

    // document 전역 클릭 감지 → 캘린더 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (
        activeCalendar === this.container && // 현재 열린 캘린더와 동일해야 함
        !this.container.contains(e.target) && // 캘린더 내부 클릭 아님
        e.target !== this.input // input 클릭 아님
      ) {
        this.close();
      }
    });
  }

  /* ==========================
     캘린더 열기
     ========================== */
  open() {
    // 이미 다른 캘린더가 열려있으면 닫기
    if (activeCalendar && activeCalendar !== this.container) {
      activeCalendar.classList.remove("active");
    }

    // 현재 캘린더 활성화
    this.container.classList.add("active");
    activeCalendar = this.container;

    // 📌 위치 계산
    const rect = this.input.getBoundingClientRect();
    const margin = 4;
    const calendarWidth = this.container.offsetWidth || 320;
    const calendarHeight = this.container.offsetHeight || 340;

    // 기본 위치: input 하단
    let top = rect.bottom + window.scrollY + margin;
    let left = rect.left + window.scrollX;

    // 화면 하단을 벗어나면 → input 위쪽에 표시
    if (top + calendarHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - calendarHeight - margin;
    }

    // 화면 오른쪽을 벗어나면 → input 우측 기준 정렬
    if (left + calendarWidth > window.scrollX + window.innerWidth) {
      left = rect.right + window.scrollX - calendarWidth;
    }

    // 절대 위치 지정
    this.container.style.position = "absolute";
    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;
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
     날짜 설정
     ========================== */
  setDate(date) {
    // 문자열이면 Date 객체로 변환
    const parsed = typeof date === "string" ? parseLocalDate(date) : date;
    if (!parsed) return;

    // input value 업데이트 (포맷 적용)
    this.input.value = this.formatDate(parsed);

    // 내부 Calendar 상태도 동기화
    this.calendar.setDate(parsed);

    // 캘린더 닫기
    this.close();
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
}
