import { createDropdownMenu } from "../../components/dropdown/create-dropdown.js";
import { initializeDropdowns } from "../../components/dropdown/dropdown-init.js";
import { initializeDropdownSearch } from "../../components/dropdown/dropdown-search.js";
import "../../components/dropdown/dropdown.js";
import "../../components/modal/modal.js";
import "../../components/tab/tab.js";
import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";
import "../../components/tooltip/tooltip.js";
import "./main-menu.scss";

/* ==========================
   📌 공통 유틸 함수
   - 메뉴 경로 처리 / 팝오버 그룹 처리 / Sortable 동적 로드
   ========================== */
function norm(p) {
  // 경로 정규화: /index.html 제거, 끝의 / 제거
  return (p || "/").replace(/\/index\.html?$/i, "/").replace(/\/+$/, "") || "/";
}
function dirname(p) {
  // 디렉토리 경로 추출: /a/b/c.html → /a/b/
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(0, i + 1) : "/";
}
function isPseudo(href = "") {
  // 가짜 링크 여부 (#, javascript:)
  const h = href.trim().toLowerCase();
  return !h || h === "#" || h.startsWith("#") || h.startsWith("javascript:");
}
function setupPopoverGroup(popovers) {
  // 여러 팝오버 중 한 번에 하나만 열리도록 그룹 관리
  popovers.forEach(({ btn, popover }) => {
    if (!btn || !popover) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isAlreadyVisible = popover.classList.contains("visible");
      // 다른 팝오버는 닫기
      popovers.forEach(({ popover }) => popover.classList.remove("visible"));
      // 방금 클릭한 팝오버만 토글
      if (!isAlreadyVisible) popover.classList.add("visible");
    });
  });
  // 바깥 클릭 시 닫기
  document.addEventListener("click", (e) => {
    popovers.forEach(({ btn, popover }) => {
      if (!popover.contains(e.target) && !btn.contains(e.target)) {
        popover.classList.remove("visible");
      }
    });
  });
}
function loadSortable(callback) {
  // SortableJS 동적 로드 (drag&drop 정렬)
  if (typeof Sortable !== "undefined") {
    if (callback) callback();
    return;
  }
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js";
  script.async = true;
  script.onload = () => {
    if (callback) callback();
  };
  document.head.appendChild(script);
}

/* ==========================
   📌 메인 메뉴 초기화
   - 공통 메뉴 로드 및 각종 UI 초기화
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  fetch("/pages/common/main-menu.html")
    .then((response) => response.text())
    .then((data) => {
      // 공통 메뉴 HTML 삽입
      document.querySelector("#main-menu").innerHTML = data;
      initializeMenu();
      if (window.initializeTooltip) initializeTooltip();
    });

  function initializeMenu() {
    const currentPath = norm(location.pathname);
    const currentDir = dirname(currentPath);

    /* --------------------------
       1. 1차 메뉴 활성화 처리
       - 현재 경로와 일치하는 메뉴 버튼 스타일링
       -------------------------- */
    document.querySelectorAll(".menu-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const btn = link.querySelector(".menu-btn");
      const icon = btn?.querySelector(".menu-icon");
      if (isPseudo(href)) return;

      const linkPath = norm(link.pathname);
      const linkDir = dirname(linkPath);
      const isActive = currentPath === linkPath || currentDir === linkDir;

      if (isActive) {
        btn?.classList.add("selected");
        if (icon) {
          // 아이콘 → fill 아이콘으로 전환
          const base = [...icon.classList].find(
            (cls) => cls.startsWith("icon--menu--") && !cls.endsWith("-fill")
          );
          if (base) {
            icon.classList.remove(base);
            icon.classList.add(`${base}-fill`);
          }
        }
      }

      // 안전한 페이지 이동 처리
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = link.href;
      });
    });

    /* --------------------------
       2. 상품 메뉴 (하위 메뉴 → 부모 활성화)
       - membership 메뉴 하위 항목과 현재 경로 비교
       -------------------------- */
    const membershipWrapper = document.querySelector(
      ".main-menu__membership-menu-wrap"
    );
    const membershipLink = membershipWrapper?.querySelector(".menu-link");
    const membershipDropdown = membershipWrapper?.querySelector(
      ".main-menu__membership-menu"
    );
    const parentMenuBtn = membershipWrapper?.querySelector(".menu-btn");
    const parentIcon = parentMenuBtn?.querySelector(".menu-icon");

    if (membershipWrapper && membershipDropdown) {
      const items = [...membershipDropdown.querySelectorAll("a")].filter(
        (a) => !isPseudo(a.getAttribute("href"))
      );
      const match = items.some((a) => norm(a.pathname) === currentPath);

      // 부모 버튼 활성화
      if (parentMenuBtn) parentMenuBtn.classList.toggle("selected", match);
      if (parentIcon) {
        const fill = [...parentIcon.classList].find((cls) =>
          cls.endsWith("-fill")
        );
        const base = [...parentIcon.classList].find(
          (cls) => cls.startsWith("icon--menu--") && !cls.endsWith("-fill")
        );
        if (match && base) {
          parentIcon.classList.remove(base);
          parentIcon.classList.add(`${base}-fill`);
        } else if (!match && fill) {
          parentIcon.classList.remove(fill);
          parentIcon.classList.add(fill.replace(/-fill$/, ""));
        }
      }

      // 드롭다운 열기/닫기
      if (membershipLink) {
        let open = false;
        membershipLink.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          open = !open;
          membershipDropdown.classList.toggle("visible", open);
        });
        document.addEventListener("click", (e) => {
          if (open && !membershipWrapper.contains(e.target)) {
            membershipDropdown.classList.remove("visible");
            open = false;
          }
        });
      }
    }

    /* --------------------------
       3. 팝오버 (센터 / 내정보)
       - 여러 개 중 하나만 열림
       -------------------------- */
    setupPopoverGroup([
      {
        btn: document.querySelector(".my-center-popover-open-btn"),
        popover: document.getElementById("main-menu__my-center-popover"),
      },
      {
        btn: document.querySelector(".my-account-popover-open-btn"),
        popover: document.getElementById("main-menu__my-account-popover"),
      },
    ]);

    /* --------------------------
       4. 회원 추가 모달
       - 버튼 클릭 시 필드 생성 + 모달 열기
       -------------------------- */
    const openUserAddBtn = document.querySelector(".user-add-modal-open-btn");
    if (openUserAddBtn) {
      openUserAddBtn.addEventListener("click", () => {
        createUserAddFields(); // 필드 생성
        if (window.modal) {
          window.modal.open("user-add"); // 모달 열기
        }
        // 기본 포커스 → 이름 필드
        requestAnimationFrame(() => {
          const nameInput = document.querySelector(
            "#user-add-modal__user-name .text-field__input"
          );
          if (nameInput) {
            nameInput.focus();
            nameInput.select();
          }
        });
      });
    }

    /* --------------------------
       회원 추가 모달 필드 생성
       -------------------------- */
    function createUserAddFields() {
      // 이름
      document.querySelector("#user-add-modal__user-name").innerHTML =
        createTextField({
          id: "standard-small-user-name",
          variant: "standard",
          size: "small",
          label: "이름",
          required: true,
          dirty: true,
        });

      // 전화번호
      const contactField = document.querySelector("#user-add-modal__phone");
      contactField.innerHTML = createTextField({
        id: "standard-small-phone",
        variant: "standard",
        size: "small",
        label: "전화번호",
        required: true,
        extraAttrs: 'data-format="tel"',
        dirty: true,
      });
      initPhoneInputs(contactField); // 전화번호 포맷팅 적용

      // 생년월일
      document.querySelector("#user-add-modal__birthdate").innerHTML =
        createTextField({
          id: "standard-small-birthdate",
          variant: "standard",
          size: "small",
          label: "생년월일",
          placeholder: "예) 900101",
          onlyNumber: true,
          dirty: true,
        });

      // 주소
      document.querySelector("#user-add-modal__address").innerHTML =
        createTextField({
          id: "standard-small-address",
          variant: "standard",
          size: "small",
          label: "주소",
          dirty: true,
        });

      // 이메일
      document.querySelector("#user-add-modal__email").innerHTML =
        createTextField({
          id: "standard-small-email",
          variant: "standard",
          size: "small",
          label: "앱 계정",
          placeholder: "이메일 주소",
          tooltip:
            "앱 계정 주소를 입력하면 센터 초대가 발송되며, <br>초대 수락 시 앱으로 입장할 수 있어요.",
          dirty: true,
        });

      /* --------------------------
         담당 강사 드롭다운
         -------------------------- */
      document.querySelector("#user-add-modal__teacher").innerHTML =
        createTextField({
          id: "dropdown-teacher",
          variant: "dropdown",
          size: "small",
          label: "담당 강사",
          placeholder: "강사 선택",
          dirty: true,
        });

      // 드롭다운 항목
      const teacherItems = [
        {
          title: "김민수",
          subtitle: "010-5774-7421",
          avatar: "../../assets/images/user.jpg",
        },
        {
          title: "김정아",
          subtitle: "010-7825-1683",
          avatar: "../../assets/images/user.jpg",
        },
        {
          title: "김태형",
          subtitle: "010-3658-5442",
          avatar: "../../assets/images/user.jpg",
        },
        {
          title: "송지민",
          subtitle: "010-3215-5747",
          avatar: "../../assets/images/user.jpg",
        },
        {
          title: "이서",
          subtitle: "010-2583-0042",
          avatar: "../../assets/images/user.jpg",
        },
        {
          title: "이휘경",
          subtitle: "010-3658-5442",
          avatar: "../../assets/images/user.jpg",
        },
      ];

      // 토글 버튼 → 드롭다운 메뉴 연결
      const teacherToggle = document.getElementById("dropdown-teacher");
      if (teacherToggle) {
        const menuId = `dropdown-menu-${teacherToggle.id}`;
        teacherToggle.setAttribute("data-dropdown-target", menuId);
        teacherToggle.setAttribute("aria-controls", menuId);

        const teacherMenu = createDropdownMenu({
          id: menuId,
          size: "xs",
          withSearch: true,
          withAvatar: true,
          withCheckbox: true,
          items: teacherItems,
          unit: "명",
        });

        const dropdownWrapper = teacherToggle.closest(".dropdown");
        if (dropdownWrapper) dropdownWrapper.appendChild(teacherMenu);

        initializeDropdownSearch(teacherMenu);
        initializeDropdowns();
      }
    }

    /* --------------------------
       6. 내 센터 관리 모달
       - 센터 카드 정렬 / 나가기 버튼 처리
       -------------------------- */
    const openMyCenterBtn = document.querySelector(".my-center-setting-btn");
    if (openMyCenterBtn) {
      openMyCenterBtn.addEventListener("click", () => {
        const myCenterModal = document.querySelector(
          '.modal-overlay[data-modal="my-center-setting"]'
        );
        if (myCenterModal && typeof initializeTextFields === "function") {
          initializeTextFields(myCenterModal);
        }
      });
    }

    const list = document.querySelector(
      '.modal-overlay[data-modal="my-center-setting"] .my-center-list'
    );
    if (list) {
      // Sortable 적용 (드래그 정렬)
      loadSortable(() => {
        new Sortable(list, {
          animation: 200,
          ghostClass: "sortable-ghost",
          chosenClass: "sortable-chosen",
          forceFallback: true,
          fallbackClass: "hidden",
          direction: "vertical",
        });
      });

      // "나가기" 버튼 토글 처리
      list.addEventListener("click", (e) => {
        const btn = e.target.closest(".my-center-card__center-leave-btn");
        if (!btn) return;
        const card = btn.closest(".my-center-card");
        if (!card) return;

        const leaving = card.classList.toggle("is-leaving");
        if (leaving) {
          if (!btn.dataset.originalText)
            btn.dataset.originalText = btn.textContent.trim();
          btn.textContent = "나가기 취소";
        } else {
          btn.textContent = btn.dataset.originalText || "나가기";
        }
      });
    }

    /* --------------------------
       7. 회원 상세 페이지 전용 처리
       - 상단 메뉴 숨김 / 뒤로가기 버튼 추가
       -------------------------- */
    if (location.pathname.includes("user-detail.html")) {
      const topMenu = document.querySelector(".main-menu__top");
      if (topMenu) topMenu.style.display = "none";

      // 뒤로가기 버튼 삽입
      const backBtnWrapper = document.createElement("div");
      backBtnWrapper.className = "main-menu__top--back";
      backBtnWrapper.innerHTML = `
        <button class="menu-btn back-btn" aria-label="뒤로 가기" 
            data-tooltip-direction="right">
          <div class="icon--arrow-left menu-icon"></div>
        </button>
      `;
      const mainMenu = document.querySelector(".main-menu");
      if (mainMenu) mainMenu.insertBefore(backBtnWrapper, mainMenu.firstChild);

      // 클릭 시 사용자 관리 페이지로 이동
      backBtnWrapper
        .querySelector(".back-btn")
        .addEventListener("click", () => {
          window.location.href = "/pages/user-management/user-management.html";
        });
    }
  }
});
