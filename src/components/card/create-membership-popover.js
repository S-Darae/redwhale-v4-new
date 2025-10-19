import "../button/button.js";
import "../tooltip/tooltip.js";
import "./popover-init.js";

/* ================================================================
📦 Component: MembershipDetailPopover (회원권 상세 팝오버)
-------------------------------------------------------------------
- 역할: 회원권 카드를 클릭 시 표시되는 상세 정보 팝오버를 HTML로 생성
- 예약 상태(`reserv-used`, `reserv-unused`)에 따라 "예약 가능한 수업" 섹션 노출 여부가 달라짐
- 구성: 상단 헤더(컬러바 + 액션버튼) / 본문(main + sub 정보)

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언 예시
    <app-membership-detail-popover
      [folderName]="membership.folderName"
      [membershipName]="membership.membershipName"
      [badge]="membership.badge"
      [badgeVariant]="membership.badgeVariant"
      [info]="membership.info"
      [details]="membership.details"
      [memo]="membership.memo"
      [tickets]="membership.tickets"
      [color]="membership.color"
      (edit)="onEditMembership(membership)"
      (delete)="onDeleteMembership(membership)"
      (close)="onClosePopover()"
      (clone)="onCloneMembership(membership)">
    </app-membership-detail-popover>

2️⃣ Angular @Input() 목록
    @Input() folderName: string;
    @Input() membershipName: string;
    @Input() badge: string;
    @Input() badgeVariant: 'reserv-used' | 'reserv-unused';
    @Input() info: string[] | string = [];
    @Input() details: any[] = [];
    @Input() memo = '';
    @Input() tickets: { folderName: string; items: string[] }[] = [];
    @Input() color = 'sandbeige';

3️⃣ Angular @Output() 이벤트 예시
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();
    @Output() clone = new EventEmitter<void>();

4️⃣ Angular 템플릿 변환 포인트
    - *ngFor="let item of info"
    - [ngClass]="{ 'empty-text': !memo }"
    - *ngIf="badgeVariant !== 'reserv-unused'" 로 예약 섹션 제어
================================================================ */

export function createMembershipDetailPopover({
  folderName,
  membershipName,
  badge,
  badgeVariant,
  info = [],
  details = [],
  memo = "",
  tickets = [],
  color = "sandbeige",
}) {
  /* ======================================================
     ✅ Info 영역 렌더링
     ------------------------------------------------------
     - 배열 → 여러 li 생성
     - 문자열 → 단일 li 생성
     - 값이 없으면 출력 생략
     - Angular: *ngFor / *ngIf 로 변환 가능
  ====================================================== */
  const infoHTML = Array.isArray(info)
    ? info
        .map(
          (i) => `<li class="membership-detail-popover__info-item">${i}</li>`
        )
        .join("")
    : info
    ? `<li class="membership-detail-popover__info-item">${info}</li>`
    : "";

  /* ======================================================
     ✅ Details 영역 렌더링
     ------------------------------------------------------
     - 객체 또는 배열 형태 모두 지원
     - 값이 없으면 "-" 출력
     - Angular에서는 *ngFor="let detail of details" 구조로 반복 렌더링 가능
  ====================================================== */
  const detailsHTML =
    details && details.length
      ? details
          .map((row) => {
            if (!Array.isArray(row) && typeof row === "object") {
              return `
                <ul class="membership-detail-popover__detail">
                  <li>${row.period || ""}</li>
                  <li>
                    ${row.count || ""}
                    ${row.cancel ? `<span>(${row.cancel})</span>` : ""}
                  </li>
                  <li>${row.price || ""}</li>
                </ul>
              `;
            }
            if (Array.isArray(row)) {
              const [period, count, price] = row;
              if (typeof count === "object") {
                return `
                  <ul class="membership-detail-popover__detail">
                    <li>${period || ""}</li>
                    <li>
                      ${count.text || ""}
                      ${count.cancel ? `<span>(${count.cancel})</span>` : ""}
                    </li>
                    <li>${price || ""}</li>
                  </ul>
                `;
              }
              return `
                <ul class="membership-detail-popover__detail">
                  <li>${period || ""}</li>
                  <li>${count || ""}</li>
                  <li>${price || ""}</li>
                </ul>
              `;
            }
            return "";
          })
          .join("")
      : `<ul class="membership-detail-popover__detail"><li class="empty-text">-</li></ul>`;

  /* ======================================================
     ✅ 예약 가능한 수업 (tickets) 렌더링
     ------------------------------------------------------
     - badgeVariant이 'reserv-unused'면 표시하지 않음
     - tickets 배열이 있을 경우 그룹별 folderName + items 출력
     - Angular: *ngIf="badgeVariant !== 'reserv-unused'"
  ====================================================== */
  const ticketsHTML =
    badgeVariant === "reserv-unused"
      ? "" // 예약 미사용 → 섹션 비표시
      : tickets.length
      ? tickets
          .map(
            (group) => `
          <div class="membership-detail-popover__ticket-group">
            <div class="membership-detail-popover__ticket-folder-name">
              ${group.folderName} <span>${group.items.length}</span>
            </div>
            <div class="membership-detail-popover__ticket-list">
              ${group.items
                .map(
                  (t) =>
                    `<div class="membership-detail-popover__ticket-item">${t}</div>`
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")
      : `<div class="membership-detail-popover__ticket-list empty-text">-</div>`;

  /* ======================================================
     ✅ 최종 팝오버 HTML 반환
     ------------------------------------------------------
     - header: 컬러바 + 액션 버튼 (복제, 수정, 삭제, 닫기)
     - body-main: 폴더명 / 회원권명 / 뱃지 / info / details
     - body-sub: 메모 / 예약 가능한 수업
     - Angular에서는 (click)="..." Output 이벤트로 매핑 가능
  ====================================================== */
  return `
    <aside class="membership-detail-popover visible">
      <!-- ======================
           🟥 Header (컬러바 + 액션 버튼)
           ====================== -->
      <div class="membership-detail-popover__header">
        <div class="membership-detail-popover__membership-color ${color}"></div>
        <div class="membership-detail-popover__btns">
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

      <!-- ======================
           📘 Body (메인 + 서브 섹션)
           ====================== -->
      <div class="membership-detail-popover__body">

        <!-- 메인 정보 -->
        <div class="membership-detail-popover__body-main">
          <ul class="membership-detail-popover__body-main-name">
            <li class="membership-detail-popover__folder-name">${folderName}</li>
            <li class="membership-detail-popover__membership-name">${membershipName}</li>
          </ul>

          <!-- 뱃지 + 이용 제한 -->
          <ul class="membership-detail-popover__info">
            <li class="membership-detail-popover__badge membership-detail-popover__badge--${badgeVariant}">
              ${badge}
            </li>
            ${infoHTML || `<li class="empty-text"></li>`}
          </ul>

          <!-- 상세 옵션 -->
          <div class="membership-detail-popover__details">
            ${detailsHTML}
          </div>
        </div>

        <!-- 서브 정보 (메모 + 예약 가능한 수업) -->
        <div class="membership-detail-popover__sub">

          <!-- 메모 -->
          <div class="membership-detail-popover__sub-memo-wrap">
            <div class="membership-detail-popover__sub-content-title">메모</div>
            <div class="membership-detail-popover__memo-content ${
              memo ? "" : "empty-text"
            }">${memo || "-"}</div>
          </div>

          <!-- 예약 가능한 수업 -->
          ${
            badgeVariant === "reserv-unused"
              ? "" // 예약 미사용 상태 → 해당 섹션 숨김
              : `
            <div class="membership-detail-popover__sub-tickets-wrap">
              <div class="membership-detail-popover__sub-content-title">예약 가능한 수업</div>
              ${ticketsHTML}
            </div>
          `
          }
        </div>
      </div>
    </aside>
  `;
}
