/**
 * ======================================================================
 * 🏢 center-basic-info-edit.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 기본 정보 수정 모달(Modal) 로드 및 초기화
 * - 입력 필드 자동 생성 / 전화번호 포맷팅 / 사업자등록증 영역 토글 기능 관리
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ center-basic-info-edit.html을 fetch로 동적 로드 후 body에 삽입
 * 2️⃣ createTextField() 기반으로 입력 필드 생성
 * 3️⃣ 전화번호 입력 포맷팅 및 유효성 검증(initPhoneInputs)
 * 4️⃣ leadingText(우편번호 prefix) padding-left 보정
 * 5️⃣ 사업자등록증 접기/펼치기 토글 기능
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-center-basic-info-modal>` 컴포넌트로 구현
 *   → `ngOnInit()`에서 fetch → TemplateRef에 삽입
 * - 입력 필드들은 `<app-text-field>` 재사용
 * - 전화번호 포맷팅은 Angular Directive(`telFormatDirective`)로 분리
 * - 사업자등록증 토글은 `[class.collapsed]` + (click)으로 제어
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - text-field.scss (입력 필드 공통 스타일)
 * - center-basic-info-edit.scss (모달 전용 스타일)
 * ======================================================================
 */

import { createTextField } from "../../components/text-field/create-text-field.js";
import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ======================================================================
   🏁 센터 기본 정보 수정 모달 초기화
   ----------------------------------------------------------------------
   ✅ 기능:
   - 모달 HTML(fetch로 불러온 파일)을 body에 삽입
   - 입력 필드 및 포맷팅/토글 기능 초기화
   ====================================================================== */
export function loadCenterBasicInfoModal() {
  return fetch("/src/pages/center-setting/center-basic-info-edit.html")
    .then((res) => res.text())
    .then((html) => {
      // 1️⃣ 모달 HTML을 body에 삽입
      document.body.insertAdjacentHTML("beforeend", html);

      // 2️⃣ 입력 필드 생성 (센터 이름 / 전화번호 / 주소 등)
      initCenterBasicInfoFields();

      // 3️⃣ leadingText prefix(예: 우편번호) padding-left 보정
      const modal = document.querySelector(
        '.modal-overlay[data-modal="center-basic-info-edit"]'
      );
      if (modal) {
        adjustInputPadding(modal);
      }

      // 4️⃣ 사업자등록증 접기/펼치기 기능 초기화
      initBizLicenseToggle();
    });
}

/* ======================================================================
   ✏️ 입력 필드 생성
   ----------------------------------------------------------------------
   ✅ 기능:
   - center-basic-info-edit.html 내부 placeholder 영역에
     createTextField()를 사용해 실제 <input> 삽입
   - dirty 옵션(true) → 변경 시 모달 confirm-exit 경고 지원
   ====================================================================== */
function initCenterBasicInfoFields() {
  {
    /* ------------------------------------------------------
       🏷️ 센터 이름
       ------------------------------------------------------ */
    const el = document.querySelector("#center-basic-info-edit-field--name");
    if (el) {
      el.innerHTML = createTextField({
        id: "standard-small-center-name",
        variant: "standard",
        size: "small",
        label: "센터 이름",
        value: "레드웨일짐",
        dirty: true,
      });
    }
  }

  {
    /* ------------------------------------------------------
       ☎️ 전화번호
       ------------------------------------------------------
       - data-format="tel" 속성 부여로 전화번호 포맷팅/검증 적용
       - initPhoneInputs()로 포맷팅 및 이벤트 연결
       ------------------------------------------------------ */
    const el = document.querySelector("#center-basic-info-edit-field--contact");
    if (el) {
      el.insertAdjacentHTML(
        "beforeend",
        createTextField({
          id: "standard-small-center-contact",
          variant: "standard",
          size: "small",
          label: "전화번호",
          value: "0511234567",
          extraAttrs: 'data-format="tel"',
          dirty: true,
        })
      );

      // 전화번호 포맷/유효성 검사 초기화
      initPhoneInputs(el);

      // 기본값에 대해서도 즉시 포맷 및 blur 유효성 검사 트리거
      const input = el.querySelector(".text-field__input[data-format='tel']");
      if (input) {
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
      }
    }
  }

  {
    /* ------------------------------------------------------
       🏠 주소 (읽기 전용)
       ------------------------------------------------------
       - leadingText: 우편번호 prefix "(48400)"
       - disabled: true → 수정 불가 상태
       ------------------------------------------------------ */
    const el = document.querySelector(
      "#center-basic-info-edit-field--address-1"
    );
    if (el) {
      el.innerHTML = createTextField({
        id: "standard-small-center-address-1",
        variant: "standard",
        size: "small",
        label: "주소",
        placeholder: "플레이스 홀더",
        leadingText: "(48400)",
        value: "부산 남구 전포대로 133",
        disabled: true,
      });
    }
  }

  {
    /* ------------------------------------------------------
       🏢 상세 주소
       ------------------------------------------------------
       - 사용자가 직접 입력 가능
       - dirty=true → confirm-exit 동작 트리거
       ------------------------------------------------------ */
    const el = document.querySelector(
      "#center-basic-info-edit-field--address-2"
    );
    if (el) {
      el.innerHTML = createTextField({
        id: "standard-small-center-address-2",
        variant: "standard",
        size: "small",
        placeholder: "상세 주소",
        value: "13층",
        dirty: true,
      });
    }
  }
}

/* ======================================================================
   🧾 사업자 등록증 접기/펼치기
   ----------------------------------------------------------------------
   ✅ 기능:
   - 기본 상태: 접힘(collapsed)
   - Header 클릭 시 → 접기/펼치기 토글
   - UI 구조: .center-basic-info-edit__biz-license 내부
   ====================================================================== */
function initBizLicenseToggle() {
  const bizLicense = document.querySelector(
    ".center-basic-info-edit__biz-license"
  );
  const bizLicenseHeader = bizLicense?.querySelector(
    ".center-basic-info-edit__biz-license-header"
  );
  if (bizLicense && bizLicenseHeader) {
    // 기본 접힘 상태 유지
    bizLicense.classList.add("collapsed");

    // Header 클릭 시 접힘 토글
    bizLicenseHeader.addEventListener("click", () => {
      bizLicense.classList.toggle("collapsed");
    });
  }
}
