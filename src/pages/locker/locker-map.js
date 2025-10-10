/* ==========================================================
   락커 배치 모드 (Locker Map Editor)
   - 셀 단위로 락커를 배치/선택/미리보기/번호부여
   - 드래그 & 드롭으로 락커 이동 및 수정 가능
   - 방향(행/열 반전), 자동 스크롤, 자동 확장 지원
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ==========================
     기본 설정 / 요소 참조
     ========================== */
  const CELL_SIZE = 80; // 각 셀 크기(px)
  let totalCols = 35; // 초기 열 개수
  let totalRows = 20; // 초기 행 개수

  const grid = document.querySelector(".grid-bg"); // 락커 배치 그리드
  const label = document.getElementById("selection-label"); // 선택 영역 라벨
  const popover = document.getElementById("lockermap-popover"); // 락커 추가 팝오버
  const clearBtn = document.getElementById("clear-selection-btn"); // 선택 해제 버튼
  const singleView = popover.querySelector(".lockermap-popover__single");
  const multiView = popover.querySelector(".lockermap-popover__multi");

  // 방향 전환 컨트롤러
  const rowReverseBtn = document.querySelector(
    ".locker-direction-row-reverse-btn"
  );
  const columnReverseBtn = document.querySelector(
    ".locker-direction-column-reverse-btn"
  );
  const rowStart = document.querySelector(".locker-direction__row-start");
  const rowEnd = document.querySelector(".locker-direction__row-end");
  const columnStart = document.querySelector(".locker-direction__column-start");
  const columnEnd = document.querySelector(".locker-direction__column-end");

  /* ==========================
     상태 변수
     ========================== */
  let selectedCellsCache = []; // 현재 선택된 셀 목록
  const dirState = { rowReversed: false, colReversed: false }; // 방향 반전 상태
  let startX = null,
    startY = null,
    endX = null,
    endY = null;
  let isPopoverOpen = false; // 추가 팝오버 열림 여부
  let isSelecting = false; // 드래그 선택 중 여부

  /* ==========================
     유틸 함수
     ========================== */
  function createCell(x, y) {
    // 좌표(x,y)를 가진 셀 생성
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    return cell;
  }

  // 전체 그리드 재생성
  function rebuildGrid() {
    grid.innerHTML = "";
    for (let y = 0; y < totalRows; y++) {
      for (let x = 0; x < totalCols; x++) {
        grid.appendChild(createCell(x, y));
      }
    }
    grid.style.gridTemplateColumns = `repeat(${totalCols}, ${CELL_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${totalRows}, ${CELL_SIZE}px)`;
  }

  // 스크롤 위치 유지하며 그리드 재생성
  function rebuildGridPreserveScroll() {
    const container = grid.parentElement;
    const prevScrollLeft = container.scrollLeft;
    const prevScrollTop = container.scrollTop;
    rebuildGrid();
    container.scrollLeft = prevScrollLeft;
    container.scrollTop = prevScrollTop;
  }

  // 모든 셀의 프리뷰 초기화
  function clearPreview() {
    grid
      .querySelectorAll(".grid-cell .cell-preview")
      .forEach((el) => el.remove());
  }

  // 방향 설정(row/col 반전)에 맞게 셀 정렬
  function getOrderedCells(cells) {
    const byRow = new Map();
    cells.forEach((cell) => {
      const y = +cell.dataset.y;
      if (!byRow.has(y)) byRow.set(y, []);
      byRow.get(y).push(cell);
    });

    const rows = Array.from(byRow.keys()).sort((a, b) =>
      dirState.colReversed ? b - a : a - b
    );

    const ordered = [];
    rows.forEach((y) => {
      const rowCells = byRow.get(y).sort((a, b) => {
        const ax = +a.dataset.x,
          bx = +b.dataset.x;
        return dirState.rowReversed ? bx - ax : ax - bx;
      });
      ordered.push(...rowCells);
    });

    return ordered;
  }

  // 선택 라벨의 크기 정보 표시 복원
  function showLabelSizeInfo() {
    const sizeDiv = label.querySelector(".label-size-info");
    const lastBadge = label.querySelector(".cell-preview--last");
    if (sizeDiv) sizeDiv.style.display = "";
    if (lastBadge) {
      lastBadge.style.display = "none";
      lastBadge.textContent = "";
    }
  }

  // 시작 번호 입력창 초기화
  function resetStartNumberInput() {
    const startInput = popover.querySelector(".locker-start-number-input");
    if (startInput) startInput.value = "";
  }

  // 팝오버 닫기 + 선택 초기화
  function closePopoverAndClear({ resetStart = true } = {}) {
    popover.style.display = "none";
    isPopoverOpen = false;
    if (resetStart) resetStartNumberInput();
    clearPreview();
    showLabelSizeInfo();
  }

  /* ==========================
     선택 영역 / 미리보기 렌더링
     ========================== */

  // 시작번호 입력값 기반으로 미리보기 숫자 갱신
  function renderPreviewFromStartInput() {
    if (!isPopoverOpen) {
      clearPreview();
      showLabelSizeInfo();
      return;
    }

    const startInput = popover.querySelector(".locker-start-number-input");
    const raw = (startInput?.value || "").trim();

    const sizeDiv = label.querySelector(".label-size-info");
    let lastBadge = label.querySelector(".cell-preview--last");
    if (!lastBadge) {
      lastBadge = document.createElement("span");
      lastBadge.className = "cell-preview cell-preview--last";
      lastBadge.style.display = "none";
      label.appendChild(lastBadge);
    }

    // 표시 함수 분리
    const showSize = () => {
      if (sizeDiv) sizeDiv.style.display = "";
      lastBadge.style.display = "none";
      lastBadge.textContent = "";
    };
    const showLast = (text) => {
      if (sizeDiv) sizeDiv.style.display = "none";
      lastBadge.textContent = String(text);
      lastBadge.style.display = "";
    };

    if (raw === "") {
      clearPreview();
      showSize();
      return;
    }

    // 숫자 부분만 추출
    const m = raw.match(/(\d+)(?!.*\d)/);
    if (!m) {
      clearPreview();
      showSize();
      return;
    }

    // 접두사 / 숫자 / 접미사 분리
    const numStr = m[1];
    const startNum = parseInt(numStr, 10);
    const prefix = raw.slice(0, m.index);
    const suffix = raw.slice(m.index + numStr.length);
    const padLen = numStr.startsWith("0") ? numStr.length : 0;
    const fmt = (n) => (padLen ? String(n).padStart(padLen, "0") : String(n));

    clearPreview();
    if (!selectedCellsCache.length) {
      showSize();
      return;
    }

    const ordered = getOrderedCells(selectedCellsCache);

    // 각 셀에 번호 미리보기 생성
    ordered.forEach((cell, i) => {
      let badge = cell.querySelector(".cell-preview");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cell-preview";
        cell.appendChild(badge);
      }
      badge.textContent = `${prefix}${fmt(startNum + i)}${suffix}`;
    });

    // 마지막 셀 번호 라벨 표시
    let idx = ordered.findIndex(
      (c) => +c.dataset.x === endX && +c.dataset.y === endY
    );
    if (idx < 0) idx = ordered.length - 1;
    const textForEndCell = `${prefix}${fmt(startNum + idx)}${suffix}`;
    showLast(textForEndCell);
  }

  /* ==========================
     선택 초기화
     ========================== */
  function clearSelection() {
    document.querySelectorAll(".grid-cell").forEach((el) => {
      el.classList.remove("selected", "start-cell", "last-cell");
    });
    label.style.display = "none";
    label.innerHTML = "";
    clearBtn.style.display = "none";
    startX = null;
    startY = null;
    isPopoverOpen = false;
    isSelecting = false;
    popover.style.display = "none";
    clearPreview();
  }

  /* ==========================
     선택 사각형 렌더링
     ========================== */
  function selectRect(x1, y1, x2, y2) {
    const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)];

    // 선택 영역 표시
    document.querySelectorAll(".grid-cell").forEach((el) => {
      const x = +el.dataset.x;
      const y = +el.dataset.y;
      el.classList.remove("selected", "start-cell", "last-cell");
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        el.classList.add("selected");
        if (x === startX && y === startY) el.classList.add("start-cell");
        if (x === x2 && y === y2) el.classList.add("last-cell");
      }
    });

    // 선택 크기 계산
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    endX = x2;
    endY = y2;

    // 라벨 위치 계산
    const lastCell = document.querySelector(
      `.grid-cell[data-x="${x2}"][data-y="${y2}"]`
    );
    const rect = lastCell.getBoundingClientRect();
    const containerRect = grid.getBoundingClientRect();
    const offsetX = rect.left - containerRect.left + grid.scrollLeft;
    const offsetY = rect.top - containerRect.top + grid.scrollTop;

    // 라벨 표시
    label.style.left = `${offsetX}px`;
    label.style.top = `${offsetY}px`;
    label.style.display = "flex";
    label.innerHTML = `
      <div class="label-size-info">${width} × ${height}</div>
      <span class="cell-preview cell-preview--last" style="display:none"></span>
      <button class="btn btn--outlined btn--neutral btn--small" id="inner-add-locker-btn">
        ${width * height}개 <i class="icon--plus icon"></i>
      </button>
    `;

    // 해제 버튼 위치
    clearBtn.style.left = `${offsetX + 8}px`;
    clearBtn.style.top = `${offsetY + CELL_SIZE}px`;
    clearBtn.style.display = "inline-flex";

    // 선택 셀 캐시 업데이트
    selectedCellsCache = Array.from(
      document.querySelectorAll(".grid-cell.selected")
    );

    // “추가” 버튼 클릭 → 팝오버 열기
    document
      .getElementById("inner-add-locker-btn")
      ?.addEventListener("click", () => {
        if (!selectedCellsCache.length) return;
        openLockerPopover(selectedCellsCache);
      });

    // 기존 입력값 존재 시 즉시 미리보기 갱신
    const startInput = popover.querySelector(".locker-start-number-input");
    if (startInput?.value.trim()) renderPreviewFromStartInput();
  }

  /* ==========================
     팝오버 외부 클릭 닫기 / 전체 선택 해제
     ========================== */
  document.addEventListener("click", (e) => {
    if (!isPopoverOpen) return;
    const isInsidePopover = popover.contains(e.target);
    const isInsideLabel = label.contains(e.target);
    const isGridCell = e.target.closest(".grid-cell");

    if (!isInsidePopover && !isInsideLabel) closePopoverAndClear();
    if (!isGridCell && !isInsidePopover && !isInsideLabel) clearSelection();
  });

  /* ==========================
     추가 버튼 수량 갱신
     ========================== */
  function updateAddButtonCount() {
    const count = document.querySelectorAll(".grid-cell.selected").length;
    const singleBtn = document.querySelector(
      ".lockermap-popover-single__submit"
    );
    const multiBtn = document.querySelector(".lockermap-popover-multi__submit");
    if (count === 1 && singleBtn) singleBtn.textContent = "추가";
    else if (count > 1 && multiBtn) multiBtn.textContent = `${count}개 추가`;
  }

  /* ==========================
     📦 락커 추가 팝오버 열기
     ========================== */
  function openLockerPopover(selectedCells) {
    isPopoverOpen = true;
    const isSingle = selectedCells.length === 1;
    singleView.style.display = isSingle ? "block" : "none";
    multiView.style.display = isSingle ? "none" : "block";

    const triggerBtn = document.getElementById("inner-add-locker-btn");
    if (!triggerBtn) return;

    // 위치 계산용 임시 표시
    popover.style.display = "block";
    popover.style.visibility = "hidden";

    const btnRect = triggerBtn.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const spacing = 8;
    let left = btnRect.right + spacing;
    let top = btnRect.top + window.scrollY;

    // 화면 밖 방지 보정
    if (left + popoverRect.width > window.innerWidth - spacing)
      left = btnRect.left - popoverRect.width - spacing;
    if (
      top + popoverRect.height >
      window.innerHeight + window.scrollY - spacing
    )
      top = window.innerHeight + window.scrollY - popoverRect.height - spacing;
    if (top < window.scrollY + spacing) top = window.scrollY + spacing;

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.visibility = "visible";

    // 입력 초기화
    const startInput = popover.querySelector(".locker-start-number-input");
    if (startInput) startInput.value = "";
    clearPreview();
    showLabelSizeInfo();

    // 미리보기 실시간 갱신 리스너
    startInput?.removeEventListener("input", renderPreviewFromStartInput);
    startInput?.addEventListener("input", renderPreviewFromStartInput, {
      passive: true,
    });

    renderPreviewFromStartInput();

    // 자동 포커스
    requestAnimationFrame(() => {
      const input = isSingle
        ? singleView.querySelector("input")
        : multiView.querySelector(".locker-start-number-input") ||
          multiView.querySelector("input");
      input?.focus();
    });

    updateAddButtonCount();
  }

  /* ==========================
     팝오버 닫기 버튼
     ========================== */
  popover
    .querySelector(".lockermap-popover__close")
    ?.addEventListener("click", () => closePopoverAndClear());

  /* ==========================
     방향 토글 (행/열 반전)
     ========================== */
  rowReverseBtn?.addEventListener("click", () => {
    if (rowStart.textContent === "왼쪽") {
      rowStart.textContent = "오른쪽";
      rowEnd.textContent = "왼쪽";
    } else {
      rowStart.textContent = "왼쪽";
      rowEnd.textContent = "오른쪽";
    }
    dirState.rowReversed = !dirState.rowReversed;
    renderPreviewFromStartInput();
  });

  columnReverseBtn?.addEventListener("click", () => {
    if (columnStart.textContent === "위") {
      columnStart.textContent = "아래";
      columnEnd.textContent = "위";
    } else {
      columnStart.textContent = "위";
      columnEnd.textContent = "아래";
    }
    dirState.colReversed = !dirState.colReversed;
    renderPreviewFromStartInput();
  });

  /* ==========================
     마우스 선택 동작
     ========================== */
  grid.addEventListener("click", (e) => {
    if (isPopoverOpen) return;
    if (!e.target.classList.contains("grid-cell")) {
      clearSelection();
      return;
    }
    const x = +e.target.dataset.x;
    const y = +e.target.dataset.y;

    if (startX === null || startY === null) {
      startX = x;
      startY = y;
      isSelecting = true;
      selectRect(startX, startY, x, y);
    } else {
      selectRect(startX, startY, x, y);
      startX = startY = null;
      isSelecting = false;
    }
  });

  // 드래그 중 실시간 표시
  grid.addEventListener("mousemove", (e) => {
    if (startX === null || startY === null || isPopoverOpen) return;
    if (!e.target.classList.contains("grid-cell")) return;
    const x = +e.target.dataset.x;
    const y = +e.target.dataset.y;
    selectRect(startX, startY, x, y);
  });

  // 선택 해제 버튼
  clearBtn.addEventListener("click", clearSelection);

  /* ==========================
     자동 스크롤 + 확장
     ========================== */
  let autoScrollInterval = null;
  function startAutoScroll(e) {
    if (!isSelecting || isPopoverOpen) return;
    const edgeThreshold = 40;
    const speed = 20;
    const container = grid.parentElement;
    const mouseX = e.clientX,
      mouseY = e.clientY;
    const { innerWidth, innerHeight } = window;
    let dx = 0,
      dy = 0;

    if (mouseX <= edgeThreshold) dx = -speed;
    else if (mouseX >= innerWidth - edgeThreshold) dx = speed;
    if (mouseY <= edgeThreshold) dy = -speed;
    else if (mouseY >= innerHeight - edgeThreshold) dy = speed;

    if (dx !== 0 || dy !== 0) {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
          container.scrollLeft += dx;
          container.scrollTop += dy;

          const nearRight =
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 2;
          const nearBottom =
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 2;

          if (nearRight) {
            totalCols += 3;
            rebuildGridPreserveScroll();
          }
          if (nearBottom) {
            totalRows += 3;
            rebuildGridPreserveScroll();
          }
        }, 16);
      }
    } else stopAutoScroll();
  }
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }
  window.addEventListener("mousemove", startAutoScroll);
  window.addEventListener("mouseleave", stopAutoScroll);

  // 헤더나 맵 외 클릭 시 선택 해제
  document.addEventListener("click", (e) => {
    const hasSelection = document.querySelector(".grid-cell.selected");
    if (!hasSelection) return;

    const isGridCell = e.target.closest(".grid-cell");
    const isInsidePopover = popover.contains(e.target);
    const isInsideLabel = label.contains(e.target);
    const isInsideLockerMap = e.target.closest(".locker-map");
    const isHeaderOrMenu = e.target.closest(
      "header, .header, .header-contents-wrap, .main-menu"
    );

    // 그리드, 팝오버, 라벨 내부 클릭은 무시
    if (isGridCell || isInsidePopover || isInsideLabel) return;

    // 맵 외부, 헤더, 메뉴 클릭 시 선택 해제
    if (!isInsideLockerMap || isHeaderOrMenu) {
      clearSelection();
    }
  });

  // 초기 그리드 렌더
  rebuildGrid();
});

/* ==========================================================
   락커 편집 모드 전환 버튼
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const lockerCardWrap = document.querySelector(".locker-card-wrap");
  const lockerMap = document.querySelector(".locker-map");
  const actWrap = document.querySelector(".act-wrap");
  const editBtn = document.querySelector(".locker-map-edit-btn");
  const folderListWrap = document.querySelector(".folder-list-wrap");

  let originalBtns = null;
  let wasFolderFolded = false;

  editBtn?.addEventListener("click", () => {
    wasFolderFolded = folderListWrap.classList.contains("folding");

    // 폴더 목록 접기
    if (folderListWrap) {
      folderListWrap.classList.remove("unfolding");
      folderListWrap.classList.add("folding");
      document.querySelectorAll(".folder-list-unfold-btn").forEach((btn) => {
        btn.style.display = "inline-flex";
      });
    }

    // 버튼 교체 (취소 / 저장)
    if (!originalBtns) {
      originalBtns = actWrap
        .querySelector(".act-wrap__btns__main")
        .cloneNode(true);
    }

    const btnWrap = actWrap.querySelector(".act-wrap__btns__main");
    const rightBtnWrap = actWrap.querySelector(".act-wrap__btns__right");
    if (rightBtnWrap) rightBtnWrap.style.display = "none";

    btnWrap.innerHTML = `
      <button class="btn btn--outlined btn--neutral btn--medium locker-map-cancel-btn">취소</button>
      <button class="btn btn--solid btn--primary btn--medium locker-map-save-btn">락커 배치도 저장</button>
    `;

    lockerCardWrap.style.display = "none";
    lockerMap.style.display = "block";

    // 취소 버튼
    btnWrap
      .querySelector(".locker-map-cancel-btn")
      .addEventListener("click", () => {
        if (folderListWrap) {
          folderListWrap.classList.remove("folding", "unfolding");
          folderListWrap.classList.add(
            wasFolderFolded ? "folding" : "unfolding"
          );
          document
            .querySelectorAll(".folder-list-unfold-btn")
            .forEach((btn) => {
              btn.style.display = wasFolderFolded ? "inline-flex" : "none";
            });
        }
        if (rightBtnWrap) rightBtnWrap.style.display = "";
        btnWrap.replaceWith(originalBtns.cloneNode(true));
        lockerCardWrap.style.display = "flex";
        lockerMap.style.display = "none";

        // 다시 편집 버튼 활성화
        document
          .querySelector(".locker-map-edit-btn")
          ?.addEventListener("click", () => {
            editBtn.click();
          });
      });

    // 저장 버튼
    btnWrap
      .querySelector(".locker-map-save-btn")
      .addEventListener("click", () => {
        console.log("💾 배치도 저장");
      });
  });
});

/* ==========================================================
   셀 프리뷰 및 드래그앤드랍
   - 각 셀에 락커 프리뷰(번호/회원명/상태) 추가
   - 드래그 이동, 수정, 삭제 가능
   ========================================================== */

let dragGhost = null; // 드래그 시 따라다니는 고스트
let draggingCard = null; // 현재 드래그 중인 카드
let dropGuide = null; // 드랍 위치 표시용 가이드

/* ==========================
   드랍 위치 가이드
   ========================== */
function ensureDropGuide() {
  // 지도에 dropGuide가 없으면 생성
  if (dropGuide) return dropGuide;
  const map = document.querySelector(".locker-map");
  if (!map) return null;
  const g = document.createElement("div");
  g.className = "locker-drop-guide"; // CSS로 표시 (테두리 박스 등)
  g.style.display = "none";
  map.appendChild(g);
  dropGuide = g;
  return g;
}

// 특정 셀 위에 드랍 가이드 표시
function showDropGuideForCell(cell) {
  const map = document.querySelector(".locker-map");
  if (!map || !cell) return;
  const guide = ensureDropGuide();
  const cr = cell.getBoundingClientRect();
  const mr = map.getBoundingClientRect();
  guide.style.width = cr.width + "px";
  guide.style.height = cr.height + "px";
  guide.style.left = cr.left - mr.left + map.scrollLeft + "px";
  guide.style.top = cr.top - mr.top + map.scrollTop + "px";
  guide.style.display = "block";
}

// 가이드 숨김
function hideDropGuide() {
  if (dropGuide) dropGuide.style.display = "none";
}

/* ==========================
   셀에 락커 프리뷰 카드 추가
   ========================== */
function addLockerPreviewToCell(x, y, { number, name = "", state = "" } = {}) {
  const cell = document.querySelector(
    `.grid-bg .grid-cell[data-x="${x}"][data-y="${y}"]`
  );
  if (!cell) return null;

  // 카드 기본 구조
  const card = document.createElement("div");
  card.className = `locker-preview locker--${state || "available"}`;
  card.draggable = true;
  card.dataset.x = x;
  card.dataset.y = y;
  card.dataset.number = number ?? "";
  card.dataset.name = name ?? "";
  card.dataset.state = state ?? "";

  // 카드 내부 HTML
  card.innerHTML = `
    <div class="locker-preview__top">
      <div class="locker-preview__locker-name">${String(number ?? "")}</div>
      ${
        name
          ? `<div class="locker-preview__user-name" title="${name}">${name}</div>`
          : ""
      }
    </div>
    <div class="locker-preview__actions">
      <button class="locker-btn locker-btn--edit"  data-action="edit" type="button">수정</button>
      <button class="locker-btn locker-btn--delete" data-action="delete" type="button">삭제</button>
    </div>
  `;

  // 클릭 이벤트 버블 차단 (셀 클릭 영향 방지)
  card.addEventListener("click", (e) => e.stopPropagation());

  /* ==========================
     드래그 시작
     ========================== */
  card.addEventListener("dragstart", (e) => {
    draggingCard = card;
    card.classList.add("dragging");

    // 기본 브라우저 드래그 이미지는 숨김 처리
    const img = new Image();
    img.src =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'></svg>";
    e.dataTransfer.setDragImage(img, 0, 0);

    // 고스트(따라다니는 미리보기) 생성
    dragGhost = card.cloneNode(true);
    dragGhost.classList.add("locker-drag-ghost");
    dragGhost.style.width = card.offsetWidth + "px";
    dragGhost.style.height = card.offsetHeight + "px";
    document.body.appendChild(dragGhost);
  });

  /* ==========================
     드래그 종료
     ========================== */
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggingCard = null;
    hideDropGuide();
    dragGhost?.remove();
    dragGhost = null;
  });

  /* ==========================
     수정 버튼 → 수정 모드 진입
     ========================== */
  card.querySelector('[data-action="edit"]').addEventListener("click", () => {
    enterEditMode(card);
  });

  /* ==========================
     삭제 버튼
     ========================== */
  card.querySelector('[data-action="delete"]').addEventListener("click", () => {
    card.remove();
  });

  cell.appendChild(card);
  return card;
}

/* ==========================================================
   수정 모드
   - 카드 번호를 즉시 수정 가능
   ========================================================== */
function enterEditMode(card) {
  const lockerNameEl = card.querySelector(".locker-preview__locker-name");
  const actionsEl = card.querySelector(".locker-preview__actions");
  const currentNumber = lockerNameEl.textContent;

  card.classList.add("locker--editing");
  card.closest(".grid-cell")?.classList.add("cell--editing");

  lockerNameEl.innerHTML = `<input type="text" class="locker-edit-input" value="${currentNumber}">`;

  const input = lockerNameEl.querySelector("input");
  input.focus();
  input.select();

  // 수정 모드용 버튼
  actionsEl.innerHTML = `
    <button class="locker-btn locker-btn--save" data-action="save">저장</button>
    <button class="locker-btn locker-btn--cancel" data-action="cancel">취소</button>
  `;

  // 저장 / 취소 / Enter 키
  actionsEl
    .querySelector('[data-action="save"]')
    .addEventListener("click", () => {
      saveEdit(card);
    });
  actionsEl
    .querySelector('[data-action="cancel"]')
    .addEventListener("click", () => {
      cancelEdit(card, currentNumber);
    });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit(card);
  });
}

/* ==========================
   수정 저장
   ========================== */
function saveEdit(card) {
  const input = card.querySelector(".locker-edit-input");
  const newNumber = input.value.trim();
  card.dataset.number = newNumber;
  card.querySelector(".locker-preview__locker-name").textContent = newNumber;
  resetActions(card);
  card.classList.remove("locker--editing");
  card.closest(".grid-cell")?.classList.remove("cell--editing");
}

/* ==========================
   수정 취소
   ========================== */
function cancelEdit(card, originalNumber) {
  card.querySelector(".locker-preview__locker-name").textContent =
    originalNumber;
  resetActions(card);
  card.classList.remove("locker--editing");
  card.closest(".grid-cell")?.classList.remove("cell--editing");
}

/* ==========================
   액션 버튼 영역 초기화 (수정/삭제로 복귀)
   ========================== */
function resetActions(card) {
  const actionsEl = card.querySelector(".locker-preview__actions");
  actionsEl.innerHTML = `
    <button class="locker-btn locker-btn--edit"  data-action="edit" type="button">수정</button>
    <button class="locker-btn locker-btn--delete" data-action="delete" type="button">삭제</button>
  `;
  actionsEl
    .querySelector('[data-action="edit"]')
    .addEventListener("click", () => enterEditMode(card));
  actionsEl
    .querySelector('[data-action="delete"]')
    .addEventListener("click", () => card.remove());
}

/* ==========================================================
   드래그앤드랍 (락커 카드 이동)
   ========================================================== */
function enableDropOnCells() {
  document.querySelectorAll(".grid-cell").forEach((cell) => {
    // 드래그 오버 중 표시
    cell.addEventListener("dragover", (e) => {
      if (!draggingCard) return;
      if (cell.querySelector(".locker-preview")) return; // 이미 존재 시 불가
      e.preventDefault();
      showDropGuideForCell(cell);
    });

    // 드랍 시 카드 이동
    cell.addEventListener("drop", (e) => {
      if (!draggingCard) return;
      if (cell.querySelector(".locker-preview")) {
        hideDropGuide();
        return;
      }

      e.preventDefault();
      const toX = parseInt(cell.dataset.x);
      const toY = parseInt(cell.dataset.y);
      const fromX = parseInt(draggingCard.dataset.x);
      const fromY = parseInt(draggingCard.dataset.y);

      if (fromX === toX && fromY === toY) {
        hideDropGuide();
        return;
      }

      const fromCell = document.querySelector(
        `.grid-cell[data-x="${fromX}"][data-y="${fromY}"]`
      );
      fromCell?.removeChild(draggingCard);
      cell.appendChild(draggingCard);

      // 좌표 갱신
      draggingCard.dataset.x = toX;
      draggingCard.dataset.y = toY;

      hideDropGuide();
    });
  });
}

/* ==========================
   드래그 중 고스트 위치 실시간 갱신
   ========================== */
document.addEventListener("dragover", (e) => {
  if (!dragGhost) return;
  dragGhost.style.left = e.clientX + "px";
  dragGhost.style.top = e.clientY + "px";
});

/* ==========================================================
   저장 기능
   - 모든 락커 카드의 위치/정보 JSON으로 수집
   ========================================================== */
function bindSaveButton() {
  document
    .querySelector(".locker-map-save-btn")
    ?.addEventListener("click", () => {
      const allCards = document.querySelectorAll(".locker-preview");
      const data = Array.from(allCards).map((card) => ({
        x: parseInt(card.dataset.x),
        y: parseInt(card.dataset.y),
        number: card.dataset.number,
        name: card.dataset.name,
        state: card.dataset.state,
      }));
      console.log("💾 저장 데이터:", data);
      // → 서버 저장 API 연동 시 여기서 POST 요청 추가 예정
    });
}

/* ==========================================================
   초기화 (샘플 데이터 + 드롭 활성화)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // 기본 예시 락커 배치
    addLockerPreviewToCell(0, 0, { number: "000", state: "unavailable" });
    addLockerPreviewToCell(1, 0, {
      number: "001",
      name: "강수미",
      state: "in-use",
    });
    addLockerPreviewToCell(2, 0, { number: "002", state: "new" });

    // 드래그앤드랍 / 저장 활성화
    enableDropOnCells();
    bindSaveButton();
  }, 100);
});
