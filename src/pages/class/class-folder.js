/**
 * ======================================================================
 * 🧩 folder-edit.js — 폴더 관리 / 편집 / 정렬 스크립트
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 폴더 리스트의 접기·펼치기 상태 제어
 * - 폴더 편집(추가 / 삭제 / 이름변경 / 순서변경)
 * - Sortable.js 기반 드래그 정렬 지원
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 폴더 편집 모드 토글 (보기 ↔ 편집)
 * 2️⃣ 폴더 추가 / 삭제 / 삭제취소
 * 3️⃣ 접기 / 펼치기 상태 동기화
 * 4️⃣ Sortable.js를 통한 드래그 정렬
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-folder-list>` 컴포넌트로 구현 가능
 *   → @Input() folders 데이터 전달
 *   → @Output() folderUpdated 이벤트로 변경 감지
 * - 편집 모드 토글은 [editing] 상태변수로 양방향 바인딩
 * - Sortable.js 부분은 Angular CDK DragDrop 모듈로 대체 가능
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - folder-list.scss / text-field.scss / button.scss / sortable 관련 스타일
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 유틸)
   ====================================================================== */
import { createTextField } from "../../components/text-field/create-text-field.js";
import { initializeTextFields } from "../../components/text-field/text-field.js";

/* ======================================================================
   📁 폴더 편집 로직
   ----------------------------------------------------------------------
   ✅ 기능 개요:
   - 폴더 영역(.folder-list-wrap) 내부에서 목록/편집 전환 및 상태관리 수행
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const folderListWrap = document.querySelector(".folder-list-wrap");
  if (!folderListWrap) return;

  // 주요 요소 캐싱
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
     🧱 편집 모드 버튼 생성
     ----------------------------------------------------------------------
     ✅ 설명:
     - "취소" / "저장" 버튼을 동적으로 생성하여 헤더에 삽입
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

    // 이벤트 등록
    cancelBtn.addEventListener("click", exitEditMode);
    saveBtn.addEventListener("click", exitEditMode);
  }

  /* ======================================================================
     ✏️ 편집 모드 진입
     ----------------------------------------------------------------------
     ✅ 동작:
     - 목록 숨기고 편집 영역 표시
     - 버튼 교체 및 스타일 상태 변경
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
     💾 편집 모드 종료
     ----------------------------------------------------------------------
     ✅ 동작:
     - 편집 모드 해제 및 UI 복원
     - 동적 버튼 제거
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
     📂 접힘 / 펼침 버튼 관리
     ----------------------------------------------------------------------
     ✅ 설명:
     - folding/unfolding 클래스 상태에 따라 버튼 표시 전환
     - 각 unfold 버튼에 이벤트 재바인딩
     ====================================================================== */
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

  /* ======================================================================
     🧾 초기 상태 설정
     ====================================================================== */
  folderEdit.style.display = "none";
  updateUnfoldBtnVisibility();
  bindUnfoldEvents();

  // 편집 버튼 클릭 시 편집 모드 진입
  editBtn.addEventListener("click", enterEditMode);

  /* ======================================================================
     ➕ 폴더 추가
     ----------------------------------------------------------------------
     ✅ 동작:
     - 새 폴더 li 생성 → 입력 필드 포함
     - text-field.js 기능 초기화 (clear 버튼 등)
     ====================================================================== */
  addFolderBtn.addEventListener("click", () => {
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

    // text-field.js 초기화 (clear, padding 등)
    initializeTextFields(item);
  });

  /* ======================================================================
     🗑️ 폴더 삭제 / 삭제 취소
     ----------------------------------------------------------------------
     ✅ 동작:
     - 신규 폴더 → 즉시 삭제
     - 기존 폴더 → “삭제취소” 버튼으로 전환
     ====================================================================== */
  folderEditList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const item = btn.closest(".folder-edit-item");
    const input = item.querySelector(".text-field__input");

    // 삭제 클릭
    if (btn.classList.contains("folder-delete-btn")) {
      if (item.dataset.new === "true") {
        // 새로 추가한 폴더는 즉시 삭제
        return item.remove();
      }

      // 기존 폴더 → 삭제취소 상태로 전환
      input.disabled = true;
      item.querySelector(".tailing")?.remove(); // clear 버튼 제거
      btn.textContent = "삭제 취소";
      btn.classList.replace("folder-delete-btn", "folder-undo-btn");
    }
    // 삭제 취소 클릭
    else if (btn.classList.contains("folder-undo-btn")) {
      input.disabled = false;

      // clear 버튼 다시 추가
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

  /* ======================================================================
     ↕️ 드래그 정렬 (Sortable.js)
     ----------------------------------------------------------------------
     ✅ 설명:
     - 폴더 순서 변경을 위한 드래그 인터랙션
     - forceFallback 옵션으로 모바일 호환성 개선
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
     📘 폴더 접기
     ----------------------------------------------------------------------
     ✅ 설명:
     - 접힘(folding) 상태 추가 → UI 숨김
     - unfolding 해제 시 다시 표시
     ====================================================================== */
  foldBtn?.addEventListener("click", () => {
    folderListWrap.classList.add("folding");
    folderListWrap.classList.remove("unfolding");
    updateUnfoldBtnVisibility();
  });
});
