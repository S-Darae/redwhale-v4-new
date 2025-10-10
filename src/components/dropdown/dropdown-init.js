// ===============================
// Dropdown Utility (드롭다운 유틸리티 모듈)
// -------------------------------
// ✅ 역할:
// - 모든 드롭다운의 열림/닫힘 상태를 통합 관리
// - 단일 선택, 멀티 체크박스 선택, 외부 클릭, ESC 등 공통 제어
// - 모달/팝오버 내부 드롭다운은 body로 포탈하여 좌표 기반 위치 보정 처리
// -------------------------------
// ⚙️ 주요 함수:
// - initializeDropdowns()   : 전역 초기화 (페이지 진입 시 1회 실행)
// - initializeDropdown()    : 개별 드롭다운 초기화 (동적 생성 시 개별 바인딩)
// - closeAllDropdowns()     : 현재 열린 모든 드롭다운 닫기
// - bindToggleWithMenu()    : 토글과 메뉴 연결 및 상태 제어
// - positionMenuNearToggle(): 위치 보정 (뷰포트 기준 상/하/좌/우 계산)
// ===============================

// --------------------------------------------------
// 모든 드롭다운 닫기 (Escape, 외부 클릭, 다른 토글 클릭 시)
// --------------------------------------------------
export function closeAllDropdowns(exceptMenu = null) {
  // visible 상태의 모든 메뉴 순회
  document.querySelectorAll(".dropdown__menu.visible").forEach((menu) => {
    if (exceptMenu && menu === exceptMenu) return;
    hideMenu(menu);
  });

  // aria-expanded true 상태의 토글 모두 닫기
  document.querySelectorAll("[aria-expanded='true']").forEach((toggle) => {
    const controls = toggle.getAttribute("aria-controls");
    if (exceptMenu && controls === exceptMenu.id) return;
    toggle.setAttribute("aria-expanded", "false");
  });
}

// --------------------------------------------------
// 메뉴 닫기 처리 (visible 제거 + 포탈 복귀)
// --------------------------------------------------
function hideMenu(menu) {
  menu.classList.remove("visible", "drop-up", "drop-left", "drop-right");

  // body로 포탈된 메뉴의 경우 원래 위치로 복귀
  if (menu.dataset.portal === "true" && menu.parentElement === document.body) {
    const toggle = document.querySelector(
      `[data-dropdown-target="${menu.id}"], .dropdown__toggle[aria-controls="${menu.id}"]`
    );

    let restored = false;
    if (toggle) {
      const wrapper = toggle.closest(".dropdown");
      if (wrapper) {
        wrapper.appendChild(menu);
        restored = true;
      }
    }

    // wrapper를 찾지 못했을 경우 body에서 제거 (잔존 방지)
    if (!restored && menu.parentElement === document.body) {
      menu.remove();
    }

    // 위치/상태 초기화
    menu.dataset.portal = "false";
    menu.dataset.portalAppended = "";
    menu.style.position = "";
    menu.style.top = "";
    menu.style.left = "";
  }
}

// --------------------------------------------------
// 개별 드롭다운 초기화 (토글 + 메뉴 연결)
// --------------------------------------------------
export function initializeDropdown(dropdown) {
  if (!dropdown || dropdown.dataset.initialized === "true") return;
  dropdown.dataset.initialized = "true";

  const toggle = dropdown.querySelector(
    ".dropdown__toggle, .text-field__select-toggle"
  );
  let menu =
    dropdown.querySelector(".dropdown__menu") ||
    document.getElementById(toggle?.dataset.dropdownTarget);

  // 메뉴가 동적으로 추가되는 경우 → MutationObserver로 대기 후 바인딩
  if (!menu && toggle?.dataset.dropdownTarget) {
    const observer = new MutationObserver(() => {
      const newMenu = document.getElementById(toggle.dataset.dropdownTarget);
      if (newMenu) {
        bindToggleWithMenu(toggle, newMenu);
        observer.disconnect();
      }
    });
    observer.observe(dropdown, { childList: true, subtree: true });
    return;
  }

  if (toggle && menu) bindToggleWithMenu(toggle, menu);
}

// --------------------------------------------------
// 외부 토글 지원 (ex. data-dropdown-target="menuId")
// --------------------------------------------------
function initializeExternalToggles() {
  document.querySelectorAll("[data-dropdown-target]").forEach((toggle) => {
    const targetId = toggle.dataset.dropdownTarget;
    const menu = document.getElementById(targetId);
    if (menu) bindToggleWithMenu(toggle, menu);
  });
}

// --------------------------------------------------
// 모달/팝오버 내부 여부 확인
// - 내부에 있으면 포탈 대상임을 판단 (body로 이동시킴)
// --------------------------------------------------
function isInModalOrPopover(el) {
  return !!(
    el.closest(".modal-overlay") || el.closest(".locker-detail-popover")
  );
}

// --------------------------------------------------
// 토글 + 메뉴 바인딩 (드롭다운의 핵심 제어 로직)
// --------------------------------------------------
function bindToggleWithMenu(toggle, menu) {
  if (!toggle || !menu || toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  // 토글 버튼이 아이콘 전용인지 확인
  const isIconOnly =
    toggle.classList.contains("btn--icon-only") || toggle.querySelector("i");

  // 초기 placeholder 텍스트 세팅
  if (!isIconOnly) {
    const initialText = toggle.textContent.trim();
    const placeholder = initialText || "옵션 선택";
    toggle.dataset.placeholder = placeholder;

    const selectedItem = menu.querySelector(".dropdown__item.selected");
    if (selectedItem) {
      const value =
        selectedItem.dataset.value || selectedItem.textContent.trim();
      toggle.textContent = value;
      toggle.classList.remove("is-placeholder");
    } else if (toggle.dataset.defaultValue) {
      toggle.textContent = toggle.dataset.defaultValue;
      toggle.classList.remove("is-placeholder");
    } else {
      toggle.textContent = placeholder;
      toggle.classList.add("is-placeholder");
    }
  }

  // --------------------------------------------
  // 토글 클릭 이벤트
  // --------------------------------------------
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const expanded = toggle.getAttribute("aria-expanded") === "true";

    // 이미 열려있으면 닫기
    if (expanded) {
      toggle.setAttribute("aria-expanded", "false");
      hideMenu(menu);
      return;
    }

    // 다른 드롭다운 닫기 후 자신만 열기
    closeAllDropdowns(menu);
    toggle.setAttribute("aria-expanded", "true");

    // 모달/팝오버 내부면 body로 포탈 처리
    if (isInModalOrPopover(toggle) && menu.parentElement !== document.body) {
      document.body.appendChild(menu);
      menu.dataset.portal = "true";
      menu.dataset.portalAppended = "true";
    }

    // 좌표 기반 위치 보정
    positionMenuNearToggle(toggle, menu);

    // visible 클래스 부여
    menu.classList.add("visible");

    // 선택된 항목 스크롤 위치로 자동 이동
    const selected = menu.querySelector(
      ".dropdown__item.selected, .dropdown__item.checked"
    );
    if (selected) selected.scrollIntoView({ block: "nearest" });
  });

  // --------------------------------------------
  // 체크박스 드롭다운 (멀티 선택)
  // --------------------------------------------
  if (menu.querySelector("input[type='checkbox']")) {
    menu.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateCheckboxToggleText(toggle, menu);
      });
    });
  }

  // --------------------------------------------
  // 일반 드롭다운 (단일 선택)
  // --------------------------------------------
  else if (!isIconOnly) {
    menu.querySelectorAll(".dropdown__item").forEach((item) => {
      item.addEventListener("click", () => {
        const value = item.dataset.value || item.textContent.trim();
        const placeholder = toggle.dataset.placeholder || "옵션 선택";

        // 토글 텍스트 업데이트
        if (value && value !== placeholder) {
          toggle.textContent = value;
          toggle.classList.remove("is-placeholder");
        } else {
          toggle.textContent = placeholder;
          toggle.classList.add("is-placeholder");
        }

        // 선택 표시 갱신
        menu
          .querySelectorAll(".dropdown__item.selected")
          .forEach((el) => el.classList.remove("selected"));
        item.classList.add("selected");

        // 메뉴 닫기 및 상태 업데이트
        toggle.setAttribute("aria-expanded", "false");
        hideMenu(menu);

        // custom 이벤트 발행 (부모 컴포넌트와의 연동용)
        toggle.dispatchEvent(
          new CustomEvent("dropdown:change", {
            detail: { value },
            bubbles: true,
          })
        );
      });
    });
  }
}

// --------------------------------------------------
// 체크박스 드롭다운: 토글 텍스트 동적 갱신
// --------------------------------------------------
function updateCheckboxToggleText(toggle, menu) {
  const checkedItems = Array.from(
    menu.querySelectorAll("input[type='checkbox']:checked")
  ).map((c) => {
    const label = menu.querySelector(`label[for="${c.id}"]`);
    return label ? label.textContent : c.value;
  });

  if (checkedItems.length === 0) {
    toggle.textContent = toggle.dataset.placeholder || "옵션 선택";
    toggle.classList.add("is-placeholder");
  } else if (checkedItems.length === 1) {
    toggle.textContent = checkedItems[0];
    toggle.classList.remove("is-placeholder");
  } else {
    toggle.textContent = `${checkedItems[0]} 외 ${checkedItems.length - 1}개`;
    toggle.classList.remove("is-placeholder");
  }
}

// --------------------------------------------------
// 전역 초기화 (페이지 진입 시 실행)
// --------------------------------------------------
export function initializeDropdowns() {
  // 모든 드롭다운 초기화
  document.querySelectorAll(".dropdown").forEach(initializeDropdown);
  initializeExternalToggles();

  // --------------------------------------------
  // 외부 클릭 → 모든 드롭다운 닫기
  // --------------------------------------------
  document.addEventListener(
    "click",
    (event) => {
      const openMenus = document.querySelectorAll(".dropdown__menu.visible");
      if (openMenus.length === 0) return;

      const isDropdownToggle = event.target.closest(
        ".dropdown__toggle, .text-field__select-toggle"
      );
      if (isDropdownToggle) return;

      // 클릭된 위치가 열려있는 메뉴 내부인지 확인
      const clickedInsideDropdownMenu = Array.from(openMenus).some((menu) =>
        menu.contains(event.target)
      );
      if (clickedInsideDropdownMenu) return;

      // 메뉴 외부 클릭 시 → 모든 드롭다운 닫기
      closeAllDropdowns();
    },
    true // capture 단계에서 먼저 감지 (모달/팝오버 내부 포함)
  );

  // --------------------------------------------
  // ESC 키로 모든 드롭다운 닫기
  // --------------------------------------------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });
}

// --------------------------------------------------
// 아이템 전체 클릭 시 내부 체크박스도 토글
// - 멀티 선택형 드롭다운에서 사용됨
// --------------------------------------------------
document.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown__menu .dropdown__item");
  if (item) {
    const checkbox = item.querySelector("input[type=checkbox]");
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
});

// --------------------------------------------------
// 메뉴 위치 보정 (상/하/좌/우 + 모달/팝오버 대응)
// - 모달/팝오버 내부에서는 viewport 좌표 기준으로 계산
// - 일반 페이지에서는 text-field의 위치 기반
// --------------------------------------------------
function positionMenuNearToggle(toggle, menu) {
  const rect = toggle.getBoundingClientRect();

  menu.style.visibility = "hidden";
  menu.classList.add("visible");

  const menuHeight = menu.offsetHeight || 200;
  const toggleWidth = rect.width;
  menu.style.position = "absolute";

  // ------------------------------
  // 모달/팝오버 내부
  // ------------------------------
  if (
    toggle.closest(".modal-overlay") ||
    toggle.closest(".locker-detail-popover")
  ) {
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.width = `${toggleWidth}px`;

    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < menuHeight) {
      menu.style.top = `${rect.top - menuHeight - 4}px`;
      menu.classList.add("drop-up");
    } else {
      menu.classList.remove("drop-up");
    }
  }

  // ------------------------------
  // 일반 필드 기반 드롭다운
  // ------------------------------
  else {
    const field = toggle.closest(".text-field");

    if (field?.classList.contains("text-field--leading-select")) {
      menu.style.left = "0";
      menu.style.right = "auto";
    } else if (field?.classList.contains("text-field--tailing-select")) {
      menu.style.left = "auto";
      menu.style.right = "0";
    } else if (field?.classList.contains("text-field--select")) {
      menu.style.left = "0";
      menu.style.right = "0";
      menu.style.width = "100%";
    } else {
      menu.style.left = "0";
      menu.style.right = "auto";
      menu.style.width = `${toggleWidth}px`;
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < menuHeight) {
      menu.style.top = `-${menuHeight + 4}px`;
      menu.classList.add("drop-up");
    } else {
      menu.style.top = `${toggle.offsetHeight + 4}px`;
      menu.classList.remove("drop-up");
    }
  }

  // 선택된 항목으로 자동 스크롤
  const selectedItem = menu.querySelector(".dropdown__item.selected");
  if (selectedItem) {
    menu.scrollTop =
      selectedItem.offsetTop -
      menu.clientHeight / 2 +
      selectedItem.clientHeight / 2;
  }

  // 좌우 잘림 보정 (뷰포트 기준)
  const menuRect = menu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  if (menuRect.right > viewportWidth - 8) {
    const shiftLeft = menuRect.right - viewportWidth + 8;
    const currentLeft = parseFloat(menu.style.left) || 0;
    menu.style.left = `${currentLeft - shiftLeft}px`;
  }

  if (menuRect.left < 8) {
    const shiftRight = 8 - menuRect.left;
    const currentLeft = parseFloat(menu.style.left) || 0;
    menu.style.left = `${currentLeft + shiftRight}px`;
  }

  menu.style.visibility = "visible";
}
