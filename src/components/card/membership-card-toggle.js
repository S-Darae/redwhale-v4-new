/**
 * ==========================
 * MembershipCard 선택 토글 이벤트 (이벤트 위임)
 * ==========================
 *
 * - 문서 전체에 클릭 이벤트를 위임하여,
 *   .membership-card.checkbox-mode 요소가 클릭될 때만 동작합니다.
 * - 클릭 시 is-selected 클래스와 data-checked 속성을 토글합니다.
 * - 접근성(ARIA) 동기화를 위해 .membership-card__checkbox 의 aria-checked 값도 갱신합니다.
 *
 * 장점:
 * - 이벤트 위임 방식이므로 동적으로 추가된 카드도 자동 반응합니다.
 * - 특정 래퍼(.membership-card-wrap)가 없어도 동작 (document.body 기준).
 */
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // 클릭한 요소에서 가장 가까운 membership-card 탐색
    const card = e.target.closest(".membership-card");
    if (!card) return;

    // 체크모드가 아닌 카드라면 무시
    if (!card.classList.contains("checkbox-mode")) return;

    // 선택 상태 토글
    const isSelected = !card.classList.contains("is-selected");
    card.classList.toggle("is-selected", isSelected);
    card.dataset.checked = isSelected ? "true" : "false";

    // 접근성(ARIA) 반영
    const checkbox = card.querySelector(".membership-card__checkbox");
    if (checkbox) {
      checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
    }
  });
});
