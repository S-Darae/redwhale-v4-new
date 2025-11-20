/* ======================================================================
   📦 attendance-search.js — 출석/예약 검색 · 필터 초기화 스크립트
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - Search 텍스트 필드 생성
   - 체크박스 필터 UI 생성
   - 수업/개인수업/그룹수업 간 트리 체크 동기화
   ----------------------------------------------------------------------
   🧩 Angular 변환 가이드:
   - <app-attendance-search> 컴포넌트로 분리 가능
   - createTextField, createCheckbox → 각각 <app-text-field>, <app-checkbox> 로 변환  
     (Input으로 variant, size, label, checked 전달)
   - 트리 체크 로직은 Service로 관리하거나 Reactive Forms 기반으로 처리
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - text-field.scss
   - checkbox.scss
   ====================================================================== */


/* ======================================================================
   📦 Import — 공통 UI 컴포넌트
   ====================================================================== */
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import "../../components/checkbox/checkbox.scss";


/* ======================================================================
   🔧 UTIL — 필드/체크박스 DOM 삽입 함수
   ----------------------------------------------------------------------
   addField     → 텍스트 필드(createTextField) 삽입
   addCheckbox  → 체크박스(createCheckbox) 삽입
   ====================================================================== */
function addField(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createTextField(options));
}

function addCheckbox(containerId, checkboxOptions) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createCheckbox(checkboxOptions));
}


/* ======================================================================
   🔍 Search Small 필드 생성
   ----------------------------------------------------------------------
   - 출석 검색 필드
   - 예약 검색 필드
   ====================================================================== */
addField("search-attendance", {
  id: "search-small-attendance",
  variant: "search",
  size: "small",
  placeholder: "출석한 회원 검색",
});

addField("search-booking", {
  id: "search-small-booking",
  variant: "search",
  size: "small",
  placeholder: "수업, 예약한 회원 검색",
});


/* ======================================================================
   ☑️ 체크박스 필터 생성
   ----------------------------------------------------------------------
   체크박스 구조:
   - 센터 출석
   - 수업 (상위)
     - 개인 수업
     - 그룹 수업
   - 강사별 필터 (예: 김민수, 김정아)
   ====================================================================== */
addCheckbox("filter-entry-container", {
  id: "filter-entry",
  size: "small",
  label: "센터 출석",
  checked: true,
});

addCheckbox("filter-lesson-container", {
  id: "filter-lesson",
  size: "small",
  label: "수업",
  checked: true,
});

addCheckbox("filter-lesson-personal-container", {
  id: "filter-lesson-personal",
  size: "small",
  label: "개인 수업",
  checked: true,
});

addCheckbox("filter-lesson-group-container", {
  id: "filter-lesson-group",
  size: "small",
  label: "그룹 수업",
  checked: true,
});

addCheckbox("filter-teacher-minsu-container", {
  id: "filter-teacher-minsu",
  size: "small",
  label: "김민수",
  checked: true,
});

addCheckbox("filter-teacher-jeonga-container", {
  id: "filter-teacher-jeonga",
  size: "small",
  label: "김정아",
  checked: true,
});


/* ======================================================================
   🌳 트리 체크 기능 (수업 ↔ 개인·그룹 연동)
   ----------------------------------------------------------------------
   ✔ 상위 체크박스 '수업' 선택 시 → 개인/그룹 모두 선택
   ✔ 상위 해제 시 → 하위 모두 해제
   ✔ 하위 일부 체크 시 → 상위는 indeterminate(일부 체크) 상태 표시
   ----------------------------------------------------------------------
   🧩 Angular 변환:
   - Reactive Forms: parent, child controls 간 valueChanges로 구현
   - Template Forms: (change) 이벤트로 parent-child sync 가능
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const parent = document.getElementById("filter-lesson");              // 수업
  const childPersonal = document.getElementById("filter-lesson-personal"); // 개인
  const childGroup = document.getElementById("filter-lesson-group");       // 그룹

  if (!parent || !childPersonal || !childGroup) return;

  /* ------------------------------------------------------
     1) 상위 → 하위 동기화
     ------------------------------------------------------ */
  parent.addEventListener("change", () => {
    const checked = parent.checked;
    childPersonal.checked = checked;
    childGroup.checked = checked;
    parent.indeterminate = false;
  });

  /* ------------------------------------------------------
     2) 하위 → 상위 동기화
     ------------------------------------------------------ */
  const updateParent = () => {
    const allChecked = childPersonal.checked && childGroup.checked;
    const noneChecked = !childPersonal.checked && !childGroup.checked;

    if (allChecked) {
      parent.checked = true;
      parent.indeterminate = false;
    } else if (noneChecked) {
      parent.checked = false;
      parent.indeterminate = false;
    } else {
      parent.checked = false;
      parent.indeterminate = true; // 일부 체크
    }
  };

  childPersonal.addEventListener("change", updateParent);
  childGroup.addEventListener("change", updateParent);
});
