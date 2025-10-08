import "../../components/radio-button/radio-button.scss";
import "../date-picker/date-picker.scss";
import "../date-picker/filter-calendar.scss";
import { createRadioButton } from "../radio-button/create-radio-button.js";
import FilterCalendarCore from "./filter-calendar-core.js";

/* ==============================
   날짜 → 한국어 포맷 변환
   ============================== */
function formatKoreanDate(date) {
  if (!(date instanceof Date)) return "";
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[date.getDay()];
  return `${yy}년 ${mm}월 ${dd}일 (${day})`;
}

/* ==============================
   주 단위 계산
   offsetWeeks: 0 → 이번주, -1 → 지난주
   월요일 시작 ~ 일요일 끝
   ============================== */
function getWeekRange(baseDate, offsetWeeks = 0) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day; // 월요일까지의 차이
  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday + offsetWeeks * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

/* ==============================
   전역: 동시에 여러 개 열리지 않도록 관리
   ============================== */
let activeCalendar = null;

export default class FilterCalendar {
  constructor(
    containerEl,
    { mode = "range", shortcuts = true, onChange = null } = {}
  ) {
    // 필수 설정
    this.container = containerEl;
    this.mode = mode; // "single" | "range"
    this.shortcuts = shortcuts; // 숏컷 버튼 on/off
    this.onChange = onChange;

    // 상태값
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.core = null; // 실제 캘린더(날짜 선택부)
    this.uid = Math.random().toString(36).substr(2, 6); // 라디오 버튼 그룹 충돌 방지용

    this.init();
  }

  /* ==============================
     초기화
     ============================== */
  init() {
    this.input = this.container.querySelector(".filter-range-input");
    if (!this.input) return;

    // 달력 wrapper 생성
    this.calendarWrap = document.createElement("div");
    this.calendarWrap.className = "filter-calendar-container";
    this.calendarWrap.innerHTML = this.renderCalendar();
    this.container.appendChild(this.calendarWrap);

    // 내부 코어 캘린더 mount
    const detailEl = this.calendarWrap.querySelector("#detail-calendar");
    if (detailEl) {
      this.core = new FilterCalendarCore({ mode: this.mode });
      this.core.mount(detailEl);

      // 코어에서 날짜 직접 선택 시 콜백
      this.core.onSelect = ({ start, end }) => {
        // 라디오 버튼 선택 해제 (토글 동작)
        this.calendarWrap
          .querySelectorAll("input[type=radio]")
          .forEach((r) => (r.checked = false));

        // 인풋 값 업데이트
        let text = "";
        if (this.mode === "single" && start) text = formatKoreanDate(start);
        else if (start && end)
          text = `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`;
        else if (start) text = formatKoreanDate(start);

        this.input.value = text;
        if (this.onChange) this.onChange({ start, end, formatted: text });
      };
    }

    // 기본 이벤트 + 숏컷 + 월별 조회 초기화
    this.bindEvents();
    if (this.shortcuts) this.renderShortcuts();
    this.renderMonths();
  }

  /* ==============================
     캘린더 전체 UI 템플릿
     ============================== */
  renderCalendar() {
    return `
      <section class="filter-calendar">
        <!-- 상단 탭: 상세 조회 / 월별 조회 -->
        <div class="line-tab small" role="tablist">
          <button class="line-tab__tab is-active" data-target="panel-detail">기간 상세 조회</button>
          <button class="line-tab__tab" data-target="panel-month">월별 조회</button>
        </div>

        <div class="line-tab__content">
          <!-- 상세 조회 패널 -->
          <div id="panel-detail" class="line-tab__panel is-visible">
            <div class="filter-calendar__calendar" id="detail-calendar"></div>
            ${
              this.shortcuts
                ? `<div class="filter-calendar__shortcuts"></div>`
                : ""
            }
          </div>

          <!-- 월별 조회 패널 -->
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

  /* ==============================
     이벤트 바인딩
     ============================== */
  bindEvents() {
    if (!this.input) return;

    // 인풋 클릭 시 달력 열기
    this.input.addEventListener("click", (e) => {
      e.stopPropagation();
      this.open();
    });

    // 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (
        activeCalendar === this.calendarWrap &&
        !this.calendarWrap.contains(e.target) &&
        e.target !== this.input
      ) {
        this.close();
      }
    });

    // 탭 전환
    this.calendarWrap.querySelectorAll(".line-tab__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.target;

        // 탭 상태
        this.calendarWrap
          .querySelectorAll(".line-tab__tab")
          .forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        // 패널 전환
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
    const updateYearLabel = () => {
      yearEl.textContent = `${this.currentDate.getFullYear()}년`;
    };
    this.calendarWrap
      .querySelector(".year-prev-btn")
      ?.addEventListener("click", () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        updateYearLabel();
      });
    this.calendarWrap
      .querySelector(".year-next-btn")
      ?.addEventListener("click", () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        updateYearLabel();
      });
    updateYearLabel();
  }

  /* ==============================
     숏컷 버튼 (오늘/어제/이번주 등)
     ============================== */
  renderShortcuts() {
    const shortcuts = [
      "전체",
      "오늘",
      "어제",
      "올해",
      "작년",
      "이번 주",
      "지난 주",
      "이번 달",
      "지난 달",
    ];
    const wrap = this.calendarWrap.querySelector(".filter-calendar__shortcuts");
    if (!wrap) return;

    // 라디오 버튼 생성
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

    // 선택 이벤트
    wrap.addEventListener("change", (e) => {
      if (e.target && e.target.type === "radio") {
        const label = e.target.value;
        let start = null,
          end = null;
        const today = new Date();

        // 라벨별 기간 계산
        switch (label) {
          case "오늘":
            start = end = new Date(today);
            break;
          case "어제":
            start = end = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 1
            );
            break;
          case "이번 달":
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
          case "지난 달":
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
          case "올해":
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
          case "작년":
            start = new Date(today.getFullYear() - 1, 0, 1);
            end = new Date(today.getFullYear() - 1, 11, 31);
            break;
          case "이번 주":
            ({ start, end } = getWeekRange(today, 0));
            break;
          case "지난 주":
            ({ start, end } = getWeekRange(today, -1));
            break;
          case "전체":
            start = end = null;
            break;
        }

        // 인풋 값 업데이트
        const formatted =
          start && end
            ? `${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`
            : "전체";
        this.input.value = formatted;
        if (this.onChange) this.onChange({ start, end, formatted });

        // 코어 캘린더에도 반영
        this.core.setRange({ start, end });
      }
    });
  }

  /* ==============================
     월별 버튼 (1월~12월)
     ============================== */
  renderMonths() {
    const monthWrap = this.calendarWrap.querySelector(
      ".filter-calendar__months"
    );
    if (!monthWrap) return;

    // 라디오 버튼 생성
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

    // 선택 이벤트
    monthWrap.addEventListener("change", (e) => {
      if (e.target && e.target.type === "radio") {
        const month = parseInt(e.target.value, 10) - 1;
        const year = this.currentDate.getFullYear();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        // 인풋 값 업데이트
        const formatted = `${formatKoreanDate(start)} ~ ${formatKoreanDate(
          end
        )}`;
        this.input.value = formatted;
        if (this.onChange) this.onChange({ start, end, formatted });

        // 코어 캘린더에도 반영
        this.core.setRange({ start, end });
      }
    });
  }

  /* ==============================
     열기 / 닫기
     ============================== */
  open() {
    // 다른 캘린더 닫기
    if (activeCalendar && activeCalendar !== this.calendarWrap)
      activeCalendar.classList.remove("active");

    // 현재 캘린더 열기
    this.calendarWrap.classList.add("active");
    activeCalendar = this.calendarWrap;

    // 위치 계산 (뷰포트 벗어나지 않도록 조정)
    const rect = this.input.getBoundingClientRect();
    const margin = 4;
    const calendarWidth = this.calendarWrap.offsetWidth || 320;
    const calendarHeight = this.calendarWrap.offsetHeight || 340;

    let top = rect.bottom + window.scrollY + margin;
    let left = rect.left + window.scrollX;
    if (top + calendarHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - calendarHeight - margin;
    }
    if (left + calendarWidth > window.scrollX + window.innerWidth) {
      left = rect.right + window.scrollX - calendarWidth;
    }

    this.calendarWrap.style.position = "absolute";
    this.calendarWrap.style.top = `${top}px`;
    this.calendarWrap.style.left = `${left}px`;
  }

  close() {
    this.calendarWrap.classList.remove("active");
    if (activeCalendar === this.calendarWrap) activeCalendar = null;
  }
}
