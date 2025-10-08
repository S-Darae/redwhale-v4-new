import { createTextField } from "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeMegaFields,
  initializePasswordToggle,
  initializeSteppers,
  initializeTextFields,
} from "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import "../../components/dropdown/dropdown-init.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

/* ==========================
   공통 렌더 함수
   - selector와 옵션을 받아 해당 위치에 필드를 렌더링
   - type에 따라 checkbox, radio, dropdown, text-field 등 생성 분기
   ========================== */
function renderField(selector, options) {
  const el = document.querySelector(selector);
  if (!el) return;

  // 이미 렌더링된 경우 다시 실행하지 않음 (값/상태 유지)
  if (el.dataset.initialized === "1") return;

  // 체크박스 생성
  if (options.type === "checkbox") {
    el.innerHTML = createCheckbox(options);
    el.dataset.initialized = "1";
    return;
  }

  // 라디오 버튼 생성
  if (options.type === "radio") {
    el.innerHTML = createRadioButton(options);
    el.dataset.initialized = "1";
    return;
  }

  // 드롭다운 생성
  if (options.type === "dropdown") {
    // 드롭다운은 text-field를 베이스로 생성
    el.innerHTML = createTextField({
      id: options.id,
      variant: "dropdown",
      size: options.size || "small",
      label: options.label,
      placeholder: options.placeholder,
      dirty: true,
    });

    // 토글 요소 찾고 드롭다운 메뉴 추가
    const toggle = document.getElementById(options.id);
    if (toggle) {
      const menuId = `${options.id}-menu`;
      const menu = createDropdownMenu({
        id: menuId,
        size: options.size || "small",
        withAvatar: options.withAvatar || false, // 아바타 아이콘 여부
        withCheckbox: options.withCheckbox || false, // 다중선택 여부
        unit: options.unit || "개", // 단위
        items: options.items || [], // 메뉴 항목
      });

      // 드롭다운 접근성 및 데이터 속성 연결
      toggle.setAttribute("aria-controls", menuId);
      toggle.setAttribute("data-dropdown-target", menuId);
      toggle.insertAdjacentElement("afterend", menu);

      // 드롭다운 초기화
      initializeDropdowns();
    }

    el.dataset.initialized = "1";
    return;
  }

  // 나머지(text-field, stepper, textarea 등)
  el.innerHTML = createTextField(options);

  // dirty 속성 자동 추가
  el.querySelectorAll(
    "input, select, textarea, button.dropdown__toggle"
  ).forEach((fld) => fld.setAttribute("data-dirty-field", "true"));

  el.dataset.initialized = "1"; // 최초 렌더링 마킹
}

/* ==========================
   새 필드가 추가된 DOM 영역 초기화
   - 공통 text-field 기능들 실행
   - 패딩 조정, 패스워드 토글, 스텝퍼 등
   ========================== */
function initFieldBehaviors(scope = document) {
  initializeTextFields(scope);
  adjustInputPadding();
  initializePasswordToggle();
  initializeMegaFields(scope);
  initializeSteppers(scope);
}

/* ==========================
   공통 강사 목록 (샘플 데이터)
   - 드롭다운에서 선택할 강사 이름 + 아바타 이미지
   ========================== */
const staffList = [
  { title: "김지민", avatar: "../../assets/images/user.jpg" },
  { title: "김정아", avatar: "../../assets/images/user.jpg" },
  { title: "김태형", avatar: "../../assets/images/user.jpg" },
  { title: "송지민", avatar: "../../assets/images/user.jpg" },
  { title: "이서", avatar: "../../assets/images/user.jpg" },
  { title: "이휘경", avatar: "../../assets/images/user.jpg" },
];

/* ==========================
   기본 필드 (항상 보이는 영역)
   - 페이지 최초 진입 시 기본으로 렌더링되는 필드들
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 헤더 검색
  renderField("#class-card-search__field", {
    id: "search-normal-nolabel",
    variant: "search",
    size: "normal",
    placeholder: "수업 이름 검색",
  });

  // 예약 가능한 회원권 검색
  renderField("#class-add-ticket-modal__field--search", {
    id: "ticket-search",
    variant: "search",
    size: "small",
    placeholder: "회원권 이름 검색",
  });

  // 폴더 편집 (이름 변경용 입력 필드)
  renderField("#folder-edit-item__field-1", {
    id: "standard-small-folder-name-1",
    variant: "standard",
    size: "small",
    value: "다이어트 1",
    placeholder: "다이어트 1",
  });
  renderField("#folder-edit-item__field-2", {
    id: "standard-small-folder-name-2",
    variant: "standard",
    size: "small",
    value: "다이어트 2",
    placeholder: "다이어트 2",
  });
  renderField("#folder-edit-item__field-3", {
    id: "standard-small-folder-name-3",
    variant: "standard",
    size: "small",
    value: "자세 교정",
    placeholder: "자세 교정",
  });
  renderField("#folder-edit-item__field-4", {
    id: "standard-small-folder-name-4",
    variant: "standard",
    size: "small",
    value: "자세 교정",
    placeholder: "자세 교정",
  });

  // 수업 이름 입력
  renderField("#class-add-sidebar__field--name", {
    id: "line-normal-class-name",
    variant: "line",
    size: "normal",
    placeholder: "수업 이름",
    autofocus: true,
    dirty: true,
  });

  // 공지/메모 입력 textarea
  renderField("#class-add-sidebar__field--notice", {
    id: "textarea-small-notice",
    variant: "textarea",
    size: "small",
    dirty: true,
  });
  renderField("#class-add-sidebar__field--memo", {
    id: "textarea-small-class-memo",
    variant: "textarea",
    size: "small",
    dirty: true,
  });

  // 초기화 실행
  initFieldBehaviors(document);
});

/* ==========================
   탭 패널 열릴 때 동적 필드 렌더링
   - tab-updated 이벤트에 따라 해당 탭(panel) 안의 필드 생성
   ========================== */
document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;
  const panel = document.querySelector(`#${targetId}`);
  if (!panel) return;

  /* --------------------------
     [개인 수업] 탭
     -------------------------- */
  if (targetId === "sidebar-content1") {
    renderField("#class-add-sidebar__field--duration--personal", {
      id: "stepper-small-class-duration-personal",
      variant: "stepper",
      size: "small",
      label: "수업시간",
      value: "50",
      unit: "분",
      align: "right",
      required: true,
      clearable: false,
    });
    renderField("#class-add-sidebar__field--capacity--personal", {
      id: "stepper-small-class-capacity-personal",
      variant: "stepper",
      size: "small",
      label: "정원",
      value: "1",
      unit: "명",
      align: "right",
      required: true,
      clearable: false,
    });
    renderField("#class-add-sidebar__field--deduction--personal", {
      id: "stepper-small-class-deduction-personal",
      variant: "stepper",
      size: "small",
      label: "예약차감횟수",
      value: "1",
      unit: "회",
      align: "right",
      required: true,
      clearable: false,
    });

    // 강사 선택 드롭다운 (단일 선택)
    renderField("#class-add-sidebar__field--staff-1", {
      id: "dropdown-small-class-teacher-1",
      type: "dropdown",
      size: "small",
      label: "강사",
      placeholder: "강사 선택",
      withAvatar: true,
      withCheckbox: false,
      unit: "명",
      items: staffList,
    });
  }

  /* --------------------------
     [그룹 수업] 탭
     -------------------------- */
  if (targetId === "sidebar-content2") {
    renderField("#class-add-sidebar__field--duration--group", {
      id: "stepper-small-class-duration-group",
      variant: "stepper",
      size: "small",
      label: "수업시간",
      value: "50",
      unit: "분",
      align: "right",
      required: true,
      clearable: false,
    });
    renderField("#class-add-sidebar__field--capacity--group", {
      id: "stepper-small-class-capacity-group",
      variant: "stepper",
      size: "small",
      label: "정원",
      value: "1",
      unit: "명",
      align: "right",
      required: true,
      clearable: false,
    });
    renderField("#class-add-sidebar__field--deduction--group", {
      id: "stepper-small-class-deduction-group",
      variant: "stepper",
      size: "small",
      label: "예약차감횟수",
      value: "1",
      unit: "회",
      align: "right",
      required: true,
      clearable: false,
    });
    renderField("#class-add-sidebar__field--wait-capacity--group", {
      id: "stepper-small-class-wait-capacity-group",
      variant: "stepper",
      size: "small",
      label: "예약대기 정원",
      placeholder: "0",
      unit: "명",
      align: "right",
      required: true,
      clearable: false,
    });

    // 예약 대기 사용 안 함 체크박스
    renderField("#class-add-sidebar__field--wait-disabled", {
      id: "checkbox--wait-disabled",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "예약대기 사용 안 함",
    });

    // 강사 선택 드롭다운 (중복 선택 가능)
    renderField("#class-add-sidebar__field--staff-2", {
      id: "dropdown-small-class-teacher-2",
      type: "dropdown",
      size: "small",
      label: "강사",
      placeholder: "강사 선택 (중복선택 가능)",
      withAvatar: true,
      withCheckbox: true,
      unit: "명",
      items: staffList,
    });
  }

  /* --------------------------
     [예약 정책] 탭
     -------------------------- */
  if (targetId === "policy-content2") {
    // 라디오 버튼 그룹
    renderField("#policy-start-radio-1", {
      id: "policy-start-1",
      type: "radio",
      name: "policy-start",
      size: "medium",
      variant: "standard",
      checked: true,
    });
    renderField("#policy-start-radio-2", {
      id: "policy-start-2",
      type: "radio",
      name: "policy-start",
      size: "medium",
      variant: "standard",
    });

    renderField("#policy-end-radio-1", {
      id: "policy-end-1",
      type: "radio",
      name: "policy-end",
      size: "medium",
      variant: "standard",
      checked: true,
    });
    renderField("#policy-end-radio-2", {
      id: "policy-end-2",
      type: "radio",
      name: "policy-end",
      size: "medium",
      variant: "standard",
    });

    renderField("#policy-cancel-radio-1", {
      id: "policy-cancel-1",
      type: "radio",
      name: "policy-cancel",
      size: "medium",
      variant: "standard",
      checked: true,
    });
    renderField("#policy-cancel-radio-2", {
      id: "policy-cancel-2",
      type: "radio",
      name: "policy-cancel",
      size: "medium",
      variant: "standard",
    });

    // 인풋/드롭다운 (stepper + dropdown 조합)
    // [예약 시작 정책] -----------------
    renderField("#class-add-sidebar__field--policy-1", {
      id: "stepper-policy-1",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      value: "7",
      unit: "일 전",
      align: "right",
      clearable: false,
    });
    renderField("#class-add-sidebar__field--policy-2", {
      id: "stepper-policy-2",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "주 전",
      align: "right",
      clearable: false,
    });
    renderField("#policy-start-dropdown-1", {
      id: "dropdown-policy-start-1",
      type: "dropdown",
      size: "small",
      placeholder: "시간",
      items: [
        { title: "0시", selected: true },
        { title: "1시" },
        { title: "2시" },
        { title: "3시" },
        { title: "4시" },
        { title: "5시" },
        { title: "6시" },
        { title: "7시" },
        { title: "8시" },
        { title: "9시" },
        { title: "10시" },
        { title: "11시" },
        { title: "12시" },
        { title: "13시" },
        { title: "14시" },
        { title: "15시" },
        { title: "16시" },
        { title: "17시" },
        { title: "18시" },
        { title: "19시" },
        { title: "20시" },
        { title: "21시" },
        { title: "22시" },
        { title: "23시" },
        { title: "24시" },
      ],
    });
    renderField("#policy-start-dropdown-2-day", {
      id: "dropdown-policy-start-2-day",
      type: "dropdown",
      size: "small",
      placeholder: "요일",
      items: [
        { title: "월요일" },
        { title: "화요일" },
        { title: "수요일" },
        { title: "목요일" },
        { title: "금요일" },
        { title: "토요일" },
        { title: "일요일" },
      ],
    });
    renderField("#policy-start-dropdown-2-time", {
      id: "dropdown-policy-start-2-time",
      type: "dropdown",
      size: "small",
      placeholder: "시간",
      items: [
        { title: "0시" },
        { title: "1시" },
        { title: "2시" },
        { title: "3시" },
        { title: "4시" },
        { title: "5시" },
        { title: "6시" },
        { title: "7시" },
        { title: "8시" },
        { title: "9시" },
        { title: "10시" },
        { title: "11시" },
        { title: "12시" },
        { title: "13시" },
        { title: "14시" },
        { title: "15시" },
        { title: "16시" },
        { title: "17시" },
        { title: "18시" },
        { title: "19시" },
        { title: "20시" },
        { title: "21시" },
        { title: "22시" },
        { title: "23시" },
        { title: "24시" },
      ],
    });

    // [예약 종료 정책] -----------------
    renderField("#class-add-sidebar__field--policy-3", {
      id: "stepper-policy-3",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      value: "0",
      align: "right",
      clearable: false,
    });
    renderField("#class-add-sidebar__field--policy-4", {
      id: "stepper-policy-4",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "일 전",
      align: "right",
      clearable: false,
    });
    renderField("#policy-end-dropdown-1", {
      id: "dropdown-policy-end-1",
      type: "dropdown",
      size: "small",
      items: [
        { title: "분", selected: true },
        { title: "시간" },
        { title: "일" },
      ],
    });
    renderField("#policy-end-dropdown-2", {
      id: "dropdown-policy-end-2",
      type: "dropdown",
      size: "small",
      placeholder: "시간",
      items: [
        { title: "0시" },
        { title: "1시" },
        { title: "2시" },
        { title: "3시" },
        { title: "4시" },
        { title: "5시" },
        { title: "6시" },
        { title: "7시" },
        { title: "8시" },
        { title: "9시" },
        { title: "10시" },
        { title: "11시" },
        { title: "12시" },
        { title: "13시" },
        { title: "14시" },
        { title: "15시" },
        { title: "16시" },
        { title: "17시" },
        { title: "18시" },
        { title: "19시" },
        { title: "20시" },
        { title: "21시" },
        { title: "22시" },
        { title: "23시" },
        { title: "24시" },
      ],
    });

    // [예약 취소 정책] -----------------
    renderField("#class-add-sidebar__field--policy-5", {
      id: "stepper-policy-5",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      value: "24",
      align: "right",
      clearable: false,
    });
    renderField("#class-add-sidebar__field--policy-6", {
      id: "stepper-policy-6",
      variant: "stepper",
      size: "small",
      placeholder: "0",
      unit: "일 전",
      align: "right",
      clearable: false,
    });
    renderField("#policy-cancel-dropdown-1", {
      id: "dropdown-policy-cancel-1",
      type: "dropdown",
      size: "small",
      items: [
        { title: "분" },
        { title: "시간", selected: true },
        { title: "일" },
      ],
    });
    renderField("#policy-cancel-dropdown-2", {
      id: "dropdown-policy-cancel-2",
      type: "dropdown",
      size: "small",
      placeholder: "시간",
      items: [
        { title: "0시" },
        { title: "1시" },
        { title: "2시" },
        { title: "3시" },
        { title: "4시" },
        { title: "5시" },
        { title: "6시" },
        { title: "7시" },
        { title: "8시" },
        { title: "9시" },
        { title: "10시" },
        { title: "11시" },
        { title: "12시" },
        { title: "13시" },
        { title: "14시" },
        { title: "15시" },
        { title: "16시" },
        { title: "17시" },
        { title: "18시" },
        { title: "19시" },
        { title: "20시" },
        { title: "21시" },
        { title: "22시" },
        { title: "23시" },
        { title: "24시" },
      ],
    });

    /* --------------------------
       라디오-필드 연결 로직
       - 같은 그룹 내에서 선택된 라디오만 필드 활성화
       - 나머지는 disabled 처리
       -------------------------- */
    function bindRadioToFields(groupId) {
      const group = document.getElementById(groupId);
      if (!group) return;

      const radios = group.querySelectorAll("input[type=radio]");

      function updateState() {
        // 그룹 내 모든 필드 비활성화
        group.querySelectorAll(".radio-linked-field").forEach((wrap) => {
          wrap
            .querySelectorAll(".text-field__input, .dropdown__toggle")
            .forEach((el) => {
              el.disabled = true;
              el.closest(".text-field")?.classList.add("disabled");
            });
          wrap.querySelectorAll(".text-field__stepper-btn").forEach((btn) => {
            btn.disabled = true;
          });
        });

        // 선택된 라디오의 필드만 활성화
        radios.forEach((radio) => {
          if (radio.checked) {
            const linked = radio
              .closest(".radio-set")
              .querySelector(".radio-linked-field");
            if (linked) {
              linked
                .querySelectorAll(".text-field__input, .dropdown__toggle")
                .forEach((el) => {
                  el.disabled = false;
                  el.closest(".text-field")?.classList.remove("disabled");
                });
              linked
                .querySelectorAll(".text-field__stepper-btn")
                .forEach((btn) => {
                  btn.disabled = false;
                });
            }
          }
        });
      }

      radios.forEach((radio) => {
        radio.addEventListener("change", updateState);
      });

      // 초기 상태 반영
      updateState();
    }

    bindRadioToFields("policy-start-radio-group");
    bindRadioToFields("policy-end-radio-group");
    bindRadioToFields("policy-cancel-radio-group");
  }

  // 동적으로 붙은 DOM도 초기화 필요
  initFieldBehaviors(panel);
});
