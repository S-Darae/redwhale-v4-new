import "./menu.scss";

document.addEventListener("DOMContentLoaded", () => {
  fetch("/component-pages/common/menu.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#menu-container").innerHTML = data;

      // 메뉴버튼 활성화 상태를 위한 코드
      const currentPath = window.location.pathname;
      document.querySelectorAll(".menu-link").forEach((link) => {
        // 링크 클릭 시 페이지 이동
        link.addEventListener("click", (event) => {
          event.preventDefault(); // 기본 동작 막기
          const target = link.getAttribute("href");
          window.location.href = target; // 링크 이동
        });

        // 현재 경로와 일치하는 링크에 'active' 클래스 추가
        if (link.getAttribute("href") === currentPath) {
          link.querySelector("li").classList.add("active");

          // 하위 메뉴 활성화 상태일 때 상위 메뉴 열기
          const submenu = link.closest(".submenu-content");
          if (submenu) {
            submenu.classList.add("open");
            submenu.previousElementSibling.classList.add("open");
            submenu.previousElementSibling
              .querySelector(".icon--caret-down")
              .classList.add("open");
          }
        }
      });

      // 아코디언 메뉴 클릭 이벤트 추가
      document.querySelectorAll(".submenu-toggle").forEach((submenuToggle) => {
        submenuToggle.addEventListener("click", function () {
          this.classList.toggle("open");
          const caretIcon = this.querySelector(".icon--caret-down");
          caretIcon.classList.toggle("open");
          const submenuContent = this.nextElementSibling;
          if (submenuContent.classList.contains("open")) {
            submenuContent.classList.remove("open");
          } else {
            submenuContent.classList.add("open");
          }
        });
      });
    })
    .catch((error) => console.error("메뉴 불러오기 실패:", error));
});
