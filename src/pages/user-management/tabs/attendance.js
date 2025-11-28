/* ======================================================================
   🕒 attendance.js — 회원 상세 페이지 > 출석 내역 탭
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 출석/시설입장 데이터를 테이블 형태로 렌더링
   - 탭(전체 / 시설입장 / 수업출석) 별 데이터 분류 및 표시
   - 페이지네이션, 행 수 변경 드롭다운 포함
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - attendance.scss / table.scss / dropdown.scss / pagination.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 및 모듈
   ====================================================================== */
import { createPagination } from "../../../components/button/create-pagination.js";
import "../../../components/button/pagination.scss";

import { createDropdownMenu } from "../../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../../components/dropdown/dropdown-init.js";
import "../../../components/dropdown/dropdown.scss";

import "../../../components/tab/tab.js";
import { initializeTabs } from "../../../components/tab/tab.js";

import "./attendance.scss";

/* ======================================================================
   📦 출석 데이터 (Mock)
   ====================================================================== */
export const attendanceData = [
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
  { date: "2025.01.01 (월) 00:00", type: "수업출석", name: "1:1 PT", ticket: "1:1 PT" },
  { date: "2025.01.01 (월) 00:00", type: "시설입장", name: "-", ticket: "새해 이벤트 12개월" },
];

/* ======================================================================
   🧩 dimmed formatter 추가 (수정본 삽입)
   ====================================================================== */
const dimmed = (val) =>
  val && val !== "-" && val !== "" ? val : `<span class="dimmed">-</span>`;

/* ======================================================================
   🧩 renderAttendanceTable() — 출석표 렌더링 함수
   ====================================================================== */
export function renderAttendanceTable({ target, data, isPreview = false }) {
  if (!target || !data) return;

  /* --------------------------------------------------
     기존 테이블 초기화
     -------------------------------------------------- */
  const existingRows = target.querySelectorAll(".attendance__table--body");
  existingRows.forEach((row) => row.remove());

  /* --------------------------------------------------
     테이블 헤더 추가
     -------------------------------------------------- */
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

  /* --------------------------------------------------
     데이터 행 렌더링 (dimmed 적용 + 수정본 merge)
     -------------------------------------------------- */
  data.forEach((item) => {
    const typeClass =
      item.type === "시설입장"
        ? "attendance__cell-type--enter"
        : "attendance__cell-type--class";

    const rowHtml = `
      <div class="attendance__table attendance__table--body" ${
        isPreview ? 'data-preview="true"' : ""
      }>
        <div class="attendance__cell-date">${dimmed(item.date)}</div>
        <div class="attendance__cell-type ${typeClass}">${dimmed(item.type)}</div>
        <div class="attendance__cell-name">${dimmed(item.name)}</div>
        <div class="attendance__cell-ticket">${dimmed(item.ticket)}</div>

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

/* ======================================================================
   🧭 initializeAttendanceTab() — 출석 탭 초기화
   ====================================================================== */
export function initializeAttendanceTab() {
  const panel = document.getElementById("tab-attendance");
  if (!panel) return;

  fetch("./tabs/attendance.html")
    .then((res) => res.text())
    .then((html) => {
      panel.innerHTML = html;

      /* --------------------------------------------------
         🧭 탭 초기화
         -------------------------------------------------- */
      const tabSet = panel.querySelector(".attendance-status-tab");
      if (tabSet) initializeTabs(tabSet);

      /* --------------------------------------------------
         📊 데이터 분류
         -------------------------------------------------- */
      const facilityData = attendanceData.filter((d) => d.type === "시설입장");
      const classData = attendanceData.filter((d) => d.type === "수업출석");

      /* --------------------------------------------------
         컨테이너 캐싱
         -------------------------------------------------- */
      const allWrap = panel.querySelector('[data-type="all"]');
      const facilityWrap = panel.querySelector('[data-type="facility"]');
      const classWrap = panel.querySelector('[data-type="class"]');

      /* --------------------------------------------------
         테이블 렌더링
         -------------------------------------------------- */
      renderAttendanceTable({ target: allWrap, data: attendanceData });
      renderAttendanceTable({ target: facilityWrap, data: facilityData });
      renderAttendanceTable({ target: classWrap, data: classData });

      /* --------------------------------------------------
         개수 업데이트
         -------------------------------------------------- */
      const updateCount = (selector, count) => {
        const el = panel.querySelector(selector);
        if (el) el.querySelector(".table-row-count").textContent = count;
      };
      updateCount('[data-target="tab-attendance-all"]', attendanceData.length);
      updateCount('[data-target="tab-attendance-facility"]', facilityData.length);
      updateCount('[data-target="tab-attendance-class"]', classData.length);

      /* --------------------------------------------------
         페이지네이션 생성
         -------------------------------------------------- */
      const pagination = createPagination(1, 3, "small", (p) => p);
      panel.querySelector("#attendance-table__pagination")?.appendChild(pagination);

      /* --------------------------------------------------
         행 수 변경 드롭다운
         -------------------------------------------------- */
      createDropdownMenu({
        id: "attendance-table-rows-menu",
        size: "xs",
        items: [
          { title: "10줄씩 보기", action: () => setRowsPerPage(10) },
          { title: "15줄씩 보기", selected: true, action: () => setRowsPerPage(15) },
          { title: "20줄씩 보기", action: () => setRowsPerPage(20) },
          { title: "50줄씩 보기", action: () => setRowsPerPage(50) },
        ],
      });
      initializeDropdowns();
    })
    .catch((err) => console.error("❗️[출석 탭] 로드 실패:", err));
}

/* ======================================================================
   🔢 setRowsPerPage() — 행 수 변경 처리
   ====================================================================== */
function setRowsPerPage(n) {
  const toggle = document.querySelector(
    ".dropdown__toggle[data-dropdown-target='attendance-table-rows-menu']"
  );
  if (toggle) toggle.textContent = `${n}줄씩 보기`;
}
