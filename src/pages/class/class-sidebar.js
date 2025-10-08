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

/* ==========================
   📂 폴더 선택 드롭다운
   - 사이드바 상단에서 수업 폴더 선택
   - 공통 드롭다운 컴포넌트 사용
   ========================== */
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

// 드롭다운 공통 초기화
initializeDropdowns();

/* ==========================
   🎨 색상 선택 드롭다운
   - 수업 카드에 표시될 라벨 색상 지정
   - 전용 컴포넌트 (createColorDropdownMenu/Toggle) 사용
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card-color-dropdown");

  if (container) {
    // 토글 버튼 생성 (색상칩 + caret 아이콘)
    const toggle = createColorDropdownToggle({
      id: "class-add-sidebar-color-menu",
    });
    toggle.setAttribute("data-tooltip", "수업 색상"); // 툴팁 텍스트
    toggle.setAttribute("data-tooltip-direction", "top"); // 툴팁 방향
    container.innerHTML = "";
    container.appendChild(toggle);

    // 메뉴 생성 (고정 색상 팔레트)
    createColorDropdownMenu({
      id: "class-add-sidebar-color-menu",
      size: "xs",
    });
  }

  // 반드시 DOM 다 준비된 후 실행
  initializeDropdowns();
});

/* ==========================
   📋 예약 정책 - 직접 입력 라디오
   - 특정 라디오 선택 시에만 하위 입력폼 활성화
   - 그룹 라디오 동기화 처리 포함
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".radio-set.radio--small").forEach((radioSet) => {
    const radio = radioSet.querySelector("input[type='radio']");

    // 선택 여부에 따라 하위 입력폼 disable 처리
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

    // 동일 name 그룹 내에서 상태 동기화
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

/* ==========================
   👥 [그룹 수업] 예약 대기 정원 토글
   - "대기 없음" 체크 시 → 입력폼 disable + 값 0으로 고정
   - 해제 시 → 이전 값 복원
   ========================== */
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

  let savedValue = input.value || "1"; // 해제 시 복원용 값 저장

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      // 체크됨 → disable + 0 고정
      savedValue = input.value;
      input.value = "0";
      input.disabled = true;
      stepperUp.disabled = true;
      stepperDown.disabled = true;
      field.classList.add("disabled");
    } else {
      // 해제됨 → 복원 + enable
      input.value = savedValue;
      input.disabled = false;
      stepperUp.disabled = false;
      stepperDown.disabled = false;
      field.classList.remove("disabled");
    }
  });
}

// DOM 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  initWaitCapacityToggle(document);
});

// 탭 전환 시 동적 생성된 경우 처리
document.addEventListener("tab-updated", (e) => {
  const panel = document.querySelector(`#${e.detail.targetId}`);
  if (panel) initWaitCapacityToggle(panel);
});

/* ==========================
   📢 [사이드바] 수업 공지 (기본 펼침)
   - 행 클릭 시 토글
   - 접혔을 때는 첫 줄 요약만 표시
   ========================== */
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

  let expanded = true; // 기본 펼침

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
  updateState();
});

/* ==========================
   📝 [사이드바] 메모 (기본 접힘)
   - 공지와 반대 로직 (기본 닫힘)
   - 접힘 시 첫 줄 요약 표시
   ========================== */
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

  let expanded = false; // 기본 접힘

  function updateState() {
    if (expanded) {
      // 펼침
      memoField.hidden = false;
      memoSummary.hidden = true;
      caretIcon.classList.add("rotated"); // 위쪽 화살표
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
      caretIcon.classList.remove("rotated"); // 아래쪽 화살표
    }
  }

  memoRow.addEventListener("click", () => {
    expanded = !expanded;
    updateState();
  });
  updateState();
});
