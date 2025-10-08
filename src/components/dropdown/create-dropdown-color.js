import "./dropdown-color.scss";

/* ==========================
   🎨 색상 드롭다운 고정값
   - 시스템에서 사용할 대표 라벨 색상 (500 계열)
   - value: 내부에서 사용할 키값
   - hex: CSS 변수로 정의된 실제 색상
   ========================== */
export const labelColors = [
  { value: "gray-100", hex: "var(--gray-100)" },
  { value: "gray-300", hex: "var(--gray-300)" },
  { value: "gray-500", hex: "var(--gray-500)" },
  { value: "gray-700", hex: "var(--gray-700)" },
  { value: "black", hex: "var(--black)" },
  { value: "sunnyyellow", hex: "var(--label-sunnyyellow-500)" },
  { value: "sandbeige", hex: "var(--label-sandbeige-500)" },
  { value: "peachglow", hex: "var(--label-peachglow-500)" },
  { value: "pinkpop", hex: "var(--label-pinkpop-500)" },
  { value: "coralred", hex: "var(--label-coralred-500)" },
  { value: "oliveleaf", hex: "var(--label-oliveleaf-500)" },
  { value: "freshgreen", hex: "var(--label-freshgreen-500)" },
  { value: "aquabreeze", hex: "var(--label-aquabreeze-500)" },
  { value: "bluesky", hex: "var(--label-bluesky-500)" },
  { value: "lavendermist", hex: "var(--label-lavendermist-500)" },
];

/* ==========================
   🎨 색상 드롭다운 토글 생성
   - 토글 버튼은 "컬러칩 + caret 아이콘" 형태
   - placeholder 텍스트는 없으며,
     기본값으로 `labelColors`의 첫 번째 색상이 반영됨
   - 접근성: aria-label 로 현재 색상 읽히도록 보강
   ========================== */
export function createColorDropdownToggle({ id, disabled = false }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "dropdown__toggle dropdown__toggle--color";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", id);
  button.dataset.dropdownTarget = id;
  if (disabled) button.setAttribute("disabled", "true");

  // 초기 상태는 첫 번째 색상으로 표시
  const firstColor = labelColors[0];
  button.innerHTML = `
    <span class="color-circle" style="background-color:${firstColor.hex}"></span>
    <i class="icon--caret-down icon"></i>
  `;

  // ⭐ 접근성: 현재 선택된 색상을 스크린리더가 알 수 있게 설정
  button.setAttribute("aria-label", `색상 선택: ${firstColor.value}`);

  return button;
}

/* ==========================
   🎨 색상 드롭다운 메뉴 생성 (단일 선택 전용)
   @param {string} id - 토글과 연결될 메뉴 id
   @param {Array} colors - 사용할 색상 배열 (기본값: labelColors)
   @param {string} size - 메뉴 크기 (normal | small | xs)
   @param {boolean} autoAppend - 메뉴를 토글 옆에 자동 삽입 여부
   - 접근성: aria-selected 적용
   ========================== */
export function createColorDropdownMenu({
  id,
  colors = labelColors,
  size = "normal",
  autoAppend = true,
}) {
  // 메뉴 컨테이너
  const menu = document.createElement("div");
  menu.className = `dropdown__menu dropdown__menu--color${
    size !== "normal" ? ` ${size}` : ""
  }`;
  menu.id = id;
  menu.setAttribute("role", "menu");

  // 리스트 컨테이너
  const ul = document.createElement("ul");
  ul.className = "dropdown__list dropdown__list--color";

  // 색상 배열 순회
  colors.forEach((color, idx) => {
    const li = document.createElement("li");
    li.className = "dropdown__item color-option";
    li.setAttribute("role", "menuitemradio"); // 단일 선택 그룹
    li.setAttribute("aria-checked", "false"); // 선택 상태 false
    li.dataset.value = color.value;

    // 색상 원(circle) 생성
    const circle = document.createElement("span");
    circle.className = "color-circle";
    circle.style.backgroundColor = color.hex;
    li.appendChild(circle);

    ul.appendChild(li);

    /* ==========================
       클릭 이벤트 (단일 선택)
       ========================== */
    li.addEventListener("click", () => {
      const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);

      // 1. 기존 선택 해제 및 체크 아이콘 제거
      ul.querySelectorAll(".color-option.selected").forEach((s) => {
        s.classList.remove("selected");
        s.setAttribute("aria-checked", "false"); // 해제
        const checkIcon = s.querySelector(".icon--check");
        if (checkIcon) checkIcon.remove();
      });

      // 2. 현재 항목 선택 처리
      li.classList.add("selected");
      li.setAttribute("aria-checked", "true"); // 선택됨

      // 3. 체크 아이콘 생성 및 색상 처리
      const checkIcon = document.createElement("i");
      checkIcon.className = "icon--check icon color-check-icon";

      // 밝은 배경(gray-100, gray-300)에서는 짙은 색상 아이콘 적용
      if (["gray-100", "gray-300"].includes(color.value)) {
        checkIcon.style.color = "var(--gray-600)";
      } else {
        checkIcon.style.color = "var(--white)";
      }
      li.appendChild(checkIcon);

      // 4. 토글 버튼 업데이트 (선택된 컬러 반영)
      if (toggle) {
        toggle.innerHTML = `
          <span class="color-circle" style="background-color:${color.hex}"></span>
          <i class="icon--caret-down icon"></i>
        `;
        toggle.setAttribute("aria-expanded", "false");
        // 접근성: 선택된 색상명을 라벨로 갱신
        toggle.setAttribute("aria-label", `색상 선택: ${color.value}`);
      }
    });

    /* ==========================
       기본값: 첫 번째 아이템 선택 상태로 설정
       ========================== */
    if (idx === 0) {
      li.classList.add("selected");
      li.setAttribute("aria-checked", "true"); // 기본 선택 표시

      const checkIcon = document.createElement("i");
      checkIcon.className = "icon--check icon color-check-icon";
      checkIcon.style.color = "var(--gray-600)"; // gray-100에 맞춰 진한 아이콘
      li.appendChild(checkIcon);
    }
  });

  menu.appendChild(ul);

  // 토글 옆에 자동 삽입
  if (autoAppend) {
    const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);
    toggle?.parentElement?.appendChild(menu);
  }

  return menu;
}
