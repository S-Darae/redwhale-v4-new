import "../../components/button/button.js";
import "../../components/tab/tab.js";
import { initializeTabs } from "../../components/tab/tab.js";
import "../../components/tooltip/tooltip.js";

/* ================================================================
📦 Component: ProductPopover (상품 상세 팝오버)
-------------------------------------------------------------------
- 역할: 상품 카드 클릭 시 열리는 상세 정보 팝오버(aside)를 생성
- 구성: 상단 버튼 영역 / 요약 정보 / 탭(line-tab) / 메모 / 추가 정보
- 상품 유형(type: 회원권·락커·운동복)에 따라 버튼/정보/탭 구성 자동화
- Tooltip 및 Tab(line-tab) 컴포넌트 초기화 포함
- “예약 사용 회원권”은 예약 관련 정보 섹션을 추가로 표시

🧩 Angular 변환 시 가이드
-------------------------------------------------------------------
1️⃣ 컴포넌트 선언 예시
    <app-product-popover
      [product]="selectedProduct"
      (close)="onClosePopover()">
    </app-product-popover>

2️⃣ Angular @Input() 속성
    @Input() product: {
      id: string;
      type: 'membership' | 'locker' | 'wear';
      name: string;
      startDate: string;
      endDate: string;
      info?: {
        type?: string;
        remain?: number|string;
        total?: number|string;
        number?: string;
        reservation?: any;
      };
      memo?: string;
      tickets?: any[];
      holding?: any[];
      transfer?: any[];
      isRefunded?: boolean;
    };

3️⃣ Angular @Output() 이벤트
    @Output() close = new EventEmitter<void>();

4️⃣ Angular 내부 구조
    - header: 버튼 영역 + 닫기 버튼
    - summary: 상품명 / 기간 / 배지 / 기본 정보
    - tabs: line-tab 컴포넌트 (기본정보 / 출석·예약 / 결제 / 이력)
    - sub: 메모 및 예약 가능한 수업 섹션
================================================================ */

export function createProductPopover(product) {
  const {
    id,
    type, // membership | locker | wear
    name,
    startDate,
    endDate,
    info = {},
    memo,
    tickets = [],
    holding = [],
    transfer = [],
    isRefunded = false,
  } = product;

  /* ======================================================
     📆 날짜 관련 헬퍼
     ------------------------------------------------------
     - 문자열 "YYYY.MM.DD" → Date 객체 변환(parseDate)
     - 두 날짜 간 일수 차이 계산(diffDays)
     - Angular에서는 DatePipe 또는 Utility Service로 분리 권장
  ====================================================== */
  const today = new Date();
  const parseDate = (str) => (str ? new Date(str.replace(/\./g, "-")) : null);
  const diffDays = (a, b) => Math.ceil((a - b) / (1000 * 60 * 60 * 24));

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  /* ======================================================
     🧱 팝오버 루트 요소 생성
     ------------------------------------------------------
     - type별 클래스 추가
     - Angular: <aside class="product-detail-popover" [ngClass]="type">
  ====================================================== */
  const popover = document.createElement("aside");
  popover.className = `product-detail-popover ${type}`;
  popover.dataset.id = id;
  popover.classList.add("visible");

  /* ======================================================
     1️⃣ Header 버튼 렌더링
     ------------------------------------------------------
     - 상품 유형(type)에 따라 버튼 구성이 달라짐
     - Tooltip(tooltip.js) 사용하여 dots-three 버튼 툴팁 표시
  ====================================================== */
  let leftBtns = "";

  if (type === "membership") {
    const isReservUsed = info.type === "예약 사용";

    leftBtns = `
      ${
        isReservUsed
          ? `<button class="btn btn--outlined btn--neutral btn--small">수업예약</button>`
          : ""
      }
      <button class="btn btn--outlined btn--neutral btn--small">연장</button>
      <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="상단 버튼 및 더보기 메뉴 추후 제작">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  } else if (type === "locker") {
    // 만료된 락커 → '락커 회수' 버튼
    // 배정되지 않은 경우 → '자리배정' 버튼
    const isExpired = end < today;
    const isAssigned = info.number && info.number !== "-";

    const assignBtn = isExpired
      ? `<button class="btn btn--outlined btn--primary btn--small">락커 회수</button>`
      : !isAssigned
      ? `<button class="btn btn--outlined btn--primary btn--small">자리배정</button>`
      : "";

    leftBtns = `
      ${assignBtn}
      <button class="btn btn--outlined btn--neutral btn--small">연장</button>
      <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="상단 버튼 및 더보기 메뉴 추후 제작">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  } else if (type === "wear") {
    leftBtns = `
      <button class="btn btn--outlined btn--neutral btn--small">연장</button>
      <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="상단 버튼 및 더보기 메뉴 추후 제작">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  }

  /* ======================================================
     2️⃣ 팝오버 기본 레이아웃 구성
     ------------------------------------------------------
     - header / summary / line-tab / memo 순서
     - 회원권만 출석 내역 탭 표시
  ====================================================== */
  popover.innerHTML = `
    <div class="product-detail-popover__header">
      <div class="product-detail-popover__btn-wrap">
        <div class="product-detail-popover__btn-left">${leftBtns}</div>
        <div class="product-detail-popover__btn-right">
          <button class="btn--icon-utility x-btn" aria-label="닫기">
            <div class="icon--x icon"></div>
          </button>
        </div>
      </div>
    </div>

    <div class="product-detail-popover__content">
      <div class="product-detail-popover__summary">
        <ul class="product-detail-popover__name">
          <li class="product-detail-popover__product-name">${name}</li>
          <li class="product-detail-popover__date">${startDate} ~ ${endDate}</li>
        </ul>
        <ul class="product-detail-popover__badge-wrap"></ul>
        <div class="product-detail-popover__info-section">
          <ul class="product-detail-popover__info-list"></ul>
        </div>
      </div>

      <!-- 공통 탭(line-tab) -->
      <section class="tab-set popover-tab-set">
        <div class="line-tab small">
          <button class="line-tab__tab is-active" data-target="popover-tab-basic">기본 정보</button>
          ${
            type === "membership"
              ? `<button class="line-tab__tab" data-target="popover-tab-attendance">출석 내역</button>`
              : ""
          }
          <button class="line-tab__tab" data-target="popover-tab-payment">결제 내역</button>
          <button class="line-tab__tab" data-target="popover-tab-history">홀딩 · 연장 · 양도</button>
        </div>

        <div class="line-tab__panels">
          <div id="popover-tab-basic" class="line-tab__panel"></div>
          ${
            type === "membership"
              ? `<div id="popover-tab-attendance" class="line-tab__panel"></div>`
              : ""
          }
          <div id="popover-tab-payment" class="line-tab__panel"></div>
          <div id="popover-tab-history" class="line-tab__panel"></div>
        </div>
      </section>

      <div class="product-detail-popover__sub">
        <div class="product-detail-popover__memo-wrap">
          <div class="content-title">메모</div>
          <div class="product-memo ${
            !memo || memo.trim() === "" || memo === "-" ? "empty-text" : ""
          }">
            ${memo && memo.trim() !== "" && memo !== "-" ? memo : "-"}
          </div>
        </div>
      </div>
    </div>
  `;

  /* ======================================================
     3️⃣ 탭 콘텐츠 템플릿
     ------------------------------------------------------
     - initializeTabs() 로 활성화
     - 회원권: 예약 미사용 → 출석 내역 탭 자동 대체
  ====================================================== */
  const templateHTML = `
    <template id="tpl-popover-tab-basic">
      <div class="popover-tab__content">
        <p>기본 정보 영역</p>
      </div>
    </template>

    ${
      type === "membership"
        ? `
        <template id="tpl-popover-tab-${
          info.type === "예약 미사용" ? "attendance" : "reservation"
        }">
          <div class="popover-tab__content">
            <p>${
              info.type === "예약 미사용" ? "출석 내역" : "예약 내역"
            } 영역</p>
          </div>
        </template>
      `
        : ""
    }

    <template id="tpl-popover-tab-payment">
      <div class="popover-tab__content"><p>결제 내역 영역</p></div>
    </template>

    <template id="tpl-popover-tab-history">
      <div class="popover-tab__content"><p>홀딩 · 연장 · 양도 영역</p></div>
    </template>
  `;
  popover.insertAdjacentHTML("beforeend", templateHTML);

  /* ======================================================
     4️⃣ 상태 배지 자동 생성
     ------------------------------------------------------
     - 환불 / 만료 / 사용예정 / 홀딩 / 양도 순서로 정렬
     - variant 기준으로 일관된 순서 유지
  ====================================================== */
  const badgesWrap = popover.querySelector(
    ".product-detail-popover__badge-wrap"
  );
  const badges = [];

  if (isRefunded) {
    badges.push({ text: "환불", variant: "refund" });
  } else if (end < today) {
    badges.push({ text: "만료", variant: "expired" });
  } else if (start > today) {
    const dDay = diffDays(start, today);
    badges.push({
      text: "사용예정",
      variant: "planned",
      dDay: dDay > 0 ? `D-${dDay}` : "D-DAY",
    });
  }

  holding.forEach((h) => {
    const s = parseDate(h.startDate);
    const e = parseDate(h.endDate);
    if (s > today) badges.push({ text: "홀딩예정", variant: "holding" });
    else if (e >= today) badges.push({ text: "홀딩중", variant: "holding" });
  });

  transfer.forEach((t) => {
    const ts = parseDate(t.startDate);
    badges.push({
      text: ts > today ? "양도예정" : "양도",
      variant: "transfer",
    });
  });

  function sortBadges(badges) {
    const order = [
      "planned",
      "holding-planned",
      "holding",
      "transfer-planned",
      "transfer",
      "expired",
      "refund",
    ];
    return badges.sort(
      (a, b) => order.indexOf(a.variant) - order.indexOf(b.variant)
    );
  }

  const sortedBadges = sortBadges(badges);
  badgesWrap.innerHTML = sortedBadges
    .map((b) =>
      b.variant === "planned" && b.dDay
        ? `<li class="badge badge--${b.variant}">${b.text}<p class="planned__day">${b.dDay}</p></li>`
        : `<li class="badge badge--${b.variant}">${b.text}</li>`
    )
    .join("");

  // 배지 없는 경우 gap 제거용
  if (sortedBadges.length === 0) {
    badgesWrap.classList.add("is-empty");
  }

  /* ======================================================
     5️⃣ 기본 정보 리스트 구성
     ------------------------------------------------------
     - 상품 유형별로 label/value 구조 구분
     - 회원권은 남은 기간, 횟수, 예약 정보 포함
  ====================================================== */
  const infoList = popover.querySelector(".product-detail-popover__info-list");
  const remain = info.remain ?? "-";
  const total = info.total ?? "-";
  const isUnlimited = remain === "무제한" || total === "무제한";
  const duration =
    start && end && endDate !== "무제한" ? diffDays(end, start) : 0;

  let remainDays = 0;
  if (endDate === "무제한") remainDays = "무제한";
  else if (end >= today && start <= today) remainDays = diffDays(end, today);
  else if (start > today) remainDays = duration;
  else remainDays = 0;

  if (type === "membership") {
    const typeClass =
      info.type === "예약 사용" ? "reserv-used" : "reserv-unused";
    const typeText = info.type.replace(/\s+/g, "");
    infoList.innerHTML = `
      <li class="label">유형</li>
      <li class="label">남은 횟수</li>
      <li class="label">남은 기간</li>

      <li class="value product-type">
        <div class="product-type">
          회원권 <span class="product-type--${typeClass}">(${typeText})</span>
        </div>
      </li>
      <li class="value">${
        isUnlimited ? `무제한` : `${remain}회 <span>/ ${total}회</span>`
      }</li>
      <li class="value">${
        endDate === "무제한"
          ? `무제한`
          : `${remainDays}일 <span>/ ${duration}일</span>`
      }</li>
    `;
  } else if (type === "locker") {
    infoList.innerHTML = `
      <li class="label">유형</li>
      <li class="label">락커 번호</li>
      <li class="label">남은 기간</li>

      <li class="value product-type"><div class="product-type--locker">락커</div></li>
      <li class="value">${info.number || "-"}</li>
      <li class="value">${
        endDate === "무제한"
          ? `무제한`
          : `${remainDays}일<span> / ${duration}일</span>`
      }</li>
    `;
  } else if (type === "wear") {
    infoList.innerHTML = `
      <li class="label">유형</li>
      <li class="label">남은 기간</li>

      <li class="value product-type"><div class="product-type--wear">운동복</div></li>
      <li class="value">${
        endDate === "무제한"
          ? `무제한`
          : `${remainDays}일 <span>/ ${duration}일</span>`
      }</li>
    `;
  }

  /* ======================================================
     6️⃣ 예약 사용 회원권 - 예약 가능 횟수 표시
     ------------------------------------------------------
     - info.reservation 객체 존재 시 예약 관련 정보 자동 추가
     - Angular: *ngIf="info.reservation"
  ====================================================== */
  if (info.type === "예약 사용" && info.reservation) {
    const summary = popover.querySelector(".product-detail-popover__summary");
    const res = info.reservation;
    const getVal = (obj) => {
      if (!obj) return "-";
      if (obj.used === "무제한") return `무제한`;
      if (obj.total) return `${obj.used}회<span> / ${obj.total}회</span>`;
      return `${obj.used ?? 0}회`;
    };

    const detailSectionHTML = `
      <div class="product-detail-popover__detail-section">
        <div class="product-detail-popover__sub-title">예약 가능 횟수</div>
        <ul class="product-detail-popover__detail-list">
          <li class="label">오늘</li>
          <li class="label">이번주</li>
          <li class="label">동시 예약</li>
          <li class="label">예약 취소</li>
          <li class="value">${getVal(res.today)}</li>
          <li class="value">${getVal(res.week)}</li>
          <li class="value">${getVal(res.concurrent)}</li>
          <li class="value">${getVal(res.cancel)}</li>
        </ul>
      </div>
    `;
    summary.insertAdjacentHTML("beforeend", detailSectionHTML);
  }

  /* ======================================================
     7️⃣ 회원권 - 예약 가능한 수업 목록
     ------------------------------------------------------
     - tickets.length > 0 인 경우만 표시
  ====================================================== */
  if (type === "membership" && tickets.length > 0) {
    const sub = popover.querySelector(".product-detail-popover__sub");
    const ticketHTML = `
      <hr />
      <div class="product-detail-popover__tickets">
        <div class="content-title">예약 가능한 수업</div>
        ${tickets
          .map(
            (group) => `
              <div class="product-detail-popover__ticket-group">
                <div class="folder-name">${group.folder} <span>${
              group.count
            }</span></div>
                <ul class="ticket-list">
                  ${group.items
                    .map((item) => `<div class="ticket-item">${item}</div>`)
                    .join("")}
                </ul>
              </div>`
          )
          .join("")}
      </div>
    `;
    sub.insertAdjacentHTML("beforeend", ticketHTML);
  }

  /* ======================================================
     8️⃣ 닫기 버튼 동작
     ------------------------------------------------------
     - 팝오버 닫기 시 product-card의 active 상태 해제
     - Angular: (click)="close.emit()"
  ====================================================== */
  const activeCard = document.querySelector(`.product-card[data-id="${id}"]`);
  if (activeCard) activeCard.classList.add("popover-is-active");

  popover.querySelector(".x-btn")?.addEventListener("click", () => {
    activeCard?.classList.remove("popover-is-active");
    popover.remove();
  });

  /* ======================================================
     9️⃣ 탭 초기화
     ------------------------------------------------------
     - line-tab 컴포넌트 활성화
     - Angular: <app-line-tab> 으로 교체 가능
  ====================================================== */
  const popoverTabSet = popover.querySelector(".popover-tab-set");
  if (popoverTabSet) initializeTabs(popoverTabSet);

  return popover;
}
