import "./product-card.scss";

/**
 * =====================================================================
 * 🧩 createProductCard() — 상품 카드 생성 유틸
 * =====================================================================
 *
 * 📌 역할:
 * - 회원권 / 락커 / 운동복 등 상품 타입별 카드를 HTML 문자열로 생성합니다.
 * - badge(배지), 남은 일수, 상태 버튼, 체크박스 등 UI 상태를 자동 계산.
 *
 * ✅ 주요 특징:
 * - 자동 배지 계산 (사용예정 / 양도 / 홀딩 / 만료 / 환불)
 * - 남은 기간/횟수 계산 및 표시
 * - 락커 만료 시 “락커 회수” 버튼 자동 전환
 * - 선택 모드(`withCheckbox`) 및 팝오버(`popover`) 지원
 * - 카드 본문 + 팝오버 구조를 모두 반환 ({ cardHtml, popoverHtml })
 *
 * ⚙️ 사용 예시:
 * ```js
 * const { cardHtml } = createProductCard(productData);
 * container.innerHTML = cardHtml;
 * ```
 *
 * @param {Object} p - 상품 데이터 객체
 * @returns {Object} { cardHtml, popoverHtml }
 * =====================================================================
 */

/* ==========================
   📅 날짜 관련 유틸 함수
   ========================== */

// "2025.03.01" 형식을 JS Date로 변환
function parseDate(d) {
  if (!d) return null;
  return new Date(d.replace(/\./g, "-"));
}

// Date → "YYYY.MM.DD" 포맷 문자열로 변환
function formatDate(date) {
  return date ? date.toISOString().slice(0, 10).replace(/-/g, ".") : "-";
}

// 두 날짜 차이를 일(day) 단위로 계산
function diffDays(a, b) {
  return Math.ceil((a - b) / (1000 * 60 * 60 * 24));
}

/* ==========================
   📦 카드 생성 메인 함수
   ========================== */
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
    button,
    withCheckbox = false, // 체크박스 모드
    checked = false, // 선택 상태
    popover = true, // 팝오버 지원 여부
  } = p;

  const today = new Date();
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  /* ==========================
     🏷 상태 배지 계산
     ==========================
     - 상품의 현재 상태를 자동으로 분석해 badge 목록을 생성.
     - 상태 우선순위: 환불 > 만료 > 사용예정 > 홀딩 > 양도
  */
  const badges = [];

  // 🔴 환불
  if (isRefunded) {
    badges.push({ text: "환불", variant: "refund" });
  }

  // ⚫ 만료
  else if (end && end < today) {
    badges.push({ text: "만료", variant: "expired" });
  }

  // 🟢 사용예정 (시작 전)
  else if (start && start > today) {
    const dDay = diffDays(start, today);
    badges.push({
      text: "사용예정",
      variant: "planned",
      dDay: dDay > 0 ? `D-${dDay}` : "D-DAY",
    });
  }

  // 🟣 양도 상태 (다건 중 최신 1건만 체크)
  if (Array.isArray(transfer) && transfer.length > 0) {
    const latestTransfer = transfer
      .map((t) => ({ ...t, date: parseDate(t.startDate) }))
      .sort((a, b) => b.date - a.date)[0];

    if (latestTransfer.date > today)
      badges.push({ text: "양도예정", variant: "transfer" });
    else badges.push({ text: "양도", variant: "transfer" });
  }

  // 🟠 홀딩 상태 (가장 최근 종료일 기준)
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

  /* ==========================
     🧾 추가 내역 (양도/홀딩 상세 설명)
     ==========================
     - 카드 본문(body)에 표시되는 부가 정보 리스트
  */
  const extra = [];

  // 양도 내역
  transfer.forEach((t) => {
    const tStart = parseDate(t.startDate);
    const tText = tStart > today ? "양도예정" : "양도";
    extra.push({
      title: tText,
      desc: `${formatDate(tStart)}부터 ${t.target}에게`,
    });
  });

  // 홀딩 내역
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

  /* ==========================
     🧮 남은 일수 계산
     ========================== */
  let durationText = "";
  if (!start || !end) durationText = "0일 남음";
  else if (start > today) durationText = `${diffDays(end, start)}일 남음`;
  else if (end >= today) durationText = `${diffDays(end, today)}일 남음`;
  else durationText = "0일 남음";

  /* ==========================
     🏷 배지 렌더링 (정렬 및 HTML 변환)
     ========================== */
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

  /* ==========================
     💬 추가 내역 렌더링 (양도/홀딩)
     ========================== */
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

  /* ==========================
   🔐 락커 버튼 상태
   ==========================
   - 만료 시 → "락커회수"
   - 유효 + number 없음 → "자리배정"
   - 유효 + number 있음 → 버튼 없음
========================== */
  const lockerButton =
    type === "locker"
      ? end < today
        ? `<button class="btn btn--ghost btn--primary btn--small">
          <div>락커회수</div>
          <div class="icon--caret-right icon"></div>
        </button>`
        : !info?.number // number 값이 비어있을 때만
        ? `<button class="btn btn--ghost btn--primary btn--small">
          <div>자리배정</div>
          <div class="icon--caret-right icon"></div>
        </button>`
        : "" // 이미 번호가 있으면 버튼 없음
      : "";

  /* ==========================
     ✅ 체크박스 추가 (선택모드)
     ========================== */
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

  // 카드 클래스 동적 조합
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

  /* ==========================
     🧱 카드 HTML 렌더링
     ==========================
     - 상단(이름/날짜)
     - 본문(양도/홀딩)
     - 하단(남은 횟수/기간 + 배지)
  */
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

  /* ==========================
     🎈 팝오버 템플릿 (기본 유지)
     ==========================
     - 상세 버튼 / 메모 / 기간정보 등 표시용
     - 카드 클릭 시 외부에서 initPopover()로 제어됨
  */
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

  /* ==========================
     🏁 반환
     ==========================
     - 렌더링 시에는 cardHtml 사용
     - 팝오버 로직과 함께 쓸 경우 popoverHtml 병행 활용
  */
  return { cardHtml, popoverHtml };
}
