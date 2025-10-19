/* =====================================================
   📦 상품 등록 (product-registration.js)
   - 상품 카드 필드 초기화
   - 드롭다운 / 텍스트필드 / 체크박스 생성
   - 기간·횟수 무제한 처리
   - 판매 금액 계산 및 요약 반영
===================================================== */

import "./product-registration-field.js";
import "./product-registration-modal.js";
import "./product-registration-sidebar.js";
import "./product-registration.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";

import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import { createTextField } from "../../components/text-field/create-text-field.js";
import {
  adjustInputPadding,
  initializeTextFields,
} from "../../components/text-field/text-field.js";

/* =====================================================
   뒤로가기 버튼 클릭 시 이전 페이지로 이동
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("back-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  // 이전 페이지로 이동
  const goBack = () => {
    if (document.referrer) {
      // 이전 페이지가 있을 경우
      history.back();
    } else {
      // 직접 접근한 경우 fallback 페이지 설정
      window.location.href = "/pages/user-management/user-detail.html";
    }
  };

  backBtn?.addEventListener("click", goBack);
  cancelBtn?.addEventListener("click", goBack);
});

/* =====================================================
   상품 카드 필드 초기화
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".register-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const num = index + 1;

    /* --------------------------
       상품 정보 드롭다운 생성
    -------------------------- */
    const dropdownSection = card.querySelector(`#dropdown-product-info-${num}`);
    if (dropdownSection) {
      const fieldHtml = createTextField({
        id: `product-info-${num}`,
        variant: "dropdown",
        size: "small",
        placeholder: "옵션 선택",
        dirty: true,
      });
      dropdownSection.innerHTML = fieldHtml;

      /* 상품별 옵션 리스트 */
      let productOptions = [];
      switch (num) {
        case 1:
          productOptions = [
            {
              label: "1일 · 1회 · 현금 50,000원",
              value: "1일 · 1회 · 현금 50,000원",
            },
            {
              label: "1개월 · 30회 · 카드 300,000원",
              value: "1개월 · 30회 · 카드 300,000원",
              selected: true,
            },
            {
              label: "6개월 · 무제한 · 카드 400,000원",
              value: "6개월 · 무제한 · 카드 400,000원",
            },
          ];
          break;
        case 2:
          productOptions = [
            {
              label: "1일 · 1회 · 현금 50,000원",
              value: "1일권 · 1회 · 현금 50,000원",
            },
            {
              label: "1개월 · 30회 · 카드 300,000원",
              value: "1개월 · 30회 · 카드 300,000원",
              selected: true,
            },
            {
              label: "6개월 · 무제한 · 카드 400,000원",
              value: "6개월 · 무제한 · 카드 400,000원",
            },
          ];
          break;
        case 3:
          productOptions = [
            {
              label: "1개월 · 현금 50,000원",
              value: "1개월 · 현금 50,000원",
              selected: true,
            },
          ];
          break;
        case 4:
          productOptions = [
            {
              label: "무제한 · 현금 50,000원",
              value: "무제한 · 현금 50,000원",
              selected: true,
            },
          ];
          break;
        default:
          productOptions = [
            {
              label: "1개월 · 3회 · 카드 0원",
              value: "1개월 · 3회 · 카드 0원",
            },
            {
              label: "1개월 · 30회 · 카드 300,000원",
              value: "1개월 · 30회 · 카드 300,000원",
              selected: true,
            },
            {
              label: "12개월 · 999회 · 카드 3,000,000원",
              value: "12개월 · 999회 · 카드 3,000,000원",
            },
          ];
      }

      // 드롭다운 메뉴 생성 및 삽입
      const menuEl = createDropdownMenu({
        id: `product-info-${num}-menu`,
        size: "small",
        items: productOptions,
      });
      const toggleBtn = dropdownSection.querySelector(".dropdown__toggle");
      if (toggleBtn) toggleBtn.insertAdjacentElement("afterend", menuEl);

      requestAnimationFrame(() => initializeDropdowns(dropdownSection));
    }

    /* --------------------------
       무제한 체크박스 생성 (기간 + 횟수)
    -------------------------- */
    cards.forEach((card, index) => {
      const num = index + 1;
      const isWear = card.classList.contains("register-card--wear");

      // 횟수 무제한 체크박스
      const countWrap = card.querySelector(`#checkbox-unlimited-${num}`);
      if (countWrap) {
        const countCheckboxHtml = createCheckbox({
          id: `unlimited-count-check-${num}`,
          size: "small",
          variant: "standard",
          label: "횟수 무제한",
        });
        countWrap.innerHTML = countCheckboxHtml;
      }

      // 기간 무제한 체크박스
      const durationWrap = card.querySelector(
        `#checkbox-unlimited-duration-${num}`
      );
      if (durationWrap) {
        const durationCheckboxHtml = createCheckbox({
          id: `unlimited-duration-check-${num}`,
          size: "small",
          variant: "standard",
          label: "기간 무제한",
          checked: isWear,
        });
        durationWrap.innerHTML = durationCheckboxHtml;
      }

      /* --------------------------
         기간 무제한 동작 처리
      -------------------------- */
      const durationCheckbox = card.querySelector(
        `#unlimited-duration-check-${num}`
      );
      if (durationCheckbox) {
        const durationField = card.querySelector(
          "#register-card__field--duration"
        );
        const endInput = durationField?.querySelector(
          `[id^="date-range-picker-small-duration-${num}-end"]`
        );

        const applyUnlimitedState = (checked) => {
          if (!endInput) return;

          // 이전 값 저장 (최초 1회만)
          if (!endInput.dataset.prevValue) {
            endInput.dataset.prevValue = endInput.value || "";
          }

          const icon = endInput
            .closest(".text-field__wrapper")
            ?.querySelector(".icon--calendar");

          if (checked) {
            // 무제한 상태 적용
            endInput.value = "";
            endInput.placeholder = "무제한";
            endInput.disabled = true;
            endInput.classList.add("disabled");
            if (icon) icon.classList.add("disabled");
          } else {
            // 무제한 해제 시 복원
            endInput.disabled = false;
            endInput.placeholder = "종료일";
            endInput.classList.remove("disabled");
            const prev = endInput.dataset.prevValue || "";
            if (prev) endInput.value = prev;
            if (icon) icon.classList.remove("disabled");
          }
        };

        // 이벤트 바인딩
        durationCheckbox.addEventListener("change", () => {
          applyUnlimitedState(durationCheckbox.checked);
        });

        // 운동복 기본 무제한 상태 적용
        if (isWear) applyUnlimitedState(true);
      }

      /* --------------------------
         횟수 무제한 동작 처리
      -------------------------- */
      const countCheckbox = card.querySelector(`#unlimited-count-check-${num}`);
      if (countCheckbox) {
        countCheckbox.addEventListener("change", () => {
          const cardCount = card.querySelector(".register-card__count");
          const textField = cardCount?.querySelector(".text-field");
          const stepperInput = cardCount?.querySelector(".text-field__input");
          const stepperButtons = cardCount?.querySelectorAll(
            ".text-field__stepper-btn"
          );
          if (!textField || !stepperInput) return;

          // 이전 값 저장 (최초 1회만)
          if (!stepperInput.dataset.prevValue) {
            stepperInput.dataset.prevValue = stepperInput.value || "";
          }

          if (countCheckbox.checked) {
            // 무제한 상태
            stepperInput.dataset.prevValue = stepperInput.value || "";
            stepperInput.value = "";
            stepperInput.placeholder = "무제한";
            stepperInput.disabled = true;

            textField.classList.add("disabled", "is-unlimited");
            stepperButtons.forEach((btn) => (btn.disabled = true));
          } else {
            // 해제 시 복원
            const prev = stepperInput.dataset.prevValue || "";
            stepperInput.placeholder = "0";
            stepperInput.value = prev;
            stepperInput.disabled = false;

            textField.classList.remove("disabled", "is-unlimited");
            stepperButtons.forEach((btn) => (btn.disabled = false));
          }
        });
      }
    });
  });

  // 공통 초기화
  initializeTextFields();
  adjustInputPadding();
  requestAnimationFrame(() => initializeDropdowns(document));
});

/* =====================================================
   판매 금액 섹션 (드롭다운 + 계산 + 추가/삭제)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".register-card").forEach((cardEl, index) => {
    const cardNum = index + 1;
    initPriceFields(cardEl, cardNum);
  });

  /* --------------------------
     판매 금액 입력 필드 초기화
  -------------------------- */
  function initPriceFields(cardEl, cardNum) {
    const priceSection = cardEl.querySelector(".register-card__section--price");
    if (!priceSection) return;

    const wrap = priceSection.querySelector(".dropdown-n-field-wrap");
    const addBtn = priceSection.querySelector('[data-role="price-add"]');
    const totalBox = priceSection.querySelector(".register-card__total-price");
    if (!wrap || !addBtn || !totalBox) return;

    const salePriceEl = totalBox.querySelectorAll(".money")[1];
    const METHOD_ORDER = ["카드", "현금", "계좌이체", "미수금"];

    const formatWon = (num) =>
      (Number(num) || 0).toLocaleString("ko-KR") + "원";
    const parseAmount = (val) =>
      Number(String(val || "").replace(/[^\d]/g, "")) || 0;

    /* --------------------------
       판매가 자동 계산
    -------------------------- */
    const updateTotals = () => {
      const rows = Array.from(wrap.querySelectorAll(".dropdown-n-field"));
      const sums = { 카드: 0, 현금: 0, 계좌이체: 0, 미수금: 0 };
      const presentSet = new Set();

      rows.forEach((row) => {
        const method =
          row.querySelector(".dropdown__toggle")?.textContent.trim() || "카드";
        const input = row.querySelector("input");
        const rawValue = input?.value?.trim() || "0";
        const amt = Number(String(rawValue).replace(/[^\d]/g, "")) || 0;

        if (sums.hasOwnProperty(method)) {
          sums[method] += amt;
          if (amt > 0) presentSet.add(method);
        }
      });

      const methodsLabel = METHOD_ORDER.filter((m) => presentSet.has(m)).join(
        ", "
      );
      const total = METHOD_ORDER.reduce(
        (acc, m) => acc + (presentSet.has(m) ? sums[m] : 0),
        0
      );

      if (salePriceEl) {
        salePriceEl.textContent =
          methodsLabel.length > 0
            ? `${methodsLabel} 총 ${formatWon(total)}`
            : `총 ${formatWon(total)}`;
      }

      updateSummaryFromSalePrice();
    };

    // 드롭다운 변경 시 실시간 반영
    wrap.addEventListener("dropdown:change", () => {
      requestAnimationFrame(updateTotals);
    });

    /* --------------------------
       삭제 버튼 활성/비활성 갱신
    -------------------------- */
    const refreshDeleteButtons = () => {
      const items = wrap.querySelectorAll(".dropdown-n-field");
      const isSingle = items.length <= 1;
      items.forEach((item) => {
        const delBtn = item.querySelector('[data-tooltip="삭제"]');
        if (delBtn) delBtn.disabled = isSingle;
      });
    };

    /* --------------------------
       결제수단 드롭다운 생성
    -------------------------- */
    function createPaymentDropdown(target, defaultValue = "카드") {
      if (!target) return;
      target.innerHTML = "";

      const dropdownField = createTextField({
        id: `payment-method-${Date.now()}`,
        variant: "dropdown",
        size: "small",
        defaultValue,
        dirty: true,
      });

      const wrapper = document.createElement("div");
      wrapper.classList.add("dropdown", "standard-dropdown", "nolabel");
      wrapper.innerHTML = dropdownField;
      target.appendChild(wrapper);

      const items = [
        { label: "카드", value: "카드", selected: defaultValue === "카드" },
        { label: "현금", value: "현금", selected: defaultValue === "현금" },
        {
          label: "계좌이체",
          value: "계좌이체",
          selected: defaultValue === "계좌이체",
        },
        {
          label: "미수금",
          value: "미수금",
          selected: defaultValue === "미수금",
        },
      ];

      const menu = createDropdownMenu({
        id: `${target.id}-menu-${Date.now()}`,
        size: "small",
        items,
      });

      const toggle = wrapper.querySelector(".dropdown__toggle");
      if (toggle) {
        toggle.insertAdjacentElement("afterend", menu);
        toggle.textContent = defaultValue;
        toggle.classList.remove("is-placeholder");
      }

      initializeTextFields();
      adjustInputPadding();
      requestAnimationFrame(() => initializeDropdowns(target));
    }

    /* --------------------------
       새 결제 항목 추가
    -------------------------- */
    const createItem = () => {
      const template = wrap.querySelector(".dropdown-n-field");
      if (!template) return null;

      const node = template.cloneNode(true);
      const dropdownContainer = node.querySelector(".dropdown-set");

      // 카드별 기본 결제수단 설정 (예: 1,2 → 카드 / 3,4 → 현금)
      if (dropdownContainer) {
        const defaultPayment = cardNum === 3 || cardNum === 4 ? "현금" : "카드";
        createPaymentDropdown(dropdownContainer, defaultPayment);
      }

      // 입력값 초기화
      const amountField = node.querySelector(".register-card__amount");
      if (amountField) {
        const input = amountField.querySelector(".text-field__input");
        if (input) input.value = "";
      }

      const delBtn = node.querySelector('[data-tooltip="삭제"]');
      if (delBtn) delBtn.disabled = false;

      return node;
    };

    /* --------------------------
       이벤트 바인딩
    -------------------------- */
    addBtn.addEventListener("click", () => {
      const newItem = createItem();
      if (!newItem) return;
      wrap.append(newItem);
      refreshDeleteButtons();
      updateTotals();

      requestAnimationFrame(() => {
        initializeDropdowns(newItem);
        newItem.addEventListener("dropdown:change", updateTotals);
      });
    });

    wrap.addEventListener("click", (e) => {
      const delBtn = e.target.closest('[data-tooltip="삭제"]');
      if (delBtn) {
        const row = delBtn.closest(".dropdown-n-field");
        if (row && wrap.querySelectorAll(".dropdown-n-field").length > 1) {
          row.remove();
          refreshDeleteButtons();
          updateTotals();
        }
      }
    });

    wrap.addEventListener("input", (e) => {
      const input = e.target.closest(".text-field__input");
      if (input) {
        const raw = parseAmount(input.value);
        input.value = raw ? raw.toLocaleString("ko-KR") : "";
        updateTotals();
      }
    });

    // 기본 드롭다운 초기화
    const dropdownContainer = wrap.querySelector(".dropdown-set");
    if (dropdownContainer) {
      const defaultPayment = cardNum === 3 || cardNum === 4 ? "현금" : "카드";
      createPaymentDropdown(dropdownContainer, defaultPayment);
    }

    refreshDeleteButtons();
    updateTotals();
  }
});

/* =====================================================
   결제 요약 (최종 금액 / 판매 금액 / 미수금)
===================================================== */
function updateSummaryFromSalePrice() {
  const summarySection = document.querySelector(".register-summary__overview");
  if (!summarySection) return;

  const sums = { 카드: 0, 현금: 0, 계좌이체: 0, 미수금: 0 };

  // 각 카드별 판매 금액 합산
  document.querySelectorAll(".register-card").forEach((card) => {
    card.querySelectorAll(".dropdown-n-field").forEach((row) => {
      const method =
        row.querySelector(".dropdown__toggle")?.textContent.trim() || "카드";
      const input = row.querySelector("input.text-field__input");
      const rawValue = input?.value?.trim() || "0";
      const amount = Number(rawValue.replace(/[^\d]/g, "")) || 0;
      if (sums.hasOwnProperty(method)) sums[method] += amount;
    });
  });

  // 계산식
  const saleTotal =
    sums["카드"] + sums["현금"] + sums["계좌이체"] + sums["미수금"];
  const unpaid = sums["미수금"];
  const finalTotal = sums["카드"] + sums["현금"] + sums["계좌이체"] - unpaid;

  const format = (n) => (Number(n) || 0).toLocaleString("ko-KR") + "원";

  // DOM 업데이트
  const totalTop = summarySection.querySelector(".register-summary__amount");
  const saleLabel = summarySection.querySelector(
    ".register-summary__breakdown > ul:first-of-type li:last-child"
  );
  const subs = summarySection.querySelectorAll(".register-summary__sub");
  const unpaidTotal = summarySection.querySelector(
    ".register-summary__unpaid li:last-child"
  );

  if (totalTop) totalTop.textContent = format(finalTotal);
  if (saleLabel) saleLabel.textContent = format(saleTotal);
  if (subs[0])
    subs[0].querySelector("li:last-child").textContent = format(sums["카드"]);
  if (subs[1])
    subs[1].querySelector("li:last-child").textContent = format(sums["현금"]);
  if (subs[2])
    subs[2].querySelector("li:last-child").textContent = format(
      sums["계좌이체"]
    );
  if (subs[3])
    subs[3].querySelector("li:last-child").textContent = format(sums["미수금"]);
  if (unpaidTotal) unpaidTotal.textContent = "- " + format(unpaid);
}

/* =====================================================
   실시간 동기화 이벤트 (입력/추가/삭제 시 요약 업데이트)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 입력값 변경 시
  document.addEventListener("input", (e) => {
    if (e.target.closest(".text-field__input")) {
      setTimeout(updateSummaryFromSalePrice, 50);
    }
  });

  // 드롭다운 변경, 추가/삭제 버튼 클릭 시
  document.addEventListener("click", (e) => {
    if (
      e.target.closest(".dropdown__menu-item") ||
      e.target.closest("[data-role='price-add']") ||
      e.target.closest("[data-tooltip='삭제']")
    ) {
      setTimeout(updateSummaryFromSalePrice, 150);
    }
  });

  // 초기 렌더링 후 요약 갱신
  setTimeout(updateSummaryFromSalePrice, 500);

  // 전역 접근 (디버깅용)
  window.updateSummaryFromSalePrice = updateSummaryFromSalePrice;
});
