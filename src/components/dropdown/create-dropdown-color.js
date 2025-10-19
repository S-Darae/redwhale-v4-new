import "./dropdown-color.scss";

/* =====================================================================
🎨 Color Dropdown (색상 선택 드롭다운)
=====================================================================
UI 내 라벨 색상, 태그 색상 등을 선택하기 위한 전용 드롭다운 컴포넌트.

📌 구성 요소
---------------------------------------------------------------------
1️⃣ labelColors — 시스템에서 사용할 대표 색상 목록
2️⃣ createColorDropdownToggle() — 컬러칩 + caret 아이콘 토글 버튼 생성
3️⃣ createColorDropdownMenu() — 색상 목록 메뉴 생성 (단일 선택 전용)

🧩 Angular 변환 시 가이드
---------------------------------------------------------------------
1️⃣ Angular 컴포넌트 구조 예시:
    <app-color-dropdown
      [colors]="labelColors"
      [size]="'small'"
      (change)="onColorSelected($event)">
    </app-color-dropdown>

2️⃣ Angular Inputs:
    @Input() colors = labelColors;
    @Input() size: 'normal' | 'small' | 'xs' = 'normal';
    @Input() disabled = false;

3️⃣ Angular Output:
    @Output() change = new EventEmitter<string>();

4️⃣ 접근성(A11y)
    - `aria-expanded`, `aria-checked`, `aria-label` 유지
    - Angular에서는 Renderer2 + HostBinding으로 동기화

5️⃣ JS DOM 직접 조작 부분은 Angular에서 ViewChild 또는 Renderer2로 대체
===================================================================== */

/* ============================================================
   🎨 색상 드롭다운 고정값
   ------------------------------------------------------------
   - 시스템에서 사용할 대표 라벨 색상 (500 계열)
   - value: 내부에서 사용할 키값
   - hex: CSS 변수로 정의된 실제 색상 코드
   Angular에서는 SCSS 변수와 동일한 색상 토큰으로 관리 가능
============================================================ */
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

/* ============================================================
   🎨 createColorDropdownToggle()
   ------------------------------------------------------------
   컬러 드롭다운 토글 버튼 생성
   - 구조: 컬러칩(circle) + caret 아이콘
   - placeholder 없음 (첫 색상 기본 표시)
   - 접근성: aria-label 로 현재 색상명 읽기 가능
   Angular: <button [attr.aria-expanded]="isOpen"> 형태로 변환
============================================================ */
export function createColorDropdownToggle({ id, disabled = false }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "dropdown__toggle dropdown__toggle--color";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", id);
  button.dataset.dropdownTarget = id;
  if (disabled) button.setAttribute("disabled", "true");

  // 초기 상태: 첫 번째 색상으로 표시
  const firstColor = labelColors[0];
  button.innerHTML = `
    <span class="color-circle" style="background-color:${firstColor.hex}"></span>
    <i class="icon--caret-down icon"></i>
  `;

  // 접근성: 현재 선택된 색상명 라벨링
  button.setAttribute("aria-label", `색상 선택: ${firstColor.value}`);

  return button;
}

/* ============================================================
   🎨 createColorDropdownMenu()
   ------------------------------------------------------------
   컬러 드롭다운 메뉴(단일 선택용) 생성 함수
   @param {string} id - 토글과 연결될 메뉴 id
   @param {Array} colors - 사용할 색상 배열 (기본값: labelColors)
   @param {string} size - 메뉴 크기 (normal | small | xs)
   @param {boolean} autoAppend - 토글 옆 자동 삽입 여부
   Angular: ngFor 로 색상 리스트 렌더링 + (click) 이벤트로 선택 처리
============================================================ */
export function createColorDropdownMenu({
  id,
  colors = labelColors,
  size = "normal",
  autoAppend = true,
}) {
  // 메뉴 컨테이너 생성
  const menu = document.createElement("div");
  menu.className = `dropdown__menu dropdown__menu--color${
    size !== "normal" ? ` ${size}` : ""
  }`;
  menu.id = id;
  menu.setAttribute("role", "menu");

  // 리스트 컨테이너 생성
  const ul = document.createElement("ul");
  ul.className = "dropdown__list dropdown__list--color";

  // 색상 배열 순회
  colors.forEach((color, idx) => {
    const li = document.createElement("li");
    li.className = "dropdown__item color-option";
    li.setAttribute("role", "menuitemradio"); // 단일 선택 그룹
    li.setAttribute("aria-checked", "false"); // 초기값: 선택되지 않음
    li.dataset.value = color.value;

    // 색상 원(circle)
    const circle = document.createElement("span");
    circle.className = "color-circle";
    circle.style.backgroundColor = color.hex;
    li.appendChild(circle);

    ul.appendChild(li);

    /* ------------------------------------------------------------
       🖱 클릭 이벤트 (단일 선택)
       ------------------------------------------------------------
       - 기존 선택 해제 후 새 선택 반영
       - 체크 아이콘(✔) 추가 및 배경색에 따라 색상 조정
       - 토글 버튼에 선택 색상 표시 갱신
       Angular: (click)="selectColor(color)"
    ------------------------------------------------------------ */
    li.addEventListener("click", () => {
      const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);

      // 1️⃣ 기존 선택 해제 및 체크 아이콘 제거
      ul.querySelectorAll(".color-option.selected").forEach((s) => {
        s.classList.remove("selected");
        s.setAttribute("aria-checked", "false");
        const checkIcon = s.querySelector(".icon--check");
        if (checkIcon) checkIcon.remove();
      });

      // 2️⃣ 현재 항목 선택
      li.classList.add("selected");
      li.setAttribute("aria-checked", "true");

      // 3️⃣ 체크 아이콘 생성 (밝기 대비 처리)
      const checkIcon = document.createElement("i");
      checkIcon.className = "icon--check icon color-check-icon";
      if (["gray-100", "gray-300"].includes(color.value)) {
        checkIcon.style.color = "var(--gray-600)"; // 밝은 배경용 짙은 색상
      } else {
        checkIcon.style.color = "var(--white)";
      }
      li.appendChild(checkIcon);

      // 4️⃣ 토글 버튼 갱신 (선택 색상 반영)
      if (toggle) {
        toggle.innerHTML = `
          <span class="color-circle" style="background-color:${color.hex}"></span>
          <i class="icon--caret-down icon"></i>
        `;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", `색상 선택: ${color.value}`);
      }
    });

    /* ------------------------------------------------------------
       🟢 기본값: 첫 번째 색상 자동 선택 상태
       ------------------------------------------------------------
       - 초기 로드 시 첫 번째 색상을 선택 표시
       - Angular에서는 ngOnInit 내에서 defaultColor 적용
    ------------------------------------------------------------ */
    if (idx === 0) {
      li.classList.add("selected");
      li.setAttribute("aria-checked", "true");

      const checkIcon = document.createElement("i");
      checkIcon.className = "icon--check icon color-check-icon";
      checkIcon.style.color = "var(--gray-600)";
      li.appendChild(checkIcon);
    }
  });

  // 리스트 추가
  menu.appendChild(ul);

  /* ------------------------------------------------------------
     🔗 토글 옆 자동 삽입
     ------------------------------------------------------------
     - autoAppend=true 시 토글 버튼 부모에 메뉴 자동 추가
     - Angular에서는 DOM 직접 조작 대신 ViewContainerRef 사용
  ------------------------------------------------------------ */
  if (autoAppend) {
    const toggle = document.querySelector(`[data-dropdown-target="${id}"]`);
    toggle?.parentElement?.appendChild(menu);
  }

  return menu;
}
