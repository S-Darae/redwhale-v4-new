import "../../components/dropdown/dropdown.js";
import { createTextField } from "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.scss";

/* ==========================
   검색 필드
  ========================== */
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

/* ==========================
   폴더 편집 필드
   ========================== */
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

/* =========================================================
   렌더 완료 후 실행 (lockerRenderComplete 이벤트 기반)
   ========================================================= */
document.addEventListener("lockerRenderComplete", () => {
  /* ==========================
     상태별 메모 필드
     ========================== */
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

    // 없을 수 있으므로 방어
    if (!container) return;

    // 메모 textarea 필드 삽입
    container.innerHTML = createTextField({
      id: `textarea-small-popover-memo-${status}`,
      variant: "textarea",
      size: "small",
      placeholder: "락커 메모",
    });
  });

  /* ==========================
     락커 추가 팝오버 입력 필드
     ========================== */
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

  // 시작 번호 input에 고유 클래스 추가 (미리보기 등 연동용)
  const startInput = document.querySelector(
    "#lockermap-popover__field--start-number .text-field__input"
  );
  if (startInput) startInput.classList.add("locker-start-number-input");
});

/* =========================================================
   DOMContentLoaded 시점 보조 (lockerRenderComplete 없을 경우 fallback)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 만약 lockerRenderComplete 이벤트를 못 받은 경우에도
  // 최소한 검색 / 폴더 필드가 동작하도록 fallback 처리
  const fallbackCheck = document.querySelector(".locker-card-wrap");
  if (fallbackCheck && !window.__lockerFieldsInitialized) {
    window.__lockerFieldsInitialized = true;
    const event = new Event("lockerRenderComplete");
    document.dispatchEvent(event);
  }
});
