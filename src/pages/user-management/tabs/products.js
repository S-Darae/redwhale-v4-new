/* ======================================================================
   📦 products.js — 회원 상세 페이지 > 상품 탭
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원의 상품 목록(회원권 / 락커 / 운동복)을 불러와 탭별 렌더링
   - “유효”, “만료”, “전체” 상태별 상품 분류 및 표시
   - 카테고리 토글(접기/펼치기) 및 팝오버 초기화 포함
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-product-list> 컴포넌트로 구성 가능
   - 상품 데이터는 service를 통해 주입
   - ngFor + ngSwitchCase로 상태별 필터링 가능
   - 팝오버는 <app-product-popover>로 컴포넌트화 권장
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - products.scss / tab.scss / card.scss / tooltip.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 및 모듈
   ====================================================================== */
import { createProductCard } from "../../../components/card/create-product-card.js"; // 상품 카드 생성 함수
import { initPopover } from "../../../components/card/popover-init.js"; // 팝오버 초기화
import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";
import "./products.scss";

/* ======================================================================
   📦 상품 데이터 (Mock)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원 상세 페이지 내 표시되는 모든 상품(회원권 / 락커 / 운동복)
   - 상태(유효, 만료, 무제한 등) 및 세부 속성 포함
   - 실제 서비스에서는 API 응답 데이터로 대체 가능
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - ProductService.getUserProducts(userId) 형태로 주입 가능
   - interface Product { id, type, name, startDate, endDate, info, ... }
   ====================================================================== */
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
      { folder: "자세 교정", count: 1, items: ["1:1 자세 교정"] },
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
    info: { type: "예약 미사용", remain: "무제한", total: "무제한" },
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
    info: { type: "예약 미사용", remain: 150, total: 300 },
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
    info: { type: "예약 미사용", remain: 0, total: 1 },
  },
  {
    id: "locker-01",
    type: "locker",
    name: "새해 이벤트 - 12개월",
    startDate: "2025.01.01",
    endDate: "2025.12.31",
    info: { number: "신발장 004" },
  },
  {
    id: "locker-02",
    type: "locker",
    name: "12개월",
    startDate: "2026.01.01",
    endDate: "2026.12.31",
    info: { number: "" },
    memo: "비밀번호 1234",
  },
  {
    id: "locker-03",
    type: "locker",
    name: "1일권",
    startDate: "2025.01.01",
    endDate: "2025.01.02",
    isRefunded: true,
    info: { number: "신발장 004" },
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

/* ======================================================================
   🧩 initializeProductsTab() — 상품 탭 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - HTML 템플릿(products.html) 비동기 로드
   - 상품 데이터를 상태별(전체 / 유효 / 만료)로 분류 후 렌더링
   - 팝오버, 카테고리 토글, 탭 상태 갱신 포함
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - OnInit 시 service 통해 데이터 fetch
   - *ngFor + pipe(filterByStatus)로 렌더링
   - <app-product-card>로 각 상품 표시
   ====================================================================== */
export function initializeProductsTab() {
  const panel = document.getElementById("tab-products");
  if (!panel) return;

  fetch("./tabs/products.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      // ✅ 컨테이너 캐싱
      const allWrap = panel.querySelector('[data-status="all"]');
      const validWrap = panel.querySelector('[data-status="valid"]');
      const expiredWrap = panel.querySelector('[data-status="expired"]');
      if (!allWrap || !validWrap || !expiredWrap) return;

      const today = new Date();

      /* --------------------------------------------------
         🧾 상태별 분류
         -------------------------------------------------- */
      const expiredProducts = products.filter((p) => {
        const end = new Date(p.endDate?.replace(/\./g, "-"));
        return p.isRefunded || (p.endDate !== "무제한" && end < today);
      });
      const validProducts = products.filter((p) => !expiredProducts.includes(p));

      /* --------------------------------------------------
         🗂️ 카테고리별 렌더링 함수
         --------------------------------------------------
         ✅ 역할:
         - 상품을 type 기준(membership, locker, wear)으로 그룹화
         - 그룹별 header + 카드 목록 생성
         -------------------------------------------------- */
      const renderGroupedCards = (list, container) => {
        const categories = {
          membership: list.filter((p) => p.type === "membership"),
          locker: list.filter((p) => p.type === "locker"),
          wear: list.filter((p) => p.type === "wear"),
        };

        const html = Object.entries(categories)
          .map(([type, items]) => {
            if (items.length === 0) return "";

            const typeName =
              type === "membership"
                ? "회원권"
                : type === "locker"
                ? "락커"
                : "운동복";

            const cards = items.map((p) => createProductCard(p).cardHtml).join("");

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

      /* --------------------------------------------------
         🖼️ 실제 렌더링 실행
         -------------------------------------------------- */
      renderGroupedCards(products, allWrap);
      renderGroupedCards(validProducts, validWrap);
      renderGroupedCards(expiredProducts, expiredWrap);

      /* --------------------------------------------------
         💬 팝오버 초기화
         -------------------------------------------------- */
      initPopover({ products });

      /* --------------------------------------------------
         🔢 상태별 개수 업데이트
         -------------------------------------------------- */
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-product-all"]', products.length);
      updateCount('[data-target="tab-product-valid"]', validProducts.length);
      updateCount('[data-target="tab-product-expired"]', expiredProducts.length);

      /* --------------------------------------------------
         📂 카테고리 토글 기능
         --------------------------------------------------
         ✅ 역할:
         - 각 카테고리 헤더 클릭 시 내용 show/hide
         - active + collapsed 클래스로 상태 제어
         -------------------------------------------------- */
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

      /* --------------------------------------------------
         🧭 탭 컴포넌트 초기화
         -------------------------------------------------- */
      const productStatusTab = panel.querySelector(".product-status-tab");
      if (productStatusTab) initializeTabs(productStatusTab);

      /* --------------------------------------------------
         ✅ 디폴트 탭: 유효 상품
         -------------------------------------------------- */
      const validTabBtn = panel.querySelector(
        '.line-tab__tab[data-target="tab-product-valid"]'
      );
      if (validTabBtn) validTabBtn.click();
    })
    .catch((err) => console.error("❗️[상품 탭] 로드 실패:", err));
}
