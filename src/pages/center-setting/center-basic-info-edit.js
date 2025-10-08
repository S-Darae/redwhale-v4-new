import { createTextField } from "../../components/text-field/create-text-field.js";
import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ==========================
   센터 기본 정보 수정 모달 초기화
   - 모달 HTML을 fetch로 로드 후 body에 삽입
   - 필드 자동 생성(createTextField)
   - 전화번호 포맷팅/검증 초기화
   - 사업자등록증 영역 접기/펼치기 기능 추가
   ========================== */
export function loadCenterBasicInfoModal() {
  return fetch("/src/pages/center-setting/center-basic-info-edit.html")
    .then((res) => res.text())
    .then((html) => {
      // 1) 모달 HTML 동적 삽입
      document.body.insertAdjacentHTML("beforeend", html);

      // 2) 입력 필드 생성 (센터 이름/전화번호/주소 등)
      initCenterBasicInfoFields();

      // 3) leadingText padding-left 보정 (주소 input 같이 prefix 있는 경우)
      const modal = document.querySelector(
        '.modal-overlay[data-modal="center-basic-info-edit"]'
      );
      if (modal) {
        adjustInputPadding(modal);
      }

      // 4) 사업자등록증 토글 기능 연결
      initBizLicenseToggle();
    });
}

/* ==========================
   입력 필드 생성
   - center-basic-info-edit.html 안의 placeholder 영역에
     createTextField()를 사용해 실제 input DOM 삽입
   - dirty: true 옵션 → 값 변경 시 모달에서 confirm-exit 동작 지원
   ========================== */
function initCenterBasicInfoFields() {
  {
    /* 센터 이름 */
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
    /* 전화번호 */
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
          extraAttrs: 'data-format="tel"', // 전화번호 포맷팅 전용 속성
          dirty: true,
        })
      );

      // 전화번호 포맷/유효성 검사 초기화
      initPhoneInputs(el);

      // 기본값도 포맷팅 + 유효성 검사 강제 실행
      const input = el.querySelector(".text-field__input[data-format='tel']");
      if (input) {
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
      }
    }
  }

  {
    /* 주소 (읽기 전용) */
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
        leadingText: "(48400)", // 우편번호 prefix
        value: "부산 남구 전포대로 133",
        disabled: true,
      });
    }
  }

  {
    /* 상세 주소 */
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

/* ==========================
   사업자 등록증 영역 접고/펼치기
   - 기본: 접힌 상태(collapsed)
   - Header 클릭 시 접힘/펼침 토글
   ========================== */
function initBizLicenseToggle() {
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
}
