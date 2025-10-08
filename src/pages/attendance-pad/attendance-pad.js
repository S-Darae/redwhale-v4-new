import "../../components/button/button.js";
import "./attendance-pad.scss";

/* ==========================
   📌 출석번호 입력 + 테마 토글
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("themeToggleSwitch");

  // [자동 테마 설정]
  // - 오전 7시 ~ 오후 6시(18시): 라이트 모드
  // - 그 외 시간: 다크 모드
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 18) {
    document.body.classList.remove("dark-mode");
    toggleSwitch.checked = false;
  } else {
    document.body.classList.add("dark-mode");
    toggleSwitch.checked = true;
  }

  // [수동 테마 전환]
  // 토글 스위치 상태에 따라 body에 dark-mode 클래스 토글
  toggleSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleSwitch.checked);
  });

  // [출석번호 입력 로직]
  const display = document.getElementById("attendanceDisplay");
  const spans = display.querySelectorAll("span"); // 항상 4자리 span 구조
  let inputDigits = [];

  // 디스플레이에 현재 입력된 숫자 반영
  function updateDisplay() {
    spans.forEach((span, i) => {
      span.textContent = inputDigits[i] || ""; // 입력 없으면 빈칸
    });
  }

  // 키패드 이벤트 등록
  document.querySelectorAll(".attendance-pad__keypad .key").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("delete")) {
        // 마지막 숫자 삭제
        inputDigits.pop();
      } else if (btn.classList.contains("enter")) {
        // 입력 완료 → 확인 로직 실행 (현재는 console.log)
        console.log("확인:", inputDigits.join(""));
      } else {
        // 숫자 버튼 클릭 시 최대 4자리까지 입력
        if (inputDigits.length < 4) {
          inputDigits.push(btn.textContent);
        }
      }
      updateDisplay();
    });
  });

  // 초기 상태 반영
  updateDisplay();
});

/* ==========================
   📌 전체화면 전환 버튼
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("fullscreenBtn");
  const icon = btn.querySelector("i");

  // 버튼 상태 업데이트 (아이콘/텍스트 전환)
  function updateBtn() {
    if (document.fullscreenElement) {
      // 전체화면 상태일 때
      icon.classList.remove("icon--arrows-out");
      icon.classList.add("icon--arrows-in");
      btn.classList.add("light");
      btn.innerHTML = `<i class="icon--arrows-in icon"></i> 전체화면 종료`;
    } else {
      // 일반 상태일 때
      icon.classList.remove("icon--arrows-in");
      icon.classList.add("icon--arrows-out");
      btn.classList.remove("light");
      btn.innerHTML = `<i class="icon--arrows-out icon"></i> 전체화면`;
    }
  }

  // 버튼 클릭 시 전체화면 요청/종료 전환
  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // 전체화면 상태 변경 이벤트 감지 → 버튼 상태 갱신
  document.addEventListener("fullscreenchange", updateBtn);

  // 초기 버튼 상태 세팅
  updateBtn();
});
