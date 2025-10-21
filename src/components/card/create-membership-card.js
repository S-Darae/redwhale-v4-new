/* ================================================================
📦 Component: MembershipCard (회원권 카드)
-------------------------------------------------------------------
- 역할: 회원권 정보를 표시하는 단일 카드 컴포넌트 HTML 생성
- 지원 모드:
  1️⃣ 기본형
  2️⃣ 카드 전체 선택형 (withCheckbox)
  3️⃣ 옵션별 개별 선택형 (withOptionCheckbox)
- 각 옵션(row)별 체크박스 / 팝오버 트리거 포함

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언 예시
    <app-membership-card
      [id]="membership.id"
      [folderName]="membership.folderName"
      [membershipName]="membership.membershipName"
      [badge]="membership.badge"
      [badgeVariant]="membership.badgeVariant"
      [details]="membership.details"
      [withCheckbox]="true"
      [withOptionCheckbox]="false"
      [checked]="false"
      [popover]="true"
      (openPopover)="onOpenPopover($event)"
      (optionSelectChange)="onOptionSelectChange($event)">
    </app-membership-card>

2️⃣ Angular @Input() 목록
    @Input() id: string;
    @Input() folderName: string;
    @Input() membershipName: string;
    @Input() badge: string;
    @Input() badgeVariant: string;
    @Input() details: any[] = [];
    @Input() withCheckbox = false;
    @Input() withOptionCheckbox = false;
    @Input() checked = false;
    @Input() popover = true;

3️⃣ Angular @Output() 이벤트 예시
    @Output() openPopover = new EventEmitter<string>();
    @Output() optionSelectChange = new EventEmitter<{ id: string; index: number; checked: boolean }>();

4️⃣ Angular 템플릿 변환 포인트
    - [class.is-selected]="checked"
    - [class.checkbox-mode]="withCheckbox"
    - [class.option-checkbox-mode]="withOptionCheckbox"
    - *ngFor="let detail of details; let i = index"
    - (click)="toggleOption(i)"
================================================================ */

export function createMembershipCard({
  id,
  folderName,
  membershipName,
  badge,
  badgeVariant,
  details = [],
  withCheckbox = false,
  withOptionCheckbox = false,
  checked = false,
  popover = true,
}) {
  /* ======================================================
     ✅ 카드 전체 선택 체크박스 HTML
     ------------------------------------------------------
     - withCheckbox=true 일 때 좌측 아이콘 표시
     - role="checkbox" 및 aria-checked 속성 포함
     - Angular: [attr.aria-checked]="checked"
  ====================================================== */
  const cardCheckboxHTML = withCheckbox
    ? `
      <div class="membership-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0"
           data-type="card">
        <i class="icon--check icon"></i>
      </div>
    `
    : "";

  /* ======================================================
     ✅ 상세 옵션 영역 HTML
     ------------------------------------------------------
     - details 배열 기반으로 각 row 렌더링
     - withOptionCheckbox=true → 각 row에 개별 체크박스 추가
     - Angular에서는 *ngFor 로 반복 렌더링 가능
  ====================================================== */
  const detailsHTML =
    details && details.length
      ? details
          .map((row, i) => {
            const isObject = !Array.isArray(row) && typeof row === "object";
            const period = isObject ? row.period || "" : row[0] || "";
            const countData = isObject ? row.count : row[1];
            const cancelText = isObject
              ? row.cancel
              : typeof countData === "object"
              ? countData.cancel
              : "";
            const price = isObject ? row.price || "" : row[2] || "";
            const count =
              typeof countData === "object"
                ? countData.text || ""
                : countData || "";
            const cancel = cancelText ? `<span>(${cancelText})</span>` : "";

            // 옵션별 체크박스 HTML (Angular: [attr.aria-checked], (click)="toggleOption(i)")
            const optionCheckbox = withOptionCheckbox
              ? `
                <div class="membership-card__detail-checkbox"
                     role="checkbox"
                     aria-checked="false"
                     tabindex="0"
                     data-index="${i}">
                  <i class="icon--check icon"></i>
                </div>
              `
              : "";

            return `
              <div class="membership-card-detail-row" data-row-index="${i}">
                ${optionCheckbox}
                <ul class="membership-card-detail">
                  <li>${period}</li>
                  <li>${count}${cancel}</li>
                  <li>${price}</li>
                </ul>
              </div>
            `;
          })
          .join("")
      : `<ul class="membership-card-detail"><li>-</li></ul>`;

  /* ======================================================
     ✅ 최종 카드 HTML 반환
     ------------------------------------------------------
     - header: 폴더명 / 회원권명 (data-popover-trigger)
     - body: 배지 / 상세 내역 / 체크 상태 반영
     - Angular에서는 *ngIf / [class] / (click) 로 변환 가능
  ====================================================== */
  return `
    <div class="membership-card
                ${withCheckbox ? "checkbox-mode" : ""}
                ${withOptionCheckbox ? "option-checkbox-mode" : ""}
                ${checked ? "is-selected" : ""}"
         data-id="${id}"
         data-popover="${popover ? "true" : "false"}"
         data-checked="${checked ? "true" : "false"}">

      ${cardCheckboxHTML}

      <div class="membership-card-content">
        <!-- 카드 헤더 (폴더명 + 회원권명 / 팝오버 트리거) -->
        <div class="membership-card-header" data-popover-trigger="true">
          <div class="membership-card-folder-name">${folderName}</div>
          <div class="membership-card-membership-name">${membershipName}</div>
        </div>

        <!-- 카드 본문 -->
        <div class="membership-card-body">
          <span class="badge membership-card-badge badge--${badgeVariant}">
            ${badge}
          </span>
          <div class="membership-card-details">${detailsHTML}</div>
        </div>
      </div>
    </div>
  `;
}

/* ================================================================
🎯 Component Behavior: MembershipCard Events
-------------------------------------------------------------------
- 역할: 회원권 카드와 관련된 모든 인터랙션(체크 / 팝오버 등)을 통합 관리
- 적용 범위: DOM 전체 (document 수준)
- Angular에서는 각각의 하위 동작을 (click) 이벤트 및 @Output()으로 분리 가능

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
- 옵션 체크박스 → (click)="toggleOption(i)"
- 카드 헤더 → (click)="openPopover.emit(id)"
- 전체 선택 → (click)="toggleCardSelect()"
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     ✅ 옵션 체크박스 클릭 이벤트
     ------------------------------------------------------
     - 개별 row 클릭 시 선택 상태 토글
     - 카드 외곽선 강조 (.is-option-selected)
     - Angular에서는 toggleOption(index) 메서드로 대체
  ====================================================== */
  document.addEventListener("click", (e) => {
    const optionRow = e.target.closest(".membership-card-detail-row");
    const optionCheckbox = e.target.closest(
      ".membership-card__detail-checkbox"
    );
    if (!optionRow && !optionCheckbox) return;

    // 카드 전체 체크박스 클릭은 제외
    if (e.target.closest(".membership-card__checkbox")) return;

    e.stopPropagation(); // 팝오버 트리거 방지

    const row =
      optionRow || optionCheckbox.closest(".membership-card-detail-row");
    const checkbox = row.querySelector(".membership-card__detail-checkbox");
    if (!checkbox) return;

    const card = row.closest(".membership-card");
    const isChecked =
      checkbox.getAttribute("aria-checked") === "true" ? "false" : "true";

    // 상태 토글 및 스타일 반영
    checkbox.setAttribute("aria-checked", isChecked);
    row.classList.toggle("is-checked", isChecked === "true");

    // 카드 외곽선 강조 (하나라도 체크되면)
    const anyChecked = card.querySelectorAll(
      ".membership-card-detail-row.is-checked"
    ).length;
    card.classList.toggle("is-option-selected", anyChecked > 0);
  });

  /* ======================================================
     ✅ 헤더 클릭 시 팝오버 열기
     ------------------------------------------------------
     - data-popover="true" 일 때만 작동
     - Angular에서는 (click)="openPopover.emit(id)" 로 대체
  ====================================================== */
  document.addEventListener("click", (e) => {
    const header = e.target.closest(".membership-card-header");
    if (!header) return;

    // 옵션 행 내부 클릭은 팝오버 무시
    if (e.target.closest(".membership-card-detail-row")) return;

    const card = header.closest(".membership-card");
    if (card.dataset.popover === "true") {
      const event = new CustomEvent("membership-card:open-popover", {
        detail: { id: card.dataset.id },
        bubbles: true, // document까지 버블링 → initPopover에서 감지
      });
      card.dispatchEvent(event);
    }
  });
});
