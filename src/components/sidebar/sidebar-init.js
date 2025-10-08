import Sidebar from "./sidebar.js";
/**
 * Sidebar 초기화
 *
 * 규칙:
 * - 열기 버튼은 [data-open-target="sidebarId"] 속성 필요
 * - 해당 속성의 값과 일치하는 id 가진 <aside.sidebar>를 찾아 열기
 */
document.addEventListener("DOMContentLoaded", () => {
  // 모든 열기 버튼 탐색
  document.querySelectorAll("[data-open-target]").forEach((openBtn) => {
    const targetId = openBtn.getAttribute("data-open-target");
    const sidebarEl = document.getElementById(targetId);

    if (sidebarEl) {
      const sidebar = new Sidebar(sidebarEl);

      // 열기 버튼 클릭 시 사이드바 오픈
      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.open();
      });
    }
  });
});
