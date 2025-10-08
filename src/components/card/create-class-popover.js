import "./popover-common.js";

/**
 * ClassDetailPopover 컴포넌트 생성 함수
 *
 * 👉 수업 카드를 클릭했을 때 표시되는 상세 팝오버 HTML을 생성
 *
 * @param {Object} props - 수업 상세 팝오버 데이터
 * @param {string} props.folderName - 수업 폴더명
 * @param {string} props.className - 수업 이름
 * @param {string} props.badge - 뱃지 텍스트 (예: "그룹", "개인")
 * @param {string} props.badgeVariant - 뱃지 스타일 키 (예: "group", "personal")
 * @param {string} props.duration - 수업 시간 (예: "50분")
 * @param {string} props.people - 수강 인원 (예: "10명")
 * @param {string} props.trainer - 담당 트레이너 이름
 * @param {string} [props.policyReserve] - 예약 정책 문구 (기본값: "수업 시작 7일 전 0시부터 30분 전까지")
 * @param {string} [props.policyCancel] - 취소 정책 문구 (기본값: "수업 시작 24시간 전까지")
 * @param {string} [props.memo] - 메모 내용 (없으면 "-" 표시 + empty-text 클래스)
 * @param {string} [props.notice] - 수업 소개 / 회원 공지 (없으면 "-" 표시 + empty-text 클래스)
 * @param {Array} [props.tickets] - 예약 가능한 회원권 배열
 *   @example
 *   tickets: [
 *     { folderName: "회원권 A", items: ["3개월권", "6개월권"] }
 *   ]
 * @param {string} [props.color] - 색상 키 (예: "sandbeige", "sunnyyellow", "oliveleaf" ...)
 *
 * @returns {string} - 팝오버 HTML 문자열
 */
export function createClassDetailPopover({
  folderName,
  className,
  badge,
  badgeVariant,
  duration,
  people,
  trainer,
  policyReserve = "수업 시작 7일 전 0시부터 30분 전까지",
  policyCancel = "수업 시작 24시간 전까지",
  memo = "",
  notice = "",
  tickets = [],
  color = "sandbeige", // 기본값 sandbeige
}) {
  /**
   * ✅ 예약 가능한 회원권 렌더링
   * - tickets 배열을 순회하면서 그룹별 folderName + items 리스트 출력
   * - tickets가 비어있으면 "-"만 표시 (empty-text)
   */
  const ticketGroupsHTML = tickets
    .map(
      (group) => `
      <div class="class-detail-popover__ticket-group">
        <div class="class-detail-popover__ticket-folder-name">
          ${group.folderName} <span>${group.items.length}</span>
        </div>
        <div class="class-detail-popover__ticket-list">
          ${group.items
            .map(
              (item) =>
                `<div class="class-detail-popover__ticket-item">${item}</div>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");

  /**
   * ✅ 최종 HTML 반환
   * - header: 좌측 컬러바 + 상단 버튼들 (복제/수정/삭제/닫기)
   * - body-main: 폴더명, 수업명, 뱃지, 시간, 인원, 트레이너, 정책
   * - body-sub: 메모, 공지, 예약 가능한 회원권
   *   → 값이 없으면 "-" 표시 + empty-text 클래스 적용
   */
  return `
    <aside class="class-detail-popover visible">
      <!-- 상단 헤더 (컬러바 + 버튼 영역) -->
      <div class="class-detail-popover__header">
        <div class="class-detail-popover__class-color ${color}"></div>
        <div class="class-detail-popover__btns">
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

      <!-- 본문 영역 -->
      <div class="class-detail-popover__body">
        <!-- 메인 정보 -->
        <div class="class-detail-popover__body-main">
          <ul class="class-detail-popover__body-main-name">
            <li class="class-detail-popover__folder-name">${folderName}</li>
            <li class="class-detail-popover__class-name">${className}</li>
          </ul>

          <ul class="class-detail-popover__body-main-detail">
            <li class="class-detail-popover__badge class-detail-popover__badge--${badgeVariant}">
              ${badge}
            </li>
            <li class="class-detail-popover__duration">${duration}</li>
            <li class="class-detail-popover__people">${people}</li>
            <li class="class-detail-popover__trainer">
              ${Array.isArray(trainer) ? trainer.join(", ") : trainer}
            </li>
          </ul>

          <!-- 예약/취소 정책 -->
          <div class="class-detail-popover__body-main-policy-wrap">
            <ul class="class-detail-popover__policy-list">
              <li class="class-detail-popover__policy-item">
                <span class="available">수업예약</span>${policyReserve}
              </li>
              <li class="class-detail-popover__policy-item">
                <span class="deadline">예약취소</span>${policyCancel}
              </li>
            </ul>
          </div>
        </div>

        <!-- 서브 정보 (메모/공지/회원권) -->
        <div class="class-detail-popover__sub">
          <div class="class-detail-popover__sub-memo-wrap">
            <div class="class-detail-popover__sub-content-title">메모</div>
            <div class="class-detail-popover__memo-content ${
              memo ? "" : "empty-text"
            }">${memo || "-"}</div>
          </div>

          <div class="class-detail-popover__sub-notice-wrap">
            <div class="class-detail-popover__sub-content-title">수업 소개 / 회원 공지</div>
            <div class="class-detail-popover__notice-content ${
              notice ? "" : "empty-text"
            }">${notice || "-"}</div>
          </div>

          <div class="class-detail-popover__sub-ticket-wrap">
            <div class="class-detail-popover__sub-content-title">예약 가능한 회원권</div>
            ${
              tickets.length
                ? ticketGroupsHTML
                : `<div class="class-detail-popover__ticket-list empty-text">-</div>`
            }
          </div>
        </div>
      </div>
    </aside>
  `;
}
