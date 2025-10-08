import "../../components/card/membership-card.js";

document.addEventListener("DOMContentLoaded", () => {
  const actWrap = document.querySelector(".act-wrap");
  const folderListWrap = document.querySelector(".folder-list-wrap");
  const cardWrap = document.querySelector(".membership-card-wrap");

  /* ==========================
     🔍 검색 토글
     - 검색 버튼 클릭 시 → 검색 영역 열림 + input focus
     - 닫기 버튼 클릭 시 → 검색 영역 닫힘 + 값 초기화
     ========================== */
  // 검색 토글
  const openBtn = document.querySelector(".membership-card-search-open-btn");
  const searchWrap = document.querySelector(".membership-card-search-wrap");
  const closeBtn = document.querySelector(".membership-card-search-close-btn");

  if (openBtn && searchWrap && closeBtn) {
    const openSearch = () => {
      searchWrap.classList.add("active");
      // 열릴 때 input을 다시 찾음
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchWrap.classList.contains("active")) {
        closeSearch();
      }
    });
  }

  /* ==========================
     📂 폴더 접기/펼치기
     ========================== */
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

  /* ==========================
     🔀 모드 전환 (정렬 / 삭제)
     ========================== */
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

    actWrap.style.display = "none"; // 기본 액션 영역 숨김

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
            : `<div class="delete-status__title">삭제할 수업 선택</div>
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
            ${isSort ? "순서 저장" : "선택한 수업 삭제"}
          </button>
        </div>
      </div>
    `;
    actWrap.parentNode.insertBefore(newWrap, actWrap.nextSibling);

    updateUnfoldBtnVisibility();
    bindUnfoldBtns();

    newWrap.querySelector(".x-btn").addEventListener("click", () => {
      window.isSortMode = false;
      window.isDeleteMode = false;
      disableSortMode();
      disableDeleteMode();
      newWrap.remove();
      actWrap.style.display = "flex";
    });

    if (isSort) {
      enableSortMode();
    } else if (isDelete) {
      enableDeleteMode();
      newWrap
        .querySelector(".toggle-all-btn")
        ?.addEventListener("click", toggleAll);
    }
  }

  /* ==========================
     ↔️ 정렬 모드
     ========================== */
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

    sortable = new Sortable(cardWrap, {
      animation: 200,
      ghostClass: "sortable-ghost-fake",
      chosenClass: "sortable-chosen-active",
      direction: "horizontal",
    });
  }
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

  /* ==========================
     ❌ 삭제 모드
     ========================== */
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
  function disableDeleteMode() {
    document.querySelectorAll(".membership-card.checkbox-mode").forEach((card) => {
      const checkbox = card.querySelector(".membership-card__checkbox");
      if (checkbox) checkbox.remove();
      card.classList.remove("checkbox-mode", "is-selected");
      card.dataset.checked = "false";
    });
  }

  /* ==========================
     ✅ 카드 선택 / 전체 선택
     ========================== */
  cardWrap.addEventListener("click", (e) => {
    if (!window.isDeleteMode) return;
    const card = e.target.closest(".membership-card.checkbox-mode");
    if (!card) return;

    const isSelected = !card.classList.contains("is-selected");
    card.classList.toggle("is-selected", isSelected);
    card.dataset.checked = isSelected ? "true" : "false";

    const checkbox = card.querySelector(".membership-card__checkbox");
    if (checkbox) {
      checkbox.setAttribute("aria-checked", isSelected ? "true" : "false");
    }

    updateDeleteCount();
  });

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
});
