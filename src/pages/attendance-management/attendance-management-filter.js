/* ======================================================================
   📅 filter-calendar-init.js — 필터 캘린더 초기화 스크립트
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - FilterCalendarCore(단일/범위 선택용 캘린더)의 초기화
   - 페이지 내 #filter-calendar-core 요소에 mount
   - 오늘 날짜를 기본 선택(start)으로 설정
   - 날짜 선택 시 onSelect 콜백 실행
   ----------------------------------------------------------------------
   🧩 Angular 변환 가이드:
   - <app-filter-calendar> 컴포넌트로 분리
   - FilterCalendarCore는 Service 형태로 래핑 가능
   - (select) Output 이벤트로 start/end 날짜 전달
   - Default Value(today) → @Input() 으로 외부 주입 가능
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - date-picker.scss
   - filter-calendar.scss
   ====================================================================== */

import FilterCalendarCore from "../../components/date-filter/filter-calendar-core.js";
import "../../components/date-picker/date-picker.scss";
import "../../components/date-picker/filter-calendar.scss";


/* ======================================================================
   📌 캘린더 초기화
   ----------------------------------------------------------------------
   - mode: single     → 단일 날짜 선택 모드
   - mount: 해당 DOM 요소에 렌더링
   - setRange: 기본 날짜 선택값 초기화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const coreContainer = document.getElementById("filter-calendar-core");
  if (!coreContainer) return;

  /* ------------------------------------------------------
     1) FilterCalendarCore 인스턴스 생성
     ------------------------------------------------------ */
  const calendar = new FilterCalendarCore({ mode: "single" });
  calendar.mount(coreContainer);

  /* ------------------------------------------------------
     2) 오늘 날짜 기본 선택
     ------------------------------------------------------ */
  const today = calendar.todayLocal();
  calendar.setRange({
    start: today,
    end: null,
  });

  /* ------------------------------------------------------
     3) 날짜 변경 콜백
     ------------------------------------------------------ */
  calendar.onSelect = ({ start }) => {
    console.log("선택된 날짜:", start);
  };
});
