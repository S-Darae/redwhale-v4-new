import { createPagination } from "../../../components/button/create-pagination.js";
import "../../../components/button/pagination.scss";

import { createDropdownMenu } from "../../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../../components/dropdown/dropdown-init.js";
import "../../../components/dropdown/dropdown.scss";

import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";

import "./attendance.scss";

/* ==========================
   📦 출석 데이터
   ========================== */
export const attendanceData = [
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "수업출석",
    name: "1:1 PT",
    ticket: "1:1 PT",
  },
  {
    date: "2025.01.01 (월) 00:00",
    type: "시설입장",
    name: "-",
    ticket: "새해 이벤트 12개월",
  },
];

/* =====================================================
   🧩 공용 출석표 렌더링 함수 (탭 + 홈 공용)
   ===================================================== */
export function renderAttendanceTable({ target, data, isPreview = false }) {
  if (!target || !data) return;

  // 기존 행 제거
  const existingRows = target.querySelectorAll(".attendance__table--body");
  existingRows.forEach((row) => row.remove());

  // ✅ 헤더 추가 (홈에도 동일 구조 유지)
  const headHtml = `
    <div class="attendance__table attendance__table--head">
      <div class="attendance__cell-date">일시</div>
      <div class="attendance__cell-type">구분</div>
      <div class="attendance__cell-name">수업 이름</div>
      <div class="attendance__cell-ticket">사용한 회원권</div>
      <div class="attendance__cell-actions"></div>
    </div>
  `;
  target.insertAdjacentHTML("beforeend", headHtml);

  // ✅ 데이터 렌더링
  data.forEach((item) => {
    const typeClass =
      item.type === "시설입장"
        ? "attendance__cell-type--enter"
        : "attendance__cell-type--class";

    const rowHtml = `
      <div class="attendance__table attendance__table--body" ${
        isPreview ? 'data-preview="true"' : ""
      }>
        <div class="attendance__cell-date">${item.date}</div>
        <div class="attendance__cell-type ${typeClass}">${item.type}</div>
        <div class="attendance__cell-name">${item.name}</div>
        <div class="attendance__cell-ticket">${item.ticket}</div>
        <div class="attendance__cell-actions">
            <button class="btn btn--outlined btn--neutral btn--small attendance__cancel-btn">
            출석 취소
          </button>
        </div>
      </div>
    `;
    target.insertAdjacentHTML("beforeend", rowHtml);
  });
}

/* =====================================================
   📊 출석 탭 초기화
   ===================================================== */
export function initializeAttendanceTab() {
  const panel = document.getElementById("tab-attendance");
  if (!panel) return;

  fetch("./tabs/attendance.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      // ✅ 탭 초기화
      const tabSet = panel.querySelector(".attendance-status-tab");
      if (tabSet) initializeTabs(tabSet);

      // ✅ 데이터 분류
      const facilityData = attendanceData.filter((d) => d.type === "시설입장");
      const classData = attendanceData.filter((d) => d.type === "수업출석");

      // ✅ 컨테이너 찾기
      const allWrap = panel.querySelector('[data-type="all"]');
      const facilityWrap = panel.querySelector('[data-type="facility"]');
      const classWrap = panel.querySelector('[data-type="class"]');

      // ✅ 렌더링
      renderAttendanceTable({ target: allWrap, data: attendanceData });
      renderAttendanceTable({ target: facilityWrap, data: facilityData });
      renderAttendanceTable({ target: classWrap, data: classData });

      // ✅ 개수 업데이트
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-attendance-all"]', attendanceData.length);
      updateCount(
        '[data-target="tab-attendance-facility"]',
        facilityData.length
      );
      updateCount('[data-target="tab-attendance-class"]', classData.length);

      // ✅ 페이지네이션
      const pagination = createPagination(1, 3, "small", (p) =>
        console.log("페이지:", p)
      );
      panel
        .querySelector("#attendance-table__pagination")
        ?.appendChild(pagination);

      // ✅ 드롭다운
      createDropdownMenu({
        id: "attendance-table-rows-menu",
        size: "xs",
        items: [
          { title: "10줄씩 보기", action: () => setRowsPerPage(10) },
          {
            title: "15줄씩 보기",
            selected: true,
            action: () => setRowsPerPage(15),
          },
          { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
          { title: "50줄씩 보기", action: () => setRowsPerPage(50) },
        ],
      });
      initializeDropdowns();

      console.log("✅ [출석 탭] 초기화 완료");
    })
    .catch((err) => console.error("❗️[출석 탭] 로드 실패:", err));
}

/* =====================================================
   🔢 행 수 변경 처리
   ===================================================== */
function setRowsPerPage(n) {
  const toggle = document.querySelector(
    ".dropdown__toggle[data-dropdown-target='attendance-table-rows-menu']"
  );
  if (toggle) toggle.textContent = `${n}줄씩 보기`;
  console.log(`${n}줄씩 보기 선택됨`);
}
