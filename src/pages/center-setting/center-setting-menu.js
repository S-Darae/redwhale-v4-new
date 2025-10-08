import "../../components/modal/modal.js";

/* ==========================
   센터 설정 공통 메뉴 컴포넌트
   - Custom Element <center-setting-menu> 정의
   - 센터 이름/코드, 설정 메뉴 네비게이션 표시
   - 현재 페이지에 맞는 메뉴 active 처리
   - 행 전체 클릭 시 링크 이동 지원
   ========================== */
(() => {
  if (!customElements.get("center-setting-menu")) {
    class CenterSettingMenu extends HTMLElement {
      connectedCallback() {
        // 현재 페이지에 해당하는 메뉴 key
        const ACTIVE = (
          this.dataset.active || this._inferActive()
        ).toLowerCase();

        // TODO: 추후 API 연동으로 변경 예정
        const NAME = "레드웨일짐";
        const CODE = "AA0000";
        const URLS = {
          settings: "settings.html",
          staff: "staff.html",
          notice: "notice.html",
          payments: "payments.html",
        };

        // 메뉴 HTML 렌더링
        this.innerHTML = `
          <section class="center-setting-menu-wrap">
            <p class="center-setting-menu__title">센터 설정</p>

            <!-- 센터 기본 정보 -->
            <div class="center-setting-menu__center-info">
              <div class="center-setting-menu__avatar"></div>
              <div class="center-setting-menu__info">
                <p class="center-setting-menu__name">${NAME}</p>
                <p class="center-setting-menu__code">
                  <span class="center-setting-menu__code-label">센터코드</span>
                  ${CODE}
                </p>
              </div>

              <!-- 기본 정보 수정 모달 열기 버튼 -->
              <button
                class="btn--icon-utility center-basic-info-edit-modal-btn"
                type="button"
                data-target="#center-basic-info-edit-modal"
                data-tooltip="기본 정보 수정"
                data-tooltip-direction="right"
                aria-label="기본 정보 수정"
                data-modal-open="center-basic-info-edit"
              >
                <i class="icon--edit icon"></i>
              </button>
            </div>

            <!-- 메뉴 네비게이션 -->
            <nav class="center-setting-menu__nav" aria-label="센터 설정">
              <ul class="center-setting-menu__body">
                ${this._item(
                  "settings",
                  URLS.settings,
                  "icon--filter",
                  "기본 설정"
                )}
                ${this._item("staff", URLS.staff, "icon--user-circle", "직원")}
                ${this._item("notice", URLS.notice, "icon--menu--noti", "공지")}
                ${this._item(
                  "payments",
                  URLS.payments,
                  "icon--receipt",
                  "이용권 결제 관리"
                )}
              </ul>
            </nav>
          </section>
        `;

        // 현재 페이지 메뉴에 selected 클래스 부여
        this.querySelectorAll(".center-setting-menu__item").forEach((li) => {
          li.classList.toggle(
            "center-setting-menu__item--selected",
            li.dataset.key === ACTIVE
          );
        });
      }

      // 개별 메뉴 아이템 HTML 반환
      _item(key, href, iconClass, label) {
        return `
          <li class="center-setting-menu__item" data-key="${key}">
            <a class="center-setting-menu__item-link" href="${href}">
              <div class="center-setting-menu__item-info">
                <i class="${iconClass} icon"></i>
                <div class="center-setting-menu__item-name">${label}</div>
              </div>
            </a>
          </li>
        `;
      }

      // 현재 URL pathname을 기반으로 활성 메뉴 추론
      _inferActive() {
        const p = location.pathname;
        if (p.endsWith("staff.html")) return "staff";
        if (p.endsWith("notice.html")) return "notice";
        if (p.endsWith("payments.html")) return "payments";
        return "settings";
      }
    }

    // custom element 등록
    customElements.define("center-setting-menu", CenterSettingMenu);
  }

  /* ==========================
     행 전체 클릭 → 링크 이동
     - Ctrl/⌘ 누르면 새 탭 열기 지원
     - 모달 버튼(data-modal-open)은 클릭 시 이동 방지
     ========================== */
  document.addEventListener("click", (e) => {
    const host = e.target.closest("center-setting-menu");
    if (!host) return;

    // 모달 버튼 클릭 시 링크 이동 방지
    if (e.target.closest("[data-modal-open]")) return;

    // a 태그 직접 클릭이면 브라우저 기본 동작 유지
    if (e.target.closest("a.center-setting-menu__item-link")) return;

    const li = e.target.closest(".center-setting-menu__item");
    if (!li || !host.contains(li)) return;

    const a = li.querySelector("a.center-setting-menu__item-link");
    if (!a || !a.getAttribute("href")) return;

    // 전체 행 클릭 시 링크 이동
    e.preventDefault();
    const href = a.getAttribute("href");
    if (e.metaKey || e.ctrlKey) {
      window.open(href, "_blank"); // 새 탭
    } else {
      window.location.assign(href); // 현재 창 이동
    }
  });
})();

/* ==========================
   센터 기본 정보 수정 모달 내 사업자등록증 접기/펼치기
   - 디폴트: 접힘 상태(collapsed)
   - Header 클릭 시 접힘/펼침 토글
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const bizLicense = document.querySelector(
    ".center-basic-info-edit__biz-license"
  );
  const bizLicenseHeader = bizLicense?.querySelector(
    ".center-basic-info-edit__biz-license-header"
  );

  if (bizLicense && bizLicenseHeader) {
    bizLicense.classList.add("collapsed"); // 디폴트 접힘
    bizLicenseHeader.addEventListener("click", () => {
      bizLicense.classList.toggle("collapsed");
    });
  }
});
