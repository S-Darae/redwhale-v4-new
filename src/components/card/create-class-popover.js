import "./popover-init.js";

/* ================================================================
📦 Component: ClassDetailPopover (수업 상세 팝오버)
-------------------------------------------------------------------
- 역할: 수업 카드를 클릭했을 때 표시되는 상세 팝오버를 HTML 문자열로 생성
- 구성: 상단 헤더(버튼 영역) + 본문(main / sub 정보)
- 메모, 공지, 예약 가능한 회원권(tickets) 등의 세부 정보 표시

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언 예시
    <app-class-detail-popover
      [folderName]="class.folderName"
      [className]="class.className"
      [badge]="class.badge"
      [badgeVariant]="class.badgeVariant"
      [duration]="class.duration"
      [people]="class.people"
      [trainer]="class.trainer"
      [policyReserve]="class.policyReserve"
      [policyCancel]="class.policyCancel"
      [memo]="class.memo"
      [notice]="class.notice"
      [tickets]="class.tickets"
      [color]="class.color"
      (closePopover)="onPopoverClose()"
      (editClass)="onEditClass(class)"
      (deleteClass)="onDeleteClass(class)"
      (cloneClass)="onCloneClass(class)"
    ></app-class-detail-popover>

2️⃣ Angular @Input() 목록
    @Input() folderName: string;
    @Input() className: string;
    @Input() badge: string;
    @Input() badgeVariant: string;
    @Input() duration: string;
    @Input() people: string;
    @Input() trainer: string | string[];
    @Input() policyReserve = '수업 시작 7일 전 0시부터 30분 전까지';
    @Input() policyCancel = '수업 시작 24시간 전까지';
    @Input() memo = '';
    @Input() notice = '';
    @Input() tickets: { folderName: string; items: string[] }[] = [];
    @Input() color = 'sandbeige';

3️⃣ Angular @Output() 이벤트 예시
    @Output() closePopover = new EventEmitter<void>();
    @Output() editClass = new EventEmitter<void>();
    @Output() deleteClass = new EventEmitter<void>();
    @Output() cloneClass = new EventEmitter<void>();

4️⃣ Angular 템플릿 변환 포인트
    - [ngClass]="{ 'empty-text': !memo }"
    - *ngIf / *ngFor 로 tickets / trainer 리스트 렌더링
================================================================ */

export function createClassDetailPopover({
  folderName,
  className,
  badge,
  badgeVariant,
  duration,
  people,
  trainer,
  policyReserve = "수업 시작 7일 전 0시부터 30분 전까지",
  policyCancel = "수업 시작 24시간 전까지",
  memo = "",
  notice = "",
  tickets = [],
  color = "sandbeige", // 기본 색상
}) {
  /* ======================================================
     ✅ 예약 가능한 회원권 목록 렌더링
     ------------------------------------------------------
     - tickets 배열을 순회하며 folderName + items 표시
     - Angular에서는 *ngFor="let group of tickets" 로 처리
     - 비어있을 경우 "-" + .empty-text 클래스 적용
  ====================================================== */
  const ticketGroupsHTML = tickets
    .map(
      (group) => `
      <div class="class-detail-popover__ticket-group">
        <div class="class-detail-popover__ticket-folder-name">
          ${group.folderName} <span>${group.items.length}</span>
        </div>
        <div class="class-detail-popover__ticket-list">
          ${group.items
            .map(
              (item) =>
                `<div class="class-detail-popover__ticket-item">${item}</div>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");

  /* ======================================================
     ✅ 최종 팝오버 HTML 반환
     ------------------------------------------------------
     구성:
     1️⃣ Header: 상단 컬러바 + 우측 버튼(복제/수정/삭제/닫기)
     2️⃣ Body-main: 기본 정보(폴더, 이름, 배지, 시간, 인원, 트레이너, 정책)
     3️⃣ Body-sub: 메모 / 공지 / 회원권 리스트
     - 값이 비어있을 경우 "-" 출력 및 empty-text 클래스 적용
     - Angular에서는 *ngIf="memo; else emptyMemo" 형태로 대체 가능
  ====================================================== */
  return `
    <aside class="class-detail-popover visible">
      <!-- =======================
           🟥 Header (상단 컬러바 + 액션 버튼)
           ======================= -->
      <div class="class-detail-popover__header">
        <div class="class-detail-popover__class-color ${color}"></div>
        <div class="class-detail-popover__btns">
          <button class="btn--icon-utility" data-tooltip="복제" aria-label="복제">
            <div class="icon--copy icon"></div>
          </button>
          <button class="btn--icon-utility" data-tooltip="정보 수정" aria-label="정보 수정">
            <div class="icon--edit icon"></div>
          </button>
          <button class="btn--icon-utility" data-tooltip="삭제" aria-label="삭제">
            <div class="icon--trash icon"></div>
          </button>
          <button class="btn--icon-utility x-btn" aria-label="닫기">
            <div class="icon--x icon"></div>
          </button>
        </div>
      </div>

      <!-- =======================
           📘 Body (메인 / 서브 정보)
           ======================= -->
      <div class="class-detail-popover__body">

        <!-- 1️⃣ 메인 정보 -->
        <div class="class-detail-popover__body-main">
          <ul class="class-detail-popover__body-main-name">
            <li class="class-detail-popover__folder-name">${folderName}</li>
            <li class="class-detail-popover__class-name">${className}</li>
          </ul>

          <ul class="class-detail-popover__body-main-detail">
            <li class="class-detail-popover__badge class-detail-popover__badge--${badgeVariant}">
              ${badge}
            </li>
            <li class="class-detail-popover__duration">${duration}</li>
            <li class="class-detail-popover__people">${people}</li>
            <li class="class-detail-popover__trainer">
              ${Array.isArray(trainer) ? trainer.join(", ") : trainer}
            </li>
          </ul>

          <!-- 예약 / 취소 정책 -->
          <div class="class-detail-popover__body-main-policy-wrap">
            <ul class="class-detail-popover__policy-list">
              <li class="class-detail-popover__policy-item">
                <span class="available">수업예약</span>${policyReserve}
              </li>
              <li class="class-detail-popover__policy-item">
                <span class="deadline">예약취소</span>${policyCancel}
              </li>
            </ul>
          </div>
        </div>

        <!-- 2️⃣ 서브 정보 (메모 / 공지 / 회원권) -->
        <div class="class-detail-popover__sub">

          <!-- 메모 -->
          <div class="class-detail-popover__sub-memo-wrap">
            <div class="class-detail-popover__sub-content-title">메모</div>
            <div class="class-detail-popover__memo-content ${
              memo ? "" : "empty-text"
            }">${memo || "-"}</div>
          </div>

          <!-- 공지 -->
          <div class="class-detail-popover__sub-notice-wrap">
            <div class="class-detail-popover__sub-content-title">수업 소개 / 회원 공지</div>
            <div class="class-detail-popover__notice-content ${
              notice ? "" : "empty-text"
            }">${notice || "-"}</div>
          </div>

          <!-- 예약 가능한 회원권 -->
          <div class="class-detail-popover__sub-ticket-wrap">
            <div class="class-detail-popover__sub-content-title">예약 가능한 회원권</div>
            ${
              tickets.length
                ? ticketGroupsHTML
                : `<div class="class-detail-popover__ticket-list empty-text">-</div>`
            }
          </div>

        </div>
      </div>
    </aside>
  `;
}
