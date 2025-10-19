/**
 * =====================================================================
 * 🧩 Component: Checkbox (체크박스 생성 유틸)
 * =====================================================================
 *
 * 📌 역할
 * ---------------------------------------------------------------------
 * - 옵션 객체를 받아 체크박스 UI를 HTML 문자열 형태로 생성
 * - 크기(size), 스타일(variant), 라벨, 상태(checked/disabled) 지정 가능
 * - 별도의 JS 초기화 없이 정적 마크업으로 바로 렌더링 가능
 *
 * 🧩 Angular 변환 시 가이드
 * ---------------------------------------------------------------------
 * 1️⃣ Angular 컴포넌트 예시
 *     <app-checkbox
 *       [id]="'chk-terms'"
 *       [size]="'small'"
 *       [variant]="'ghost'"
 *       [label]="'이용약관 동의'"
 *       [checked]="true"
 *       [disabled]="false"
 *       (change)="onCheckboxChange($event)">
 *     </app-checkbox>
 *
 * 2️⃣ Angular @Input() 속성
 *     @Input() id: string;
 *     @Input() size: 'small' | 'medium' = 'medium';
 *     @Input() variant: 'standard' | 'ghost' = 'standard';
 *     @Input() label?: string;
 *     @Input() disabled = false;
 *     @Input() checked = false;
 *
 * 3️⃣ Angular @Output() 이벤트
 *     @Output() change = new EventEmitter<boolean>();
 *
 * 4️⃣ Angular 내부 구조
 *     <div class="checkbox-field checkbox--{{variant}}-{{size}}">
 *       <input
 *         type="checkbox"
 *         [id]="id"
 *         [disabled]="disabled"
 *         [checked]="checked"
 *         (change)="change.emit($event.target.checked)"
 *       />
 *       <label *ngIf="label" [for]="id" class="checkbox-label">{{ label }}</label>
 *     </div>
 *
 * ⚙️ 함수 개요
 * ---------------------------------------------------------------------
 * @param {Object} options - 체크박스 옵션
 * @param {string} [options.id] - 체크박스 고유 ID (없으면 랜덤 생성)
 * @param {string} [options.size="medium"] - 크기 ('small' | 'medium')
 * @param {string} [options.variant="standard"] - 스타일 ('standard' | 'ghost')
 * @param {string} [options.label=""] - 라벨 텍스트 (없으면 라벨 미출력)
 * @param {boolean} [options.disabled=false] - 비활성화 여부
 * @param {boolean} [options.checked=false] - 기본 체크 여부
 *
 * @returns {string} 체크박스 HTML 문자열
 *
 * 🧠 사용 예시
 * ---------------------------------------------------------------------
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
 * =====================================================================
 */
export function createCheckbox({
  id,
  size = "medium", // small | medium
  variant = "standard", // standard | ghost
  label = "", // 라벨 텍스트 (없으면 라벨 없음)
  disabled = false,
  checked = false,
}) {
  /* ============================================================
     🧱 고유 ID 생성
     ------------------------------------------------------------
     - 전달받은 id가 없으면 랜덤 문자열 생성
     - Angular: [id] 바인딩으로 대체
  ============================================================ */
  const checkboxId = id || `chk-${Math.random().toString(36).substr(2, 9)}`;

  /* ============================================================
     🧩 체크박스 HTML 템플릿
     ------------------------------------------------------------
     - variant, size, label 조합으로 클래스 자동 결정
     - Angular: 클래스 바인딩 [ngClass]로 대체 가능
  ============================================================ */
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
