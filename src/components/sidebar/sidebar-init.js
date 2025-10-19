import Sidebar from "./sidebar.js";

/**
 * ======================================================================
 * 🧭 Sidebar Initialization (사이드바 초기화 스크립트)
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 페이지 내 존재하는 모든 사이드바 열기 버튼(data-open-target)을 탐색하고,
 *   대응되는 Sidebar 인스턴스를 생성 및 연결한다.
 * - 버튼 클릭 시 해당 사이드바를 open() 하여 화면에 표시한다.
 * ----------------------------------------------------------------------
 * 📘 작동 규칙:
 * - 열기 버튼에는 반드시 `data-open-target="sidebarId"` 속성이 있어야 함.
 * - 해당 값과 동일한 id를 가진 <aside id="sidebarId" class="sidebar">를 찾아 연결.
 * - Sidebar 클래스는 각 사이드바의 열림/닫힘 애니메이션 및 상태 제어 담당.
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * 1️⃣ Sidebar 클래스를 Angular `SidebarService` 또는 `<app-sidebar>`로 전환
 * 2️⃣ `data-open-target` → `(click)="sidebarService.open('id')"` 식으로 변환
 * 3️⃣ DOM 탐색(`querySelectorAll`) 제거 → Angular 템플릿 참조(`@ViewChild`)
 * 4️⃣ 사이드바 열기 버튼은 `<button (click)="openSidebar('userFilter')">` 형태로 구성
 * 5️⃣ Sidebar 인스턴스 제어는 Service의 상태 관리로 대체 (BehaviorSubject 등)
 * ----------------------------------------------------------------------
 * 📘 사용 예시 (Vanilla JS)
 * <button data-open-target="user-filter-sidebar">필터 열기</button>
 * <aside id="user-filter-sidebar" class="sidebar"> ... </aside>
 * ======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     🔍 모든 열기 버튼 탐색
     ---------------------------------------------------------
     - 페이지 내에서 data-open-target 속성을 가진 버튼들을 찾음
     - 각 버튼은 고유한 sidebar id를 가짐
     ========================================================= */
  document.querySelectorAll("[data-open-target]").forEach((openBtn) => {
    // 🔑 버튼에서 대상 사이드바 ID 가져오기
    const targetId = openBtn.getAttribute("data-open-target");
    const sidebarEl = document.getElementById(targetId);

    /* =========================================================
       🎯 Sidebar 인스턴스 생성
       ---------------------------------------------------------
       - Sidebar 클래스는 sidebar.js에 정의되어 있음
       - open(), close(), toggle() 등의 메서드를 제공
       ========================================================= */
    if (sidebarEl) {
      const sidebar = new Sidebar(sidebarEl);

      /* =========================================================
         🖱️ 열기 버튼 클릭 핸들러
         ---------------------------------------------------------
         - 클릭 시 해당 Sidebar 인스턴스의 open() 호출
         - e.preventDefault()로 기본 이벤트 방지
         ========================================================= */
      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.open();
      });
    }
  });
});
