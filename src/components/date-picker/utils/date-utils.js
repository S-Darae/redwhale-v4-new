// =====================================================================
// 📅 Module: Date Utilities (날짜 유틸리티 함수 모음)
// =====================================================================
//
// 📌 개요
// ---------------------------------------------------------------------
// - 날짜 문자열 <-> Date 객체 간 변환, 포맷팅, 월/기간 계산 등
// - 모든 로직은 타임존 영향을 받지 않도록 "로컬 자정" 기준으로 동작
// - FilterCalendarCore, FilterCalendar 등에서 공통 사용
//
// 🧩 Angular 변환 시 가이드
// ---------------------------------------------------------------------
// ✅ 서비스 형태로 변환 추천
//    → @Injectable({ providedIn: 'root' }) export class DateUtilsService {}
//
// ✅ Angular 내에서 사용 예시
//    import { DateUtilsService } from './date-utils.service';
//
//    constructor(private dateUtils: DateUtilsService) {}
//
//    this.dateUtils.parseLocalDate('2025-10-19');
//    this.dateUtils.formatKoreanDate(new Date());
//
// ✅ Angular Pipe로 확장 가능
//    → formatKoreanDate()는 커스텀 파이프(date-korean.pipe.ts)로도 변환 가능
// =====================================================================

// =====================================================================
// 🔄 변환 함수 (Parse / Format)
// =====================================================================

/**
 * ✅ parseLocalDate()
 * ---------------------------------------------------------------
 * YYYY-MM-DD 문자열 → 로컬 자정 기준 Date 객체로 변환
 *
 * @param {string} value - 날짜 문자열 (예: "2025-10-19")
 * @returns {Date|null} 로컬 자정 기준 Date 객체 (유효하지 않으면 null)
 *
 * @example
 * parseLocalDate("2025-10-19")
 * → new Date(2025, 9, 19)
 */
export function parseLocalDate(value) {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d); // ✅ 로컬 자정 기준
  }
  return new Date(value); // fallback: 전체 Date 문자열
}

/**
 * ✅ todayLocal()
 * ---------------------------------------------------------------
 * 오늘 날짜를 "로컬 자정" 기준으로 반환
 *
 * @returns {Date} 오늘 날짜의 00:00 시각 (ex: 2025-10-19 00:00)
 *
 * @example
 * todayLocal()
 * → new Date(2025, 9, 19)
 */
export function todayLocal() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * ✅ fmt()
 * ---------------------------------------------------------------
 * Date 객체 → "YYYY-MM-DD" 형식 문자열로 변환
 *
 * @param {Date} date - 변환할 날짜
 * @returns {string} 변환된 문자열 (유효하지 않으면 빈 문자열)
 *
 * @example
 * fmt(new Date(2025, 9, 19))
 * → "2025-10-19"
 */
export function fmt(date) {
  if (!(date instanceof Date)) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// =====================================================================
// 🧾 포맷팅 함수 (Display Formatting)
// =====================================================================

/**
 * ✅ formatKoreanDate()
 * ---------------------------------------------------------------
 * Date → 한국어 형식 문자열 변환
 * ex) "25년 10월 19일 (일)"
 *
 * @param {Date} date - 포맷할 날짜
 * @returns {string} "YY년 MM월 DD일 (요일)" 형식 문자열
 *
 * @example
 * formatKoreanDate(new Date(2025, 9, 19))
 * → "25년 10월 19일 (일)"
 *
 * 🧩 Angular Pipe로 변환 시:
 *   @Pipe({ name: 'koreanDate' })
 *   transform(date: Date) { return this.dateUtils.formatKoreanDate(date); }
 */
export function formatKoreanDate(date) {
  if (!(date instanceof Date)) return "";
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[date.getDay()];
  return `${yy}년 ${mm}월 ${dd}일 (${day})`;
}

// =====================================================================
// 📆 월 단위 계산 함수
// =====================================================================

/**
 * ✅ getMonthRange()
 * ---------------------------------------------------------------
 * 특정 연도/월의 전체 기간 반환
 * (시작일 ~ 말일)
 *
 * @param {number} year - 연도 (ex: 2025)
 * @param {number} month - 월 (1~12)
 * @returns {{ start: Date, end: Date }} 해당 월의 시작일, 종료일
 *
 * @example
 * getMonthRange(2025, 10)
 * → { start: new Date(2025, 9, 1), end: new Date(2025, 9, 31) }
 */
export function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // 말일
  return { start, end };
}
