/* ======================================================================
   📦 user-management-header.js — 회원 관리 헤더
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 상단 카테고리 드롭다운(유효, 예정, 홀딩 등) 동적 생성 및 제어
   - 선택된 항목 라벨/카운트 갱신
   - 회원 추가 버튼 → 메인 메뉴의 동일 버튼 트리거
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-user-management-header> 컴포넌트로 분리 가능
   - 드롭다운은 <app-dropdown> 컴포넌트 또는 Directive로 관리
   - 클릭 외부 감지는 HostListener('document:click')로 제어 가능
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - user-management.scss / dropdown.scss / sidebar.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 필요한 컴포넌트 및 초기화 모듈
   ====================================================================== */
import "../../components/dropdown/dropdown.scss";
import "../../components/sidebar/sidebar-init.js";
import "../../components/sidebar/sidebar.js";

/* ======================================================================
   🚀 초기 실행 (DOMContentLoaded)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------
     1️⃣ 드롭다운 데이터 정의
     --------------------------------------------------
     ✅ 역할:
     - 회원 상태별 항목(title, count, status, selected) 정의
     - selected: true → 초기 선택 항목
     --------------------------------------------------
     ✅ Angular 변환:
     - *ngFor로 반복 렌더링
     - 상태 색상(dot)은 [ngClass]로 상태별 클래스 바인딩
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     2️⃣ 엘리먼트 캐싱
     --------------------------------------------------
     ✅ 역할:
     - 드롭다운 컨테이너 및 토글 버튼 요소 캐싱
     - labelEl: 선택된 항목 표시 텍스트
     - countEl: 선택된 항목 표시 숫자
     --------------------------------------------------
     ✅ Angular 변환:
     - Template reference (#) 또는 ViewChild로 요소 참조
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     3️⃣ 드롭다운 메뉴 DOM 생성
     --------------------------------------------------
     ✅ 역할:
     - categoryItems 기반으로 <ul><li> 구조 생성
     - 상태별 dot, 카운트, selected 클래스 자동 추가
     --------------------------------------------------
     ✅ Angular 변환:
     - *ngFor로 항목 반복
     - (click)="onSelect(item)" 바인딩으로 선택 처리
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     4️⃣ 드롭다운 열기/닫기
     --------------------------------------------------
     ✅ 역할:
     - aria-expanded 속성으로 열림/닫힘 상태 제어
     - 다른 드롭다운 열려 있을 경우 자동 닫기
     - dropdown.js 기본 이벤트와 충돌 방지
     --------------------------------------------------
     ✅ Angular 변환:
     - isOpen 상태 변수를 [class.visible] / *ngIf로 바인딩
     - 클릭 외부 감지는 HostListener('document:click')로 처리
     -------------------------------------------------- */
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

        // 위치 보정 (토글 아래 6px)
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

  /* --------------------------------------------------
     5️⃣ 항목 클릭 시 선택 처리
     --------------------------------------------------
     ✅ 역할:
     - 클릭한 항목에 selected 클래스 추가
     - 라벨 및 카운트 UI 갱신
     - 메뉴 닫기 처리
     --------------------------------------------------
     ✅ Angular 변환:
     - onSelect(item): { selectedItem = item }
     - 템플릿에서 [class.selected]="item === selectedItem"
     -------------------------------------------------- */
  menu
    .querySelectorAll(".user-management-header__category-item")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        // 모든 항목 선택 해제
        menu
          .querySelectorAll(".user-management-header__category-item")
          .forEach((el) =>
            el.classList.remove(
              "user-management-header__category-item--selected"
            )
          );

        // 클릭한 항목만 선택
        btn.classList.add("user-management-header__category-item--selected");

        // 라벨/카운트 갱신
        const value = btn.dataset.value;
        const count = btn.querySelector(
          ".user-management-header__category-count"
        )?.textContent;

        if (labelEl) labelEl.textContent = value;
        if (countEl) countEl.textContent = count;

        // 닫기 처리
        toggle.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
      });
    });

  /* --------------------------------------------------
     6️⃣ 회원 추가 버튼 (메인 메뉴 연동)
     --------------------------------------------------
     ✅ 역할:
     - 상단 헤더의 “회원 추가” 버튼 클릭 시
       메인 메뉴 내부의 동일 기능 버튼을 트리거
     --------------------------------------------------
     ✅ Angular 변환:
     - EventEmitter로 상위 컴포넌트에 이벤트 전달
     - 혹은 서비스 기반으로 global trigger 공유
     -------------------------------------------------- */
  document
    .querySelector(".user-management-header__controls .user-add-modal-open-btn")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".main-menu .user-add-modal-open-btn")?.click();
    });
});
