import "../../components/checkbox/checkbox.scss";
import "../../components/radio-button/radio-button.scss";
import "../../components/sidebar/sidebar.js";
import { initializeTabs } from "../../components/tab/tab.js";
import "../../components/text-field/text-field.scss";

/* =======================================================
📊 Sales Stats Sidebar (통계 사이드바 / 완전 통합 버전)
=======================================================

💡 Angular 변환 시 참조
---------------------------------------------------------
- <app-sales-stats-sidebar></app-sales-stats-sidebar>
- 내부 탭 구성: <app-tab> + ngSwitch 기반 차트 변경
- 각 차트는 개별 <app-sales-chart> 컴포넌트로 분리
  → @Input() data, @Input() mode (“compare” | “trend” | “summary”)
- chart.js 설정은 service(factory)로 분리하여 재사용
======================================================= */

// =======================================================
// 🧩 Chart Plugins & 공통 설정
// =======================================================

/* ---------------------------------------------
📌 도넛 중앙 텍스트 Plugin
- 도넛 차트 중심부에 총합(건수/금액)을 표시하기 위한 Custom Plugin.
--------------------------------------------- */
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { width, height, ctx } = chart;
    const text = chart.options.plugins.centerText?.text;
    if (!text) return;

    ctx.save();
    ctx.font = "600 13px 'Pretendard'";
    ctx.fillStyle = "#242424";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  },
};

// Plugin 등록 (ChartDataLabels + centerTextPlugin)
Chart.register(ChartDataLabels, centerTextPlugin);

/* ---------------------------------------------
📌 결제 수단별 색상 팔레트
--------------------------------------------- */
const methodColors = {
  카드: "#26a69a",
  계좌이체: "#ef7a7a",
  현금: "#b0be43",
  미수금: "#ffbb56",
};

/* ---------------------------------------------
📌 한글 label → 영문 key 변환 (데이터 매핑용)
--------------------------------------------- */
const labelEng = (korLabel) =>
  ({
    카드: "card",
    계좌이체: "transfer",
    현금: "cash",
    미수금: "receivable",
  }[korLabel]);

/* =======================================================
📊 1️⃣ 매출 비교 차트 (Bar / 수평형)
=======================================================

🧩 개요
---------------------------------------------------------
- 결제 수단별 매출 비교 (오늘 vs 어제 / 이번달 vs 지난달)
- stacked bar 형태로 표시 (카드·계좌이체·현금·미수금)
- Chart.js 옵션에서 indexAxis="y" → 수평 막대 구조
======================================================= */
function createCompareChart(canvasId, labels, dataMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // ✅ 기존 차트 인스턴스가 있으면 파괴 (중복 렌더링 방지)
  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  // ✅ Y축별 최대값 계산 (전체 막대 최대 길이 기준)
  const max = Math.max(
    ...labels.map((label) =>
      Object.values(dataMap[label]).reduce((a, b) => a + b, 0)
    )
  );

  const chartInstance = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: Object.keys(methodColors).map((label) => ({
        label,
        data: labels.map((yl) => dataMap[yl][labelEng(label)]),
        backgroundColor: methodColors[label],
        stack: "all",
        barThickness: 36,
        minBarLength: 3,
      })),
    },
    options: {
      indexAxis: "y", // 수평 막대
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 16,
            usePointStyle: true,
            pointStyle: "rectRounded",
            font: { family: "'Pretendard'", size: 13 },
            color: "#242424",
          },
        },
        tooltip: {
          mode: "index",
          intersect: true,
          padding: 10,
          usePointStyle: true,
          callbacks: {
            // 툴팁 타이틀: ex) 오늘 3,000,000원
            title: (ctx) => {
              const label = ctx[0].label;
              const total = ctx.reduce((sum, item) => sum + item.raw, 0);
              return `${label} ${total.toLocaleString()}원`;
            },
            // 툴팁 항목: ex) 카드 1,000,000원
            label: (ctx) => ` ${ctx.raw.toLocaleString()}원`,
            labelPointStyle: () => ({ pointStyle: "rectRounded" }),
          },
        },
        datalabels: {
          anchor: "center",
          align: "center",
          color: "#fff",
          font: { family: "'Pretendard'", size: 12 },
          // 일정 비율 이상일 때만 label 표시
          formatter: (value, ctx) => {
            const threshold = ctx.chart.scales.x.max * 0.09;
            return value < threshold ? "" : ctx.dataset.label;
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          max,
          grid: { display: false },
          ticks: {
            align: "inner",
            font: { family: "'Pretendard'", size: 13 },
            color: "#242424",
            // 축 라벨 포맷: 0, 중간, 최대값만 표시
            callback(value) {
              const total = this.max;
              const middle = total / 2;
              if (![0, middle, total].includes(value)) return "";
              if (value === 0) return "0원";
              return `${(value / 10000).toLocaleString()}만원`;
            },
          },
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: { family: "'Pretendard'", size: 13 },
            color: "#242424",
          },
        },
      },
    },
  });

  // ✅ 차트 인스턴스 저장
  canvas._chartInstance = chartInstance;
}

/* =======================================================
📈 2️⃣ 최근 매출 추이 차트 (Line)
=======================================================

🧩 개요
---------------------------------------------------------
- 일별 / 월별 매출 추이 및 증감률을 선형(Line)으로 시각화.
- 매출 금액(y) / 증감률(y1) 이중 축 구성.
======================================================= */
function createLineChart(canvasId, labels, sales, rates) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // 기존 차트 파괴 (중복 방지)
  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  const ctx = canvas.getContext("2d");

  // 부모 요소 높이가 0일 경우, 최소 높이 강제 지정 (차트 깨짐 방지)
  const parent = canvas.parentElement;
  if (parent && parent.clientHeight < 150) {
    parent.style.minHeight = "200px";
  }

  const chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "매출",
          data: sales,
          borderColor: "#e34a5e",
          backgroundColor: "rgba(227, 74, 94, 0.05)",
          fill: true,
          yAxisID: "y",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#e34a5e",
        },
        {
          label: "직전 대비 매출 증감률",
          data: rates,
          borderColor: "#c7c7c7",
          backgroundColor: "transparent",
          fill: false,
          yAxisID: "y1",
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#b0b0b0",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 14,
            usePointStyle: true,
            pointStyle: "rectRounded",
            font: { family: "'Pretendard'", size: 13 },
            color: "#242424",
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          padding: 10,
          usePointStyle: true,
          callbacks: {
            title: (ctx) => ctx[0].label,
            label: (ctx) => {
              const val = ctx.raw;
              if (ctx.dataset.label === "매출")
                return ` 매출 ${val.toLocaleString()}원`;
              if (ctx.dataset.label === "직전 대비 매출 증감률") {
                const sign = val > 0 ? "증가" : val < 0 ? "감소" : "";
                return ` 직전 대비 ${Math.abs(val).toFixed(1)}% ${sign}`;
              }
              return "";
            },
          },
        },
        datalabels: false, // 선형 차트에서는 datalabel 미사용
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#242424",
            font: { family: "'Pretendard'", size: 13 },
          },
        },
        y: { display: false },
        y1: { display: false },
      },
    },
  });

  // 인스턴스 저장 및 강제 리사이즈
  canvas._chartInstance = chartInstance;

  requestAnimationFrame(() => {
    chartInstance.resize();
    setTimeout(() => chartInstance.resize(), 120);
  });
}

/* =======================================================
🍩 3️⃣ 거래 요약 도넛 차트
=======================================================

🧩 개요
---------------------------------------------------------
- 결제 / 환불 / 양도 각각의 거래 건수·금액을 도넛형으로 시각화.
- centerTextPlugin으로 중앙에 총합 표시.
======================================================= */
function createTransactionDonutCharts(
  countCanvasId,
  amountCanvasId,
  countData,
  amountData
) {
  const labels = ["결제", "환불", "양도"];
  const backgroundColors = ["#77b37c", "#c95f58", "#a85ab8"];
  const totalCount = countData.reduce((a, b) => a + b, 0);
  const totalAmount = amountData.reduce((a, b) => a + b, 0);

  /* ---------------------------------------------
     내부 차트 생성 함수 (공통 로직)
  --------------------------------------------- */
  const createChart = (canvasId, total, centerText, dataArr, isAmount) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (canvas._chartInstance) {
      canvas._chartInstance.destroy();
    }

    const chartInstance = new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: dataArr, backgroundColor: backgroundColors }],
      },
      options: {
        cutout: "55%", // 중앙 공백 비율
        plugins: {
          centerText: { text: centerText }, // 중앙 텍스트 표시
          legend: { display: false },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              // 툴팁 타이틀
              title: () =>
                isAmount
                  ? `거래 금액 ${total.toLocaleString()}원`
                  : `거래 건수 ${total.toLocaleString()}건`,
              // 툴팁 본문
              label: (ctx) => {
                const label = ctx.label;
                const value = ctx.raw ?? 0;
                const unit = isAmount ? "원" : "건";
                return ` ${label} ${value.toLocaleString()}${unit}`;
              },
            },
          },
          datalabels: {
            color: "#fff",
            font: { family: "'Pretendard'", size: 11 },
            anchor: "center",
            align: "center",
            formatter: (_, ctx) => labels[ctx.dataIndex],
          },
        },
      },
      plugins: [ChartDataLabels, centerTextPlugin],
    });

    canvas._chartInstance = chartInstance;
  };

  // 거래 건수 도넛
  createChart(
    countCanvasId,
    totalCount,
    `${totalCount.toLocaleString()}건`,
    countData,
    false
  );

  // 거래 금액 도넛
  createChart(
    amountCanvasId,
    totalAmount,
    `${Math.round(totalAmount / 10000).toLocaleString()}만원`,
    amountData,
    true
  );
}

/* =======================================================
📦 Sidebar 초기화 + Tab + Chart 연동
=======================================================

🧩 개요
---------------------------------------------------------
- 사이드바 내 섹션 토글(펼치기/접기) + 탭 전환 + 차트 렌더링 전체 관리.
- transitionend 이벤트로 애니메이션 종료 후 차트 로드.
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // 🔹 각 통계 섹션 토글 처리 (펼치기/접기)
  // =====================================================
  document
    .querySelectorAll(".sales-stats-sidebar__chart")
    .forEach((section) => {
      const isClosed = section.classList.contains("is-closed");
      const tabSet = section.querySelector(".tab-set");
      const dateRange = section.querySelector(".date-range");
      const chartWrap = section.querySelector(".sales-chart-wrap");
      const toggleBtn = section.querySelector(".chart-toggle-btn");
      const icon = toggleBtn?.querySelector(".icon");

      // 기본 상태가 닫힘이라면 내부 콘텐츠 숨김
      if (isClosed) {
        if (tabSet) tabSet.style.display = "none";
        if (dateRange) dateRange.style.display = "none";
        if (chartWrap) chartWrap.style.display = "none";
      }

      // 클릭 시 섹션 토글
      toggleBtn?.addEventListener("click", () => {
        const isOpening = section.classList.contains("is-closed");

        section.classList.toggle("is-open");
        section.classList.toggle("is-closed");
        icon?.classList.toggle("icon--caret-up");
        icon?.classList.toggle("icon--caret-down");

        // 섹션 내 요소 show/hide
        if (tabSet)
          tabSet.style.display = tabSet.style.display === "none" ? "" : "none";
        if (dateRange)
          dateRange.style.display =
            dateRange.style.display === "none" ? "" : "none";
        if (chartWrap)
          chartWrap.style.display =
            chartWrap.style.display === "none" ? "" : "none";

        // 열릴 때만 transition 끝난 후 차트 로드 트리거
        if (isOpening) {
          section.addEventListener(
            "transitionend",
            () => {
              const defaultChecked = section.querySelector(
                ".bg-tab__input:checked"
              );
              if (defaultChecked) {
                const targetId =
                  defaultChecked.nextElementSibling.dataset.target;
                const event = new CustomEvent("tab-updated", {
                  detail: { targetId },
                });
                document.dispatchEvent(event);
              }
            },
            { once: true }
          );
        }
      });
    });

  // =====================================================
  // 🔹 Tabs 초기화
  // =====================================================
  const sidebarContent = document.querySelector(
    ".sales-stats-sidebar__content"
  );
  if (sidebarContent) initializeTabs(sidebarContent);

  // =====================================================
  // 🔹 초기 매출 비교 섹션 활성화 시 기본 탭 렌더링 추가
  // =====================================================
  requestAnimationFrame(() => {
    const compareSection = document.querySelector(
      ".chart__sales-compare.is-open"
    );
    if (!compareSection) return;

    const defaultCompareTab = compareSection.querySelector(
      ".bg-tab__input:checked"
    );
    if (!defaultCompareTab) return;

    const targetId = defaultCompareTab.nextElementSibling.dataset.target;
    const tpl = document.querySelector(`#tpl-${targetId}`);
    const panel = document.getElementById(targetId);
    if (tpl && panel && !panel.innerHTML.trim()) {
      panel.innerHTML = tpl.innerHTML;
    }

    const event = new CustomEvent("tab-updated", { detail: { targetId } });
    document.dispatchEvent(event);
  });

  // =====================================================
  // 🔹 초기 트렌드 섹션 활성화 시 기본 탭 렌더링
  // =====================================================
  requestAnimationFrame(() => {
    const trendSection = document.querySelector(".chart__sales-trend.is-open");
    if (!trendSection) return;

    const defaultTrendTab = trendSection.querySelector(
      ".bg-tab__input:checked"
    );
    if (!defaultTrendTab) return;

    const targetId = defaultTrendTab.nextElementSibling.dataset.target;

    // template 복사 → panel 채우기
    const tpl = document.querySelector(`#tpl-${targetId}`);
    const panel = document.getElementById(targetId);
    if (tpl && panel && !panel.innerHTML.trim()) {
      panel.innerHTML = tpl.innerHTML;
    }

    // 차트 렌더링 이벤트 발생
    const event = new CustomEvent("tab-updated", { detail: { targetId } });
    document.dispatchEvent(event);
  });

  // =====================================================
  // 🔹 거래 데이터 (Mock)
  // =====================================================
  const paymentData = {
    결제: {
      card: 1830000,
      transfer: 1260000,
      cash: 1100000,
      receivable: 90000,
    },
    환불: { card: -300000, transfer: -200000, cash: -50000, receivable: 0 },
    양도: { card: 0, transfer: 100000, cash: 50000, receivable: 0 },
  };

  const transactionCounts = [230, 12, 8];
  const transactionAmounts = ["결제", "환불", "양도"].map((type) =>
    Object.values(paymentData[type]).reduce((sum, val) => sum + val, 0)
  );

  // =====================================================
  // 🔹 탭 변경 시 차트 렌더링
  // =====================================================
  document.addEventListener("tab-updated", (e) => {
    const { targetId } = e.detail;

    // 탭 콘텐츠 표시 상태 확인 후 렌더링
    requestAnimationFrame(() => {
      const panel = document.getElementById(targetId);
      if (!panel || panel.offsetParent === null) return;

      // 1️⃣ 매출 비교 차트
      if (targetId === "compare-content1") {
        createCompareChart("dailyCompareChart", ["오늘", "어제"], {
          오늘: {
            card: 1000000,
            transfer: 800000,
            cash: 500000,
            receivable: 100000,
          },
          어제: {
            card: 950000,
            transfer: 600000,
            cash: 450000,
            receivable: 50000,
          },
        });
      } else if (targetId === "compare-content2") {
        createCompareChart("monthlyCompareChart", ["이번달", "지난달"], {
          이번달: {
            card: 5000000,
            transfer: 4200000,
            cash: 3000000,
            receivable: 300000,
          },
          지난달: {
            card: 4700000,
            transfer: 3800000,
            cash: 2800000,
            receivable: 200000,
          },
        });
      }

      // 2️⃣ 거래 요약 차트
      if (targetId === "period-content1" || targetId === "period-content2") {
        createTransactionDonutCharts(
          "transactionCountChart",
          "transactionAmountChart",
          transactionCounts,
          transactionAmounts
        );
      }

      // 3️⃣ 매출 추이 차트 (일간 / 월간)
      if (targetId === "trend-content1") {
        createLineChart(
          "dailySalesChart",
          ["29일", "30일", "31일", "1일", "2일", "3일", "4일", "어제"],
          [
            1000000, 500000, 900000, 1500000, 1300000, 1200000, 1600000,
            1800000,
          ],
          [-50, 20, 80, -13.3, -7, 33.3, 12.5, 20]
        );
      } else if (targetId === "trend-content2") {
        createLineChart(
          "monthlySalesChart",
          ["1월", "2월", "3월", "4월", "5월", "6월"],
          [3200000, 4000000, 3500000, 4700000, 4200000, 5100000],
          [0, 25, -12.5, 34.3, -10.6, 21.4]
        );
      }
    });
  });

  // =====================================================
  // 🔹 페이지 로드 시 기본 탭 렌더링
  // =====================================================
  const defaultChecked = document.querySelector(".bg-tab__input:checked");
  if (defaultChecked) {
    const targetId = defaultChecked.nextElementSibling.dataset.target;
    const event = new CustomEvent("tab-updated", { detail: { targetId } });
    document.dispatchEvent(event);
  }
});
