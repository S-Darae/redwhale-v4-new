/**
 * ======================================================================
 * 🏗 center-setting-menu.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 공통 사이드 메뉴(Custom Element) 정의
 * - 센터 정보(이름, 코드) 표시 + 설정 메뉴 네비게이션 구성
 * - 현재 페이지 경로에 따라 active 메뉴 자동 하이라이트
 * - 행 전체 클릭 시 링크 이동 / 새 탭 열기 지원
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ Custom Element <center-setting-menu> 등록
 * 2️⃣ 메뉴 렌더링 (센터명, 코드, 네비게이션)
 * 3️⃣ 현재 URL 기반 active 메뉴 자동 선택
 * 4️⃣ 각 행 클릭 시 해당 페이지로 이동 (Ctrl/⌘ → 새 탭)
 * 5️⃣ “기본 정보 수정” 모달 버튼 클릭 시 이동 방지
 * 6️⃣ 모달 내 사업자등록증 영역 접기/펼치기
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-center-setting-menu>` 컴포넌트로 구성
 *   → @Input() activeKey 로 활성 메뉴 전달
 * - routerLinkActive 사용 시 active 자동 반영
 * - 기본 정보 수정 모달은 `<app-modal>` 하위 컴포넌트에서 관리
 * - 클릭 이동 로직은 Router.navigate()로 대체
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - center-setting-menu.scss
 * - modal.scss (모달 열림 버튼 및 툴팁 연동)
 * ======================================================================
 */

import "../../components/modal/modal.js";

/* ======================================================================
   🧭 센터 설정 공통 메뉴 (Custom Element)
   ----------------------------------------------------------------------
   ✅ 기능:
   - Custom Element <center-setting-menu> 정의 및 등록
   - 내부에 센터 정보 + 설정 메뉴 렌더링
   - active 메뉴 자동 표시
   ====================================================================== */
(() => {
  if (!customElements.get("center-setting-menu")) {
    class CenterSettingMenu extends HTMLElement {
      /**
       * =========================================================
       * ⚙️ Custom Element 연결 시 초기 렌더링
       * =========================================================
       */
      connectedCallback() {
        // 현재 활성화된 메뉴 키 (data-active 속성 → URL 기반 추론 fallback)
        const ACTIVE = (
          this.dataset.active || this._inferActive()
        ).toLowerCase();

        // TODO: 추후 API 연동으로 변경 예정
        const NAME = "레드웨일짐"; // 센터 이름
        const CODE = "AA0000"; // 센터 코드
        const URLS = {
          settings: "./settings.html",
          staff: "./staff.html",
          notice: "./notice.html",
          "payment-manage": "./payment-manage.html",
        };

        // HTML 템플릿 렌더링
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

            <!-- 설정 메뉴 네비게이션 -->
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
                  "payment-manage",
                  URLS["payment-manage"],
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

      /**
       * =========================================================
       * 📦 개별 메뉴 아이템 HTML 반환
       * @param {string} key 메뉴 고유 키
       * @param {string} href 이동 경로
       * @param {string} iconClass 아이콘 클래스명
       * @param {string} label 메뉴 이름
       * @returns {string} HTML 문자열
       * =========================================================
       */
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

      /**
       * =========================================================
       * 🔍 현재 URL pathname 기반으로 활성 메뉴 추론
       * =========================================================
       */
      _inferActive() {
        const p = location.pathname;
        if (p.endsWith("staff.html")) return "staff";
        if (p.endsWith("notice.html")) return "notice";
        if (p.endsWith("payment-manage.html")) return "payment-manage";
        return "settings"; // 기본값
      }
    }

    // Custom Element 등록
    customElements.define("center-setting-menu", CenterSettingMenu);
  }

  /* ======================================================================
     🖱 행 전체 클릭 → 링크 이동
     ----------------------------------------------------------------------
     ✅ 기능:
     - <li> 행 전체 클릭 시 해당 메뉴 링크로 이동
     - Ctrl / ⌘ 키 → 새 탭 열기 지원
     - data-modal-open 버튼 클릭 시 이동 방지
     ====================================================================== */
  document.addEventListener("click", (e) => {
    const host = e.target.closest("center-setting-menu");
    if (!host) return;

    // 모달 버튼 클릭 시 → 링크 이동 방지
    if (e.target.closest("[data-modal-open]")) return;

    // a 태그 직접 클릭 시 → 브라우저 기본 동작 유지
    if (e.target.closest("a.center-setting-menu__item-link")) return;

    // 클릭된 요소가 메뉴 항목인지 확인
    const li = e.target.closest(".center-setting-menu__item");
    if (!li || !host.contains(li)) return;

    const a = li.querySelector("a.center-setting-menu__item-link");
    if (!a || !a.getAttribute("href")) return;

    // 행 전체 클릭 시 이동 처리
    e.preventDefault();
    const href = a.getAttribute("href");
    if (e.metaKey || e.ctrlKey) {
      window.open(href, "_blank"); // 새 탭에서 열기
    } else {
      window.location.assign(href); // 현재 창 이동
    }
  });
})();

/* ======================================================================
   🧾 센터 기본 정보 수정 모달 내 사업자등록증 접기/펼치기
   ----------------------------------------------------------------------
   ✅ 기능:
   - 기본 상태: 접힘(collapsed)
   - Header 클릭 시 접힘/펼침 토글
   - 구조: .center-basic-info-edit__biz-license
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const bizLicense = document.querySelector(
    ".center-basic-info-edit__biz-license"
  );
  const bizLicenseHeader = bizLicense?.querySelector(
    ".center-basic-info-edit__biz-license-header"
  );

  if (bizLicense && bizLicenseHeader) {
    bizLicense.classList.add("collapsed"); // 기본 접힘 상태
    bizLicenseHeader.addEventListener("click", () => {
      bizLicense.classList.toggle("collapsed");
    });
  }
});
