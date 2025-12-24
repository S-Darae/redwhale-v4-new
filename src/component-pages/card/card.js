import "../../components/card/card-toggle.js";
import "../../components/card/class-card.scss";
import { createClassCard } from "../../components/card/create-class-card.js";
import { createMembershipCard } from "../../components/card/create-membership-card.js";
import { createProductCard } from "../../components/card/create-product-card.js";
import "../../components/card/membership-card.scss";
import { initPopover } from "../../components/card/popover-init.js";
import "../../components/card/product-card.scss";
import "./card.scss";

/* ==========================
   회원권 카드 데이터
   ========================== */
export const memberships = [
  {
    id: "membership-card-basic--reserv-unused",
    folderName: "폴더 이름",
    membershipName: "회원권 | 예약 미사용",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    info: "",
    details: [
      { period: "1개월", count: "10회", cancel: "", price: "카드 100,000원" },
    ],
    memo: "메모 내용",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
  {
    id: "membership-card-basic--reserv-used",
    folderName: "폴더 이름",
    membershipName: "회원권 | 예약 사용",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    info: ["일일 1회", "주간 7회", "동시 무제한 예약"],
    details: [
      {
        period: "3개월",
        count: "무제한",
        cancel: "취소 10회",
        price: "카드 300,000원",
      },
      {
        period: "3개월",
        count: "무제한",
        cancel: "취소 10회",
        price: "카드 296,000원",
      },
    ],
    memo: "",
    tickets: [
      {
        folderName: "폴더 이름",
        items: ["수업 이름 A", "수업 이름 B"],
      },
    ],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "aquabreeze",
  },
  {
    id: "membership-card-basic--scroll",
    folderName: "폴더 이름",
    membershipName: "회원권 | 예약 사용 (스크롤)",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    info: ["일일 1회", "주간 7회", "동시 무제한 예약"],
    details: [
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "카드 100,000원",
      },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "현금 100,000원",
      },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "계좌이체 100,000원",
      },
      {
        period: "3개월",
        count: "30회",
        cancel: "취소 10회",
        price: "카드 300,000원",
      },
      {
        period: "3개월",
        count: "30회",
        cancel: "취소 10회",
        price: "현금 300,000원",
      },
      {
        period: "3개월",
        count: "30회",
        cancel: "취소 10회",
        price: "계좌이체 300,000원",
      },
    ],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "aquabreeze",
  },
  {
    id: "membership-card-checkbox--standard",
    folderName: "폴더 이름",
    membershipName: "회원권 | 체크박스",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    info: "",
    details: [
      { period: "1개월", count: "10회", cancel: "", price: "카드 100,000원" },
    ],
    memo: "",
    tickets: [],
    withCheckbox: true,
    checked: false,
    popover: false,
    color: "sandbeige",
  },
  {
    id: "membership-card-checkbox--scroll",
    folderName: "폴더 이름",
    membershipName: "회원권 카드 | 체크박스 (스크롤)",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    info: "",
    details: [
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "카드 100,000원",
      },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "현금 100,000원",
      },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "계좌이체 100,000원",
      },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "미수금 100,000원",
      },
    ],
    memo: "",
    tickets: [],
    withCheckbox: true,
    checked: false,
    popover: false,
    color: "sandbeige",
  },
  {
    id: "membership-card-option--reserv-standard",
    folderName: "폴더 이름",
    membershipName: "회원권 | 옵션 체크박스",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    info: "",
    details: [{ period: "1개월", count: "10회", price: "카드 100,000원" }],
    withCheckbox: false,
    withOptionCheckbox: true,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
  {
    id: "membership-card-option--reserv-scroll",
    folderName: "폴더 이름",
    membershipName: "회원권 | 옵션 체크박스 (스크롤)",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    info: "",
    details: [
      { period: "1개월", count: "10회", price: "카드 100,000원" },
      {
        period: "1개월",
        count: "10회",
        cancel: "취소 3회",
        price: "현금 100,000원",
      },
      {
        period: "3개월",
        count: "무제한",
        cancel: "취소 3회",
        price: "계좌이체 100,000원",
      },
      {
        period: "3개월",
        count: "무제한",
        cancel: "취소 3회",
        price: "미수금 100,000원",
      },
    ],
    withCheckbox: false,
    withOptionCheckbox: true,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
];

/* ==========================
   수업 카드 데이터
   ========================== */
export const classes = [
  {
    id: "class-card-basic--group",
    folderName: "폴더 이름",
    className: "수업 | 수업 이름 (그룹)",
    badge: "그룹",
    badgeVariant: "group",
    duration: "50분",
    people: "10명",
    trainer: "홍길동",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "메모 내용",
    notice:
      "전문 트레이너와 함께 체계적인 프로그램으로 안전하고 효과적인 운동을 경험해 보세요. 활기찬 분위기 속에서 즐겁게 땀 흘리며 건강한 생활 습관을 만들 수 있어요.",
    tickets: [{ folderName: "회원권 A", items: ["3개월권", "6개월권"] }],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
  {
    id: "class-card-basic--personal",
    folderName: "폴더 이름",
    className: "수업 | 수업 이름 (개인)",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: ["홍길동", "김길동"],
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "-",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "bluesky",
  },
  {
    id: "class-card-checkbox",
    folderName: "폴더 이름",
    className: "수업 | 체크박스",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: "홍길동",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: true,
    checked: false,
    popover: false,
    color: "bluesky",
  },
];

/* ==========================
   상품 카드 데이터
   ========================== */
export const products = [
  {
    id: "product-card-basic--membership",
    type: "membership",
    name: "상품 | 회원권 이용권",
    startDate: "2025.09.01",
    endDate: "2025.12.01",
    info: {
      type: "예약 미사용",
      remain: 8,
      total: 10,
    },
    productMemo: "",
    userMemo: "",
    withCheckbox: false,
    checked: false,
    popover: true,
  },
  {
    id: "product-card-basic--locker",
    type: "locker",
    name: "상품 | 락커 이용권",
    startDate: "2025.08.01",
    endDate: "2025.10.30",
    info: {
      number: "B-12",
    },
    productMemo: "",
    userMemo: "",
    withCheckbox: false,
    checked: false,
    popover: true,
  },
  {
    id: "product-card-basic--wear",
    type: "wear",
    name: "상품 | 운동복 이용권",
    startDate: "2026.01.01",
    endDate: "2026.12.31",
    info: {},
    productMemo: "",
    userMemo: "",
    withCheckbox: false,
    checked: false,
    popover: true,
  },

  {
    id: "product-card-checkbox--membership",
    type: "membership",
    name: "상품 | 회원권 (체크박스)",
    startDate: "2025.09.01",
    endDate: "2025.12.01",
    info: {
      type: "예약 미사용",
      remain: 8,
      total: 10,
    },
    productMemo: "",
    userMemo: "",
    withCheckbox: true,
    checked: false,
    popover: false,
  },
  {
    id: "product-card-checkbox--locker",
    type: "locker",
    name: "상품 | 락커 (체크박스)",
    startDate: "2025.08.01",
    endDate: "2025.10.30",
    info: {
      number: "A-01",
    },
    productMemo: "",
    userMemo: "",
    withCheckbox: true,
    checked: false,
    popover: false,
  },
  {
    id: "product-card-checkbox--wear",
    type: "wear",
    name: "상품 | 운동복 (체크박스)",
    startDate: "2026.01.01",
    endDate: "2026.12.31",
    info: {},
    productMemo: "",
    userMemo: "",
    withCheckbox: true,
    checked: false,
    popover: false,
  },
];

/* ==========================
   카드 렌더링
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 멤버십 카드 렌더링
  memberships.forEach((m) => {
    const target = document.getElementById(m.id);
    if (target) {
      target.innerHTML = createMembershipCard(m);
      target.querySelector(".membership-card").dataset.id = m.id;
    }
  });

  // 수업 카드 렌더링
  classes.forEach((c) => {
    const target = document.getElementById(c.id);
    if (target) {
      target.innerHTML = createClassCard(c);
      target.querySelector(".class-card").dataset.id = c.id;
    }
  });

  // 상품 카드 렌더링
  products.forEach((p) => {
    const target = document.getElementById(p.id);
    if (target) {
      const { cardHtml } = createProductCard(p);
      target.innerHTML = cardHtml;
      target.querySelector(".product-card").dataset.id = p.id;
    }
  });

  // 팝오버 초기화 (데이터 주입)
  initPopover({ classes, memberships, products });
});
