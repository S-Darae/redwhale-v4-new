/* =====================================================
📊 Sales Filter Sidebar (필터 사이드바)
======================================================
💡 Angular 변환 시 참조
------------------------------------------------------
- <app-sales-filter-sidebar></app-sales-filter-sidebar>
- 내부 구조:
  <app-filter-section title="결제수단">
    <app-checkbox-group [options]="..." (change)="onFilterChange($event)"></app-checkbox-group>
  </app-filter-section>
- 공통 컴포넌트 재사용: <app-checkbox> / <app-radio> / <app-text-field>
====================================================== */

import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import "../../components/checkbox/checkbox.scss";
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";

import { createRadioButton } from "../../components/radio-button/create-radio-button.js";
import "../../components/radio-button/radio-button.scss";

/* =====================================================
📂 섹션 접기 / 펼치기
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".sales-filter-section");
      if (!section) return;
      section.classList.toggle("collapsed");
    });
  });
});

/* =====================================================
📋 필터 항목 동적 생성
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------
  🔹 정렬 섹션 (최신순 / 이름순 / 결제액순 등)
  --------------------------------------------- */
  const sortWrap = document.getElementById("sales-filter__sort-radio-wrap");
  if (sortWrap) {
    const sortOptions = [
      { id: "radio--sales-sort1", label: "최신순", checked: true },
      { id: "radio--sales-sort2", label: "회원이름 가나다순" },
      { id: "radio--sales-sort3", label: "결제액 높은순" },
      { id: "radio--sales-sort4", label: "결제액 낮은순" },
      { id: "radio--sales-sort5", label: "환불액 높은순" },
      { id: "radio--sales-sort6", label: "환불액 낮은순" },
    ];

    const groupName = "sales-filter-sort";

    // Radio 버튼 렌더링
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

  /* ---------------------------------------------
  🔹 구분 섹션 (결제 / 환불 / 양도)
  --------------------------------------------- */
  const typeWrap = document.querySelector(".sales-filter-type-checkbox");
  if (typeWrap) {
    const typeOptions = [
      { id: "checkbox--sales-type1", label: "결제", checked: true },
      { id: "checkbox--sales-type2", label: "환불", checked: true },
      { id: "checkbox--sales-type3", label: "양도", checked: true },
    ];

    // Checkbox 렌더링
    typeWrap.innerHTML = typeOptions
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

  /* ---------------------------------------------
  🔹 상품 유형 섹션 (회원권 / 락커 / 운동복)
  --------------------------------------------- */
  const productTypeWrap = document.querySelector(
    ".sales-filter-product-type-checkbox"
  );
  if (productTypeWrap) {
    const typeOptions = [
      { id: "checkbox--sales-product-type1", label: "회원권", checked: true },
      { id: "checkbox--sales-product-type2", label: "락커", checked: true },
      { id: "checkbox--sales-product-type3", label: "운동복", checked: true },
    ];

    // Checkbox 렌더링
    productTypeWrap.innerHTML = typeOptions
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

  /* ---------------------------------------------
  🔹 결제 수단 섹션 (카드 / 계좌이체 / 현금 / 미수금)
  --------------------------------------------- */
  const methodWrap = document.querySelector(".sales-filter-method-checkbox");
  if (methodWrap) {
    const methodOptions = [
      { id: "checkbox--sales-method1", label: "카드", checked: true },
      { id: "checkbox--sales-method2", label: "계좌이체", checked: true },
      { id: "checkbox--sales-method3", label: "현금", checked: true },
      { id: "checkbox--sales-method4", label: "미수금", checked: true },
    ];

    // Checkbox 렌더링
    methodWrap.innerHTML = methodOptions
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

  /* ---------------------------------------------
  🔹 담당자 섹션
  --------------------------------------------- */
  const staffWrap = document.querySelector(".sales-filter-staff-wrap");
  if (staffWrap) {
    const staffOptions = [
      { id: "checkbox--sales-staff1", label: "김민수", checked: true },
      { id: "checkbox--sales-staff2", label: "김정아", checked: true },
      { id: "checkbox--sales-staff3", label: "김태형", checked: true },
      { id: "checkbox--sales-staff4", label: "송지민", checked: true },
      { id: "checkbox--sales-staff5", label: "이서", checked: true },
      { id: "checkbox--sales-staff6", label: "이휘경", checked: true },
    ];

    // Checkbox 렌더링
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
});

/* =====================================================
🎛️ 라디오 선택 시 Label Bold 처리
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const name = radio.name;
      const group = document.querySelectorAll(`input[name="${name}"]`);

      group.forEach((r) => {
        const label = document.querySelector(`label[for="${r.id}"]`);
        if (label) label.classList.toggle("is-selected", r.checked);
      });
    });
  });
});
