/* ======================================================================
   📦 add-product-modal.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “추가할 상품 선택” 모달 관리
   - 탭(회원권 / 락커 / 운동복) 구성 및 카드 렌더링
   - 각 탭별 선택 개수 카운트 및 전체 선택 카운트 표시
   - 팝오버 초기화(initPopover) 처리
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - <app-tab> 컴포넌트 기반 탭 구조로 변경
   - <app-membership-card *ngFor="let item of memberships"> 로 카드 렌더링
   - 팝오버는 <app-popover>로 분리
   - 선택 카운트는 @Output()으로 부모 컴포넌트에 전달
   ====================================================================== */

import { createMembershipCard } from "../../components/card/create-membership-card.js";
import "../../components/card/membership-card.js";
import { initPopover } from "../../components/card/popover-init.js";

import "../../components/modal/modal.js";

import "../../components/tab/tab.js";
import { initializeTabs } from "../../components/tab/tab.js";

/* ======================================================================
   1️⃣ 탭 및 카드 렌더링
   ----------------------------------------------------------------------
   ✅ 역할:
   - line-tab 기반의 탭 UI 초기화
   - 회원권 / 락커 / 운동복 탭의 DOM 캐싱
   - 회원권 카드 목록 생성 및 팝오버 초기화
   - 락커 / 운동복 탭은 empty-state 출력
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - Tab: <app-tab-group> + <app-tab label="회원권"> 구조
   - CardList: *ngFor 사용
   - Popover: <app-popover [membership]="item">
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------
     📘 탭 초기화
  -------------------------- */
  initializeTabs();

  /* --------------------------
     📘 탭 패널 DOM 캐싱
  -------------------------- */
  const membershipPanel = document.querySelector(
    "#membership .add-product-modal__card-list"
  );
  const lockerPanel = document.querySelector(
    "#locker .add-product-modal__card-list"
  );
  const clothingPanel = document.querySelector(
    "#clothing .add-product-modal__card-list"
  );

  if (!membershipPanel || !lockerPanel || !clothingPanel) {
    console.warn("❌ Add Product Modal: 탭 패널 구조가 올바르지 않습니다.");
    return;
  }

  /* --------------------------
     📘 회원권 카드 데이터
     - 예시용 mock 데이터 배열
     - createMembershipCard()로 렌더링
  -------------------------- */
  const memberships = [
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

  /* --------------------------
     📘 회원권 카드 렌더링
     - createMembershipCard() 반복 사용
     - 팝오버 포함
  -------------------------- */
  membershipPanel.innerHTML = memberships
    .map((item) =>
      createMembershipCard({
        ...item,
        withOptionCheckbox: true,
        popover: true,
      })
    )
    .join("");

  // 팝오버 초기화 (렌더링 후 필수)
  initPopover({ memberships });

  /* --------------------------
     📘 락커 / 운동복 탭 empty-state 출력
     - 상품이 없을 때 안내 메시지 및 버튼 표시
  -------------------------- */
  lockerPanel.innerHTML = `<div class="empty-state">
    <p class="empty-state__title">락커 이용권이 없어요.</p>
    <p class="empty-state__sub">락커 이용권 페이지에서 상품을 생성해주세요.</p>
    <button class="btn btn--solid btn--neutral btn--small">
      <span>락커 이용권 페이지로 이동</span>
      <i class="icon--caret-right icon"></i>
    </button>
  </div>`;

  clothingPanel.innerHTML = `<div class="empty-state">
    <p class="empty-state__title">운동복 이용권이 없어요.</p>
    <p class="empty-state__sub">운동복 이용권 페이지에서 상품을 생성해주세요.</p>
    <button class="btn btn--solid btn--neutral btn--small">
      <span>운동복 이용권 페이지로 이동</span>
      <i class="icon--caret-right icon"></i>
    </button>
  </div>`;
});

/* ======================================================================
   2️⃣ 탭별 / 전체 선택 개수 카운팅
   ----------------------------------------------------------------------
   ✅ 역할:
   - 각 탭에서 선택된 항목(checkbox, row)의 개수를 실시간 카운팅
   - 탭 버튼 내 badge와 저장 버튼 옆 total count를 갱신
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - @Output() selectionCount = new EventEmitter<number>()
   - *ngFor 카드 내부 (click)="onSelect(item)"
   - 카운트 로직은 service 또는 state로 분리 가능
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.querySelector(
    ".add-product-modal__header-btns .save-btn"
  );
  if (!saveBtn) return;

  /* --------------------------
     📘 탭별 count badge 생성
  -------------------------- */
  const tabButtons = document.querySelectorAll(".line-tab__tab[data-target]");
  tabButtons.forEach((btn) => {
    const category = btn.dataset.target;
    let countEl = btn.querySelector(".tab-count");
    if (!countEl) {
      countEl = document.createElement("span");
      countEl.className = "tab-count";
      countEl.dataset.category = category;
      btn.appendChild(countEl);
    }
  });

  /* --------------------------
     📘 전체 선택 개수 badge 생성
  -------------------------- */
  let totalCountEl = saveBtn.querySelector(".total-count");
  if (!totalCountEl) {
    totalCountEl = document.createElement("span");
    totalCountEl.className = "total-count";
    saveBtn.appendChild(totalCountEl);
  }

  /* --------------------------
     🧮 카운트 갱신 함수
     - 탭별 count + 전체 total count 갱신
  -------------------------- */
  function updateCounts() {
    let total = 0;

    // 탭별 카운트
    document.querySelectorAll(".tab-count").forEach((el) => {
      const category = el.dataset.category;
      const list = document.querySelector(
        `.add-product-modal__card-list[data-category="${category}"]`
      );
      if (!list) return;

      const count = list.querySelectorAll(
        ".membership-card-detail-row.is-checked"
      ).length;

      // 0개면 숨김, 1개 이상이면 표시
      if (count > 0) {
        el.textContent = count;
        el.style.display = "inline-block";
      } else {
        el.textContent = "";
        el.style.display = "none";
      }

      total += count;
    });

    // 전체 카운트
    if (total > 0) {
      totalCountEl.textContent = `${total}`;
      totalCountEl.style.display = "inline-block";
    } else {
      totalCountEl.textContent = "";
      totalCountEl.style.display = "none";
    }
  }

  /* --------------------------
     📘 클릭 시 (row / checkbox 감지)
     - membership-card 내부 row 클릭 시 updateCounts 실행
  -------------------------- */
  document.addEventListener("click", (e) => {
    const isCheckbox = e.target.closest(".membership-card__detail-checkbox");
    const isRow = e.target.closest(".membership-card-detail-row");

    if (!isCheckbox && !isRow) return;

    // membership-card.js 내부 상태 반영 후 카운트 갱신
    setTimeout(updateCounts, 30);
  });

  /* --------------------------
     📘 초기 렌더링 시 카운트 세팅
     - cardsRendered 커스텀 이벤트 발생 시 갱신
  -------------------------- */
  document.addEventListener("cardsRendered", updateCounts);
  setTimeout(updateCounts, 300);

  // 디버깅용 전역 함수 등록 (선택)
  window.updateCounts = updateCounts;
});
