/* ======================================================================
   🔹 Import (필요한 컴포넌트 / 모듈)
   ----------------------------------------------------------------------
   - dropdown.js : 드롭다운 기본 동작 스크립트
   - createTextField : 공통 텍스트 필드 생성 함수
   - text-field.scss : 텍스트 필드 스타일
   ====================================================================== */
import "../../components/dropdown/dropdown.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

/* ======================================================================
   1️⃣ 검색 필드 생성
   ----------------------------------------------------------------------
   - 위치: #locker-card-search__field
   - 용도: 회원 이름 / 락커 이름 검색
   - variant: search
   - 기본 값: “06” (샘플)
   ====================================================================== */
const searchContainer = document.querySelector("#locker-card-search__field");
if (searchContainer) {
  searchContainer.innerHTML = createTextField({
    id: "search-small-nolabel",
    variant: "search",
    size: "small",
    placeholder: "회원, 락커 이름 검색",
    value: "06",
  });
}

/* ======================================================================
   2️⃣ 폴더 편집 필드 (폴더명 변경용)
   ----------------------------------------------------------------------
   - folderData 배열 기반으로 각 필드 생성
   - variant: standard
   - placeholder & value: 기존 폴더 이름 그대로
   ====================================================================== */
const folderData = [
  { id: 1, name: "신발장" },
  { id: 2, name: "남성 탈의실" },
  { id: 3, name: "여성 탈의실" },
  { id: 4, name: "복도" },
];

folderData.forEach(({ id, name }) => {
  const container = document.querySelector(`#folder-edit-item__field-${id}`);
  if (!container) return;

  container.innerHTML = createTextField({
    id: `standard-small-folder-name-${id}`,
    variant: "standard",
    size: "small",
    placeholder: name,
    value: name,
  });
});

/* ======================================================================
   3️⃣ 렌더 완료 후 실행 (lockerRenderComplete 이벤트)
   ----------------------------------------------------------------------
   - 락커맵이 모두 렌더링된 뒤 실행됨
   - 메모 필드 / 락커 추가 팝오버 필드 등 동적 생성
   ====================================================================== */
document.addEventListener("lockerRenderComplete", () => {
  /* --------------------------------------------------
     🗒️ 상태별 메모 필드 생성
     --------------------------------------------------
     - reserved / in-use / expiring-soon / expired / available / unavailable
     - 각 상태별로 textarea 생성
     -------------------------------------------------- */
  const statuses = [
    "reserved",
    "in-use",
    "expiring-soon",
    "expired",
    "available",
    "unavailable",
  ];

  statuses.forEach((status) => {
    const container = document.querySelector(
      `#locker-detail-popover__field--memo-${status}`
    );

    // 방어 코드 (필드가 없을 수도 있음)
    if (!container) return;

    // textarea 필드 삽입
    container.innerHTML = createTextField({
      id: `textarea-small-popover-memo-${status}`,
      variant: "textarea",
      size: "small",
      placeholder: "락커 메모",
    });
  });

  /* --------------------------------------------------
     🧩 락커 추가 팝오버 입력 필드
     --------------------------------------------------
     - 필드명:
         1) 락커 번호 (#lockermap-popover__field--locker-number)
         2) 시작 번호 (#lockermap-popover__field--start-number)
     -------------------------------------------------- */

  // (1) 락커 번호 필드
  const lockerNumberField = document.querySelector(
    "#lockermap-popover__field--locker-number"
  );
  if (lockerNumberField) {
    lockerNumberField.innerHTML = createTextField({
      id: "standard-small-locker-number",
      variant: "standard",
      size: "small",
      label: "락커 번호",
    });
  }

  // (2) 시작 번호 필드
  const startNumberField = document.querySelector(
    "#lockermap-popover__field--start-number"
  );
  if (startNumberField) {
    startNumberField.innerHTML = createTextField({
      id: "standard-small-locker-start-number",
      variant: "standard",
      size: "small",
      label: "시작 번호",
    });
  }

  // (3) 시작 번호 input에 클래스 추가 (미리보기 등 연동용)
  const startInput = document.querySelector(
    "#lockermap-popover__field--start-number .text-field__input"
  );
  if (startInput) startInput.classList.add("locker-start-number-input");
});

/* ======================================================================
   4️⃣ DOMContentLoaded 시점 보조 처리 (fallback)
   ----------------------------------------------------------------------
   - 특정 환경에서 lockerRenderComplete 이벤트가
     발생하지 않았을 때를 대비한 안전 처리
   - .locker-card-wrap 존재 시 강제 이벤트 디스패치
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const fallbackCheck = document.querySelector(".locker-card-wrap");

  // 중복 실행 방지 플래그
  if (fallbackCheck && !window.__lockerFieldsInitialized) {
    window.__lockerFieldsInitialized = true;
    const event = new Event("lockerRenderComplete");
    document.dispatchEvent(event);
  }
});
