import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import {
  closeAllDropdowns,
  initializeDropdown,
} from "../../components/dropdown/dropdown-init.js";
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";
import "../../components/dropdown/dropdown.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

/* =========================================================
   1️⃣ 락커 데이터 (총 60개)
   ---------------------------------------------------------
   - 2차원 배열 형태로 각 행(row) 구성
   - 각 객체는 락커 번호, 상태, 사용자 정보, 이용 기간 등을 포함
   - status:
       available       → 사용 가능
       unavailable     → 사용 불가
       in-use          → 사용 중
       reserved        → 예약됨 (시작 전)
       expired         → 만료됨
       expiring-soon   → 만료 임박
       none            → 비어 있는 빈칸
   ========================================================= */
const lockerRows = [
  [
    { number: "000", status: "unavailable" },
    {
      number: "001",
      status: "in-use",
      user: "강수미",
      avatar: "/assets/images/user.jpg",
      phone: "010-6427-3912",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
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

/* =========================================================
   🔁 락커 상태 자동 업데이트 (회원/날짜 기반 통합)
   ---------------------------------------------------------
   - 회원 데이터 및 날짜(start/end) 기준으로 상태를 자동 계산
   - D-day 로직에 따라 reserved / expired / expiring-soon / in-use 등으로 변환
   ========================================================= */
function autoUpdateLockerStatuses(lockerRows) {
  const updated = lockerRows.map((row) =>
    row.map((locker) => {
      if (!locker || locker.status === "none") return locker;

      // 회원이 없는 락커는 상태 유지 (기본 available)
      if (!locker.user) {
        return { ...locker, status: locker.status || "available" };
      }

      // 회원이 있는 락커 → 날짜 기반 자동 계산
      if (!locker.startDate || !locker.endDate) return locker;

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

/* =========================================================
   2️⃣ 날짜 계산 / D-day 표시
   ---------------------------------------------------------
   - D-day 계산 (calcRemainingDays)
   - D-day 포맷 변환 (formatDday)
   - 날짜 포맷팅 (formatDate)
   ========================================================= */
function calcRemainingDays(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시각 무시 (자정 기준)

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const remainingDays = Math.floor((end - today) / 86400000);
  const daysUntilStart = Math.floor((start - today) / 86400000);

  return { totalDays, remainingDays, daysUntilStart, start, end };
}

function formatDday(startDate, endDate) {
  const { remainingDays, daysUntilStart } = calcRemainingDays(
    startDate,
    endDate
  );

  if (daysUntilStart > 0) return `예약 D-${daysUntilStart}`; // 예정
  if (remainingDays === 0) return `D-0`; // 오늘까지
  if (remainingDays < 0) return `D+${Math.abs(remainingDays)}`; // 초과
  return `D-${remainingDays}`; // 사용중
}

function formatDate(d) {
  return `${String(d.getFullYear()).slice(2)}년 ${String(
    d.getMonth() + 1
  ).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일`;
}

/* =========================================================
   3️⃣ 카드 생성 (D-day / 전화번호 자동)
   ---------------------------------------------------------
   - locker 객체를 기반으로 상태별 HTML 카드 생성
   - none 상태 → 빈 div로 표시
   ========================================================= */
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

/* =========================================================
   4️⃣ 락커 레이아웃 렌더링
   ---------------------------------------------------------
   - lockerRows 데이터를 기반으로 .locker-card-wrap 내부에 행 단위 렌더
   - 렌더 완료 후 "lockerRenderComplete" 이벤트 디스패치
   ========================================================= */
function renderLockerLayout(container, rows = lockerRows) {
  const html = rows
    .map(
      (r) => `<div class="locker-row">${r.map(createLockerCard).join("")}</div>`
    )
    .join("");
  container.innerHTML = html;
  document.dispatchEvent(new Event("lockerRenderComplete"));
}

/* =========================================================
   5️⃣ 팝오버 템플릿 생성 (모든 상태)
   ---------------------------------------------------------
   - 6가지 상태(reserved, in-use, expiring-soon, expired, available, unavailable)
     별로 aside.popover 템플릿 자동 생성
   - available: 회원 배정 / 메모 / assign 뷰 포함
   - unavailable: “사용불가 해제” 버튼
   - 나머지 상태: 이용 정보 + 기간 수정 등
   ========================================================= */
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
      // 상단 버튼: 상태별 다름
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

      // 하단 버튼 (상태별)
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

      // 상태별 팝오버 구조
      return `
        <aside class="locker-detail-popover locker-detail-popover--${s}" data-status="locker--${s}" hidden>
          <div class="locker-detail-popover__header">
            <div class="locker-detail-popover__locker-name"></div>
            <div class="locker-detail-popover__header-btns">${headerBtns}</div>
          </div>

          ${
            s === "available"
              ? `
              <!-- 사용 가능 상태 -->
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

              <!-- assign 뷰 -->
              <div class="locker-detail-popover__body locker-detail-popover__body--assign hidden">
                <div class="locker-detail-popover__body-field">
                  <div id="locker-detail-popover__user-dropdown"></div>
                  <section class="locker-detail-popover__membership-card-wrap hidden">
                    <div class="locker-detail-popover__membership-card-label">
                      이용권 (카드 컴포넌트 제작 후 수정 예정)
                    </div>
                    <div class="locker-detail-popover__membership-card"></div>
                  </section>
                </div>
                <div class="locker-detail-popover__footer hidden">
                  <button class="btn btn--solid btn--primary btn--medium">저장하기</button>
                </div>
              </div>
              `
              : `
              <!-- 나머지 상태 -->
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
                <div class="locker-detail-popover__footer">
                  ${footerBtns}
                </div>
              </div>
              `
          }
        </aside>`;
    })
    .join("");
}

/* =========================================================
   6️⃣ 상태 렌더링
   ---------------------------------------------------------
   - 선택된 락커의 상태·잔여기간·이용기간 표시
   - calcRemainingDays() 결과를 기반으로 UI 업데이트
   ========================================================= */
function renderLockerStatus(popover, data) {
  const container = popover.querySelector(".locker-detail-popover__status");
  if (!container) return;
  const { totalDays, remainingDays, daysUntilStart, start, end } =
    calcRemainingDays(data.startDate, data.endDate);

  let remainDisplay = "";
  let stateHTML = "";

  if (daysUntilStart > 0) {
    // 예약 상태
    remainDisplay = `<span>${totalDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--reserved">${daysUntilStart}일 후 시작</span>`;
  } else if (remainingDays < 0) {
    // 기간 초과
    const overDays = Math.abs(remainingDays);
    remainDisplay = `<span>0일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--expired">${overDays}일 초과</span>`;
  } else if (remainingDays <= 7) {
    // 만료 임박
    remainDisplay = `<span>${remainingDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--expiring-soon">${remainingDays}일 후 만료</span>`;
  } else {
    // 사용 중
    remainDisplay = `<span>${remainingDays}일</span> / ${totalDays}일`;
    stateHTML = `<span class="locker-state locker-state--in-use">사용중</span>`;
  }

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
      <div class="locker-detail-popover__status-value">${formatDate(
        start
      )} ~ ${formatDate(end)}</div>
    </div>`;
}

/* =========================================================
   7️⃣ 메모 필드 초기화
   ---------------------------------------------------------
   - 상태별 textarea 필드 자동 생성
   - createTextField() 사용
   ========================================================= */
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

/* =========================================================
   8️⃣ 팝오버 열기 / 닫기 / 위치 계산
   ---------------------------------------------------------
   - openPopover(): 기본 상세 뷰 열기
   - positionPopover(): 좌우 자동 판단
   - closePopover(): 활성 팝오버 제거
   ========================================================= */
let activePopover = null;
let activeCard = null;

/**
 * 공용 팝오버 오픈
 */
function openPopover(card, openAssignView = false) {
  const lockerNumber = card.dataset.locker;
  const lockerData = lockerRows.flat().find((l) => l.number === lockerNumber);
  if (!lockerData) return;

  // 기존 팝오버 닫기
  closePopover();

  // 사용 가능 상태 + 회원 배정 버튼 직접 클릭 시
  if (openAssignView && lockerData.status === "available") {
    openAssignPopover(card);
    return;
  }

  // 템플릿 복제
  const popover = document
    .querySelector(
      `.locker-detail-popover[data-status='locker--${lockerData.status}']`
    )
    ?.cloneNode(true);
  if (!popover) return;

  popover.hidden = false;
  popover.classList.add("is-active", "visible");
  document.body.appendChild(popover);

  // 위치 계산 (렌더 후)
  requestAnimationFrame(() => positionPopover(popover, card));

  // 데이터 세팅
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

  // 상태 표시
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

  // 닫기 버튼
  popover.querySelector(".x-btn")?.addEventListener("click", closePopover);

  // 회원 배정 버튼 → assign 뷰 전환
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
 * 팝오버 위치 계산
 */
function positionPopover(popover, card) {
  if (!popover || !card) return;

  const rect = card.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  const popoverWidth = 310;
  const popoverHeight = popover.offsetHeight > 0 ? popover.offsetHeight : 260;
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
 * 팝오버 닫기
 */
function closePopover() {
  if (activePopover) activePopover.remove();
  activeCard?.classList.remove("locker-card--active");
  activePopover = null;
  activeCard = null;
  closeAllDropdowns();
}

/* =========================================================
   드롭다운 외부 클릭 → 닫기 (모든 팝오버 공용)
   ========================================================= */
document.addEventListener("click", (e) => {
  const openMenus = document.querySelectorAll(".dropdown__menu.visible");
  if (openMenus.length === 0) return;
  if (e.target.closest(".dropdown__toggle, .dropdown__menu")) return;
  openMenus.forEach(() => closeAllDropdowns());
});

/**
 * 외부 클릭 시 팝오버 닫기
 */
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

/* =========================================================
   회원 배정 전용 팝오버 (안정화 완전판)
   ---------------------------------------------------------
   - openAssignPopover(): 회원 배정 UI 단독 오픈
   ========================================================= */
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

  // 헤더 번호 세팅
  const nameEl = popover.querySelector(".locker-detail-popover__locker-name");
  if (nameEl) nameEl.textContent = lockerNumber;

  // 유저 정보 숨김
  const userDetail = popover.querySelector(".locker-detail-popover__user");
  if (userDetail) userDetail.style.display = "none";

  // 닫기 버튼
  popover.querySelector(".x-btn")?.addEventListener("click", closePopover);

  // 내부 드롭다운 외부 클릭 닫기
  popover.addEventListener("click", (e) => {
    if (e.target.closest(".dropdown__toggle, .dropdown__menu.visible")) return;
    closeAllDropdowns();
  });

  // assign 뷰 전환
  requestAnimationFrame(() => {
    switchToAssignView(popover);
    positionPopover(popover, card);
  });

  // 활성화 상태 업데이트
  activePopover = popover;
  activeCard = card;
  card.classList.add("locker-card--active");
}

/* =========================================================
   9️⃣ assign 뷰 + 드롭다운 초기화
   ---------------------------------------------------------
   - assign 뷰로 전환 및 필요한 필드 초기화
   ========================================================= */
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

  // 드롭다운 초기화
  setTimeout(() => initLockerDropdown(assignBody), 80);
}

/* =========================================================
   assign 뷰 내부 드롭다운 + 이용권 카드 초기화
   ========================================================= */
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

  // 회원 데이터 샘플
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

  // 메뉴 생성
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

  requestAnimationFrame(() => {
    initializeDropdownSearch(menu);
    initializeDropdown(wrapper);
  });

  // 회원 선택 시 → 이용권 카드 표시
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

    membershipCard.innerHTML = `
      <div class="product-card-list">
        <div class="product-card product-card--locker checked">
          <div class="checkbox-set checkbox--icon-only-medium"><input type="checkbox" checked /></div>
          <div>
            <ul class="product-card__top">
              <div class="product-card__name-wrap">
                <li class="product-card__name">12개월</li>
                <li class="product-card__type">락커</li>
              </div>
              <p class="product-card__date">2025.01.01 ~ 2025.12.31</p>
            </ul>
          </div>
          <div class="product-card__bottom locker">
            <ul class="product-card__info"><li class="product-card__duration">100일 남음</li></ul>
          </div>
        </div>
      </div>
    `;
  });
}

/* =========================================================
   🔟 초기 실행 (DOM 로드 후)
   ---------------------------------------------------------
   - 상태 업데이트 → 렌더링 → 팝오버 템플릿 삽입 → 메모필드 초기화
   - 카드 클릭 → openPopover()
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const updatedLockerRows = autoUpdateLockerStatuses(lockerRows);
  const container = document.querySelector(".locker-card-wrap");
  if (!container) return;

  renderLockerLayout(container, updatedLockerRows);

  // 팝오버 템플릿 append (최초 1회)
  if (!document.querySelector(".locker-detail-popover"))
    document.body.insertAdjacentHTML("beforeend", createPopoverTemplates());

  initMemoFields();

  // 카드 클릭 → 팝오버 오픈
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".locker-card");
    if (!card) return;
    const assignBtn = e.target.closest(".locker-assign-open-btn");
    if (assignBtn) openPopover(card, true);
    else openPopover(card, false);
  });
});
