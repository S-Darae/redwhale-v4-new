/* ======================================================================
   📦 folder-edit.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “폴더 편집” 인터페이스 제어 (추가, 삭제, 정렬, 접기/펼치기 등)
   - TextField 기반 폴더명 편집 + Sortable.js 드래그 정렬 지원
   - 편집 모드 전환 시 헤더 버튼 교체 및 상태 관리
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 폴더 리스트 → @Input() folders: Folder[]
   - enterEditMode / exitEditMode → @Output() editModeChange.emit()
   - Sortable → cdkDragDrop 기반으로 대체 가능
   ====================================================================== */

import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";

/* ======================================================================
   🧱 폴더 편집 로직
   ----------------------------------------------------------------------
   ✅ 주요 기능:
   - 편집 모드 진입/종료
   - 폴더 추가 / 삭제 / 정렬
   - 접힘 / 펼침 상태 토글
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------
  // 📍 주요 요소
  // -------------------------------------
  const folderListWrap = document.querySelector(".folder-list-wrap");
  if (!folderListWrap) return;

  const folderList = folderListWrap.querySelector(".folder-list-wrap__folder-list");
  const folderEdit = folderListWrap.querySelector(".folder-list-wrap__folder-edit");
  const folderEditList = folderListWrap.querySelector(".folder-edit__list");
  const addFolderBtn = folderListWrap.querySelector(".add-folder-btn");
  const editBtn = folderListWrap.querySelector(".folder-edit-open-btn");
  const foldBtn = folderListWrap.querySelector(".folder-list-fold-btn");

  const headerBtns = folderListWrap.querySelector(".folder-list-wrap__header__btns");

  let cancelBtn = null;
  let saveBtn = null;

  /* ======================================================================
     ✏️ 편집 모드 버튼 생성
     ----------------------------------------------------------------------
     - “편집” 클릭 시 표시되는 “취소 / 저장” 버튼을 동적으로 생성
     ====================================================================== */
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

    // 클릭 시 편집 종료
    cancelBtn.addEventListener("click", exitEditMode);
    saveBtn.addEventListener("click", exitEditMode);
  }

  /* ======================================================================
     🔧 편집 모드 진입
     ----------------------------------------------------------------------
     - 폴더 목록 숨김 → 폴더 편집 UI 표시
     - 헤더에 취소/저장 버튼 삽입
     ====================================================================== */
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

  /* ======================================================================
     ✅ 편집 모드 종료
     ----------------------------------------------------------------------
     - 폴더 편집 숨김 → 폴더 목록 다시 표시
     - 취소/저장 버튼 제거
     ====================================================================== */
  function exitEditMode() {
    folderListWrap.classList.remove("editing");
    editBtn.style.display = "inline-flex";
    folderList.style.display = "flex";
    folderEdit.style.display = "none";
    foldBtn?.classList.remove("hidden");

    cancelBtn?.remove();
    saveBtn?.remove();
  }

  /* ======================================================================
     📂 접힘 / 펼침 버튼 제어
     ----------------------------------------------------------------------
     - 폴더 리스트가 접혔는지(folding) 상태에 따라
       “펼치기 버튼”(.folder-list-unfold-btn) 표시 여부 업데이트
     ====================================================================== */
  function updateUnfoldBtnVisibility() {
    const isFolded = folderListWrap.classList.contains("folding");
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.style.display = isFolded ? "inline-flex" : "none";
    });
  }

  /* ======================================================================
     🔄 펼침 버튼 이벤트 등록
     ====================================================================== */
  function bindUnfoldEvents() {
    document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
      btn.removeEventListener("click", unfoldClickHandler);
      btn.addEventListener("click", unfoldClickHandler);
    });
  }

  /* ======================================================================
     📤 펼침 버튼 클릭 시 동작
     ====================================================================== */
  function unfoldClickHandler() {
    folderListWrap.classList.remove("folding");
    folderListWrap.classList.add("unfolding");
    updateUnfoldBtnVisibility();
  }

  /* ======================================================================
     ⚙️ 초기 상태 설정
     ----------------------------------------------------------------------
     - 편집 영역 숨김
     - 접힘 상태 버튼 초기화
     ====================================================================== */
  folderEdit.style.display = "none";
  updateUnfoldBtnVisibility();
  bindUnfoldEvents();

  editBtn.addEventListener("click", enterEditMode);

  /* ======================================================================
     ➕ 폴더 추가
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - “추가” 버튼 클릭 시 새 li.folder-edit-item 생성
     - createTextField()로 입력 필드 삽입
     - TextField 초기화 및 포커스
     ====================================================================== */
  addFolderBtn.addEventListener("click", () => {
    const item = document.createElement("li");
    item.classList.add("folder-edit-item");
    item.dataset.new = "true"; // 새 폴더 여부 표시

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

    // 입력창 포커스
    const input = item.querySelector(".text-field__input");
    input?.focus();

    // text-field.js 초기화 (clear 버튼, padding 등)
    initializeTextFields(item);
  });

  /* ======================================================================
     🗑 폴더 삭제 / 삭제 취소
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - 새 폴더 → 즉시 삭제
     - 기존 폴더 → 비활성화 후 “삭제 취소” 버튼으로 전환
     - 삭제 취소 시 다시 활성화 + clear 버튼 복원
     ====================================================================== */
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

      // 기존 폴더 → 비활성화 처리 + 삭제 취소 버튼으로 변경
      input.disabled = true;
      item.querySelector(".tailing")?.remove(); // clear 버튼 제거
      btn.textContent = "삭제 취소";
      btn.classList.replace("folder-delete-btn", "folder-undo-btn");
    } else if (btn.classList.contains("folder-undo-btn")) {
      // 삭제 취소 → 다시 활성화
      input.disabled = false;

      // clear 버튼 다시 붙이기
      const tailing = document.createElement("div");
      tailing.classList.add("tailing");
      tailing.innerHTML = `
        <button class="btn--icon-utility btn--icon-only--x" aria-label="입력 내용 삭제">
          <div class="icon--x-circle-fill icon"></div>
        </button>`;
      item.querySelector(".text-field__wrapper").appendChild(tailing);

      btn.textContent = "삭제";
      btn.classList.replace("folder-undo-btn", "folder-delete-btn");

      // clear 버튼 이벤트 복원
      initializeTextFields(item);
    }
  });

  /* ======================================================================
     ↕️ 드래그 정렬
     ----------------------------------------------------------------------
     ✅ 조건:
     - Sortable.js가 로드되어 있을 경우에만 작동
     - drag handle(.folder-edit__drag-handle) 기준으로 이동 가능
     ====================================================================== */
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

  /* ======================================================================
     📕 폴더 접기
     ----------------------------------------------------------------------
     ✅ 동작 요약:
     - “접기” 버튼 클릭 시 folding 클래스 추가
     - 펼침 버튼 표시 상태 갱신
     ====================================================================== */
  foldBtn?.addEventListener("click", () => {
    folderListWrap.classList.add("folding");
    folderListWrap.classList.remove("unfolding");
    updateUnfoldBtnVisibility();
  });
});
