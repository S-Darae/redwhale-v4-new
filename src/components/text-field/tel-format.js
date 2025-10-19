/**
 * ======================================================================
 * ☎️ initPhoneInputs()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 전화번호 입력 필드(`data-format="tel"`)를 자동 포맷/검증/상태 표시하도록 초기화.
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 숫자만 입력 허용 (keydown에서 제한)
 * 2️⃣ 입력 중 자동 포맷팅 (예: 010-1234-5678)
 * 3️⃣ blur 시 유효성 검사 및 caution 상태 표시
 * 4️⃣ helper(에러 메시지) 및 warning 아이콘 자동 생성
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - Angular에서는 `app-phone-input` 컴포넌트로 분리 가능
 * - `@HostListener('input')` / `@HostListener('blur')`로 로직 이관
 * - 유효성 검사는 FormValidator로 대체 가능 (`Validators.pattern`)
 * ----------------------------------------------------------------------
 * 📘 예시 (Vanilla JS)
 * <input type="text" class="text-field__input" data-format="tel" />
 * initPhoneInputs(document);
 * ======================================================================
 */
export function initPhoneInputs(container = document) {
  // ✅ 대상: data-format="tel" 이 지정된 입력 필드
  const telInputs = container.querySelectorAll(
    '.text-field__input[data-format="tel"]'
  );

  telInputs.forEach((input) => {
    const wrapper = input.closest(".text-field");

    /* =========================================================
       🧱 helper (에러 메시지 영역) 생성
       ---------------------------------------------------------
       - helper가 없으면 자동으로 .helper + .hint-text 구조 생성
       - 유효성 실패 시 메시지 표시용
       ========================================================= */
    let helper = wrapper.querySelector(".hint-text");
    if (!helper) {
      const helperWrap = document.createElement("div");
      helperWrap.classList.add("helper");

      helper = document.createElement("div");
      helper.classList.add("hint-text");
      helperWrap.appendChild(helper);

      wrapper.appendChild(helperWrap);
    }

    /* =========================================================
       ⚠️ warning 아이콘 생성 (없으면)
       ---------------------------------------------------------
       - tailing 영역 내 icon--warning 삽입
       - 기본은 display: none (유효성 실패 시 표시)
       ========================================================= */
    let warningIcon = wrapper.querySelector(".tailing-icon--status");
    if (!warningIcon) {
      const tailing = wrapper.querySelector(".tailing");
      if (tailing) {
        warningIcon = document.createElement("span");
        warningIcon.classList.add("icon--warning", "tailing-icon--status");
        tailing.insertBefore(warningIcon, tailing.firstChild);
        warningIcon.style.display = "none"; // 기본 숨김
      }
    }

    /* =========================================================
       🔢 숫자만 입력 허용
       ---------------------------------------------------------
       - keydown 이벤트에서 숫자 / 백스페이스 / 삭제 / 방향키 / 탭만 허용
       ========================================================= */
    input.addEventListener("keydown", (e) => {
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Tab"
      ) {
        e.preventDefault();
      }
    });

    /* =========================================================
       🖋 입력 이벤트 (input)
       ---------------------------------------------------------
       - 숫자만 추출 후 formatTel()로 포맷 적용
       - 입력 중에는 caution / helper / 아이콘 초기화
       ========================================================= */
    input.addEventListener("input", (e) => {
      const raw = e.target.value.replace(/\D/g, ""); // 숫자만 추출
      input.value = formatTel(raw);

      wrapper.classList.remove("caution");
      if (helper) helper.textContent = "";
      if (warningIcon) warningIcon.style.display = "none";
    });

    /* =========================================================
       📴 blur 이벤트 (포커스 해제 시)
       ---------------------------------------------------------
       - validatePhoneNumber()로 유효성 검사
       - 실패 시:
         ⚠️ wrapper에 caution 클래스 추가
         ⚠️ helper 텍스트 표시
         ⚠️ warning 아이콘 표시
       ========================================================= */
    input.addEventListener("blur", () => {
      const raw = input.value.replace(/\D/g, "");
      const isValid = validatePhoneNumber(raw);

      if (!isValid && raw.length > 0) {
        wrapper.classList.add("caution");
        if (helper) helper.textContent = "전화번호가 올바른지 확인해 주세요.";
        if (warningIcon) warningIcon.style.display = "inline-block";
      } else {
        wrapper.classList.remove("caution");
        if (helper) helper.textContent = "";
        if (warningIcon) warningIcon.style.display = "none";
      }
    });
  });
}

/**
 * ======================================================================
 * 📞 formatTel()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 입력된 숫자(raw)를 하이픈(-) 포함된 전화번호 형태로 변환
 * ----------------------------------------------------------------------
 * ⚙️ 패턴별 포맷 규칙:
 * - 02 (서울)
 * - 15xx/16xx/18xx (대표번호 ARS)
 * - 0505 (개인번호)
 * - 010, 031 등 일반 휴대폰/지역번호
 * ----------------------------------------------------------------------
 * 📘 예시:
 * formatTel("01012345678") → "010-1234-5678"
 * formatTel("021234567") → "02-123-4567"
 * ======================================================================
 */
function formatTel(raw) {
  if (!raw) return "";

  if (raw.startsWith("02")) {
    // 서울 번호
    if (raw.length <= 2) return raw;
    if (raw.length <= 5) return `${raw.slice(0, 2)}-${raw.slice(2)}`;
    if (raw.length <= 9)
      return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5)}`;
    return `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6, 10)}`;
  } else if (/^(15|16|18)\d{2}/.test(raw)) {
    // 대표번호 (ARS)
    if (raw.length <= 4) return raw;
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
  } else if (raw.startsWith("0505")) {
    // 개인번호
    if (raw.length <= 4) return raw;
    if (raw.length <= 8) return `${raw.slice(0, 4)}-${raw.slice(4)}`;
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
  } else {
    // 휴대폰/지역번호
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    if (raw.length <= 10)
      return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  }
}

/**
 * ======================================================================
 * 🧩 validatePhoneNumber()
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 전화번호 숫자 문자열(raw)의 유효성을 검증
 * ----------------------------------------------------------------------
 * ⚙️ 유효성 기준:
 * - 02: 9~10자리
 * - 010/011/016/017/018/019: 10~11자리
 * - 031~099: 10자리
 * - 070: 11자리
 * - 0505: 11자리
 * - 15xx/16xx/18xx: 8자리
 * ----------------------------------------------------------------------
 * 📘 예시:
 * validatePhoneNumber("01012345678") → true
 * validatePhoneNumber("021234567") → true
 * validatePhoneNumber("01551234") → false
 * ======================================================================
 */
function validatePhoneNumber(raw) {
  if (!raw) return false;

  if (raw.startsWith("02") && (raw.length === 9 || raw.length === 10))
    return true; // 서울
  if (/^01[016789]/.test(raw) && (raw.length === 10 || raw.length === 11))
    return true; // 휴대폰
  if (/^0[3-9][0-9]/.test(raw) && raw.length === 10) return true; // 지역번호
  if (raw.startsWith("070") && raw.length === 11) return true; // 인터넷전화
  if (raw.startsWith("0505") && raw.length === 11) return true; // 개인번호
  if (/^(15|16|18)\d{2}/.test(raw) && raw.length === 8) return true; // 대표번호
  return false;
}
