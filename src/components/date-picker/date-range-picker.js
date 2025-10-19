import Calendar from "./calendar.js";
import { parseLocalDate, todayLocal } from "./utils/date-utils.js";

/* =====================================================================
📅 Class: DateRangePicker
=====================================================================
시작일 / 종료일 두 개의 input과 연결되어 기간형 달력을 표시하는 모듈.

📌 주요 기능
---------------------------------------------------------------------
- mode: "range" 기반 Calendar 인스턴스 사용
- 프리셋(+7일, +30일 등) 옵션 지원
- 시작일 → 종료일 순서 선택 UX 지원
- 입력 필드 자동 업데이트 및 날짜 포맷 처리
- 외부 클릭 시 팝오버 닫힘
- 동시에 여러 인스턴스가 있어도 하나만 열림 (전역 관리)

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 예시
    <app-date-range-picker
      [defaultStart]="startDate"
      [defaultEnd]="endDate"
      [showDuration]="true"
      [presets]="true"
      (change)="onRangeChange($event)">
    </app-date-range-picker>

2️⃣ Angular Inputs
    @Input() defaultStart: Date | null = null;
    @Input() defaultEnd: Date | null = null;
    @Input() showDuration = true;
    @Input() presets = false;

3️⃣ Angular Outputs
    @Output() change = new EventEmitter<{ start: Date; end: Date }>();

4️⃣ Angular 구조 대응
    - document.body.appendChild → CDK Overlay 사용
    - document click 감지 → HostListener('document:click')
    - setRange() → @Input() binding + ngOnChanges
===================================================================== */

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

    /* ------------------------------------------------------------
       📆 내부 Calendar 인스턴스 생성
       ------------------------------------------------------------
       - mode: "range" (기간 선택 전용)
       - onSelect: 날짜 클릭 시 handleSelect() 호출
       - selecting: 현재 선택 중 필드("start"/"end") 전달
       - presets: 프리셋 버튼 활성화 여부
    ------------------------------------------------------------ */
    this.calendar = new Calendar({
      mode: "range",
      onSelect: (date, opt) => this.handleSelect(date, opt),
      selecting: this.selecting,
      presets,
    });

    this.init(defaultStart, defaultEnd);
  }

  /* ============================================================
     🧭 init(defaultStart, defaultEnd)
     ------------------------------------------------------------
     초기화
     - 캘린더 컨테이너 생성 및 body에 추가
     - 기본 날짜 세팅
     - input 클릭 및 외부 클릭 이벤트 등록
     Angular에서는 ViewContainerRef + CDK Overlay를 권장
  ============================================================ */
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

  /* ============================================================
     📂 open(input)
     ------------------------------------------------------------
     - 캘린더를 input 위치 기준으로 화면에 표시
     - 기존 열린 캘린더 닫기
     - 위치 계산 시 화면 영역 벗어나지 않도록 조정
     Angular: Overlay PositionStrategy로 대응 가능
  ============================================================ */
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

  /* ============================================================
     📁 close()
     ------------------------------------------------------------
     - 캘린더 닫기 및 전역 상태 해제
     Angular: OverlayRef.detach() or visible=false binding
  ============================================================ */
  close() {
    this.container.classList.remove("active");
    if (activeCalendar === this.container) {
      activeCalendar = null;
    }
  }

  /* ============================================================
     📅 handleSelect(date, opt)
     ------------------------------------------------------------
     - 날짜 클릭 시 호출
     - 시작일/종료일 구분하여 로직 처리
     - 기간 계산 및 input 표시 동기화
     Angular: change.emit({ start, end })
  ============================================================ */
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
        // 시작일 없이 종료일 먼저 선택 시
        this.selectedRange.end = parsed;
        this.endInput.value = this.formatDate(parsed);
        this.selecting = "start";
      } else if (parsed < this.selectedRange.start) {
        // 종료일이 시작일보다 빠르면 교체
        this.selectedRange.start = parsed;
        this.startInput.value = this.formatDate(parsed);
        this.selectedRange.end = null;
        this.endInput.value = "";
        this.selecting = "end";
      } else {
        // 정상 범위 선택
        this.selectedRange.end = parsed;

        // 📆 기간 길이 계산
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

  /* ============================================================
     🧾 formatDate(date)
     ------------------------------------------------------------
     - Date 객체 → "YY년 MM월 DD일 (요일)" 포맷 문자열
     - Angular: Pipe(dateKorean)으로 대체 가능
  ============================================================ */
  formatDate(date) {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    let y = date.getFullYear().toString().slice(2);
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let w = weekdays[date.getDay()];
    return `${y}년 ${m}월 ${d}일 (${w})`;
  }

  /* ============================================================
     ⚙️ setRange(start, end)
     ------------------------------------------------------------
     - 외부에서 값 주입 시 호출
     - input.value 및 Calendar 동기화
     Angular: @Input() 변경 감지 시 ngOnChanges 내부에서 호출
  ============================================================ */
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
