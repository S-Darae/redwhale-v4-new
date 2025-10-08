import "../tooltip/tooltip.scss";
import "./create-text-field.js";
import "./text-field.scss";

document.addEventListener("DOMContentLoaded", function () {
  // 페이지 로드 후 초기화 실행
  initializeTextFields();
  adjustInputPadding();
  initializePasswordToggle();
  initializeMegaFields();
  initializeSteppers();
});

/* ==========================
   텍스트 필드 초기화
   ==========================
   - X 버튼(clear) 동작
   - 숫자만 입력 제한 (전화번호 제외)
   - 3자리 콤마 처리
   - 글자 수 카운트
   - 타이머 표시
   ========================== */
function initializeTextFields(scope = document) {
  const textFields = scope.querySelectorAll(".text-field__wrapper");

  textFields.forEach((wrapper) => {
    const input = wrapper.querySelector(".text-field__input");
    const clearButton = wrapper.querySelector(".btn--icon-only--x");
    const timerElement = wrapper.closest(".text-field").querySelector(".timer");
    const charCountElement = wrapper
      .closest(".text-field")
      ?.querySelector(".char-count");

    // 타이머 시작 (data-timer 속성에 값이 있으면)
    if (timerElement) {
      const timerValue = timerElement.dataset.timer;
      if (timerValue) startTimer(timerValue, timerElement);
    }

    // X 버튼 기본 숨김
    if (clearButton) clearButton.style.display = "none";

    // X 버튼 클릭 → 입력값 초기화
    clearButton?.addEventListener("click", function (e) {
      e.preventDefault();
      if (!input) return;

      input.value = "";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));

      toggleClearButton(input, clearButton, true);

      if (charCountElement) charCountElement.textContent = "0";
    });

    // X 버튼 클릭 시 focus 유지
    clearButton?.addEventListener("mousedown", (e) => e.preventDefault());

    // 숫자 전용 필드 (inputmode="numeric") → 숫자 외 제거
    // 단, 전화번호 포맷(data-format="tel")은 제외
    if (
      input?.getAttribute("inputmode") === "numeric" &&
      input.dataset.format !== "tel"
    ) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
      });
    }

    // 입력 이벤트 처리
    input?.addEventListener("input", function () {
      // 3자리 콤마 적용 (data-comma="true")
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

    // focus/blur 이벤트 → X 버튼 표시 제어
    input?.addEventListener("focus", () => {
      toggleClearButton(input, clearButton, true);
    });
    input?.addEventListener("blur", () => {
      toggleClearButton(input, clearButton, false);
    });

    // 초기 상태에서도 글자 수 반영
    if (charCountElement) {
      charCountElement.textContent = input.value.replace(/,/g, "").length;
    }
  });
}

/* ==========================
   X 버튼 표시/숨김 제어
   ========================== */
function toggleClearButton(input, clearButton, isFocused) {
  if (clearButton) {
    if (isFocused) {
      clearButton.style.display = input.value.length > 0 ? "block" : "none";
    } else {
      clearButton.style.display = "none";
    }
  }
}

/* ==========================
   입력창 padding 동적 조정
   ==========================
   - leading / tailing / select / unit 요소 크기에 맞춰 padding 재계산
   - clear 버튼 위치도 함께 조정
   ========================== */
function adjustInputPadding() {
  const wrappers = document.querySelectorAll(".text-field__wrapper");

  wrappers.forEach((wrapper) => {
    const input = wrapper.querySelector(".text-field__input");
    const field = wrapper.closest(".text-field");

    // Mega 타입은 패딩 조정 제외
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

      // leading-select는 gap 제거
      if (field?.classList.contains("text-field--leading-select")) {
        extraLeadingGap = 0;
      }

      // tailing-select는 gap 제거
      if (field?.classList.contains("text-field--tailing-select")) {
        extraTailingGap = 0;
      }

      // padding 계산
      let left = leading
        ? leading.offsetWidth + baseLeft + extraLeadingGap
        : baseLeft;
      let right = tailing
        ? tailing.offsetWidth + baseRight + extraTailingGap
        : baseRight;

      // 드롭다운 variant 보정
      if (field?.classList.contains("text-field--dropdown")) {
        left = baseLeft; // 강제로 기본 패딩만 적용
      }

      // Line 타입 보정
      const isLine = field?.classList.contains("text-field--line");
      if (isLine) {
        left = Math.max(0, left - 8);
        right = Math.max(0, right - 8);

        if (wrapper.querySelector(".leading")) {
          wrapper.querySelector(".leading").style.marginLeft = "-8px";
        }
        if (unit) {
          unit.style.marginRight = "0px";
        }
      }

      // tailing-select 폭 보정
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

/* ==========================
   Timer 기능
   ==========================
   - data-timer 속성값을 기준으로 countdown 표시
   - "MM:SS" 또는 초 단위 지원
   ========================== */
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

/* ==========================
   Password toggle (눈 아이콘)
   ========================== */
function initializePasswordToggle() {
  const eyeicon = document.querySelectorAll(".btn--view");

  eyeicon.forEach((button) => {
    const input = button
      .closest(".text-field__wrapper")
      .querySelector(".text-field__input");
    const eyeOpenIcon = button.querySelector(".icon--eye");
    const eyeCloseIcon = button.querySelector(".icon--eye-slash");

    // 아이콘 클릭 시 → password ↔ text 전환
    button.addEventListener("click", function () {
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

/* ==========================
   Mega input (한 글자씩 입력)
   ==========================
   - OTP / 인증번호 입력 같은 케이스
   - 1글자 입력 시 다음 input 자동 이동
   - Backspace 시 이전 input으로 이동
   ========================== */
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

/* ==========================
   Stepper (숫자 up/down 버튼)
   ==========================
   - 값 증가/감소 버튼 제어
   - 최소 0 제한
   - data-comma="true" → 3자리 콤마 표시
   ========================== */
function initializeSteppers(scope = document) {
  const steppers = scope.querySelectorAll(
    ".text-field--stepper .text-field__stepper"
  );

  steppers.forEach((stepper) => {
    // 🔑 이미 초기화된 경우는 스킵
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

    // 🔑 중복 초기화 방지 플래그
    stepper.dataset.initialized = "true";
  });
}

/* ==========================
   Date picker / Range picker 위치 계산
   ========================== */
function positionElement(element, triggerRect, preferredTop = true) {
  const elementWidth = element.offsetWidth || 300;
  const elementHeight = element.offsetHeight || 350;

  let left = window.scrollX + triggerRect.left;
  let top;

  // 좌우 잘림 방지
  if (left + elementWidth > window.innerWidth - 8) {
    left = window.innerWidth - elementWidth - 8;
  }

  // 기본은 아래 표시 → 공간 부족 시 위로
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

/* ==========================
   단일 날짜 입력 (date-picker)
   ========================== */
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

/* ==========================
   날짜 범위 입력 (date-range-picker)
   ========================== */
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

/* ==========================
   바깥 클릭 시 캘린더 닫기
   ========================== */
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

/* ==========================
   전역 접근 (window 바인딩)
   ========================== */
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
