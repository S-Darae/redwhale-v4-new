/* ======================================================================
   💳 payments.js — 회원 상세 페이지 > 결제 내역 탭
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 결제 / 환불 / 양도 내역 데이터를 테이블로 렌더링
   - 탭 전환 시 각 상태별 내역 표시
   - 행 수 변경 드롭다운 및 페이지네이션 포함
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-payment-list> 컴포넌트로 구성 가능
   - 테이블 렌더링은 <app-payment-table>로 분리 가능
   - Pagination, Dropdown은 각각 독립 컴포넌트로 주입
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - payments.scss / table.scss / dropdown.scss / pagination.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 및 모듈
   ====================================================================== */
import { createPagination } from "../../../components/button/create-pagination.js";
import "../../../components/button/pagination.scss";

import { createDropdownMenu } from "../../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../../components/dropdown/dropdown-init.js";
import "../../../components/dropdown/dropdown.scss";

import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";
import "./payments.scss";

/* ======================================================================
   📊 결제 내역 데이터 (Mock)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 결제 / 환불 / 양도 내역의 더미 데이터 정의
   - 실제 서비스에서는 서버 API에서 불러올 예정
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - PaymentService.getUserPayments(userId)로 주입
   - interface Payment { date, type, staff, method, amount, refund, products }
   ====================================================================== */
export const paymentsData = [
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "계좌이체, 미수금",
    amount: { main: "1,000,000원", sub: "미수금 200,000원" },
    refund: "-",
    products: [
      { name: "1:1 PT 20회", type: "회원권" },
      { name: "1개월", type: "락커" },
      { name: "1개월", type: "운동복" },
    ],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "현금",
    amount: { main: "100,000원" },
    refund: "-",
    products: [{ name: "12개월", type: "락커" }],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "양도",
    staff: "이휘경",
    method: "현금",
    amount: { main: "10,000원" },
    refund: "-",
    products: [{ name: "1개월", type: "회원권" }],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "카드",
    amount: { main: "100,000원" },
    refund: "-",
    products: [{ name: "1개월", type: "회원권" }],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "환불",
    staff: "이휘경",
    method: "계좌이체",
    amount: { main: "-" },
    refund: "1,000,000원",
    products: [{ name: "새해 이벤트 12개월", type: "회원권" }],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "계좌이체",
    amount: { main: "1,000,000원" },
    refund: "-",
    products: [{ name: "새해 이벤트 12개월", type: "회원권" }],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "계좌이체",
    amount: { main: "1,000,000원" },
    refund: "-",
    products: [
      { name: "12개월", type: "회원권" },
      { name: "12개월", type: "락커" },
      { name: "12개월", type: "운동복" },
    ],
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "결제",
    staff: "이휘경",
    method: "계좌이체, 미수금",
    amount: { main: "100,000원", sub: "미수금 50,000원" },
    refund: "-",
    products: [
      { name: "1일권", type: "회원권" },
      { name: "1일권", type: "락커" },
      { name: "1일권", type: "운동복" },
    ],
  },
];

/* ======================================================================
   🧩 renderPaymentTable() — 결제 내역 테이블 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - 결제 / 환불 / 양도 내역 데이터를 HTML 테이블로 렌더링
   - 미리보기 모드(isPreview)일 경우 일부 컬럼 축약
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-payment-table [data]="payments" [isPreview]="false">
   - *ngFor="let item of data" 기반 렌더링
   ====================================================================== */
export function renderPaymentTable({ target, data, isPreview = false }) {
  if (!target) return;
  target.innerHTML = "";

  /* --------------------------------------------------
     🧱 테이블 헤더
     -------------------------------------------------- */
  const header = document.createElement("div");
  header.className = "payment__table payment__table--head";
  header.innerHTML = `
    <div class="payment__cell--date">일시</div>
    <div class="payment__cell--type">구분</div>
    <div class="payment__cell--product">상품</div>
    <div class="payment__cell--staff">결제 담당자</div>
    <div class="payment__cell--method">결제 수단</div>
    ${
      isPreview
        ? `<div class="payment__cell--amount">금액</div>`
        : `
          <div class="payment__cell--amount">결제 금액</div>
          <div class="payment__cell--amount refund">환불 금액</div>
        `
    }
    <div class="payment__cell--actions"></div>
  `;
  target.appendChild(header);

  /* --------------------------------------------------
     📊 데이터 렌더링
     -------------------------------------------------- */
  const typeClassMap = {
    결제: "badge--payment",
    환불: "badge--refund",
    양도: "badge--transfer",
  };

  data.forEach((item) => {
    item.typeClass = typeClassMap[item.type] || "badge--default";

    // 상품 유형 요약
    const uniqueTypes = [...new Set(item.products.map((p) => p.type))];
    item.productType = uniqueTypes.join(", ");

    const isRefund = item.type === "환불";

    // 💰 금액 포맷팅
    const formattedAmount = isRefund
      ? (() => {
          const numeric = (item.refund || "")
            .replace(/[^\d]/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return numeric
            ? `<span><i class='icon--minus icon'></i>${numeric}원</span>`
            : "-";
        })()
      : item.amount?.main && item.amount.main !== "-"
      ? `${item.amount.main}`
      : "-";

    // 상품명 + 유형 약어 (회/락/운)
    const typeInitialMap = { 회원권: "회", 락커: "락", 운동복: "운" };
    const productHtml = item.products
      .map((p) => {
        const shortType = typeInitialMap[p.type] || "";
        const fullType = p.type || "";
        return `
          <p>
            ${
              shortType
                ? `<span class="product-type" data-tooltip="${fullType}" data-tooltip-direction="left">${shortType}</span>`
                : ""
            }
            ${p.name}
          </p>`;
      })
      .join("");

    // 🧾 행 생성
    const row = document.createElement("div");
    row.className = "payment__table payment__table--body";

    row.innerHTML = `
      <div class="payment__cell--date">${item.date}</div>
      <div class="payment__cell--type badge ${item.typeClass}">${item.type}</div>
      <div class="payment__cell--product ${
        item.products.length > 1 ? "product-item--multi" : ""
      }">${productHtml}</div>
      <div class="payment__cell--staff">${item.staff}</div>
      <div class="payment__cell--method">${item.method}</div>

      ${
        isPreview
          ? `
            <div class="payment__cell--amount ${
              isRefund ? "is-refund" : "is-payment"
            }">
              ${formattedAmount}
              ${
                item.amount?.sub
                  ? `<p class="amount--sub">${item.amount.sub}</p>`
                  : ""
              }
            </div>
          `
          : `
            <div class="payment__cell--amount">
              <p class="amount--main${
                item.amount.main === "-" ? " is-empty" : ""
              }">${item.amount.main}</p>
              ${
                item.amount.sub
                  ? `<p class="amount--sub">${item.amount.sub}</p>`
                  : ""
              }
            </div>
            <div class="payment__cell--amount refund ${
              item.refund === "-" ? "is-empty" : ""
            }">
              ${
                item.refund !== "-" && item.type === "환불"
                  ? `<span><i class='icon--minus icon'></i>${item.refund
                      .replace(/[^\d]/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>`
                  : item.refund
              }
            </div>
          `
      }

      <div class="payment__cell--actions">
        <button class="btn--icon-utility" aria-label="더보기">
          <div class="icon--dots-three icon"></div>
        </button>
      </div>
    `;
    target.appendChild(row);
  });
}

/* ======================================================================
   💳 initializePaymentsTab() — 결제 탭 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - 결제 탭 HTML 로드 후 테이블 렌더링 및 기능 초기화
   - 상태별 필터링 / 행 수 변경 / 페이지네이션 포함
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - ngAfterViewInit() 시 데이터 fetch 및 탭 초기화
   - <app-dropdown> / <app-pagination> 주입 가능
   ====================================================================== */
export function initializePaymentsTab() {
  const panel = document.getElementById("tab-payments");
  if (!panel) return;

  fetch("./tabs/payments.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      /* --------------------------------------------------
         🧭 탭 초기화
         -------------------------------------------------- */
      const tabSet = panel.querySelector(".payment-status-tab");
      if (tabSet) initializeTabs(tabSet);

      /* --------------------------------------------------
         📊 데이터 분류
         -------------------------------------------------- */
      const paymentList = paymentsData.filter((d) => d.type === "결제");
      const refundList = paymentsData.filter((d) => d.type === "환불");
      const transferList = paymentsData.filter((d) => d.type === "양도");

      /* --------------------------------------------------
         🧱 테이블 렌더링 (상태별)
         -------------------------------------------------- */
      const allWrap = panel.querySelector('[data-type="all"]');
      const payWrap = panel.querySelector('[data-type="payment"]');
      const refundWrap = panel.querySelector('[data-type="refund"]');
      const transferWrap = panel.querySelector('[data-type="transfer"]');

      renderPaymentTable({ target: allWrap, data: paymentsData });
      renderPaymentTable({ target: payWrap, data: paymentList });
      renderPaymentTable({ target: refundWrap, data: refundList });
      renderPaymentTable({ target: transferWrap, data: transferList });

      /* --------------------------------------------------
         🔢 상태별 개수 업데이트
         -------------------------------------------------- */
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-payment-all"]', paymentsData.length);
      updateCount('[data-target="tab-payment-payment"]', paymentList.length);
      updateCount('[data-target="tab-payment-refund"]', refundList.length);
      updateCount('[data-target="tab-payment-transfer"]', transferList.length);

      /* --------------------------------------------------
         📄 페이지네이션 생성
         -------------------------------------------------- */
      const pagination = createPagination(1, 1, "small", (p) => p);
      panel
        .querySelector("#payment-table__pagination")
        ?.appendChild(pagination);

      /* --------------------------------------------------
         📋 행 수 선택 드롭다운
         -------------------------------------------------- */
      createDropdownMenu({
        id: "payment-table-rows-menu",
        size: "xs",
        items: [
          { title: "10줄씩 보기", action: () => setRowsPerPage(10) },
          {
            title: "15줄씩 보기",
            selected: true,
            action: () => setRowsPerPage(15),
          },
          { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
        ],
      });
      initializeDropdowns();
    })
    .catch((err) => console.error("❗️[결제 탭] 로드 실패:", err));
}

/* ======================================================================
   🔢 setRowsPerPage() — 행 수 변경 처리
   ----------------------------------------------------------------------
   ✅ 역할:
   - 드롭다운에서 선택된 행 수를 UI에 반영
   - 실제 데이터 페이징 로직은 추후 추가 예정
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - (change)="onRowsPerPageChange($event)"
   - rowsPerPage: number 상태 관리
   ====================================================================== */
function setRowsPerPage(n) {
  const toggle = document.querySelector(
    ".dropdown__toggle[data-dropdown-target='payment-table-rows-menu']"
  );
  if (toggle) toggle.textContent = `${n}줄씩 보기`;
}
