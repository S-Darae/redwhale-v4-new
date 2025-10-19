/**
 * ======================================================================
 * 🧩 text-field.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 모든 텍스트 필드의 인터랙션 및 상태 관리를 담당하는 메인 초기화 스크립트
 * - 버튼, 스텝퍼, 비밀번호 토글, 입력 제한, 타이머, 캘린더 위치 계산 등 종합 기능 제공
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ initializeTextFields() → 입력 필드 초기화, clear 버튼, 글자수 카운트 등
 * 2️⃣ adjustInputPadding() → leading / tailing 요소 크기에 따른 padding 보정
 * 3️⃣ initializePasswordToggle() → 눈 아이콘으로 password 보기/숨기기
 * 4️⃣ initializeMegaFields() → OTP/인증번호 한 글자 입력 필드 제어
 * 5️⃣ initializeSteppers() → 숫자 스텝 증가/감소 버튼 제어
 * 6️⃣ positionElement() → date-picker, range-picker 위치 계산
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - 각 기능을 독립 디렉티브로 분리 가능 (ex. `<app-stepper-field>`, `<app-timer-input>`)
 * - 입력/포맷/카운트 관련 로직은 Reactive Form ControlValueAccessor로 이관
 * - 캘린더 위치 계산은 Angular CDK Overlay를 사용하여 자동 위치 조정 가능
 * ----------------------------------------------------------------------
 * 📘 사용 예시 (Vanilla)
 * document.addEventListener("DOMContentLoaded", () => {
 *   initializeTextFields();
 *   adjustInputPadding();
 *   initializePasswordToggle();
 *   initializeMegaFields();
 *   initializeSteppers();
 * });
 * ======================================================================
 */

import "../tooltip/tooltip.scss";
import "./create-text-field.js";
import "./text-field.scss";

/* =========================================================
   📦 초기 실행
   ---------------------------------------------------------
   - DOM 로드 후 모든 text-field 관련 기능 초기화
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  initializeTextFields();
  adjustInputPadding();
  initializePasswordToggle();
  initializeMegaFields();
  initializeSteppers();
});

/**
 * ======================================================================
 * ✏️ initializeTextFields()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 모든 `.text-field__wrapper`를 탐색해 다음 기능 초기화:
 *   1️⃣ X 버튼(clear)
 *   2️⃣ 숫자 입력 제한 (전화번호 제외)
 *   3️⃣ 3자리 콤마 자동 처리
 *   4️⃣ 글자 수 카운트
 *   5️⃣ 타이머 표시
 * ----------------------------------------------------------------------
 * @param {HTMLElement} [scope=document] - 초기화 대상 영역
 * ======================================================================
 */
function initializeTextFields(scope = document) {
  const textFields = scope.querySelectorAll(".text-field__wrapper");

  textFields.forEach((wrapper) => {
    const input = wrapper.querySelector(".text-field__input");
    const clearButton = wrapper.querySelector(".btn--icon-only--x");
    const timerElement = wrapper.closest(".text-field").querySelector(".timer");
    const charCountElement = wrapper
      .closest(".text-field")
      ?.querySelector(".char-count");

    /* ------------------------------
       ⏱ 타이머 시작 (data-timer 감지)
       ------------------------------ */
    if (timerElement) {
      const timerValue = timerElement.dataset.timer;
      if (timerValue) startTimer(timerValue, timerElement);
    }

    /* ------------------------------
       ❌ X 버튼 초기 상태 설정
       ------------------------------ */
    if (clearButton) clearButton.style.display = "none";

    clearButton?.addEventListener("click", (e) => {
      e.preventDefault();
      if (!input) return;

      input.value = "";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));

      toggleClearButton(input, clearButton, true);

      if (charCountElement) charCountElement.textContent = "0";
    });

    clearButton?.addEventListener("mousedown", (e) => e.preventDefault());

    /* ------------------------------
       🔢 숫자만 입력 허용 (전화번호 제외)
       ------------------------------ */
    if (
      input?.getAttribute("inputmode") === "numeric" &&
      input.dataset.format !== "tel"
    ) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
      });
    }

    /* ------------------------------
       🧮 입력 이벤트 처리
       ------------------------------ */
    input?.addEventListener("input", () => {
      // 3자리 콤마
      if (input.dataset.comma === "true") {
        let value = input.value.replace(/,/g, "").replace(/^0+/, "");
        if (!isNaN(value) && value !== "") {
          input.value = Number(value).toLocaleString("ko-KR");
        }
      }

      // 글자 수 카운트 갱신
      if (charCountElement) {
        charCountElement.textContent = input.value.replace(/,/g, "").length;
      }

      toggleClearButton(input, clearButton, true);
    });

    /* ------------------------------
       ✨ focus/blur 이벤트
       ------------------------------ */
    input?.addEventListener("focus", () => {
      toggleClearButton(input, clearButton, true);
    });
    input?.addEventListener("blur", () => {
      toggleClearButton(input, clearButton, false);
    });

    /* ------------------------------
       초기 글자 수 반영
       ------------------------------ */
    if (charCountElement) {
      charCountElement.textContent = input.value.replace(/,/g, "").length;
    }
  });
}

/**
 * ======================================================================
 * ❌ toggleClearButton()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - X(clear) 버튼의 표시 / 숨김 상태를 제어
 * ----------------------------------------------------------------------
 * @param {HTMLInputElement} input - 입력 필드
 * @param {HTMLElement} clearButton - X 버튼 요소
 * @param {boolean} isFocused - 현재 포커스 여부
 * ======================================================================
 */
function toggleClearButton(input, clearButton, isFocused) {
  if (clearButton) {
    if (isFocused) {
      clearButton.style.display = input.value.length > 0 ? "block" : "none";
    } else {
      clearButton.style.display = "none";
    }
  }
}

/**
 * ======================================================================
 * 📏 adjustInputPadding()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 텍스트필드 내부 요소(leading, tailing, select, unit 등)의 폭에 따라
 *   입력창의 padding을 동적으로 조정
 * ----------------------------------------------------------------------
 * - clear 버튼 / stepper / dropdown 등의 위치도 함께 보정
 * ======================================================================
 */
function adjustInputPadding() {
  const wrappers = document.querySelectorAll(".text-field__wrapper");

  wrappers.forEach((wrapper) => {
    const input = wrapper.querySelector(".text-field__input");
    const field = wrapper.closest(".text-field");

    if (field?.classList.contains("text-field--mega")) return;
    if (!input) return;

    const leading =
      wrapper.querySelector(".leading") ||
      wrapper.querySelector(".icon--search-bold") ||
      wrapper.querySelector(".text-field__select--leading");

    const tailing = wrapper.querySelector(".tailing");
    const tailingSelect = wrapper.querySelector(".text-field__select--tailing");
    const unit = wrapper.querySelector(".unit");

    const updatePadding = () => {
      let baseLeft = field?.classList.contains("small") ? 10 : 12;
      let baseRight = field?.classList.contains("small") ? 10 : 12;

      let extraLeadingGap = 5;
      let extraTailingGap = 4;

      if (field?.classList.contains("text-field--leading-select")) {
        extraLeadingGap = 0;
      }
      if (field?.classList.contains("text-field--tailing-select")) {
        extraTailingGap = 0;
      }

      let left = leading
        ? leading.offsetWidth + baseLeft + extraLeadingGap
        : baseLeft;
      let right = tailing
        ? tailing.offsetWidth + baseRight + extraTailingGap
        : baseRight;

      // Dropdown variant → padding 최소화
      if (field?.classList.contains("text-field--dropdown")) {
        left = baseLeft;
      }

      // Line variant 보정
      const isLine = field?.classList.contains("text-field--line");
      if (isLine) {
        left = Math.max(0, left - 8);
        right = Math.max(0, right - 8);
        if (wrapper.querySelector(".leading")) {
          wrapper.querySelector(".leading").style.marginLeft = "-8px";
        }
        if (unit) unit.style.marginRight = "0px";
      }

      // tailing-select 폭 반영
      if (
        field?.classList.contains("text-field--tailing-select") &&
        tailingSelect
      ) {
        right += tailingSelect.offsetWidth;
        field.style.setProperty(
          "--tailing-toggle-width",
          `${tailingSelect.offsetWidth}px`
        );
      }

      // clear 버튼 위치 조정
      const clearBtn = wrapper.querySelector(".btn--icon-only--x");
      if (!clearBtn) {
        right = Math.max(6, right - 8);
      }

      input.style.paddingLeft = `${left}px`;
      input.style.paddingRight = `${right}px`;

      if (clearBtn) {
        if (
          field?.classList.contains("text-field--tailing-select") &&
          tailingSelect
        ) {
          clearBtn.style.right = `${tailingSelect.offsetWidth + 8}px`;
        } else {
          clearBtn.style.right = "8px";
        }
      }
    };

    updatePadding();

    // 크기 변경 감지 → padding 갱신
    if (leading) new ResizeObserver(updatePadding).observe(leading);
    if (tailing) new ResizeObserver(updatePadding).observe(tailing);
    if (tailingSelect) new ResizeObserver(updatePadding).observe(tailingSelect);
    if (unit) new ResizeObserver(updatePadding).observe(unit);
  });
}

/**
 * ======================================================================
 * ⏱ startTimer()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - data-timer 속성을 읽어 카운트다운을 표시 ("MM:SS" 또는 초 단위)
 * ----------------------------------------------------------------------
 * @param {string|number} timerValue - 초기 타이머 값
 * @param {HTMLElement} display - 타이머 표시 대상
 * ======================================================================
 */
function startTimer(timerValue, display) {
  let duration;

  if (typeof timerValue === "string" && timerValue.includes(":")) {
    const [m, s] = timerValue.split(":").map((v) => parseInt(v, 10));
    duration = m * 60 + s;
  } else {
    duration = parseInt(timerValue, 10) || 0;
  }

  let timer = duration;

  const renderTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
  };
  renderTime();

  const interval = setInterval(() => {
    timer--;
    if (timer < 0) {
      clearInterval(interval);
      display.textContent = "00:00";
      return;
    }
    renderTime();
  }, 1000);
}

/**
 * ======================================================================
 * 👁 initializePasswordToggle()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 비밀번호 입력 필드에서 눈 아이콘 클릭 시 password ↔ text 전환
 * ======================================================================
 */
function initializePasswordToggle() {
  const eyeicon = document.querySelectorAll(".btn--view");

  eyeicon.forEach((button) => {
    const input = button
      .closest(".text-field__wrapper")
      .querySelector(".text-field__input");
    const eyeOpenIcon = button.querySelector(".icon--eye");
    const eyeCloseIcon = button.querySelector(".icon--eye-slash");

    button.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        eyeOpenIcon.style.display = "none";
        eyeCloseIcon.style.display = "block";
      } else {
        input.type = "password";
        eyeOpenIcon.style.display = "block";
        eyeCloseIcon.style.display = "none";
      }
    });
  });
}

/**
 * ======================================================================
 * 🔢 initializeMegaFields()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - Mega input(OTP/인증번호) 필드 처리
 * - 한 글자 입력 시 다음 필드 자동 이동
 * - Backspace 시 이전 필드로 포커스 이동
 * ======================================================================
 */
function initializeMegaFields(scope = document) {
  const megaFields = scope.querySelectorAll(
    ".text-field--mega .text-field__input"
  );

  megaFields.forEach((input, idx, allInputs) => {
    input.addEventListener("input", () => {
      if (input.value.length >= 1) {
        input.value = input.value.slice(0, 1);
        if (idx < allInputs.length - 1) {
          allInputs[idx + 1].focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && idx > 0) {
        allInputs[idx - 1].focus();
      }
    });
  });
}

/**
 * ======================================================================
 * ➕ initializeSteppers()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 스텝퍼(숫자 증감 버튼) 기능 제어
 * - 최소 0 제한, 3자리 콤마 적용(data-comma="true" 지원)
 * ======================================================================
 */
function initializeSteppers(scope = document) {
  const steppers = scope.querySelectorAll(
    ".text-field--stepper .text-field__stepper"
  );

  steppers.forEach((stepper) => {
    if (stepper.dataset.initialized === "true") return;

    const input = stepper
      .closest(".text-field__wrapper")
      .querySelector(".text-field__input");
    const upBtn = stepper.querySelector(".text-field__stepper-btn--up");
    const downBtn = stepper.querySelector(".text-field__stepper-btn--down");

    let touched = false;

    const updateState = () => {
      let raw = input.value.replace(/,/g, "");
      let val = parseInt(raw, 10);

      if (!touched && (raw === "" || isNaN(val))) {
        input.value = "";
        downBtn.disabled = true;
        upBtn.disabled = input.disabled;
      } else {
        touched = true;
        val = isNaN(val) ? 0 : val;

        if (input.dataset.comma === "true") {
          input.value = val.toLocaleString("ko-KR");
        } else {
          input.value = val.toString();
        }

        downBtn.disabled = val <= 0 || input.disabled;
        upBtn.disabled = input.disabled;
      }
    };

    // 버튼 이벤트
    upBtn.addEventListener("click", () => {
      if (input.disabled) return;
      let raw = input.value.replace(/,/g, "");
      let val = parseInt(raw, 10) || 0;
      touched = true;
      val++;
      input.value = val;
      updateState();
    });

    downBtn.addEventListener("click", () => {
      if (input.disabled) return;
      let raw = input.value.replace(/,/g, "");
      let val = parseInt(raw, 10) || 0;
      touched = true;
      if (val > 0) val--;
      input.value = val;
      updateState();
    });

    input.addEventListener("input", () => {
      touched = true;
      updateState();
    });

    updateState();
    stepper.dataset.initialized = "true"; // 중복 초기화 방지
  });
}

/**
 * ======================================================================
 * 📍 positionElement()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 캘린더(단일/범위 선택기)의 화면 내 위치를 계산하여 표시
 * ======================================================================
 */
function positionElement(element, triggerRect, preferredTop = true) {
  const elementWidth = element.offsetWidth || 300;
  const elementHeight = element.offsetHeight || 350;

  let left = window.scrollX + triggerRect.left;
  let top;

  if (left + elementWidth > window.innerWidth - 8) {
    left = window.innerWidth - elementWidth - 8;
  }

  if (preferredTop) {
    top = window.scrollY + triggerRect.bottom + 4;
    if (top + elementHeight > window.scrollY + window.innerHeight) {
      top = window.scrollY + triggerRect.top - elementHeight - 4;
    }
  } else {
    top = window.scrollY + triggerRect.top - elementHeight - 4;
    if (top < window.scrollY) {
      top = window.scrollY + triggerRect.bottom + 4;
    }
  }

  element.style.position = "absolute";
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  element.style.display = "block";
}

/* =========================================================
   📅 Date picker / Range picker 이벤트 등록
   ========================================================= */
document.querySelectorAll(".date-input").forEach((input) => {
  input.addEventListener("click", (e) => {
    e.stopPropagation();
    const calendar = document.getElementById("calendar");
    const container = document.querySelector(".calendar-container");
    if (!calendar) return;

    if (container) container.style.display = "none";

    const rect = input.getBoundingClientRect();
    positionElement(calendar, rect, true);
  });
});

document.querySelectorAll(".date-range-input").forEach((input) => {
  input.addEventListener("click", (e) => {
    e.stopPropagation();
    const container = document.querySelector(".calendar-container");
    const calendar = document.getElementById("calendar");
    if (!container) return;

    if (calendar) calendar.style.display = "none";

    const rect = input.getBoundingClientRect();
    positionElement(container, rect, true);
  });
});

/* =========================================================
   🧹 바깥 클릭 시 캘린더 닫기
   ========================================================= */
document.addEventListener("click", (e) => {
  const calendar = document.getElementById("calendar");
  const container = document.querySelector(".calendar-container");

  if (
    calendar &&
    !calendar.contains(e.target) &&
    !e.target.classList.contains("date-input")
  ) {
    calendar.style.display = "none";
  }

  if (
    container &&
    !container.contains(e.target) &&
    !e.target.classList.contains("date-range-input")
  ) {
    container.style.display = "none";
  }
});

/**
 * ======================================================================
 * 🌐 전역 접근(window 바인딩)
 * ======================================================================
 */
window.initializeTextFields = initializeTextFields;
window.adjustInputPadding = adjustInputPadding;
window.initializePasswordToggle = initializePasswordToggle;
window.initializeMegaFields = initializeMegaFields;
window.initializeSteppers = initializeSteppers;

export {
  adjustInputPadding,
  initializeMegaFields,
  initializePasswordToggle,
  initializeSteppers,
  initializeTextFields,
};
