/**
 * ======================================================================
 * 🧩 locker-map.js — 락커 배치 및 팝오버/회원 배정 전체 관리 스크립트
 * ----------------------------------------------------------------------
 * ✅ 주요 기능
 * - 락커 데이터(행렬) 렌더링 및 상태 자동 계산
 * - D-day 계산 / 상태별 카드 표시
 * - 상태별 팝오버 자동 생성 및 초기화
 * - 회원 배정(assign) 뷰 및 드롭다운 동작
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드
 * - 각 함수 단위로 Service / Component / Directive로 분리 가능
 *   · autoUpdateLockerStatuses → LockerService (상태 계산)
 *   · renderLockerLayout → LockerGridComponent
 *   · createPopoverTemplates → LockerPopoverTemplateService
 *   · openPopover / closePopover → LockerPopoverDirective
 *   · switchToAssignView / initLockerDropdown → LockerAssignComponent
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS
 * - locker-map.scss / dropdown.scss / text-field.scss / product-card.scss
 * ======================================================================
 */

import { createProductCard } from "../../components/card/create-product-card.js";
import "../../components/card/product-card.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import {
  closeAllDropdowns,
  initializeDropdown,
} from "../../components/dropdown/dropdown-init.js";
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";
import "../../components/dropdown/dropdown.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

/* ======================================================================
   1️⃣ 락커 데이터 정의
   ----------------------------------------------------------------------
   - 총 60개 락커 (2차원 배열로 행/열 구조)
   - 각 객체 속성:
     · number        → 락커 번호
     · status        → 상태 (available, in-use, expired 등)
     · user          → 사용자 이름
     · avatar        → 프로필 이미지 경로
     · phone         → 전화번호
     · startDate/endDate → 이용 기간
   ====================================================================== */
/* ======================================================================
   1️⃣ 락커 데이터 정의 (생략 없이 전체)
   ----------------------------------------------------------------------
   - 총 60개 락커 (2차원 배열로 행/열 구조)
   - 각 객체 속성:
     · number        → 락커 번호
     · status        → 상태 (available, in-use, expired 등)
     · user          → 사용자 이름
     · avatar        → 프로필 이미지 경로
     · phone         → 전화번호
     · startDate/endDate → 이용 기간
   ====================================================================== */
const lockerRows = [
  [
    { number: "000", status: "unavailable" },
    {
      number: "001",
      status: "reserved",
      user: "강수미",
      avatar: "/assets/images/user.jpg",
      phone: "010-6427-3912",
      startDate: "2027-06-01",
      endDate: "2027-06-31",
    },
    { number: null, status: "none" },
    {
      number: "002",
      user: "이지은",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-9175-2634",
      startDate: "2025-09-01",
      endDate: "2025-09-30",
    },
    { number: "003", status: "available" },
    {
      number: "004",
      user: "오하늘",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-2513-7846",
      startDate: "2025-09-10",
      endDate: "2025-10-12",
    },
    { number: null, status: "none" },
    { number: "005", status: "available" },
    {
      number: "006",
      user: "최윤",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-4185-9023",
      startDate: "2025-10-12",
      endDate: "2025-11-12",
    },
  ],
  [
    { number: null, status: "none" },
    {
      number: "007",
      user: "김지훈",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-3294-5718",
      startDate: "2025-09-01",
      endDate: "2025-11-09",
    },
    {
      number: "008",
      user: "이서연",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-8751-4062",
      startDate: "2025-09-01",
      endDate: "2025-12-01",
    },
    {
      number: "009",
      user: "정호",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-2368-9157",
      startDate: "2025-09-01",
      endDate: "2025-11-20",
    },
    { number: "010", status: "available" },
    {
      number: "011",
      user: "박민준",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-6519-8430",
      startDate: "2025-09-15",
      endDate: "2025-10-29",
    },
    { number: "012", status: "available" },
    { number: "013", status: "available" },
    { number: "014", status: "available" },
    { number: "015", status: "available" },
    { number: "016", status: "available" },
  ],
  [
    { number: "017", status: "available" },
    {
      number: "018",
      user: "장도윤",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-7193-2846",
      startDate: "2025-09-05",
      endDate: "2025-10-14",
    },
    {
      number: "019",
      user: "한시우",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-5832-9074",
      startDate: "2025-09-10",
      endDate: "2025-11-08",
    },
    {
      number: "020",
      user: "황보예린",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-4298-6701",
      startDate: "2025-09-15",
      endDate: "2025-10-24",
    },
    { number: "021", status: "available" },
    {
      number: "022",
      user: "조수아",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-8957-4120",
      startDate: "2025-09-05",
      endDate: "2025-11-11",
    },
    { number: "023", status: "available" },
    { number: null, status: "none" },
    { number: null, status: "none" },
    {
      number: "024",
      user: "이엘리나",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-3125-7809",
      startDate: "2025-11-09",
      endDate: "2025-12-09",
    },
    {
      number: "025",
      user: "서윤재",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-4536-9817",
      startDate: "2025-09-01",
      endDate: "2025-10-05",
    },
    { number: "026", status: "available" },
    { number: "027", status: "available" },
    { number: "028", status: "available" },
    { number: "029", status: "available" },
    { number: "030", status: "available" },
  ],
  [
    {
      number: "031",
      user: "김도윤",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-5903-4725",
      startDate: "2025-07-01",
      endDate: "2026-02-07",
    },
    { number: "032", status: "available" },
    { number: "033", status: "available" },
    {
      number: "034",
      user: "김하늘",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-2641-8973",
      startDate: "2025-10-20",
      endDate: "2025-11-20",
    },
    {
      number: "035",
      user: "박서진",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-3827-5410",
      startDate: "2025-09-01",
      endDate: "2025-10-07",
    },
    { number: "036", status: "available" },
    { number: null, status: "none" },
    {
      number: "037",
      user: "이도연",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-4706-8923",
      startDate: "2025-01-01",
      endDate: "2025-07-18",
    },
    {
      number: "038",
      user: "이주원",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-7912-4536",
      startDate: "2025-09-01",
      endDate: "2025-11-24",
    },
  ],
  [
    {
      number: "039",
      user: "정유진",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-1753-6289",
      startDate: "2025-09-01",
      endDate: "2025-12-09",
    },
    { number: "040", status: "available" },
    { number: "041", status: "available" },
    { number: "042", status: "available" },
    {
      number: "043",
      user: "한수아",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-3458-7091",
      startDate: "2025-07-10",
      endDate: "2026-01-08",
    },
    {
      number: "044",
      user: "오지민",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-6285-9710",
      startDate: "2025-09-01",
      endDate: "2025-10-11",
    },
    {
      number: "045",
      user: "남태준",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-5849-2307",
      startDate: "2025-09-01",
      endDate: "2025-09-25",
    },
    { number: "046", status: "available" },
    { number: "047", status: "available" },
    { number: "048", status: "available" },
    { number: "049", status: "available" },
    { number: "050", status: "available" },
  ],
  [
    {
      number: "051",
      user: "하민주",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-4715-3092",
      startDate: "2025-01-01",
      endDate: "2025-08-06",
    },
    { number: "052", status: "available" },
    { number: "053", status: "available" },
    {
      number: "054",
      user: "전예진",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-2681-5397",
      startDate: "2025-10-15",
      endDate: "2025-11-15",
    },
    { number: "055", status: "available" },
    { number: "056", status: "available" },
    { number: "057", status: "available" },
    {
      number: "058",
      user: "노지현",
      status: "in-use",
      avatar: "/assets/images/user.jpg",
      phone: "010-3169-7840",
      startDate: "2025-09-15",
      endDate: "2025-11-04",
    },
    { number: "059", status: "available" },
    { number: "060", status: "unavailable" },
  ],
];

/* ======================================================================
   2️⃣ 상태 자동 업데이트 함수
   ----------------------------------------------------------------------
   🔁 autoUpdateLockerStatuses()
   - 회원/기간 데이터를 기반으로 D-day 계산 후 상태(status) 자동 갱신
   - in-use / reserved / expired / expiring-soon / available 자동 분류
   ====================================================================== */
function autoUpdateLockerStatuses(lockerRows) {
  const updated = lockerRows.map((row) =>
    row.map((locker) => {
      if (!locker || locker.status === "none") return locker;

      // 회원이 없는 경우 → available 유지
      if (!locker.user) {
        return { ...locker, status: locker.status || "available" };
      }

      // 날짜 없는 경우 → 상태 변경 없음
      if (!locker.startDate || !locker.endDate) return locker;

      // 날짜 기반 계산
      const { remainingDays, daysUntilStart } = calcRemainingDays(
        locker.startDate,
        locker.endDate
      );

      let newStatus;
      if (daysUntilStart > 0) newStatus = "reserved";
      else if (remainingDays < 0) newStatus = "expired";
      else if (remainingDays <= 7) newStatus = "expiring-soon";
      else newStatus = "in-use";

      return { ...locker, status: newStatus };
    })
  );
  return updated;
}

/* ======================================================================
   3️⃣ 날짜 계산 / 포맷 함수 모음
   ----------------------------------------------------------------------
   - calcRemainingDays() : D-day 계산
   - formatDday()        : 표시용 문자열 포맷
   - formatDate()        : yyyy-MM-dd → “yy년 MM월 dd일” 변환
   ====================================================================== */
function calcRemainingDays(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const remainingDays = Math.floor((end - today) / 86400000);
  const daysUntilStart = Math.floor((start - today) / 86400000);

  return { totalDays, remainingDays, daysUntilStart, start, end };
}

/**
 * D-day 텍스트 포맷팅
 */
function formatDday(startDate, endDate) {
  const { remainingDays, daysUntilStart } = calcRemainingDays(
    startDate,
    endDate
  );
  if (daysUntilStart > 0) return `예약 D-${daysUntilStart}`;
  if (remainingDays === 0) return `D-0`;
  if (remainingDays < 0) return `D+${Math.abs(remainingDays)}`;
  return `D-${remainingDays}`;
}

/**
 * 날짜 출력 포맷
 */
function formatDate(d) {
  return `${String(d.getFullYear()).slice(2)}년 ${String(
    d.getMonth() + 1
  ).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일`;
}

/* ======================================================================
   4️⃣ 락커 카드 생성
   ----------------------------------------------------------------------
   - createLockerCard() : 락커 객체를 HTML 카드로 변환
   - 상태별 버튼 및 표시 요소 자동 삽입
   ====================================================================== */
function createLockerCard(locker) {
  if (!locker) return "";
  if (locker.status === "none")
    return `<div class="locker-card locker--none"></div>`;

  const { number, status, user, startDate, endDate } = locker;
  const phone = locker.phone || "";
  const ddayText = startDate && endDate ? formatDday(startDate, endDate) : "";

  let html = `<div class="locker-card locker--${status}" data-locker="${number}" data-phone="${phone}">`;
  html += `<ul class="name"><li class="locker-name">${number}</li>${
    user ? `<li class="user-name">${user}</li>` : ""
  }</ul>`;

  // 상태별 내부 표시 분기
  if (status === "available") {
    html += `<div class="locker-assign-open-btn"><div class="icon--plus icon"></div><div>회원 배정</div></div>`;
  } else if (status === "unavailable") {
    html += `<div class="detail"></div><div class="x-mark"></div>`;
  } else if (ddayText) {
    html += `<div class="detail">${ddayText}</div>`;
  }
  html += `</div>`;
  return html;
}

/* ======================================================================
   5️⃣ 락커 레이아웃 렌더링
   ----------------------------------------------------------------------
   - renderLockerLayout()
   - lockerRows 데이터를 HTML로 변환하여 .locker-card-wrap에 출력
   - 렌더 완료 시 “lockerRenderComplete” 이벤트 발생
   ====================================================================== */
function renderLockerLayout(container, rows = lockerRows) {
  const html = rows
    .map(
      (r) => `<div class="locker-row">${r.map(createLockerCard).join("")}</div>`
    )
    .join("");
  container.innerHTML = html;
  document.dispatchEvent(new Event("lockerRenderComplete"));
}

/* ======================================================================
   6️⃣ 상태별 상세 팝오버 템플릿 생성
   ----------------------------------------------------------------------
   🔧 createPopoverTemplates()
   - reserved, in-use, expiring-soon, expired, available, unavailable
     → 총 6가지 상태별 템플릿 자동 생성
   - “available” 상태에는 회원 배정(assign) 뷰 포함
   - 각 팝오버는 aside.locker-detail-popover 형태로 생성됨
   ====================================================================== */
function createPopoverTemplates() {
  const statuses = [
    "reserved",
    "in-use",
    "expiring-soon",
    "expired",
    "available",
    "unavailable",
  ];

  return statuses
    .map((s) => {
      // 상단 버튼: 상태별로 다른 기능 버튼 표시
      const headerBtns =
        s === "available"
          ? `
            <button class="btn--icon-utility locker-history-open-btn"
              data-tooltip="이용 내역, 사용불가 설정"
              data-tooltip-direction="bottom"
              aria-label="더보기 (이용 내역, 사용불가 설정)">
              <div class="icon--dots-three icon"></div>
            </button>
            <button class="btn--icon-utility x-btn" aria-label="닫기">
              <div class="icon--x icon"></div>
            </button>`
          : `
            <button class="btn--icon-utility locker-history-open-btn"
              data-tooltip="이용 내역"
              data-tooltip-direction="bottom"
              aria-label="이용 내역 열기">
              <div class="icon--list-bullets icon"></div>
            </button>
            <button class="btn--icon-utility x-btn" aria-label="닫기">
              <div class="icon--x icon"></div>
            </button>`;

      // 하단 버튼: 상태별로 기능 분기
      const footerBtns =
        s === "available"
          ? `<button class="btn btn--solid btn--secondary btn--small locker-assign-open-btn">
              <div class="icon--plus icon"></div><div>회원 배정</div>
            </button>`
          : s === "unavailable"
          ? `<button class="btn btn--solid btn--neutral btn--small locker-assign-open-btn">
              <div class="icon--arrow-clockwise icon"></div><div>사용불가 해제</div>
            </button>`
          : `<button class="btn btn--outlined btn--neutral btn--small">기간수정</button>
             <button class="btn btn--outlined btn--neutral btn--small">재등록</button>
             <button class="btn btn--outlined btn--neutral btn--small">자리이동</button>
             <button class="btn btn--outlined btn--neutral btn--small">회수</button>`;

      // 상태별 팝오버 구조 본문
      return `
        <aside class="locker-detail-popover locker-detail-popover--${s}" data-status="locker--${s}" hidden>
          <div class="locker-detail-popover__header">
            <div class="locker-detail-popover__locker-name"></div>
            <div class="locker-detail-popover__header-btns">${headerBtns}</div>
          </div>

          ${
            s === "available"
              ? `
              <!-- ✅ 사용 가능 상태 (회원 배정 / assign 뷰 포함) -->
              <div class="locker-detail-popover__body locker-detail-popover__body--available">
                <div class="locker-detail-popover__memo">
                  <div id="locker-detail-popover__field--memo-${s}"></div>
                </div>
                <div class="locker-detail-popover__footer">
                  <button class="btn btn--solid btn--secondary btn--small locker-assign-open-btn">
                    <div class="icon--plus icon"></div><div>회원 배정</div>
                  </button>
                </div>
              </div>

              <!-- 회원 배정(assign) 뷰 -->
              <div class="locker-detail-popover__body locker-detail-popover__body--assign hidden">
                <div class="locker-detail-popover__body-field">
                  <div id="locker-detail-popover__user-dropdown"></div>
                  <section class="locker-detail-popover__membership-card-wrap hidden">
                    <div class="locker-detail-popover__membership-card-label">이용권</div>
                    <div class="locker-detail-popover__membership-card"></div>
                  </section>
                </div>
                <div class="locker-detail-popover__footer hidden">
                  <button class="btn btn--solid btn--primary btn--medium">저장하기</button>
                </div>
              </div>`
              : `
              <!-- ✅ 나머지 상태 (in-use / expired 등) -->
              <div class="locker-detail-popover__body">
                <div class="locker-detail-popover__body-main">
                  <div class="locker-detail-popover__user">
                    <div class="locker-detail-popover__user-avatar"></div>
                    <div class="locker-detail-popover__user-detail">
                      <div class="locker-detail-popover__user-name"></div>
                      <div class="locker-detail-popover__user-phone"></div>
                    </div>
                  </div>
                  <div class="locker-detail-popover__status"></div>
                </div>
                <div class="locker-detail-popover__memo">
                  <div id="locker-detail-popover__field--memo-${s}"></div>
                </div>
                <div class="locker-detail-popover__footer">${footerBtns}</div>
              </div>`
          }
        </aside>`;
    })
    .join("");
}

/* ======================================================================
   7️⃣ 상태 표시 렌더링
   ----------------------------------------------------------------------
   🔧 renderLockerStatus()
   - 선택된 락커의 상태, 남은 기간, 이용 기간 표시
   - calcRemainingDays() 결과 기반으로 상태별 문구 출력
   ====================================================================== */
function renderLockerStatus(popover, data) {
  const container = popover.querySelector(".locker-detail-popover__status");
  if (!container) return;

  const { totalDays, remainingDays, daysUntilStart, start, end } =
    calcRemainingDays(data.startDate, data.endDate);

  let remainDisplay = "";
  let stateHTML = "";

  if (daysUntilStart > 0) {
    // 📅 예약 상태
    remainDisplay = `<span>${totalDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--reserved">${daysUntilStart}일 후 시작</span>`;
  } else if (remainingDays < 0) {
    // 📅 기간 초과
    const overDays = Math.abs(remainingDays);
    remainDisplay = `<span>0일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--expired">${overDays}일 초과</span>`;
  } else if (remainingDays <= 7) {
    // 📅 만료 임박
    remainDisplay = `<span>${remainingDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--expiring-soon">${remainingDays}일 후 만료</span>`;
  } else {
    // 📅 사용 중
    remainDisplay = `<span>${remainingDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--in-use">사용중</span>`;
  }

  // 🧩 상태 HTML 렌더링
  container.innerHTML = `
    <div class="locker-detail-popover__status-row">
      <div class="locker-detail-popover__status-label">상태</div>
      <div class="locker-detail-popover__status-value">${stateHTML}</div>
    </div>
    <div class="locker-detail-popover__status-row">
      <div class="locker-detail-popover__status-label">남은기간</div>
      <div class="locker-detail-popover__status-value remaining-period">${remainDisplay}</div>
    </div>
    <div class="locker-detail-popover__status-row">
      <div class="locker-detail-popover__status-label">이용기간</div>
      <div class="locker-detail-popover__status-value">
        ${formatDate(start)} ~ ${formatDate(end)}
      </div>
    </div>`;
}

/* ======================================================================
   8️⃣ 메모 필드 초기화
   ----------------------------------------------------------------------
   🔧 initMemoFields()
   - 상태별로 textarea 타입의 메모 입력 필드 자동 생성
   - createTextField()를 통해 일관된 스타일 유지
   ====================================================================== */
function initMemoFields() {
  const statuses = [
    "reserved",
    "in-use",
    "expiring-soon",
    "expired",
    "available",
    "unavailable",
  ];

  statuses.forEach((s) => {
    const container = document.querySelector(
      `#locker-detail-popover__field--memo-${s}`
    );
    if (!container) return;

    container.innerHTML = createTextField({
      id: `textarea-small-popover-memo-${s}`,
      variant: "textarea",
      size: "small",
      placeholder: "메모",
    });
  });
}

/* ======================================================================
   9️⃣ 팝오버 열기 / 닫기 / 위치 계산
   ----------------------------------------------------------------------
   🔧 openPopover()       : 카드 클릭 시 상태별 팝오버 열기
   🔧 positionPopover()   : 카드 위치 기준 좌/우 자동 배치
   🔧 closePopover()      : 현재 활성화된 팝오버 닫기
   ====================================================================== */

let activePopover = null; // 현재 열린 팝오버 DOM
let activeCard = null; // 현재 선택된 락커 카드 DOM

/**
 * 📦 공용 팝오버 오픈
 * -------------------------------------------------------
 * - 카드 클릭 시 해당 락커의 상태에 맞는 팝오버 생성
 * - 회원 배정 버튼 클릭 시 assign 뷰 전용으로 전환 가능
 */
function openPopover(card, openAssignView = false) {
  const lockerNumber = card.dataset.locker;
  const lockerData = lockerRows.flat().find((l) => l.number === lockerNumber);
  if (!lockerData) return;

  // 기존 팝오버 닫기
  closePopover();

  // 회원 배정 버튼 직접 클릭 → assign 뷰 오픈
  if (openAssignView && lockerData.status === "available") {
    openAssignPopover(card);
    return;
  }

  // 상태별 팝오버 템플릿 복제
  const popover = document
    .querySelector(
      `.locker-detail-popover[data-status='locker--${lockerData.status}']`
    )
    ?.cloneNode(true);
  if (!popover) return;

  popover.hidden = false;
  popover.classList.add("is-active", "visible");
  document.body.appendChild(popover);

  // 위치 계산 (렌더 후 실행)
  requestAnimationFrame(() => positionPopover(popover, card));

  // --------------------------
  // ✅ 데이터 세팅
  // --------------------------
  const nameEl = popover.querySelector(".locker-detail-popover__locker-name");
  if (nameEl) nameEl.textContent = lockerNumber;

  const userEl = popover.querySelector(".locker-detail-popover__user-name");
  const phoneEl = popover.querySelector(".locker-detail-popover__user-phone");
  const avatarEl = popover.querySelector(".locker-detail-popover__user-avatar");

  if (lockerData.user) {
    userEl.textContent = lockerData.user;
    phoneEl.textContent = lockerData.phone || "";
    if (avatarEl && lockerData.avatar)
      avatarEl.style.backgroundImage = `url(${lockerData.avatar})`;
  } else {
    if (userEl) userEl.textContent = "";
    if (phoneEl) phoneEl.textContent = "";
    if (avatarEl) avatarEl.style.display = "none";
  }

  // --------------------------
  // ✅ 상태 표시 (상태 박스 렌더링)
  // --------------------------
  if (
    lockerData.status === "available" ||
    lockerData.status === "unavailable"
  ) {
    const statusBox = popover.querySelector(".locker-detail-popover__status");
    if (statusBox) {
      statusBox.innerHTML = `
        <div class="locker-detail-popover__status-row">
          <div class="locker-detail-popover__status-label">상태</div>
          <div class="locker-detail-popover__status-value">
            <span class="locker-state locker-state--${lockerData.status}">
              ${lockerData.status === "available" ? "사용 가능" : "사용 불가"}
            </span>
          </div>
        </div>`;
    }
  } else {
    renderLockerStatus(popover, lockerData);
  }

  // --------------------------
  // ✅ 닫기 버튼
  // --------------------------
  popover.querySelector(".x-btn")?.addEventListener("click", closePopover);

  // --------------------------
  // ✅ 회원 배정 버튼 → assign 뷰 전환
  // --------------------------
  const assignBtn = popover.querySelector(".locker-assign-open-btn");
  if (assignBtn) {
    assignBtn.addEventListener("click", () => {
      const availableBody = popover.querySelector(
        ".locker-detail-popover__body--available"
      );
      const assignBody = popover.querySelector(
        ".locker-detail-popover__body--assign"
      );
      if (!assignBody || !availableBody) return;

      availableBody.classList.add("fade-out");
      setTimeout(() => {
        availableBody.classList.add("hidden");
        assignBody.classList.remove("hidden");
        switchToAssignView(popover);
      }, 200);
    });
  }

  activePopover = popover;
  activeCard = card;
  card.classList.add("locker-card--active");
}

/**
 * 📍 팝오버 위치 계산
 * -------------------------------------------------------
 * - 카드의 화면 좌표를 기준으로 좌우 판단
 * - 화면 밖으로 넘치지 않도록 최소/최대 보정
 */
function positionPopover(popover, card) {
  if (!popover || !card) return;

  const rect = card.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  const popoverWidth = popover.offsetWidth || 310;
  const popoverHeight = popover.offsetHeight || 260;
  const isRight = rect.left + rect.width / 2 > window.innerWidth / 2;

  const left = isRight
    ? rect.left + scrollLeft - popoverWidth - 8
    : rect.right + scrollLeft + 8;

  const rawTop = rect.top + scrollTop;
  const maxTop = scrollTop + window.innerHeight - popoverHeight - 8;
  const top = Math.min(rawTop, maxTop);

  Object.assign(popover.style, {
    position: "absolute",
    left: `${Math.max(
      8,
      Math.min(left, window.innerWidth - popoverWidth - 8)
    )}px`,
    top: `${Math.max(8, top)}px`,
    zIndex: 1000,
  });

  popover.classList.add(isRight ? "left" : "right");
}

/**
 * ❌ 팝오버 닫기
 * -------------------------------------------------------
 * - 활성화된 팝오버 및 카드 상태 초기화
 * - 드롭다운 메뉴도 함께 닫음
 */
function closePopover() {
  if (activePopover) activePopover.remove();
  activeCard?.classList.remove("locker-card--active");
  activePopover = null;
  activeCard = null;
  closeAllDropdowns();
}

/* ======================================================================
   🔸 드롭다운 및 팝오버 외부 클릭 닫기 (전역 처리)
   ====================================================================== */
// 드롭다운 외부 클릭 시 닫기
document.addEventListener("click", (e) => {
  const openMenus = document.querySelectorAll(".dropdown__menu.visible");
  if (openMenus.length === 0) return;
  if (e.target.closest(".dropdown__toggle, .dropdown__menu")) return;
  openMenus.forEach(() => closeAllDropdowns());
});

// 팝오버 외부 클릭 시 닫기
document.addEventListener(
  "click",
  (e) => {
    if (
      !activePopover ||
      activePopover.contains(e.target) ||
      activeCard?.contains(e.target) ||
      e.target.closest(".dropdown, .dropdown__menu, .dropdown__toggle")
    )
      return;
    closePopover();
  },
  true
);

/* ======================================================================
   🔟 회원 배정(assign) 전용 팝오버
   ----------------------------------------------------------------------
   🔧 openAssignPopover()
   - 사용 가능(available) 상태의 카드에서만 실행
   - 회원 선택 → 이용권 표시까지 단독 뷰로 구성
   ====================================================================== */
function openAssignPopover(card) {
  const lockerNumber = card.dataset.locker;
  const lockerData = lockerRows.flat().find((l) => l.number === lockerNumber);
  if (!lockerData) return;

  // 기존 팝오버 닫기
  closePopover();

  // 템플릿 복제
  const baseTemplate = document.querySelector(
    `.locker-detail-popover[data-status='locker--available']`
  );
  if (!baseTemplate) return;

  const popover = baseTemplate.cloneNode(true);
  popover.hidden = false;
  popover.classList.add("is-active", "visible", "assign-view");
  document.body.appendChild(popover);

  // 헤더 락커번호 표시
  const nameEl = popover.querySelector(".locker-detail-popover__locker-name");
  if (nameEl) nameEl.textContent = lockerNumber;

  // 유저 정보 숨김
  const userDetail = popover.querySelector(".locker-detail-popover__user");
  if (userDetail) userDetail.style.display = "none";

  // 닫기 버튼
  popover.querySelector(".x-btn")?.addEventListener("click", closePopover);

  // 내부 드롭다운 외부 클릭 시 메뉴 닫기
  popover.addEventListener("click", (e) => {
    if (e.target.closest(".dropdown__toggle, .dropdown__menu.visible")) return;
    closeAllDropdowns();
  });

  // assign 뷰 활성화
  requestAnimationFrame(() => {
    switchToAssignView(popover);
    positionPopover(popover, card);
  });

  // 활성 상태 기록
  activePopover = popover;
  activeCard = card;
  card.classList.add("locker-card--active");
}

/* ======================================================================
   11️⃣ assign 뷰 전환 및 드롭다운 초기화
   ----------------------------------------------------------------------
   🔧 switchToAssignView()
   - available → assign 뷰로 UI 전환
   - initLockerDropdown() 호출로 회원 드롭다운 초기화
   ====================================================================== */
function switchToAssignView(popover) {
  const availableBody = popover.querySelector(
    ".locker-detail-popover__body--available"
  );
  const assignBody = popover.querySelector(
    ".locker-detail-popover__body--assign"
  );

  if (!assignBody) {
    console.warn("assign 뷰를 찾을 수 없습니다.");
    return;
  }

  if (availableBody) availableBody.classList.add("hidden");
  assignBody.classList.remove("hidden");

  // 드롭다운 초기화 약간 지연 (애니메이션 보장)
  setTimeout(() => initLockerDropdown(assignBody), 80);
}

/* ======================================================================
   12️⃣ assign 뷰 내부 구성요소 초기화
   ----------------------------------------------------------------------
   🔧 initLockerDropdown()
   - 회원 선택 드롭다운 + 이용권 카드 렌더링
   - 회원 선택 시 → locker 상품 자동 표시
   ====================================================================== */
function initLockerDropdown(container) {
  const dropdownContainer = container.querySelector(
    "#locker-detail-popover__user-dropdown"
  );
  if (!dropdownContainer) return;

  // 텍스트필드 (드롭다운형)
  dropdownContainer.innerHTML = createTextField({
    id: "locker-detail-popover__dropdown-member",
    variant: "dropdown",
    size: "small",
    label: "회원",
    placeholder: "회원을 선택해주세요",
    dirty: true,
  });

  const dropdownToggle = dropdownContainer.querySelector(".dropdown__toggle");
  if (!dropdownToggle) return;

  // 회원 샘플 데이터
  const memberItems = [
    {
      title: "서지호",
      subtitle: "010-1234-5678",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "김태형",
      subtitle: "010-5678-1122",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "이정민",
      subtitle: "010-9876-5432",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "최윤",
      subtitle: "010-1111-2222",
      avatar: "/assets/images/user.jpg",
    },
  ];

  // 드롭다운 메뉴 생성
  const menuId = `dropdown-menu-${dropdownToggle.id || "member"}`;
  dropdownToggle.setAttribute("data-dropdown-target", menuId);
  dropdownToggle.setAttribute("aria-controls", menuId);

  const menu = createDropdownMenu({
    id: menuId,
    size: "small",
    withSearch: true,
    withAvatar: true,
    withSubtitle: true,
    items: memberItems,
  });

  const wrapper = dropdownContainer.querySelector(".text-field__wrapper");
  wrapper.classList.add("dropdown");
  wrapper.appendChild(menu);

  // 초기화
  requestAnimationFrame(() => {
    initializeDropdownSearch(menu);
    initializeDropdown(wrapper);
  });

  // 회원 선택 시 → 이용권 카드 렌더링
  const membershipWrap = container.querySelector(
    ".locker-detail-popover__membership-card-wrap"
  );
  const membershipCard = container.querySelector(
    ".locker-detail-popover__membership-card"
  );
  const footer = container.querySelector(
    ".locker-detail-popover__body--assign .locker-detail-popover__footer"
  );

  dropdownToggle.addEventListener("dropdown:change", () => {
    membershipWrap?.classList.remove("hidden");
    footer?.classList.remove("hidden");

    // 락커 상품 카드 (샘플)
    const lockerProducts = [
      {
        id: "locker-assign-card-001",
        type: "locker",
        name: "락커 이용권",
        startDate: "2026.01.01",
        endDate: "2026.12.31",
        info: {
          duration: "1일",
          number: "-",
        },
        withCheckbox: true,
        checked: true,
        popover: false,
      },
    ];

    membershipCard.innerHTML = lockerProducts
      .map((product) => createProductCard(product).cardHtml)
      .join("");

    const popover = activePopover;
    if (popover) {
      popover.style.width = "390px";

      requestAnimationFrame(() => {
        positionPopover(popover, activeCard);
      });
    }
  });
}

/* ======================================================================
   13️⃣ 초기 실행 (DOMContentLoaded)
   ----------------------------------------------------------------------
   - 상태 자동 업데이트 → 레이아웃 렌더링
   - 팝오버 템플릿 / 메모 필드 / 이벤트 바인딩 일괄 초기화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ 락커 상태 자동 갱신
  const updatedLockerRows = autoUpdateLockerStatuses(lockerRows);

  // 2️⃣ 레이아웃 렌더링
  const container = document.querySelector(".locker-card-wrap");
  if (!container) return;
  renderLockerLayout(container, updatedLockerRows);

  // 3️⃣ 팝오버 템플릿 최초 삽입
  if (!document.querySelector(".locker-detail-popover")) {
    document.body.insertAdjacentHTML("beforeend", createPopoverTemplates());
  }

  // 4️⃣ 메모 필드 초기화
  initMemoFields();

  // 5️⃣ 카드 클릭 시 → 상태별 팝오버 열기
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".locker-card");
    if (!card) return;
    const assignBtn = e.target.closest(".locker-assign-open-btn");
    if (assignBtn) openPopover(card, true);
    else openPopover(card, false);
  });
});
