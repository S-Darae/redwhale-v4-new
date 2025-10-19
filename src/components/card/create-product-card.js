import "./product-card.scss";

/* ================================================================
📦 Component: ProductCard (상품 카드)
-------------------------------------------------------------------
- 역할: 회원권 / 락커 / 운동복 등 상품 정보를 카드 형태로 표시
- badge(배지), 남은 일수, 상태 버튼, 체크박스 등 UI 상태를 자동 계산
- 카드 본문 + 팝오버용 HTML 템플릿을 함께 반환

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언 예시
    <app-product-card
      [id]="product.id"
      [type]="product.type"
      [name]="product.name"
      [startDate]="product.startDate"
      [endDate]="product.endDate"
      [transfer]="product.transfer"
      [holding]="product.holding"
      [isRefunded]="product.isRefunded"
      [info]="product.info"
      [memo]="product.memo"
      [button]="product.button"
      [withCheckbox]="true"
      [checked]="false"
      [popover]="true"
      (openPopover)="onOpenPopover($event)"
      (toggleChecked)="onToggleChecked($event)">
    </app-product-card>

2️⃣ Angular @Input() 목록
    @Input() id: string;
    @Input() type: 'membership' | 'locker' | 'wear';
    @Input() name: string;
    @Input() startDate: string;
    @Input() endDate: string;
    @Input() transfer: any[] = [];
    @Input() holding: any[] = [];
    @Input() isRefunded = false;
    @Input() info: { remain?: string|number; total?: string|number; duration?: string; type?: string; number?: string };
    @Input() memo = '';
    @Input() button?: string;
    @Input() withCheckbox = false;
    @Input() checked = false;
    @Input() popover = true;

3️⃣ Angular @Output() 이벤트 예시
    @Output() openPopover = new EventEmitter<string>();
    @Output() toggleChecked = new EventEmitter<{ id: string; checked: boolean }>();

4️⃣ Angular 내부 구성 포인트
    - `badgeList` 계산 → getter 사용
    - `extraInfo` 계산 → computed property
    - `[class.is-selected]="checked"`
    - (click)="toggleChecked.emit({ id, checked: !checked })"
    - popover는 별도 `<app-product-popover>` 컴포넌트로 분리 가능
================================================================ */

/* ======================================================
   📅 날짜 관련 유틸 함수
   ------------------------------------------------------
   - parseDate: "YYYY.MM.DD" → Date
   - formatDate: Date → "YYYY.MM.DD"
   - diffDays: 일 단위 차이 계산
====================================================== */
function parseDate(d) {
  if (!d) return null;
  return new Date(d.replace(/\./g, "-"));
}

function formatDate(date) {
  return date ? date.toISOString().slice(0, 10).replace(/-/g, ".") : "-";
}

function diffDays(a, b) {
  return Math.ceil((a - b) / (1000 * 60 * 60 * 24));
}

/* ======================================================
   📦 createProductCard — 메인 함수
====================================================== */
export function createProductCard(p) {
  const {
    id,
    type,
    name,
    startDate,
    endDate,
    transfer = [],
    holding = [],
    isRefunded = false,
    info = {},
    memo,
    withCheckbox = false,
    checked = false,
    popover = true,
  } = p;

  const today = new Date();
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  /* ======================================================
     🏷 상태 배지 계산
     ------------------------------------------------------
     - 상품의 상태를 자동 분석하여 badge 배열 생성
     - 우선순위: 환불 > 만료 > 사용예정 > 홀딩 > 양도
     - Angular: getter로 badgeList 계산 가능
  ====================================================== */
  const badges = [];

  // 환불
  if (isRefunded) {
    badges.push({ text: "환불", variant: "refund" });
  }

  // 만료
  else if (end && end < today) {
    badges.push({ text: "만료", variant: "expired" });
  }

  // 사용예정
  else if (start && start > today) {
    const dDay = diffDays(start, today);
    badges.push({
      text: "사용예정",
      variant: "planned",
      dDay: dDay > 0 ? `D-${dDay}` : "D-DAY",
    });
  }

  // 양도 상태
  if (Array.isArray(transfer) && transfer.length > 0) {
    const latestTransfer = transfer
      .map((t) => ({ ...t, date: parseDate(t.startDate) }))
      .sort((a, b) => b.date - a.date)[0];

    if (latestTransfer.date > today)
      badges.push({ text: "양도예정", variant: "transfer" });
    else badges.push({ text: "양도", variant: "transfer" });
  }

  // 홀딩 상태
  if (Array.isArray(holding) && holding.length > 0) {
    const latestHolding = holding
      .map((h) => ({
        ...h,
        s: parseDate(h.startDate),
        e: parseDate(h.endDate),
      }))
      .sort((a, b) => b.e - a.e)[0];

    const { s, e } = latestHolding;
    if (s > today) badges.push({ text: "홀딩예정", variant: "holding" });
    else if (e >= today) badges.push({ text: "홀딩중", variant: "holding" });
  }

  /* ======================================================
     🧾 추가 내역 (양도/홀딩 상세 설명)
     ------------------------------------------------------
     - 카드 body에 표시될 추가 정보 리스트
     - Angular: *ngFor="let item of extraInfo"
  ====================================================== */
  const extra = [];
  transfer.forEach((t) => {
    const tStart = parseDate(t.startDate);
    const tText = tStart > today ? "양도예정" : "양도";
    extra.push({
      title: tText,
      desc: `${formatDate(tStart)}부터 ${t.target}에게`,
    });
  });

  holding.forEach((h) => {
    const hStart = parseDate(h.startDate);
    const hEnd = parseDate(h.endDate);
    const days = diffDays(hEnd, hStart);
    let hText = "";
    if (hStart > today) hText = "홀딩예정";
    else if (hEnd < today) hText = "홀딩만료";
    else hText = "홀딩중";

    extra.push({
      title: hText,
      desc: `${formatDate(hStart)} ~ ${formatDate(hEnd)} (${days}일)`,
    });
  });

  /* ======================================================
     🧮 남은 일수 계산
     ------------------------------------------------------
     - Angular: getter durationText 로 계산 가능
  ====================================================== */
  let durationText = "";
  if (!start || !end) durationText = "0일 남음";
  else if (start > today) durationText = `${diffDays(end, start)}일 남음`;
  else if (end >= today) durationText = `${diffDays(end, today)}일 남음`;
  else durationText = "0일 남음";

  /* ======================================================
     🏷 배지 렌더링
     ------------------------------------------------------
     - variant 순서에 맞게 정렬 후 HTML 변환
     - Angular: *ngFor="let b of badgeList"
  ====================================================== */
  const order = [
    "planned",
    "holding-planned",
    "holding",
    "transfer-planned",
    "transfer",
    "expired",
    "refund",
  ];

  const sortedBadges = badges.sort(
    (a, b) => order.indexOf(a.variant) - order.indexOf(b.variant)
  );

  const badgeHtml = sortedBadges
    .map((b) =>
      b.variant === "planned" && b.dDay
        ? `<li class="badge badge--${b.variant}">${b.text}<p class="planned__day">${b.dDay}</p></li>`
        : `<li class="badge badge--${b.variant}">${b.text}</li>`
    )
    .join("");

  /* ======================================================
     💬 추가 내역 HTML 렌더링
     ------------------------------------------------------
     - Angular: <ul *ngIf="extraInfo.length > 0">...</ul>
  ====================================================== */
  const extraHtml =
    extra.length > 0
      ? `<ul class="product-card__extra-list">
          ${extra
            .map(
              (item) => `
            <li class="product-card__extra">
              <div class="product-card__extra-body">
                <span>${item.title}</span>${item.desc}
              </div>
            </li>`
            )
            .join("")}
        </ul>`
      : "";

  /* ======================================================
     🔐 락커 버튼 상태 계산
     ------------------------------------------------------
     - 만료 시 → "락커회수"
     - 유효 + number 없음 → "자리배정"
     - Angular: lockerButtonText getter로 대체 가능
  ====================================================== */
  const lockerButton =
    type === "locker"
      ? end < today
        ? `<button class="btn btn--ghost btn--primary btn--small">
          <div>락커회수</div>
          <div class="icon--caret-right icon"></div>
        </button>`
        : !info?.number
        ? `<button class="btn btn--ghost btn--primary btn--small">
          <div>자리배정</div>
          <div class="icon--caret-right icon"></div>
        </button>`
        : ""
      : "";

  /* ======================================================
     ✅ 선택 체크박스
     ------------------------------------------------------
     - withCheckbox=true 시 렌더링
     - Angular: [attr.aria-checked]="checked"
  ====================================================== */
  const checkboxHTML = withCheckbox
    ? `
      <div class="product-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0">
        <i class="icon--check icon"></i>
      </div>
    `
    : "";

  // 카드 클래스 조합
  const cardClasses = [
    "product-card",
    `product-card--${type}`,
    withCheckbox ? "checkbox-mode" : "",
    checked ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // 무제한 여부 계산
  const isUnlimitedPeriod =
    endDate === "무제한" ||
    info.duration === "무제한" ||
    end === null ||
    end?.getFullYear?.() === 9999;

  const isUnlimitedCount = info.remain === "무제한" || info.total === "무제한";

  /* ======================================================
     🧱 카드 HTML 구조
     ------------------------------------------------------
     - 상단: 상품명, 날짜, 버튼
     - 본문: 양도/홀딩 정보
     - 하단: 남은 횟수/기간 + 배지
  ====================================================== */
  const cardHtml = `
  <div class="${cardClasses}"
       data-id="${id}"
       data-type="${type}"
       data-popover="${popover ? "true" : "false"}"
       data-checked="${checked ? "true" : "false"}">
    ${checkboxHTML}
    <div class="product-card__content">
      <div class="product-card__section">
        <ul class="product-card__top">
          <div class="product-card__name-wrap">
            ${
              type === "locker"
                ? `<p class="product-card__type">락커</p>`
                : type === "wear"
                ? `<p class="product-card__type">운동복</p>`
                : ""
            }
            <li class="product-card__name">${name}</li>
            ${
              type === "locker" && info.number && info.number !== "-"
                ? `<li class="product-card__locker-name"><i class="icon--locker icon"></i>${info.number}</li>`
                : ""
            }
            ${lockerButton}
          </div>
          <p class="product-card__date">${startDate} ~ ${
    isUnlimitedPeriod ? "무제한" : endDate
  }</p>
        </ul>
        <div class="product-card__body">${extraHtml}</div>
      </div>
      
      <div class="product-card__bottom">
        <ul class="product-card__info">
          ${
            type === "membership"
              ? info.remain
                ? `<li class="product-card__count">${
                    info.type === "예약 사용"
                      ? isUnlimitedCount
                        ? "예약 무제한"
                        : `예약 ${info.remain}회`
                      : isUnlimitedCount
                      ? "출석 무제한"
                      : `출석 ${info.remain}회`
                  }</li>`
                : ""
              : ""
          }
          <li class="product-card__duration">${
            isUnlimitedPeriod ? "기간 무제한" : durationText
          }</li>
        </ul>
        <ul class="product-card__badges">${badgeHtml}</ul>
      </div>
    </div>
  </div>
`;

  /* ======================================================
     🎈 팝오버 HTML 템플릿
     ------------------------------------------------------
     - 카드 클릭 시 표시되는 상세 팝오버 구조
     - Angular: 별도 <app-product-popover> 컴포넌트로 분리 가능
  ====================================================== */
  const popoverHtml = `
    <aside class="product-detail-popover" data-id="${id}">
      <div class="product-detail-popover__header">
        <div class="product-detail-popover__btn-wrap">
          <div class="product-detail-popover__btn-left">
            ${lockerButton}
            <button class="btn btn--outlined btn--neutral btn--small">연장</button>
            <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
            <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="정보수정, 재등록, 양도, 환불, 삭제">
              <i class="icon--dots-three icon"></i>
            </button>
          </div>
          <div class="product-detail-popover__btn-right">
            <button class="btn--icon-utility x-btn" aria-label="닫기">
              <div class="icon--x icon"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="product-detail-popover__content">
        <div class="product-detail-popover__name">
          <div class="product-detail-popover__product-name">${name}</div>
          <div class="product-detail-popover__date">${startDate} ~ ${endDate}</div>
        </div>
        <div class="product-detail-popover__memo-wrap">
          <div class="content-title">메모</div>
          <div class="product-detail-popover__memo">${memo || "-"}</div>
        </div>
      </div>
    </aside>
  `;

  /* ======================================================
     🏁 반환
     ------------------------------------------------------
     - 카드 렌더링: cardHtml
     - 팝오버 표시: popoverHtml
  ====================================================== */
  return { cardHtml, popoverHtml };
}
