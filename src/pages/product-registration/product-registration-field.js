import { createDateField } from "../../components/date-picker/create-date-field.js";

import "../../components/text-field/create-text-field.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";
import "../../components/dropdown/dropdown.js";

/* ==========================
   추가할 상품 선택 모달
   ========================== */
document.querySelector("#add-product-modal__membership-search").innerHTML =
  createTextField({
    id: "search-small-modal-membership-search",
    variant: "search",
    size: "small",
    placeholder: "회원권 이름 검색",
  });

document.querySelector("#add-product-modal__locker-search").innerHTML =
  createTextField({
    id: "search-small-modal-locker-search",
    variant: "search",
    size: "small",
    placeholder: "락커 이름 검색",
  });

document.querySelector("#add-product-modal__wear-search").innerHTML =
  createTextField({
    id: "search-small-modal-wear-search",
    variant: "search",
    size: "small",
    placeholder: "운동복 이름 검색",
  });

/* ==========================
   register-card
   ========================== */
// card-1
document.querySelector("#register-card__field--duration.card-1").innerHTML =
  createDateField({
    id: "date-range-picker-small-duration-1",
    type: "range",
    size: "small",
    value: ["2026-01-01", "2026-01-31"],
    separator: "text",
  });

document.querySelector("#register-card__field--count.card-1").innerHTML =
  createTextField({
    id: "stepper-small-count-1",
    variant: "stepper",
    size: "small",
    placeholder: "0",
    unit: "회",
    value: "30",
    clearable: false,
  });

document.querySelector("#register-card__field--amount.card-1").innerHTML =
  createTextField({
    id: "standard-small-amount-1",
    variant: "standard",
    size: "small",
    placeholder: "0",
    unit: "원",
    align: "right",
    value: "300,000",
    comma: true,
    onlyNumber: true,
  });

// card-2
document.querySelector("#register-card__field--duration.card-2").innerHTML =
  createDateField({
    id: "date-range-picker-small-duration-2",
    type: "range",
    size: "small",
    value: ["2026-01-01", "2026-01-31"],
    separator: "text",
  });

document.querySelector("#register-card__field--count.card-2").innerHTML =
  createTextField({
    id: "stepper-small-count-2",
    variant: "stepper",
    size: "small",
    placeholder: "0",
    unit: "회",
    value: "30",
    clearable: false,
  });

document.querySelector("#register-card__field--amount.card-2").innerHTML =
  createTextField({
    id: "standard-small-amount-2",
    variant: "standard",
    size: "small",
    placeholder: "0",
    unit: "원",
    align: "right",
    value: "300,000",
    comma: true,
    onlyNumber: true,
  });

// card-3
document.querySelector("#register-card__field--duration.card-3").innerHTML =
  createDateField({
    id: "date-range-picker-small-duration-3",
    type: "range",
    size: "small",
    value: ["2026-01-01", "2026-01-31"],
    separator: "text",
  });

document.querySelector("#register-card__field--seat.card-3").innerHTML =
  createTextField({
    id: "standard-small-seat",
    variant: "standard",
    size: "small",
    placeholder: "락커 자리",
    clearable: false,
    tailingButtonLabel: "선택",
  });

document.querySelector("#register-card__field--amount.card-3").innerHTML =
  createTextField({
    id: "standard-small-amount-3",
    variant: "standard",
    size: "small",
    placeholder: "0",
    unit: "원",
    align: "right",
    value: "50,000",
    comma: true,
    onlyNumber: true,
  });

// card-4
document.querySelector("#register-card__field--duration.card-4").innerHTML =
  createDateField({
    id: "date-range-picker-small-duration-4",
    type: "range",
    size: "small",
    value: ["2025-01-01", ""],
    separator: "text",
  });

document.querySelector("#register-card__field--amount.card-4").innerHTML =
  createTextField({
    id: "standard-small-amount-4",
    variant: "standard",
    size: "small",
    placeholder: "0",
    unit: "원",
    align: "right",
    value: "50,000",
    comma: true,
    onlyNumber: true,
  });

/* ==========================
   결제일
   ========================== */
// 오늘 날짜를 YYYY-MM-DD 형태로 변환
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedToday = `${year}-${month}-${day}`;

// 결제일 기본값을 오늘 날짜로 표시
document.querySelector("#register-summary__field--date").innerHTML =
  createDateField({
    id: "date-picker-small-pay-date",
    type: "single",
    size: "small",
    label: "결제일",
    placeholder: "날짜 선택",
    value: formattedToday,
  });

/* =====================================================
   결제 담당자 드롭다운 생성 (컴포넌트 방식)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const managerFieldWrap = document.querySelector(
    "#register-summary__field--manager"
  );
  if (!managerFieldWrap) return;

  // 텍스트필드(variant: dropdown) 생성
  const fieldHtml = createTextField({
    id: "dropdown-payment-manager",
    variant: "dropdown",
    size: "small",
    label: "결제 담당자",
    placeholder: "담당자 선택",
    dirty: true,
  });
  managerFieldWrap.innerHTML = fieldHtml;

  // 드롭다운 메뉴 데이터 정의
  const managerItems = [
    {
      title: "김민수",
      subtitle: "010-5774-7421",
      avatar: "../../assets/images/user.jpg",
      selected: true,
    },
    {
      title: "김정아",
      subtitle: "010-7825-1683",
      avatar: "../../assets/images/user.jpg",
    },
    {
      title: "김태형",
      subtitle: "010-3658-5442",
      avatar: "../../assets/images/user.jpg",
    },
    {
      title: "송지민",
      subtitle: "010-3215-5747",
      avatar: "../../assets/images/user.jpg",
    },
    {
      title: "이서",
      subtitle: "010-2583-0042",
      avatar: "../../assets/images/user.jpg",
    },
    {
      title: "이휘경",
      subtitle: "010-3658-5442",
      avatar: "../../assets/images/user.jpg",
    },
  ];

  // 토글 버튼 찾기
  const dropdownToggle = managerFieldWrap.querySelector(".dropdown__toggle");
  if (!dropdownToggle) return;

  // 드롭다운 메뉴 생성 (검색 기능 포함)
  const menuEl = createDropdownMenu({
    id: "dropdown-payment-manager-menu",
    size: "small",
    withSearch: true,
    withAvatar: true,
    items: managerItems,
  });

  // 메뉴를 토글 버튼 뒤에 삽입
  dropdownToggle.insertAdjacentElement("afterend", menuEl);

  // 초기화 (검색 포함)
  initializeDropdownSearch(menuEl);
  initializeDropdowns(managerFieldWrap);
});
