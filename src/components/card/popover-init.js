/**
 *
 * ✅ 기능 요약
 * -----------------------------------------------------
 * - 수업 / 회원권 / 상품 카드 클릭 시 상세 팝오버를 동적으로 생성하고 표시함
 * - 외부 클릭, 스크롤, 리사이즈 시 팝오버 자동 닫힘
 * - 체크박스/옵션 카드와 팝오버 간의 이벤트 충돌을 완전히 방지
 *
 * ✅ 주요 특징
 * -----------------------------------------------------
 * - 한 번에 하나의 팝오버만 표시 (중복 방지)
 * - 데이터(수업/회원권/상품)는 initPopover() 호출 시 전달받아 전역 저장
 * - document 단위의 이벤트 위임으로 동적 요소도 자동 반응
 * - 옵션 카드(`membership-card-detail-row`) 클릭 시 팝오버 무시
 * - 체크박스 카드(`checkbox-mode`) 클릭 시 팝오버 열리지 않음
 */

import { createClassDetailPopover } from "./create-class-popover.js";
import { createMembershipDetailPopover } from "./create-membership-popover.js";
import { createProductPopover } from "./create-product-popover.js";

/* =====================================================
   🔧 상태 변수
   ===================================================== */
let activeCard = null; // 현재 팝오버가 열린 카드 요소
let activePopover = null; // 현재 열린 팝오버 DOM
let classData = []; // 수업 카드 데이터
let membershipData = []; // 회원권 카드 데이터
let productData = []; // 상품 카드 데이터
let isInitialized = false; // 이벤트 중복 등록 방지 플래그

/**
 * =====================================================
 * 🧩 initPopover({ classes, memberships, products })
 * =====================================================
 *
 * 📌 페이지 진입 시 반드시 1회 호출해야 함
 *  - 각 카드 타입별 데이터 배열을 전달받아 팝오버 생성 시 참조
 *  - 이벤트 리스너(document click, resize, scroll)는 최초 1회만 등록됨
 *
 * @param {Object} options
 * @param {Array} [options.classes=[]]     - 수업 카드 데이터 배열
 * @param {Array} [options.memberships=[]] - 회원권 카드 데이터 배열
 * @param {Array} [options.products=[]]    - 상품 카드 데이터 배열
 */
export function initPopover({
  classes = [],
  memberships = [],
  products = [],
} = {}) {
  // 최신 데이터로 갱신 (다른 페이지에서 재호출 시 반영됨)
  classData = classes;
  membershipData = memberships;
  productData = products;

  /**
   * =====================================================
   * 🎯 openPopover(card, type)
   * =====================================================
   *
   * @param {HTMLElement} card - 클릭된 카드 요소
   * @param {"class"|"membership"|"product"} type - 카드 종류
   *
   * - 기존 열린 팝오버가 있으면 먼저 닫음
   * - 카드 위치 기준으로 팝오버를 body에 절대 위치시킴
   * - 닫기 버튼(.x-btn) 클릭 시 closePopover() 실행
   */
  function openPopover(card, type) {
    // 이미 열린 팝오버가 있으면 닫기
    closePopover();

    let popoverEl = null;

    // 타입별 팝오버 생성
    if (type === "membership") {
      const data = membershipData.find((m) => m.id === card.dataset.id);
      if (data) popoverEl = createMembershipDetailPopover(data);
    } else if (type === "class") {
      const data = classData.find((c) => c.id === card.dataset.id);
      if (data) popoverEl = createClassDetailPopover(data);
    } else if (type === "product") {
      const data = productData.find((p) => p.id === card.dataset.id);
      if (data) popoverEl = createProductPopover(data);
    }

    // 데이터가 없으면 종료
    if (!popoverEl) return;

    // 문자열이면 DOM 변환 후 body에 추가
    if (typeof popoverEl === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = popoverEl.trim();
      popoverEl = wrapper.firstElementChild;
    }

    document.body.appendChild(popoverEl);

    // 위치 계산 (렌더 후 적용)
    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;
      const popoverWidth = 390;
      const popoverHeight = popoverEl.offsetHeight;

      const isRight = rect.left + rect.width / 2 > window.innerWidth / 2;
      const left = isRight
        ? rect.left + scrollLeft - popoverWidth - 8
        : rect.right + scrollLeft + 8;

      const rawTop = rect.top + scrollTop;
      const maxTop = scrollTop + window.innerHeight - popoverHeight - 8;
      const top = Math.min(rawTop, maxTop);

      popoverEl.style.position = "absolute";
      popoverEl.style.left = `${Math.max(
        8,
        Math.min(left, window.innerWidth - popoverWidth - 8)
      )}px`;
      popoverEl.style.top = `${Math.max(8, top)}px`;
      popoverEl.style.zIndex = "1000";
      popoverEl.classList.add(isRight ? "left" : "right");
    });

    // 상태 갱신
    activeCard = card;
    activePopover = popoverEl;
    card.classList.add("popover-is-active");

    // 닫기 버튼 이벤트 바인딩
    popoverEl.querySelector(".x-btn")?.addEventListener("click", closePopover);
  }

  /**
   * =====================================================
   * ❌ closePopover()
   * =====================================================
   *
   * - 현재 열린 팝오버 제거
   * - 모든 카드에서 활성 클래스 제거
   */
  function closePopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }

    document
      .querySelectorAll(
        ".membership-card.popover-is-active, .class-card.popover-is-active, .product-card.popover-is-active"
      )
      .forEach((c) => c.classList.remove("popover-is-active"));

    activeCard = null;
  }

  /**
   * =====================================================
   * 🧭 이벤트 등록 (최초 1회만)
   * =====================================================
   */
  if (!isInitialized) {
    document.addEventListener("click", (e) => {
      const membershipCard = e.target.closest(".membership-card");
      const classCard = e.target.closest(".class-card");
      const productCard = e.target.closest(".product-card");

      /* -----------------------------------------------------
         1️⃣ 카드 외부 클릭 → 팝오버 닫기
         ----------------------------------------------------- */
      if (!membershipCard && !classCard && !productCard) {
        if (!activePopover?.contains(e.target)) closePopover();
        return;
      }

      /* -----------------------------------------------------
         2️⃣ 옵션 체크박스 row 클릭 시 → 팝오버 무시
         -----------------------------------------------------
         - 옵션 카드(`option-checkbox-mode`) 내부의 
           `.membership-card-detail-row` 클릭은 
           체크 토글만 수행하고 팝오버에 영향을 주지 않음.
      ----------------------------------------------------- */
      if (membershipCard && e.target.closest(".membership-card-detail-row")) {
        return; // 팝오버 열기/닫기 아무 영향 없음
      }

      /* -----------------------------------------------------
         3️⃣ 현재 클릭된 카드 및 타입 판별
         ----------------------------------------------------- */
      const card = membershipCard || classCard || productCard;
      if (!card) return; //
      const type = membershipCard
        ? "membership"
        : classCard
        ? "class"
        : "product";

      const checkboxInput = card.querySelector('input[type="checkbox"]');

      /* -----------------------------------------------------
   4️⃣ 체크박스 모드 → 팝오버와 완전히 분리
   -----------------------------------------------------
   - `.checkbox-mode` 상태에서는 팝오버 로직을 전혀 실행하지 않음
   - 카드 선택(토글)은 다른 공통 스크립트(card-toggle-common.js)에서 처리
----------------------------------------------------- */
      if (card.classList.contains("checkbox-mode")) {
        return; // ✅ 이 한 줄로 충분 (팝오버 측에서 클릭 무시)
      }
      /* -----------------------------------------------------
         5️⃣ popover=false → 팝오버 열지 않음
         ----------------------------------------------------- */
      if (card.dataset.popover === "false") return;

      /* -----------------------------------------------------
         6️⃣ 같은 카드 다시 클릭 → 팝오버 닫기
         ----------------------------------------------------- */
      if (activeCard === card) {
        closePopover();
        return;
      }

      /* -----------------------------------------------------
         7️⃣ 새로운 카드 클릭 → 팝오버 열기
         ----------------------------------------------------- */
      openPopover(card, type);
    });

    /* -----------------------------------------------------
       8️⃣ 브라우저 리사이즈 / 스크롤 → 팝오버 자동 닫기
       ----------------------------------------------------- */
    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopover, { passive: true });

    isInitialized = true; // 중복 등록 방지
  }
}
