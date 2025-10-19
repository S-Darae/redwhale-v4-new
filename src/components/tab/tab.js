import "./tab.scss";

/* ======================================================================
   🧭 공통 탭 컴포넌트
   ----------------------------------------------------------------------
   ✅ 역할:
   - Bg-tab (배경형): <input type="radio"> 기반 탭 전환
   - Line-tab (라인형): <button> 기반 탭 전환
   ----------------------------------------------------------------------
   ⚙️ 주요 기능:
   - 탭 전환 시 대응되는 panel 표시 / 나머지 숨김
   - <template id="tpl-panelId"> 기반 Lazy Mount 지원
   - 각 탭 전환 후 `tab-updated` 커스텀 이벤트 발생
   ----------------------------------------------------------------------
   🧩 Angular 변환 가이드:
   - Bg-tab → `<app-tabs variant="bg">` 컴포넌트로 매핑
   - Line-tab → `<app-tabs variant="line">` 컴포넌트로 매핑
   - input/radio 기반 로직 제거 → Angular 양방향 바인딩으로 전환
   - `tab-updated` → `@Output() tabChange = new EventEmitter()`
   ----------------------------------------------------------------------
   📘 예시 (현재 구조)
   <div class="tab-set">
     <div class="line-tab__list">
       <button class="line-tab__tab is-active" data-target="panel-1">탭 1</button>
       <button class="line-tab__tab" data-target="panel-2">탭 2</button>
     </div>
     <div id="panel-1" class="line-tab__panel">패널1</div>
     <div id="panel-2" class="line-tab__panel">패널2</div>
   </div>
   ----------------------------------------------------------------------
   📘 Angular 구성 예시
   <app-tabs [(activeTab)]="currentTab">
     <app-tab label="탭1" id="panel-1">패널1</app-tab>
     <app-tab label="탭2" id="panel-2">패널2</app-tab>
   </app-tabs>
   ====================================================================== */

/**
 * 📌 initTabSet()
 * ----------------------------------------------------------------------
 * - 개별 `.tab-set` 영역의 Bg-tab / Line-tab 초기화
 * - Lazy mount + 탭 전환 시 DOM 갱신
 */
function initTabSet(tabSet) {
  /* =========================================================
     🎨 Bg-tab (배경형 탭)
     ---------------------------------------------------------
     - input[type=radio] + label 구조로 구성
     - 각 input은 label의 data-target을 참조해 panel 연결
     ========================================================= */
  const bgInputs = tabSet.querySelectorAll(".bg-tab__input");
  const bgPanels = tabSet.querySelectorAll(".bg-tab__panel");

  if (bgInputs.length) {
    // 모든 패널 최초 mount
    bgPanels.forEach((panel) => {
      if (panel.children.length === 0) {
        const tpl = document.getElementById(`tpl-${panel.id}`);
        if (tpl) panel.appendChild(tpl.content.cloneNode(true));
      }
      panel.hidden = true;
      panel.classList.remove("is-visible");
    });

    /**
     * ✅ updateBgTab(input)
     * - 선택된 input의 data-target과 일치하는 패널만 표시
     * - 나머지 패널은 hidden 처리
     * - 탭 변경 시 `tab-updated` 이벤트 발행
     */
    const updateBgTab = (input) => {
      const targetId = input.nextElementSibling.dataset.target;

      bgPanels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle("is-visible", isTarget);

        if (isTarget) {
          const event = new CustomEvent("tab-updated", {
            detail: {
              targetId,
              panelEl: panel,
              scope: tabSet.dataset.scope || "global",
            },
          });
          document.dispatchEvent(event);
        }
      });
    };

    // 초기 활성화된 input 찾기
    const checked = tabSet.querySelector(".bg-tab__input:checked");
    if (checked) updateBgTab(checked);

    // input 변경 시 패널 업데이트
    bgInputs.forEach((input) => {
      input.addEventListener("change", () => updateBgTab(input));
    });
  }

  /* =========================================================
     🧱 Line-tab (라인형 탭)
     ---------------------------------------------------------
     - <button class="line-tab__tab"> 기반 구조
     - data-target 속성으로 연결된 panel 표시
     ========================================================= */
  const lineTabs = tabSet.querySelectorAll(".line-tab__tab");
  const linePanels = tabSet.querySelectorAll(".line-tab__panel");

  if (lineTabs.length) {
    // 모든 패널 최초 mount
    linePanels.forEach((panel) => {
      if (panel.children.length === 0) {
        const tpl = document.getElementById(`tpl-${panel.id}`);
        if (tpl) panel.appendChild(tpl.content.cloneNode(true));
      }
      panel.hidden = true;
      panel.classList.remove("is-visible");
    });

    /**
     * ✅ updateLineTab(tab)
     * - 클릭된 탭의 data-target 패널만 표시
     * - 탭 활성 상태(`is-active`) 갱신
     * - `tab-updated` 커스텀 이벤트 발행
     */
    const updateLineTab = (tab) => {
      const targetId = tab.dataset.target;

      // 기존 탭/패널 상태 초기화
      lineTabs.forEach((t) => t.classList.remove("is-active"));
      linePanels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle("is-visible", isTarget);

        if (isTarget) {
          const event = new CustomEvent("tab-updated", {
            detail: {
              targetId,
              panelEl: panel,
              scope: tabSet.dataset.scope || "global",
            },
          });
          document.dispatchEvent(event);
        }
      });

      // 선택된 탭 활성화
      tab.classList.add("is-active");
    };

    // 초기 상태: 활성 탭이 없으면 첫 번째 탭 활성화
    const activeTab =
      tabSet.querySelector(".line-tab__tab.is-active") || lineTabs[0];
    if (activeTab) updateLineTab(activeTab);

    // 클릭 시 탭 갱신
    lineTabs.forEach((tab) => {
      tab.addEventListener("click", () => updateLineTab(tab));
    });
  }
}

/* ======================================================================
   1️⃣ 전역 초기화 (팝오버 내부 제외)
   ----------------------------------------------------------------------
   - 페이지 로드 시 .tab-set 요소 자동 초기화
   - popover-tab-set 클래스가 있는 경우 제외
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".tab-set:not(.popover-tab-set)")
    .forEach(initTabSet);
});

/* ======================================================================
   2️⃣ 외부 초기화 함수 export
   ----------------------------------------------------------------------
   - 특정 DOM 영역만 탭 초기화할 수 있도록 별도 함수 제공
   - 예: 동적 모달/탭 생성 시 initializeTabs(containerEl)
   ====================================================================== */
export function initializeTabs(target) {
  if (!target) return;
  const tabSets = target.matches(".tab-set")
    ? [target]
    : target.querySelectorAll(".tab-set");
  tabSets.forEach(initTabSet);
}
