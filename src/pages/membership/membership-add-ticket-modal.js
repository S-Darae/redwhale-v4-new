/* ======================================================================
   📦 membership-add-ticket.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “회원권 등록” 페이지 내에서 ‘수업 선택’ 모달을 관리
   - 수업 목록(클래스 카드) 렌더링, 선택/해제, 전체 선택 기능 포함
   - 모달은 추가 버튼 → 편집 버튼 전환 로직 포함
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 이 로직은 “Class 선택 모달” 컴포넌트로 분리 가능
   - @Input: classList[], @Output: selectedClasses[] 로 상태 전달
   - 카드 선택은 [(ngModel)] or @Output eventEmitter 로 대체
   ====================================================================== */

import "../../components/card/class-card.js";
import { createClassCard } from "../../components/card/create-class-card.js";
import "../../components/modal/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================================
     🎛️ 주요 엘리먼트 캐싱
     ----------------------------------------------------------------------
     - 모달 / 추가 버튼 / 편집 버튼 / 전체 선택 버튼 / 카드 리스트 / 카운트 요소
     ====================================================================== */
  const modal = document.getElementById("membership-add-ticket-modal");
  const addBtn = document.querySelector(".membership-add-sidebar__ticket-add-btn");
  const editBtn = document.querySelector(".membership-add-sidebar__ticket-edit-btn");

  const allSelectBtn = document.querySelector(
    ".membership-add-ticket-modal__action-wrap .all-select-btn"
  );
  const cardCountEl = document.querySelector(
    ".membership-add-ticket-modal__action-wrap .membership-add-ticket-modal__selected-count"
  );
  const cardList = document.querySelector(
    ".membership-add-ticket-modal__card-list"
  );

  /* ======================================================================
     📋 예약 가능한 수업 데이터 (임시 Mock Data)
     ----------------------------------------------------------------------
     - 실제 API 연동 시 서버에서 전달되는 classList 데이터 대체
     - 각 카드 항목은 createClassCard()로 변환되어 렌더링됨
     ====================================================================== */
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
      withCheckbox: true,
      checked: false,
      popover: true,
      color: "peachglow",
    },
  ];

  /* ======================================================================
     🧱 카드 렌더링 (체크모드)
     ----------------------------------------------------------------------
     ✅ 설명:
     - createClassCard()를 이용해 모든 수업 카드를 체크박스 모드로 렌더링
     - popover 비활성화 (단순 선택용)
     ====================================================================== */
  cardList.innerHTML = "";
  classes.forEach((c) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createClassCard({
      ...c,
      withCheckbox: true,
      popover: false,
    });
    cardList.appendChild(wrapper.firstElementChild);
  });

  /* ======================================================================
     🔢 선택/총 개수 업데이트
     ----------------------------------------------------------------------
     ✅ 설명:
     - 선택된 카드 수 / 전체 카드 수 표시
     - 전체 선택 버튼, “선택 완료” 버튼 텍스트 실시간 갱신
     ====================================================================== */
  function updateSelectedCount() {
    const allCards = cardList.querySelectorAll(".class-card.checkbox-mode");
    const selectedCards = cardList.querySelectorAll(
      ".class-card.checkbox-mode.is-selected"
    );

    const selected = selectedCards.length;
    const total = allCards.length;

    // 좌측 “선택된 개수” 표시
    cardCountEl.textContent = `${selected}개`;

    // 총 카드 개수 표시
    const totalCountEl = document.querySelector(
      ".membership-add-ticket-modal__total-count"
    );
    if (totalCountEl) totalCountEl.textContent = `/ 총 ${total}개`;

    // 전체 선택 버튼 텍스트 갱신
    allSelectBtn.innerHTML =
      selected === total && total > 0
        ? `<div>전체 해제</div>`
        : `<div>전체 선택</div>`;

    // “선택 완료” 버튼의 카운트 업데이트
    const saveBtn = modal.querySelector("[data-modal-save]");
    if (saveBtn)
      saveBtn.innerHTML =
        selected > 0 ? `선택 완료 <span>${selected}</span>` : `선택 완료`;
  }

  /* ======================================================================
     ✅ 전역 카드 선택 이벤트 감지 → 카운트 갱신
     ----------------------------------------------------------------------
     ✅ 설명:
     - 각 카드 내부의 체크 상태가 바뀔 때마다 “card-selection-changed” 이벤트 발생
     - 해당 모달 내의 카드 선택 변화만 감지하여 updateSelectedCount() 실행
     ====================================================================== */
  document.addEventListener("card-selection-changed", (e) => {
    if (e.detail.card.closest(".membership-add-ticket-modal")) {
      updateSelectedCount();
    }
  });

  /* ======================================================================
     🔘 전체 선택 / 전체 해제
     ----------------------------------------------------------------------
     ✅ 설명:
     - 현재 모든 카드가 선택된 상태면 → 전체 해제
     - 일부만 선택된 상태면 → 전체 선택
     - 체크박스 aria-checked 동기화 포함
     ====================================================================== */
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
        checkbox.setAttribute("aria-checked", !isAllSelected ? "true" : "false");
      }
    });

    updateSelectedCount();
  });

  /* ======================================================================
     ➕ 추가 버튼 → 편집 버튼 교체 + 모달 열기
     ----------------------------------------------------------------------
     ✅ 설명:
     - “추가” 버튼 클릭 시 → 해당 행의 추가 버튼을 “편집” 버튼으로 교체
     - 교체 후 모달 자동 오픈
     ====================================================================== */
  addBtn?.addEventListener("click", () => {
    const row = addBtn.closest(".membership-add-sidebar__row");
    const ticketWrap = row.querySelector(".membership-add-sidebar__sub-ticket-wrap");
    if (!row || !ticketWrap) return;

    // 기존 추가 버튼 제거 → 편집 버튼으로 교체
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
    row.querySelector(".membership-add-sidebar__row-header").appendChild(newEditBtn);

    // 수업 선택 리스트 표시
    ticketWrap.style.display = "block";

    // 새로 삽입된 편집 버튼으로 모달 열기 트리거
    const modalTrigger = document.querySelector(
      '[data-modal-open="membership-add-ticket-modal"]'
    );
    modalTrigger?.click();
  });

  /* ======================================================================
     🖋️ 기존 편집 버튼 → 모달 오픈 속성 연결
     ----------------------------------------------------------------------
     - 이미 존재하는 “편집” 버튼도 data-modal-open 속성 부여
     ====================================================================== */
  editBtn?.setAttribute("data-modal-open", "membership-add-ticket-modal");

  /* ======================================================================
     🚀 초기 렌더 후 카운트 세팅
     ====================================================================== */
  updateSelectedCount();
});
