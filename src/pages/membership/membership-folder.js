import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";

/* ==========================
   폴더 편집
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const folderListWrap = document.querySelector(".folder-list-wrap");
  if (!folderListWrap) return;

  const folderList = folderListWrap.querySelector(
    ".folder-list-wrap__folder-list"
  );
  const folderEdit = folderListWrap.querySelector(
    ".folder-list-wrap__folder-edit"
  );
  const folderEditList = folderListWrap.querySelector(".folder-edit__list");
  const addFolderBtn = folderListWrap.querySelector(".add-folder-btn");
  const editBtn = folderListWrap.querySelector(".folder-edit-open-btn");
  const foldBtn = folderListWrap.querySelector(".folder-list-fold-btn");

  const headerBtns = folderListWrap.querySelector(
    ".folder-list-wrap__header__btns"
  );

  let cancelBtn = null;
  let saveBtn = null;

  /* --------------------------
     편집 모드 버튼 생성
  -------------------------- */
  function createHeaderButtons() {
    // 취소 버튼
    cancelBtn = document.createElement("button");
    cancelBtn.className = "btn btn--outlined btn--neutral btn--small x-btn";
    cancelBtn.setAttribute("aria-disabled", "false");
    cancelBtn.textContent = "취소";

    // 저장 버튼
    saveBtn = document.createElement("button");
    saveBtn.className = "btn btn--solid btn--primary btn--small save-btn";
    saveBtn.setAttribute("aria-disabled", "false");
    saveBtn.textContent = "저장";

    // 이벤트 등록
    cancelBtn.addEventListener("click", exitEditMode);
    saveBtn.addEventListener("click", exitEditMode);
  }

  /* --------------------------
     편집 모드 진입
  -------------------------- */
  function enterEditMode() {
    folderListWrap.classList.add("editing");
    editBtn.style.display = "none";
    folderList.style.display = "none";
    folderEdit.style.display = "block";
    foldBtn?.classList.add("hidden");

    createHeaderButtons();
    headerBtns.insertBefore(cancelBtn, editBtn);
    headerBtns.insertBefore(saveBtn, editBtn);
  }

  /* --------------------------
     편집 모드 종료
  -------------------------- */
  function exitEditMode() {
    folderListWrap.classList.remove("editing");
    editBtn.style.display = "inline-flex";
    folderList.style.display = "flex";
    folderEdit.style.display = "none";
    foldBtn?.classList.remove("hidden");

    cancelBtn?.remove();
    saveBtn?.remove();
  }

  /* --------------------------
     접힘/펼침 버튼
  -------------------------- */
  function updateUnfoldBtnVisibility() {
    const isFolded = folderListWrap.classList.contains("folding");
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.style.display = isFolded ? "inline-flex" : "none";
    });
  }

  function bindUnfoldEvents() {
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.removeEventListener("click", unfoldClickHandler);
      btn.addEventListener("click", unfoldClickHandler);
    });
  }

  function unfoldClickHandler() {
    folderListWrap.classList.remove("folding");
    folderListWrap.classList.add("unfolding");
    updateUnfoldBtnVisibility();
  }

  /* --------------------------
     초기 상태
  -------------------------- */
  folderEdit.style.display = "none";
  updateUnfoldBtnVisibility();
  bindUnfoldEvents();

  editBtn.addEventListener("click", enterEditMode);

  /* --------------------------
     폴더 추가
  -------------------------- */
  addFolderBtn.addEventListener("click", () => {
    const item = document.createElement("li");
    item.classList.add("folder-edit-item");
    item.dataset.new = "true"; // 새로 추가된 폴더 표시

    const textFieldHtml = createTextField({
      id: `standard-small-folder-name-${Date.now()}`,
      variant: "standard",
      size: "small",
      placeholder: "폴더 이름",
      clearable: true,
    });

    item.innerHTML = `
      <div class="folder-edit__drag-handle">
        <i class="icon--dots-six icon"></i>
      </div>

      <div class="folder-edit-item__row">
        <div class="folder-edit-item__name">
          ${textFieldHtml}
        </div>
        <button
          class="btn btn--ghost btn--neutral btn--small folder-delete-btn"
        >
          삭제
        </button>
      </div>
    `;

    folderEditList.prepend(item);

    // input 포커스
    const input = item.querySelector(".text-field__input");
    input?.focus();

    // text-field.js 초기화 (clear 버튼, padding 등)
    initializeTextFields(item);
  });

  /* --------------------------
     폴더 삭제 / 삭제 취소
  -------------------------- */
  folderEditList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const item = btn.closest(".folder-edit-item");
    const input = item.querySelector(".text-field__input");

    if (btn.classList.contains("folder-delete-btn")) {
      if (item.dataset.new === "true") {
        // 새로 추가한 폴더 → 즉시 삭제
        return item.remove();
      }
      // 기존 폴더 → 삭제 취소 버튼으로 전환
      input.disabled = true;
      item.querySelector(".tailing")?.remove(); // clear 버튼 제거
      btn.textContent = "삭제 취소";
      btn.classList.replace("folder-delete-btn", "folder-undo-btn");
    } else if (btn.classList.contains("folder-undo-btn")) {
      input.disabled = false;
      // clear 버튼 다시 붙여주기
      const tailing = document.createElement("div");
      tailing.classList.add("tailing");
      tailing.innerHTML = `
        <button class="btn--icon-utility btn--icon-only--x" aria-label="입력 내용 삭제">
          <div class="icon--x-circle-fill icon"></div>
        </button>`;
      item.querySelector(".text-field__wrapper").appendChild(tailing);
      btn.textContent = "삭제";
      btn.classList.replace("folder-undo-btn", "folder-delete-btn");

      // clear 버튼 다시 동작하도록 초기화
      initializeTextFields(item);
    }
  });

  /* --------------------------
     드래그 정렬
  -------------------------- */
  if (typeof Sortable !== "undefined" && folderEditList) {
    new Sortable(folderEditList, {
      animation: 250,
      handle: ".folder-edit__drag-handle",
      direction: "vertical",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      forceFallback: true,
      fallbackClass: "hidden",
      fallbackOnBody: false,
    });
  }

  /* --------------------------
     폴더 접기
  -------------------------- */
  foldBtn?.addEventListener("click", () => {
    folderListWrap.classList.add("folding");
    folderListWrap.classList.remove("unfolding");
    updateUnfoldBtnVisibility();
  });
});
