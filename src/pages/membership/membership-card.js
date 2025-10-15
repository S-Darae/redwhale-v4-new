import { createMembershipCard } from "../../components/card/create-membership-card.js";
import "../../components/card/membership-card.scss";
import { initPopover } from "../../components/card/popover-init.js";
import "./membership.scss";

/* ==========================
   회원권 데이터
   ========================== */
export const memberships = [
  {
    id: "membership-card-1",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 1개월",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    details: [
      ["1개월", "10회", "카드 100,000원"],
      ["1개월", "10회", "현금 99,000원"],
      ["1개월", "20회", "카드 200,000원"],
      ["1개월", "20회", "현금 198,000원"],
      ["1개월", "30회", "카드 300,000원"],
      ["1개월", "30회", "현금 297,000원"],
    ],
    memo: "1월 1일 ~ 1월 31일 결제에 한함",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "coralred",
  },
  {
    id: "membership-card-2",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 3개월",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    details: [
      ["3개월", { text: "무제한", cancel: "취소 10회" }, "카드 300,000원"],
      ["3개월", { text: "무제한", cancel: "취소 10회" }, "현금 296,000원"],
    ],
    memo: "1월 1일 ~ 1월 31일 결제에 한함",
    tickets: [
      {
        folderName: "다이어트 1",
        items: ["다이어트 1:5 오후반", "다이어트 1:5 오전반"],
      },
    ],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
  {
    id: "membership-card-3",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 6개월",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    details: [
      ["6개월", { text: "무제한", cancel: "취소 10회" }, "카드 600,000원"],
    ],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "lavendermist",
  },
  {
    id: "membership-card-4",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 9개월",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    details: [["9개월", "무제한", "카드 900,000원"]],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "gray-500",
  },
  {
    id: "membership-card-5",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 12개월",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    details: [
      ["12개월", "100회", "카드 1,200,000원"],
      ["12개월", "무제한", "현금 1,080,000원"],
    ],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "bluesky",
  },
  {
    id: "membership-card-6",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 24개월",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    details: [
      ["24개월", { text: "무제한", cancel: "취소 50회" }, "카드 2,400,000원"],
    ],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "pinkpop",
  },
  {
    id: "membership-card-7",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 디자인 너비 테스트",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused",
    details: [["999개월", "999회", "계좌이체 99,999,999원"]],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "black",
  },
  {
    id: "membership-card-8",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 디자인 너비 테스트",
    badge: "예약 사용",
    badgeVariant: "reserv-used",
    details: [
      [
        "999개월",
        { text: "999회", cancel: "취소 999회" },
        "계좌이체 99,999,999원",
      ],
    ],
    memo: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "peachglow",
  },
];

/* ==========================
   카드 + 팝오버 렌더링
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".membership-card-wrap");

  memberships.forEach((m) => {
    const cardEl = document.createElement("div");
    cardEl.innerHTML = createMembershipCard(m);
    const card = cardEl.firstElementChild;
    card.dataset.id = m.id;
    wrap.appendChild(card);
  });

  // 팝오버 초기화 (렌더링 끝난 뒤 호출)
  initPopover({ memberships });
});
