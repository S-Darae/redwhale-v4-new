import "./tooltip.scss";

/* ==========================
   Tooltip 초기화 스크립트
   ==========================
   ✅ 기능
   - data-tooltip 속성을 가진 요소에 마우스를 올리면 툴팁 표시
   - data-tooltip-direction 속성(top/bottom/left/right)으로 방향 제어
   - \n 문자를 <br>로 변환하여 줄바꿈 지원
   - mouseleave 시 툴팁 숨김

   ✅ 사용 예시
   <button data-tooltip="삭제됩니다\n되돌릴 수 없습니다" data-tooltip-direction="bottom">
     삭제
   </button>
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 전역 툴팁 엘리먼트 1개 생성
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  let currentEl = null; // 현재 툴팁이 붙어 있는 요소 추적
  const arrowSize = 3; // CSS 꼬리(화살표) 크기 보정용

  /* ==========================
     mouseenter → 툴팁 표시
     ========================== */
  document.body.addEventListener(
    "mouseenter",
    (e) => {
      // data-tooltip 속성이 있는 요소 찾기
      const el = e.target.closest("[data-tooltip]");
      if (!el || el === currentEl) return;

      currentEl = el;
      const content = el.getAttribute("data-tooltip");
      const direction = el.getAttribute("data-tooltip-direction") || "top";
      if (!content) return;

      // 줄바꿈 처리 후 표시
      tooltip.innerHTML = content.replace(/\n/g, "<br>");
      tooltip.className = `tooltip ${direction} visible`;

      // 위치 계산 (다음 프레임에서 실행 → 렌더링 안정화)
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const { width, height } = tooltip.getBoundingClientRect();

        // 방향별 좌표 정의
        const positions = {
          top: {
            left: rect.left + rect.width / 2,
            top: rect.top + window.scrollY - height - arrowSize,
            transform: "translateX(-50%)",
          },
          bottom: {
            left: rect.left + rect.width / 2,
            top: rect.bottom + window.scrollY + arrowSize,
            transform: "translateX(-50%)",
          },
          left: {
            left: rect.left - width - arrowSize,
            top: rect.top + window.scrollY + rect.height / 2,
            transform: "translateY(-50%)",
          },
          right: {
            left: rect.right + arrowSize,
            top: rect.top + window.scrollY + rect.height / 2,
            transform: "translateY(-50%)",
          },
        };

        // 실제 스타일 적용
        tooltip.style.left = `${positions[direction].left}px`;
        tooltip.style.top = `${positions[direction].top}px`;
        tooltip.style.transform = positions[direction].transform;
      });
    },
    true
  );

  /* ==========================
     mouseleave → 툴팁 숨김
     ========================== */
  document.body.addEventListener(
    "mouseleave",
    (e) => {
      const el = e.target.closest("[data-tooltip]");
      if (!el || el !== currentEl) return;
      tooltip.classList.remove("visible");
      currentEl = null;
    },
    true
  );
});
