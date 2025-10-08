import "../../components/card/class-card.js";
import { createClassCard } from "../../components/card/create-class-card.js";
import "../../components/modal/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("membership-add-ticket-modal");
  const addBtn = document.querySelector(
    ".membership-add-sidebar__ticket-add-btn"
  );
  const editBtn = document.querySelector(
    ".membership-add-sidebar__ticket-edit-btn"
  );

  const allSelectBtn = document.querySelector(
    ".membership-add-ticket-modal__action-wrap .all-select-btn"
  );
  const cardCountEl = document.querySelector(
    ".membership-add-ticket-modal__action-wrap .membership-add-ticket-modal__selected-count"
  );
  const cardList = document.querySelector(
    ".membership-add-ticket-modal__card-list"
  );

  /* ==========================
   예약 가능한 수업 데이터
   ========================== */
  const classes = [
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
        "전문 트레이너와 함께 체계적인 프로그램으로 안전하고 효과적인 운동을 경험해 보세요.",
      tickets: [],
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
      checked: false,
      popover: false,
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
      withCheckbox: true,
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
      withCheckbox: true,
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
      withCheckbox: true,
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
      withCheckbox: true,
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
      withCheckbox: true,
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
      withCheckbox: true,
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
      withCheckbox: true,
      checked: false,
      popover: true,
      color: "peachglow",
    },
  ];

  // ==========================
  // 카드 렌더링
  // ==========================
  cardList.innerHTML = "";
  classes.forEach((c) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createClassCard(c);
    cardList.appendChild(wrapper.firstElementChild);
  });

  // ==========================
  // 선택/총 개수 업데이트
  // ==========================
  function updateSelectedCount() {
    const allCards = cardList.querySelectorAll(".class-card.checkbox-mode");
    const selectedCards = cardList.querySelectorAll(
      ".class-card.checkbox-mode.is-selected"
    );

    const selected = selectedCards.length;
    const total = allCards.length;

    // 좌측 선택 카운트 표시
    cardCountEl.textContent = `${selected}개`;

    // 총 카드 개수 표시
    const totalCountEl = document.querySelector(
      ".membership-add-ticket-modal__total-count"
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
    const saveBtn = modal.querySelector("[data-modal-save]");
    if (saveBtn) {
      saveBtn.innerHTML =
        selected > 0 ? `선택 완료 <span>${selected}</span>` : `선택 완료`;
    }
  }

  // ==========================
  // 카드 클릭 → 선택 토글 (이벤트 위임)
  // ==========================
  cardList.addEventListener("click", (e) => {
    const card = e.target.closest(".class-card.checkbox-mode");
    if (!card) return;

    const isSelected = !card.classList.contains("is-selected");
    card.classList.toggle("is-selected", isSelected);
    card.dataset.checked = isSelected ? "true" : "false";

    const checkbox = card.querySelector(".class-card__checkbox");
    if (checkbox) {
      checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
    }
    updateSelectedCount();
  });
  // ==========================
  // 전체 선택 / 전체 해제
  // ==========================
  allSelectBtn?.addEventListener("click", () => {
    const cards = cardList.querySelectorAll(".class-card.checkbox-mode");
    const isAllSelected = [...cards].every((c) =>
      c.classList.contains("is-selected")
    );

    cards.forEach((card) => {
      card.classList.toggle("is-selected", !isAllSelected);
      card.dataset.checked = !isAllSelected ? "true" : "false";

      const checkbox = card.querySelector(".class-card__checkbox");
      if (checkbox) {
        checkbox.setAttribute(
          "aria-checked",
          !isAllSelected ? "true" : "false"
        );
      }
    });

    updateSelectedCount();
  });

  // ==========================
  // 추가 버튼 → 편집 버튼 교체 + 모달 열기
  // ==========================
  addBtn?.addEventListener("click", () => {
    const row = addBtn.closest(".membership-add-sidebar__row");
    const ticketWrap = row.querySelector(
      ".membership-add-sidebar__sub-ticket-wrap"
    );

    if (!row || !ticketWrap) return;

    // 추가 버튼 제거 후 편집 버튼 삽입
    addBtn.remove();
    const newEditBtn = document.createElement("button");
    newEditBtn.className =
      "btn btn--solid btn--secondary btn--small membership-add-sidebar__ticket-edit-btn";
    newEditBtn.setAttribute("aria-disabled", "false");
    newEditBtn.setAttribute("data-modal-open", "membership-add-ticket-modal");
    newEditBtn.innerHTML = `
      <div class="icon--edit icon"></div>
      <div>편집</div>
    `;
    row
      .querySelector(".membership-add-sidebar__row-header")
      .appendChild(newEditBtn);

    ticketWrap.style.display = "block";

    const modalTrigger = document.querySelector(
      '[data-modal-open="membership-add-ticket-modal"]'
    );
    modalTrigger?.click();
  });

  editBtn?.setAttribute("data-modal-open", "membership-add-ticket-modal");

  // ==========================
  // 초기 카운트 세팅
  // ==========================
  updateSelectedCount();
});
