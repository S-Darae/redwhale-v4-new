/* =====================================================
   📦 상품 페이지 (products.js)
   ===================================================== */

import { createProductCard } from "../../../components/card/create-product-card.js";
import { initPopover } from "../../../components/card/popover-init.js";
import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";
import "./products.scss";

/* ==========================
   📦 상품 데이터
   ========================== */
export const products = [
  {
    id: "membership-01",
    type: "membership",
    name: "새해 이벤트 - 12개월",
    startDate: "2025.01.01",
    endDate: "2025.12.31",
    isRefunded: false,
    transfer: [{ startDate: "2026.01.01", target: "김태형" }],
    holding: [
      { startDate: "2025.10.01", endDate: "2025.11.30" },
      { startDate: "2025.05.01", endDate: "2025.05.15" },
    ],
    info: {
      type: "예약 사용",
      remain: 100,
      total: 300,
      reservation: {
        today: { used: 1, total: 1 },
        week: { used: 5, total: 7 },
        concurrent: { used: "무제한" },
        cancel: { used: 7, total: 10 },
      },
    },
    tickets: [
      {
        folder: "다이어트 1",
        count: 6,
        items: [
          "다이어트 1:1 오전반",
          "다이어트 1:2 오전반",
          "다이어트 1:3 오전반",
          "다이어트 1:1 오후반",
          "다이어트 1:2 오후반",
          "다이어트 1:3 오후반",
        ],
      },
      {
        folder: "자세 교정",
        count: 1,
        items: ["1:1 자세 교정"],
      },
    ],
    memo: "2025년 1월 ~ 2월 판매 한정",
  },
  {
    id: "membership-02",
    type: "membership",
    name: "무제한 이용권",
    startDate: "2025.03.01",
    endDate: "무제한",
    isRefunded: false,
    transfer: [],
    holding: [],
    info: {
      type: "예약 미사용",
      remain: "무제한",
      total: "무제한",
    },
  },
  {
    id: "membership-03",
    type: "membership",
    name: "2년 150회권",
    startDate: "2026.01.01",
    endDate: "2028.12.31",
    isRefunded: false,
    transfer: [],
    holding: [],
    info: {
      type: "예약 미사용",
      remain: 150,
      total: 300,
    },
  },
  {
    id: "membership-04",
    type: "membership",
    name: "1일권",
    startDate: "2025.01.01",
    endDate: "2025.01.02",
    isRefunded: false,
    transfer: [],
    holding: [],
    info: {
      type: "예약 미사용",
      remain: 0,
      total: 1,
    },
  },
  {
    id: "locker-01",
    type: "locker",
    name: "새해 이벤트 - 12개월",
    startDate: "2025.01.01",
    endDate: "2025.12.31",
    info: {
      number: "신발장 004",
    },
  },
  {
    id: "locker-02",
    type: "locker",
    name: "12개월",
    startDate: "2026.01.01",
    endDate: "2026.12.31",
    info: {
      number: "",
    },
    memo: "비밀번호 1234",
  },
  {
    id: "locker-03",
    type: "locker",
    name: "1일권",
    startDate: "2025.01.01",
    endDate: "2025.01.02",
    isRefunded: true,
    info: {
      number: "신발장 004",
    },
    memo: "",
  },
  {
    id: "wear-01",
    type: "wear",
    name: "12개월",
    startDate: "2026.01.01",
    endDate: "2026.12.31",
  },
  {
    id: "wear-02",
    type: "wear",
    name: "1일권",
    startDate: "2025.01.01",
    endDate: "2025.01.02",
  },
];

/* ==========================
   🧩 상품 탭 초기화
   ========================== */
export function initializeProductsTab() {
  const panel = document.getElementById("tab-products");
  if (!panel) return;

  fetch("./tabs/products.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      const allWrap = panel.querySelector('[data-status="all"]');
      const validWrap = panel.querySelector('[data-status="valid"]');
      const expiredWrap = panel.querySelector('[data-status="expired"]');

      if (!allWrap || !validWrap || !expiredWrap) return;

      const today = new Date();

      /* --------------------------
         상태별 분류
         -------------------------- */
      const expiredProducts = products.filter((p) => {
        const end = new Date(p.endDate?.replace(/\./g, "-"));
        return p.isRefunded || (p.endDate !== "무제한" && end < today);
      });

      const validProducts = products.filter(
        (p) => !expiredProducts.includes(p)
      );

      /* --------------------------
         📦 카테고리별 렌더링 함수
         -------------------------- */
      const renderGroupedCards = (list, container) => {
        // 타입별 그룹핑
        const categories = {
          membership: list.filter((p) => p.type === "membership"),
          locker: list.filter((p) => p.type === "locker"),
          wear: list.filter((p) => p.type === "wear"),
        };

        // HTML 생성
        const html = Object.entries(categories)
          .map(([type, items]) => {
            if (items.length === 0) return "";

            const typeName =
              type === "membership"
                ? "회원권"
                : type === "locker"
                ? "락커"
                : "운동복";

            const cards = items
              .map((p) => createProductCard(p).cardHtml)
              .join("");

            return `
              <div class="product-category">
                <button class="product-category__toggle active" data-type="${type}">
                ${typeName}
                <i class="icon--caret-down icon"></i>
                </button>
                <div class="product-category__content">
                  ${cards}
                </div>
              </div>
            `;
          })
          .join("");

        container.innerHTML = html;
      };

      /* --------------------------
         렌더링 실행
         -------------------------- */
      renderGroupedCards(products, allWrap);
      renderGroupedCards(validProducts, validWrap);
      renderGroupedCards(expiredProducts, expiredWrap);

      /* --------------------------
         팝오버 초기화
         -------------------------- */
      initPopover({ products });

      /* --------------------------
         개수 업데이트
         -------------------------- */
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-product-all"]', products.length);
      updateCount('[data-target="tab-product-valid"]', validProducts.length);
      updateCount(
        '[data-target="tab-product-expired"]',
        expiredProducts.length
      );

      /* --------------------------
         카테고리 토글 기능
         -------------------------- */
      const initCategoryToggles = (panel) => {
        panel.querySelectorAll(".product-category__toggle").forEach((btn) => {
          btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            const content = btn.nextElementSibling;
            content.classList.toggle("collapsed");
          });
        });
      };
      initCategoryToggles(panel);

      /* --------------------------
         탭 초기화
         -------------------------- */
      const productStatusTab = panel.querySelector(".product-status-tab");
      if (productStatusTab) initializeTabs(productStatusTab);

      /* --------------------------
         디폴트 탭: 유효
         -------------------------- */
      const validTabBtn = panel.querySelector(
        '.line-tab__tab[data-target="tab-product-valid"]'
      );
      if (validTabBtn) validTabBtn.click();
    })
    .catch((err) => console.error("❗️[상품 탭] 로드 실패:", err));
}
