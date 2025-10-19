/**
 * ======================================================================
 * 💬 tooltip.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - data-tooltip 속성을 가진 요소에 툴팁을 표시하는 전역 스크립트
 * - 툴팁 방향, 줄바꿈(\n), 마우스 진입/이탈 시 표시/숨김 제어
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 마우스 진입(mouseenter) → data-tooltip 값 표시
 * 2️⃣ data-tooltip-direction으로 방향 제어 (top/bottom/left/right)
 * 3️⃣ \n 문자를 <br>로 변환하여 줄바꿈 지원
 * 4️⃣ 마우스 이탈(mouseleave) → 툴팁 숨김
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - Angular에서는 `TooltipDirective`로 구현 가능
 * - `@Input('appTooltip')`으로 툴팁 텍스트 전달
 * - `Renderer2`와 `HostListener('mouseenter')`, `('mouseleave')`로 이벤트 처리
 * - 방향 제어는 `[tooltipDirection]="..."`으로 Input 확장
 * ----------------------------------------------------------------------
 * 📘 사용 예시 (Vanilla JS)
 * <button
 *   data-tooltip="삭제됩니다\n되돌릴 수 없습니다"
 *   data-tooltip-direction="bottom">
 *   삭제
 * </button>
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - tooltip.scss
 * - 툴팁 박스, 꼬리(arrow), 방향별 포지션 정의 포함
 * ======================================================================
 */

import "./tooltip.scss";

/* =========================================================
   📦 초기화
   ---------------------------------------------------------
   - DOM 로드 후, 전역 단일 tooltip 요소를 body 하위에 생성
   - 모든 data-tooltip 요소를 이벤트 위임 방식으로 처리
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 전역 툴팁 엘리먼트 생성 (1개만 존재)
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  let currentEl = null; // 현재 툴팁이 표시 중인 요소 추적
  const arrowSize = 3; // 꼬리(arrow) 보정 값 (px)

  /* =========================================================
     🖱 mouseenter → 툴팁 표시
     ---------------------------------------------------------
     - data-tooltip 속성을 가진 요소 탐색
     - 툴팁 텍스트와 방향(direction) 읽어 표시
     - requestAnimationFrame으로 위치 계산 안정화
     ========================================================= */
  document.body.addEventListener(
    "mouseenter",
    (e) => {
      // data-tooltip 속성이 붙은 요소 탐색
      const el = e.target.closest("[data-tooltip]");
      if (!el || el === currentEl) return; // 중복 표시 방지

      currentEl = el;
      const content = el.getAttribute("data-tooltip");
      const direction = el.getAttribute("data-tooltip-direction") || "top";
      if (!content) return;

      // \n → <br> 변환
      tooltip.innerHTML = content.replace(/\n/g, "<br>");
      tooltip.className = `tooltip ${direction} visible`;

      // 위치 계산 (다음 프레임에서 실행)
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const { width, height } = tooltip.getBoundingClientRect();

        /* --------------------------------------------
           🎯 방향별 툴팁 좌표 계산
           --------------------------------------------
           - top: 요소 위쪽 중앙
           - bottom: 요소 아래쪽 중앙
           - left: 요소 왼쪽 중앙
           - right: 요소 오른쪽 중앙
           -------------------------------------------- */
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

        // 실제 위치/변환 스타일 적용
        tooltip.style.left = `${positions[direction].left}px`;
        tooltip.style.top = `${positions[direction].top}px`;
        tooltip.style.transform = positions[direction].transform;
      });
    },
    true
  );

  /* =========================================================
     🖱 mouseleave → 툴팁 숨김
     ---------------------------------------------------------
     - 현재 표시 중인 요소에서 마우스가 벗어날 때 툴팁 비활성화
     - visible 클래스 제거, currentEl 초기화
     ========================================================= */
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
