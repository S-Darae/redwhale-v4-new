import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./settings.scss";

import "../../components/button/button.js";
import "../../components/tooltip/tooltip.js";
import "../../pages/common/main-menu.js";

import { createToggle } from "../../components/toggle/create-toggle.js";
import "../../components/toggle/toggle.scss";

/* ==========================
   📌 초기화: 센터 설정 페이지
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 공통 "센터 기본 정보 수정 모달" HTML + 필드 초기화
  loadCenterBasicInfoModal();
});

/* ==========================
   🔊 볼륨 조절 UI
   - 음소거 버튼 + 슬라이더 + 레이블
   - rangeInput 값(0~10)에 따라 UI/아이콘/트랙 동기화
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.querySelector(".mute-toggle-btn");
  const muteIcon = muteBtn.querySelector(".icon");
  const rangeInput = document.getElementById("volume-range");
  const thumbLabel = document.getElementById("slider-thumb-label");
  const volumeScaleSpans = document.querySelectorAll(".volume-scale span");

  let previousVolume = parseInt(rangeInput.value, 10); // 마지막 볼륨 값 기억 (음소거 해제 시 복구용)

  // [1] 음소거 버튼 클릭 시
  muteBtn.addEventListener("click", () => {
    const currentVolume = parseInt(rangeInput.value, 10);

    if (currentVolume !== 0) {
      // 현재 볼륨 ≠ 0 → 현재값 저장 후 0으로 변경
      previousVolume = currentVolume;
      rangeInput.value = 0;
      updateUI(0);
    } else {
      // 현재 볼륨 = 0 → 저장된 값 복구 (없으면 5로 기본 설정)
      const restoreVolume = previousVolume > 0 ? previousVolume : 5;
      rangeInput.value = restoreVolume;
      updateUI(restoreVolume);
    }
  });

  // [2] 슬라이더 직접 조작 시
  rangeInput.addEventListener("input", () => {
    const volume = parseInt(rangeInput.value, 10);
    updateUI(volume);

    // 0이 아닐 때는 현재값을 복구용(previousVolume)으로 저장
    if (volume > 0) previousVolume = volume;
  });

  // --------------------------
  // UI 업데이트 함수 모음
  // --------------------------
  function updateUI(volume) {
    updateIcon(volume);
    updateSliderTrack(volume);
    updateThumbLabel(volume);
  }

  // 아이콘 상태 (음소거/스피커) 전환
  function updateIcon(volume) {
    muteIcon.classList.toggle("icon--speaker-high", volume !== 0);
    muteIcon.classList.toggle("icon--speaker-slash", volume === 0);
  }

  // range input의 배경 채우기 (CSS 변수 활용)
  function updateSliderTrack(volume) {
    rangeInput.style.setProperty("--range-fill", `${volume * 10}%`);
  }

  // 슬라이더 손잡이(label) 표시 (선택적 기능)
  function updateThumbLabel(volume) {
    if (!thumbLabel) return;
    thumbLabel.textContent = volume;
    // TODO: 위치 조정 로직 필요 시 추가
  }

  // 페이지 진입 시 초기 상태 반영
  updateUI(previousVolume);
});

/* ==========================
   🔘 토글 스위치 생성 유틸
   - containerId 위치에 토글 삽입
   - createToggle(options) 사용
   ========================== */
function addToggle(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createToggle(options));
}

// [예시] 재입장 알림 토글 2종 생성
addToggle("reentry-notification-toggle-1", {
  id: "toggle-entry-notification",
  size: "medium",
  variant: "standard",
  checked: true, // 기본 ON
});

addToggle("reentry-notification-toggle-2", {
  id: "toggle-reentry-notification",
  size: "medium",
  variant: "standard",
  // 기본 OFF
});
