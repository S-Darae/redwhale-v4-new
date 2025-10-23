/* ======================================================
📊 Sales Summary Script (매출 요약 렌더링 및 반응형 동작)
======================================================
💡 Angular 변환 시 참고
------------------------------------------------------
- <app-sales-summary [data]="salesData"></app-sales-summary>
- collapse-section → *ngIf / [class.is-open]
- popover 모드 → <app-drawer position="right">
- @Input() data: SalesSummaryData
- @HostListener('window:resize') 로 반응형 전환 제어
====================================================== */

/* ======================================================
📦 Sales Summary Data
====================================================== */
const salesData = {
  total: { count: 2500, amount: 38800000 },
  type: [
    { label: "결제", count: 2300, amount: 42800000 },
    { label: "환불", count: 120, amount: -5500000 },
    { label: "양도", count: 30, amount: 1500000 },
  ],
  method: [
    { label: "카드", count: 1400, amount: 24000000 },
    { label: "계좌이체", count: 600, amount: 10500000 },
    { label: "현금", count: 300, amount: 5000000 },
    { label: "미수금", count: 200, amount: 3300000 },
  ],
};

/* ======================================================
📦 Render Function
======================================================

✅ 역할
------------------------------------------------------
- 매출 요약(총합 / 거래 유형 / 결제수단) 영역을 동적으로 구성
- isPopover = true → 팝오버 내부용 간소화 버전
- isPopover = false → 메인 요약 영역 + 접기/펼치기 버튼 포함
====================================================== */
function renderSalesSummary(container, data, isPopover = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "sales-summary__row";

  // ---------------------------------------------
  // 총합 그룹 (거래수 / 매출)
  // ---------------------------------------------
  const totalGroup = document.createElement("div");
  totalGroup.className = "sales-summary__group sales-summary__group--total";
  totalGroup.innerHTML = `
    <ul class="sales-summary__item">
      <li class="sales-summary__label">거래수</li>
      <li class="sales-summary__value sales-summary__value--bold">${
        data.total.count
      }건</li>
    </ul>
    <ul class="sales-summary__item">
      <li class="sales-summary__label">매출</li>
      <li class="sales-summary__value sales-summary__value--bold">
        ${data.total.amount.toLocaleString()}원
        ${
          !isPopover
            ? `
            <!-- 펼치기 버튼 -->
            <button class="btn--icon-utility sales-summary__unfold-btn" data-tooltip="자세히" aria-label="자세히">
              <div class="icon--caret-double-right-light icon"></div>
            </button>

            <!-- 팝오버 전용 접기 버튼 (저해상도 전용) -->
            <button class="btn--icon-utility sales-summary__fold-btn" data-role="popover" data-tooltip="접기" aria-label="접기" style="display:none">
              <div class="icon--caret-double-left-light icon"></div>
            </button>`
            : ""
        }
      </li>
    </ul>`;
  wrapper.appendChild(totalGroup);

  // ---------------------------------------------
  // 거래 유형 그룹 (결제 / 환불 / 양도)
  // ---------------------------------------------
  const typeGroup = document.createElement("div");
  typeGroup.className = `sales-summary__group sales-summary__group--type ${
    !isPopover ? "collapse-section" : ""
  }`;
  typeGroup.innerHTML = data.type
    .map(
      (t) => `
      <ul class="sales-summary__item">
        <li class="sales-summary__label">${t.label}</li>
        <li class="sales-summary__value">
          ${t.amount.toLocaleString()}원
          <span class="sales-summary__count">${t.count}건</span>
        </li>
      </ul>`
    )
    .join("");
  wrapper.appendChild(typeGroup);

  // ---------------------------------------------
  // 결제 수단 그룹 (카드 / 계좌이체 / 현금 / 미수금)
  // ---------------------------------------------
  const methodGroup = document.createElement("div");
  methodGroup.className = `sales-summary__group sales-summary__group--method ${
    !isPopover ? "collapse-section" : ""
  }`;
  methodGroup.innerHTML = data.method
    .map(
      (m, i) => `
      <ul class="sales-summary__item">
        <li class="sales-summary__label">${m.label}</li>
        <li class="sales-summary__value">
          ${m.amount.toLocaleString()}원
          <span class="sales-summary__count">${m.count}건</span>
          ${
            !isPopover && i === data.method.length - 1
              ? `
              <!-- 고해상도 전용 접기 버튼 -->
              <button class="btn--icon-utility sales-summary__fold-btn" data-tooltip="접기" aria-label="접기" style="display:none">
                <div class="icon--caret-double-left-light icon"></div>
              </button>`
              : ""
          }
        </li>
      </ul>`
    )
    .join("");
  wrapper.appendChild(methodGroup);

  container.appendChild(wrapper);
}

/* ======================================================
📦 Render Both Views (Main + Popover)
======================================================

✅ 역할
------------------------------------------------------
- sales-summary__main : 기본 표시용 (고해상도)
- sales-summary__popover : 저해상도용 팝오버 뷰
====================================================== */
const summary = document.querySelector("#salesSummary");

if (summary) {
  // ✅ 메인 Summary
  const summaryBody = document.createElement("div");
  summaryBody.className = "sales-summary__main";
  renderSalesSummary(summaryBody, salesData);
  summary.appendChild(summaryBody);

  // ✅ 팝오버 Summary
  const popover = document.createElement("div");
  popover.className = "sales-summary__popover";
  popover.id = "summaryPopover";
  renderSalesSummary(popover, salesData, true);
  summary.appendChild(popover);
}

/* =====================================================
🎛️ 거래수·매출 접기/펼치기 및 반응형 제어
=====================================================

✅ 역할
------------------------------------------------------
- 고해상도: collapse-section 기반 접기/펼치기 동작
- 저해상도: popover 슬라이드 패널 표시
- 창 크기 변경 시 자동으로 모드 전환

💡 Angular 변환 시 참고
------------------------------------------------------
- collapse-section → *ngIf + animation
- popover → <app-drawer position="right">
- @HostListener('window:resize') or ResizeObserver
===================================================== */
(function initSalesSummaryToggle() {
  const summarySection = document.querySelector(".sales-summary");
  if (!summarySection) return;

  // 주요 DOM 참조
  const unfoldBtn = summarySection.querySelector(".sales-summary__unfold-btn");
  const foldBtn = summarySection.querySelector(
    ".sales-summary__fold-btn:not([data-role='popover'])"
  );
  const foldBtnPopover = summarySection.querySelector(
    ".sales-summary__fold-btn[data-role='popover']"
  );
  const collapseSections = summarySection.querySelectorAll(".collapse-section");
  const popover = summarySection.querySelector(".sales-summary__popover");
  const contentWrap = document.querySelector(".header-contents-wrap");

  if (!unfoldBtn || !foldBtn) return;

  // 해상도 체크 (1550px 이하 → popover 모드)
  const getWidth = () =>
    contentWrap?.getBoundingClientRect().width || window.innerWidth;
  const isNarrow = () => getWidth() <= 1550;

  // ---------------------------------------------
  // 팝오버 열기
  // ---------------------------------------------
  const openPopover = () => {
    popover.classList.add("visible");
    summarySection.classList.add("popover-open");
    unfoldBtn.style.display = "none";
    foldBtnPopover.style.display = "inline-flex";
    setTimeout(() => document.addEventListener("click", closeOutside, true), 0);
  };

  // ---------------------------------------------
  // 팝오버 닫기
  // ---------------------------------------------
  const closePopover = () => {
    popover.classList.remove("visible");
    summarySection.classList.remove("popover-open");
    unfoldBtn.style.display = "inline-flex";
    foldBtnPopover.style.display = "none";
    document.removeEventListener("click", closeOutside, true);
  };

  // ---------------------------------------------
  // 외부 클릭 시 팝오버 닫기
  // ---------------------------------------------
  const closeOutside = (e) => {
    const inside = popover.contains(e.target);
    const isBtn =
      unfoldBtn.contains(e.target) ||
      foldBtn.contains(e.target) ||
      foldBtnPopover.contains(e.target);
    if (!inside && !isBtn) closePopover();
  };

  // ---------------------------------------------
  // 고해상도: collapse-section 열기
  // ---------------------------------------------
  const showAll = () => {
    collapseSections.forEach((el) => el.classList.add("is-open"));
    summarySection.classList.remove("is-collapsed");
    unfoldBtn.style.display = "none";
    foldBtn.style.display = "inline-flex";
  };

  // ---------------------------------------------
  // 고해상도: collapse-section 닫기
  // ---------------------------------------------
  const hideAll = () => {
    collapseSections.forEach((el) => el.classList.remove("is-open"));
    summarySection.classList.add("is-collapsed");
    unfoldBtn.style.display = "inline-flex";
    foldBtn.style.display = "none";
    closePopover();
  };

  // ---------------------------------------------
  // 초기 상태 적용
  // ---------------------------------------------
  const applyInitial = () => {
    if (isNarrow()) hideAll();
    else showAll();
  };

  // ---------------------------------------------
  // 이벤트 연결
  // ---------------------------------------------
  unfoldBtn.addEventListener("click", () =>
    isNarrow() ? openPopover() : showAll()
  );
  foldBtn.addEventListener("click", () =>
    isNarrow() ? closePopover() : hideAll()
  );
  foldBtnPopover.addEventListener("click", closePopover);

  // ---------------------------------------------
  // 반응형 처리 (ResizeObserver + resize)
  // ---------------------------------------------
  window.addEventListener("resize", applyInitial);
  if (contentWrap) {
    const ro = new ResizeObserver(applyInitial);
    ro.observe(contentWrap);
  }

  // 초기 실행
  applyInitial();
})();
