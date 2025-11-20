/* ======================================================================
   📋 booking-table.js — 예약 테이블(체크박스 + 슬라이드 버튼)
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 예약 테이블의 체크박스 UI 전체 제어
     (헤더 전체 선택 / 개별 선택 / 행 클릭 선택)
   - 클래스 테이블의 슬라이드 버튼 생성
   ----------------------------------------------------------------------
   🧩 Angular 변환 가이드:
   - 테이블 리스트는 <app-booking-table> 컴포넌트로 분리 가능
   - 체크박스는 <app-checkbox> 컴포넌트로 치환
   - 전체 선택 로직은 RxJS BehaviorSubject 활용해 상태 공유 가능
   - 슬라이드 버튼은 <app-slide-buttons> 컴포넌트로 분리
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - checkbox.scss
   - button.scss / slide-button.scss
   ====================================================================== */

import "../../components/button/button.scss";
import { createSlideButtons } from "../../components/button/create-slide-button.js";
import "../../components/button/slide-button.scss";
import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

/* ======================================================================
   📌 예약 테이블 체크박스 초기화
   ----------------------------------------------------------------------
   - 헤더: 전체 선택 체크박스
   - 바디: 개별 체크박스
   - 행 클릭 시 해당 체크박스 토글
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".booking-table-wrap");
  if (!wrap) return;

  /* ------------------------------------------------------
     1) 헤더 체크박스 위치
     ------------------------------------------------------ */
  const headCheckboxCell = wrap.querySelector(
    ".booking-table--head .booking-table__cell--checkbox"
  );

  const bodyCheckboxCells = wrap.querySelectorAll(
    ".booking-table--body .booking-table__cell--checkbox"
  );

  if (!headCheckboxCell) return;

  /* ------------------------------------------------------
     2) 헤더 체크박스 삽입
     ------------------------------------------------------ */
  headCheckboxCell.insertAdjacentHTML(
    "beforeend",
    createCheckbox({
      id: "booking-check-all",
      size: "small",
    })
  );
  const headCheckbox = document.getElementById("booking-check-all");

  /* ------------------------------------------------------
     3) 바디 체크박스 삽입
     ------------------------------------------------------ */
  bodyCheckboxCells.forEach((cell, index) => {
    cell.insertAdjacentHTML(
      "beforeend",
      createCheckbox({
        id: `booking-check-${index}`,
        size: "small",
      })
    );
  });

  const bodyCheckboxes = wrap.querySelectorAll(
    ".booking-table--body .booking-table__cell--checkbox input[type='checkbox']"
  );

  /* ------------------------------------------------------
     4) 헤더 클릭 → 전체 선택
     ------------------------------------------------------ */
  headCheckbox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    bodyCheckboxes.forEach((cb) => (cb.checked = checked));
  });

  /* ------------------------------------------------------
     5) 개별 체크박스 변화 → 헤더 갱신
     ------------------------------------------------------ */
  bodyCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const allChecked = [...bodyCheckboxes].every((c) => c.checked);
      headCheckbox.checked = allChecked;
    });
  });

  /* ------------------------------------------------------
     6) 행 전체 클릭 시 체크박스 토글
     ------------------------------------------------------ */
  const rows = wrap.querySelectorAll(".booking-table--body");

  rows.forEach((row) => {
    row.addEventListener("click", (e) => {
      // 체크박스 셀 클릭은 무시
      if (e.target.closest(".booking-table__cell--checkbox")) return;

      const cb = row.querySelector(
        ".booking-table__cell--checkbox input[type='checkbox']"
      );
      if (!cb) return;

      cb.checked = !cb.checked;

      // 전체 체크 여부 갱신
      const allChecked = [...bodyCheckboxes].every((c) => c.checked);
      headCheckbox.checked = allChecked;
    });
  });
});

/* ======================================================================
   🎞 클래스 테이블 슬라이드 버튼
   ----------------------------------------------------------------------
   - createSlideButtons 사용
   - 페이지 값 변화 시 콜백 실행
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const slideWrap = document.getElementById("class-table__slide-btn");
  if (!slideWrap) return;

  const slideButtons = createSlideButtons(1, 3, (page) => {
    console.log("슬라이드 이동:", page);
    // TODO: 클래스 테이블 데이터 변경 로직 연결 가능
  });

  slideWrap.appendChild(slideButtons);
});
