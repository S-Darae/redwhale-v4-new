import "../button/button.js";
import "../tab/tab.js";
import { initializeTabs } from "../tab/tab.js";
import "../tooltip/tooltip.js";

/**
 * ===================================================================
 * 🧩 createProductPopover()
 * ===================================================================
 * 상품 카드 클릭 시 열리는 **상세 팝오버(aside)** 를 동적으로 생성하는 함수입니다.
 *
 * ✅ 주요 기능 요약
 * - 상품 유형별 버튼/탭/정보 구성 (회원권, 락커, 운동복)
 * - 상태(환불, 만료, 홀딩, 양도 등)에 따라 배지 자동 생성
 * - 회원권 타입에 따라 “예약 / 출석” 탭 자동 구분
 * - 카드 클릭 시 팝오버 열리고, 닫기 시 원래 상태 복원
 * - 공통 탭 컴포넌트(line-tab)와 Tooltip 컴포넌트 사용
 *
 * ⚙️ 파라미터
 * @param {Object} product - 상품 데이터 객체
 *    - type: "membership" | "locker" | "wear"
 *    - info: { type, remain, total, number }
 *    - holding[], transfer[], tickets[] 등 상태 관련 정보
 *
 * @returns {HTMLElement} - 완성된 팝오버 DOM 엘리먼트
 * ===================================================================
 */
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

  /* -------------------------------------------------------------------
     📆 날짜 관련 헬퍼
     ------------------------------------------------------------------- */
  const today = new Date();
  const parseDate = (str) => (str ? new Date(str.replace(/\./g, "-")) : null);
  const diffDays = (a, b) => Math.ceil((a - b) / (1000 * 60 * 60 * 24));

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  /* -------------------------------------------------------------------
     🧱 팝오버 루트 요소 생성
     ------------------------------------------------------------------- */
  const popover = document.createElement("aside");
  popover.className = `product-detail-popover ${type}`;
  popover.dataset.id = id;
  popover.classList.add("visible");

  /* -------------------------------------------------------------------
     1️⃣ Header 버튼 영역
     -------------------------------------------------------------------
     - 상품 유형(type)에 따라 다른 버튼 구성을 렌더링합니다.
     - tooltip.js 를 사용해 dots-three 버튼에 툴팁 표시.
     ------------------------------------------------------------------- */
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
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="정보수정, 재등록, 양도, 환불, 삭제">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  } else if (type === "locker") {
    // 만료된 락커는 '락커 회수' 버튼 표시,
    // 배정되지 않은 경우엔 '자리배정' 버튼 노출
    const isExpired = end < today;
    const isAssigned = info.number && info.number !== "-";

    const assignBtn = isExpired
      ? `<button class="btn btn--outlined btn--error btn--small">락커 회수</button>`
      : !isAssigned
      ? `<button class="btn btn--outlined btn--primary btn--small">자리배정</button>`
      : "";

    leftBtns = `
      ${assignBtn}
      <button class="btn btn--outlined btn--neutral btn--small">연장</button>
      <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="정보수정, 재등록, 양도, 환불, 삭제">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  } else if (type === "wear") {
    leftBtns = `
      <button class="btn btn--outlined btn--neutral btn--small">연장</button>
      <button class="btn btn--outlined btn--neutral btn--small">홀딩</button>
      <button class="btn btn--outlined btn--neutral btn--small" data-tooltip="정보수정, 재등록, 양도, 환불, 삭제">
        <i class="icon--dots-three icon"></i>
      </button>
    `;
  }

  /* -------------------------------------------------------------------
     2️⃣ 팝오버 기본 레이아웃
     -------------------------------------------------------------------
     - 상단 버튼 / 요약 정보 / 공통 탭 / 메모 영역 순으로 구성됩니다.
     - 회원권의 경우에만 '출석 내역' 탭 추가.
     ------------------------------------------------------------------- */
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

      <!-- 공통 탭(line-tab) 컴포넌트 -->
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

  /* -------------------------------------------------------------------
     3️⃣ 탭 콘텐츠 템플릿 삽입
     -------------------------------------------------------------------
     - 이후 initializeTabs()로 활성화
     - 회원권: “예약 미사용”은 출석 내역 탭으로 자동 교체
     ------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------
     4️⃣ 상태 배지 자동 생성
     -------------------------------------------------------------------
     - 환불 / 만료 / 사용예정 / 홀딩 / 양도 순서로 생성 후 정렬
     - variant 우선순위에 따라 시각적 일관성 유지
     ------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------
     5️⃣ 기본 정보 리스트 구성
     -------------------------------------------------------------------
     - type 별로 label/value 구조 다르게 채워짐
     - 남은 횟수, 기간, 락커번호 등 표시
     ------------------------------------------------------------------- */
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
    const membershipLabel = `${typeText} 회원권`;

    infoList.innerHTML = `
      <li class="label">유형</li>
      <li class="label">남은 횟수</li>
      <li class="label">남은 기간</li>

      <li class="value product-type"><div class="product-type--${typeClass}">${membershipLabel}</div></li>
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

  /* -------------------------------------------------------------------
     6️⃣ 회원권: 예약 가능한 수업 목록 표시
     ------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------
     7️⃣ 닫기 버튼 + 상태 복원
     -------------------------------------------------------------------
     - 팝오버 닫을 때 product-card의 .popover-is-active 제거
     ------------------------------------------------------------------- */
  const activeCard = document.querySelector(`.product-card[data-id="${id}"]`);
  if (activeCard) activeCard.classList.add("popover-is-active");

  popover.querySelector(".x-btn")?.addEventListener("click", () => {
    activeCard?.classList.remove("popover-is-active");
    popover.remove();
  });

  /* -------------------------------------------------------------------
     8️⃣ 탭 초기화 (공통 tab.js)
     ------------------------------------------------------------------- */
  const popoverTabSet = popover.querySelector(".popover-tab-set");
  if (popoverTabSet) initializeTabs(popoverTabSet);

  return popover;
}
