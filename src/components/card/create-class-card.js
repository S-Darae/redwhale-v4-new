/* ================================================================
📦 Component: ClassCard (수업 카드)
-------------------------------------------------------------------
- 역할: 단일 수업 카드를 HTML 문자열로 생성
- 포함 정보:
  폴더명, 수업명, 배지, 수업 시간, 인원, 트레이너
- 선택 모드일 경우(checkbox-mode) → 좌측에 체크박스 아이콘 표시
- 선택 상태(checked)에 따라 `is-selected` 및 ARIA 속성 동기화

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언
    <app-class-card
      [id]="class.id"
      [folderName]="class.folderName"
      [className]="class.className"
      [badge]="class.badge"
      [badgeVariant]="class.badgeVariant"
      [duration]="class.duration"
      [people]="class.people"
      [trainer]="class.trainer"
      [withCheckbox]="true"
      [checked]="selected"
      [popover]="true"
      (toggleSelect)="onCardToggle($event)">
    </app-class-card>

2️⃣ 주요 Input / Output
    @Input() id: string;
    @Input() folderName: string;
    @Input() className: string;
    @Input() badge: string;
    @Input() badgeVariant: string;
    @Input() duration: string;
    @Input() people: string;
    @Input() trainer: string;
    @Input() withCheckbox = false;
    @Input() checked = false;
    @Input() popover = true;
    @Output() toggleSelect = new EventEmitter<{ id: string; checked: boolean }>();

3️⃣ Angular 내부 로직 예시
    - [class.is-selected]="checked"
    - [attr.aria-checked]="checked"
    - (click)="toggleSelect.emit({ id, checked: !checked })"
================================================================ */

export function createClassCard({
  id,
  folderName,
  className,
  badge,
  badgeVariant,
  duration,
  people,
  trainer,
  withCheckbox = false,
  checked = false,
  popover = true,
}) {
  /* ======================================================
     ✅ 체크박스 영역 HTML
     ------------------------------------------------------
     - withCheckbox=true 일 때만 표시
     - role="checkbox" 및 aria-checked 속성 포함
     - tabindex=0 → 키보드 접근성 지원
     - data-type="card" → 카드 클릭 이벤트 식별용
  ====================================================== */
  const checkboxHTML = withCheckbox
    ? `
      <div class="class-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0"
           data-type="card">
        <i class="icon--check icon"></i>
      </div>`
    : "";

  /* ======================================================
     ✅ 카드 본문 HTML
     ------------------------------------------------------
     - class-card__header : 폴더명 / 수업명
     - class-card__detail : 배지 / 시간 / 인원 / 트레이너
     - 선택 모드일 경우 .checkbox-mode / .is-selected 클래스 적용
     - data 속성은 상태 보조용 (popover, checked)
  ====================================================== */
  return `
    <div class="class-card ${withCheckbox ? "checkbox-mode" : ""} ${
    checked ? "is-selected" : ""
  }"
         data-id="${id}"
         data-popover="${popover ? "true" : "false"}"
         data-checked="${checked ? "true" : "false"}">
      ${checkboxHTML}
      <div class="class-card__content">
        <ul class="class-card__header">
          <li class="class-card__header__folder-name">${folderName}</li>
          <li class="class-card__header__class-name">${className}</li>
        </ul>
        <ul class="class-card__detail">
          <li class="class-card__badge class-card__badge--${badgeVariant}">${badge}</li>
          <li class="class-card__duration">${duration}</li>
          <li class="class-card__people">${people}</li>
          <li class="class-card__trainer">${trainer}</li>
        </ul>
      </div>
    </div>
  `;
}
