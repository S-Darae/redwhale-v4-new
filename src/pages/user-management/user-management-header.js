import "../../components/dropdown/dropdown.scss";
import "../../components/sidebar/sidebar-init.js";
import "../../components/sidebar/sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================
     드롭다운 데이터
     ========================== */
  const categoryItems = [
    { title: "전체", count: 390, selected: true },
    { title: "유효", status: "active", count: 200 },
    { title: "예정", status: "expected", count: 50 },
    { title: "홀딩", status: "holding", count: 20 },
    { title: "미수금", status: "arrears", count: 5 },
    { title: "미등록", status: "unregistered", count: 15 },
    { title: "만료임박", status: "expiring", count: 60 },
    { title: "만료", status: "expired", count: 30 },
  ];

  /* ==========================
     엘리먼트 캐싱
     ========================== */
  const container = document.querySelector(
    ".user-management-header__category-dropdown"
  );
  if (!container) return;

  const toggle = container.querySelector(".dropdown__toggle"); // 드롭다운 토글 버튼
  const labelEl = toggle.querySelector(
    ".user-management-header__category-label"
  ); // 선택된 항목 표시 라벨
  const countEl = toggle.querySelector(
    ".user-management-header__category-count"
  ); // 선택된 항목 표시 카운트

  /* ==========================
     메뉴 DOM 동적 생성
     ========================== */
  const menu = document.createElement("div");
  menu.className = "dropdown__menu user-management-header__category-menu";
  menu.setAttribute("role", "menu");
  menu.style.display = "none";

  const ul = document.createElement("ul");
  ul.className = "user-management-header__category-items";

  // 항목별 li 생성
  categoryItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "user-management-header__category-item";
    li.dataset.value = item.title;

    if (item.selected)
      li.classList.add("user-management-header__category-item--selected");

    // 제목 (상태 dot + 텍스트)
    const title = document.createElement("span");
    title.className = "user-management-header__category-title";

    if (item.status) {
      const dot = document.createElement("span");
      dot.className = `category-item-status category-item-status--${item.status}`;
      title.appendChild(dot);
    }

    title.append(item.title);

    // 카운트
    const count = document.createElement("span");
    count.className = "user-management-header__category-count";
    count.textContent = item.count;

    li.append(title, count);
    ul.appendChild(li);
  });

  menu.append(ul);
  container.append(menu);

  /* ==========================
     드롭다운 열기/닫기
     ==========================
     - aria-expanded 속성으로 상태 제어
     - 다른 드롭다운이 열려있을 경우 자동 닫기
     - dropdown.js의 기본 이벤트와 충돌 방지 (stopPropagation + preventDefault)
     ========================== */
  toggle.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      // 다른 드롭다운 닫기
      document
        .querySelectorAll(".user-management-header__category-menu")
        .forEach((m) => {
          if (m !== menu) m.style.display = "none";
        });

      if (!isOpen) {
        toggle.setAttribute("aria-expanded", "true");
        menu.style.display = "block";
        menu.classList.add("visible");

        const rect = toggle.getBoundingClientRect();
        menu.style.top = `${rect.height + 6}px`;
        menu.style.left = "0px";
      } else {
        toggle.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
        menu.classList.remove("visible");
      }
    },
    true
  );

  /* ==========================
     항목 클릭 시 선택 처리
     ==========================
     - 선택된 li에 selected 클래스 추가
     - 라벨/카운트 텍스트 갱신
     - 클릭 후 자동 닫힘
     ========================== */
  menu
    .querySelectorAll(".user-management-header__category-item")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 모든 항목의 선택 상태 해제
        menu
          .querySelectorAll(".user-management-header__category-item")
          .forEach((el) =>
            el.classList.remove(
              "user-management-header__category-item--selected"
            )
          );

        // 클릭한 항목만 선택
        btn.classList.add("user-management-header__category-item--selected");

        // 라벨 및 카운트 갱신
        const value = btn.dataset.value;
        const count = btn.querySelector(
          ".user-management-header__category-count"
        )?.textContent;

        if (labelEl) labelEl.textContent = value;
        if (countEl) countEl.textContent = count;

        // 닫기
        toggle.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
      });
    });

  /* ==========================
     회원 추가 버튼 (메인 메뉴 연동)
     ==========================
     - 상단 헤더의 "회원 추가" 버튼 클릭 시
       메인 메뉴 내부 동일 기능 버튼을 트리거
     ========================== */
  document
    .querySelector(".user-management-header__controls .user-add-modal-open-btn")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".main-menu .user-add-modal-open-btn")?.click();
    });
});
