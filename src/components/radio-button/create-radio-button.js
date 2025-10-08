/**
 * 👉 createRadioButton
 * - 공통 라디오 버튼을 일관된 UI로 렌더링하기 위해 사용
 * - variant, size 옵션에 따라 다양한 스타일 지원
 *
 * @param {Object} options
 * @param {string} options.id - input id (없으면 자동 생성됨)
 * @param {string} options.name - 라디오 그룹 이름 (같은 name끼리 그룹으로 동작)
 * @param {"small"|"medium"} [options.size="medium"] - 사이즈
 * @param {"standard"|"card-border"|"card-no-border"} [options.variant="standard"]
 *   - standard: 기본 라디오 버튼
 *   - card-border: 카드형 + border 있음
 *   - card-no-border: 카드형 + border 없음
 * @param {string} [options.label=""] - 라벨 텍스트 (없으면 라벨 미출력)
 * @param {boolean} [options.disabled=false] - 비활성화 여부
 * @param {boolean} [options.checked=false] - 기본 선택 여부
 * @param {string} [options.value=""] - 라디오 값 (미지정 시 id 값 사용)
 *
 * @returns {string} 라디오 버튼 HTML 문자열
 */
export function createRadioButton({
  id,
  name,
  size = "medium", // small | medium
  variant = "standard", // standard | card-border | card-no-border
  label = "", // 라벨 텍스트 (없으면 no-label)
  disabled = false,
  checked = false,
  value = "",
}) {
  // 고유 id 생성 (직접 지정하지 않으면 랜덤 id 생성)
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  // variant별 클래스명 구성
  // - 카드형(card-border / card-no-border)은 size와 무관
  // - standard일 때만 size 옵션 반영
  const className = variant.startsWith("card")
    ? `radio-field radio--${variant}`
    : `radio-field radio--${variant}-${size}`;

  // 라디오 버튼 HTML 구성
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

  return html.trim();
}
