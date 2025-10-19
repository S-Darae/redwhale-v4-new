/**
 * ======================================================================
 * 🎟️ class-add-ticket-modal.js — 수업 추가 > 이용권 선택 모달
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - “수업 추가” 사이드바에서 이용권 추가/편집 시 열리는 모달 관리
 * - 회원권(멤버십) 카드 목록 렌더링 + 선택/전체선택 + 카운트 UI 업데이트
 * - “추가” 버튼 클릭 시 → “편집” 버튼으로 전환 후 모달 연결
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 멤버십 카드 목록 렌더링 (createMembershipCard)
 * 2️⃣ 개별 카드 선택/해제 감지 및 선택 카운트 반영
 * 3️⃣ 전체 선택/해제 토글
 * 4️⃣ “추가” → “편집” 버튼 교체 및 모달 연동
 * 5️⃣ 선택된 카드 수 UI 및 버튼 상태 갱신
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-class-add-ticket-modal>` 컴포넌트로 분리
 *   → @Input() tickets, @Output() selectionChanged
 * - createMembershipCard → `<app-membership-card>` 컴포넌트화
 * - 카드 선택 상태 관리: reactive state (signal/store)
 * - “추가 → 편집” 버튼 로직은 부모 컴포넌트에서 props로 전달
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - class-add-ticket-modal.scss  
 * - membership-card.scss / modal.scss / button.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import { createMembershipCard } from "../../components/card/create-membership-card.js";
import "../../components/card/membership-card.js";
import "../../components/modal/modal.js";

/* ======================================================================
   🏁 초기화: DOMContentLoaded
   ----------------------------------------------------------------------
   ✅ 기능:
   - 모달 내 카드 목록 렌더링
   - 선택/전체선택 카운트 UI 설정
   - 추가/편집 버튼 상태 제어
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("class-add-ticket-modal");
  const addBtn = document.querySelector(".class-add-sidebar__ticket-add-btn");
  const editBtn = document.querySelector(".class-add-sidebar__ticket-edit-btn");

  const allSelectBtn = document.querySelector(
    ".class-add-ticket-modal__action-wrap .all-select-btn"
  );
  const cardCountEl = document.querySelector(
    ".class-add-ticket-modal__action-wrap .class-add-ticket-modal__selected-count"
  );
  const cardList = document.querySelector(".class-add-ticket-modal__card-list");

  /* ======================================================================
     🎟️ 멤버십 카드 데이터 (임시 Mock 데이터)
     ----------------------------------------------------------------------
     ✅ 설명:
     - 체크박스 모드로 렌더링됨 (popover 비활성화)
     - badgeVariant: reserv-used / reserv-unused
     - details 배열 내에서 text/cancel 조합도 허용
     ====================================================================== */
  const tickets = [
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
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
    },
    {
      id: "membership-card-4",
      folderName: "새해 이벤트",
      membershipName: "새해 이벤트 - 9개월",
      badge: "예약 미사용",
      badgeVariant: "reserv-unused",
      details: [["9개월", "무제한", "카드 900,000원"]],
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
    },
    {
      id: "membership-card-7",
      folderName: "새해 이벤트",
      membershipName: "새해 이벤트 - 디자인 너비 테스트",
      badge: "예약 미사용",
      badgeVariant: "reserv-unused",
      details: [["999개월", "999회", "계좌이체 99,999,999원"]],
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
    },
  ];

  /* ======================================================================
     🧱 카드 렌더링
     ----------------------------------------------------------------------
     ✅ 기능:
     - withCheckbox 모드로 멤버십 카드 생성
     - popover 제거 (체크 전용 모드)
     ====================================================================== */
  cardList.innerHTML = "";
  tickets.forEach((ticket) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createMembershipCard({
      ...ticket,
      withCheckbox: true,
      popover: false,
      checked: false,
    });
    cardList.appendChild(wrapper.firstElementChild);
  });

  /* ======================================================================
     🔢 선택/총 개수 업데이트 함수
     ----------------------------------------------------------------------
     ✅ 기능:
     - 선택된 카드 수 / 전체 수 표시
     - 전체선택 버튼, 완료 버튼, 텍스트 상태 갱신
     ====================================================================== */
  function updateSelectedCount() {
    const allCards = cardList.querySelectorAll(
      ".membership-card.checkbox-mode"
    );
    const selectedCards = cardList.querySelectorAll(
      ".membership-card.checkbox-mode.is-selected"
    );

    const selected = selectedCards.length;
    const total = allCards.length;

    // 좌측 선택 카운트 표시
    cardCountEl.textContent = `${selected}개`;

    // 총 카드 개수 표시
    const totalCountEl = document.querySelector(
      ".class-add-ticket-modal__total-count"
    );
    if (totalCountEl) totalCountEl.textContent = `/ 총 ${total}개`;

    // 전체선택 버튼 텍스트 갱신
    allSelectBtn.innerHTML =
      selected === total && total > 0
        ? `<div>전체 해제</div>`
        : `<div>전체 선택</div>`;

    // 완료 버튼(선택 완료) 카운트 표시
    const saveBtn = document.querySelector(
      ".class-add-ticket-modal [data-modal-save]"
    );
    if (saveBtn) {
      saveBtn.innerHTML =
        selected > 0 ? `선택 완료 <span>${selected}</span>` : `선택 완료`;
    }
  }

  /* ======================================================================
     ✅ 카드 선택 이벤트 감지 (전역 커스텀 이벤트)
     ----------------------------------------------------------------------
     ✅ 기능:
     - 각 카드 내부에서 선택 상태가 바뀌면
       `card-selection-changed` 이벤트가 발생
     - 해당 이벤트 감지 후 카운트 UI 갱신
     ====================================================================== */
  document.addEventListener("card-selection-changed", (e) => {
    // 모달 내부 카드만 반영
    if (e.detail.card.closest(".class-add-ticket-modal")) {
      updateSelectedCount();
    }
  });

  /* ======================================================================
     🔘 전체 선택 / 전체 해제
     ----------------------------------------------------------------------
     ✅ 기능:
     - 전체 선택 버튼 클릭 시 모든 카드 선택/해제 토글
     - aria-checked 및 dataset.checked 속성 동기화
     ====================================================================== */
  function toggleAllCards() {
    const cards = cardList.querySelectorAll(".membership-card.checkbox-mode");
    const isAllSelected = [...cards].every((c) =>
      c.classList.contains("is-selected")
    );

    cards.forEach((card) => {
      card.classList.toggle("is-selected", !isAllSelected);
      card.dataset.checked = !isAllSelected ? "true" : "false";

      const checkbox = card.querySelector(".membership-card__checkbox");
      if (checkbox)
        checkbox.setAttribute("aria-checked", !isAllSelected ? "true" : "false");
    });

    updateSelectedCount();
  }
  allSelectBtn?.addEventListener("click", toggleAllCards);

  /* ======================================================================
     ➕ 추가 버튼 → 편집 버튼 교체 + 모달 열기
     ----------------------------------------------------------------------
     ✅ 기능:
     - “이용권 추가” 버튼 클릭 시:
       1) 해당 행의 추가 버튼 제거
       2) “편집” 버튼으로 교체
       3) 임시 하위 티켓 영역 표시
       4) 모달 자동 오픈
     ====================================================================== */
  addBtn?.addEventListener("click", () => {
    const row = addBtn.closest(".class-add-sidebar__row");
    const ticketWrap = row.querySelector(".class-add-sidebar__sub-ticket-wrap");
    if (!row || !ticketWrap) return;

    // 기존 추가 버튼 제거 → 편집 버튼 삽입
    addBtn.remove();
    const newEditBtn = document.createElement("button");
    newEditBtn.className =
      "btn btn--solid btn--secondary btn--small class-add-sidebar__ticket-edit-btn";
    newEditBtn.setAttribute("aria-disabled", "false");
    newEditBtn.setAttribute("data-modal-open", "class-add-ticket-modal");
    newEditBtn.innerHTML = `
      <div class="icon--edit icon"></div>
      <div>편집</div>
    `;
    row.querySelector(".class-add-sidebar__row-header").appendChild(newEditBtn);

    // 임시 티켓 영역 표시
    ticketWrap.style.display = "block";

    // 모달 즉시 열기
    const modalTrigger = document.querySelector(
      '[data-modal-open="class-add-ticket-modal"]'
    );
    modalTrigger?.click();
  });

  // 기존 편집 버튼에도 모달 오픈 연결
  editBtn?.setAttribute("data-modal-open", "class-add-ticket-modal");

  /* ======================================================================
     🚀 초기 카운트 세팅
     ====================================================================== */
  updateSelectedCount();
});
