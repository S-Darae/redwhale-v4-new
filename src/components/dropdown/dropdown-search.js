// ===============================
// 한글 자모 분리 (초성 검색 지원)
// ===============================
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

// ===============================
// 드롭다운 검색 + 키보드 네비게이션
// ===============================
export function initializeDropdownSearch(menuEl) {
  if (!menuEl) return;

  const searchInput = menuEl.querySelector(".dropdown__search-input");
  if (!searchInput) return;

  const items = Array.from(menuEl.querySelectorAll(".dropdown__item"));
  let focusedIndex = -1;

  // "검색 결과 없음" 메시지
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

  // 원본 텍스트 저장 (title / subtitle 분리)
  items.forEach((item) => {
    const title = item.querySelector(".dropdown__title");
    const subtitle = item.querySelector(".dropdown__subtitle");
    const span = item.querySelector("span");
    const label = item.querySelector("label");

    if (title && !item.dataset.originalTitle) {
      item.dataset.originalTitle = title.textContent.trim();
    }
    if (subtitle && !item.dataset.originalSubtitle) {
      item.dataset.originalSubtitle = subtitle.textContent.trim();
    }
    if (!title && (span || label) && !item.dataset.originalSingle) {
      item.dataset.originalSingle = (
        span?.textContent ||
        label?.textContent ||
        ""
      ).trim();
    }

    // 검색 매칭용: title + subtitle 통합
    item.dataset.originalText =
      (item.dataset.originalTitle || "") +
      (item.dataset.originalSubtitle
        ? " " + item.dataset.originalSubtitle
        : "") +
      (item.dataset.originalSingle || "");
  });

  // ===============================
  // 검색 입력 처리
  // ===============================
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
        item.style.display = "flex"; // 아바타/체크박스 구조 유지

        const title = item.querySelector(".dropdown__title");
        const subtitle = item.querySelector(".dropdown__subtitle");
        const span = item.querySelector("span");
        const label = item.querySelector("label");

        if (value.length > 0) {
          const regex = new RegExp(`(${value})`, "gi");

          if (title && item.dataset.originalTitle) {
            title.innerHTML = item.dataset.originalTitle.replace(
              regex,
              "<mark>$1</mark>"
            );
          }
          if (subtitle && item.dataset.originalSubtitle) {
            subtitle.innerHTML = item.dataset.originalSubtitle.replace(
              regex,
              "<mark>$1</mark>"
            );
          }
          if (!title && (span || label) && item.dataset.originalSingle) {
            const safeText = item.dataset.originalSingle;
            if (span)
              span.innerHTML = safeText.replace(regex, "<mark>$1</mark>");
            if (label)
              label.innerHTML = safeText.replace(regex, "<mark>$1</mark>");
          }
        } else {
          if (title && item.dataset.originalTitle) {
            title.textContent = item.dataset.originalTitle;
          }
          if (subtitle && item.dataset.originalSubtitle) {
            subtitle.textContent = item.dataset.originalSubtitle;
          }
          if (!title && (span || label) && item.dataset.originalSingle) {
            if (span) span.textContent = item.dataset.originalSingle;
            if (label) label.textContent = item.dataset.originalSingle;
          }
        }
      } else {
        item.style.display = "none";
      }
    });

    emptyMsg.style.display = matchCount === 0 ? "block" : "none";
    focusedIndex = -1;
  });

  // ===============================
  // 키보드 네비게이션
  // ===============================
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
        visibleItems[focusedIndex].click(); // 선택
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

  // ===============================
  // 포커스 표시 업데이트
  // ===============================
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
