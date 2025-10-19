import { createPagination } from "../../components/button/create-pagination.js";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

/* ==========================
   회원 테이블 행 생성
   ========================== */
function renderUserRows() {
  const tableWrap = document.querySelector(".user-management__table-wrap");
  if (!tableWrap) return;

  // 기존 body 제거 (리렌더링 시 중복 방지)
  tableWrap
    .querySelectorAll(".user-management__table--body")
    .forEach((el) => el.remove());

  /* --------------------------
     회원 데이터 (data)
  -------------------------- */
  const data = [
    {
      name: "이소이",
      phone: "010-1234-5678",
      status: "유효",
      gender: "여성",
      age: "25세",
      address: "부산시 해운대구",
      products: {
        membership: ["12개월", "PT 1개월"],
        locker: ["12개월"],
        wear: ["12개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "30일",
      remainingCount: [
        { type: "예약", count: 50 },
        { type: "출석", count: 132 },
      ],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "5678",
      staff: "이휘경",
      receivables: "10,000원",
      totalPayment: "1,300,000원",
      totalRefund: "20,000원",
      attendanceCount: "110회",
      appLinked: true,
      appAccount: "sososo2@naver.com",
      memo: "락커 1개월 서비스 필요",
    },
    {
      name: "강수미",
      phone: "010-2342-9382",
      status: "미등록",
      gender: "여성",
      age: "25세",
      address: "부산시 동래구",
      products: {},
      startDate: "",
      endDate: "",
      remainingDays: "",
      remainingCount: [],
      lastPaymentDate: "",
      lastVisitDate: "",
      userId: "9382",
      staff: "",
      receivables: "",
      totalPayment: "",
      totalRefund: "",
      attendanceCount: "",
      appLinked: false,
      appAccount: "",
      memo: "",
    },
    {
      name: "김지우",
      phone: "010-7269-2449",
      status: "홀딩",
      gender: "남성",
      age: "37세",
      address: "서울시 마포구",
      products: {
        membership: ["3개월", "PT 1개월"],
        locker: ["1개월"],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "54일",
      remainingCount: [
        { type: "예약", count: 47 },
        { type: "출석", count: "무제한" },
      ],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "2449",
      staff: "이휘경",
      receivables: "",
      totalPayment: "1,000,000원",
      totalRefund: "",
      attendanceCount: "40회",
      appLinked: false,
      appAccount: "",
      memo: "조심스러운 고객",
    },
    {
      name: "박서연",
      phone: "010-1075-9873",
      status: "만료임박",
      gender: "남성",
      age: "29세",
      address: "서울시 강남구",
      products: {
        membership: ["1개월"],
        locker: ["1개월"],
        wear: ["1개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "5일",
      remainingCount: [{ type: "예약", count: 7 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "9873",
      staff: "",
      receivables: "",
      totalPayment: "300,000원",
      totalRefund: "",
      attendanceCount: "10회",
      appLinked: false,
      appAccount: "",
      memo: "운동복 사이즈 변경 요청",
    },
    {
      name: "최민준",
      phone: "010-4894-6658",
      status: "예정",
      gender: "남성",
      age: "33세",
      address: "부산시 남구",
      products: {
        membership: ["3개월", "PT 1개월"],
        locker: [],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "",
      remainingDays: "11일",
      remainingCount: [{ type: "출석", count: 4 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "6658",
      staff: "김정아",
      receivables: "30,000원",
      totalPayment: "1,500,000원",
      totalRefund: "200,000원",
      attendanceCount: "60회",
      appLinked: false,
      appAccount: "",
      memo: "락커 변경 요청",
    },
    {
      name: "이지은",
      phone: "010-3437-4190",
      status: "유효",
      gender: "남성",
      age: "35세",
      address: "부산시 남구",
      products: {
        membership: ["3개월", "PT 1개월"],
        locker: [],
        wear: ["1개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "",
      remainingDays: "46일",
      remainingCount: [{ type: "출석", count: 3 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "4190",
      staff: "김정아",
      receivables: "",
      totalPayment: "300,000원",
      totalRefund: "",
      attendanceCount: "32회",
      appLinked: true,
      appAccount: "lje4190@naver.com",
      memo: "락커 변경 요청",
    },
    {
      name: "장하늘",
      phone: "010-9576-1252",
      status: "미등록",
      gender: "남성",
      age: "38세",
      address: "대구시 중구",
      products: {
        membership: [],
        locker: [],
        wear: [],
      },
      startDate: "",
      endDate: "",
      remainingDays: "",
      remainingCount: [],
      lastPaymentDate: "",
      lastVisitDate: "",
      userId: "1252",
      staff: "김정아, 송지민",
      receivables: "",
      totalPayment: "",
      totalRefund: "",
      attendanceCount: "",
      appLinked: true,
      appAccount: "jangsky1252@naver.com",
      memo: "다음 결제 예정",
    },
    {
      name: "한예은",
      phone: "010-9536-9037",
      status: "만료",
      gender: "여성",
      age: "38세",
      address: "서울시 강남구",
      products: {
        membership: ["1개월"],
        locker: [],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "",
      remainingDays: "79일",
      remainingCount: [{ type: "출석", count: 8 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "9037",
      staff: "김태형",
      receivables: "",
      totalPayment: "1,000,000원",
      totalRefund: "500,000원",
      attendanceCount: "55회",
      appLinked: false,
      appAccount: "",
      memo: "",
    },
    {
      name: "윤정우",
      phone: "010-6073-2156",
      status: "미등록",
      gender: "여성",
      age: "23세",
      address: "대구시 중구",
      products: {
        membership: [],
        locker: [],
        wear: [],
      },
      startDate: "",
      endDate: "",
      remainingDays: "",
      remainingCount: [],
      lastPaymentDate: "",
      lastVisitDate: "",
      userId: "2156",
      staff: "",
      receivables: "",
      totalPayment: "",
      totalRefund: "",
      attendanceCount: "",
      appLinked: false,
      appAccount: "",
      memo: "조심스러운 고객",
    },
    {
      name: "서지호",
      phone: "010-1575-4028",
      status: "미수금",
      gender: "여성",
      age: "31세",
      address: "서울시 마포구",
      products: {
        membership: ["1개월"],
        locker: ["1개월"],
        wear: ["1개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "무제한",
      remainingCount: [{ type: "출석", count: 40 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "4028",
      staff: "이휘경",
      receivables: "50,000원",
      totalPayment: "500,000원",
      totalRefund: "20,000원",
      attendanceCount: "16회",
      appLinked: false,
      appAccount: "",
      memo: "운동복 사이즈 변경 요청",
    },
    {
      name: "오하늘",
      phone: "010-7406-6934",
      status: "만료",
      gender: "여성",
      age: "24세",
      address: "부산시 수영구",
      products: {
        membership: ["1개월"],
        locker: ["1개월"],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "53일",
      remainingCount: [{ type: "출석", count: "무제한" }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "6934",
      staff: "",
      receivables: "",
      totalPayment: "3,500,000원",
      totalRefund: "150,000원",
      attendanceCount: "160회",
      appLinked: true,
      appAccount: "ohohskyohoh6934@naver.com",
      memo: "",
    },
    {
      name: "배수아",
      phone: "010-4362-3292",
      status: "유효",
      gender: "남성",
      age: "29세",
      address: "서울시 마포구",
      products: {
        membership: ["1개월"],
        locker: [],
        wear: ["1개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "57일",
      remainingCount: [{ type: "예약", count: "무제한" }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "3292",
      staff: "이서",
      receivables: "",
      totalPayment: "1,500,000원",
      totalRefund: "",
      attendanceCount: "",
      appLinked: true,
      appAccount: "bsasb3292@gamil.com",
      memo: "운동복 사이즈 변경 요청",
    },
    {
      name: "황보예린",
      phone: "010-5584-1234",
      status: "예정",
      gender: "여성",
      age: "29세",
      address: "부산시 연제구",
      products: {
        membership: ["PT 10회"],
        locker: [],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "",
      remainingDays: "61일",
      remainingCount: [{ type: "예약", count: 10 }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "",
      userId: "1234",
      staff: "김민수",
      receivables: "",
      totalPayment: "1,320,000원",
      totalRefund: "",
      attendanceCount: "72회",
      appLinked: false,
      appAccount: "",
      memo: "개인 일정 많음, 취소 잦음",
    },
    {
      name: "최윤",
      phone: "010-9988-1122",
      status: "만료임박",
      gender: "여성",
      age: "33세",
      address: "부산시 남구",
      products: {
        membership: ["1개월"],
        locker: ["1개월"],
        wear: [],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "4일",
      remainingCount: [
        { type: "출석", count: 2 },
        { type: "예약", count: 1 },
      ],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "1122",
      staff: "",
      receivables: "",
      totalPayment: "500,000원",
      totalRefund: "20,000원",
      attendanceCount: "24회",
      appLinked: true,
      appAccount: "yoona@naver.com",
      memo: "락커 위치 변경 요청",
    },
    {
      name: "한태경",
      phone: "010-7777-8888",
      status: "유효",
      gender: "남성",
      age: "41세",
      address: "부산시 수영구",
      products: {
        membership: ["12개월"],
        locker: [],
        wear: ["운동복 1개월"],
      },
      startDate: "2025.00.00 (월)",
      endDate: "2025.00.00 (월)",
      endDateLocker: "2025.00.00 (월)",
      remainingDays: "39일",
      remainingCount: [{ type: "출석", count: "무제한" }],
      lastPaymentDate: "2025.00.00 (월)",
      lastVisitDate: "2025.00.00 (월)",
      userId: "8888",
      staff: "김민수",
      receivables: "",
      totalPayment: "2,100,000원",
      totalRefund: "",
      attendanceCount: "80회",
      appLinked: true,
      appAccount: "taekyung@gmail.com",
      memo: "출석 무제한 확인 필요",
    },
  ];

  /* --------------------------
     각 회원 데이터 → 테이블 행 생성
  -------------------------- */
  data.forEach((user, i) => {
    const row = document.createElement("div");
    row.className = "user-management__table user-management__table--body";

    /* 🔹 상태 컬러 클래스 매핑 */
    const statusClassMap = {
      유효: "status--active",
      예정: "status--expected",
      홀딩: "status--holding",
      미수금: "status--arrears",
      미등록: "status--unregistered",
      만료임박: "status--expiring",
      만료: "status--expired",
    };
    const statusClass = statusClassMap[user.status] || "status--default";

    /* 🔹 앱 연동 상태 */
    const appLinkClass = user.appLinked ? "linked" : "not-linked";
    const appLabel = user.appLinked ? "연동" : "미연동";

    /* 🔹 상품 정보 (membership / locker / wear) */
    /* 🔹 상품 이름 (회원권/락커/운동복 모두 표시 — 약어 포함) */
    const typeInitialMap = {
      membership: "회",
      locker: "락",
      wear: "운",
    };

    const typeFullName = {
      membership: "회원권",
      locker: "락커",
      wear: "운동복",
    };

    const productHTML = Object.entries(user.products || {})
      .map(([type, items]) => {
        if (!items || items.length === 0) return "";

        const shortType = typeInitialMap[type] || "";
        const fullType = typeFullName[type] || "";
        const typeClass =
          {
            membership: "product--membership",
            locker: "product--locker",
            wear: "product--wear",
          }[type] || "";

        return items
          .map(
            (name) => `
          <p class="${typeClass}">
            ${
              shortType
                ? `<span class="product-type" data-tooltip="${fullType}" data-tooltip-direction="left">${shortType}</span>`
                : ""
            }
            ${name}
          </p>
        `
          )
          .join("");
      })
      .join("");

    const isMulti = Object.values(user.products || {}).flat().length > 1;

    /* 🔹 남은 횟수 (예약/출석/무제한 등) */
    const remainingHTML = Array.isArray(user.remainingCount)
      ? user.remainingCount
          .map((item) => {
            const isUnlimited = item.count === "무제한";
            return `<p>${item.type} ${
              isUnlimited ? "무제한" : `${item.count}회`
            }</p>`;
          })
          .join("")
      : "";
    const isRemainingMulti =
      Array.isArray(user.remainingCount) && user.remainingCount.length > 1;

    /* 🔹 공통 셀 생성 유틸 함수 */
    const getCell = (value, className) => {
      const hasValue = value && value.trim?.() !== "";
      return `<div class="${className}${!hasValue ? " dimmed" : ""}">
        ${hasValue ? value : "-"}
      </div>`;
    };

    /* --------------------------
       테이블 행 구성 HTML
    -------------------------- */
    row.innerHTML = `
      <div class="fixed-col">
        <div class="user-management__cell--select fixed-col--1">
          <div class="select-inner">
            ${createCheckbox({
              id: `checkbox--${i}`,
              size: "medium",
              variant: "standard",
            })}
          </div>
        </div>
        <div class="user-management__cell--status fixed-col--2">
          <span class="${statusClass}">${user.status}</span>
        </div>
        <div class="user-management__cell--user fixed-col--3">
          <p class="user-name">${user.name}</p>
          <p class="user-phone">${user.phone}</p>
        </div>
      </div>

      ${getCell(user.gender, "user-management__cell--gender")}
      ${getCell(user.age, "user-management__cell--age")}
      ${getCell(user.address, "user-management__cell--address")}

      <div class="user-management__cell--product ${
        isMulti ? "product-item--multi" : ""
      }">
        ${productHTML || '<span class="dimmed">-</span>'}
      </div>

      ${getCell(user.startDate, "user-management__cell--start-date")}
      ${getCell(user.endDate, "user-management__cell--end-date")}
      ${getCell(user.endDateLocker, "user-management__cell--end-date-locker")}
      ${getCell(user.remainingDays, "user-management__cell--remaining-days")}

      <div class="user-management__cell--remaining-count ${
        isRemainingMulti ? "remaining-count--multi" : ""
      }">
        ${remainingHTML || '<span class="dimmed">-</span>'}
      </div>

      ${getCell(user.memo, "user-management__cell--memo")}
      ${getCell(user.staff, "user-management__cell--staff")}
      ${getCell(user.receivables, "user-management__cell--receivables")}
      ${getCell(user.totalPayment, "user-management__cell--total-payment")}
      ${getCell(user.totalRefund, "user-management__cell--total-refund")}
      ${getCell(
        user.attendanceCount,
        "user-management__cell--attendance-count"
      )}
      ${getCell(user.userId, "user-management__cell--user-id")}

      <div class="user-management__cell--app-link-status ${appLinkClass}">
        ${appLabel}
      </div>

      ${getCell(user.appAccount, "user-management__cell--app-account")}
      ${getCell(
        user.lastPaymentDate,
        "user-management__cell--last-payment-date"
      )}
      ${getCell(user.lastVisitDate, "user-management__cell--last-visit-date")}

      <div class="user-management__cell--actions">
        <button class="btn--icon-utility" aria-label="더보기">
          <div class="icon--dots-three icon"></div>
        </button>
      </div>
    `;

    // 테이블에 행 추가
    tableWrap.appendChild(row);
  });
}

/* ==========================
   초기 렌더링 + 행 클릭 / 스크롤 이벤트
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  renderUserRows();

  const tableWrap = document.querySelector(".user-management__table-wrap");

  // 클릭 시 상세 페이지 이동 (체크박스 셀 제외)
  tableWrap.addEventListener("click", (e) => {
    const row = e.target.closest(".user-management__table--body");
    if (!row) return;
    if (e.target.closest(".user-management__cell--select")) return;
    window.location.href = "user-detail.html"; // 상세 페이지 이동
  });

  // 스크롤 시 좌측 고정 컬럼 그림자 표시
  const fixedCols = document.querySelectorAll(".fixed-col");
  if (fixedCols.length) {
    tableWrap.addEventListener("scroll", () => {
      const isScrolled = tableWrap.scrollLeft > 0;
      fixedCols.forEach((col) =>
        col.classList.toggle("has-border", isScrolled)
      );
    });
  }
});

/* ==========================
   체크박스 클릭 시 헤더 상태 전환
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const tableWrap = document.querySelector(".user-management__table-wrap");

  // 헤더 엘리먼트 캐싱
  const defaultHeader = document.querySelector(
    ".user-management-header:not(.user-management-header--table-checked)"
  );
  const selectedHeader = document.querySelector(
    ".user-management-header--table-checked"
  );
  const countText = selectedHeader.querySelector(
    ".user-management-header__title"
  );

  // 전체 선택 체크박스
  const headerCheckbox = document.getElementById("user-management-check-all");

  // 뒤로가기 버튼
  const backBtn = document.querySelector(".user-management-header__back-btn");

  backBtn?.addEventListener("click", () => {
    defaultHeader.style.display = "flex";
    selectedHeader.style.display = "none";
    headerCheckbox.checked = false;
    getBodyCheckboxes().forEach((cb) => (cb.checked = false));
    countText.textContent = "선택한 회원 0명에게";
  });

  // 행 내부 체크박스 조회
  const getBodyCheckboxes = () =>
    tableWrap.querySelectorAll(
      ".user-management__table--body .user-management__cell--select input[type='checkbox']"
    );

  // 상태 갱신
  function updateCheckedState() {
    const checkedCount = [...getBodyCheckboxes()].filter(
      (cb) => cb.checked
    ).length;

    if (checkedCount > 0) {
      defaultHeader.style.display = "none";
      selectedHeader.style.display = "flex";
      countText.textContent = `선택한 회원 ${checkedCount}명을`;
    } else {
      defaultHeader.style.display = "flex";
      selectedHeader.style.display = "none";
    }
  }

  // 전체 선택
  headerCheckbox?.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    getBodyCheckboxes().forEach((cb) => (cb.checked = isChecked));
    updateCheckedState();
  });

  // 개별 선택
  tableWrap.addEventListener("change", (e) => {
    const isBodyCheckbox = e.target.closest(
      ".user-management__table--body .user-management__cell--select input[type='checkbox']"
    );
    if (!isBodyCheckbox) return;

    updateCheckedState();

    const all = getBodyCheckboxes();
    const allChecked = [...all].every((cb) => cb.checked);
    headerCheckbox.checked = allChecked;
  });
});

/* ==========================
   회원관리 테이블 푸터
   ========================== */
/* --------------------------
   페이지네이션 생성
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const pagination = createPagination(1, 10, "small", (page) => {
    console.log("페이지 이동:", page);
  });
  document.getElementById("user-table__pagination")?.appendChild(pagination);
});

/* --------------------------
   행 수 선택 드롭다운
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  createDropdownMenu({
    id: "user-table-rows-menu",
    size: "xs",
    items: [
      { title: "10줄씩 보기", action: () => setRowsPerPage(10) },
      {
        title: "15줄씩 보기",
        selected: true,
        action: () => setRowsPerPage(15),
      },
      { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
      { title: "50줄씩 보기", action: () => setRowsPerPage(50) },
    ],
  });
  initializeDropdowns();
});

/* --------------------------
   행 수 선택 핸들러
-------------------------- */
function setRowsPerPage(count) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${count}줄씩 보기`;
  console.log(`${count}줄씩 보기 선택됨`);
}
