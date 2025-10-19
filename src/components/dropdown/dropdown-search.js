// ======================================================================
// 🔍 Dropdown Search Utility (드롭다운 검색 + 키보드 네비게이션)
// ----------------------------------------------------------------------
// ✅ 역할:
// - 드롭다운 내부에서 실시간 검색 및 초성 검색 지원 (한글 자모 분리 포함)
// - "검색 결과 없음" 상태 표시
// - 방향키(↑↓), Enter, ESC 키로 리스트 탐색 및 선택 제어
// ----------------------------------------------------------------------
// ⚙️ 주요 함수:
// - decomposeHangul() : 한글 자모 분리 (초성 검색 지원)
// - initializeDropdownSearch() : 드롭다운 내 검색 입력 및 키보드 네비게이션 활성화
// ----------------------------------------------------------------------
// 🧩 Angular 변환 가이드
// - decomposeHangul() → 순수 유틸 함수 그대로 사용 가능 (service/util)
// - initializeDropdownSearch() → `DropdownSearchDirective` 로 분리
//   1️⃣ @Input() items: DropdownItem[]
//   2️⃣ @Output() select = new EventEmitter<DropdownItem>()
// - ESC/Enter/Arrow 키 제어는 HostListener로 변환
// - DOM 업데이트(mark 표시)는 *ngFor + [innerHTML] 로 대체
// ======================================================================

// ======================================================================
// 🧩 한글 자모 분리 (초성 검색 지원)
// ----------------------------------------------------------------------
// 예: "강" → "ㄱㅏㅇ", "김" → "ㄱㅣㅁ"
// 초성/중성/종성 배열을 조합하여 문자열을 자모 단위로 변환
// 검색어와 항목 텍스트의 초성 일치 여부 판별 가능
// Angular: 그대로 utility 함수로 import 가능
// ======================================================================
function decomposeHangul(text) {
  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const JUNG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const JONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const index = code - 0xac00;
        const cho = CHO[Math.floor(index / 588)];
        const jung = JUNG[Math.floor((index % 588) / 28)];
        const jong = JONG[index % 28];
        return cho + jung + jong;
      }
      return char;
    })
    .join("");
}

// ======================================================================
// 🔍 드롭다운 검색 + 키보드 네비게이션 초기화
// ----------------------------------------------------------------------
// @param {HTMLElement} menuEl - 드롭다운 메뉴 요소
// ✅ 기능 요약:
// - 실시간 텍스트 / 초성 검색 (자모 단위 매칭)
// - 일치 항목 하이라이팅 (<mark>)
// - 방향키/엔터/ESC 입력 처리
// - 검색 결과 없음 시 안내 메시지 표시
// ----------------------------------------------------------------------
// 🧩 Angular 변환 시:
// - @ViewChild('searchInput') input: ElementRef;
// - @HostListener('keydown', ['$event']) 로 키보드 이벤트 바인딩
// - 검색 결과 필터링은 pipe 또는 computed()로 구현
// ======================================================================
export function initializeDropdownSearch(menuEl) {
  if (!menuEl) return;

  const searchInput = menuEl.querySelector(".dropdown__search-input");
  if (!searchInput) return;

  const items = Array.from(menuEl.querySelectorAll(".dropdown__item"));
  let focusedIndex = -1;

  // ======================================================
  // "검색 결과 없음" 메시지 엘리먼트 초기화
  // ======================================================
  let emptyMsg = menuEl.querySelector(".dropdown__empty");
  if (!emptyMsg) {
    emptyMsg = document.createElement("div");
    emptyMsg.className = "dropdown__empty";

    const icon = document.createElement("i");
    icon.className = "icon--warning icon";
    emptyMsg.appendChild(icon);
    emptyMsg.append(" 검색 결과가 없어요.");

    emptyMsg.style.display = "none";
    menuEl.appendChild(emptyMsg);
  }

  // ======================================================
  // 원본 텍스트 저장 (검색 하이라이트용)
  // ------------------------------------------------------
  // - title, subtitle, label, span의 원문을 dataset에 캐싱
  // - 검색 후 하이라이트 적용 시 원문 복원 가능
  // ======================================================
  items.forEach((item) => {
    const title = item.querySelector(".dropdown__title");
    const subtitle = item.querySelector(".dropdown__subtitle");
    const span = item.querySelector("span");
    const label = item.querySelector("label");

    if (title && !item.dataset.originalTitle)
      item.dataset.originalTitle = title.textContent.trim();
    if (subtitle && !item.dataset.originalSubtitle)
      item.dataset.originalSubtitle = subtitle.textContent.trim();
    if (!title && (span || label) && !item.dataset.originalSingle)
      item.dataset.originalSingle = (
        span?.textContent ||
        label?.textContent ||
        ""
      ).trim();

    // 통합 검색 텍스트 구성
    item.dataset.originalText =
      (item.dataset.originalTitle || "") +
      (item.dataset.originalSubtitle
        ? " " + item.dataset.originalSubtitle
        : "") +
      (item.dataset.originalSingle || "");
  });

  // ======================================================
  // 🧭 검색 입력 이벤트 (input)
  // ------------------------------------------------------
  // - 실시간으로 value / 초성 분리 문자열 비교
  // - 일치 항목만 표시하고 하이라이트 처리
  // - 검색 결과 없으면 emptyMsg 표시
  // ======================================================
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();
    const decomposedValue = decomposeHangul(value);

    let matchCount = 0;
    items.forEach((item) => {
      const text = item.dataset.originalText.toLowerCase();
      const decomposedText = decomposeHangul(text);

      const match =
        text.includes(value) ||
        text.startsWith(value) ||
        decomposedText.includes(decomposedValue) ||
        decomposedText.startsWith(decomposedValue);

      if (match) {
        matchCount++;
        item.style.display = "flex"; // 유지 (flex 구조)

        const title = item.querySelector(".dropdown__title");
        const subtitle = item.querySelector(".dropdown__subtitle");
        const span = item.querySelector("span");
        const label = item.querySelector("label");

        if (value.length > 0) {
          const regex = new RegExp(`(${value})`, "gi");

          // 하이라이트 처리 (mark)
          if (title && item.dataset.originalTitle)
            title.innerHTML = item.dataset.originalTitle.replace(
              regex,
              "<mark>$1</mark>"
            );
          if (subtitle && item.dataset.originalSubtitle)
            subtitle.innerHTML = item.dataset.originalSubtitle.replace(
              regex,
              "<mark>$1</mark>"
            );
          if (!title && (span || label) && item.dataset.originalSingle) {
            const safeText = item.dataset.originalSingle;
            if (span)
              span.innerHTML = safeText.replace(regex, "<mark>$1</mark>");
            if (label)
              label.innerHTML = safeText.replace(regex, "<mark>$1</mark>");
          }
        } else {
          // 검색어가 없으면 원문 복원
          if (title && item.dataset.originalTitle)
            title.textContent = item.dataset.originalTitle;
          if (subtitle && item.dataset.originalSubtitle)
            subtitle.textContent = item.dataset.originalSubtitle;
          if (!title && (span || label) && item.dataset.originalSingle) {
            if (span) span.textContent = item.dataset.originalSingle;
            if (label) label.textContent = item.dataset.originalSingle;
          }
        }
      } else {
        item.style.display = "none";
      }
    });

    // 검색 결과 없을 시 표시
    emptyMsg.style.display = matchCount === 0 ? "block" : "none";
    focusedIndex = -1;
  });

  // ======================================================
  // ⌨️ 키보드 네비게이션
  // ------------------------------------------------------
  // ↑, ↓ : 포커스 이동
  // Enter : 선택
  // ESC : 드롭다운 닫기
  // ======================================================
  searchInput.addEventListener("keydown", (e) => {
    const visibleItems = items.filter((item) => item.style.display !== "none");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (visibleItems.length === 0) return;
      focusedIndex = (focusedIndex + 1) % visibleItems.length;
      updateFocus(visibleItems, focusedIndex);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (visibleItems.length === 0) return;
      focusedIndex =
        (focusedIndex - 1 + visibleItems.length) % visibleItems.length;
      updateFocus(visibleItems, focusedIndex);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && visibleItems[focusedIndex]) {
        visibleItems[focusedIndex].click(); // 실제 선택 트리거
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      searchInput.blur();
      const dropdown = menuEl.closest(".dropdown");
      if (dropdown) {
        const toggle = dropdown.querySelector(".dropdown__toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        menuEl.classList.remove("visible");
      }
    }
  });

  // ======================================================
  // 🔦 포커스 표시 업데이트
  // ------------------------------------------------------
  // - focused 클래스 토글
  // - 포커스된 항목 자동 스크롤
  // ======================================================
  function updateFocus(list, index) {
    list.forEach((item, i) => {
      if (i === index) {
        item.classList.add("focused");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("focused");
      }
    });
  }
}
