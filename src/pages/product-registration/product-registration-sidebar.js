/* =====================================================
   📦 User Sidebar (유저 상세 정보 사이드바)
   - 사이드바 열기 / 닫기 토글
   - 상품 카드 동적 렌더링 (유효 상품만 표시)

   - 좌측 사이드바 사용이 드물어서 컴포넌트화 할지말지 고민중
===================================================== */

import { createProductCard } from "../../components/card/create-product-card.js";
import { products } from "../user-management/tabs/products.js";

/* =====================================================
   1️⃣ 사이드바 열기 / 닫기 제어
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".user-sidebar");
  const detailButton = document.querySelector(".user-sidebar-open-btn");
  const closeButton = sidebar.querySelector(".btn--icon-utility");
  const contentWrap = document.getElementById("content");

  /* --------------------------
     사이드바 토글 함수
  -------------------------- */
  function toggleSidebar() {
    const isOpen = sidebar.classList.contains("active");

    if (isOpen) {
      // 닫기 상태로 전환
      sidebar.classList.remove("active");
      contentWrap.classList.remove("sidebar-open");
    } else {
      // 열기 상태로 전환
      sidebar.classList.add("active");
      contentWrap.classList.add("sidebar-open");
    }
  }

  /* --------------------------
     버튼 이벤트 바인딩
  -------------------------- */
  // 상세 버튼 클릭 시 → 열기/닫기 토글
  detailButton.addEventListener("click", toggleSidebar);

  // 닫기(X) 버튼 클릭 시 → 강제 닫기
  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("active");
    contentWrap.classList.remove("sidebar-open");
  });
});

/* =====================================================
   2️⃣ 유저 보유 상품 카드 렌더링
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const sidebarList = document.querySelector(
    ".user-sidebar__products .product-card-list"
  );
  if (!sidebarList) return;

  /* --------------------------
     오늘 날짜 기준으로 상품 상태 분류
  -------------------------- */
  const today = new Date();

  // 만료된 상품 또는 환불 상품 필터링
  const expiredProducts = products.filter((p) => {
    const end = new Date(p.endDate?.replace(/\./g, "-"));
    return p.isRefunded || (p.endDate !== "무제한" && end < today);
  });

  // 유효 상품만 남기기
  const validProducts = products.filter((p) => !expiredProducts.includes(p));

  /* --------------------------
     기존 카드 초기화
  -------------------------- */
  sidebarList.innerHTML = "";

  /* --------------------------
     유효 상품 렌더링
  -------------------------- */
  validProducts.forEach((p) => {
    // 팝오버 비활성화 상태로 카드 생성
    const { cardHtml } = createProductCard({ ...p, popover: false });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml;

    // 첫 번째 요소만 append
    sidebarList.appendChild(wrapper.firstElementChild);
  });

  /* --------------------------
     유효 상품이 없는 경우
  -------------------------- */
  if (validProducts.length === 0) {
    sidebarList.innerHTML = `
      <p class="empty-text">유효한 상품이 없습니다.</p>
    `;
  }
});
