/* ======================================================================
   📦 user-detail-tab.js — 회원 상세 탭 로딩 및 홈 프리뷰 렌더링
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원 상세 페이지의 탭(상품 / 출석 / 결제 / 조정) 동적 로드
   - 각 탭 모듈의 initialize 함수 호출
   - 홈 탭에서 상품, 출석, 결제, 조정 내역을 미리보기 형태로 표시
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-user-detail-tabs> 컴포넌트로 구성 가능
   - 각 탭은 Lazy-loaded 모듈 또는 <ng-container *ngSwitchCase> 구조로 분리
   - 미리보기 섹션은 별도 <app-preview-card-list> 컴포넌트로 분리 권장
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - user-detail.scss / tab.scss / product-card.scss / table.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 및 탭 모듈
   ====================================================================== */
import { createProductCard } from "../../components/card/create-product-card.js";
import { initPopover } from "../../components/card/popover-init.js";
import "../../components/card/product-card.js";
import { adjustmentData, renderAdjustmentTable } from "./tabs/adjustment.js";
import { attendanceData, renderAttendanceTable } from "./tabs/attendance.js";
import { paymentsData, renderPaymentTable } from "./tabs/payments.js";
import { products } from "./tabs/products.js";

/* ======================================================================
   📑 회원 상세 탭 로딩 (공통 탭 컴포넌트 기반)
   ----------------------------------------------------------------------
   ✅ 역할:
   - tab.js에서 발생하는 “tab-updated” 커스텀 이벤트 수신
   - 탭별 JS 모듈을 비동기 import 후 초기화 함수 호출
   - 각 탭 로직은 모듈 내부에서 분리 관리됨
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - Router outlet 또는 *ngIf 기반 Lazy-load 처리
   - 탭 전환 시 loadChildren 로직으로 교체 가능
   ====================================================================== */
import "../../components/tab/tab.js";

document.addEventListener("tab-updated", async (e) => {
  const { targetId } = e.detail;

  try {
    switch (targetId) {
      case "tab-home":
        // 🏠 홈 탭 — 별도 로직이 필요한 경우 여기에 작성
        break;

      case "tab-products": {
        // 🧾 상품 탭 로딩
        const module = await import("./tabs/products.js");
        module.initializeProductsTab?.();
        break;
      }

      case "tab-attendance": {
        // 🕒 출석 탭 로딩
        const module = await import("./tabs/attendance.js");
        module.initializeAttendanceTab?.();
        break;
      }

      case "tab-payments": {
        // 💳 결제 탭 로딩
        const module = await import("./tabs/payments.js");
        module.initializePaymentsTab?.();
        break;
      }

      case "tab-adjustment": {
        // 🔁 홀딩 / 연장 / 양도 탭 로딩
        const module = await import("./tabs/adjustment.js");
        module.initializeAdjustmentTab?.();
        break;
      }
    }
  } catch (err) {
    console.error(`❗️[${targetId}] 탭 로딩 중 오류:`, err);
  }
});

/* ======================================================================
   🏠 홈 탭 > 상품 프리뷰 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원이 보유한 상품 중 일부만 프리뷰 형태로 카드 렌더링
   - 팝오버 활성화(initPopover)
   - “모두 보기” 버튼 클릭 시 → 상품 탭으로 전환
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-product-card-list [limit]="4"> 형태로 컴포넌트화 가능
   - “모두 보기”는 routerLink="/user-detail/products" 로 대체
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector("#home-product-preview");
  if (!previewContainer) return;

  // 표시할 상품 ID 지정
  const targetIds = ["membership-01", "membership-02", "locker-02", "wear-01"];
  const previewProducts = products.filter((p) => targetIds.includes(p.id));

  // 상품 카드 렌더링
  previewProducts.forEach((p) => {
    const { cardHtml } = createProductCard({ ...p, popover: true });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml;
    previewContainer.appendChild(wrapper.firstElementChild);
  });

  // 팝오버 초기화 (홈 탭에서도 동작)
  requestAnimationFrame(() => {
    initPopover({ products });
  });

  // “모두 보기” 버튼 → 상품 탭 전환
  const viewAllBtn = document.querySelector(".product-view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      const productTabBtn = document.querySelector(
        '.line-tab__tab[data-target="tab-products"]'
      );
      if (productTabBtn) productTabBtn.click();
    });
  }
});

/* ======================================================================
   🕒 홈 탭 > 출석 내역 프리뷰 (최대 7줄)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 최근 7개의 출석 기록만 미리보기 형태로 표시
   - 기존 테이블 구조(renderAttendanceTable) 재활용
   - “모두 보기” 클릭 시 → 출석 탭으로 이동
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-attendance-preview [limit]="7"> 형태로 구성 가능
   - 클릭 시 routerLink="/user-detail/attendance"
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const attendancePreview = document.querySelector("#home-attendance-preview");
  if (!attendancePreview) return;

  // 최근 7건만 표시
  const recentData = attendanceData.slice(0, 7);

  // 기존 테이블 렌더링 함수 재사용 (isPreview: true)
  renderAttendanceTable({
    target: attendancePreview,
    data: recentData,
    isPreview: true,
  });

  // “모두 보기” 버튼 → 출석 탭 이동
  const viewAllBtn = document.querySelector(".attendance-view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      const attendanceTabBtn = document.querySelector(
        '.line-tab__tab[data-target="tab-attendance"]'
      );
      if (attendanceTabBtn) attendanceTabBtn.click();
    });
  }
});

/* ======================================================================
   💳 홈 탭 > 결제 내역 프리뷰 (7줄, 금액 통합)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 최근 7건의 결제 내역을 미리보기 형태로 표시
   - 금액 통합 표시 및 테이블 재활용
   - “모두 보기” 클릭 시 → 결제 탭으로 이동
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-payment-preview [limit]="7"> 형태로 컴포넌트화
   - routerLink="/user-detail/payments"
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const paymentPreview = document.querySelector("#home-payment-preview");
  if (!paymentPreview) return;

  // 최근 7건만 표시
  const recentPayments = paymentsData.slice(0, 7);

  // 기존 테이블 렌더링 함수 재사용
  renderPaymentTable({
    target: paymentPreview,
    data: recentPayments,
    isPreview: true,
  });

  // “모두 보기” 버튼 → 결제 탭 이동
  const viewAllBtn = document.querySelector(".payment-view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      const paymentTabBtn = document.querySelector(
        '.line-tab__tab[data-target="tab-payments"]'
      );
      if (paymentTabBtn) paymentTabBtn.click();
    });
  }
});

/* ======================================================================
   🔁 홈 탭 > 홀딩/연장/양도 내역 프리뷰 (7줄)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 최근 7건의 조정(홀딩/연장/양도) 내역만 표시
   - 기존 renderAdjustmentTable() 함수 재활용
   - “모두 보기” 클릭 시 → 조정 탭 이동
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-adjustment-preview [limit]="7"> 형태로 컴포넌트화
   - routerLink="/user-detail/adjustment"
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const adjustmentPreview = document.querySelector("#home-adjustment-preview");
  if (!adjustmentPreview) return;

  // 최근 7건만 표시
  const recentData = adjustmentData.slice(0, 7);

  // 테이블 렌더링 (미리보기 모드)
  renderAdjustmentTable({
    target: adjustmentPreview,
    data: recentData,
    isPreview: true,
  });

  // “모두 보기” 버튼 → 조정 탭 이동
  const viewAllBtn = document.querySelector(".adjustment-view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      const adjustmentTabBtn = document.querySelector(
        '.line-tab__tab[data-target="tab-adjustment"]'
      );
      if (adjustmentTabBtn) adjustmentTabBtn.click();
    });
  }
});
