import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";

/* ==========================
   📁 락커 폴더 편집/검색/정렬 + 접기/펼치기
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const folderListWrap = document.querySelector(".folder-list-wrap");
  if (!folderListWrap) return;

  // --------------------------
  // 주요 엘리먼트
  // --------------------------
  const editBtn = folderListWrap.querySelector(".folder-edit-open-btn");
  const foldBtn = folderListWrap.querySelector(".folder-list-fold-btn");
  const searchOpenBtn = folderListWrap.querySelector(".locker-search-open-btn");
  const searchWrap = folderListWrap.querySelector(
    ".folder-list-wrap__search-wrap"
  );
  const searchCloseBtn = searchWrap?.querySelector(".locker-search-close-btn");
  const searchInput = searchWrap?.querySelector(".text-field__input");

  const folderList = folderListWrap.querySelector(
    ".folder-list-wrap__folder-list"
  );
  const folderEdit = folderListWrap.querySelector(
    ".folder-list-wrap__folder-edit"
  );
  const folderEditList = folderListWrap.querySelector(".folder-edit__list");
  const addFolderBtn = folderListWrap.querySelector(".add-folder-btn");

  const unfoldBtns = document.querySelectorAll(".folder-list-unfold-btn");
  const headerBtns = folderListWrap.querySelector(
    ".folder-list-wrap__header__btns"
  );

  let cancelBtn = null;
  let saveBtn = null;

  /* --------------------------
     공통 초기화
  -------------------------- */
  const clearState = () => {
    folderListWrap.classList.remove("editing", "searching");
    editBtn.style.display = "inline-flex";
    foldBtn.style.display = "inline-flex";
    searchOpenBtn.style.display = "inline-flex";
    folderList.style.display = "flex";
    folderEdit.style.display = "none";
    searchWrap.style.display = "none";
    cancelBtn?.remove();
    saveBtn?.remove();
  };

  const updateUnfoldBtnVisibility = () => {
    const isFolded = folderListWrap.classList.contains("folding");
    unfoldBtns.forEach((btn) => {
      btn.style.display = isFolded ? "inline-flex" : "none";
    });
  };

  /* --------------------------
     편집 모드
  -------------------------- */
  const createHeaderButtons = () => {
    cancelBtn = document.createElement("button");
    cancelBtn.className = "btn btn--outlined btn--neutral btn--small x-btn";
    cancelBtn.textContent = "취소";

    saveBtn = document.createElement("button");
    saveBtn.className = "btn btn--solid btn--primary btn--small save-btn";
    saveBtn.textContent = "저장";

    cancelBtn.addEventListener("click", exitEditMode);
    saveBtn.addEventListener("click", exitEditMode);
  };

  function enterEditMode() {
    clearState();
    folderListWrap.classList.add("editing");

    editBtn.style.display = "none";
    foldBtn.style.display = "none";
    searchOpenBtn.style.display = "none";
    folderList.style.display = "none";
    folderEdit.style.display = "block";

    createHeaderButtons();
    headerBtns.insertBefore(cancelBtn, editBtn);
    headerBtns.insertBefore(saveBtn, editBtn);
  }

  function exitEditMode() {
    clearState();
  }

  /* --------------------------
     검색 모드
  -------------------------- */
  function openSearch() {
    clearState();
    folderListWrap.classList.add("searching");

    editBtn.style.display = "none";
    searchOpenBtn.style.display = "none";

    folderList.style.display = "none";
    folderEdit.style.display = "none";
    searchWrap.style.display = "flex";
    searchInput?.focus();
  }

  function closeSearch() {
    clearState();
  }

  /* --------------------------
     접기 / 펼치기
  -------------------------- */
  foldBtn?.addEventListener("click", () => {
    folderListWrap.classList.add("folding");
    folderListWrap.classList.remove("unfolding");
    updateUnfoldBtnVisibility();
  });

  unfoldBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      folderListWrap.classList.remove("folding");
      folderListWrap.classList.add("unfolding");
      updateUnfoldBtnVisibility();
    });
  });

  /* --------------------------
     폴더 추가
  -------------------------- */
  addFolderBtn?.addEventListener("click", () => {
    const item = document.createElement("li");
    item.classList.add("folder-edit-item");
    item.dataset.new = "true"; // 새 폴더 표시

    const textFieldHtml = createTextField({
      id: `standard-small-folder-name-${Date.now()}`,
      variant: "standard",
      size: "small",
      placeholder: "폴더 이름",
      clearable: true,
    });

    item.innerHTML = `
      <div class="folder-edit__drag-handle"><i class="icon--dots-six icon"></i></div>
      <div class="folder-edit-item__row">
        <div class="folder-edit-item__name">
          ${textFieldHtml}
        </div>
        <button class="btn btn--ghost btn--neutral btn--small folder-delete-btn">삭제</button>
      </div>`;

    folderEditList.prepend(item);

    const input = item.querySelector(".text-field__input");
    input?.focus();
    initializeTextFields(item);
  });

  /* --------------------------
     삭제 / 삭제 취소
  -------------------------- */
  folderEditList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const item = btn.closest(".folder-edit-item");
    const input = item.querySelector(".text-field__input");

    if (btn.classList.contains("folder-delete-btn")) {
      if (item.dataset.new === "true") return item.remove();

      input.disabled = true;
      item.querySelector(".tailing")?.remove();
      btn.textContent = "삭제 취소";
      btn.classList.replace("folder-delete-btn", "folder-undo-btn");
    } else if (btn.classList.contains("folder-undo-btn")) {
      input.disabled = false;
      const tailing = document.createElement("div");
      tailing.classList.add("tailing");
      tailing.innerHTML = `
        <button class="btn--icon-utility btn--icon-only--x" aria-label="입력 내용 삭제">
          <div class="icon--x-circle-fill icon"></div>
        </button>`;
      item.querySelector(".text-field__wrapper").appendChild(tailing);
      btn.textContent = "삭제";
      btn.classList.replace("folder-undo-btn", "folder-delete-btn");
      initializeTextFields(item);
    }
  });

  /* --------------------------
     드래그 정렬
  -------------------------- */
  if (typeof Sortable !== "undefined") {
    new Sortable(folderEditList, {
      animation: 250,
      handle: ".folder-edit__drag-handle",
      direction: "vertical",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      forceFallback: true,
      fallbackClass: "hidden",
    });
  }

  /* --------------------------
     초기화
  -------------------------- */
  folderEdit.style.display = "none";
  searchWrap.style.display = "none";
  updateUnfoldBtnVisibility();

  editBtn?.addEventListener("click", enterEditMode);
  searchOpenBtn?.addEventListener("click", openSearch);
  searchCloseBtn?.addEventListener("click", closeSearch);

  /* ================================
     🔍 락커 검색 결과 접기/펼치기
     (탭 렌더 이후 실행)
  ================================= */
  document.addEventListener("tab-updated", (e) => {
    const panel = e.detail.panelEl;
    if (!panel) return;

    const groupTitles = panel.querySelectorAll(
      ".locker-search__result-list-group-title"
    );
    groupTitles.forEach((title) => {
      title.removeEventListener("click", toggleLockerGroup);
      title.addEventListener("click", toggleLockerGroup);
    });
  });

  function toggleLockerGroup(e) {
    const title = e.currentTarget;
    const group = title.closest(".locker-search__result-list-group");
    const list = group.querySelector(".locker-search__result-list");
    const icon = title.querySelector(".icon");
    if (!list) return;

    const isCollapsed = group.classList.toggle("collapsed");

    if (isCollapsed) {
      list.style.maxHeight = "0";
      list.style.overflow = "hidden";
      icon.style.transform = "rotate(180deg)";
    } else {
      list.style.maxHeight = list.scrollHeight + "px";
      icon.style.transform = "rotate(0deg)";
    }
  }
});
