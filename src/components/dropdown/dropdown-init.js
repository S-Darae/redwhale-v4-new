// ===============================
// Dropdown Utility (드롭다운 유틸리티 모듈)
// -------------------------------
// - 드롭다운 토글 버튼과 메뉴를 제어하는 공통 로직
// - 클릭/체크박스 선택/외부 클릭 등 모든 동작을 관리
// - 모달 내부 드롭다운은 body 포탈로 이동 후 좌표 기반 위치 보정
// ===============================

// --------------------------------------------------
// 모든 드롭다운 닫기 (Escape / 다른 토글 클릭 시 실행)
// --------------------------------------------------
export function closeAllDropdowns(exceptMenu = null) {
  document.querySelectorAll(".dropdown__menu.visible").forEach((menu) => {
    if (exceptMenu && menu === exceptMenu) return; // 현재 열려고 하는 메뉴는 닫지 않음
    hideMenu(menu);
  });
  document.querySelectorAll("[aria-expanded='true']").forEach((toggle) => {
    const controls = toggle.getAttribute("aria-controls");
    if (exceptMenu && controls === exceptMenu.id) return;
    toggle.setAttribute("aria-expanded", "false");
  });
}

// --------------------------------------------------
// 메뉴 닫기 처리
// - visible 클래스 제거
// - 모달에서 body로 포탈된 메뉴는 원래 .dropdown 내부로 되돌림
// --------------------------------------------------
function hideMenu(menu) {
  menu.classList.remove("visible");
  menu.classList.remove("drop-up", "drop-left", "drop-right");

  if (menu.dataset.portal === "true" && menu.parentElement === document.body) {
    const toggle = document.querySelector(
      `[data-dropdown-target="${menu.id}"], .dropdown__toggle[aria-controls="${menu.id}"]`
    );
    if (toggle) {
      const wrapper = toggle.closest(".dropdown");
      if (wrapper) wrapper.appendChild(menu); // 원래 위치로 복귀
    }
    menu.dataset.portal = "false";
    menu.dataset.portalAppended = "";
    menu.style.position = "";
    menu.style.top = "";
    menu.style.left = "";
  }
}

// --------------------------------------------------
// 드롭다운 개별 초기화 (토글 + 메뉴 바인딩)
// - dataset.initialized 플래그로 중복 방지
// --------------------------------------------------
export function initializeDropdown(dropdown) {
  if (!dropdown || dropdown.dataset.initialized === "true") return;
  dropdown.dataset.initialized = "true";

  const toggle = dropdown.querySelector(
    ".dropdown__toggle, .text-field__select-toggle"
  );
  const menu = dropdown.querySelector(".dropdown__menu");

  if (toggle && menu) bindToggleWithMenu(toggle, menu);
}

// --------------------------------------------------
// 외부 토글 지원 (data-dropdown-target="menuId")
// - 토글과 메뉴가 직접 같은 DOM에 없을 때 사용
// --------------------------------------------------
function initializeExternalToggles() {
  document.querySelectorAll("[data-dropdown-target]").forEach((toggle) => {
    const targetId = toggle.dataset.dropdownTarget;
    const menu = document.getElementById(targetId);
    if (menu) bindToggleWithMenu(toggle, menu);
  });
}

// --------------------------------------------------
// 모달 내부 여부 확인
// --------------------------------------------------
function isInModal(el) {
  return !!el.closest(".modal-overlay");
}

// --------------------------------------------------
// Toggle + Menu 바인딩 함수
// --------------------------
// - placeholder/selected 상태 초기화
// - 토글 클릭 시 메뉴 열기/닫기
// - 아이템 클릭/체크박스 변경 이벤트 처리
// --------------------------------------------------
function bindToggleWithMenu(toggle, menu) {
  if (!toggle || !menu || toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  // 아이콘 전용 토글 여부 확인 (텍스트 없는 경우)
  const isIconOnly =
    toggle.classList.contains("btn--icon-only") || toggle.querySelector("i");

  // 토글 텍스트 초기화
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

  // 토글 클릭 이벤트
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const expanded = toggle.getAttribute("aria-expanded") === "true";

    if (expanded) {
      toggle.setAttribute("aria-expanded", "false");
      hideMenu(menu);
      return;
    }

    // 다른 드롭다운 닫고 현재만 열기
    closeAllDropdowns(menu);
    toggle.setAttribute("aria-expanded", "true");

    // 모달 내부면 body로 포탈
    if (isInModal(toggle) && menu.parentElement !== document.body) {
      document.body.appendChild(menu);
      menu.dataset.portal = "true";
      menu.dataset.portalAppended = "true";
    }

    // 위치 보정
    positionMenuNearToggle(toggle, menu);

    menu.classList.add("visible");

    // 선택된 항목 스크롤 보정
    const selected = menu.querySelector(
      ".dropdown__item.selected, .dropdown__item.checked"
    );
    if (selected) selected.scrollIntoView({ block: "nearest" });
  });

  // 체크박스 메뉴
  if (menu.querySelector("input[type='checkbox']")) {
    menu.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateCheckboxToggleText(toggle, menu);
      });
    });
  }
  // 일반 메뉴 아이템 클릭
  else if (!isIconOnly) {
    menu.querySelectorAll(".dropdown__item").forEach((item) => {
      item.addEventListener("click", () => {
        const value = item.dataset.value || item.textContent.trim();
        const placeholder = toggle.dataset.placeholder || "옵션 선택";

        if (value && value !== placeholder) {
          toggle.textContent = value;
          toggle.classList.remove("is-placeholder");
        } else {
          toggle.textContent = placeholder;
          toggle.classList.add("is-placeholder");
        }

        menu
          .querySelectorAll(".dropdown__item.selected")
          .forEach((el) => el.classList.remove("selected"));
        item.classList.add("selected");

        toggle.setAttribute("aria-expanded", "false");
        hideMenu(menu);

        // custom 이벤트 발행 → 상위 컴포넌트에서 감지 가능
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
// 체크박스 드롭다운 → 선택값을 토글 텍스트로 업데이트
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
// 전역 초기화 (페이지 최초 로드 시 1회 실행)
// --------------------------------------------------
export function initializeDropdowns() {
  document.querySelectorAll(".dropdown").forEach(initializeDropdown);
  initializeExternalToggles();

  // 외부 클릭 → 드롭다운 닫기
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".dropdown__menu.visible").forEach((menu) => {
      const toggle = document.querySelector(
        `[data-dropdown-target="${menu.id}"], .dropdown__toggle[aria-controls="${menu.id}"]`
      );
      if (
        toggle &&
        (toggle.contains(event.target) || menu.contains(event.target))
      )
        return;

      toggle?.setAttribute("aria-expanded", "false");
      hideMenu(menu);
    });
  });

  // ESC 키 → 모두 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });
}

// --------------------------------------------------
// 아이템 전체 클릭 → 내부 체크박스 토글 동작 연결
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
// 메뉴 위치 보정 (상/하/좌/우 + 모달 대응)
// --------------------------
// - 일반 드롭다운: 기존 left/right 규칙 사용
// - 모달 내부 드롭다운: rect 좌표 기준 (body 포탈 시 좌표 오류 방지)
// --------------------------------------------------
function positionMenuNearToggle(toggle, menu) {
  const rect = toggle.getBoundingClientRect();

  // 초기 상태
  menu.style.visibility = "hidden";
  menu.classList.add("visible");

  const menuHeight = menu.offsetHeight || 200;
  const toggleWidth = rect.width;

  menu.style.position = "absolute";

  // 모달 내부 드롭다운
  if (toggle.closest(".modal-overlay")) {
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

  // 일반 드롭다운 (모달 밖)
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

  // 📌 선택된 항목 자동 스크롤
  const selectedItem = menu.querySelector(".dropdown__item.selected");
  if (selectedItem) {
    menu.scrollTop =
      selectedItem.offsetTop -
      menu.clientHeight / 2 +
      selectedItem.clientHeight / 2;
  }

  // 📌 좌우 잘림 자동 보정
  const menuRect = menu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  // 오른쪽이 잘려나갈 경우 → 왼쪽으로 이동
  if (menuRect.right > viewportWidth - 8) {
    const shiftLeft = menuRect.right - viewportWidth + 8;
    const currentLeft = parseFloat(menu.style.left) || 0;
    menu.style.left = `${currentLeft - shiftLeft}px`;
  }

  // 왼쪽이 화면 밖으로 나갈 경우 → 오른쪽으로 이동
  if (menuRect.left < 8) {
    const shiftRight = 8 - menuRect.left;
    const currentLeft = parseFloat(menu.style.left) || 0;
    menu.style.left = `${currentLeft + shiftRight}px`;
  }

  // 📌 표시
  menu.style.visibility = "visible";
}
