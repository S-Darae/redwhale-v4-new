/**
 * ======================================================================
 * 🏠 center-home.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 홈 화면의 주요 인터랙션 스크립트 관리
 *   (헤더 날짜 표시, 메모 사이드바 CRUD, 센터 설정 가이드 토글, 자동 사이드바 오픈)
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 오늘 날짜 표시 ("25년 2월 20일 (목)" 형식)
 * 2️⃣ 메모 사이드바 - 메모 추가/수정/삭제/고정 로직
 * 3️⃣ 센터 오픈 준비 가이드 접기/펼치기 토글
 * 4️⃣ 홈 진입 시 메모 사이드바 자동 오픈
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-center-home>` 컴포넌트로 페이지 구성
 * - 메모 사이드바: `<app-memo-sidebar>` 컴포넌트로 분리
 *   → Service 기반으로 CRUD 관리
 * - 날짜 표시: `DatePipe` 또는 custom pipe로 변환
 * - 사이드바 오픈: Angular의 `ViewChild` 또는 Service 호출로 초기 open
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - center-home.scss  
 * - 사이드바, 메모 카드, 버튼, 헤더, setup-guide 섹션 스타일 포함
 * ======================================================================
 */

import "../../components/button/button.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";
import "../common/main-menu.js";
import "./center-home.scss";

/* ======================================================================
   📅 헤더 날짜 표시
   ----------------------------------------------------------------------
   ✅ 기능:
   - 오늘 날짜를 "25년 2월 20일 (목)" 형태로 표시
   - .today-date 요소 내부 텍스트 갱신
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.querySelector(".today-date");

  const today = new Date();
  const year = today.getFullYear() % 100; // 앞 두 자리 제외 → "25년"
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[today.getDay()];

  const formatted = `${year}년 ${month}월 ${date}일 (${day})`;
  if (dateEl) dateEl.textContent = formatted;
});

/* ======================================================================
   📝 메모 사이드바 (CRUD 로직)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 공통 Sidebar 컴포넌트를 기반으로 작동
   - 메모 추가, 수정, 삭제, 상단 고정(📌) 기능 담당
   - CRUD는 클라이언트 단 메모리 배열 기반 (추후 API 연동 예정)
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const memoSidebar = document.getElementById("memo-sidebar");
  const memoList = memoSidebar?.querySelector(".memo-list");
  const newMemoBtn = memoSidebar?.querySelector(".memo-sidebar__add-btn");

  // 사이드바 또는 메모 요소가 없을 경우 조기 종료
  if (!memoSidebar || !memoList || !newMemoBtn) {
    console.warn("메모 사이드바 요소 없음");
    return;
  }

  let memoIndex = 0; // 생성 순번 (정렬용)
  let pinIndex = 0; // 고정 순번 (정렬용)

  // 메모 카드 색상 후보 리스트
  const colorClasses = [
    "sandbeige", "sunnyyellow", "oliveleaf", "freshgreen", "aquabreeze",
    "bluesky", "lavendermist", "pinkpop", "peachglow", "coralred",
  ];

  // 현재 시각 반환 (yyyy.MM.dd hh:mm)
  const getTimeStamp = () => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  /* ------------------------------------------------------
     🆕 1. 새 메모 카드 추가
     ------------------------------------------------------ */
  newMemoBtn.addEventListener("click", () => {
    const newCard = document.createElement("div");
    const color = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    newCard.className = `memo-card memo-color--${color}`;
    newCard.setAttribute("data-index", memoIndex++);
    newCard.setAttribute("data-color", color);

    // 작성 모드 UI
    newCard.innerHTML = `
      <textarea class="memo-textarea" placeholder="메모 입력"></textarea>
      <div class="memo-card__footer">
        <button class="btn btn--outlined btn--neutral btn--small cancel-btn">취소</button>
        <button class="btn btn--outlined btn--neutral btn--small save-btn">저장</button>
      </div>
    `;

    // 고정되지 않은 카드 위쪽에 추가
    memoList.insertBefore(newCard, findFirstNonPinned());
    newCard.querySelector("textarea").focus();

    // 취소 버튼 → 카드 제거
    newCard.querySelector(".cancel-btn")
      .addEventListener("click", () => newCard.remove());

    // 저장 버튼 → 저장 모드로 전환
    newCard.querySelector(".save-btn").addEventListener("click", () => {
      const text = newCard.querySelector("textarea").value.trim();
      if (!text) return;

      const timestamp = getTimeStamp();
      const index = newCard.dataset.index;
      const color = newCard.dataset.color;

      // 저장 모드 UI로 변경
      newCard.className = `memo-card is-saved memo-color--${color}`;
      newCard.innerHTML = `
        <div class="pin-icon" style="display: none;">📌</div>
        <div class="memo-text">${text}</div>
        <div class="memo-card__author">
          <div class="author-info">
            <div class="author-avatar"></div>
            <div class="author-name">송다래</div>
          </div>
          <div class="author-date">${timestamp}</div>
          <button class="btn--icon-utility memo-card__menu-btn" aria-label="더보기">
            <div class="icon--dots-three icon"></div>
          </button>
          <ul class="memo-card__menu-list">
            <li class="pin-toggle">상단 고정</li>
            <li class="edit">수정</li>
            <li class="delete">삭제</li>
          </ul>
        </div>
      `;
      bindMemoCardEvents(newCard);
      reorderMemos();
    });
  });

  // 메모가 하나도 없을 경우 자동 생성
  if (memoList.children.length === 0) newMemoBtn.click();

  /* ------------------------------------------------------
     🔝 2. 메모 정렬 로직
     ------------------------------------------------------ */
  function findFirstNonPinned() {
    const cards = [...memoList.children];
    return cards.find((el) => !el.classList.contains("pinned")) || null;
  }

  function reorderMemos() {
    const cards = [...memoList.querySelectorAll(".memo-card")];
    const pinned = cards
      .filter((c) => c.classList.contains("pinned"))
      .sort((a, b) => +b.dataset.pin - +a.dataset.pin);
    const normal = cards
      .filter((c) => !c.classList.contains("pinned"))
      .sort((a, b) => +b.dataset.index - +a.dataset.index);
    [...pinned, ...normal].forEach((card) => memoList.appendChild(card));
  }

  /* ------------------------------------------------------
     🧩 3. 카드 개별 이벤트 (고정/수정/삭제)
     ------------------------------------------------------ */
  function bindMemoCardEvents(card) {
    const pinIcon = card.querySelector(".pin-icon");
    const menuBtn = card.querySelector(".memo-card__menu-btn");
    const menuList = card.querySelector(".memo-card__menu-list");
    const textBlock = card.querySelector(".memo-text");
    const dateText = card.querySelector(".author-date")?.textContent || getTimeStamp();

    // "..." 메뉴 토글
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".memo-card__menu-list")
        .forEach((m) => (m.style.display = "none"));
      menuList.style.display = "block";
    });
    document.addEventListener("click", () => (menuList.style.display = "none"));

    // 📌 고정/해제
    menuList.querySelector(".pin-toggle").addEventListener("click", () => {
      const isPinned = card.classList.contains("pinned");
      const toggle = menuList.querySelector(".pin-toggle");

      if (isPinned) {
        card.classList.remove("pinned");
        card.removeAttribute("data-pin");
        toggle.textContent = "상단 고정";
        pinIcon.style.display = "none";
      } else {
        card.classList.add("pinned");
        card.setAttribute("data-pin", ++pinIndex);
        toggle.textContent = "상단 고정 해제";
        pinIcon.style.display = "inline";
      }
      reorderMemos();
    });

    // ✏ 수정 모드
    menuList.querySelector(".edit").addEventListener("click", () => {
      const original = textBlock.textContent;
      const color = card.dataset.color;
      const index = card.dataset.index;
      const isPinned = card.classList.contains("pinned");
      const pinData = card.dataset.pin;

      // 수정 모드 UI로 전환
      card.className = `memo-card memo-color--${color}`;
      if (isPinned) card.classList.add("pinned");
      card.innerHTML = `
        <textarea class="memo-textarea">${original.trim()}</textarea>
        <div class="memo-card__footer">
          <button class="btn btn--outlined btn--neutral btn--small cancel-btn">취소</button>
          <button class="btn btn--outlined btn--neutral btn--small save-btn">저장</button>
        </div>
      `;

      // 취소 → 원상복귀
      card.querySelector(".cancel-btn").addEventListener("click", () => {
        card.className = `memo-card is-saved memo-color--${color}`;
        if (isPinned) {
          card.classList.add("pinned");
          card.setAttribute("data-pin", pinData);
        }
        card.innerHTML = `
          <div class="pin-icon" style="${isPinned ? "display:inline" : "display:none"}">📌</div>
          <div class="memo-text">${original}</div>
          <div class="memo-card__author">
            <div class="author-info">
              <div class="author-avatar"></div>
              <div class="author-name">송다래</div>
            </div>
            <div class="author-date">${dateText}</div>
            <button class="btn--icon-utility memo-card__menu-btn" aria-label="더보기">
              <div class="icon--dots-three icon"></div>
            </button>
            <ul class="memo-card__menu-list">
              <li class="pin-toggle">${isPinned ? "상단 고정 해제" : "상단 고정"}</li>
              <li class="edit">수정</li>
              <li class="delete">삭제</li>
            </ul>
          </div>
        `;
        bindMemoCardEvents(card);
        reorderMemos();
      });

      // 저장 → 내용 갱신 후 원상복귀
      card.querySelector(".save-btn").addEventListener("click", () => {
        const newText = card.querySelector("textarea").value;
        card.querySelector(".cancel-btn").click(); // 복원 실행
        card.querySelector(".memo-text").textContent = newText;
      });
    });

    // 🗑 삭제
    menuList.querySelector(".delete").addEventListener("click", () => {
      card.remove();
    });
  }

  // 기존 카드에도 이벤트 등록
  memoList.querySelectorAll(".memo-card").forEach((card) => {
    bindMemoCardEvents(card);
  });
});

/* ======================================================================
   🧩 센터 오픈 준비 섹션 (setup-guide) 토글
   ----------------------------------------------------------------------
   ✅ 기능:
   - 접기 / 펼치기 버튼 클릭 시 본문 영역 show/hide
   - 텍스트 및 아이콘 방향 실시간 전환
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".setup-guide__header button");
  const setupBody = document.querySelector(".setup-guide__body");
  const toggleText = toggleButton.querySelector("div:first-child");
  const toggleIcon = toggleButton.querySelector(".icon");

  toggleButton.addEventListener("click", () => {
    const isCollapsed = setupBody.classList.toggle("collapsed");
    toggleText.textContent = isCollapsed ? "펼치기" : "접기";
    toggleIcon.classList.toggle("icon--caret-up", !isCollapsed);
    toggleIcon.classList.toggle("icon--caret-down", isCollapsed);
  });
});

/* ======================================================================
   🚀 홈 진입 시 메모 사이드바 자동 오픈
   ----------------------------------------------------------------------
   ✅ 기능:
   - 페이지 로드 시 memo-sidebar 자동 열기
   - Sidebar 공통 클래스의 open() 메서드 사용
   ====================================================================== */
import Sidebar from "../../components/sidebar/sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
  const memoSidebarEl = document.getElementById("memo-sidebar");
  if (memoSidebarEl) {
    const memoSidebar = new Sidebar(memoSidebarEl);
    memoSidebar.open(); // 페이지 진입 시 자동 오픈
  }
});
