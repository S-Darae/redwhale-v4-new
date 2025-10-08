/**
 * ==========================
 * MembershipCard 컴포넌트 생성 함수 (체크 아이콘 기반)
 * ==========================
 *
 * - 단일 회원권 카드를 HTML 문자열로 생성합니다.
 * - 옵션(withCheckbox)에 따라 카드 좌측에 체크 아이콘을 표시합니다.
 * - 가격/기간/횟수 정보(details)는 객체형/배열형 두 가지 입력을 모두 지원합니다.
 *
 * @param {Object} props - 카드 렌더링에 필요한 데이터
 * @param {string} props.id - 카드 고유 ID
 * @param {string} props.folderName - 회원권 폴더명
 * @param {string} props.membershipName - 회원권 이름
 * @param {string} props.badge - 뱃지 텍스트 (예: "예약 사용")
 * @param {string} props.badgeVariant - 뱃지 스타일 키 (예: "reserv-used")
 * @param {Array}  props.details - 가격/기간/횟수 정보
 *   - 2가지 입력 형태 지원:
 *     1) 배열형: ["기간", "횟수" | { text, cancel }, "가격"]
 *     2) 객체형: { period, count, cancel, price }
 * @param {boolean} [props.withCheckbox=false] - 체크모드 여부
 *        true → 카드 좌측에 체크 아이콘 표시, 선택 가능
 * @param {boolean} [props.checked=false] - 초기 선택 여부
 *        true → is-selected 클래스 및 aria-checked=true 로 시작
 * @param {boolean} [props.popover=true] - 팝오버 표시 여부
 *
 * @returns {string} - 생성된 카드 HTML 문자열
 */
export function createMembershipCard({
  id,
  folderName,
  membershipName,
  badge,
  badgeVariant,
  details = [],
  withCheckbox = false,
  checked = false,
  popover = true,
}) {
  /**
   * 체크 아이콘 영역
   * - withCheckbox=true일 경우 카드 좌측에 체크 아이콘 추가
   */
  const checkboxHTML = withCheckbox
    ? `
      <div class="membership-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0">
        <i class="icon--check icon"></i>
      </div>
    `
    : "";

  /**
   * 상세 정보(details) 영역
   * - 가격/기간/횟수를 행 단위로 표시
   * - 객체형, 배열형 두 가지 입력을 지원
   * - 값이 없으면 기본적으로 "-" 출력
   */
  const detailsHTML =
    details && details.length
      ? details
          .map((row) => {
            // 1) 객체형 → { period, count, cancel, price }
            if (!Array.isArray(row) && typeof row === "object") {
              return `
                <ul class="membership-card-detail">
                  <li>${row.period || ""}</li>
                  <li>
                    ${row.count || ""}
                    ${row.cancel ? `<span>(${row.cancel})</span>` : ""}
                  </li>
                  <li>${row.price || ""}</li>
                </ul>
              `;
            }

            // 2) 배열형 → ["기간", "횟수" | {text,cancel}, "가격"]
            if (Array.isArray(row)) {
              const [period, count, price] = row;
              if (typeof count === "object") {
                return `
                  <ul class="membership-card-detail">
                    <li>${period || ""}</li>
                    <li>
                      ${count.text || ""}
                      ${count.cancel ? `<span>(${count.cancel})</span>` : ""}
                    </li>
                    <li>${price || ""}</li>
                  </ul>
                `;
              }
              return `
                <ul class="membership-card-detail">
                  <li>${period || ""}</li>
                  <li>${count || ""}</li>
                  <li>${price || ""}</li>
                </ul>
              `;
            }

            return "";
          })
          .join("")
      : `<ul class="membership-card-detail"><li>-</li></ul>`;

  /**
   * 최종 카드 구조
   * - withCheckbox 옵션에 따라 "checkbox-mode" 클래스 추가
   * - data-popover 속성으로 팝오버 열림 여부 제어
   */
  return `
    <div class="membership-card ${withCheckbox ? "checkbox-mode" : ""} ${
    checked ? "is-selected" : ""
  }"
         data-id="${id}"
         data-popover="${popover ? "true" : "false"}"
         data-checked="${checked ? "true" : "false"}">
      ${checkboxHTML}
      <div class="membership-card-content">
        <div class="membership-card-header">
          <div class="membership-card-folder-name">${folderName}</div>
          <div class="membership-card-membership-name">${membershipName}</div>
        </div>
        <div class="membership-card-body">
          <span class="membership-card-badge membership-card-badge--${badgeVariant}">
            ${badge}
          </span>
          <div class="membership-card-details">
            ${detailsHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}
