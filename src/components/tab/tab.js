import "./tab.scss";

/* =====================================================
   탭 컴포넌트 (공통)
   - Bg-tab: <input type="radio"> 기반 (배경형)
   - Line-tab: <button> 기반 (라인형)
   ===================================================== */

/**
 * 📌 개별 탭셋 초기화 함수
 */
function initTabSet(tabSet) {
  /* ==========================
     Bg-tab (배경형 탭)
     ========================== */
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

    const updateBgTab = (input) => {
      const targetId = input.nextElementSibling.dataset.target;

      bgPanels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle("is-visible", isTarget);

        if (isTarget) {
          // 탭 렌더링 완료 이벤트 발생
          const event = new CustomEvent("tab-updated", {
            detail: { targetId, panelEl: panel, scope: tabSet.dataset.scope || "global" },
          });
          document.dispatchEvent(event);
        }
      });
    };

    // 초기 상태
    const checked = tabSet.querySelector(".bg-tab__input:checked");
    if (checked) updateBgTab(checked);

    // input 변경 시 갱신
    bgInputs.forEach((input) => {
      input.addEventListener("change", () => updateBgTab(input));
    });
  }

  /* ==========================
     Line-tab (라인형 탭)
     ========================== */
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

    const updateLineTab = (tab) => {
      const targetId = tab.dataset.target;

      lineTabs.forEach((t) => t.classList.remove("is-active"));
      linePanels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle("is-visible", isTarget);

        if (isTarget) {
          const event = new CustomEvent("tab-updated", {
            detail: { targetId, panelEl: panel, scope: tabSet.dataset.scope || "global" },
          });
          document.dispatchEvent(event);
        }
      });

      tab.classList.add("is-active");
    };

    // 초기 상태
    const activeTab = tabSet.querySelector(".line-tab__tab.is-active") || lineTabs[0];
    if (activeTab) updateLineTab(activeTab);

    // 클릭 시 갱신
    lineTabs.forEach((tab) => {
      tab.addEventListener("click", () => updateLineTab(tab));
    });
  }
}

/* =====================================================
   1️⃣ 전역 초기화 (팝오버 내부 제외)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-set:not(.popover-tab-set)").forEach(initTabSet);
});

/* =====================================================
   2️⃣ 외부에서 특정 영역만 초기화 가능하도록 export
   ===================================================== */
export function initializeTabs(target) {
  if (!target) return;
  const tabSets = target.matches(".tab-set")
    ? [target]
    : target.querySelectorAll(".tab-set");
  tabSets.forEach(initTabSet);
}
