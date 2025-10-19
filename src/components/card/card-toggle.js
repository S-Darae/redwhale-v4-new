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
document.body.addEventListener("click", (e) => {
  // 클릭한 곳에서 카드 탐색
  const card = e.target.closest(".class-card, .membership-card, .product-card");
  if (!card) return; // 옵션 체크박스 (회원권 세부 옵션)는 제외 (이것은 유지)

  if (e.target.closest(".membership-card__detail-checkbox")) return; // 체크모드가 아닐 경우 무시

  if (!card.classList.contains("checkbox-mode")) return;

  const isSelected = !card.classList.contains("is-selected");
  card.classList.toggle("is-selected", isSelected);
  card.dataset.checked = isSelected ? "true" : "false"; // 접근성(ARIA) 반영

  const checkbox = card.querySelector(
    ".class-card__checkbox, .membership-card__checkbox, .product-card__checkbox"
  );
  if (checkbox) {
    checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
  } // 선택 상태 변경 시 전역 이벤트 발행

  document.dispatchEvent(
    new CustomEvent("card-selection-changed", {
      detail: { card, isSelected },
    })
  );
});
