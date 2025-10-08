import { createClassDetailPopover } from "./create-class-popover.js";
import { createMembershipDetailPopover } from "./create-membership-popover.js";

let activeCard = null; // 현재 팝오버가 열린 카드 요소
let activePopover = null; // 현재 열린 팝오버 요소

// 전역 데이터 저장소 (initPopover에서 받아옴)
let classData = [];
let membershipData = [];
let isInitialized = false; // 이벤트 중복 등록 방지 플래그

/**
 * 팝오버 초기화 함수
 *
 * 👉 각 페이지에서 호출해서 카드 데이터(classes, memberships)를 전달해야 함
 * 👉 이벤트 리스너(document click, resize, scroll)는 최초 1번만 등록됨
 *
 * @param {Object} options
 * @param {Array} [options.classes=[]] - 수업 카드 데이터 배열
 * @param {Array} [options.memberships=[]] - 회원권 카드 데이터 배열
 */
export function initPopover({ classes = [], memberships = [] } = {}) {
  // 데이터 갱신 (다른 페이지에서 initPopover 재호출 시 최신 데이터 반영)
  classData = classes;
  membershipData = memberships;

  /**
   * 팝오버 열기
   *
   * @param {HTMLElement} card - 클릭된 카드 엘리먼트
   * @param {"class"|"membership"} type - 카드 타입
   */
  function openPopover(card, type) {
    // 이미 열린 팝오버 있으면 닫고 새로 열기
    closePopover();

    let popoverHTML = "";

    // 카드 타입에 맞는 팝오버 HTML 생성
    if (type === "membership") {
      const data = membershipData.find((m) => m.id === card.dataset.id);
      if (data) popoverHTML = createMembershipDetailPopover(data);
    } else if (type === "class") {
      const data = classData.find((c) => c.id === card.dataset.id);
      if (data) popoverHTML = createClassDetailPopover(data);
    }
    if (!popoverHTML) return;

    // DOM 삽입
    const wrapper = document.createElement("div");
    wrapper.innerHTML = popoverHTML.trim();
    const popoverEl = wrapper.firstElementChild;
    document.body.appendChild(popoverEl);

    // 위치 계산 (requestAnimationFrame → DOM 렌더링 완료 후)
    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect(); // 카드 위치
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;
      const popoverWidth = 390;
      const popoverHeight = popoverEl.offsetHeight;

      // 카드가 화면 오른쪽에 있으면 → 팝오버를 왼쪽에 띄우기
      const isRight = rect.left + rect.width / 2 > window.innerWidth / 2;
      const left = isRight
        ? rect.left + scrollLeft - popoverWidth - 8 // 카드 왼쪽
        : rect.right + scrollLeft + 8; // 카드 오른쪽

      // 화면 하단 넘치지 않게 Y축 위치 보정
      const rawTop = rect.top + scrollTop;
      const maxTop = scrollTop + window.innerHeight - popoverHeight - 8;
      const top = Math.min(rawTop, maxTop);

      // 최종 스타일 적용
      popoverEl.style.position = "absolute";
      popoverEl.style.left = `${Math.max(
        8,
        Math.min(left, window.innerWidth - popoverWidth - 8)
      )}px`;
      popoverEl.style.top = `${Math.max(8, top)}px`;
      popoverEl.style.zIndex = "1000";
      popoverEl.classList.add(isRight ? "left" : "right");
    });

    // 상태 업데이트
    activeCard = card;
    activePopover = popoverEl;
    card.classList.add("popover-is-active");

    // 팝오버 닫기 버튼
    popoverEl.querySelector(".x-btn")?.addEventListener("click", closePopover);
  }

  /**
   * 팝오버 닫기
   */
  function closePopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }
    // 모든 카드에서 활성화 클래스 제거
    document
      .querySelectorAll(
        ".membership-card.popover-is-active, .class-card.popover-is-active"
      )
      .forEach((c) => c.classList.remove("popover-is-active"));
    activeCard = null;
  }

  /**
   * 이벤트 바인딩 (최초 1번만 등록됨)
   */
  if (!isInitialized) {
    // 전역 클릭 이벤트
    document.addEventListener("click", (e) => {
      const membershipCard = e.target.closest(".membership-card");
      const classCard = e.target.closest(".class-card");

      // 1) 카드 외부 클릭 → 팝오버 닫기
      if (!membershipCard && !classCard) {
        if (!activePopover?.contains(e.target)) closePopover();
        return;
      }

      const card = membershipCard || classCard;
      const checkboxInput = card.querySelector('input[type="checkbox"]');

      // 2) 체크박스 모드 처리
      if (card.classList.contains("checkbox-mode")) {
        if (e.target === checkboxInput) {
          // 체크박스 직접 클릭
          card.classList.toggle("is-selected", checkboxInput.checked);
          return;
        }
        if (checkboxInput) {
          // 카드 영역 클릭 시 체크박스 토글
          const newChecked = !checkboxInput.checked;
          checkboxInput.checked = newChecked;
          card.classList.toggle("is-selected", newChecked);
        }
        return; // 체크박스 모드에서는 팝오버 열지 않음
      }

      // 3) popover=false 옵션 → 팝오버 열지 않음
      if (card.dataset.popover === "false") return;

      // 4) 같은 카드 다시 클릭 → 팝오버 닫기
      if (activeCard === card) {
        closePopover();
        return;
      }

      // 5) 새로운 카드 클릭 → 팝오버 열기
      openPopover(card, membershipCard ? "membership" : "class");
    });

    // 브라우저 리사이즈/스크롤 시 팝오버 닫기
    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopover, { passive: true });

    isInitialized = true; // 중복 등록 방지
  }
}
