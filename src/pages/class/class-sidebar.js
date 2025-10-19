/**
 * ======================================================================
 * 🧩 class-add-sidebar.js — 수업 추가 사이드바 인터랙션 스크립트
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 수업 생성/편집 사이드바 내 각 UI 요소(드롭다운, 색상, 공지, 메모 등)의
 *   동작을 초기화하고 상태를 관리한다.
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 폴더 선택 드롭다운 (공통 드롭다운 컴포넌트 사용)
 * 2️⃣ 색상 선택 드롭다운 (전용 color dropdown 컴포넌트)
 * 3️⃣ 예약 정책 - 라디오 선택 시 하위 폼 활성화/비활성화
 * 4️⃣ 그룹 수업 - 예약대기 정원 토글 (대기 없음 체크 시 0으로 고정)
 * 5️⃣ 사이드바 공지 / 메모 섹션 토글 (펼침 / 접힘)
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - 각 섹션을 `<app-class-sidebar-section>` 단위로 컴포넌트화 가능
 * - 드롭다운 및 토글은 개별 Directive로 재사용 가능
 * - 예약 정책/공지/메모 등은 @Input() + [(ngModel)] 양방향 바인딩
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - dropdown.scss / dropdown-color.scss / sidebar.scss / tooltip.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 및 유틸)
   ====================================================================== */
import {
  createColorDropdownMenu,
  createColorDropdownToggle,
} from "../../components/dropdown/create-dropdown-color.js";
import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import "../../components/dropdown/dropdown-color.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import "../../components/dropdown/dropdown.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";

/* ======================================================================
   📂 폴더 선택 드롭다운
   ----------------------------------------------------------------------
   ✅ 설명:
   - 사이드바 상단에서 수업 폴더를 선택하는 드롭다운
   - 공통 dropdown 컴포넌트(createDropdownMenu) 사용
   ====================================================================== */
createDropdownMenu({
  id: "class-add-sidebar-folder-menu",
  size: "xs",
  items: [
    { title: "다이어트 1", leadingIcon: "icon--folder-fill", selected: true },
    { title: "다이어트 2", leadingIcon: "icon--folder-fill" },
    { title: "자세 교정", leadingIcon: "icon--folder-fill" },
    { title: "전문가", leadingIcon: "icon--folder-fill" },
  ],
});

// 공통 드롭다운 초기화
initializeDropdowns();

/* ======================================================================
   🎨 색상 선택 드롭다운
   ----------------------------------------------------------------------
   ✅ 설명:
   - 수업 카드 색상(라벨 컬러)을 지정하는 기능
   - createColorDropdownToggle + createColorDropdownMenu 사용
   - Tooltip과 함께 표시됨
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card-color-dropdown");

  if (container) {
    // 토글 버튼 생성 (색상칩 + caret)
    const toggle = createColorDropdownToggle({
      id: "class-add-sidebar-color-menu",
    });
    toggle.setAttribute("data-tooltip", "수업 색상");
    toggle.setAttribute("data-tooltip-direction", "top");
    container.innerHTML = "";
    container.appendChild(toggle);

    // 색상 팔레트 메뉴 생성
    createColorDropdownMenu({
      id: "class-add-sidebar-color-menu",
      size: "xs",
    });
  }

  // 반드시 DOM 전체 로드 후 초기화
  initializeDropdowns();
});

/* ======================================================================
   📋 예약 정책 - 직접 입력 라디오
   ----------------------------------------------------------------------
   ✅ 설명:
   - 특정 라디오 선택 시에만 하위 입력폼 활성화
   - 같은 name 그룹의 라디오 상태에 따라 입력폼 동기화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".radio-set.radio--small").forEach((radioSet) => {
    const radio = radioSet.querySelector("input[type='radio']");

    // 상태 업데이트 함수
    const updateState = () => {
      const isChecked = radio.checked;
      const formElements = radioSet.querySelectorAll(
        "input[type='text'], .dropdown__toggle, .text-field__stepper-btn"
      );
      formElements.forEach((el) => {
        el.disabled = !isChecked;
      });
      radioSet.classList.toggle("is-disabled", !isChecked);
    };

    // 동일 name 그룹 전체를 순회하며 상태 동기화
    radio.addEventListener("change", () => {
      document
        .querySelectorAll(`input[name='${radio.name}']`)
        .forEach((groupRadio) => {
          const groupSet = groupRadio.closest(".radio-set.radio--small");
          if (!groupSet) return;

          const elements = groupSet.querySelectorAll(
            "input[type='text'], .dropdown__toggle, .text-field__stepper-btn"
          );
          elements.forEach((el) => {
            el.disabled = !groupRadio.checked;
          });
          groupSet.classList.toggle("is-disabled", !groupRadio.checked);
        });
    });

    updateState(); // 초기 상태 반영
  });
});

/* ======================================================================
   👥 [그룹 수업] 예약 대기 정원 토글
   ----------------------------------------------------------------------
   ✅ 설명:
   - “예약대기 사용 안 함” 체크 시 → 입력폼 비활성 + 0 고정
   - 해제 시 → 기존 입력값 복원
   - 스텝퍼 버튼 상태도 함께 제어
   ====================================================================== */
function initWaitCapacityToggle(scope = document) {
  const checkbox = scope.querySelector("#checkbox--wait-disabled");
  const field = scope.querySelector(
    "#class-add-sidebar__field--wait-capacity--group .text-field"
  );
  if (!checkbox || !field) return;

  const input = field.querySelector("input.text-field__input");
  const stepperUp = field.querySelector(".text-field__stepper-btn--up");
  const stepperDown = field.querySelector(".text-field__stepper-btn--down");
  if (!input || !stepperUp || !stepperDown) return;

  let savedValue = input.value || "1"; // 해제 시 복원용

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      // 체크됨 → 비활성화 + 값 0으로 설정
      savedValue = input.value;
      input.value = "0";
      input.disabled = true;
      stepperUp.disabled = true;
      stepperDown.disabled = true;
      field.classList.add("disabled");
    } else {
      // 해제됨 → 이전값 복원 + 활성화
      input.value = savedValue;
      input.disabled = false;
      stepperUp.disabled = false;
      stepperDown.disabled = false;
      field.classList.remove("disabled");
    }
  });
}

// 페이지 로드시 즉시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initWaitCapacityToggle(document);
});

// 탭 전환 시 동적 생성 필드 재초기화
document.addEventListener("tab-updated", (e) => {
  const panel = document.querySelector(`#${e.detail.targetId}`);
  if (panel) initWaitCapacityToggle(panel);
});

/* ======================================================================
   📢 [사이드바] 수업 공지 (기본 펼침)
   ----------------------------------------------------------------------
   ✅ 설명:
   - 기본으로 펼쳐진 상태에서 시작
   - 제목 클릭 시 접기/펼치기 전환
   - 접힘 시 첫 번째 줄 요약만 표시
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const noticeRow = document.querySelector(
    ".class-add-sidebar__row-header.class-add-sidebar__notice-toggle"
  );
  const noticeWrap = document.querySelector(".class-add-sidebar__notice-wrap");
  const noticeSummary = noticeWrap.querySelector(
    ".class-add-sidebar__notice-summary"
  );
  const noticeField = noticeWrap.querySelector(
    "#class-add-sidebar__field--notice"
  );
  const caretIcon = noticeRow.querySelector(".icon");
  if (!noticeRow || !noticeWrap) return;

  let expanded = true; // 기본 펼침 상태

  function updateState() {
    if (expanded) {
      // 펼침 상태
      noticeField.hidden = false;
      noticeSummary.hidden = true;
      caretIcon.classList.remove("rotated");
    } else {
      // 접힘 상태 (첫 줄 요약 표시)
      noticeField.hidden = true;
      const textarea = noticeField.querySelector("textarea");
      const text = textarea?.value.trim() || "";
      if (text) {
        noticeSummary.textContent = text.split("\n")[0];
        noticeSummary.hidden = false;
      } else {
        noticeSummary.hidden = true;
      }
      caretIcon.classList.add("rotated");
    }
  }

  noticeRow.addEventListener("click", () => {
    expanded = !expanded;
    updateState();
  });

  updateState(); // 초기 상태 반영
});

/* ======================================================================
   📝 [사이드바] 메모 (기본 접힘)
   ----------------------------------------------------------------------
   ✅ 설명:
   - 공지와 반대로 기본 닫힌 상태
   - 클릭 시 펼침/접힘 전환
   - 접힘 시 첫 줄 요약만 표시
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const memoRow = document.querySelector(
    ".class-add-sidebar__row-header.class-add-sidebar__memo-toggle"
  );
  const memoWrap = document.querySelector(".class-add-sidebar__memo-wrap");
  const memoSummary = memoWrap.querySelector(
    ".class-add-sidebar__memo-summary"
  );
  const memoField = memoWrap.querySelector("#class-add-sidebar__field--memo");
  const caretIcon = memoRow.querySelector(".icon");
  if (!memoRow || !memoWrap) return;

  let expanded = false; // 기본 접힘 상태

  function updateState() {
    if (expanded) {
      // 펼침
      memoField.hidden = false;
      memoSummary.hidden = true;
      caretIcon.classList.add("rotated"); // ↑ 아이콘
    } else {
      // 접힘
      memoField.hidden = true;
      const textarea = memoField.querySelector("textarea");
      const text = textarea?.value.trim() || "";
      if (text) {
        memoSummary.textContent = text.split("\n")[0];
        memoSummary.hidden = false;
      } else {
        memoSummary.hidden = true;
      }
      caretIcon.classList.remove("rotated"); // ↓ 아이콘
    }
  }

  memoRow.addEventListener("click", () => {
    expanded = !expanded;
    updateState();
  });

  updateState(); // 초기 상태 반영
});
