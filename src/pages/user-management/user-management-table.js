/* ======================================================================
   📦 user-management.js
   ----------------------------------------------------------------------
   - 회원 목록 테이블 렌더링 (회원 데이터 → 테이블 행 생성)
   - 체크박스 선택 시 헤더 상태 전환 (선택 회원 수 표시)
   - 페이지네이션 및 행 수 선택 드롭다운 관리
   ====================================================================== */

import { createPagination } from "../../components/button/create-pagination.js";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

/* ======================================================================
   0️⃣ Formatter 유틸리티
   ----------------------------------------------------------------------
   - 셀 비어 있을 때 dimmed 처리
   - 횟수(count), 기간(days) 등 형식 통일
   ---------------------------------------------------------------------- */

function formatCount(value) {
  if (!value || value === "-" || value === "")
    return `<span class="dimmed">-</span>`;
  return value;
}

function formatDays(value) {
  if (!value || value === "-" || value === "")
    return `<span class="dimmed">-</span>`;
  return value;
}

function dimmed(value) {
  return value ? value : `<span class="dimmed">-</span>`;
}

/* ======================================================================
   1️⃣ 회원 데이터 (userData)
   ----------------------------------------------------------------------
   - 상품 구조(회원권/락커/운동복)는 4열(row) 구조
   - count / days / memo 포함
   ====================================================================== */

const userData = [
  {
    name: "이소이",
    phone: "010-1234-5678",
    status: "유효",
    gender: "여성",
    age: "25세",
    address: "부산시 해운대구",
    userId: "5678",
    staff: "이휘경",
    memo: "락커 1개월 서비스 필요",

    products: {
      membership: [
        {
          name: "12개월 회원권",
          count: "출석 20회",
          days: "200일",
          memo: "양도 예정",
        },
        { name: "PT 1개월", count: "예약 5회", days: "30일", memo: "" },
      ],
      locker: [{ name: "12개월", count: "-", days: "200일", memo: "" }],
      wear: [{ name: "12개월", count: "-", days: "200일", memo: "" }],
    },

    startDate: "2025.01.01 (월)",
    endDate: "2026.12.31 (금)",
    lastPaymentDate: "2025.01.01 (월)",
    lastVisitDate: "2025.11.01 (화)",
    receivables: "10,000원",
    totalPayment: "1,300,000원",
    totalRefund: "20,000원",
    attendanceCount: "110회",
    appLinked: true,
    appAccount: "sososo2@naver.com",
  },

  {
    name: "강수미",
    phone: "010-2342-9382",
    status: "미등록",
    gender: "여성",
    age: "25세",
    address: "부산시 동래구",
    userId: "9382",
    staff: "",
    memo: "",
    products: { membership: [], locker: [], wear: [] },
    startDate: "2025.01.01 (월)",
    endDate: "-",
    lastPaymentDate: "-",
    lastVisitDate: "-",
    receivables: "-",
    totalPayment: "-",
    totalRefund: "-",
    attendanceCount: "-",
    appLinked: false,
    appAccount: "",
  },

  {
    name: "김지우",
    phone: "010-7269-2449",
    status: "홀딩",
    gender: "남성",
    age: "37세",
    address: "서울시 마포구",
    userId: "2449",
    staff: "이휘경",
    memo: "조심스러운 고객",
    products: {
      membership: [
        { name: "3개월 회원권", count: "예약 10회", days: "60일", memo: "" },
        { name: "PT 1개월", count: "출석 2회", days: "30일", memo: "" },
      ],
      locker: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
      wear: [],
    },

    startDate: "2025.01.05 (금)",
    endDate: "2025.04.05 (토)",
    lastPaymentDate: "2025.01.05 (일)",
    lastVisitDate: "2025.10.20 (월)",
    receivables: "-",
    totalPayment: "1,000,000원",
    totalRefund: "-",
    attendanceCount: "40회",
    appLinked: false,
    appAccount: "",
  },

  {
    name: "박서연",
    phone: "010-1075-9873",
    status: "만료임박",
    gender: "여성",
    age: "29세",
    address: "서울시 강남구",
    userId: "9873",
    staff: "",
    memo: "운동복 사이즈 변경 요청",
    products: {
      membership: [
        { name: "1개월 회원권", count: "예약 7회", days: "5일", memo: "" },
      ],
      locker: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
      wear: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
    },

    startDate: "2025.01.01 (월)",
    endDate: "2025.01.31 (금)",
    lastPaymentDate: "2025.01.01 (월)",
    lastVisitDate: "2025.01.05 (월)",
    receivables: "-",
    totalPayment: "300,000원",
    totalRefund: "-",
    attendanceCount: "10회",
    appLinked: false,
    appAccount: "",
  },

  {
    name: "최민준",
    phone: "010-4894-6658",
    status: "예정",
    gender: "남성",
    age: "33세",
    address: "부산시 남구",
    userId: "6658",
    staff: "김정아",
    memo: "락커 변경 요청",
    products: {
      membership: [
        { name: "PT 1개월", count: "출석 4회", days: "11일", memo: "" },
      ],
      locker: [],
      wear: [],
    },

    startDate: "2025.01.10 (금)",
    endDate: "2025.02.10 (월)",
    lastPaymentDate: "2025.01.10 (금)",
    lastVisitDate: "2025.01.20 (화)",
    receivables: "30,000원",
    totalPayment: "1,500,000원",
    totalRefund: "200,000원",
    attendanceCount: "60회",
    appLinked: false,
    appAccount: "",
  },

  {
    name: "이지은",
    phone: "010-3437-4190",
    status: "유효",
    gender: "여성",
    age: "35세",
    address: "부산시 남구",
    userId: "4190",
    staff: "김정아",
    memo: "락커 변경 요청",
    products: {
      membership: [
        { name: "3개월 회원권", count: "출석 3회", days: "46일", memo: "" },
        { name: "PT 1개월", count: "예약 4회", days: "30일", memo: "" },
      ],
      locker: [],
      wear: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
    },

    startDate: "2025.01.01 (월)",
    endDate: "2025.03.31 (월)",
    lastPaymentDate: "2025.01.04 (일)",
    lastVisitDate: "2025.01.05 (월)",
    receivables: "-",
    totalPayment: "300,000원",
    totalRefund: "-",
    attendanceCount: "32회",
    appLinked: true,
    appAccount: "lje4190@naver.com",
  },

  {
    name: "장하늘",
    phone: "010-9576-1252",
    status: "미등록",
    gender: "남성",
    age: "38세",
    address: "대구시 중구",
    userId: "1252",
    staff: "김정아, 송지민",
    memo: "다음 결제 예정",
    products: { membership: [], locker: [], wear: [] },
    startDate: "2025.01.01 (월)",
    endDate: "-",
    lastPaymentDate: "-",
    lastVisitDate: "-",
    receivables: "-",
    totalPayment: "-",
    totalRefund: "-",
    attendanceCount: "-",
    appLinked: true,
    appAccount: "jangsky1252@naver.com",
  },

  {
    name: "한태경",
    phone: "010-7777-8888",
    status: "유효",
    gender: "남성",
    age: "41세",
    address: "부산시 수영구",
    userId: "8888",
    staff: "김민수",
    memo: "출석 무제한 확인 필요",
    products: {
      membership: [
        { name: "12개월 회원권", count: "출석 무제한", days: "39일", memo: "" },
      ],
      locker: [],
      wear: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
    },

    startDate: "2025.01.01 (목)",
    endDate: "2025.12.31 (금)",
    lastPaymentDate: "2025.01.04 (일)",
    lastVisitDate: "2025.01.06 (화)",
    receivables: "-",
    totalPayment: "2,100,000원",
    totalRefund: "-",
    attendanceCount: "80회",
    appLinked: true,
    appAccount: "taekyung@gmail.com",
  },

  {
    name: "오하늘",
    phone: "010-7406-6934",
    status: "만료",
    gender: "여성",
    age: "24세",
    address: "부산시 수영구",
    userId: "6934",
    staff: "",
    memo: "",
    products: {
      membership: [
        { name: "1개월 회원권", count: "출석 무제한", days: "53일", memo: "" },
      ],
      locker: [{ name: "1개월", count: "-", days: "30일", memo: "" }],
      wear: [],
    },

    startDate: "2025.01.01 (월)",
    endDate: "2025.01.31 (금)",
    lastPaymentDate: "2025.01.01 (월)",
    lastVisitDate: "2025.01.06 (화)",
    receivables: "-",
    totalPayment: "3,500,000원",
    totalRefund: "150,000원",
    attendanceCount: "160회",
    appLinked: true,
    appAccount: "ohohskyohoh6934@naver.com",
  },

  {
    name: "정가람",
    phone: "010-0000-1111",
    status: "미등록",
    gender: "여성",
    age: "28세",
    address: "부산시 연제구",
    userId: "1111",
    staff: "",
    memo: "초기 상담 예정",
    products: { membership: [], locker: [], wear: [] },
    startDate: "2025.01.01 (월)",
    endDate: "-",
    lastPaymentDate: "-",
    lastVisitDate: "-",
    receivables: "-",
    totalPayment: "-",
    totalRefund: "-",
    attendanceCount: "-",
    appLinked: false,
    appAccount: "",
  },
];

/* ======================================================================
   2️⃣ 테이블 렌더링
   ----------------------------------------------------------------------
   - 상품 구조는 row 단위(product-row)
   - 셀 내부는 cell-inner 통합 구조
   - 상태/앱연동/상품 모두 새로운 기준으로 반영
   ====================================================================== */

function renderUserRows() {
  const tableWrap = document.querySelector(".user-management__table-wrap");
  if (!tableWrap) return;

  tableWrap
    .querySelectorAll(".user-management__table--body")
    .forEach((el) => el.remove());

  userData.forEach((user, i) => {
    const row = document.createElement("div");
    row.className = "user-management__table user-management__table--body";
    row.dataset.index = i;

    /* ------------------------------
       상품 데이터 병합
       ------------------------------ */
    const typeInitial = { membership: "회", locker: "락", wear: "운" };
    const typeFull = { membership: "회원권", locker: "락커", wear: "운동복" };

    const productHTML = (() => {
      const entries = Object.entries(user.products).flatMap(([type, list]) =>
        list.map((p) => ({
          type,
          name: p.name,
          count: p.count,
          days: p.days,
          memo: p.memo,
        }))
      );

      if (entries.length === 0) {
        return `
          <div class="product-row product-row--empty">
            <div class="product-col dimmed">-</div>
            <div class="product-col dimmed">-</div>
            <div class="product-col dimmed">-</div>
            <div class="product-col dimmed">-</div>
          </div>`;
      }

      return entries
        .map((p) => {
          return `
            <div class="product-row">
              <div class="product-col product-col--name">
                <span class="product-type"
                  data-tooltip="${typeFull[p.type]}"
                  data-tooltip-direction="left">
                  ${typeInitial[p.type]}
                </span>
                <span class="product-name">${p.name}</span>
              </div>

              <div class="product-col product-col--count">
                ${formatCount(p.count)}
              </div>

              <div class="product-col product-col--days">
                ${formatDays(p.days)}
              </div>

              <div class="product-col product-col--memo">
                ${dimmed(p.memo)}
              </div>
            </div>`;
        })
        .join("");
    })();

    /* ------------------------------
       단일 셀 생성 유틸
       ------------------------------ */
    const cell = (value, cls) => `
      <div class="${cls}${value && value !== "-" ? "" : " dimmed"}">
        <div class="cell-inner">${value || "-"}</div>
      </div>
    `;

    /* ------------------------------
       Row HTML 구성
       ------------------------------ */
    row.innerHTML = `
      <div class="fixed-col">
        <div class="user-management__cell--select fixed-col--1">
          <div class="select-inner">
            ${createCheckbox({
              id: `checkbox-${i}`,
              size: "medium",
              variant: "standard",
            })}
          </div>
        </div>

        <div class="user-management__cell--user fixed-col--2">
          <div class="user-avatar">
            <img src="/assets/images/user.jpg" alt="avatar" />
          </div>
          <div class="cell-inner">
            <p class="user-name">${user.name}</p>
            <p class="user-phone">${user.phone}</p>
          </div>
        </div>
      </div>

      ${cell(user.gender, "user-management__cell--gender")}
      ${cell(user.age, "user-management__cell--age")}
      ${cell(user.address, "user-management__cell--address")}

      <div class="user-management__cell--product">
        <div class="cell-inner product-cell">${productHTML}</div>
      </div>

      ${cell(user.endDate, "user-management__cell--end-date")}
      ${cell(user.memo, "user-management__cell--memo")}
      ${cell(user.staff, "user-management__cell--staff")}
      ${cell(user.receivables, "user-management__cell--receivables")}
      ${cell(user.totalPayment, "user-management__cell--total-payment")}
      ${cell(user.totalRefund, "user-management__cell--total-refund")}
      ${cell(user.attendanceCount, "user-management__cell--attendance-count")}

      <div class="user-management__cell--app-link-status ${
        user.appLinked ? "linked" : "not-linked"
      }">
        <div class="cell-inner">${user.appLinked ? "연동" : "미연동"}</div>
      </div>

      ${cell(user.appAccount, "user-management__cell--app-account")}
      ${cell(user.lastPaymentDate, "user-management__cell--last-payment-date")}
      ${cell(user.lastVisitDate, "user-management__cell--last-visit-date")}
      ${cell(user.startDate, "user-management__cell--start-date")}
      ${cell(user.userId, "user-management__cell--user-id")}

      <div class="user-management__cell--actions">
        <button class="btn--icon-utility">
          <div class="icon--dots-three icon"></div>
        </button>
      </div>
    `;

    tableWrap.appendChild(row);
  });
}

/* ======================================================================
   3️⃣ 초기 렌더링 + 스크롤 그림자 처리
   ----------------------------------------------------------------------
   - 테이블 최초 렌더링
   - 좌측 고정 컬럼(fixed-col) 스크롤 시 그림자(has-border) 적용
   ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderUserRows();

  const wrap = document.querySelector(".user-management__table-wrap");
  if (!wrap) return;

  const fixedCols = document.querySelectorAll(".fixed-col");

  wrap.addEventListener("scroll", () => {
    const scrolled = wrap.scrollLeft > 0;
    fixedCols.forEach((el) => el.classList.toggle("has-border", scrolled));
  });
});

/* ======================================================================
   4️⃣ 체크박스 / 헤더 UI / 전체 선택 기능
   ----------------------------------------------------------------------
   ✔ 보이는 N명의 체크박스 기준 선택  
   ✔ 390명 전체 선택 / 전체 선택 취소 버튼  
   ✔ 헤더 전환(기본 헤더 ↔ 선택 헤더)  
   ✔ 뒤로가기 버튼으로 초기화  
   ----------------------------------------------------------------------
   Angular 대응 시:
   - selectionChange 이벤트 내보내서 부모에서 관리 가능
   ====================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".user-management__table-wrap");
  if (!wrap) return;

  /* -------------------------------
     기본 헤더 / 선택 헤더 DOM
  -------------------------------- */
  const defaultHeader = document.querySelector(
    ".user-management-header:not(.user-management-header--table-checked)"
  );
  const selectedHeader = document.querySelector(
    ".user-management-header.user-management-header--table-checked"
  );

  const countText = selectedHeader.querySelector(
    ".user-management-header__title"
  );

  const selectAllBtn = selectedHeader.querySelector(".user-select-all-btn");

  /* -------------------------------
     전체 회원 수 (실제 데이터 기준)
     - 현재는 임시로 390명 설정
  -------------------------------- */
  const TOTAL_USERS = 390;

  /* -------------------------------
     전체 선택 모드 여부
     - 단일 페이지 10명만 선택했더라도
       “390명 전체 선택" 눌렀을 때 true
  -------------------------------- */
  let isGlobalSelected = false;

  /* -------------------------------
     현재 페이지의 체크박스 목록
  -------------------------------- */
  const getBodyCheckboxes = () =>
    wrap.querySelectorAll(
      ".user-management__table--body .user-management__cell--select input[type='checkbox']"
    );

  /* -------------------------------
     표 헤더의 전체선택 체크박스
  -------------------------------- */
  const headerCheckbox = document.getElementById("user-management-check-all");

  /* ======================================================================
     🟦 헤더 상태 업데이트 (핵심 함수)
     ----------------------------------------------------------------------
     ✔ 선택 수에 따라 헤더 표시
     ✔ selectAllBtn(390명 전체 선택 버튼) 표시 여부 결정
     ✔ 전체선택 체크박스 동기화
     ====================================================================== */
  function updateHeaderState() {
    const bodyCheckboxes = getBodyCheckboxes();
    const checkedCount = [...bodyCheckboxes].filter((cb) => cb.checked).length;
    const visibleCount = bodyCheckboxes.length;

    if (checkedCount > 0) {
      defaultHeader.style.display = "none";
      selectedHeader.style.display = "flex";

      // 기본 문구
      countText.textContent = `선택한 회원 ${checkedCount}명을`;

      // 이미 전체 선택 모드라면 문구 고정
      if (isGlobalSelected) {
        selectAllBtn.style.display = "inline-flex";
        selectAllBtn.textContent = "전체 선택 취소";
        selectAllBtn.dataset.mode = "cancel-all";
        return;
      }

      // 보이는 row 전체가 선택된 경우 → 전체 선택 버튼 표시
      if (checkedCount === visibleCount) {
        selectAllBtn.style.display = "inline-flex";
        selectAllBtn.textContent = `${TOTAL_USERS}명 전체 선택`;
        selectAllBtn.dataset.mode = "select-all";
      } else {
        selectAllBtn.style.display = "none";
      }
    } else {
      // 선택 0명 → 초기 헤더로 복귀
      defaultHeader.style.display = "flex";
      selectedHeader.style.display = "none";
      selectAllBtn.style.display = "none";
      isGlobalSelected = false;
    }
  }

  /* ======================================================================
     🟦 헤더 체크박스 클릭 → 화면 내 N개 전체 선택
     ====================================================================== */
  headerCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;

    getBodyCheckboxes().forEach((cb) => (cb.checked = isChecked));

    if (!isChecked) isGlobalSelected = false;

    updateHeaderState();
  });

  /* ======================================================================
     🟦 Row 체크박스 변경 → 헤더 상태 갱신
     ====================================================================== */
  wrap.addEventListener("change", (e) => {
    const cb = e.target.closest(
      ".user-management__table--body .user-management__cell--select input[type='checkbox']"
    );
    if (!cb) return;

    updateHeaderState();

    // 전체 선택 체크박스와 동기화
    const all = getBodyCheckboxes();
    headerCheckbox.checked = [...all].every((c) => c.checked);
  });

  /* ======================================================================
     🟦 전체 390명 선택 / 전체 선택 취소
     ====================================================================== */
  selectAllBtn.addEventListener("click", () => {
    const mode = selectAllBtn.dataset.mode;

    /* ---------------------------
       🔹 전체 선택 처리
    ---------------------------- */
    if (mode === "select-all") {
      isGlobalSelected = true;

      selectAllBtn.textContent = "전체 선택 취소";
      selectAllBtn.dataset.mode = "cancel-all";

      countText.textContent = `선택한 회원 ${TOTAL_USERS}명을`;

      selectedHeader.style.display = "flex";
      defaultHeader.style.display = "none";

      return;
    }

    /* ---------------------------
       🔹 전체 선택 취소 처리
    ---------------------------- */
    if (mode === "cancel-all") {
      isGlobalSelected = false;

      selectAllBtn.textContent = `${TOTAL_USERS}명 전체 선택`;
      selectAllBtn.dataset.mode = "select-all";

      updateHeaderState();
    }
  });

  /* ======================================================================
     🟦 뒤로가기 버튼 → 모든 선택 초기화
     ====================================================================== */
  const backBtn = document.querySelector(".user-management-header__back-btn");

  backBtn?.addEventListener("click", () => {
    headerCheckbox.checked = false;
    getBodyCheckboxes().forEach((cb) => (cb.checked = false));

    defaultHeader.style.display = "flex";
    selectedHeader.style.display = "none";
    selectAllBtn.style.display = "none";

    isGlobalSelected = false;
  });
});

/* ======================================================================
   5️⃣ 테이블 푸터 (페이지네이션 + 줄 수 보기)
   ----------------------------------------------------------------------
   - createPagination() 로 페이지 이동 UI 생성
   - createDropdownMenu() 로 "10줄씩 보기" 드롭다운 활성화
   - setRowsPerPage() 로 버튼 라벨 동기화
   ----------------------------------------------------------------------
   Angular 참고:
   - <app-pagination> 컴포넌트/서비스 분리
   - rowsPerPageChange 이벤트 바인딩 가능
   ====================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------
     📌 페이지네이션 생성
  -------------------------------- */
  const pagination = createPagination(1, 10, "small", (page) => {
    console.log("페이지 이동:", page);
  });
  const footerPagEl = document.getElementById("user-table__pagination");
  if (footerPagEl) footerPagEl.appendChild(pagination);
});

/* -------------------------------
   📌 줄 수 보기 드롭다운 생성
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  createDropdownMenu({
    id: "user-table-rows-menu",
    size: "xs",
    items: [
      {
        title: "10줄씩 보기",
        selected: true,
        action: () => setRowsPerPage(10),
      },
      { title: "15줄씩 보기", action: () => setRowsPerPage(15) },
      { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
      { title: "50줄씩 보기", action: () => setRowsPerPage(50) },
    ],
  });

  initializeDropdowns();
});

/* -------------------------------
   📌 줄 수 변경 핸들러
-------------------------------- */
function setRowsPerPage(count) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${count}줄씩 보기`;

  // 데이터 다시 가져와 렌더링하는 로직은 이후 Pagination 연동 시 추가 가능
}

/* ======================================================================
   6️⃣ 행 클릭 → 커서 위치 기반 Context Menu 열기
   ----------------------------------------------------------------------
   - 각 행 클릭 시 우측 상단 점(dot) 메뉴가 아니라,
     “행 전체 아무 곳 클릭 시” 커서 위치 기준으로 메뉴 표시
   - 외부 클릭 시 자동 닫힘
   - 위치가 화면 밖으로 넘치지 않게 보정
   - data-action 속성 기반으로 페이지 이동 처리
   ----------------------------------------------------------------------
   Angular 참고:
   - <app-context-menu> 컴포넌트화 가능
   ====================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".user-management__table-wrap");
  if (!wrap) return;

  let currentCloseHandler = null;

  /* -----------------------------------------------------
      📌 메뉴 제거 + 닫기 리스너 해제
  ------------------------------------------------------ */
  function removeContextMenu() {
    // 이벤트 중복 등록 방지
    if (currentCloseHandler) {
      document.removeEventListener("click", currentCloseHandler);
      currentCloseHandler = null;
    }

    // 기존 메뉴 제거
    document.querySelectorAll(".context-menu").forEach((m) => m.remove());
    document
      .querySelectorAll(".user-management__table--body.is-context-active")
      .forEach((row) => row.classList.remove("is-context-active"));
  }

  /* -----------------------------------------------------
      📌 메뉴 열기
  ------------------------------------------------------ */
  function showContextMenu(e, row) {
    removeContextMenu();

    const index = row.dataset.index;
    const user = userData[index];

    row.classList.add("is-context-active");

    /* -----------------------------------------------------
       📌 메뉴 HTML 구성
    ------------------------------------------------------ */
    const menu = document.createElement("div");
    menu.className = "context-menu";

    menu.innerHTML = `
      <div class="context-menu__profile">
        <div class="context-menu__avatar">
          <img src="/assets/images/user.jpg" alt="avatar" />
        </div>

        <div class="context-menu__info">
          <div class="context-menu__name">${user.name}</div>
          <div class="context-menu__phone">${user.phone}</div>
        </div>

        <div class="context-menu__profile-btns">
          <button class="btn--icon-utility" data-tooltip="정보 수정" aria-label="정보 수정" data-action="edit-user">
            <i class="icon--edit icon"></i>
          </button>
          <button class="btn--icon-utility" data-tooltip="회원 삭제" aria-label="회원 삭제" data-action="delete-user">
            <i class="icon--trash icon"></i>
          </button>
        </div>
      </div>

      <div class="context-menu__group">
        <div class="context-menu__items">
          <button class="btn btn--outlined btn--neutral btn--small" data-action="go-product">
            <span>상품등록</span>
          </button>

          <button class="btn btn--outlined btn--neutral btn--small" data-action="go-attendance">
            <span>출석</span>
          </button>

          <button class="btn btn--outlined btn--neutral btn--small" data-action="go-holding">
            <span>홀딩</span>
          </button>

          <button class="btn btn--outlined btn--neutral btn--small" data-action="go-extend">
            <span>연장</span>
          </button>
        </div>
      </div>

      <button class="btn btn--solid btn--neutral btn--small context-menu__detail-btn" data-action="go-user-detail">
        회원 정보로 이동
        <i class="icon--caret-right icon"></i>
      </button>
    `;

    document.body.appendChild(menu);

    /* -----------------------------------------------------
       📌 action → URL 매핑 테이블
    ------------------------------------------------------ */
    const actionRoutes = {
      "go-product": "/src/pages/product-registration/product-registration.html",
      "go-attendance": "#",
      "go-holding": "#",
      "go-extend": "#",
      "go-user-detail": "/src/pages/user-management/user-detail.html",
      "edit-user": "#",
      "delete-user": "#",
    };

    /* -----------------------------------------------------
       📌 메뉴 내부 클릭 처리
    ------------------------------------------------------ */
    menu.addEventListener("click", (evt) => {
      const target = evt.target.closest("[data-action]");
      if (!target) return;

      const action = target.dataset.action;
      const url = actionRoutes[action];

      if (url) {
        window.location.href = url;
        return;
      }

      console.log("Action:", action);
    });

    /* -----------------------------------------------------
       📌 위치 보정 (화면에서 넘치지 않도록)
    ------------------------------------------------------ */
    let posX = e.clientX + 8;
    let posY = e.clientY + 8;

    const rect = menu.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (posX + rect.width > vw - 8) posX = vw - rect.width - 8;
    if (posY + rect.height > vh - 8) posY = vh - rect.height - 8;

    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;

    /* -----------------------------------------------------
       📌 외부 클릭 시 메뉴 닫기
    ------------------------------------------------------ */
    currentCloseHandler = (evt) => {
      if (!menu.contains(evt.target)) removeContextMenu();
    };

    setTimeout(() => {
      document.addEventListener("click", currentCloseHandler);
    }, 0);
  }

  /* -----------------------------------------------------
      📌 행 클릭 → 메뉴 토글
  ------------------------------------------------------ */
  wrap.addEventListener("click", (e) => {
    const row = e.target.closest(".user-management__table--body");
    if (!row) return;

    // 체크박스 영역이면 메뉴 열지 않음
    if (e.target.closest(".user-management__cell--select")) return;

    // 이미 열려있는 행이면 닫기
    if (row.classList.contains("is-context-active")) {
      removeContextMenu();
      return;
    }

    // 메뉴 열기
    showContextMenu(e, row);
  });
});
