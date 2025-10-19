/**
 * ======================================================================
 * 🏋️‍♀️ class-card.js — 수업 카드 리스트 관리
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 수업 카드 리스트의 검색 / 폴더 접기 / 정렬 / 삭제 모드 전환 관리
 * - 정렬 모드에서는 Drag & Drop 정렬 지원 (Sortable.js)
 * - 삭제 모드에서는 체크박스 선택 및 전체 선택/해제 기능 제공
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 검색창 토글 (열기/닫기/ESC)
 * 2️⃣ 폴더 접기/펼치기 버튼
 * 3️⃣ 정렬 모드 (Sortable.js 기반)
 * 4️⃣ 삭제 모드 (체크박스 선택/전체 선택)
 * 5️⃣ 전역 카드 선택 이벤트 감지 → 카운트 갱신
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-class-card-list>` 컴포넌트로 전환
 *   → 내부에 `<app-class-card>` 반복 렌더링
 * - 정렬 기능: Angular CDK DragDrop 모듈 사용
 * - 삭제 기능: Reactive Form 또는 signal 기반 선택 상태 관리
 * - 검색창, 폴더 토글, 모드 전환 UI를 각각 하위 컴포넌트로 분리
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - class-card.scss  
 * - act-wrap.scss / folder-list.scss / button.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import "../../components/card/class-card.js";

/* ======================================================================
   🏁 초기화: DOMContentLoaded
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const actWrap = document.querySelector(".act-wrap");
  const folderListWrap = document.querySelector(".folder-list-wrap");
  const cardWrap = document.querySelector(".class-card-wrap");

  /* ======================================================================
     🔍 검색창 토글
     ----------------------------------------------------------------------
     ✅ 기능:
     - 검색 버튼 클릭 → 검색창 열기
     - 닫기 버튼 클릭 → 검색창 닫기
     - ESC 키 입력 시 닫기
     ====================================================================== */
  const openBtn = document.querySelector(".class-card-search-open-btn");
  const searchWrap = document.querySelector(".class-card-search-wrap");
  const closeBtn = document.querySelector(".class-card-search-close-btn");

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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchWrap.classList.contains("active")) {
        closeSearch();
      }
    });
  }

  /* ======================================================================
     📂 폴더 접기 / 펼치기
     ----------------------------------------------------------------------
     ✅ 기능:
     - 폴더 영역 접힘 여부(folding)에 따라 “펼치기 버튼” 표시 제어
     - 버튼 클릭 시 폴더 전체 펼치기
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
     ✅ 기능:
     - “정렬 모드” 진입 → Sortable 활성화
     - “삭제 모드” 진입 → 카드 체크박스 추가
     - 모드별 act-wrap UI 생성 및 취소 버튼 처리
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

    // 기본 액션 영역 숨김
    actWrap.style.display = "none";

    // 모드별 새로운 act-wrap 생성
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

    // 폴더 버튼 상태 갱신
    updateUnfoldBtnVisibility();
    bindUnfoldBtns();

    // 취소 버튼 → 원래 모드 복귀
    newWrap.querySelector(".x-btn").addEventListener("click", () => {
      window.isSortMode = false;
      window.isDeleteMode = false;
      disableSortMode();
      disableDeleteMode();
      newWrap.remove();
      actWrap.style.display = "flex";
    });

    // 모드별 진입 처리
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
     ✅ 기능:
     - 카드에 드래그 핸들 추가
     - Sortable.js 활성화
     - 정렬 해제 시 원상 복귀
     ====================================================================== */
  function enableSortMode() {
    document.querySelectorAll(".class-card").forEach((card) => {
      const content = document.createElement("div");
      content.className = "content";
      content.append(...card.children);

      const handle = document.createElement("div");
      handle.className = "class-card__drag-handle";
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
    document.querySelectorAll(".class-card").forEach((card) => {
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
     ✅ 기능:
     - 각 카드에 체크박스 추가
     - 선택/해제 상태 dataset 및 aria 속성 동기화
     - 전체 선택/해제 및 카운트 갱신 지원
     ====================================================================== */
  function enableDeleteMode() {
    document.querySelectorAll(".class-card").forEach((card) => {
      if (!card.querySelector(".class-card__checkbox")) {
        const checkbox = document.createElement("div");
        checkbox.className = "class-card__checkbox";
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
    document.querySelectorAll(".class-card.checkbox-mode").forEach((card) => {
      const checkbox = card.querySelector(".class-card__checkbox");
      if (checkbox) checkbox.remove();
      card.classList.remove("checkbox-mode", "is-selected");
      card.dataset.checked = "false";
    });
  }

  /* ======================================================================
     🔢 전체 선택 / 개수 업데이트
     ----------------------------------------------------------------------
     ✅ 기능:
     - 전체 선택 버튼 클릭 → 모든 카드 선택/해제
     - 선택 개수와 전체 개수 UI 갱신
     ====================================================================== */
  function toggleAll() {
    const cards = cardWrap.querySelectorAll(".class-card.checkbox-mode");
    const allSelected = [...cards].every((c) =>
      c.classList.contains("is-selected")
    );

    cards.forEach((card) => {
      card.classList.toggle("is-selected", !allSelected);
      card.dataset.checked = !allSelected ? "true" : "false";

      const checkbox = card.querySelector(".class-card__checkbox");
      if (checkbox)
        checkbox.setAttribute("aria-checked", !allSelected ? "true" : "false");
    });

    updateDeleteCount();
  }

  function updateDeleteCount() {
    const selected = cardWrap.querySelectorAll(".class-card.is-selected").length;
    const total = cardWrap.querySelectorAll(".class-card").length;
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
     📣 전역 이벤트: 카드 선택 감지 → 개수 갱신
     ----------------------------------------------------------------------
     ✅ 기능:
     - card-selection-changed 이벤트 발생 시
       삭제 모드일 경우 선택 개수 UI 갱신
     ====================================================================== */
  document.addEventListener("card-selection-changed", () => {
    if (window.isDeleteMode) updateDeleteCount();
  });
});
