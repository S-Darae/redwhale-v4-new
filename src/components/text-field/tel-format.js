/* ==========================
   전화번호 입력 초기화
   ==========================
   - 대상: data-format="tel" 이 지정된 text-field__input
   - 기능:
     1) 숫자만 입력 허용 (keydown 제한)
     2) 입력 중 자동 포맷팅 (010-1234-5678 등)
     3) blur 시 유효성 검사 (helper + caution 스타일 반영)
     4) helper / warning 아이콘 자동 생성 및 표시 제어
   ========================== */
export function initPhoneInputs(container = document) {
  const telInputs = container.querySelectorAll(
    '.text-field__input[data-format="tel"]'
  );

  telInputs.forEach((input) => {
    const wrapper = input.closest(".text-field");

    /* --------------------------
       helper (에러 메시지 영역) 생성
       -------------------------- */
    let helper = wrapper.querySelector(".hint-text");
    if (!helper) {
      const helperWrap = document.createElement("div");
      helperWrap.classList.add("helper");

      helper = document.createElement("div");
      helper.classList.add("hint-text");
      helperWrap.appendChild(helper);

      wrapper.appendChild(helperWrap);
    }

    /* --------------------------
       warning 아이콘 생성 (없으면)
       -------------------------- */
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

    /* --------------------------
       숫자만 입력 허용
       --------------------------
       - keydown 이벤트에서 필터링
       - 숫자/백스페이스/삭제/방향키/탭만 허용
       -------------------------- */
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

    /* --------------------------
       입력 이벤트
       --------------------------
       - 입력값을 숫자만 추출
       - formatTel()로 포맷 적용
       - 입력 중에는 caution/경고 초기화
       -------------------------- */
    input.addEventListener("input", (e) => {
      const raw = e.target.value.replace(/\D/g, ""); // 숫자만 추출
      input.value = formatTel(raw);

      wrapper.classList.remove("caution");
      if (helper) helper.textContent = "";
      if (warningIcon) warningIcon.style.display = "none";
    });

    /* --------------------------
       blur 이벤트 (focus out)
       --------------------------
       - 유효성 검사 실행
       - 실패 시: caution 스타일 + helper 메시지 + warning 아이콘 표시
       -------------------------- */
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

/* ==========================
   전화번호 포맷팅
   ==========================
   - 02 (서울)
   - 15xx/16xx/18xx (대표번호 ARS)
   - 0505 (개인번호)
   - 010, 031 등 휴대폰/지역번호
   - 입력된 길이에 따라 하이픈(-) 자동 삽입
   ========================== */
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

/* ==========================
   유효성 검사
   ==========================
   - 02: 9~10자리
   - 010/011/016/017/018/019: 10~11자리
   - 031, 032 등 지역번호: 10자리
   - 070: 11자리
   - 0505: 11자리
   - 15xx/16xx/18xx: 8자리
   ========================== */
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
