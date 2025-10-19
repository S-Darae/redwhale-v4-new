import { createProductCard } from "../../components/card/create-product-card.js";
import { initPopover } from "../../components/card/popover-init.js";
import "../../components/card/product-card.js";
import { adjustmentData, renderAdjustmentTable } from "./tabs/adjustment.js";
import { attendanceData, renderAttendanceTable } from "./tabs/attendance.js";
import { paymentsData, renderPaymentTable } from "./tabs/payments.js";
import { products } from "./tabs/products.js";

/* =====================================================
   회원 상세 탭 로딩 (공통 탭 컴포넌트 기반)
   ===================================================== */
import "../../components/tab/tab.js";

document.addEventListener("tab-updated", async (e) => {
  const { targetId } = e.detail;

  try {
    switch (targetId) {
      case "tab-home":
        // 홈 탭 초기화 시 별도 로직 필요하면 여기에
        break;

      case "tab-products": {
        const module = await import("./tabs/products.js");
        module.initializeProductsTab?.();
        break;
      }

      case "tab-attendance": {
        const module = await import("./tabs/attendance.js");
        module.initializeAttendanceTab?.();
        break;
      }

      case "tab-payments": {
        const module = await import("./tabs/payments.js");
        module.initializePaymentsTab?.();
        break;
      }

      case "tab-adjustment": {
        const module = await import("./tabs/adjustment.js");
        module.initializeAdjustmentTab?.();
        break;
      }
    }
  } catch (err) {
    console.error(`❗️[${targetId}] 탭 로딩 중 오류:`, err);
  }
});

/* =====================================================
   홈 > 상품 프리뷰 렌더링
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector("#home-product-preview");
  if (!previewContainer) return;

  // ✅ 표시할 카드 ID 지정
  const targetIds = ["membership-01", "membership-02", "locker-02", "wear-01"];
  const previewProducts = products.filter((p) => targetIds.includes(p.id));

  // ✅ 카드 렌더링
  previewProducts.forEach((p) => {
    const { cardHtml } = createProductCard({ ...p, popover: true });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml;
    previewContainer.appendChild(wrapper.firstElementChild);
  });

  // ✅ 팝오버 초기화 추가 (홈에서도 동작하도록)
  requestAnimationFrame(() => {
    initPopover({ products });
  });

  // ✅ "모두 보기" 버튼 → 상품 탭 이동
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

/* =====================================================
   홈 > 출석 내역 미리보기 (7줄까지)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const attendancePreview = document.querySelector("#home-attendance-preview");
  if (!attendancePreview) return;

  // ✅ 최근 7개 데이터만 표시
  const recentData = attendanceData.slice(0, 7);

  // ✅ 기존 테이블 구조 그대로 복사 (헤더 포함)
  renderAttendanceTable({
    target: attendancePreview,
    data: recentData,
    isPreview: true,
  });

  // ✅ "모두 보기" 버튼 → 출석 탭 이동
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

/* =====================================================
   홈 > 결제 내역 미리보기 (7줄까지, 금액 통합)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const paymentPreview = document.querySelector("#home-payment-preview");
  if (!paymentPreview) return;

  // ✅ 최근 7건만 표시
  const recentPayments = paymentsData.slice(0, 7);

  // ✅ 기존 구조 + 금액 통합 렌더링
  renderPaymentTable({
    target: paymentPreview,
    data: recentPayments,
    isPreview: true,
  });

  // ✅ "모두 보기" 버튼 → 결제 탭 이동
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

/* =====================================================
   홈 > 홀딩연장양도 내역 미리보기 (7줄까지)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const adjustmentPreview = document.querySelector("#home-adjustment-preview");
  if (!adjustmentPreview) return;

  const recentData = adjustmentData.slice(0, 7);
  renderAdjustmentTable({
    target: adjustmentPreview,
    data: recentData,
    isPreview: true,
  });

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
