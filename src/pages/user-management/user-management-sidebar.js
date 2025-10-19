/* ======================================================================
   📦 user-filter-sidebar.js — 회원 필터 사이드바
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 필터 사이드바 내 토글, 라디오, 체크박스, Stepper, Slider 동적 생성
   - 각 섹션 접기/펼치기 및 옵션별 UI 반응 처리
   - 슬라이더 ↔ Stepper 연동 (남은기간, 횟수, 방문수 등)
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-user-filter-sidebar> 컴포넌트로 분리 가능
   - 각 필터 섹션은 `<app-filter-section>` 또는 *ngFor 기반 구성 가능
   - Stepper/Slider는 ControlValueAccessor 기반으로 양방향 바인딩
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - user-management.scss / checkbox.scss / radio-button.scss / text-field.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 로드
   ====================================================================== */
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

/* ======================================================================
   1️⃣ 타이틀 토글 (섹션 접기/펼치기)
   ----------------------------------------------------------------------
   ✅ 역할:
   - `.section-toggle-btn` 클릭 시 `.user-filter-section`에 `collapsed` 토글
   - CSS에서 collapsed 상태로 내용 show/hide 제어
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - [class.collapsed] 바인딩 또는 *ngIf 구조로 구현 가능
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".section-toggle-btn");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".user-filter-section");
      if (!section) return;
      section.classList.toggle("collapsed");
    });
  });
});

/* ======================================================================
   2️⃣ 필터 항목 생성 (라디오 + 체크박스)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 정렬 / 상태 / 성별 / 상품 / 남은 기간 / 남은 횟수 / 담당자 / 앱연동
   - 각 섹션의 옵션 배열 기반으로 createRadioButton / createCheckbox 호출
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - *ngFor로 옵션 배열 순회
   - RadioGroup / CheckboxGroup 컴포넌트화 가능
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------
     정렬 섹션
     -------------------------------------------------- */
  const sortWrap = document.getElementById("user-filter__sort-radio-wrap");
  if (sortWrap) {
    const sortOptions = [
      { id: "radio--user-sort1", label: "최신 등록순", checked: true },
      { id: "radio--user-sort2", label: "최신 결제순" },
      { id: "radio--user-sort3", label: "최신 방문순" },
      { id: "radio--user-sort4", label: "회원 이름 가나다순" },
      { id: "radio--user-sort5", label: "미수금 높은순" },
      { id: "radio--user-sort6", label: "누적 결제금액 높은순" },
      { id: "radio--user-sort7", label: "누적 결제금액 낮은순" },
      { id: "radio--user-sort8", label: "회원권 만료 임박순" },
      { id: "radio--user-sort9", label: "락커 만료 임박순" },
    ];
    const groupName = "user-sort";

    sortWrap.innerHTML = sortOptions
      .map((opt) =>
        createRadioButton({
          id: opt.id,
          name: groupName,
          variant: "card-border",
          label: opt.label,
          checked: opt.checked || false,
        })
      )
      .join("");
  }

  /* --------------------------------------------------
     상태 섹션
     -------------------------------------------------- */
  const statusWrap = document.getElementById("user-filter__status-radio-wrap");
  if (statusWrap) {
    const statusOptions = [
      { id: "radio--user-status1", label: "전체", count: 390, checked: true },
      {
        id: "radio--user-status2",
        label: "유효",
        count: 200,
        status: "active",
      },
      {
        id: "radio--user-status3",
        label: "예정",
        count: 50,
        status: "expected",
      },
      {
        id: "radio--user-status4",
        label: "홀딩",
        count: 20,
        status: "holding",
      },
      {
        id: "radio--user-status5",
        label: "미수금",
        count: 5,
        status: "arrears",
      },
      {
        id: "radio--user-status6",
        label: "미등록",
        count: 15,
        status: "unregistered",
      },
      {
        id: "radio--user-status7",
        label: "만료임박",
        count: 60,
        status: "expiring",
      },
      {
        id: "radio--user-status8",
        label: "만료",
        count: 30,
        status: "expired",
      },
    ];

    const groupName = "user-status";

    statusWrap.innerHTML = statusOptions
      .map((opt) => {
        const labelHTML = `
          <span class="user-status__title">${opt.label}</span>
          <span class="user-status__count">${opt.count}</span>
        `;
        const html = createRadioButton({
          id: opt.id,
          name: groupName,
          size: "medium",
          variant: "card-border",
          label: labelHTML,
          checked: opt.checked || false,
        });

        const temp = document.createElement("div");
        temp.innerHTML = html.trim();
        const radioField = temp.firstElementChild;
        if (opt.status) {
          const labelEl = radioField.querySelector(".radio-label");
          labelEl.classList.add(`user__status--${opt.status}`);
        }
        return radioField.outerHTML;
      })
      .join("");
  }

  /* --------------------------------------------------
     성별 필터
     -------------------------------------------------- */
  const genderWrap = document.getElementById("user-filter-gender-wrap");
  if (genderWrap) {
    const genderOptions = [
      { id: "checkbox--user-gender-male", label: "남성", checked: true },
      { id: "checkbox--user-gender-female", label: "여성", checked: true },
    ];
    genderWrap.innerHTML = genderOptions
      .map((opt) =>
        createCheckbox({
          id: opt.id,
          size: "small",
          variant: "standard",
          label: opt.label,
          checked: opt.checked,
        })
      )
      .join("");
  }

  /* --------------------------------------------------
     상품 종류 필터
     -------------------------------------------------- */
  const productWrap = document.querySelector(".user-filter-product-checkbox");
  if (productWrap) {
    const productOptions = [
      {
        id: "checkbox--user-product-membership",
        label: "회원권",
        checked: true,
      },
      { id: "checkbox--user-product-locker", label: "락커", checked: true },
      { id: "checkbox--user-product-wear", label: "운동복", checked: true },
    ];
    productWrap.innerHTML = productOptions
      .map((opt) =>
        createCheckbox({
          id: opt.id,
          size: "small",
          variant: "standard",
          label: opt.label,
          checked: opt.checked,
        })
      )
      .join("");
  }

  /* --------------------------------------------------
     남은 기간 “무제한 포함”
     -------------------------------------------------- */
  const daysUnlimited = document.getElementById(
    "checkbox--remaining-days-unlimited"
  );
  if (daysUnlimited) {
    daysUnlimited.outerHTML = createCheckbox({
      id: "checkbox--remaining-days-unlimited",
      size: "small",
      variant: "standard",
      label: "무제한 포함",
      checked: true,
    });
  }

  /* --------------------------------------------------
     남은 횟수 (예약/출석/무제한)
     -------------------------------------------------- */
  const countWrap = document.querySelector(
    ".user-filter-remaining-count__checkbox"
  );
  if (countWrap) {
    const countOptions = [
      { id: "checkbox--remaining-count-reserve", label: "예약", checked: true },
      { id: "checkbox--remaining-count-attend", label: "출석", checked: true },
    ];
    countWrap.innerHTML = countOptions
      .map((opt) =>
        createCheckbox({
          id: opt.id,
          size: "small",
          variant: "standard",
          label: opt.label,
          checked: opt.checked,
        })
      )
      .join("");
  }

  const countUnlimited = document.getElementById(
    "checkbox--remaining-count-unlimited"
  );
  if (countUnlimited) {
    countUnlimited.outerHTML = createCheckbox({
      id: "checkbox--remaining-count-unlimited",
      size: "small",
      variant: "standard",
      label: "무제한 포함",
      checked: true,
    });
  }

  /* --------------------------------------------------
     담당자 필터
     -------------------------------------------------- */
  const staffWrap = document.querySelector(".user-filter-staff-wrap");
  if (staffWrap) {
    const staffOptions = [
      { id: "checkbox--user-staff1", label: "김민수", checked: true },
      { id: "checkbox--user-staff2", label: "김정아", checked: true },
      { id: "checkbox--user-staff3", label: "김태형", checked: true },
      { id: "checkbox--user-staff4", label: "송지민", checked: true },
      { id: "checkbox--user-staff5", label: "이서", checked: true },
      { id: "checkbox--user-staff6", label: "이휘경", checked: true },
    ];
    staffWrap.innerHTML = staffOptions
      .map((opt) =>
        createCheckbox({
          id: opt.id,
          size: "small",
          variant: "standard",
          label: opt.label,
          checked: opt.checked,
        })
      )
      .join("");
  }

  /* --------------------------------------------------
     앱 연동 상태 필터
     -------------------------------------------------- */
  const appLinkWrap = document.querySelector(
    ".user-filter-app-link-status-wrap"
  );
  if (appLinkWrap) {
    const appLinkOptions = [
      { id: "checkbox--user-app-linked", label: "연동", checked: true },
      { id: "checkbox--user-app-unlinked", label: "미연동", checked: true },
    ];
    appLinkWrap.innerHTML = appLinkOptions
      .map((opt) =>
        createCheckbox({
          id: opt.id,
          size: "small",
          variant: "standard",
          label: opt.label,
          checked: opt.checked,
        })
      )
      .join("");
  }

  /* --------------------------------------------------
     라디오 선택 시 볼드 처리
     -------------------------------------------------- */
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const name = radio.name;
      const radiosInGroup = document.querySelectorAll(`input[name="${name}"]`);
      radiosInGroup.forEach((r) => {
        const label = document.querySelector(`label[for="${r.id}"]`);
        if (!label) return;
        label.classList.toggle("is-selected", r.checked);
      });
    });
  });
});

/* ======================================================================
   3️⃣ Stepper 필드 생성 + 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - min/max TextField(variant: "stepper") 생성
   - 단위(unit) 및 min/max 값 적용
   - 슬라이더와 연동을 위해 ID 규칙 유지
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - Custom FormControl로 대체 가능 (FormGroup으로 min/max 관리)
   ====================================================================== */
function initFilterSteppers(field, { min, max, unit }) {
  const minWrap = document.querySelector(`#user-filter__field--${field}-min`);
  const maxWrap = document.querySelector(`#user-filter__field--${field}-max`);

  if (minWrap) {
    minWrap.innerHTML = createTextField({
      id: `stepper-min-${field}`,
      variant: "stepper",
      size: "small",
      unit,
      value: min,
      clearable: false,
    });
    const input = minWrap.querySelector("input.text-field__input");
    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.value = String(min);
    minWrap.querySelectorAll(".text-field__stepper-btn").forEach((btn) => {
      btn.dataset.type = "min";
    });
  }

  if (maxWrap) {
    maxWrap.innerHTML = createTextField({
      id: `stepper-max-${field}`,
      variant: "stepper",
      size: "small",
      unit,
      value: max,
      clearable: false,
    });
    const input = maxWrap.querySelector("input.text-field__input");
    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.value = String(max);
    maxWrap.querySelectorAll(".text-field__stepper-btn").forEach((btn) => {
      btn.dataset.type = "max";
    });
  }
}

/* ======================================================================
   4️⃣ Slider ↔ Stepper 연동
   ----------------------------------------------------------------------
   ✅ 역할:
   - 슬라이더와 Stepper 양방향 동기화
   - 최소 간격(minGap) 보장
   - Stepper 버튼 disabled 상태 자동 갱신
   - 실시간 트랙 색상 업데이트
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - Reactive Form 기반 valueChanges로 min/max 연동
   - Slider UI는 <input type="range"> 혹은 Angular Material Slider 대체 가능
   ====================================================================== */
function initRangeSliders() {
  document.querySelectorAll(".range-slider").forEach((wrap) => {
    const field = wrap.dataset.field;
    const sliderMin = wrap.querySelector(".slider.thumb-min");
    const sliderMax = wrap.querySelector(".slider.thumb-max");
    const sliderRange = wrap.querySelector(".slider-range");
    const stepperMin = wrap.querySelector(`#stepper-min-${field}`);
    const stepperMax = wrap.querySelector(`#stepper-max-${field}`);
    const stepButtons = wrap.querySelectorAll(".text-field__stepper-btn");
    if (!sliderMin || !sliderMax || !sliderRange || !stepperMin || !stepperMax)
      return;

    const minValue = +sliderMin.min || 0;
    const maxValue = +sliderMax.max || 500;
    const minGap = 1;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    // 슬라이더 트랙 색상 업데이트
    function updateTrack() {
      const p1 = ((+sliderMin.value - minValue) / (maxValue - minValue)) * 100;
      const p2 = ((+sliderMax.value - minValue) / (maxValue - minValue)) * 100;
      sliderRange.style.left = `${p1}%`;
      sliderRange.style.width = `${p2 - p1}%`;
    }

    // Stepper 버튼 상태 갱신
    function updateStepperButtons() {
      const minVal = parseInt(stepperMin.value, 10);
      const maxVal = parseInt(stepperMax.value, 10);
      wrap.querySelector(
        '[data-type="min"].text-field__stepper-btn--down'
      ).disabled = minVal <= minValue;
      wrap.querySelector(
        '[data-type="min"].text-field__stepper-btn--up'
      ).disabled = minVal + minGap >= maxVal;
      wrap.querySelector(
        '[data-type="max"].text-field__stepper-btn--up'
      ).disabled = maxVal >= maxValue;
      wrap.querySelector(
        '[data-type="max"].text-field__stepper-btn--down'
      ).disabled = maxVal - minGap <= minVal;
    }

    // 값 적용 (Stepper + Slider 동기화)
    function apply(min, max) {
      stepperMin.value = String(min);
      stepperMax.value = String(max);
      sliderMin.value = String(min);
      sliderMax.value = String(max);
      updateTrack();
      updateStepperButtons();
    }

    // Slider → Stepper
    function onSlider(e) {
      let min = +sliderMin.value;
      let max = +sliderMax.value;
      if (max - min < minGap) {
        if (e.target === sliderMin) min = max - minGap;
        else max = min + minGap;
      }
      apply(min, max);
      if (e.target === sliderMin) {
        sliderMin.style.zIndex = 4;
        sliderMax.style.zIndex = 3;
      } else {
        sliderMax.style.zIndex = 4;
        sliderMin.style.zIndex = 3;
      }
    }
    sliderMin.addEventListener("input", onSlider);
    sliderMax.addEventListener("input", onSlider);

    // Stepper → Slider (직접 입력 시)
    function syncFromInput(source) {
      let min = parseInt(stepperMin.value, 10);
      let max = parseInt(stepperMax.value, 10);
      if (isNaN(min)) min = +sliderMin.value;
      if (isNaN(max)) max = +sliderMax.value;
      min = clamp(min, minValue, maxValue);
      max = clamp(max, minValue, maxValue);
      if (max - min < minGap) {
        if (source === "min") min = max - minGap;
        else max = min + minGap;
      }
      apply(min, max);
    }

    stepperMin.addEventListener("change", () => syncFromInput("min"));
    stepperMax.addEventListener("change", () => syncFromInput("max"));
    stepperMin.addEventListener("blur", () => syncFromInput("min"));
    stepperMax.addEventListener("blur", () => syncFromInput("max"));

    // Stepper 버튼 증감 이벤트
    stepButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        const type = btn.dataset.type;
        const input = type === "min" ? stepperMin : stepperMax;
        const isUp = btn.classList.contains("text-field__stepper-btn--up");

        let v = parseInt(input.value, 10);
        if (isNaN(v)) v = type === "min" ? minValue : maxValue;
        input.value = v + (isUp ? 1 : -1);
        syncFromInput(type);
      });
    });

    // 초기 상태 적용
    setTimeout(() => {
      apply(+sliderMin.value, +sliderMax.value);
    }, 0);
  });
}

/* ======================================================================
   5️⃣ 초기 실행
   ----------------------------------------------------------------------
   ✅ 역할:
   - 페이지 로드 시 모든 Stepper 및 Slider 초기화
   - 호출 순서 중요: Stepper 생성 → Slider 연동
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - ngAfterViewInit에서 모든 FormControl 초기화 및 연동 가능
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 나이 필터 (10세 ~ 80세)
  initFilterSteppers("age", { min: 10, max: 80, unit: "세" });

  // 남은 일수 필터 (0일 ~ 500일)
  initFilterSteppers("days", { min: 0, max: 500, unit: "일" });

  // 남은 횟수 필터 (0회 ~ 500회)
  initFilterSteppers("count", { min: 0, max: 500, unit: "회" });

  // 방문 수 필터 (0회 ~ 1000회)
  initFilterSteppers("visits", { min: 0, max: 1000, unit: "회" });

  // Slider ↔ Stepper 연동 실행
  initRangeSliders();
});
