// =====================================================
// 📦 Import
// =====================================================
import { createPagination } from "../../../components/button/create-pagination.js";
import "../../../components/button/pagination.scss";
import { createDropdownMenu } from "../../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../../components/dropdown/dropdown-init.js";
import "../../../components/dropdown/dropdown.scss";
import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";
import "./payments.scss";

// =====================================================
// 📊 결제 내역 데이터
// =====================================================
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

// =====================================================
// 🧩 테이블 렌더링 함수
// =====================================================
export function renderPaymentTable({ target, data, isPreview = false }) {
  if (!target) return;
  target.innerHTML = "";

  // ---------------------------
  // 🧱 테이블 헤더
  // ---------------------------
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

  // ---------------------------
  // 📊 데이터 렌더링
  // ---------------------------
  const typeClassMap = {
    결제: "badge--payment",
    환불: "badge--refund",
    양도: "badge--transfer",
  };

  data.forEach((item) => {
    item.typeClass = typeClassMap[item.type] || "badge--default";

    // 상품 유형 자동 생성 (내부용)
    const uniqueTypes = [...new Set(item.products.map((p) => p.type))];
    item.productType = uniqueTypes.join(", ");

    // ✅ 금액 포맷팅
    const isRefund = item.type === "환불";

    // 환불일 경우: 아이콘 자동 추가
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

    // 상품 이름 (회원권/락커/운동복 모두 표시)
    const typeInitialMap = {
      회원권: "회",
      락커: "락",
      운동복: "운",
    };

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

    const row = document.createElement("div");
    row.className = "payment__table payment__table--body";

    row.innerHTML = `
      <div class="payment__cell--date">${item.date}</div>
      <div class="payment__cell--type badge ${item.typeClass}">${
      item.type
    }</div>
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

// =====================================================
// 📊 결제 탭 초기화
// =====================================================
export function initializePaymentsTab() {
  const panel = document.getElementById("tab-payments");
  if (!panel) return;

  fetch("./tabs/payments.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;
      const tabSet = panel.querySelector(".payment-status-tab");
      if (tabSet) initializeTabs(tabSet);

      const paymentList = paymentsData.filter((d) => d.type === "결제");
      const refundList = paymentsData.filter((d) => d.type === "환불");
      const transferList = paymentsData.filter((d) => d.type === "양도");

      const allWrap = panel.querySelector('[data-type="all"]');
      const payWrap = panel.querySelector('[data-type="payment"]');
      const refundWrap = panel.querySelector('[data-type="refund"]');
      const transferWrap = panel.querySelector('[data-type="transfer"]');

      renderPaymentTable({ target: allWrap, data: paymentsData });
      renderPaymentTable({ target: payWrap, data: paymentList });
      renderPaymentTable({ target: refundWrap, data: refundList });
      renderPaymentTable({ target: transferWrap, data: transferList });

      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-payment-all"]', paymentsData.length);
      updateCount('[data-target="tab-payment-payment"]', paymentList.length);
      updateCount('[data-target="tab-payment-refund"]', refundList.length);
      updateCount('[data-target="tab-payment-transfer"]', transferList.length);

      const pagination = createPagination(1, 1, "small", (p) =>
        console.log("페이지:", p)
      );
      panel
        .querySelector("#payment-table__pagination")
        ?.appendChild(pagination);

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
      console.log("✅ [결제 탭] 초기화 완료");
    })
    .catch((err) => console.error("❗️[결제 탭] 로드 실패:", err));
}

// =====================================================
// 🔢 행 수 변경 처리
// =====================================================
function setRowsPerPage(n) {
  const toggle = document.querySelector(
    ".dropdown__toggle[data-dropdown-target='payment-table-rows-menu']"
  );
  if (toggle) toggle.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}
