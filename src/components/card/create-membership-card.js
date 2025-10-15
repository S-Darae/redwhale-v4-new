/**
 * ==========================
 * MembershipCard 컴포넌트 생성 함수
 * ==========================
 *
 * - 회원권 카드를 HTML 문자열로 생성합니다.
 * - 기본형 / 카드 전체 체크형 / 옵션별 체크형을 모두 지원합니다.
 * - 각 row별 옵션 체크박스 및 헤더 클릭 시 팝오버 기능을 포함합니다.
 *
 * @param {Object} props - 회원권 카드 데이터
 * @param {string} props.id                  - 카드 고유 ID (데이터 식별용)
 * @param {string} props.folderName          - 폴더명
 * @param {string} props.membershipName      - 회원권 이름
 * @param {string} props.badge               - 배지 텍스트
 * @param {string} props.badgeVariant        - 배지 스타일 키 (예: reserv-used, reserv-unused)
 * @param {Array}  [props.details=[]]        - 회원권 상세 내역 (기간, 횟수, 가격 등)
 * @param {boolean} [props.withCheckbox=false]      - 카드 전체 선택모드 여부
 *        true → 카드 좌측에 체크 아이콘 표시, 전체 선택 가능
 * @param {boolean} [props.withOptionCheckbox=false] - 옵션별 체크박스 활성화 여부
 *        true → 각 옵션(row)별로 개별 선택 가능
 * @param {boolean} [props.checked=false]           - 초기 선택 여부
 *        true → is-selected 클래스 및 aria-checked=true로 시작
 * @param {boolean} [props.popover=true]            - 팝오버 표시 여부
 *
 * @returns {string} HTML 문자열
 */
export function createMembershipCard({
  id,
  folderName,
  membershipName,
  badge,
  badgeVariant,
  details = [],
  withCheckbox = false,
  withOptionCheckbox = false,
  checked = false,
  popover = true,
}) {
  // 카드 전체 체크박스 (아이콘)
  const cardCheckboxHTML = withCheckbox
    ? `
      <div class="membership-card__checkbox"
           role="checkbox"
           aria-checked="${checked ? "true" : "false"}"
           tabindex="0"
           data-type="card">
        <i class="icon--check icon"></i>
      </div>
    `
    : "";

  // 상세 정보 (옵션별 체크 포함)
  const detailsHTML =
    details && details.length
      ? details
          .map((row, i) => {
            const isObject = !Array.isArray(row) && typeof row === "object";
            const period = isObject ? row.period || "" : row[0] || "";
            const countData = isObject ? row.count : row[1];
            const cancelText = isObject
              ? row.cancel
              : typeof countData === "object"
              ? countData.cancel
              : "";
            const price = isObject ? row.price || "" : row[2] || "";
            const count =
              typeof countData === "object"
                ? countData.text || ""
                : countData || "";
            const cancel = cancelText ? `<span>(${cancelText})</span>` : "";

            // 옵션별 체크박스
            const optionCheckbox = withOptionCheckbox
              ? `
                <div class="membership-card__detail-checkbox"
                     role="checkbox"
                     aria-checked="false"
                     tabindex="0"
                     data-index="${i}">
                  <i class="icon--check icon"></i>
                </div>
              `
              : "";

            return `
              <div class="membership-card-detail-row" data-row-index="${i}">
                ${optionCheckbox}
                <ul class="membership-card-detail">
                  <li>${period}</li>
                  <li>${count}${cancel}</li>
                  <li>${price}</li>
                </ul>
              </div>
            `;
          })
          .join("")
      : `<ul class="membership-card-detail"><li>-</li></ul>`;

  // 최종 카드 HTML 반환
  return `
    <div class="membership-card
                ${withCheckbox ? "checkbox-mode" : ""}
                ${withOptionCheckbox ? "option-checkbox-mode" : ""}
                ${checked ? "is-selected" : ""}"
         data-id="${id}"
         data-popover="${popover ? "true" : "false"}"
         data-checked="${checked ? "true" : "false"}">

      ${cardCheckboxHTML}

      <div class="membership-card-content">
        <div class="membership-card-header" data-popover-trigger="true">
          <div class="membership-card-folder-name">${folderName}</div>
          <div class="membership-card-membership-name">${membershipName}</div>
        </div>

        <div class="membership-card-body">
          <span class="membership-card-badge membership-card-badge--${badgeVariant}">
            ${badge}
          </span>
          <div class="membership-card-details">${detailsHTML}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * ==========================
 * MembershipCard 이벤트 핸들링
 * ==========================
 *
 * - 카드 전체 체크, 옵션 체크, 헤더 클릭 시 팝오버 등
 *   모든 상호작용 이벤트를 통합 관리합니다.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 카드 전체 체크박스 클릭 시 선택 토글
  document.querySelectorAll(".membership-card__checkbox").forEach((chk) => {
    chk.addEventListener("click", (e) => {
      e.stopPropagation(); // 팝오버 방지
      const card = chk.closest(".membership-card");
      const current = chk.getAttribute("aria-checked") === "true";
      chk.setAttribute("aria-checked", !current);
      card.classList.toggle("is-selected", !current);
    });
  });

  // 옵션 체크박스 (row 전체 클릭 시 선택)
  document.addEventListener("click", (e) => {
    const optionRow = e.target.closest(".membership-card-detail-row");
    const optionCheckbox = e.target.closest(
      ".membership-card__detail-checkbox"
    );
    if (!optionRow && !optionCheckbox) return;

    // 카드 전체 체크박스 클릭은 제외
    if (e.target.closest(".membership-card__checkbox")) return;

    e.stopPropagation(); // 팝오버 방지

    const row =
      optionRow || optionCheckbox.closest(".membership-card-detail-row");
    const checkbox = row.querySelector(".membership-card__detail-checkbox");
    const card = row.closest(".membership-card");

    const isChecked =
      checkbox.getAttribute("aria-checked") === "true" ? "false" : "true";

    checkbox.setAttribute("aria-checked", isChecked);
    row.classList.toggle("is-checked", isChecked === "true");

    // 카드 외곽선 강조 (하나라도 체크되면)
    const anyChecked = card.querySelectorAll(
      ".membership-card-detail-row.is-checked"
    ).length;
    card.classList.toggle("is-option-selected", anyChecked > 0);
  });

  // 헤더 클릭 시 팝오버 열기
  document.addEventListener("click", (e) => {
    const header = e.target.closest(".membership-card-header");
    if (!header) return;

    // 옵션 행 내부 클릭은 팝오버 무시
    if (e.target.closest(".membership-card-detail-row")) return;

    const card = header.closest(".membership-card");
    if (card.dataset.popover === "true") {
      const event = new CustomEvent("membership-card:open-popover", {
        detail: { id: card.dataset.id },
        bubbles: true, // document까지 버블링 → initPopover에서 감지
      });
      card.dispatchEvent(event);
    }
  });
});
