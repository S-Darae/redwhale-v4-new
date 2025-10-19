/* ======================================================================
   🔹 Import (필요한 컴포넌트 / 모듈)
   ----------------------------------------------------------------------
   - createTextField : 공통 텍스트필드 생성 유틸
   - initializeTextFields : 텍스트필드 내부 clear 버튼 등 재초기화
   ====================================================================== */
import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";

/* ======================================================================
   📁 락커 폴더 편집 / 검색 / 정렬 / 접기·펼치기 관리
   ----------------------------------------------------------------------
   - 편집 모드 진입 / 취소
   - 폴더 추가, 삭제, 정렬
   - 검색 모드 토글
   - 폴더 리스트 접기 / 펼치기
   - 락커 검색 결과 그룹 접기 / 펼치기 (탭 렌더 이후)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const folderListWrap = document.querySelector(".folder-list-wrap");
  if (!folderListWrap) return;

  /* --------------------------------------------------
     📌 주요 엘리먼트 수집
     -------------------------------------------------- */
  const editBtn = folderListWrap.querySelector(".folder-edit-open-btn");
  const foldBtn = folderListWrap.querySelector(".folder-list-fold-btn");
  const searchOpenBtn = folderListWrap.querySelector(".locker-search-open-btn");
  const searchWrap = folderListWrap.querySelector(".folder-list-wrap__search-wrap");
  const searchCloseBtn = searchWrap?.querySelector(".locker-search-close-btn");
  const searchInput = searchWrap?.querySelector(".text-field__input");

  const folderList = folderListWrap.querySelector(".folder-list-wrap__folder-list");
  const folderEdit = folderListWrap.querySelector(".folder-list-wrap__folder-edit");
  const folderEditList = folderListWrap.querySelector(".folder-edit__list");
  const addFolderBtn = folderListWrap.querySelector(".add-folder-btn");

  const unfoldBtns = document.querySelectorAll(".folder-list-unfold-btn");
  const headerBtns = folderListWrap.querySelector(".folder-list-wrap__header__btns");

  let cancelBtn = null;
  let saveBtn = null;

  /* ======================================================================
     1️⃣ 공통 초기화
     ----------------------------------------------------------------------
     - 모든 모드(편집/검색 등) 종료 후 기본 상태로 복귀
     - 접기 버튼, 헤더 버튼 상태 초기화
     ====================================================================== */
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

  /* ======================================================================
     2️⃣ 편집 모드
     ----------------------------------------------------------------------
     - ‘편집’ 버튼 클릭 시 진입
     - 취소 / 저장 버튼 생성 및 삽입
     - 폴더명 편집 및 드래그 정렬 가능
     ====================================================================== */
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

  /* ======================================================================
     3️⃣ 검색 모드
     ----------------------------------------------------------------------
     - ‘검색’ 버튼 클릭 시 입력창 표시
     - 검색 닫기 버튼으로 종료
     ====================================================================== */
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

  /* ======================================================================
     4️⃣ 폴더 접기 / 펼치기
     ----------------------------------------------------------------------
     - foldBtn 클릭 → 접힘 상태
     - unfoldBtns 클릭 → 펼침 상태
     - 상태에 따라 버튼 노출 제어
     ====================================================================== */
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

  /* ======================================================================
     5️⃣ 폴더 추가 기능
     ----------------------------------------------------------------------
     - “+ 폴더 추가” 버튼 클릭 시 입력 필드 추가
     - 새 폴더는 dataset.new = true 로 표시
     - 생성 즉시 포커스 및 text-field 초기화
     ====================================================================== */
  addFolderBtn?.addEventListener("click", () => {
    const item = document.createElement("li");
    item.classList.add("folder-edit-item");
    item.dataset.new = "true";

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
        <div class="folder-edit-item__name">${textFieldHtml}</div>
        <button class="btn btn--ghost btn--neutral btn--small folder-delete-btn">삭제</button>
      </div>`;

    folderEditList.prepend(item);

    const input = item.querySelector(".text-field__input");
    input?.focus();
    initializeTextFields(item);
  });

  /* ======================================================================
     6️⃣ 폴더 삭제 / 삭제 취소
     ----------------------------------------------------------------------
     - 새 폴더는 즉시 삭제
     - 기존 폴더는 ‘삭제 취소’ 버튼으로 복원 가능
     - clear 버튼 동작 재등록
     ====================================================================== */
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

      // clear 버튼 다시 생성
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

  /* ======================================================================
     7️⃣ 드래그 정렬
     ----------------------------------------------------------------------
     - Sortable.js 존재 시 활성화
     - 폴더 순서 변경 가능
     ====================================================================== */
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

  /* ======================================================================
     8️⃣ 초기화
     ----------------------------------------------------------------------
     - 초기에 편집/검색 영역 숨김
     - 버튼 및 이벤트 바인딩
     ====================================================================== */
  folderEdit.style.display = "none";
  searchWrap.style.display = "none";
  updateUnfoldBtnVisibility();

  editBtn?.addEventListener("click", enterEditMode);
  searchOpenBtn?.addEventListener("click", openSearch);
  searchCloseBtn?.addEventListener("click", closeSearch);

  /* ======================================================================
     9️⃣ 락커 검색 결과 접기 / 펼치기 (탭 렌더 이후)
     ----------------------------------------------------------------------
     - tab-updated 이벤트 발생 시 실행
     - 그룹별 리스트 접기/펼치기 애니메이션
     ====================================================================== */
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
