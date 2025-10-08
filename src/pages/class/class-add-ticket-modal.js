import { createMembershipCard } from "../../components/card/create-membership-card.js";
import "../../components/card/membership-card.js";
import "../../components/modal/modal.js";

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

  // ==========================
  // 멤버십 카드 데이터
  // ==========================
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

  // ==========================
  // 카드 렌더링 (체크 아이콘 포함, 팝오버 제거)
  // ==========================
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

  // ==========================
  // 선택/총 개수 업데이트
  // ==========================
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
    if (totalCountEl) {
      totalCountEl.textContent = `/ 총 ${total}개`;
    }

    // 전체 선택/해제 버튼 텍스트 갱신
    allSelectBtn.innerHTML =
      selected === total && total > 0
        ? `<div>전체 해제</div>`
        : `<div>전체 선택</div>`;

    // 선택 완료 버튼 카운트 반영
    const saveBtn = document.querySelector(
      ".class-add-ticket-modal [data-modal-save]"
    );
    if (saveBtn) {
      saveBtn.innerHTML =
        selected > 0 ? `선택 완료 <span>${selected}</span>` : `선택 완료`;
    }
  }

  // ==========================
  // 카드 클릭 → 선택 토글 (이벤트 위임)
  // ==========================
  cardList.addEventListener("click", (e) => {
    const card = e.target.closest(".membership-card.checkbox-mode");
    if (!card) return;

    const isSelected = !card.classList.contains("is-selected");
    card.classList.toggle("is-selected", isSelected);
    card.dataset.checked = isSelected ? "true" : "false";

    const checkbox = card.querySelector(".membership-card__checkbox");
    if (checkbox) {
      checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
    }

    updateSelectedCount();
  });

  // ==========================
  // 전체 선택 / 전체 해제
  // ==========================
  function toggleAllCards() {
    const cards = cardList.querySelectorAll(".membership-card.checkbox-mode");
    const isAllSelected = [...cards].every((c) =>
      c.classList.contains("is-selected")
    );

    cards.forEach((card) => {
      card.classList.toggle("is-selected", !isAllSelected);
      card.dataset.checked = !isAllSelected ? "true" : "false";

      const checkbox = card.querySelector(".membership-card__checkbox");
      if (checkbox) {
        checkbox.setAttribute(
          "aria-checked",
          !isAllSelected ? "true" : "false"
        );
      }
    });

    updateSelectedCount();
  }
  allSelectBtn?.addEventListener("click", toggleAllCards);

  // ==========================
  // 추가 버튼 → 편집 버튼 교체 + 모달 열기
  // ==========================
  addBtn?.addEventListener("click", () => {
    const row = addBtn.closest(".class-add-sidebar__row");
    const ticketWrap = row.querySelector(".class-add-sidebar__sub-ticket-wrap");

    if (!row || !ticketWrap) return;

    // 추가 버튼 제거 후 편집 버튼 삽입
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

    // 임시 내용 보여주기
    ticketWrap.style.display = "block";

    // 모달 바로 열기
    const modalTrigger = document.querySelector(
      '[data-modal-open="class-add-ticket-modal"]'
    );
    modalTrigger?.click();
  });
  // 기존 편집 버튼도 모달 연결
  editBtn?.setAttribute("data-modal-open", "class-add-ticket-modal");

  // ==========================
  // 초기 카운트 세팅
  // ==========================
  updateSelectedCount();
});
