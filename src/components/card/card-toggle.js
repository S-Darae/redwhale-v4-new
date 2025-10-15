/**
 * ==========================
 * 카드 선택 토글 (공통)
 * ==========================
 *
 * 지원 대상:
 *  - .class-card
 *  - .membership-card
 *  - .product-card
 *
 * 조건:
 *  - .checkbox-mode 클래스가 붙은 경우만 토글 작동
 *  - 클릭 시 is-selected 클래스 / data-checked 속성 / aria-checked 동기화
 */
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // 클릭한 요소에서 카드 탐색
    const card = e.target.closest(
      ".class-card, .membership-card, .product-card"
    );
    if (!card) return;

    // 체크모드가 아닌 카드라면 무시
    if (!card.classList.contains("checkbox-mode")) return;

    // 선택 상태 토글
    const isSelected = !card.classList.contains("is-selected");
    card.classList.toggle("is-selected", isSelected);
    card.dataset.checked = isSelected ? "true" : "false";

    // 접근성(ARIA) 반영
    const checkbox = card.querySelector(
      ".class-card__checkbox, .membership-card__checkbox, .product-card__checkbox"
    );
    if (checkbox) {
      checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
    }
  });
});
