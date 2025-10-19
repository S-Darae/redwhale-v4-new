/* ================================================================
📦 Component Behavior: Card Selection Toggle (공통)
-------------------------------------------------------------------
- 역할: 카드(.class-card / .membership-card / .product-card)의
        선택(체크) 상태를 토글하며 ARIA 접근성 속성까지 동기화

🎯 지원 대상
-------------------------------------------------------------------
  - .class-card
  - .membership-card
  - .product-card

⚙️ 동작 조건
-------------------------------------------------------------------
  - 카드에 `.checkbox-mode` 클래스가 있을 때만 선택 가능
  - 클릭 시 `is-selected` 클래스 및 `data-checked`, `aria-checked` 속성 변경
  - 선택 변경 시 `card-selection-changed` 커스텀 이벤트 전파

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ HTML 구조
    <div
      class="membership-card"
      [class.checkbox-mode]="isCheckboxMode"
      [class.is-selected]="isSelected"
      (click)="toggleSelection(card)"
      role="checkbox"
      [attr.aria-checked]="isSelected"
    >
      <!-- 내부 체크박스 UI는 별도 자식 컴포넌트로 구성 -->
      <div class="membership-card__checkbox"></div>
    </div>

2️⃣ 상태 관리
    - isSelected → @Input() 혹은 내부 state
    - 선택 변경 → @Output() selectionChange = new EventEmitter<{ card, isSelected }>();

3️⃣ 이벤트 흐름
    - 클릭 시 toggleSelection() 호출
    - 선택 상태 토글 및 aria 동기화
    - selectionChange.emit({ card, isSelected }) 호출
================================================================ */

document.body.addEventListener("click", (e) => {
  // 클릭된 요소에서 카드 요소 탐색
  const card = e.target.closest(".class-card, .membership-card, .product-card");
  if (!card) return; // 카드가 아닌 경우 무시

  // 회원권 상세 옵션 내부 체크박스 클릭 시 무시
  if (e.target.closest(".membership-card__detail-checkbox")) return;

  // 체크박스 모드가 아닐 경우 클릭 무시
  if (!card.classList.contains("checkbox-mode")) return;

  /* ======================================================
     선택 상태 토글 및 동기화
  ====================================================== */
  const isSelected = !card.classList.contains("is-selected");
  card.classList.toggle("is-selected", isSelected);

  // data-checked 속성으로 상태 반영 (문자열 형태)
  card.dataset.checked = isSelected ? "true" : "false";

  // 접근성(ARIA) 속성 동기화
  const checkbox = card.querySelector(
    ".class-card__checkbox, .membership-card__checkbox, .product-card__checkbox"
  );
  if (checkbox) {
    checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
  }

  /* ======================================================
     전역 이벤트 전파 (외부 리스너에서 상태 감지 가능)
     Angular → selectionChange.emit({ card, isSelected })
  ====================================================== */
  document.dispatchEvent(
    new CustomEvent("card-selection-changed", {
      detail: { card, isSelected },
    })
  );
});
