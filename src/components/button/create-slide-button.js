import "../button/button.scss";
import "./slide-button.scss";

/**
 * 슬라이드 버튼 컴포넌트 생성 함수
 * --------------------------------------
 * 캐러셀, 슬라이더 등에서 "이전 / 다음" 이동과
 * 현재 위치 표시(`현재 / 전체`)를 제공하는 버튼 세트
 *
 * 사용 예시:
 *   container.appendChild(
 *     createSlideButtons(1, 10, (page) => console.log("현재 슬라이드:", page))
 *   );
 *
 * @param {number} current - 현재 슬라이드 번호 (1부터 시작)
 * @param {number} total   - 전체 슬라이드 개수
 * @param {Function} onChange - 페이지 변경 시 실행되는 콜백
 *   - 인자로 새 슬라이드 번호(newPage: number)가 전달됨
 * @returns {HTMLElement} - <nav class="slide-buttons"> 요소 반환
 */
export function createSlideButtons(current, total, onChange) {
  const nav = document.createElement("nav");
  nav.className = "slide-buttons";

  /**
   * 내부 함수: 슬라이드 버튼 렌더링
   * - 현재 상태(current)에 따라 버튼 상태/텍스트를 갱신
   * @param {number} page - 표시할 현재 슬라이드 번호
   */
  const render = (page) => {
    nav.innerHTML = ""; // 이전 상태 초기화

    // --------------------------
    // Prev 버튼
    // --------------------------
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn--ghost btn--neutral btn--small pre-btn";
    prevBtn.disabled = page === 1; // 첫 슬라이드에서는 비활성화
    prevBtn.dataset.action = "prev";
    prevBtn.setAttribute("aria-label", "이전 슬라이드");
    prevBtn.innerHTML = `<i class="icon--caret-left icon"></i>`;
    nav.appendChild(prevBtn);

    // --------------------------
    // 숫자 표시 (현재 / 전체)
    // --------------------------
    const numbers = document.createElement("span");
    numbers.className = "slide-buttons__numbers";
    numbers.innerHTML = `<strong>${page}</strong> / ${total}`;
    nav.appendChild(numbers);

    // --------------------------
    // Next 버튼
    // --------------------------
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn--ghost btn--neutral btn--small next-btn";
    nextBtn.disabled = page === total; // 마지막 슬라이드에서는 비활성화
    nextBtn.dataset.action = "next";
    nextBtn.setAttribute("aria-label", "다음 슬라이드");
    nextBtn.innerHTML = `<i class="icon--caret-right icon"></i>`;
    nav.appendChild(nextBtn);
  };

  // 최초 렌더링
  render(current);

  /**
   * 이벤트 바인딩
   * - Prev/Next 버튼 클릭 시 current 업데이트 및 재렌더링
   * - 변경된 페이지 번호를 onChange 콜백으로 전달
   */
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.dataset.action === "prev" && current > 1) {
      current -= 1;
    } else if (target.dataset.action === "next" && current < total) {
      current += 1;
    } else {
      return;
    }

    render(current);
    if (onChange) onChange(current);
  });

  return nav;
}
