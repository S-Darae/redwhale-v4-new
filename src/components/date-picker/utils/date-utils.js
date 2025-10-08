// ==========================
// 변환 함수
// ==========================

// YYYY-MM-DD 문자열 → 로컬 Date
export function parseLocalDate(value) {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d); // 로컬 자정
  }
  return new Date(value);
}

// 오늘 날짜를 로컬 자정으로 반환
export function todayLocal() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Date → YYYY-MM-DD
export function fmt(date) {
  if (!(date instanceof Date)) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ==========================
// 포맷팅 함수
// ==========================

// Date → "YY년 MM월 DD일 (요일)"
export function formatKoreanDate(date) {
  if (!(date instanceof Date)) return "";
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[date.getDay()];
  return `${yy}년 ${mm}월 ${dd}일 (${day})`;
}

// 특정 연도/월의 전체 기간 반환
export function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // 말일
  return { start, end };
}
