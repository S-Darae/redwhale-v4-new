import "./tab.scss";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-set").forEach((tabSet) => {
    /* ==========================
       Bg-tab (배경형 탭, <input type="radio"> 기반)
       ========================== */
    const bgInputs = tabSet.querySelectorAll(".bg-tab__input");
    const bgPanels = tabSet.querySelectorAll(".bg-tab__panel");

    if (bgInputs.length) {
      // 모든 패널 최초 mount (한 번만 실행)
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
              detail: { targetId, panelEl: panel },
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
       Line-tab (라인형 탭, button 기반)
       ========================== */
    const lineTabs = tabSet.querySelectorAll(".line-tab__tab");
    const linePanels = tabSet.querySelectorAll(".line-tab__panel");

    if (lineTabs.length) {
      // ✅ 모든 패널 최초 mount (한 번만 실행)
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
              detail: { targetId, panelEl: panel },
            });
            document.dispatchEvent(event);
          }
        });

        tab.classList.add("is-active");
      };

      // 초기 상태
      const activeTab = tabSet.querySelector(".line-tab__tab.is-active");
      if (activeTab) updateLineTab(activeTab);

      // 탭 클릭 시 갱신
      lineTabs.forEach((tab) => {
        tab.addEventListener("click", () => updateLineTab(tab));
      });
    }
  });
});
