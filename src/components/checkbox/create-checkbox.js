/**
 * ✅ createCheckbox
 * 체크박스 컴포넌트를 생성하는 유틸 함수
 * - 옵션 기반으로 HTML 문자열을 반환
 * - 사이즈, 스타일(variant), 라벨, 상태(checked/disabled) 제어 가능
 *
 * @param {Object} options
 * @param {string} [options.id] - 체크박스 고유 ID (없으면 랜덤 생성)
 * @param {string} [options.size="medium"] - 체크박스 크기 (small | medium)
 * @param {string} [options.variant="standard"] - 스타일 종류 (standard | ghost)
 * @param {string} [options.label=""] - 라벨 텍스트 (없으면 라벨 없음)
 * @param {boolean} [options.disabled=false] - 비활성화 여부
 * @param {boolean} [options.checked=false] - 기본 체크 여부
 *
 * @returns {string} 체크박스 HTML 문자열
 *
 * @example
 * // 기본 체크박스
 * createCheckbox({ label: "동의합니다." });
 *
 * // small + ghost 스타일
 * createCheckbox({
 *   size: "small",
 *   variant: "ghost",
 *   label: "선택",
 *   checked: true
 * });
 */
export function createCheckbox({
  id,
  size = "medium", // small | medium
  variant = "standard", // standard | ghost
  label = "", // 라벨 텍스트 (없으면 no-label)
  disabled = false,
  checked = false,
}) {
  // 고유 ID (직접 지정 안 하면 랜덤 생성)
  const checkboxId = id || `chk-${Math.random().toString(36).substr(2, 9)}`;

  // 체크박스 HTML 템플릿
  const html = `
    <div class="checkbox-field checkbox--${variant}-${size}">
      <input
        type="checkbox"
        id="${checkboxId}"
        ${disabled ? "disabled" : ""}
        ${checked ? "checked" : ""}
      />
      ${
        label
          ? `<label for="${checkboxId}" class="checkbox-label">${label}</label>`
          : ""
      }
    </div>
  `;

  return html.trim();
}
