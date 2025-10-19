/**
 * ======================================================================
 * 🧾 attendance-pad.js
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 출석번호 입력 패드 및 테마(라이트/다크) 전환 기능 관리
 * - 전체화면 전환 버튼 제어 포함
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 자동 테마 감지 (시간대별 라이트/다크 모드)
 * 2️⃣ 토글 스위치로 수동 테마 전환
 * 3️⃣ 출석번호 4자리 입력 및 삭제/확인 기능
 * 4️⃣ 전체화면 전환 버튼 (아이콘 및 상태 동기화)
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - 출석패드: `<app-attendance-pad>` 컴포넌트
 *   - 내부에서 `(click)` 이벤트 → FormControl 값 업데이트
 * - 테마 전환: `ThemeService`로 관리 (`document.body.classList` 대신 Service)
 * - 전체화면 제어: `FullscreenDirective` 또는 CDK Overlay 기반
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - attendance-pad.scss
 * - 버튼 스타일, 키패드 레이아웃, 다크모드 색상 정의 포함
 * ======================================================================
 */

import "../../components/button/button.js";
import "./attendance-pad.scss";

/* ======================================================================
   🌓 출석번호 입력 + 테마 토글
   ----------------------------------------------------------------------
   ✅ 기능:
   - 현재 시간대(7~18시)에 따라 자동 테마 결정
   - 사용자가 수동으로 테마 토글 가능
   - 출석번호 입력(4자리 제한), 삭제, 확인 기능 제공
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     🎨 테마 자동/수동 전환
     ---------------------------------------------------------
     - 오전 7시~18시: 라이트 모드
     - 그 외 시간: 다크 모드
     - 수동 전환: toggleSwitch change 이벤트로 body 클래스 제어
     ========================================================= */
  const toggleSwitch = document.getElementById("themeToggleSwitch");
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 18) {
    document.body.classList.remove("dark-mode");
    toggleSwitch.checked = false;
  } else {
    document.body.classList.add("dark-mode");
    toggleSwitch.checked = true;
  }

  // [수동 전환 이벤트]
  toggleSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleSwitch.checked);
  });

  /* =========================================================
     🔢 출석번호 입력 로직
     ---------------------------------------------------------
     - 4자리 숫자 입력 / 삭제 / 확인 처리
     - span 4개로 디스플레이 구성 (비어있을 경우 빈칸 표시)
     ========================================================= */
  const display = document.getElementById("attendanceDisplay");
  const spans = display.querySelectorAll("span"); // 4자리 고정
  let inputDigits = [];

  // 디스플레이 숫자 업데이트
  function updateDisplay() {
    spans.forEach((span, i) => {
      span.textContent = inputDigits[i] || ""; // 입력 없으면 빈칸
    });
  }

  // 키패드 버튼 이벤트
  document.querySelectorAll(".attendance-pad__keypad .key").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("delete")) {
        // ⬅ 마지막 숫자 삭제
        inputDigits.pop();
      } else if (btn.classList.contains("enter")) {
        // ✅ 입력 완료 (현재 콘솔 출력)
        console.log("확인:", inputDigits.join(""));
      } else {
        // 🔢 숫자 입력 (최대 4자리 제한)
        if (inputDigits.length < 4) {
          inputDigits.push(btn.textContent);
        }
      }
      updateDisplay();
    });
  });

  // 초기화 시 디스플레이 비움
  updateDisplay();
});

/* ======================================================================
   🖥 전체화면 전환 버튼
   ----------------------------------------------------------------------
   ✅ 기능:
   - 버튼 클릭 시 전체화면 요청 / 종료 전환
   - 전체화면 상태 변화(fullscreenchange) 감지하여 버튼 아이콘/텍스트 갱신
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("fullscreenBtn");
  const icon = btn.querySelector("i");

  /* =========================================================
     🔄 버튼 상태 업데이트
     ---------------------------------------------------------
     - 전체화면 여부에 따라 아이콘 및 라벨 변경
     ========================================================= */
  function updateBtn() {
    if (document.fullscreenElement) {
      // 🌕 전체화면 상태
      icon.classList.remove("icon--arrows-out");
      icon.classList.add("icon--arrows-in");
      btn.classList.add("light");
      btn.innerHTML = `<i class="icon--arrows-in icon"></i> 전체화면 종료`;
    } else {
      // 🌑 일반 상태
      icon.classList.remove("icon--arrows-in");
      icon.classList.add("icon--arrows-out");
      btn.classList.remove("light");
      btn.innerHTML = `<i class="icon--arrows-out icon"></i> 전체화면`;
    }
  }

  /* =========================================================
     🖱 클릭 이벤트 → 전체화면 요청 / 종료
     ========================================================= */
  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen(); // 전체화면 시작
    } else {
      document.exitFullscreen(); // 전체화면 종료
    }
  });

  /* =========================================================
     🔔 전체화면 상태 변화 감지
     ---------------------------------------------------------
     - 사용자가 ESC로 종료해도 버튼 상태 자동 갱신
     ========================================================= */
  document.addEventListener("fullscreenchange", updateBtn);

  // 초기 상태 세팅
  updateBtn();
});
