/* ======================================================================
   📦 membership.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원권 페이지 상단 헤더(검색/모드 전환/정렬/삭제) 및 카드 UI 제어
   - 검색창 토글, 폴더 접힘/펼침, Sortable.js 기반 정렬, 삭제 모드 관리
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 검색 토글 → @ViewChild() + *ngIf 제어
   - 정렬/삭제 모드 → @Input() mode, @Output() modeChange
   - Sortable.js → cdkDragDrop (Angular CDK)
   ====================================================================== */

import "../../components/card/membership-card.js";

/* ======================================================================
   🧭 회원권 페이지 헤더 + 카드 제어
   ----------------------------------------------------------------------
   ✅ 주요 기능:
   - 검색 영역 토글
   - 폴더 접기/펼치기 상태
   - 정렬 모드 / 삭제 모드 전환
   - 카드 선택 및 카운트 갱신
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const actWrap = document.querySelector(".act-wrap");
  const folderListWrap = document.querySelector(".folder-list-wrap");
  const cardWrap = document.querySelector(".membership-card-wrap");

  /* ======================================================================
     🔍 검색 토글
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - 검색 버튼 클릭 → 검색창 열림 + input focus
     - 닫기 버튼 클릭 → 검색창 닫힘 + 입력값 초기화
     - ESC 키로도 닫기 가능
     ====================================================================== */
  const openBtn = document.querySelector(".membership-card-search-open-btn");
  const searchWrap = document.querySelector(".membership-card-search-wrap");
  const closeBtn = document.querySelector(".membership-card-search-close-btn");

  if (openBtn && searchWrap && closeBtn) {
    const openSearch = () => {
      searchWrap.classList.add("active");
      const input = searchWrap.querySelector("input[type='text']");
      if (input) input.focus();
    };

    const closeSearch = () => {
      searchWrap.classList.remove("active");
      const input = searchWrap.querySelector("input[type='text']");
      if (input) input.value = "";
    };

    openBtn.addEventListener("click", openSearch);
    closeBtn.addEventListener("click", closeSearch);

    // ESC 키로 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchWrap.classList.contains("active")) {
        closeSearch();
      }
    });
  }

  /* ======================================================================
     📂 폴더 접기 / 펼치기
     ----------------------------------------------------------------------
     ✅ 설명:
     - folding / unfolding 클래스에 따라 펼침 버튼 표시 상태 갱신
     - unfold 버튼 클릭 시 접힘 해제
     ====================================================================== */
  function updateUnfoldBtnVisibility() {
    const isFolded = folderListWrap.classList.contains("folding");
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.style.display = isFolded ? "inline-flex" : "none";
    });
  }

  function bindUnfoldBtns() {
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        folderListWrap.classList.remove("folding");
        folderListWrap.classList.add("unfolding");
        updateUnfoldBtnVisibility();
      });
    });
  }

  updateUnfoldBtnVisibility();
  bindUnfoldBtns();

  /* ======================================================================
     🔀 모드 전환 (정렬 / 삭제)
     ----------------------------------------------------------------------
     ✅ 설명:
     - actWrap 내 버튼 클릭으로 정렬모드 / 삭제모드 전환
     - 기존 actWrap 숨기고 새로운 act-wrap 섹션 동적 생성
     ====================================================================== */
  window.isSortMode = false;
  window.isDeleteMode = false;
  let sortable = null;

  actWrap
    .querySelector(".sort-mode-btn")
    ?.addEventListener("click", () => enterMode("sort"));
  actWrap
    .querySelector(".delete-mode-btn")
    ?.addEventListener("click", () => enterMode("delete"));

  function enterMode(mode) {
    const isSort = mode === "sort";
    const isDelete = mode === "delete";

    window.isSortMode = isSort;
    window.isDeleteMode = isDelete;

    // 기존 act-wrap 숨기기
    actWrap.style.display = "none";

    // 새 act-wrap 생성
    const newWrap = document.createElement("section");
    newWrap.className = `act-wrap ${isSort ? "sort-status" : "delete-status"}`;
    newWrap.innerHTML = `
      <div class="act-wrap__folder-title">
        <button class="btn--icon-utility folder-list-unfold-btn" aria-label="폴더 펼치기">
          <div class="icon--caret-double-right-light icon"></div>
        </button>
        ${
          isSort
            ? `<div class="sort-status__title">
                 순서 변경
                 <span class="sort-status__subtext">드래그하여 순서를 변경할 수 있어요.</span>
               </div>`
            : `<div class="delete-status__title">삭제할 회원권 선택</div>
               <ul class="delete-status__count-wrap">
                 <li>0개</li><li class="total-count">/ 총 0개</li>
               </ul>
               <button class="btn btn--solid btn--neutral btn--small toggle-all-btn">
                 전체 선택
               </button>`
        }
      </div>
      <div class="act-wrap__btns">
        <div class="act-wrap__btns__main">
          <button class="btn btn--outlined btn--neutral btn--medium x-btn">취소</button>
          <button class="btn btn--solid btn--primary btn--medium">
            ${isSort ? "순서 저장" : "선택한 회원권 삭제"}
          </button>
        </div>
      </div>
    `;
    actWrap.parentNode.insertBefore(newWrap, actWrap.nextSibling);

    // 폴더 버튼 상태 유지
    updateUnfoldBtnVisibility();
    bindUnfoldBtns();

    // 취소 버튼
    newWrap.querySelector(".x-btn").addEventListener("click", () => {
      window.isSortMode = false;
      window.isDeleteMode = false;
      disableSortMode();
      disableDeleteMode();
      newWrap.remove();
      actWrap.style.display = "flex";
    });

    // 모드별 초기화
    if (isSort) {
      enableSortMode();
    } else if (isDelete) {
      enableDeleteMode();
      newWrap
        .querySelector(".toggle-all-btn")
        ?.addEventListener("click", toggleAll);
    }
  }

  /* ======================================================================
     ↔️ 정렬 모드
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - 각 카드에 드래그 핸들 추가 (.membership-card__drag-handle)
     - Sortable.js로 수평 정렬 가능
     ====================================================================== */
  function enableSortMode() {
    document.querySelectorAll(".membership-card").forEach((card) => {
      const content = document.createElement("div");
      content.className = "content";
      content.append(...card.children);

      const handle = document.createElement("div");
      handle.className = "membership-card__drag-handle";
      handle.innerHTML = `<div class="icon--dots-six icon"></div>`;

      card.innerHTML = "";
      card.append(handle, content);
      card.classList.add("sort-mode-layout");
    });

    // Sortable.js 활성화
    sortable = new Sortable(cardWrap, {
      animation: 200,
      ghostClass: "sortable-ghost-fake",
      chosenClass: "sortable-chosen-active",
      direction: "horizontal",
    });
  }

  /* ======================================================================
     ⛔ 정렬 모드 종료
     ----------------------------------------------------------------------
     - 카드 구조 원래대로 복원
     - Sortable 인스턴스 제거
     ====================================================================== */
  function disableSortMode() {
    document.querySelectorAll(".membership-card").forEach((card) => {
      const content = card.querySelector(".content");
      if (content) {
        card.innerHTML = content.innerHTML;
      }
      card.classList.remove("sort-mode-layout");
    });
    if (sortable?.destroy) sortable.destroy();
    sortable = null;
  }

  /* ======================================================================
     ❌ 삭제 모드
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - 각 카드에 체크박스 추가
     - 클릭으로 선택 토글 가능
     ====================================================================== */
  function enableDeleteMode() {
    document.querySelectorAll(".membership-card").forEach((card) => {
      if (!card.querySelector(".membership-card__checkbox")) {
        const checkbox = document.createElement("div");
        checkbox.className = "membership-card__checkbox";
        checkbox.setAttribute("role", "checkbox");
        checkbox.setAttribute("aria-checked", "false");
        checkbox.innerHTML = `<i class="icon--check icon"></i>`;
        card.prepend(checkbox);

        card.classList.add("checkbox-mode");
        card.dataset.checked = "false";
      }
    });

    updateDeleteCount();
  }

  /* ======================================================================
     ⛔ 삭제 모드 종료
     ----------------------------------------------------------------------
     - 체크박스 제거 및 관련 클래스 초기화
     ====================================================================== */
  function disableDeleteMode() {
    document
      .querySelectorAll(".membership-card.checkbox-mode")
      .forEach((card) => {
        const checkbox = card.querySelector(".membership-card__checkbox");
        if (checkbox) checkbox.remove();
        card.classList.remove("checkbox-mode", "is-selected");
        card.dataset.checked = "false";
      });
  }

  /* ======================================================================
     🔢 선택 개수 및 전체 선택 제어
     ----------------------------------------------------------------------
     ✅ 역할:
     - 선택된 카드 수 표시
     - 전체 선택 / 해제 버튼 상태 업데이트
     ====================================================================== */
  function updateDeleteCount() {
    const selected = cardWrap.querySelectorAll(
      ".membership-card.is-selected"
    ).length;
    const total = cardWrap.querySelectorAll(".membership-card").length;
    const countWrap = document.querySelector(".delete-status__count-wrap");

    if (countWrap) {
      countWrap.innerHTML = `<li>${selected}개</li><li class="total-count">/ 총 ${total}개</li>`;
    }

    const toggleBtn = document.querySelector(".toggle-all-btn");
    if (toggleBtn) {
      toggleBtn.textContent =
        selected === total && total > 0 ? "전체 해제" : "전체 선택";
    }
  }

  /* ======================================================================
     🔘 전체 선택 / 전체 해제
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - 모든 카드에 대해 is-selected 토글
     - aria-checked 값 동기화
     ====================================================================== */
  function toggleAll() {
    const cards = cardWrap.querySelectorAll(".membership-card.checkbox-mode");
    const allSelected = [...cards].every((c) =>
      c.classList.contains("is-selected")
    );

    cards.forEach((card) => {
      card.classList.toggle("is-selected", !allSelected);
      card.dataset.checked = !allSelected ? "true" : "false";
      const checkbox = card.querySelector(".membership-card__checkbox");
      if (checkbox) {
        checkbox.setAttribute("aria-checked", !allSelected ? "true" : "false");
      }
    });

    updateDeleteCount();
  }

  /* ======================================================================
     📣 전역 카드 선택 이벤트 감지
     ----------------------------------------------------------------------
     ✅ 역할:
     - card-selection-changed 이벤트 발생 시 카운트 갱신
     - 삭제 모드 상태에서만 반영
     ====================================================================== */
  document.addEventListener("card-selection-changed", () => {
    if (window.isDeleteMode) updateDeleteCount();
  });
});
