/* ======================================================================
   📦 product-card.js — 상품 카드 생성 유틸
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원권 / 락커 / 운동복 등 상품 정보를 카드 형태로 표시
   - badge(배지), 남은 일수, 상태 버튼, 체크박스 등 UI 상태 자동 계산
   - 카드 본문 + 팝오버용 HTML 템플릿을 함께 반환

   ✅ 주요 특징:
   - 상태 자동 계산 (사용예정 / 양도 / 홀딩 / 만료 / 환불)
   - 남은 기간·횟수 / 무제한 여부 자동 처리
   - 락커 만료 시 → "락커회수", 미배정 시 → "자리배정" 버튼 자동 표시
   - 선택 모드(`withCheckbox`) 및 팝오버(`popover`) 지원

   ✅ Angular 변환 가이드:
   ----------------------------------------------------------------------
   🧩 컴포넌트 선언 예시
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
        [withCheckbox]="true"
        [checked]="false"
        [popover]="true"
        (openPopover)="onOpenPopover($event)"
        (toggleChecked)="onToggleChecked($event)">
      </app-product-card>

   🧠 @Input()
      id, type, name, startDate, endDate, transfer, holding,
      isRefunded, info, memo, withCheckbox, checked, popover

   🧩 @Output()
      openPopover: EventEmitter<string>
      toggleChecked: EventEmitter<{ id: string; checked: boolean }>

   🪄 Angular 내부 구현 포인트
      - badgeList → getter로 계산
      - extraInfo → computed property로 처리
      - [class.is-selected]="checked"
      - popover → <app-product-popover> 컴포넌트로 분리 가능
   ====================================================================== */

import "./product-card.scss";

/* ======================================================================
   🧮 유틸 함수 — 날짜 및 계산
   ----------------------------------------------------------------------
   - parseDate: "YYYY.MM.DD" → Date
   - formatDate: Date → "YYYY.MM.DD"
   - diffDays: 일(day) 단위 차이 계산
   ====================================================================== */
function parseDate(d) {
  return d ? new Date(d.replace(/\./g, "-")) : null;
}

function formatDate(date) {
  return date ? date.toISOString().slice(0, 10).replace(/-/g, ".") : "-";
}

function diffDays(a, b) {
  return Math.ceil((a - b) / (1000 * 60 * 60 * 24));
}

/* ======================================================================
   🎨 상수 정의 — 배지 정렬 순서 및 타입 라벨
   ====================================================================== */
const BADGE_ORDER = [
  "planned",
  "holding-planned",
  "holding",
  "transfer-planned",
  "transfer",
  "expired",
  "refund",
];

const TYPE_LABEL = {
  membership: "회원권",
  locker: "락커",
  wear: "운동복",
};

/* ======================================================================
   🧩 createProductCard() — 상품 카드 생성 함수
   ----------------------------------------------------------------------
   ✅ 역할:
   - 상품 데이터(p)를 받아 HTML 문자열(cardHtml, popoverHtml) 생성
   - 상태/기간/횟수/무제한 여부 자동 계산
   - 카드와 팝오버 HTML 템플릿 모두 반환
   ====================================================================== */
export function createProductCard(p) {
  const {
    id,
    type, // membership | locker | wear
    name,
    startDate,
    endDate,
    transfer = [], // 양도 내역
    holding = [], // 홀딩 내역
    isRefunded = false,
    info = {}, // { remain, total, duration, type, number }
    memo,
    withCheckbox = false, // 선택 모드
    checked = false, // 선택 상태
    popover = true, // 팝오버 사용 여부
  } = p;

  const today = new Date();
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  /* --------------------------------------------------
     🏷 상태 배지 계산
     -------------------------------------------------- */
  function getBadges() {
    const badges = [];

    // 환불
    if (isRefunded) return [{ text: "환불", variant: "refund" }];

    // 만료
    if (end && end < today) return [{ text: "만료", variant: "expired" }];

    // 사용예정
    if (start && start > today) {
      const dDay = diffDays(start, today);
      badges.push({
        text: "사용예정",
        variant: "planned",
        dDay: dDay > 0 ? `D-${dDay}` : "D-DAY",
      });
    }

    // 양도
    if (transfer.length) {
      const latest = transfer
        .map((t) => ({ ...t, date: parseDate(t.startDate) }))
        .sort((a, b) => b.date - a.date)[0];
      badges.push({
        text: latest.date > today ? "양도예정" : "양도",
        variant: "transfer",
      });
    }

    // 홀딩
    if (holding.length) {
      const latest = holding
        .map((h) => ({
          ...h,
          s: parseDate(h.startDate),
          e: parseDate(h.endDate),
        }))
        .sort((a, b) => b.e - a.e)[0];

      const { s, e } = latest;
      if (s > today) badges.push({ text: "홀딩예정", variant: "holding" });
      else if (e >= today) badges.push({ text: "홀딩중", variant: "holding" });
    }

    // 정렬 후 반환
    return badges.sort(
      (a, b) => BADGE_ORDER.indexOf(a.variant) - BADGE_ORDER.indexOf(b.variant)
    );
  }

  const badges = getBadges();

  /* --------------------------------------------------
     🧾 부가 정보 (양도 / 홀딩 내역)
     -------------------------------------------------- */
  function getExtraInfo() {
    const result = [];

    // 양도
    transfer.forEach((t) => {
      const tStart = parseDate(t.startDate);
      const label = tStart > today ? "양도예정" : "양도";
      result.push({
        title: label,
        desc: `${formatDate(tStart)}부터 ${t.target}에게`,
      });
    });

    // 홀딩
    holding.forEach((h) => {
      const s = parseDate(h.startDate);
      const e = parseDate(h.endDate);
      const days = diffDays(e, s);
      const label = s > today ? "홀딩예정" : e < today ? "홀딩만료" : "홀딩중";
      result.push({
        title: label,
        desc: `${formatDate(s)} ~ ${formatDate(e)} (${days}일)`,
      });
    });

    return result;
  }

  const extraInfo = getExtraInfo();

  /* --------------------------------------------------
     🧮 남은 일수 / 무제한 여부 계산
     -------------------------------------------------- */
  const isUnlimitedPeriod =
    endDate === "무제한" ||
    info.duration === "무제한" ||
    !end ||
    end?.getFullYear?.() === 9999;

  const isUnlimitedCount = info.remain === "무제한" || info.total === "무제한";

  let durationText = "";
  if (!start || !end) durationText = "0일 남음";
  else if (start > today) durationText = `${diffDays(end, start)}일 남음`;
  else if (end >= today) durationText = `${diffDays(end, today)}일 남음`;
  else durationText = "0일 남음";

  /* --------------------------------------------------
     🔐 락커 버튼 상태 계산
     -------------------------------------------------- */
  const lockerButton =
    type === "locker"
      ? end && end < today
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

  /* --------------------------------------------------
     💬 HTML 조각 생성 (배지, 부가정보, 체크박스)
     -------------------------------------------------- */
  const badgeHTML = badges
    .map((b) =>
      b.variant === "planned" && b.dDay
        ? `<li class="badge badge--${b.variant}">${b.text}<p class="planned__day">${b.dDay}</p></li>`
        : `<li class="badge badge--${b.variant}">${b.text}</li>`
    )
    .join("");

  const extraHTML = extraInfo.length
    ? `<ul class="product-card__extra-list">${extraInfo
        .map(
          (item) => `
          <li class="product-card__extra">
            <div class="product-card__extra-body">
              <span>${item.title}</span>${item.desc}
            </div>
          </li>`
        )
        .join("")}</ul>`
    : "";

  const typeLabel = TYPE_LABEL[type] || "";

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

  const cardClasses = [
    "product-card",
    `product-card--${type}`,
    withCheckbox ? "checkbox-mode" : "",
    checked ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* ======================================================================
     🧱 카드 본문 HTML 구조
     ----------------------------------------------------------------------
     ✅ 구성
     - 상단: 상품명, 날짜, 버튼
     - 본문: 양도/홀딩 정보
     - 하단: 남은 횟수/기간 + 배지
     ====================================================================== */
  const cardHtml = `
  <div class="${cardClasses}"
       data-id="${id}"
       data-type="${type}"
       data-popover="${popover}"
       data-checked="${checked}">
    ${checkboxHTML}
    <div class="product-card__content">
      <div class="product-card__section">
        <ul class="product-card__top">
          <div class="product-card__name-wrap">
            ${typeLabel ? `<p class="product-card__type">${typeLabel}</p>` : ""}
            <li class="product-card__name">${name}</li>
            ${
              type === "locker" && info.number && info.number !== "-"
                ? `<li class="product-card__locker-name"><i class="icon--locker icon"></i><span>${info.number}</span></li>`
                : ""
            }
            ${lockerButton}
          </div>
          <p class="product-card__date">${startDate} ~ ${
    isUnlimitedPeriod ? "무제한" : endDate
  }</p>
        </ul>
        <div class="product-card__body">${extraHTML}</div>
      </div>

      <div class="product-card__bottom">
        <ul class="product-card__info">
          ${
            type === "membership" && info.remain
              ? `<li class="product-card__count">${
                  isUnlimitedCount
                    ? `${
                        info.type === "예약 사용"
                          ? "예약 무제한"
                          : "출석 무제한"
                      }`
                    : `${
                        info.type === "예약 사용"
                          ? `예약 ${info.remain}회`
                          : `출석 ${info.remain}회`
                      }`
                }</li>`
              : ""
          }
          <li class="product-card__duration">${
            isUnlimitedPeriod ? "기간 무제한" : durationText
          }</li>
        </ul>
        <ul class="product-card__badges">${badgeHTML}</ul>
      </div>
    </div>
  </div>`;

  /* ======================================================================
     🎈 팝오버 HTML 템플릿
     ----------------------------------------------------------------------
     - 카드 클릭 시 표시되는 상세 팝오버 구조
     - Angular: <app-product-popover>로 분리 가능
     ====================================================================== */
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

  /* ======================================================================
     🏁 반환 — 카드 & 팝오버 HTML
     ====================================================================== */
  return { cardHtml, popoverHtml };
}
