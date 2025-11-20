/**
 * ======================================================================
 * 🏠 center-home.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 홈 화면의 주요 인터랙션 스크립트 관리
 *   (헤더 날짜 표시, 메모 CRUD, 센터 설정 가이드 토글, 자동 사이드바 오픈)
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-center-home>` 컴포넌트로 페이지 구성
 * - 날짜 표시: `DatePipe` 또는 custom pipe로 변환
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - center-home.scss  
 * - 메모 카드, 버튼, 헤더, setup-guide 섹션 스타일 포함
 * ======================================================================
 */

import "../../components/button/button.js";
import "../../components/sidebar/sidebar.js";
import "../../components/tooltip/tooltip.js";
import "../common/main-menu.js";
import "./center-home.scss";

/* ============================================================
   📌 UTIL — 공통 유틸
============================================================ */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

const nowTimestamp = () => {
  const n = new Date();
  return `${n.getFullYear()}.${String(n.getMonth() + 1).padStart(2, "0")}.${String(
    n.getDate()
  ).padStart(2, "0")} ${String(n.getHours()).padStart(2, "0")}:${String(
    n.getMinutes()
  ).padStart(2, "0")}`;
};

const DEFAULT_COLOR = "sandbeige";

/* ============================================================
   📌 1) 메모 템플릿 생성 함수
============================================================ */
function createMemoCardHTML({ text, date, pinned, pinIndex }) {
  return `
    <i class="icon--push-pin-fill pin-icon icon" style="${
      pinned ? "display:inline-block" : "display:none"
    }"></i>

    <div class="memo-text">${text}</div>

    <div class="memo-card__author">
      <div class="author-info">
        <div class="author-avatar"></div>
        <div class="author-name">송다래</div>
      </div>

      <div class="author-date">${date}</div>

      <button class="btn--icon-utility memo-card__menu-btn" aria-label="더보기">
        <div class="icon--dots-three icon"></div>
      </button>

      <ul class="memo-card__menu-list">
        <li class="pin-toggle">${pinned ? "상단 고정 해제" : "상단 고정"}</li>
        <li class="edit">수정</li>
        <li class="delete">삭제</li>
      </ul>
    </div>
  `;
}

/* ============================================================
   📌 2) 수정 모드 템플릿
============================================================ */
function createEditModeHTML(text) {
  return `
    <textarea class="memo-textarea">${text}</textarea>
    <div class="memo-card__footer">
      <button class="btn btn--outlined btn--neutral btn--small cancel-btn">취소</button>
      <button class="btn btn--outlined btn--neutral btn--small save-btn">저장</button>
    </div>
  `;
}

/* ============================================================
   📌 3) 메모 DOM 생성
============================================================ */
function createMemoElement({ text, index, date, pinned = false, pinIndex = null }) {
  const card = document.createElement("div");
  card.className = `memo-card is-saved memo-color--${DEFAULT_COLOR}`;
  card.dataset.index = index;

  if (pinned) {
    card.classList.add("pinned");
    card.dataset.pin = pinIndex;
  }

  card.innerHTML = createMemoCardHTML({ text, date, pinned, pinIndex });
  return card;
}

/* ============================================================
   📌 4) 스르륵 이동 애니메이션
============================================================ */
function animateReorder(listEl) {
  const items = qsa(".memo-card", listEl);
  const before = items.map((el) => el.getBoundingClientRect());

  const pinned = items
    .filter((i) => i.classList.contains("pinned"))
    .sort((a, b) => b.dataset.pin - a.dataset.pin);

  const normal = items
    .filter((i) => !i.classList.contains("pinned"))
    .sort((a, b) => b.dataset.index - a.dataset.index);

  [...pinned, ...normal].forEach((el) => listEl.appendChild(el));

  const after = items.map((el) => el.getBoundingClientRect());

  items.forEach((el, i) => {
    const dy = before[i].top - after[i].top;
    if (dy !== 0) {
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;

      requestAnimationFrame(() => {
        el.style.transition = "transform 0.3s ease";
        el.style.transform = "translateY(0)";
      });

      el.addEventListener(
        "transitionend",
        () => {
          el.style.transition = "";
          el.style.transform = "";
        },
        { once: true }
      );
    }
  });
}

/* ============================================================
   📌 5) 메모 카드 이벤트 바인딩
============================================================ */
function bindMemoEvents(card, state) {
  const menuBtn = qs(".memo-card__menu-btn", card);
  const menuList = qs(".memo-card__menu-list", card);
  const pinIcon = qs(".pin-icon", card);
  const memoText = qs(".memo-text", card);
  const dateText = qs(".author-date", card)?.textContent ?? "";

  /* 메뉴 열기 */
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    qsa(".memo-card__menu-list").forEach((m) => (m.style.display = "none"));
    menuList.style.display = "block";
  });

  document.addEventListener("click", () => {
    menuList.style.display = "none";
  });

  /* 상단 고정 */
  qs(".pin-toggle", menuList).addEventListener("click", () => {
    const pinned = card.classList.contains("pinned");
    const toggleBtn = qs(".pin-toggle", menuList);

    if (pinned) {
      card.classList.remove("pinned");
      delete card.dataset.pin;
      pinIcon.style.display = "none";
      toggleBtn.textContent = "상단 고정";
    } else {
      card.classList.add("pinned");
      card.dataset.pin = ++state.pinIndex;
      pinIcon.style.display = "inline-block";
      toggleBtn.textContent = "상단 고정 해제";
    }

    animateReorder(state.list);
  });

  /* 수정 모드 */
  qs(".edit", menuList).addEventListener("click", () => {
    const original = memoText.textContent;
    const pinned = card.classList.contains("pinned");
    const pinData = card.dataset.pin;

    card.className = `memo-card memo-color--${DEFAULT_COLOR}`;
    if (pinned) card.classList.add("pinned");

    card.innerHTML = createEditModeHTML(original);

    const textarea = qs("textarea", card);
    textarea.focus();

    const restore = () => {
      card.className = `memo-card is-saved memo-color--${DEFAULT_COLOR}`;
      if (pinned) {
        card.classList.add("pinned");
        card.dataset.pin = pinData;
      }

      card.innerHTML = createMemoCardHTML({
        text: original,
        date: dateText,
        pinned,
        pinIndex: pinData,
      });

      bindMemoEvents(card, state);
    };

    const save = () => {
      const newText = textarea.value.trim();
      card.className = `memo-card is-saved memo-color--${DEFAULT_COLOR}`;

      card.innerHTML = createMemoCardHTML({
        text: newText,
        date: dateText,
        pinned,
        pinIndex: pinData,
      });

      bindMemoEvents(card, state);
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") restore();
      if (e.key === "Enter" && e.ctrlKey) save();
    });

    qs(".cancel-btn", card).addEventListener("click", restore);
    qs(".save-btn", card).addEventListener("click", save);
  });

  /* 삭제 */
  qs(".delete", menuList).addEventListener("click", () => {
    card.remove();
  });
}

/* ============================================================
   📌 6) 메모 CRUD (초기화 + 신규 추가 + 초기 메모)
============================================================ */
function initHomeMemo() {
  const list = qs(".home-memo .memo-list");
  const addBtn = qs(".home-memo__add-btn");

  if (!list || !addBtn) return;

  const state = {
    list,
    memoIndex: 0,
    pinIndex: 0,
  };

  /* 신규 메모 추가 */
  addBtn.addEventListener("click", () => {
    const card = createMemoElement({
      text: "",
      index: state.memoIndex++,
      date: nowTimestamp(),
    });

    card.innerHTML = createEditModeHTML("");

    list.prepend(card);
    const textarea = qs("textarea", card);
    textarea.focus();

    const save = () => {
      const newText = textarea.value.trim();
      if (!newText) return;

      card.className = `memo-card is-saved memo-color--${DEFAULT_COLOR}`;
      card.innerHTML = createMemoCardHTML({
        text: newText,
        date: nowTimestamp(),
        pinned: false,
        pinIndex: null,
      });

      bindMemoEvents(card, state);
      animateReorder(state.list);
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") card.remove();
      if (e.key === "Enter" && e.ctrlKey) save();
    });

    qs(".save-btn", card).addEventListener("click", save);
    qs(".cancel-btn", card).addEventListener("click", () => card.remove());
  });

  /* 초기 메모 1개 생성 */
  const initCard = createMemoElement({
    text: "내일 비오니까 마감 직원은 창문 점검 후 퇴근해주세요~!",
    date: "2025.01.01 10:30",
    index: state.memoIndex++,
    pinned: false,
  });

  list.appendChild(initCard);
  bindMemoEvents(initCard, state);
}

document.addEventListener("DOMContentLoaded", initHomeMemo);

/* ======================================================================
   🧩 센터 오픈 준비 섹션 (setup-guide) 토글
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = qs(".setup-guide__header button");
  const body = qs(".setup-guide__body");
  const text = qs("div:first-child", btn);
  const icon = qs(".icon", btn);

  btn.addEventListener("click", () => {
    const collapsed = body.classList.toggle("collapsed");
    text.textContent = collapsed ? "펼치기" : "접기";
    icon.classList.toggle("icon--caret-up", !collapsed);
    icon.classList.toggle("icon--caret-down", collapsed);
  });
});

/* ======================================================================
   📅 헤더 날짜 표시
   ----------------------------------------------------------------------
   - 오늘 날짜를 "25년 2월 20일 (목)" 형태로 표시
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const el = qs(".today-date");
  if (!el) return;

  const d = new Date();
  const year = d.getFullYear() % 100;
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  el.textContent = `${year}년 ${month}월 ${date}일 (${days[d.getDay()]})`;
});

