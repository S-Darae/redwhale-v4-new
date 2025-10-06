import "../button/button.scss";
import "./pagination.scss";

/**
 * Pagination 생성 함수 (5개 버튼 + ... 양식 고정)
 *
 * ✅ 특징
 * - Prev / Next 버튼 포함
 * - 항상 첫/마지막 페이지 표시
 * - 현재 페이지 기준으로 최대 5개 버튼 + 필요 시 …(ellipsis) 표시
 * - 버튼 크기 small/normal 지원
 * - onChange 콜백 제공 (페이지 변경 시 외부에서 처리 가능)
 *
 * @param {number} current - 현재 페이지
 * @param {number} total   - 전체 페이지 수
 * @param {"normal"|"small"} size - 버튼 크기 (default: "small")
 * @param {Function} onChange - 페이지 변경 시 실행되는 콜백 (newPage: number)
 * @returns {HTMLElement} - <nav class="pagination"> element
 */
export function createPagination(current, total, size = "small", onChange) {
  const nav = document.createElement("nav");
  nav.className = `pagination pagination--${size}`;
  const sizeClass = size === "small" ? "btn--small" : "btn--medium";

  /**
   * 내부 렌더 함수
   * - 현재 page 기준으로 버튼을 다시 그림
   * - Prev / Next 버튼 상태, 페이지 버튼/ellipsis를 재계산
   */
  const render = (page) => {
    nav.innerHTML = ""; // 기존 UI 초기화

    /* -----------------------------
     * Prev 버튼
     * ----------------------------- */
    const prevBtn = document.createElement("button");
    prevBtn.className = `btn btn--ghost btn--neutral ${sizeClass} prev-btn`;
    prevBtn.disabled = page === 1;
    prevBtn.dataset.action = "prev";
    prevBtn.setAttribute("aria-label", "이전 페이지");
    prevBtn.innerHTML = `<i class="icon--caret-left icon"></i>`;
    nav.appendChild(prevBtn);

    /* -----------------------------
     * 페이지 번호 영역
     * ----------------------------- */
    const numbers = document.createElement("div");
    numbers.className = "pagination__numbers";

    // 페이지 버튼 생성
    const addButton = (p, isActive = false) => {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.dataset.page = p;
      if (isActive) {
        // 현재 페이지 → primary 강조
        btn.className = `btn btn--solid btn--neutral ${sizeClass} pagination-btn--is-active is-active`;
        btn.setAttribute("aria-current", "page");
      } else {
        // 나머지 페이지 → neutral
        btn.className = `btn pagination-btn btn--outlined btn--neutral ${sizeClass}`;
      }
      numbers.appendChild(btn);
    };

    // 생략(...) 표시
    const addEllipsis = () => {
      const span = document.createElement("span");
      span.className = "ellipsis";
      span.textContent = "…";
      numbers.appendChild(span);
    };

    /* -----------------------------
     * 페이지 로직 (5개 버튼 + … 유지)
     * -----------------------------
     * 1. total ≤ 5 → 전부 출력
     * 2. current ≤ 3 → 앞쪽 영역 (1~5 + … + 마지막)
     * 3. current ≥ total-2 → 뒤쪽 영역 (처음 + … + 마지막 5개)
     * 4. 그 외 → 가운데 영역 (처음 + … + 현재±2 + … + 마지막)
     */
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        addButton(i, page === i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          addButton(i, page === i);
        }
        addEllipsis();
        addButton(total, page === total);
      } else if (page >= total - 2) {
        addButton(1, page === 1);
        addEllipsis();
        for (let i = total - 4; i <= total; i++) {
          addButton(i, page === i);
        }
      } else {
        addButton(1, page === 1);
        addEllipsis();
        for (let i = page - 2; i <= page + 2; i++) {
          addButton(i, page === i);
        }
        addEllipsis();
        addButton(total, page === total);
      }
    }

    nav.appendChild(numbers);

    /* -----------------------------
     * Next 버튼
     * ----------------------------- */
    const nextBtn = document.createElement("button");
    nextBtn.className = `btn btn--ghost btn--neutral ${sizeClass} next-btn`;
    nextBtn.disabled = page === total;
    nextBtn.dataset.action = "next";
    nextBtn.setAttribute("aria-label", "다음 페이지");
    nextBtn.innerHTML = `<i class="icon--caret-right icon"></i>`;
    nav.appendChild(nextBtn);
  };

  // 초기 렌더링
  render(current);

  /* -----------------------------
   * 이벤트 바인딩
   * -----------------------------
   * - Prev / Next / 숫자 버튼 클릭 시 current 변경
   * - render() 다시 호출
   * - onChange 콜백 실행 (있을 경우)
   */
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.dataset.action === "prev" && current > 1) {
      current -= 1;
    } else if (target.dataset.action === "next" && current < total) {
      current += 1;
    } else if (target.dataset.page) {
      current = parseInt(target.dataset.page, 10);
    } else {
      return;
    }

    render(current);
    if (onChange) onChange(current);
  });

  return nav;
}
