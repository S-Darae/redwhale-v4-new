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
import "../../components/card/product-card.js";

import FilterCalendarCore from "../../components/date-filter/filter-calendar-core.js";
import "../../components/date-picker/date-picker.scss";
import "../../components/date-picker/filter-calendar.scss";

import { initPopover } from "../../components/card/popover-init.js";

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
   ====================================================================== */
import "../../components/tab/tab.js";

document.addEventListener("tab-updated", async (e) => {
  const { targetId } = e.detail;

  try {
    switch (targetId) {
      case "tab-home":
        // 🏠 홈 탭: 캘린더 포함 초기화
        initHomeAttendanceCalendar();
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

/* ======================================================================
   🏠 홈 탭 > 상품 프리뷰 렌더링
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector("#home-product-preview");
  if (!previewContainer) return;

  const targetIds = ["membership-01", "membership-02", "locker-02", "wear-01"];
  const previewProducts = products.filter((p) => targetIds.includes(p.id));

  previewProducts.forEach((p) => {
    const { cardHtml } = createProductCard({ ...p, popover: true });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml;
    previewContainer.appendChild(wrapper.firstElementChild);
  });

  requestAnimationFrame(() => {
    initPopover({ products });
  });

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
   🕒 홈 탭 > 출석 내역 프리뷰 (7줄)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const attendancePreview = document.querySelector("#home-attendance-preview");
  if (!attendancePreview) return;

  const recentData = attendanceData.slice(0, 7);

  renderAttendanceTable({
    target: attendancePreview,
    data: recentData,
    isPreview: true,
  });

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
   🗓 홈 탭 > 출석 캘린더 (dot 표시 포함)
   ====================================================================== */
function initHomeAttendanceCalendar() {
  const container = document.getElementById("home-attendance-calendar");
  if (!container) return;

  const attendanceMap = {
    "2025-11-01": { enter: true, class: false },
    "2025-11-02": { enter: true, class: true },
    "2025-11-03": { enter: false, class: true },
    "2025-11-09": { enter: false, class: true },
    "2025-12-01": { enter: true, class: true },
  };

  const calendar = new FilterCalendarCore({ mode: "single" });
  calendar.mount(container);

  const grid = container.querySelector(".calendar-grid");
  if (grid) grid.style.pointerEvents = "none";

  function renderDots() {
    const cells = container.querySelectorAll(".calendar-cell");
    if (!cells.length) return;

    cells.forEach((cell) => {
      const date = cell.dataset.date;
      const record = attendanceMap[date];
      if (!record) return;

      const old = cell.querySelector(".attendance-dots");
      if (old) old.remove();

      const box = document.createElement("div");
      box.className = "attendance-dots";

      if (record.enter) box.innerHTML += `<span class="dot dot--enter"></span>`;
      if (record.class) box.innerHTML += `<span class="dot dot--class"></span>`;

      cell.appendChild(box);
    });
  }

  calendar.onRendered = () => {
    requestAnimationFrame(renderDots);
  };

  const buttons = container.querySelectorAll(
    ".prev-month-btn, .next-month-btn, .prev-year-btn, .next-year-btn, .today-btn"
  );

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        renderDots();
      }, 20);
    });
  });

  setTimeout(renderDots, 30);

  calendar.setRange({ start: null, end: null });
}

/* ======================================================================
   💳 홈 탭 > 결제 내역 프리뷰 (7줄)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const paymentPreview = document.querySelector("#home-payment-preview");
  if (!paymentPreview) return;

  const recentPayments = paymentsData.slice(0, 7);

  renderPaymentTable({
    target: paymentPreview,
    data: recentPayments,
    isPreview: true,
  });

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
   🔁 홈 탭 > 홀딩/연장/양도 프리뷰 (7줄)
   ====================================================================== */
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
