/**
 * ======================================================================
 * 🎛️ createRadioButton()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 공통 라디오 버튼을 HTML 문자열로 생성하여 일관된 UI를 유지
 * - variant / size 옵션 조합으로 다양한 형태의 라디오 버튼 지원
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * - 기본 라디오(`standard`)
 * - 카드형 라디오(`card-border`, `card-no-border`)
 * - size(작게/보통), disabled, checked, label 옵션 모두 지원
 * ----------------------------------------------------------------------
 * 🧭 Angular 변환 가이드:
 * 1️⃣ 본 함수는 Angular에서는 `<app-radio>` 컴포넌트로 대체 가능
 * 2️⃣ props(`variant`, `size`, `label`, `disabled`, `checked`) → @Input()으로 처리
 * 3️⃣ name 그룹 연결 → `<mat-radio-group>` 또는 FormControl 기반으로 관리
 * 4️⃣ checked 상태 → [(ngModel)] 또는 Reactive Form `formControlName`
 * 5️⃣ HTML 문자열 반환 대신 Angular Template으로 직접 렌더링
 * ----------------------------------------------------------------------
 * 📘 사용 예시 (Vanilla JS 환경)
 * const radio = createRadioButton({
 *   name: "membershipType",
 *   label: "1개월 회원권",
 *   variant: "card-border",
 *   checked: true,
 * });
 * document.querySelector(".radio-wrap").innerHTML += radio;
 * ----------------------------------------------------------------------
 * 📘 Angular 컴포넌트 예시
 * <app-radio
 *   name="membershipType"
 *   label="1개월 회원권"
 *   variant="card-border"
 *   size="medium"
 *   [(ngModel)]="selectedType">
 * </app-radio>
 * ======================================================================
 *
 * @param {Object} options - 라디오 옵션 객체
 * @param {string} options.id - input id (없으면 자동 생성)
 * @param {string} options.name - 라디오 그룹 이름 (같은 name끼리 그룹으로 동작)
 * @param {"small"|"medium"} [options.size="medium"] - 사이즈 설정
 * @param {"standard"|"card-border"|"card-no-border"} [options.variant="standard"]
 *   - standard: 기본 라디오 버튼
 *   - card-border: 카드형 + border 있음
 *   - card-no-border: 카드형 + border 없음
 * @param {string} [options.label=""] - 라벨 텍스트 (없으면 라벨 미출력)
 * @param {boolean} [options.disabled=false] - 비활성화 여부
 * @param {boolean} [options.checked=false] - 기본 선택 여부
 * @param {string} [options.value=""] - 라디오 값 (없으면 id 값 사용)
 * @returns {string} 라디오 버튼 HTML 문자열
 */
export function createRadioButton({
  id,
  name,
  size = "medium", // small | medium
  variant = "standard", // standard | card-border | card-no-border
  label = "", // 라벨 텍스트 (없으면 출력 생략)
  disabled = false,
  checked = false,
  value = "",
}) {
  /* =========================================================
     🆔 고유 ID 생성
     ---------------------------------------------------------
     - id를 지정하지 않으면 랜덤 문자열로 자동 생성
     - 라벨의 for 속성과 연결됨
     ========================================================= */
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  /* =========================================================
     🎨 클래스 구성 (variant / size 조합)
     ---------------------------------------------------------
     - card-border / card-no-border → 카드형 스타일
     - standard → 일반 라디오 (size 옵션 적용)
     ========================================================= */
  const className = variant.startsWith("card")
    ? `radio-field radio--${variant}`
    : `radio-field radio--${variant}-${size}`;

  /* =========================================================
     🧱 HTML 구조 생성
     ---------------------------------------------------------
     <div class="radio-field ...">
       <input type="radio" id="..." name="..." />
       <label for="..." class="radio-label">텍스트</label>
     </div>
     ---------------------------------------------------------
     - 라벨이 없으면 label 요소 생략
     - disabled, checked 속성 조건부 추가
     ========================================================= */
  const html = `
    <div class="${className}">
      <input
        type="radio"
        id="${radioId}"
        name="${name}"
        value="${value || radioId}"
        ${disabled ? "disabled" : ""}
        ${checked ? "checked" : ""}
      />
      ${
        label
          ? `<label for="${radioId}" class="radio-label">${label}</label>`
          : ""
      }
    </div>
  `;

  /* =========================================================
     📤 HTML 문자열 반환
     ---------------------------------------------------------
     - createRadioButton()은 DOM Element를 반환하지 않음
     - 외부에서 innerHTML 또는 insertAdjacentHTML로 삽입 필요
     ========================================================= */
  return html.trim();
}
