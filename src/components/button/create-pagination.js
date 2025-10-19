import "../button/button.scss";
import "./pagination.scss";

/* ================================================================
📦 Component: Pagination (페이지네이션)
-------------------------------------------------------------------
- 역할: Prev / Next 버튼 포함한 페이지 이동 UI 생성
- 버튼 구조: 항상 첫/마지막 페이지 포함, 현재 기준 ±2 → 최대 5개 표시
- ... (ellipsis) 자동 삽입
- 크기 small / normal 지원
- 페이지 변경 시 onChange(newPage) 콜백 실행

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 템플릿 변환
    <button (click)="goPrev()" [disabled]="current === 1"></button>
    <ng-container *ngFor="let p of visiblePages">
      <button [class.is-active]="p === current" (click)="goPage(p)">{{ p }}</button>
    </ng-container>
    <button (click)="goNext()" [disabled]="current === total"></button>

2️⃣ 상태 관리
    - current → @Input() currentPage
    - total   → @Input() totalPages
    - (onChange) → @Output() pageChange = new EventEmitter<number>()

3️⃣ 렌더 로직
    - render() 함수 로직을 get visiblePages() { ... } 로 계산 가능
================================================================ */
export function createPagination(current, total, size = "small", onChange) {
  // 루트 nav 요소 생성
  const nav = document.createElement("nav");
  nav.className = `pagination pagination--${size}`;

  // 버튼 크기 결정 (SCSS class 매핑)
  const sizeClass = size === "small" ? "btn--small" : "btn--medium";

  /**
   * 🔹 내부 렌더 함수
   * ---------------------------------------------------------------
   * - current(현재 페이지) 기준으로 버튼들을 다시 그림
   * - Prev / Next 버튼의 disabled 상태 갱신
   * - 페이지 번호와 ellipsis(...) 구성 재계산
   */
  const render = (page) => {
    nav.innerHTML = ""; // 기존 버튼 초기화

    /* ===========================
       Prev 버튼 생성
    =========================== */
    const prevBtn = document.createElement("button");
    prevBtn.className = `btn btn--ghost btn--neutral ${sizeClass} prev-btn`;
    prevBtn.disabled = page === 1;
    prevBtn.dataset.action = "prev";
    prevBtn.setAttribute("aria-label", "이전 페이지");
    prevBtn.innerHTML = `<i class="icon--caret-left icon"></i>`;
    nav.appendChild(prevBtn);

    /* ===========================
       페이지 번호 버튼 그룹
    =========================== */
    const numbers = document.createElement("div");
    numbers.className = "pagination__numbers";

    // 개별 페이지 버튼 생성기
    const addButton = (p, isActive = false) => {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.dataset.page = p;
      btn.className = isActive
        ? `btn btn--solid btn--neutral ${sizeClass} pagination-btn--is-active is-active`
        : `btn pagination-btn btn--outlined btn--neutral ${sizeClass}`;
      if (isActive) btn.setAttribute("aria-current", "page");
      numbers.appendChild(btn);
    };

    // 생략(...) 표시기
    const addEllipsis = () => {
      const span = document.createElement("span");
      span.className = "ellipsis";
      span.textContent = "…";
      numbers.appendChild(span);
    };

    /* ===========================
       페이지 표시 로직
       (Angular: getter로 계산 가능)
    =========================== */
    if (total <= 5) {
      for (let i = 1; i <= total; i++) addButton(i, page === i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) addButton(i, page === i);
        addEllipsis();
        addButton(total, page === total);
      } else if (page >= total - 2) {
        addButton(1, page === 1);
        addEllipsis();
        for (let i = total - 4; i <= total; i++) addButton(i, page === i);
      } else {
        addButton(1, page === 1);
        addEllipsis();
        for (let i = page - 2; i <= page + 2; i++) addButton(i, page === i);
        addEllipsis();
        addButton(total, page === total);
      }
    }

    nav.appendChild(numbers);

    /* ===========================
       Next 버튼 생성
    =========================== */
    const nextBtn = document.createElement("button");
    nextBtn.className = `btn btn--ghost btn--neutral ${sizeClass} next-btn`;
    nextBtn.disabled = page === total;
    nextBtn.dataset.action = "next";
    nextBtn.setAttribute("aria-label", "다음 페이지");
    nextBtn.innerHTML = `<i class="icon--caret-right icon"></i>`;
    nav.appendChild(nextBtn);
  };

  // 초기 렌더링 실행
  render(current);

  /**
   * 🧩 이벤트 바인딩
   * ---------------------------------------------------------------
   * - Prev / Next / 페이지 번호 클릭 시 current 업데이트
   * - render() 재실행
   * - onChange(newPage) 콜백 호출
   *
   * ⚙️ Angular 변환 시
   *   → 각 버튼의 (click)="onPageChange(p)" 이벤트로 대체 가능
   */
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.dataset.action === "prev" && current > 1) current -= 1;
    else if (target.dataset.action === "next" && current < total) current += 1;
    else if (target.dataset.page) current = parseInt(target.dataset.page, 10);
    else return;

    render(current);
    if (onChange) onChange(current);
  });

  return nav;
}
