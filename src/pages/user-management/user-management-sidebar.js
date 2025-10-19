import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

/* ==========================
   타이틀 토글 (섹션 접고 펴기)
   ==========================
   - 각 섹션의 `.section-toggle-btn` 클릭 시
     해당 `.user-filter-section`에 `collapsed` 토글
   - CSS에서 `collapsed` 상태를 기반으로
     섹션 내용을 show/hide 제어
========================== */
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

/* ==========================
   필터 항목 생성 (라디오 + 체크박스)
   ==========================
   - 정렬 / 상태 / 성별 / 상품 / 남은 기간 / 남은 횟수 / 담당자 / 앱연동
   - 각 섹션별로 옵션 배열을 기반으로 동적으로 HTML 렌더링
   - 공통 컴포넌트(createRadioButton / createCheckbox) 사용
========================== */
document.addEventListener("DOMContentLoaded", () => {
  /* 🔹 정렬 섹션 */
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

    // 라디오 그룹 생성
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

  /* 🔹 상태 섹션 */
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

    // 상태별 라디오 생성 + 상태 클래스 적용 (ex. .user__status--active)
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

  /* 🔹 성별 섹션 */
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

  /* 🔹 상품 종류 섹션 */
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

  /* 🔹 남은 기간 “무제한 포함” */
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

  /* 🔹 남은 횟수 (예약/출석/무제한) */
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

  /* 🔹 담당자 체크박스 */
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

  /* 🔹 앱 연동 상태 (연동 / 미연동) */
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

  /* 🔹 라디오 선택 시 볼드 처리 */
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

/* ==========================
   Stepper 필드 생성 + 보정
   ==========================
   - min/max 두 필드 각각 TextField(variant: "stepper") 생성
   - 단위(unit) 및 초기값 설정
   - 슬라이더와 연동을 위해 ID 규칙 유지 (stepper-min-{field})
========================== */
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

/* ==========================
   Slider ↔ Stepper 연동
   ==========================
   - 슬라이더와 Stepper를 상호 동기화
   - 최소 간격(minGap) 보장
   - Stepper 버튼 상태(disabled) 자동 갱신
   - 실시간 UI 업데이트 (슬라이더 트랙 색상 등)
========================== */
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

    // 슬라이더 트랙 업데이트 (색상 채워진 부분)
    function updateTrack() {
      const p1 = ((+sliderMin.value - minValue) / (maxValue - minValue)) * 100;
      const p2 = ((+sliderMax.value - minValue) / (maxValue - minValue)) * 100;
      sliderRange.style.left = `${p1}%`;
      sliderRange.style.width = `${p2 - p1}%`;
    }

    // Stepper 버튼 disabled 상태 갱신
    function updateStepperButtons() {
      const minVal = parseInt(stepperMin.value, 10);
      const maxVal = parseInt(stepperMax.value, 10);

      const minDown = wrap.querySelector(
        '[data-type="min"].text-field__stepper-btn--down'
      );
      if (minDown) minDown.disabled = minVal <= minValue;

      const minUp = wrap.querySelector(
        '[data-type="min"].text-field__stepper-btn--up'
      );
      if (minUp) minUp.disabled = minVal + minGap >= maxVal;

      const maxUp = wrap.querySelector(
        '[data-type="max"].text-field__stepper-btn--up'
      );
      if (maxUp) maxUp.disabled = maxVal >= maxValue;

      const maxDown = wrap.querySelector(
        '[data-type="max"].text-field__stepper-btn--down'
      );
      if (maxDown) maxDown.disabled = maxVal - minGap <= minVal;
    }

    // min/max 값 적용 (Stepper + Slider 동기화)
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

    // Stepper → Slider (입력 직접 수정 시)
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

    // Stepper 버튼 클릭 시 (증감)
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

/* ==========================
   초기 실행
   ==========================
   - 모든 필드(stepper + slider) 초기화 실행
   - 호출 순서 중요: stepper 생성 후 slider 연동
========================== */
document.addEventListener("DOMContentLoaded", () => {
  initFilterSteppers("age", { min: 10, max: 80, unit: "세" });
  initFilterSteppers("days", { min: 0, max: 500, unit: "일" });
  initFilterSteppers("count", { min: 0, max: 500, unit: "회" });
  initFilterSteppers("visits", { min: 0, max: 1000, unit: "회" });

  initRangeSliders();
});
