import "../../components/button/button.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";
import "../../pages/common/main-menu.js";
import "./center-home.scss";

/* ==========================
   📌 헤더 날짜 표시
   - 오늘 날짜를 "25년 2월 20일 (목)" 형태로 포맷
   ========================== */
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

/* ==========================
   📌 메모 사이드바 (메모 CRUD 로직)
   - 공통 Sidebar 컴포넌트에 올라탄 상태
   - 여기서는 "메모 카드 추가/수정/삭제/고정" 로직만 담당
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const memoSidebar = document.getElementById("memo-sidebar"); // 사이드바 DOM
  const memoList = memoSidebar?.querySelector(".memo-list"); // 메모 카드 리스트
  const newMemoBtn = memoSidebar?.querySelector(".memo-sidebar__add-btn"); // "메모 추가" 버튼

  // 사이드바/메모 요소가 없을 경우 → 조기 종료
  if (!memoSidebar || !memoList || !newMemoBtn) {
    console.warn("메모 사이드바 요소 없음");
    return;
  }

  let memoIndex = 0; // 생성 순번 (정렬 기준)
  let pinIndex = 0; // 고정 순번 (정렬 기준)

  // 메모 카드 랜덤 색상 후보군
  const colorClasses = [
    "sandbeige",
    "sunnyyellow",
    "oliveleaf",
    "freshgreen",
    "aquabreeze",
    "bluesky",
    "lavendermist",
    "pinkpop",
    "peachglow",
    "coralred",
  ];

  // 현재 시각 yyyy.MM.dd hh:mm 포맷으로 반환
  const getTimeStamp = () => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  /* --------------------------
     1. 새 메모 카드 추가
     -------------------------- */
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
    newCard
      .querySelector(".cancel-btn")
      .addEventListener("click", () => newCard.remove());

    // 저장 버튼 → 카드 저장 모드로 변경
    newCard.querySelector(".save-btn").addEventListener("click", () => {
      const text = newCard.querySelector("textarea").value.trim();
      if (!text) return; // 빈 값 방지

      const timestamp = getTimeStamp();
      const index = newCard.getAttribute("data-index");
      const color = newCard.getAttribute("data-color");

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
      bindMemoCardEvents(newCard); // 카드 이벤트 등록
      reorderMemos(); // 정렬 갱신
    });
  });

  // 메모 없으면 자동으로 1개 추가
  if (memoList.children.length === 0) {
    newMemoBtn.click();
  }

  /* --------------------------
     2. 카드 정렬
     - pinned → 상단 고정
     - 나머지 → 생성 순
     -------------------------- */
  function findFirstNonPinned() {
    const cards = [...memoList.children];
    return cards.find((el) => !el.classList.contains("pinned")) || null;
  }

  function reorderMemos() {
    const cards = [...memoList.querySelectorAll(".memo-card")];
    const pinned = cards
      .filter((c) => c.classList.contains("pinned"))
      .sort((a, b) => +b.dataset.pin - +a.dataset.pin); // pinIndex 큰 순
    const normal = cards
      .filter((c) => !c.classList.contains("pinned"))
      .sort((a, b) => +b.dataset.index - +a.dataset.index); // 생성 순
    [...pinned, ...normal].forEach((card) => memoList.appendChild(card));
  }

  /* --------------------------
     3. 카드 이벤트 (고정/수정/삭제)
     -------------------------- */
  function bindMemoCardEvents(card) {
    const pinIcon = card.querySelector(".pin-icon");
    const menuBtn = card.querySelector(".memo-card__menu-btn");
    const menuList = card.querySelector(".memo-card__menu-list");
    const textBlock = card.querySelector(".memo-text");
    const dateText =
      card.querySelector(".author-date")?.textContent || getTimeStamp();

    // "..." 메뉴 열기/닫기
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll(".memo-card__menu-list")
        .forEach((m) => (m.style.display = "none"));
      menuList.style.display = "block";
    });
    document.addEventListener("click", () => {
      menuList.style.display = "none";
    });

    // 고정 토글
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

    // 수정 모드 전환
    menuList.querySelector(".edit").addEventListener("click", () => {
      const original = textBlock.textContent;
      const color = card.getAttribute("data-color");
      const index = card.getAttribute("data-index");
      const isPinned = card.classList.contains("pinned");
      const pinData = card.getAttribute("data-pin");

      // 수정 모드 UI
      card.className = `memo-card memo-color--${color}`;
      if (isPinned) card.classList.add("pinned");
      card.innerHTML = `
        <textarea class="memo-textarea">${original.trim()}</textarea>
        <div class="memo-card__footer">
          <button class="btn btn--outlined btn--neutral btn--small cancel-btn">취소</button>
          <button class="btn btn--outlined btn--neutral btn--small save-btn">저장</button>
        </div>
      `;

      // 취소 → 원상복구
      card.querySelector(".cancel-btn").addEventListener("click", () => {
        card.className = `memo-card is-saved memo-color--${color}`;
        if (isPinned) {
          card.classList.add("pinned");
          card.setAttribute("data-pin", pinData);
        }
        card.innerHTML = `
          <div class="pin-icon" style="${
            isPinned ? "display:inline" : "display:none"
          }">📌</div>
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
              <li class="pin-toggle">${
                isPinned ? "상단 고정 해제" : "상단 고정"
              }</li>
              <li class="edit">수정</li>
              <li class="delete">삭제</li>
            </ul>
          </div>
        `;
        bindMemoCardEvents(card);
        reorderMemos();
      });

      // 저장 → 텍스트 갱신 후 원상복구
      card.querySelector(".save-btn").addEventListener("click", () => {
        const newText = card.querySelector("textarea").value;
        card.querySelector(".cancel-btn").click(); // 원상복구 실행
        card.querySelector(".memo-text").textContent = newText;
      });
    });

    // 삭제
    menuList.querySelector(".delete").addEventListener("click", () => {
      card.remove();
    });
  }

  // 기존 저장된 카드들도 이벤트 등록
  memoList.querySelectorAll(".memo-card").forEach((card) => {
    bindMemoCardEvents(card);
  });
});

/* ==========================
   📌 센터 오픈 준비 섹션 접기/펼치기
   ========================== */
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
