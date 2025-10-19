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

import "./adjustment.scss";

// =====================================================
// 📊 홀딩/연장/양도 내역 데이터
// =====================================================
export const adjustmentData = [
  {
    date: "2025.01.01 (월) 00:00",
    type: "양도예정",
    productType: "회원권",
    staff: "이휘경",
    products: [{ name: "새해 이벤트 12개월", type: "회원권" }],
    period: "2025.01.01부터 이도연에게",
    reason: "타지역 이사로 인해 회원권 유지 불가",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "양도",
    productType: "회원권",
    staff: "이휘경",
    products: [{ name: "새해 이벤트 1개월", type: "회원권" }],
    period: "2025.01.01부터 김지훈에게",
    reason: "고객 변심",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "홀딩예정",
    productType: "운동복",
    staff: "이휘경",
    products: [{ name: "12개월", type: "운동복" }],
    period: "2025.00.00~2025.00.00 (00일)",
    reason: "",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "홀딩중",
    productType: "락커",
    staff: "이휘경",
    products: [{ name: "12개월", type: "락커" }],
    period: "2025.00.00~2025.00.00 (00일)",
    reason: "",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "홀딩만료",
    productType: "회원권",
    staff: "이휘경",
    products: [{ name: "새해 이벤트 12개월", type: "회원권" }],
    period: "2025.00.00~2025.00.00 (00일)",
    reason: "",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "연장",
    productType: "회원권, 락커, 운동복",
    staff: "이휘경",
    products: [
      { name: "새해 이벤트 12개월", type: "회원권" },
      { name: "12개월", type: "락커" },
      { name: "12개월", type: "운동복" },
    ],
    period: "30일",
    reason: "",
  },
].map((item) => {
  // ✅ type에 따라 badgeClass 자동 지정
  let badgeClass = "badge--default";

  if (item.type.includes("양도")) badgeClass = "badge--transfer";
  else if (item.type.includes("홀딩")) badgeClass = "badge--holding";
  else if (item.type.includes("연장")) badgeClass = "badge--extension";

  return { ...item, badgeClass };
});

// =====================================================
// 🧩 테이블 렌더링 함수 (상품 유형 제거 버전)
// =====================================================
export function renderAdjustmentTable({ target, data, isPreview = false }) {
  if (!target) return;
  target.innerHTML = "";

  const header = document.createElement("div");
  header.className = "adjustment__table adjustment__table--head";
  header.innerHTML = `
    <div class="adjustment__cell--date">일시</div>
    <div class="adjustment__cell--type">구분</div>
    <div class="adjustment__cell--product">상품</div>
    <div class="adjustment__cell--period">기간</div>
    <div class="adjustment__cell--reason">사유</div>
    <div class="adjustment__cell--actions"></div>
  `;
  target.appendChild(header);

  const typeInitialMap = { 회원권: "회", 락커: "락", 운동복: "운" };

  data.forEach((item) => {
    const row = document.createElement("div");
    row.className = "adjustment__table adjustment__table--body";

    const productHtml = item.products
      .map((p) => {
        const shortType = typeInitialMap[p.type] || "";
        const fullType = p.type || "";
        return `
          <p>
            <span class="product-type" data-tooltip="${fullType}" data-tooltip-direction="left">${shortType}</span>
            ${p.name}
          </p>`;
      })
      .join("");

    row.innerHTML = `
      <div class="adjustment__cell--date">${item.date}</div>
      <div class="adjustment__cell--type badge ${item.badgeClass}">${
      item.type
    }</div>
      <div class="adjustment__cell--product ${
        item.products.length > 1 ? "product-item--multi" : ""
      }">
        ${productHtml}
      </div>
      <div class="adjustment__cell--period">${item.period}</div>
      <div class="adjustment__cell--reason">${item.reason || "-"}</div>
      <div class="adjustment__cell--actions">
        <button class="btn--icon-utility" aria-label="더보기">
          <div class="icon--dots-three icon"></div>
        </button>
      </div>
    `;

    target.appendChild(row);
  });
}

// =====================================================
// ⚙️ 탭 초기화
// =====================================================
export function initializeAdjustmentTab() {
  const panel = document.getElementById("tab-adjustment");
  if (!panel) return;

  fetch("./tabs/adjustment.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      // ✅ 탭 세트 초기화
      const tabSet = panel.querySelector(".adjustment-status-tab");
      if (tabSet) initializeTabs(tabSet);

      // ✅ 데이터 분류
      const holdingList = adjustmentData.filter((d) => d.type.includes("홀딩"));
      const extensionList = adjustmentData.filter((d) =>
        d.type.includes("연장")
      );
      const transferList = adjustmentData.filter((d) =>
        d.type.includes("양도")
      );

      // ✅ 컨테이너 찾기
      const allWrap = panel.querySelector('[data-type="all"]');
      const holdingWrap = panel.querySelector('[data-type="holding"]');
      const extensionWrap = panel.querySelector('[data-type="extension"]');
      const transferWrap = panel.querySelector('[data-type="transfer"]');

      // ✅ 테이블 렌더링
      renderAdjustmentTable({ target: allWrap, data: adjustmentData });
      renderAdjustmentTable({ target: holdingWrap, data: holdingList });
      renderAdjustmentTable({ target: extensionWrap, data: extensionList });
      renderAdjustmentTable({ target: transferWrap, data: transferList });

      // ✅ 카운트 업데이트
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-adjustment-all"]', adjustmentData.length);
      updateCount('[data-target="tab-adjustment-holding"]', holdingList.length);
      updateCount(
        '[data-target="tab-adjustment-extension"]',
        extensionList.length
      );
      updateCount(
        '[data-target="tab-adjustment-transfer"]',
        transferList.length
      );

      // ✅ 페이지네이션
      const pagination = createPagination(1, 1, "small", (p) =>
        console.log("페이지:", p)
      );
      panel
        .querySelector("#adjustment-table__pagination")
        ?.appendChild(pagination);

      // ✅ 드롭다운
      createDropdownMenu({
        id: "adjustment-table-rows-menu",
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

      console.log("✅ [홀딩/연장/양도 탭] 초기화 완료");
    })
    .catch((err) => console.error("❗️[홀딩/연장/양도 탭] 로드 실패:", err));
}

// =====================================================
// 🔢 행 수 변경 처리
// =====================================================
function setRowsPerPage(n) {
  const toggle = document.querySelector(
    ".dropdown__toggle[data-dropdown-target='adjustment-table-rows-menu']"
  );
  if (toggle) toggle.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}
