/* ==========================
   Toggle 생성 유틸 함수
   ==========================
   ✅ 기능
   - 토글 스위치(checkbox 기반)를 HTML 문자열로 생성
   - 라벨 포함 여부, 크기, variant, 초기 상태 등을 옵션으로 제어
   - SCSS: toggle.scss와 함께 사용
   
   ✅ 사용 예시
   container.innerHTML = createToggle({
     id: "dark-mode",
     size: "large",
     label: "다크 모드",
     checked: true,
   });
   ========================== */
export function createToggle({
  id,
  size = "medium", // large | medium | small → 크기별 스타일 클래스
  variant = "standard", // 추후 확장 가능 (현재는 standard만 지원)
  label = "", // 라벨 텍스트 (없으면 라벨 미출력)
  disabled = false, // true → 비활성화
  checked = false, // true → 기본 ON 상태
}) {
  // ID 없으면 랜덤 ID 생성
  const toggleId = id || `tgl-${Math.random().toString(36).substr(2, 9)}`;

  // 토글 HTML 반환
  const html = `
    <label class="toggle__wrapper toggle--${variant} toggle--${size}">
      <input
        type="checkbox"
        id="${toggleId}"
        class="toggle__input"
        ${disabled ? "disabled" : ""}
        ${checked ? "checked" : ""}
      />
      <span class="toggle__switch"></span>
      ${label ? `<span class="toggle__label">${label}</span>` : ""}
    </label>
  `;

  return html.trim();
}
