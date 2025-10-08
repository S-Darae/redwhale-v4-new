import "../../components/button/button.js";
import "../../components/tooltip/tooltip.js";
import "./popover-common.js";

/**
 * Membership Detail Popover 생성 함수
 *
 * 👉 회원권 카드를 클릭했을 때 표시되는 상세 팝오버 HTML을 생성
 * 👉 예약 미사용(`reserv-unused`) 상태일 경우, "예약 가능한 수업" 섹션은 표시하지 않음
 *
 * @param {Object} props - 팝오버에 표시할 데이터
 * @param {string} props.folderName - 회원권 폴더명
 * @param {string} props.membershipName - 회원권 이름
 * @param {string} props.badge - 뱃지 텍스트 (예: "예약 사용", "예약 미사용")
 * @param {string} props.badgeVariant - 뱃지 스타일 키 (예: "reserv-used", "reserv-unused")
 * @param {Array|string} [props.info=[]] - 이용 제한 정보 (배열 또는 단일 문자열 가능)
 *   @example ["일일 1회", "주간 7회", "동시 무제한 예약"]
 * @param {Array} [props.details=[]] - 가격/기간 옵션 리스트
 *   @example
 *   [
 *     { period: "3개월", count: "무제한", cancel: "취소 10회", price: "카드 300,000원" },
 *     { period: "3개월", count: "무제한", cancel: "취소 10회", price: "현금 296,000원" }
 *   ]
 * @param {string} [props.memo=""] - 메모 내용 (없으면 "-" 표시)
 * @param {Array} [props.tickets=[]] - 예약 가능한 수업 배열
 *   @example
 *   [
 *     { folderName: "폴더 이름", items: ["수업 A", "수업 B"] }
 *   ]
 * @param {string} [props.color="sandbeige"] - 컬러 키값 (컬러바에 사용됨)
 *   - sandbeige, sunnyyellow, oliveleaf, freshgreen, aquabreeze, bluesky,
 *     lavendermist, pinkpop, peachglow, coralred 중 하나
 *
 * @returns {string} 팝오버 HTML 문자열
 */
export function createMembershipDetailPopover({
  folderName,
  membershipName,
  badge,
  badgeVariant,
  info = [],
  details = [],
  memo = "",
  tickets = [],
  color = "sandbeige",
}) {
  /**
   * ✅ info 영역 처리
   * - 배열일 경우 → li 여러 개 출력
   * - 문자열일 경우 → li 하나 출력
   * - 값이 없을 경우 → 출력하지 않음
   */
  const infoHTML = Array.isArray(info)
    ? info
        .map(
          (i) => `<li class="membership-detail-popover__info-item">${i}</li>`
        )
        .join("")
    : info
    ? `<li class="membership-detail-popover__info-item">${info}</li>`
    : "";

  /**
   * ✅ details 영역 처리
   * - 객체 형태: { period, count, cancel, price }
   * - 배열 형태: ["1개월", "10회", "카드 100,000원"]
   * - 값이 없을 경우 → "-" 출력
   */
  const detailsHTML =
    details && details.length
      ? details
          .map((row) => {
            if (!Array.isArray(row) && typeof row === "object") {
              return `
                <ul class="membership-detail-popover__detail">
                  <li>${row.period || ""}</li>
                  <li>
                    ${row.count || ""}
                    ${row.cancel ? `<span>(${row.cancel})</span>` : ""}
                  </li>
                  <li>${row.price || ""}</li>
                </ul>
              `;
            }
            if (Array.isArray(row)) {
              const [period, count, price] = row;
              if (typeof count === "object") {
                return `
                  <ul class="membership-detail-popover__detail">
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
                <ul class="membership-detail-popover__detail">
                  <li>${period || ""}</li>
                  <li>${count || ""}</li>
                  <li>${price || ""}</li>
                </ul>
              `;
            }
            return "";
          })
          .join("")
      : `<ul class="membership-detail-popover__detail"><li class="empty-text">-</li></ul>`;

  /**
   * ✅ tickets 영역 처리
   * - 예약 미사용(`reserv-unused`) → 아예 표시하지 않음
   * - 배열에 값이 있을 경우 → 그룹별 folderName + items 출력
   * - 값이 없을 경우 → "-" 출력
   */
  const ticketsHTML =
    badgeVariant === "reserv-unused"
      ? "" // 예약 미사용 → tickets 섹션 숨김
      : tickets.length
      ? tickets
          .map(
            (group) => `
          <div class="membership-detail-popover__ticket-group">
            <div class="membership-detail-popover__ticket-folder-name">
              ${group.folderName} <span>${group.items.length}</span>
            </div>
            <div class="membership-detail-popover__ticket-list">
              ${group.items
                .map(
                  (t) =>
                    `<div class="membership-detail-popover__ticket-item">${t}</div>`
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")
      : `<div class="membership-detail-popover__ticket-list empty-text">-</div>`;

  /**
   * ✅ 최종 HTML 반환
   * - header: 좌측 컬러바 + 상단 버튼(복제, 수정, 삭제, 닫기)
   * - body-main: 폴더명, 회원권명, 뱃지, info, details
   * - body-sub: 메모, 예약 가능한 수업
   */
  return `
    <aside class="membership-detail-popover visible">
      <div class="membership-detail-popover__header">
        <div class="membership-detail-popover__membership-color ${color}"></div>
        <div class="membership-detail-popover__btns">
          <button class="btn--icon-utility" data-tooltip="복제" aria-label="복제">
            <div class="icon--copy icon"></div>
          </button>
          <button class="btn--icon-utility" data-tooltip="정보 수정" aria-label="정보 수정">
            <div class="icon--edit icon"></div>
          </button>
          <button class="btn--icon-utility" data-tooltip="삭제" aria-label="삭제">
            <div class="icon--trash icon"></div>
          </button>
          <button class="btn--icon-utility x-btn" aria-label="닫기">
            <div class="icon--x icon"></div>
          </button>
        </div>
      </div>

      <div class="membership-detail-popover__body">
        <!-- 메인 정보 -->
        <div class="membership-detail-popover__body-main">
          <ul class="membership-detail-popover__body-main-name">
            <li class="membership-detail-popover__folder-name">${folderName}</li>
            <li class="membership-detail-popover__membership-name">${membershipName}</li>
          </ul>

          <ul class="membership-detail-popover__info">
            <li class="membership-detail-popover__badge membership-detail-popover__badge--${badgeVariant}">
              ${badge}
            </li>
            ${infoHTML || `<li class="empty-text"></li>`}
          </ul>

          <div class="membership-detail-popover__details">
            ${detailsHTML}
          </div>
        </div>

        <!-- 서브 정보 -->
        <div class="membership-detail-popover__sub">
          <div class="membership-detail-popover__sub-memo-wrap">
            <div class="membership-detail-popover__sub-content-title">메모</div>
            <div class="membership-detail-popover__memo-content ${
              memo ? "" : "empty-text"
            }">${memo || "-"}</div>
          </div>

          ${
            badgeVariant === "reserv-unused"
              ? "" // 예약 미사용 → tickets 섹션 출력하지 않음
              : `
            <div class="membership-detail-popover__sub-tickets-wrap">
              <div class="membership-detail-popover__sub-content-title">예약 가능한 수업</div>
              ${ticketsHTML}
            </div>
          `
          }
        </div>
      </div>
    </aside>
  `;
}
