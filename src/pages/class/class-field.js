/* ======================================================================
   🧱 기본 필드 렌더링 (페이지 로드시)
   ----------------------------------------------------------------------
   ✅ 설명:
   - 페이지 최초 진입 시 항상 보이는 필드들 생성
   - ex) 검색창, 폴더명, 수업명, 공지/메모 등
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 🔍 헤더 검색
  renderField("#class-card-search__field", {
    id: "search-normal-nolabel",
    variant: "search",
    size: "normal",
    placeholder: "수업 이름 검색",
  });

  // 🔎 예약 가능한 회원권 검색
  renderField("#class-add-ticket-modal__field--search", {
    id: "ticket-search",
    variant: "search",
    size: "small",
    placeholder: "회원권 이름 검색",
  });

  // 📁 폴더 편집 입력 필드
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

  // 🧾 수업 이름 입력
  renderField("#class-add-sidebar__field--name", {
    id: "line-normal-class-name",
    variant: "line",
    size: "normal",
    placeholder: "수업 이름",
    autofocus: true,
    dirty: true,
  });

  // 📝 공지/메모 입력
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

  // 필드 동작 초기화
  initFieldBehaviors(document);
});

/* ======================================================================
   🧭 탭 패널별 동적 필드 렌더링
   ----------------------------------------------------------------------
   ✅ 설명:
   - tab-updated 이벤트 발생 시 해당 탭(panel)에 필요한 필드 생성
   - 개인 수업 / 그룹 수업 / 예약 정책 등 탭별 분기
   ====================================================================== */
document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;
  const panel = document.querySelector(`#${targetId}`);
  if (!panel) return;

  /* =====================================================
     🧍 [개인 수업] 탭
     ===================================================== */
  if (targetId === "sidebar-content1") {
    // 스텝퍼 필드 3종 (시간/정원/차감횟수)
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
      withSearch: true,
      unit: "명",
      items: staffList,
    });
  }

  /* =====================================================
     👥 [그룹 수업] 탭
     ===================================================== */
  if (targetId === "sidebar-content2") {
    // 스텝퍼 필드 4종 (시간/정원/차감횟수/대기정원)
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

    // 대기 기능 비활성 체크박스
    renderField("#class-add-sidebar__field--wait-disabled", {
      id: "checkbox--wait-disabled",
      type: "checkbox",
      size: "small",
      variant: "standard",
      label: "예약대기 사용 안 함",
    });

    // 강사 선택 드롭다운 (복수 선택)
    renderField("#class-add-sidebar__field--staff-2", {
      id: "dropdown-small-class-teacher-2",
      type: "dropdown",
      size: "small",
      label: "강사",
      placeholder: "강사 선택 (중복선택 가능)",
      withAvatar: true,
      withCheckbox: true,
      withSearch: true,
      unit: "명",
      items: staffList,
    });
  }
});

/* =====================================================
   📅 [예약 정책] 탭
   ===================================================== */
document.addEventListener("tab-updated", (e) => {
  const { targetId } = e.detail;
  const panel = document.querySelector(`#${targetId}`);
  if (!panel) return;

  /* --------------------------
     📅 예약 정책 탭
     -------------------------- */
  if (targetId === "policy-content2") {
    /* ======================================================================
       🧭 라디오 버튼 그룹 생성
       ----------------------------------------------------------------------
       ✅ 설명:
       - 예약 시작/종료/취소 정책을 설정하는 라디오 그룹
       - 선택된 라디오에 따라 하단 필드 활성화됨
       ====================================================================== */
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

    /* ======================================================================
       🕒 예약 시작 정책 필드
       ----------------------------------------------------------------------
       ✅ 구성:
       - stepper 2개 + dropdown 2개 (일 전, 주 전, 요일, 시간)
       ====================================================================== */
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
      items: Array.from({ length: 25 }, (_, i) => ({
        title: `${i}시`,
        selected: i === 0,
      })),
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
      items: Array.from({ length: 25 }, (_, i) => ({ title: `${i}시` })),
    });

    /* ======================================================================
       ⏰ 예약 종료 정책 필드
       ----------------------------------------------------------------------
       ✅ 구성:
       - stepper 2개 + dropdown 2개 (시간 단위, 전 기준 등)
       ====================================================================== */
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
      items: Array.from({ length: 25 }, (_, i) => ({ title: `${i}시` })),
    });

    /* ======================================================================
       ❌ 예약 취소 정책 필드
       ----------------------------------------------------------------------
       ✅ 구성:
       - stepper 2개 + dropdown 2개 (시간 전, 일 전, 단위 선택)
       ====================================================================== */
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
      items: Array.from({ length: 25 }, (_, i) => ({ title: `${i}시` })),
    });

    /* ======================================================================
       🔗 라디오 ↔ 필드 연동 로직
       ----------------------------------------------------------------------
       ✅ 설명:
       - 라디오 그룹별로 선택된 항목만 활성화
       - 나머지는 disabled 처리하여 입력 불가
       ====================================================================== */
    function bindRadioToFields(groupId) {
      const group = document.getElementById(groupId);
      if (!group) return;

      const radios = group.querySelectorAll("input[type=radio]");

      // 상태 업데이트 함수
      function updateState() {
        // ① 그룹 내 모든 필드 비활성화
        group.querySelectorAll(".radio-linked-field").forEach((wrap) => {
          wrap
            .querySelectorAll(".text-field__input, .dropdown__toggle")
            .forEach((el) => {
              el.disabled = true;
              el.closest(".text-field")?.classList.add("disabled");
            });
          wrap
            .querySelectorAll(".text-field__stepper-btn")
            .forEach((btn) => (btn.disabled = true));
        });

        // ② 선택된 라디오의 필드만 활성화
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
                .forEach((btn) => (btn.disabled = false));
            }
          }
        });
      }

      // 이벤트 바인딩
      radios.forEach((radio) => radio.addEventListener("change", updateState));

      // 초기 상태 반영
      updateState();
    }

    // 라디오 그룹별 바인딩
    bindRadioToFields("policy-start-radio-group");
    bindRadioToFields("policy-end-radio-group");
    bindRadioToFields("policy-cancel-radio-group");
  }

  /* ======================================================================
     🧾 동적 필드 초기화 (탭 렌더링 완료 후)
     ----------------------------------------------------------------------
     ✅ 역할:
     - 새로 생성된 필드의 기본 동작 활성화
     - 스텝퍼/패딩/토글 등 재초기화
     ====================================================================== */
  initFieldBehaviors(panel);
});
