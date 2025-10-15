/**
 * ==========================
 * ClassCard 컴포넌트 생성 함수
 * ==========================
 *
 * - 단일 수업 카드를 HTML 문자열로 생성합니다.
 * - 기본 정보(폴더명, 수업명, 배지, 시간, 인원, 트레이너 등)와
 *   선택 모드일 경우 표시되는 체크 아이콘을 포함합니다.
 *
 * @param {Object} props - 수업 카드 데이터
 * @param {string} props.id              - 카드 고유 ID (데이터 식별용)
 * @param {string} props.folderName      - 폴더명
 * @param {string} props.className       - 수업 이름
 * @param {string} props.badge           - 뱃지 텍스트
 * @param {string} props.badgeVariant    - 뱃지 스타일 키 (예: personal, group)
 * @param {string} props.duration        - 수업 시간
 * @param {string} props.people          - 수강 인원
 * @param {string} props.trainer         - 담당 트레이너
 * @param {boolean} [props.withCheckbox=false] - 체크모드 여부
 *        true → 카드 좌측에 체크 아이콘 표시, 선택 가능
 * @param {boolean} [props.checked=false]     - 초기 선택 여부
 *        true → is-selected 클래스 및 aria-checked=true 로 시작
 * @param {boolean} [props.popover=true]      - 팝오버 표시 여부
 *
 * @returns {string} HTML 문자열
 */
export function createClassCard({
  id,
  folderName,
  className,
  badge,
  badgeVariant,
  duration,
  people,
  trainer,
  withCheckbox = false,
  checked = false,
  popover = true,
}) {
  // 카드 전체 클래스 (선택모드, 선택상태 반영)
  const classList = [
    "class-card",
    withCheckbox ? "checkbox-mode" : "", // 체크모드일 경우 스타일링
    checked ? "is-selected" : "", // 초기 선택 상태
  ]
    .filter(Boolean)
    .join(" ");

  // 체크 아이콘 (체크모드일 때만 표시됨)
  const checkboxHTML = withCheckbox
    ? `
      <div class="class-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0">
        <i class="icon--check icon"></i>
      </div>
    `
    : "";

  // 최종 카드 HTML 문자열 반환
  return `
    <div class="${classList}"
         data-id="${id}"
         data-checked="${checked ? "true" : "false"}"
         data-folder-name="${folderName}"
         data-class-name="${className}"
         data-badge="${badge}"
         data-badge-variant="${badgeVariant}"
         data-duration="${duration}"
         data-people="${people}"
         data-trainer="${trainer}"
         data-popover="${popover ? "true" : "false"}">
      ${checkboxHTML}
      <div class="class-card__content">
        <!-- 상단: 폴더명 + 수업명 -->
        <ul class="class-card__header">
          <li class="class-card__header__folder-name">${folderName}</li>
          <li class="class-card__header__class-name">${className}</li>
        </ul>
        <!-- 하단: 뱃지 + 세부 정보 -->
        <ul class="class-card__detail">
          <li class="class-card__badge class-card__badge--${badgeVariant}">
            ${badge}
          </li>
          <li class="class-card__duration">${duration}</li>
          <li class="class-card__people">${people}</li>
          <li class="class-card__trainer">
            ${Array.isArray(trainer) ? trainer.join(", ") : trainer}
          </li>
        </ul>
      </div>
    </div>
  `;
}
