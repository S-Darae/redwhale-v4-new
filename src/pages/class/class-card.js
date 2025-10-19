/**
 * ======================================================================
 * 🧩 class.js — 수업 카드 + 팝오버 렌더링 스크립트
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 수업 목록(카드형) 데이터를 기반으로 DOM 렌더링
 * - 각 수업 카드에 팝오버(클래스 상세 정보) 기능 초기화
 * - UI 스타일: class-card.scss / class.scss 기반
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 수업 카드 데이터 정의 (classes 배열)
 * 2️⃣ createClassCard()로 카드 DOM 생성 및 삽입
 * 3️⃣ initPopover({ classes }) 호출로 카드 팝오버 초기화
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-class-list>` 컴포넌트로 전환
 *   → @Input() classes로 데이터 전달
 *   → 내부에서 `<app-class-card>` 반복 렌더링
 * - initPopover() 로직은 Directive(`PopoverDirective`)로 분리
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - class-card.scss  
 * - class.scss  
 * - popover.scss (팝오버 UI 스타일)
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import "../../components/card/class-card.scss";
import { createClassCard } from "../../components/card/create-class-card.js";
import { initPopover } from "../../components/card/popover-init.js";
import "./class.scss";

/* ======================================================================
   📚 수업 카드 데이터 (Mock Data)
   ----------------------------------------------------------------------
   ✅ 설명:
   - 각 수업 정보(이름, 유형, 트레이너, 이용권 등)를 객체 형태로 관리
   - color는 카드 배경/테마 컬러
   - popover: true → 카드 클릭 시 팝오버 표시
   ====================================================================== */
export const classes = [
  {
    id: "class-card-1",
    folderName: "다이어트 1",
    className: "다이어트 1:5 오후반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "90분",
    people: "5명",
    trainer: "김태형, 이서",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "오후반 전용 수업",
    notice:
      "전문 트레이너와 함께 체계적인 프로그램으로 안전하고 효과적인 운동을 경험해 보세요. 활기찬 분위기 속에서 즐겁게 땀 흘리며 건강한 생활 습관을 만들 수 있어요.",
    tickets: [
      {
        folderName: "새해 이벤트",
        items: [
          "새해 이벤트 - 1개월",
          "새해 이벤트 - 3개월",
          "새해 이벤트 - 6개월",
          "새해 이벤트 - 9개월",
          "새해 이벤트 - 12개월",
        ],
      },
    ],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "coralred",
  },
  {
    id: "class-card-2",
    folderName: "다이어트 1",
    className: "다이어트 1:5 오전반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "90분",
    people: "5명",
    trainer: "김태형, 이서",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "lavendermist",
  },
  {
    id: "class-card-3",
    folderName: "다이어트 1",
    className: "다이어트 1:2 PT 주말 오후반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "50분",
    people: "2명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "sandbeige",
  },
  {
    id: "class-card-4",
    folderName: "다이어트 1",
    className: "다이어트 1:2 PT 주말 오전반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "50분",
    people: "2명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "sunnyyellow",
  },
  {
    id: "class-card-5",
    folderName: "다이어트 1",
    className: "다이어트 1:2 PT 평일 오후반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "50분",
    people: "2명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "oliveleaf",
  },
  {
    id: "class-card-6",
    folderName: "다이어트 1",
    className: "다이어트 1:2 PT 평일 오전반",
    badge: "그룹",
    badgeVariant: "group",
    duration: "50분",
    people: "2명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "freshgreen",
  },
  {
    id: "class-card-7",
    folderName: "다이어트 1",
    className: "다이어트 1:1 PT 주말 오후반",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "aquabreeze",
  },
  {
    id: "class-card-8",
    folderName: "다이어트 1",
    className: "다이어트 1:1 PT 주말 오전반",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "bluesky",
  },
  {
    id: "class-card-9",
    folderName: "다이어트 1",
    className: "다이어트 1:1 PT 평일 오후반",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
    tickets: [],
    withCheckbox: false,
    checked: false,
    popover: true,
    color: "pinkpop",
  },
  {
    id: "class-card-10",
    folderName: "다이어트 1",
    className: "다이어트 1:1 PT 평일 오전반",
    badge: "개인",
    badgeVariant: "personal",
    duration: "50분",
    people: "1명",
    trainer: "김민수",
    policyReserve: "수업 시작 7일 전 0시부터 30분 전까지",
    policyCancel: "수업 시작 24시간 전까지",
    memo: "",
    notice: "",
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
   ✅ 기능:
   - createClassCard() 로 각 수업 카드 DOM 생성
   - wrap(.class-card-wrap)에 삽입
   - 렌더링 완료 후 initPopover() 호출로 팝오버 초기화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".class-card-wrap");
  if (!wrap) return;

  // 카드 DOM 렌더링
  classes.forEach((c) => {
    const cardEl = document.createElement("div");
    cardEl.innerHTML = createClassCard(c);
    const card = cardEl.firstElementChild;
    card.dataset.id = c.id;
    wrap.appendChild(card);
  });

  // 팝오버 초기화 (렌더링 완료 후)
  initPopover({ classes });
});
