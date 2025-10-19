import Calendar from "./calendar.js";
import "./date-picker.scss";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

/* =====================================================================
📅 Class: DatePicker
=====================================================================
HTML input 요소와 연결되어 단일 날짜 선택 캘린더를 표시하는 모듈

📌 주요 특징
---------------------------------------------------------------------
- 단일 날짜 선택만 지원 (mode: "single")
- input 클릭 시 팝오버 형태의 캘린더 표시
- 외부 클릭 시 자동 닫힘
- 여러 DatePicker가 동시에 있을 때, 하나만 열리도록 전역 관리

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 형태
    <app-date-picker
      [defaultValue]="selectedDate"
      (change)="onDateSelected($event)">
    </app-date-picker>

2️⃣ Angular 내부 구조
    - Template: `<input type="text" readonly (click)="openCalendar()">`
    - Overlay Calendar: `<app-calendar [mode]="'single'">`

3️⃣ Angular @Input() / @Output()
    @Input() defaultValue: Date | null = null;
    @Output() change = new EventEmitter<Date>();

4️⃣ Angular Overlay 처리
    - 현재 JS의 `document.body.appendChild()`는
      Angular의 CDK Overlay 또는 Portal로 대체.
===================================================================== */

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

    /* ------------------------------------------------------------
       📆 내부 Calendar 인스턴스 생성
       ------------------------------------------------------------
       - mode: "single" → 단일 날짜 선택 전용
       - onSelect: 날짜 클릭 시 input.value 업데이트 후 자동 닫힘
    ------------------------------------------------------------ */
    this.calendar = new Calendar({
      mode: "single",
      onSelect: (date) => this.setDate(date),
    });

    this.init(defaultValue);
  }

  /* ============================================================
     🧭 init(defaultValue)
     ------------------------------------------------------------
     초기 설정 및 이벤트 등록.
     - Calendar DOM 컨테이너 생성 및 body에 추가
     - input 클릭 시 open() 실행
     - 문서 외부 클릭 감지 → close() 실행
     Angular에서는 ViewContainerRef 또는 CDK Overlay 사용
  ============================================================ */
  init(defaultValue) {
    // 📌 캘린더 DOM 컨테이너 생성 후 body에 붙이기
    this.container = document.createElement("div");
    this.container.className = "date-picker-calendar";
    document.body.appendChild(this.container);

    // 캘린더 mount
    this.calendar.mount(this.container);

    // 기본값이 존재할 경우 → 해당 날짜로 초기화
    if (defaultValue) {
      this.calendar.currentDate = defaultValue;
      this.calendar.update();
    }

    // input 클릭 시 캘린더 열기
    this.input.addEventListener("click", (e) => {
      e.stopPropagation(); // 버블링 방지 (document 이벤트 차단)
      this.open();
    });

    // 문서 전역 클릭 감지 → 외부 클릭 시 닫기
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

  /* ============================================================
     📂 open()
     ------------------------------------------------------------
     - 캘린더를 input 근처에 표시
     - 기존 다른 캘린더가 열려 있다면 닫기
     - 위치 계산 시 화면 밖으로 벗어나지 않도록 조정
     Angular: CDK Overlay PositionStrategy로 대체 가능
  ============================================================ */
  open() {
    // 이미 다른 캘린더가 열려 있으면 닫기
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

    // 절대 위치 지정 (팝오버 형태)
    this.container.style.position = "absolute";
    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;
  }

  /* ============================================================
     📁 close()
     ------------------------------------------------------------
     - 캘린더 닫기 및 전역 상태 해제
     Angular: OverlayRef.detach() 또는 visible=false 바인딩
  ============================================================ */
  close() {
    this.container.classList.remove("active");
    if (activeCalendar === this.container) {
      activeCalendar = null;
    }
  }

  /* ============================================================
     📅 setDate(date)
     ------------------------------------------------------------
     - 날짜를 직접 설정하거나 Calendar에서 선택 시 호출
     - 문자열(Date 문자열)도 자동 변환 처리
     - input.value 업데이트 및 내부 Calendar 동기화
     - 선택 완료 후 자동 닫힘
     Angular: (change) emit
  ============================================================ */
  setDate(date) {
    // 문자열이면 Date 객체로 변환
    const parsed = typeof date === "string" ? parseLocalDate(date) : date;
    if (!parsed) return;

    // input value 업데이트 (포맷 적용)
    this.input.value = this.formatDate(parsed);

    // 내부 Calendar 상태 동기화
    this.calendar.setDate(parsed);

    // 캘린더 닫기
    this.close();
  }

  /* ============================================================
     🧾 formatDate(date)
     ------------------------------------------------------------
     - Date 객체 → "YY년 MM월 DD일 (요일)" 포맷으로 변환
     - Angular: Pipe(`date-korean.pipe.ts`)로 대체 가능
  ============================================================ */
  formatDate(date) {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    let y = date.getFullYear().toString().slice(2);
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let w = weekdays[date.getDay()];
    return `${y}년 ${m}월 ${d}일 (${w})`;
  }
}
