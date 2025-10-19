/* ======================================================================
   📦 membership.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “회원권 목록” 화면의 카드 UI를 구성하고 팝오버를 초기화
   - 각 회원권 정보(기간, 횟수, 금액, 메모, 연결 수업 등)를 카드 형태로 표시
   - createMembershipCard()를 통해 마크업 생성 후 DOM에 삽입
   - initPopover()로 카드 클릭 시 상세 팝오버 활성화
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - memberships 배열 → @Input() memberships: Membership[];
   - createMembershipCard() → <app-membership-card [data]="membership">
   - initPopover() → 별도 Directive로 분리 (ex: appPopoverInit)
   ====================================================================== */

import { createMembershipCard } from "../../components/card/create-membership-card.js";
import "../../components/card/membership-card.scss";
import { initPopover } from "../../components/card/popover-init.js";
import "./membership.scss";

/* ======================================================================
   📋 회원권 데이터 (Mock Data)
   ----------------------------------------------------------------------
   ✅ 설명:
   - 화면 렌더링용 임시 데이터
   - 실제 운영 시에는 API 연동으로 교체
   - 각 객체는 createMembershipCard() 함수의 인자로 전달됨
   ====================================================================== */
export const memberships = [
  {
    id: "membership-card-1",
    folderName: "새해 이벤트",
    membershipName: "새해 이벤트 - 1개월",
    badge: "예약 미사용",
    badgeVariant: "reserv-unused", // 배지 색상/스타일 구분
    details: [
      ["1개월", "10회", "카드 100,000원"],
      ["1개월", "10회", "현금 99,000원"],
      ["1개월", "20회", "카드 200,000원"],
      ["1개월", "20회", "현금 198,000원"],
      ["1개월", "30회", "카드 300,000원"],
      ["1개월", "30회", "현금 297,000원"],
    ],
    memo: "1월 1일 ~ 1월 31일 결제에 한함",
    tickets: [], // 연결된 수업권 정보
    withCheckbox: false, // 선택 모드 비활성
    checked: false,
    popover: true, // 팝오버 사용
    color: "coralred", // 카드 테두리 색상
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

/* ======================================================================
   🧱 카드 + 팝오버 렌더링
   ----------------------------------------------------------------------
   ✅ 설명:
   - memberships 배열을 기반으로 각 회원권 카드를 DOM에 추가
   - 모든 카드 렌더링이 끝나면 initPopover() 호출로 팝오버 활성화
   ----------------------------------------------------------------------
   ✅ Angular 변환 시:
   - *ngFor="let m of memberships" → <app-membership-card [data]="m">
   - 팝오버 Directive로 분리 시: (appPopoverInit)="initPopover(memberships)"
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 카드 컨테이너
  const wrap = document.querySelector(".membership-card-wrap");
  if (!wrap) return;

  // 모든 회원권 데이터 렌더링
  memberships.forEach((m) => {
    const cardEl = document.createElement("div");
    cardEl.innerHTML = createMembershipCard(m); // 카드 HTML 생성
    const card = cardEl.firstElementChild;
    card.dataset.id = m.id; // 카드 고유 ID 저장
    wrap.appendChild(card);
  });

  // 팝오버 초기화 (렌더링 완료 후 실행)
  initPopover({ memberships });
});
