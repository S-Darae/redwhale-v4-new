/* =====================================================
📦 Sales Page Script (매출 테이블 렌더링 통합)
=====================================================
💡 Angular 변환 시 참고
-----------------------------------------------------
- <app-sales-table [data]="salesData"></app-sales-table>
- <app-pagination (changePage)="onPageChange($event)"></app-pagination>
- <app-dropdown [items]="rowOptions" (select)="onRowCountChange($event)">
- 스크롤 그림자 효과는 HostListener('scroll')로 처리
===================================================== */

// =====================================================
// 📦 Import
// =====================================================
import "../../pages/common/main-menu.js";
import "./sale-field.js";
import "./sales-filter-sidebar.js";
import "./sales-stats-sidebar.js";
import "./sales-summary.js";
import "./sales.scss";

import "../../components/button/button.js";
import "../../components/tooltip/tooltip.js";

import { createPagination } from "../../components/button/create-pagination.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

// =====================================================
// 📊 매출 데이터 렌더링
// =====================================================
function renderSalesTable() {
  const tableWrap = document.querySelector(".sales__table-wrap");
  if (!tableWrap) return;

  // 기존 body 제거 (헤더는 유지)
  const existingBodies = tableWrap.querySelectorAll(".sales__table--body");
  existingBodies.forEach((el) => el.remove());

  // ------------------------------
  // 📋 데이터
  // ------------------------------
  const data = [
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "이소이",
      phone: "010-1234-5678",
      productType: "회원권, 락커, 운동복",
      products: {
        membership: ["1:1 PT 20회"],
        locker: ["1개월"],
        wear: ["1개월"],
      },
      staff: "김민수",
      method: "계좌이체, 미수금",
      amount: { main: "1,000,000원", sub: "미수금 200,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "강수미",
      phone: "010-2342-9382",
      productType: "락커",
      products: {
        membership: [],
        locker: ["12개월"],
        wear: [],
      },
      staff: "이휘경",
      method: "현금",
      amount: { main: "100,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "김지우",
      phone: "010-7269-2449",
      productType: "운동복",
      products: {
        membership: [],
        locker: [],
        wear: ["12개월"],
      },
      staff: "이휘경",
      method: "카드",
      amount: { main: "100,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "환불",
      name: "박서연",
      phone: "010-1075-9873",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "김정아",
      method: "계좌이체",
      amount: { main: "-" },
      refund: "1,000,000원",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "최민준",
      phone: "010-4894-6658",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "김정아",
      method: "계좌이체",
      amount: { main: "1,000,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "양도",
      name: "이지은",
      phone: "010-3437-4190",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "김정아",
      method: "계좌이체",
      amount: { main: "10,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "장하늘",
      phone: "010-9576-1252",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "송지민",
      method: "계좌이체, 미수금",
      amount: { main: "1,000,000원", sub: "미수금 200,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "한예은",
      phone: "010-9536-9037",
      productType: "회원권, 락커, 운동복",
      products: {
        membership: ["1:1 PT 20회"],
        locker: ["1개월"],
      },
      staff: "김태형",
      method: "계좌이체, 미수금",
      amount: { main: "1,000,000원", sub: "미수금 200,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "윤정우",
      phone: "010-6073-2156",
      productType: "락커",
      products: {
        membership: [],
        locker: ["12개월"],
        wear: [],
      },
      staff: "김태형",
      method: "현금",
      amount: { main: "100,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "서지호",
      phone: "010-1575-4028",
      productType: "운동복",
      products: {
        membership: [],
        locker: [],
        wear: ["12개월"],
      },
      staff: "이휘경",
      method: "카드",
      amount: { main: "100,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "환불",
      name: "오하늘",
      phone: "010-7406-6934",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "이휘경",
      method: "계좌이체",
      amount: { main: "-" },
      refund: "1,000,000원",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "배수아",
      phone: "010-4362-3292",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "이서",
      method: "계좌이체",
      amount: { main: "1,000,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "양도",
      name: "황보예린",
      phone: "010-5584-1234",
      productType: "회원권",
      products: {
        membership: ["새해 이벤트 12개월"],
        locker: [],
        wear: [],
      },
      staff: "김민수",
      method: "계좌이체",
      amount: { main: "10,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "최윤",
      phone: "010-9988-1122",
      productType: "회원권",
      products: {
        membership: ["1개월"],
        locker: [],
        wear: [],
      },
      staff: "김민수",
      method: "카드",
      amount: { main: "1,000,000원" },
      refund: "-",
    },
    {
      date: "2025.01.01 (월) 00:00",
      type: "결제",
      name: "한태경",
      phone: "010-7777-8888",
      productType: "회원권",
      products: {
        membership: ["1개월"],
        locker: [],
        wear: [],
      },
      staff: "김민수",
      method: "현금",
      amount: { main: "1,000,000원" },
      refund: "-",
    },
  ];

  // ------------------------------
  // 📋 테이블 헤더 자동 생성
  // ------------------------------
  if (!tableWrap.querySelector(".sales__table--head")) {
    const header = document.createElement("div");
    header.className = "sales__table sales__table--head";
    header.innerHTML = `
      <div class="fixed-col">
        <div class="sales__cell--date fixed-col--1">일시</div>
        <div class="sales__cell--type fixed-col--2">구분</div>
        <div class="sales__cell--user fixed-col--3">회원</div>
      </div>
      <div class="sales__cell--product">상품</div>
      <div class="sales__cell--staff">결제 담당자</div>
      <div class="sales__cell--method">결제 수단</div>
      <div class="sales__cell--amount">결제 금액</div>
      <div class="sales__cell--amount refund">환불 금액</div>
      <div class="sales__cell--actions"></div>
    `;
    tableWrap.appendChild(header);
  }

  // ------------------------------
  // 📊 데이터 행 렌더링
  // ------------------------------
  const typeClassMap = {
    결제: "badge--payment",
    환불: "badge--refund",
    양도: "badge--transfer",
  };

  const typeInitialMap = {
    회원권: "회",
    락커: "락",
    운동복: "운",
  };

  data.forEach((item) => {
    const isRefund = item.type === "환불";
    const typeClass = typeClassMap[item.type] || "badge--default";

    // 상품 데이터 변환 (객체 → 배열)
    const productList = Object.entries(item.products || {}).flatMap(
      ([key, arr]) =>
        (arr || []).map((name) => {
          const typeMap = {
            membership: "회원권",
            locker: "락커",
            wear: "운동복",
          };
          return { name, type: typeMap[key] || key };
        })
    );

    // 상품 표시 HTML
    const productHtml = productList
      .map((p) => {
        const short = typeInitialMap[p.type] || "";
        const full = p.type || "";
        return `
        <p>
          <span class="product-type" data-tooltip="${full}" data-tooltip-direction="left">${short}</span>
          ${p.name}
        </p>`;
      })
      .join("");

    // 결제 / 환불 금액 구조
    const hasAmount = item.amount?.main && item.amount.main !== "-";
    const amountMain = hasAmount ? item.amount.main : "-";
    const mainAmountHTML = `
      <div class="sales__cell--amount">
        <div class="cell-inner">
          <span class="amount--main${
            hasAmount ? "" : " is-empty"
          }">${amountMain}</span>
          ${
            item.amount?.sub
              ? `<p class="amount--sub">${item.amount.sub}</p>`
              : ""
          }
        </div>
      </div>
    `;

    const hasRefund = item.refund && item.refund !== "-";
    const refundHTML = `
      <div class="sales__cell--amount refund${!hasRefund ? " is-empty" : ""}">
        <div class="cell-inner">
          ${
            hasRefund && isRefund
              ? `<span><i class='icon--minus icon'></i>${item.refund
                  .replace(/[^\d]/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>`
              : "-"
          }
        </div>
      </div>
    `;

    // 행 생성
    const row = document.createElement("div");
    row.className = "sales__table sales__table--body";
    row.innerHTML = `
      <div class="fixed-col">
        <div class="sales__cell--date fixed-col--1">${
          item.date
        }</div>
        <div class="sales__cell--type fixed-col--2">
            <span class="badge ${typeClass}">${item.type}</span>
        </div>
        <div class="sales__cell--user fixed-col--3">
        <div>
            <p class="user-name">${item.name}</p>
            <p class="user-phone">${item.phone}</p>
        </div>
        </div>
      </div>

      <div class="sales__cell--product ${
        productList.length > 1 ? "product-item--multi" : ""
      }">
        <div class="cell-inner">
          ${productHtml}
        </div>
      </div>

      <div class="sales__cell--staff"><div class="cell-inner">${
        item.staff
      }</div></div>
      <div class="sales__cell--method"><div class="cell-inner">${
        item.method
      }</div></div>

      ${mainAmountHTML}
      ${refundHTML}

      <div class="sales__cell--actions">
          <button class="btn--icon-utility" aria-label="더보기">
            <div class="icon--dots-three icon"></div>
          </button>
      </div>
    `;
    tableWrap.appendChild(row);
  });
}

// =====================================================
// ⚙️ 초기화 (렌더링 + 스크롤 효과)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  renderSalesTable();

  const tableWrap = document.querySelector(".sales__table-wrap");

  // 스크롤 시 그림자 효과 처리
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

// =====================================================
// 📄 테이블 푸터 (페이지네이션 + 행 수 선택)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const pagination = createPagination(1, 10, "small", (page) => {
    console.log("페이지 이동:", page);
  });
  document.getElementById("sales-table__pagination")?.appendChild(pagination);

  createDropdownMenu({
    id: "sales-table-rows-menu",
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

function setRowsPerPage(count) {
  const btn = document.querySelector(".table-row-select");
  if (btn) btn.textContent = `${count}줄씩 보기`;
  console.log(`${count}줄씩 보기 선택됨`);
}
