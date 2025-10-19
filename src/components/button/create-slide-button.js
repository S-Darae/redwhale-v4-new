import "../button/button.scss";
import "./slide-button.scss";

/* ================================================================
📦 Component: SlideButtons (슬라이드 전환 버튼)
-------------------------------------------------------------------
- 역할: 캐러셀/슬라이더 등에서 이전/다음 버튼 및 현재 위치 표시
- 형식: 〈 Prev | n / total | Next 〉
- 크기: 고정 small
- onChange(newPage) 콜백 제공

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 템플릿 변환
    <button (click)="prev()" [disabled]="current === 1"></button>
    <span><strong>{{ current }}</strong> / {{ total }}</span>
    <button (click)="next()" [disabled]="current === total"></button>

2️⃣ 상태 관리
    - current → @Input() currentSlide
    - total   → @Input() totalSlides
    - (onChange) → @Output() slideChange = new EventEmitter<number>()

3️⃣ DOM 렌더링 로직
    - render() 함수 대신 Angular에서는 템플릿 바인딩으로 자동 반영
================================================================ */
export function createSlideButtons(current, total, onChange) {
  // 루트 nav 요소
  const nav = document.createElement("nav");
  nav.className = "slide-buttons";

  /**
   * 🔹 내부 렌더 함수
   * ---------------------------------------------------------------
   * - Prev/Next 버튼과 (현재 / 전체) 숫자 표시 업데이트
   */
  const render = (page) => {
    nav.innerHTML = ""; // 기존 상태 초기화

    /* ===========================
       Prev 버튼
    =========================== */
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn--ghost btn--neutral btn--small pre-btn";
    prevBtn.disabled = page === 1; // 첫 슬라이드에서는 비활성화
    prevBtn.dataset.action = "prev";
    prevBtn.setAttribute("aria-label", "이전 슬라이드");
    prevBtn.innerHTML = `<i class="icon--caret-left icon"></i>`;
    nav.appendChild(prevBtn);

    /* ===========================
       현재 / 전체 표시
    =========================== */
    const numbers = document.createElement("span");
    numbers.className = "slide-buttons__numbers";
    numbers.innerHTML = `<strong>${page}</strong> / ${total}`;
    nav.appendChild(numbers);

    /* ===========================
       Next 버튼
    =========================== */
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn--ghost btn--neutral btn--small next-btn";
    nextBtn.disabled = page === total; // 마지막 슬라이드에서는 비활성화
    nextBtn.dataset.action = "next";
    nextBtn.setAttribute("aria-label", "다음 슬라이드");
    nextBtn.innerHTML = `<i class="icon--caret-right icon"></i>`;
    nav.appendChild(nextBtn);
  };

  // 초기 렌더링
  render(current);

  /**
   * 🧩 이벤트 바인딩
   * ---------------------------------------------------------------
   * - Prev / Next 클릭 시 current 업데이트 및 재렌더링
   * - 변경된 페이지를 onChange 콜백에 전달
   *
   * ⚙️ Angular 변환 시
   *   → (click)="prev()" / (click)="next()" 로 대체
   */
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.dataset.action === "prev" && current > 1) current -= 1;
    else if (target.dataset.action === "next" && current < total) current += 1;
    else return;

    render(current);
    if (onChange) onChange(current);
  });

  return nav;
}
