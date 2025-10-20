/* ======================================================================
   📦 add-product-modal.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “추가할 상품 선택” 모달 내 입력 필드, 날짜 필드, 드롭다운 등을 초기화
   - 회원권 / 락커 / 운동복 검색 필드 생성
   - 각 register-card별 기간, 횟수, 금액 등 TextField 및 DateField 렌더링
   - 결제일, 결제 담당자 필드 자동 세팅
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - createTextField / createDateField → <app-text-field>, <app-date-field>
   - createDropdownMenu → <app-dropdown [items]="managerList">
   - initializeDropdowns(), initializeDropdownSearch() → AfterViewInit 훅에서 실행
   ====================================================================== */

/* =========================================================
   📦 Import (컴포넌트 및 의존 모듈)
========================================================= */
import { createDateField } from "../../components/date-picker/create-date-field.js";

import "../../components/text-field/create-text-field.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";
import "../../components/dropdown/dropdown.js";

/* ======================================================================
   🧾 추가할 상품 선택 모달 (검색 필드)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원권 / 락커 / 운동복 탭 내 검색 입력 필드 생성
   - variant: "search" 형태의 TextField 사용
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - <app-text-field variant="search" placeholder="회원권 이름 검색">
   ====================================================================== */
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

/* ======================================================================
   🧩 register-card 별 필드 초기화
   ----------------------------------------------------------------------
   ✅ 역할:
   - 각 상품 카드별 기간(DateField), 횟수(Stepper), 금액(Standard TextField) 구성
   - 회원권, 락커, 운동복 등 카드별 필드 차이에 맞게 구성
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - *ngFor="let card of productList" 로 반복 생성 가능
   - <app-date-field>, <app-text-field variant="stepper"> 조합 사용
   ====================================================================== */

// --------------------------
// 🧾 card-1 (회원권)
// --------------------------
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

// --------------------------
// 🧾 card-2 (회원권 2개월 등)
// --------------------------
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

// --------------------------
// 🧾 card-3 (락커)
// --------------------------
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

// --------------------------
// 🧾 card-4 (운동복)
// --------------------------
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

/* ======================================================================
   💰 결제일 설정
   ----------------------------------------------------------------------
   ✅ 역할:
   - 오늘 날짜를 자동으로 불러와 “결제일” 필드의 기본값으로 지정
   - type: single 형태의 DateField 사용
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - <app-date-field [defaultValue]="today" label="결제일">
   ====================================================================== */

// 오늘 날짜를 YYYY-MM-DD 형태로 변환
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedToday = `${year}-${month}-${day}`;

// 결제일 기본값 적용
document.querySelector("#register-summary__field--date").innerHTML =
  createDateField({
    id: "date-picker-small-pay-date",
    type: "single",
    size: "small",
    label: "결제일",
    placeholder: "날짜 선택",
    value: formattedToday,
  });

/* ======================================================================
   👩‍💼 결제 담당자 드롭다운 생성
   ----------------------------------------------------------------------
   ✅ 역할:
   - 담당자 목록을 아바타 + 이름 + 전화번호로 표시하는 dropdown 구성
   - 검색 기능 포함
   - TextField(variant: dropdown) + DropdownMenu 조합
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - <app-dropdown [items]="managerList" [withSearch]="true">
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const managerFieldWrap = document.querySelector(
    "#register-summary__field--manager"
  );
  if (!managerFieldWrap) return;

  // 1️⃣ TextField (variant: dropdown) 생성
  const fieldHtml = createTextField({
    id: "dropdown-payment-manager",
    variant: "dropdown",
    size: "small",
    label: "결제 담당자",
    placeholder: "담당자 선택",
    dirty: true,
  });
  managerFieldWrap.innerHTML = fieldHtml;

  // 2️⃣ 드롭다운 항목 데이터
  const managerItems = [
    {
      title: "김민수",
      subtitle: "010-5774-7421",
      avatar: "/assets/images/user.jpg",
      selected: true,
    },
    {
      title: "김정아",
      subtitle: "010-7825-1683",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "김태형",
      subtitle: "010-3658-5442",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "송지민",
      subtitle: "010-3215-5747",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "이서",
      subtitle: "010-2583-0042",
      avatar: "/assets/images/user.jpg",
    },
    {
      title: "이휘경",
      subtitle: "010-3658-5442",
      avatar: "/assets/images/user.jpg",
    },
  ];

  // 3️⃣ dropdown toggle 요소 찾기
  const dropdownToggle = managerFieldWrap.querySelector(".dropdown__toggle");
  if (!dropdownToggle) return;

  // 4️⃣ DropdownMenu 생성 (검색 기능 포함)
  const menuEl = createDropdownMenu({
    id: "dropdown-payment-manager-menu",
    size: "small",
    withSearch: true,
    withAvatar: true,
    items: managerItems,
  });

  // 5️⃣ 토글 뒤에 메뉴 삽입
  dropdownToggle.insertAdjacentElement("afterend", menuEl);

  // 6️⃣ 검색 + Dropdown 초기화
  initializeDropdownSearch(menuEl);
  initializeDropdowns(managerFieldWrap);
});
