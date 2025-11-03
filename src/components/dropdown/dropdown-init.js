// =====================================================================
// 📦 Dropdown Utility (드롭다운 유틸리티 모듈)
// ---------------------------------------------------------------------
// ✅ 역할:
// - 모든 드롭다운의 열림/닫힘 상태를 통합 관리
// - 단일 선택, 멀티 체크박스 선택, 외부 클릭, ESC 등 공통 제어
// - 모달/팝오버 내부의 드롭다운은 body로 포탈 처리하여 좌표 기반 위치 보정
// ---------------------------------------------------------------------
// ⚙️ 주요 함수:
// - initializeDropdowns()   : 전역 초기화 (페이지 로드 시 1회)
// - initializeDropdown()    : 개별 드롭다운 초기화 (동적 생성 시 호출)
// - closeAllDropdowns()     : 현재 열린 모든 드롭다운 닫기
// - bindToggleWithMenu()    : 토글 + 메뉴 이벤트 연결
// - positionMenuNearToggle(): 위치 보정 (상/하/좌/우/모달 내 등)
// ---------------------------------------------------------------------
// 🧩 Angular 변환 가이드
// - 이 파일 전체는 Angular에서는 서비스 + 디렉티브 형태로 분리
//   1️⃣ DropdownService : open/close 상태 및 포지션 제어
//   2️⃣ DropdownDirective : toggle / menu 간의 DOM 이벤트 관리
// - document 이벤트(addEventListener)는 HostListener로 대체
// =====================================================================

// --------------------------------------------------
// 🧹 모든 드롭다운 닫기
// --------------------------------------------------
// - ESC / 외부 클릭 / 다른 토글 클릭 시 실행
// - exceptMenu 인자가 있으면 해당 메뉴만 유지
// --------------------------------------------------
export function closeAllDropdowns(exceptMenu = null) {
  document.querySelectorAll(".dropdown__menu.visible").forEach((menu) => {
    if (exceptMenu && menu === exceptMenu) return;
    hideMenu(menu);
  });

  document.querySelectorAll("[aria-expanded='true']").forEach((toggle) => {
    const controls = toggle.getAttribute("aria-controls");
    if (exceptMenu && controls === exceptMenu.id) return;
    toggle.setAttribute("aria-expanded", "false");
  });
}

// --------------------------------------------------
// 🧩 메뉴 닫기 처리 (visible 제거 + 포탈 복귀)
// --------------------------------------------------
function hideMenu(menu) {
  menu.classList.remove("visible", "drop-up", "drop-left", "drop-right");

  // body 포탈 메뉴 → 원래 dropdown으로 복귀
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

    // 복귀 실패 시 body에서 제거 (메모리 누수 방지)
    if (!restored && menu.parentElement === document.body) {
      menu.remove();
    }

    // 포지션 초기화
    menu.dataset.portal = "false";
    menu.dataset.portalAppended = "";
    menu.style.position = "";
    menu.style.top = "";
    menu.style.left = "";
  }
}

// --------------------------------------------------
// 🧭 개별 드롭다운 초기화
// --------------------------------------------------
// - dropdown: .dropdown 엘리먼트 컨테이너
// - 내부의 toggle과 menu를 연결
// - 이미 초기화된 경우 재실행 방지
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

  // 메뉴가 늦게 추가되는 경우 MutationObserver로 대기
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
// 🧩 외부 토글 지원 (data-dropdown-target 속성 기반)
// --------------------------------------------------
// - 토글과 메뉴가 DOM상 분리되어 있는 경우에도 연결 처리
// --------------------------------------------------
function initializeExternalToggles() {
  document.querySelectorAll("[data-dropdown-target]").forEach((toggle) => {
    const targetId = toggle.dataset.dropdownTarget;
    const menu = document.getElementById(targetId);
    if (menu) bindToggleWithMenu(toggle, menu);
  });
}

// --------------------------------------------------
// 🧭 모달/팝오버 내부 여부 판단
// --------------------------------------------------
// - 내부에 있을 경우 body 포탈 대상으로 인식
// --------------------------------------------------
function isInModalOrPopover(el) {
  return !!(
    el.closest(".modal-overlay") || el.closest(".locker-detail-popover")
  );
}

// --------------------------------------------------
// 🔗 토글 + 메뉴 바인딩 (핵심 제어 로직)
// --------------------------------------------------
// - 열림/닫힘 상태관리, 클릭 이벤트, 선택값 업데이트 담당
// - Angular: DropdownDirective 로직으로 분리 가능
// --------------------------------------------------
function bindToggleWithMenu(toggle, menu) {
  if (!toggle || !menu || toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  const isIconOnly =
    toggle.classList.contains("btn--icon-only") || toggle.querySelector("i");

  // 초기 placeholder 세팅
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
  // 🖱 토글 클릭 시 열기/닫기 제어
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

    // 모달/팝오버 내부면 body 포탈 처리
    if (isInModalOrPopover(toggle) && menu.parentElement !== document.body) {
      document.body.appendChild(menu);
      menu.dataset.portal = "true";
      menu.dataset.portalAppended = "true";
    }

    // 위치 보정
    positionMenuNearToggle(toggle, menu);

    // 표시
    menu.classList.add("visible");

    // 선택된 항목으로 자동 스크롤
    const selected = menu.querySelector(
      ".dropdown__item.selected, .dropdown__item.checked"
    );
    if (selected) selected.scrollIntoView({ block: "nearest" });
  });

  // --------------------------------------------
  // ✅ 체크박스 드롭다운 (멀티 선택)
  // --------------------------------------------
  if (menu.querySelector("input[type='checkbox']")) {
    menu.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateCheckboxToggleText(toggle, menu);
      });
    });
  }

  // --------------------------------------------
  // ✅ 일반 드롭다운 (단일 선택)
  // --------------------------------------------
  else if (!isIconOnly) {
    menu.querySelectorAll(".dropdown__item").forEach((item) => {
      item.addEventListener("click", () => {
        const value = item.dataset.value || item.textContent.trim();

        toggle.textContent = value;
        toggle.classList.remove("is-placeholder");

        // 선택 표시 갱신
        menu
          .querySelectorAll(".dropdown__item.selected")
          .forEach((el) => el.classList.remove("selected"));
        item.classList.add("selected");

        // 메뉴 닫기
        toggle.setAttribute("aria-expanded", "false");
        hideMenu(menu);

        // 커스텀 이벤트 (Angular에서는 Output)
        toggle.dispatchEvent(
          new CustomEvent("dropdown:change", { bubbles: true })
        );
      });
    });
  }
}

// --------------------------------------------------
// 🧮 체크박스 드롭다운 텍스트 갱신
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
// 🚀 전역 초기화 (페이지 진입 시 호출)
// --------------------------------------------------
// - 모든 .dropdown 요소 스캔 후 initializeDropdown 실행
// - 외부 클릭 / ESC / 외부 토글까지 통합 제어
// --------------------------------------------------
export function initializeDropdowns() {
  document.querySelectorAll(".dropdown").forEach(initializeDropdown);
  initializeExternalToggles();

  // 외부 클릭 → 전체 닫기
  document.addEventListener(
    "click",
    (event) => {
      const openMenus = document.querySelectorAll(".dropdown__menu.visible");
      if (openMenus.length === 0) return;

      const isDropdownToggle = event.target.closest(
        ".dropdown__toggle, .text-field__select-toggle"
      );
      if (isDropdownToggle) return;

      const clickedInsideDropdownMenu = Array.from(openMenus).some((menu) =>
        menu.contains(event.target)
      );
      if (clickedInsideDropdownMenu) return;

      closeAllDropdowns();
    },
    true // capture 단계에서 감지
  );

  // ESC 키 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });
}

// --------------------------------------------------
// 🧾 아이템 클릭 → 내부 체크박스도 토글 (멀티선택 전용)
// --------------------------------------------------
document.addEventListener("click", (e) => {
   // 체크박스를 직접 클릭한 경우, 기본 동작 유지 후 중복 방지
  if (e.target.matches('input[type="checkbox"]')) return;

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
// 📍 메뉴 위치 보정 (뷰포트/모달 대응)
// --------------------------------------------------
// - 모달/팝오버 내부에서는 window 좌표 기준 계산
// - 일반 페이지에서는 toggle 기준 상대 위치 계산
// - Angular에서는 CDK Overlay PositionStrategy 로 대체 가능
// --------------------------------------------------
function positionMenuNearToggle(toggle, menu) {
  const rect = toggle.getBoundingClientRect();

  menu.style.visibility = "hidden";
  menu.classList.add("visible");

  const menuHeight = menu.offsetHeight || 200;
  const toggleWidth = rect.width;
  menu.style.position = "absolute";

  // ------------------------------
  // 📍 모달 / 팝오버 내부
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
  // 🧱 일반 드롭다운 (text-field 기준)
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

  // 선택 항목 스크롤 이동
  const selectedItem = menu.querySelector(".dropdown__item.selected");
  if (selectedItem) {
    menu.scrollTop =
      selectedItem.offsetTop -
      menu.clientHeight / 2 +
      selectedItem.clientHeight / 2;
  }

  // 좌우 화면 잘림 보정
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
