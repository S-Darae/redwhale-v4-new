/* ======================================================================
   📦 user-sidebar.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 유저 상세정보 사이드바 열기/닫기 제어
   - 유저가 보유한 상품 카드 동적 렌더링 (유효 상품만 표시)
   - 만료 및 환불된 상품 제외 처리
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - <app-user-sidebar> 컴포넌트로 분리 가능
   - @Input() products 로 상품 목록 전달
   - *ngIf / *ngFor로 상품 카드 표시
   - @Output() sidebarToggle = new EventEmitter<boolean>()
   ====================================================================== */

import { createProductCard } from "../../components/card/create-product-card.js";
import { products } from "../user-management/tabs/products.js";

/* ======================================================================
   1️⃣ 사이드바 열기 / 닫기 제어
   ----------------------------------------------------------------------
   ✅ 역할:
   - “유저 상세보기” 버튼 클릭 시 사이드바 열기/닫기
   - 닫기(X) 버튼으로 닫기 가능
   - 사이드바 활성화 시 main content에 .sidebar-open 클래스 추가
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - @HostBinding('class.active') 로 상태 반영
   - toggleSidebar() → this.isOpen = !this.isOpen
   - CSS transition으로 슬라이드 애니메이션 처리
   ====================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".user-sidebar");
  const detailButton = document.querySelector(".user-sidebar-open-btn");
  const closeButton = sidebar.querySelector(".btn--icon-utility");
  const contentWrap = document.getElementById("content");

  /* --------------------------
     📘 사이드바 토글 함수
     - 활성화 상태에 따라 열기/닫기 전환
  -------------------------- */
  function toggleSidebar() {
    const isOpen = sidebar.classList.contains("active");

    if (isOpen) {
      // 닫기 상태 전환
      sidebar.classList.remove("active");
      contentWrap.classList.remove("sidebar-open");
    } else {
      // 열기 상태 전환
      sidebar.classList.add("active");
      contentWrap.classList.add("sidebar-open");
    }
  }

  /* --------------------------
     📘 버튼 이벤트 바인딩
  -------------------------- */
  // 상세보기 버튼 클릭 → 열기/닫기 토글
  detailButton.addEventListener("click", toggleSidebar);

  // 닫기(X) 버튼 클릭 → 강제 닫기
  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("active");
    contentWrap.classList.remove("sidebar-open");
  });
});

/* ======================================================================
   2️⃣ 유저 보유 상품 카드 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - products.js의 상품 데이터 불러와서
     유효 상품만 필터링하여 카드로 렌더링
   - 만료되거나 환불된 상품은 표시하지 않음
   - createProductCard() 활용하여 카드 생성
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - <app-product-card *ngFor="let p of validProducts" [product]="p">
   - expiredProducts / validProducts 계산은 getter 또는 pipe로 처리
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const sidebarList = document.querySelector(
    ".user-sidebar__products .product-card-list"
  );
  if (!sidebarList) return;

  /* --------------------------
     📘 오늘 날짜 기준 상품 분류
     - 만료일(endDate) 또는 환불 상태(isRefunded) 확인
  -------------------------- */
  const today = new Date();

  // 만료 또는 환불 상품 필터링
  const expiredProducts = products.filter((p) => {
    const end = new Date(p.endDate?.replace(/\./g, "-"));
    return p.isRefunded || (p.endDate !== "무제한" && end < today);
  });

  // 유효 상품만 남기기
  const validProducts = products.filter((p) => !expiredProducts.includes(p));

  /* --------------------------
     📘 기존 카드 초기화
  -------------------------- */
  sidebarList.innerHTML = "";

  /* --------------------------
     📘 유효 상품 카드 렌더링
     - createProductCard() 결과의 cardHtml을 추가
     - popover: false (사이드바 내에서는 팝오버 비활성)
  -------------------------- */
  validProducts.forEach((p) => {
    const { cardHtml } = createProductCard({ ...p, popover: false });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml;

    // 첫 번째 요소만 append
    sidebarList.appendChild(wrapper.firstElementChild);
  });

  /* --------------------------
     📘 유효 상품이 없는 경우 처리
     - empty-text 메시지 표시
  -------------------------- */
  if (validProducts.length === 0) {
    sidebarList.innerHTML = `
      <p class="empty-text">유효한 상품이 없습니다.</p>
    `;
  }
});
