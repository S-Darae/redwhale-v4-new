/* ======================================================================
   📦 center-create.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 센터 생성 페이지 입력 필드 초기화
   - TextField 생성 함수(createTextField) 활용
   - 전화번호 입력 포맷(tel-format) 적용
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 각 필드는 FormControl 기반으로 연결 가능
   - tel-format.js → CustomDirective (e.g. [appTelMask])로 대체 가능
   - createTextField() → <app-text-field> 컴포넌트로 매핑 가능
   ====================================================================== */

import { initPhoneInputs } from "../../components/text-field/tel-format.js";
import "../../components/text-field/text-field.js";

/* ======================================================================
   🏷 센터 이름 필드
   ----------------------------------------------------------------------
   ✅ 역할:
   - 센터 이름 입력 필드 생성
   - variant: line / size: normal
   - autofocus 활성화
   ====================================================================== */
document.querySelector("#center-create__field--name").innerHTML =
  createTextField({
    id: "line-normal-name",
    variant: "line",
    size: "normal",
    placeholder: "센터 이름을 입력해 주세요.",
    autofocus: true,
  });

/* ======================================================================
   ☎️ 센터 연락처 (전화번호) 필드
   ----------------------------------------------------------------------
   ✅ 역할:
   - standard형 소형 전화번호 입력 필드 생성
   - data-format="tel" 속성을 부여하여 자동 포맷 적용
   - initPhoneInputs()로 전화번호 형식화 처리
   ====================================================================== */
const contactField = document.querySelector("#center-create__field--contact");
contactField.insertAdjacentHTML(
  "beforeend",
  createTextField({
    id: "standard-small-contact",
    variant: "standard",
    size: "small",
    extraAttrs: 'data-format="tel"',
  })
);

// 전화번호 입력 포맷 초기화
initPhoneInputs(contactField);

/* ======================================================================
   📍 주소 입력 필드 (기본주소 + 상세주소)
   ----------------------------------------------------------------------
   ✅ 역할:
   - 기본주소: disabled 상태 + leadingText로 우편번호 표시
   - 상세주소: 일반 입력 필드로 별도 값 입력 가능
   ====================================================================== */

// 기본주소
document.querySelector("#center-create__field--address-1").innerHTML =
  createTextField({
    id: "standard-small-address-1",
    variant: "standard",
    size: "small",
    leadingText: "(48400)",
    value: "부산 남구 전포대로 133",
    disabled: true,
  });

// 상세주소
document.querySelector("#center-create__field--address-2").innerHTML =
  createTextField({
    id: "standard-small-address-1",
    variant: "standard",
    size: "small",
    placeholder: "상세 주소",
    value: "13층",
  });
