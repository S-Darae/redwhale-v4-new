/**
 * ======================================================================
 * ⚙️ settings.js — 센터 설정 > 기본 설정 페이지
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - 센터 설정 메뉴 중 “기본 설정” 페이지 스크립트
 * - 센터 기본 정보 수정 모달(fetch 로드) 초기화
 * - 볼륨 조절 UI(음소거/슬라이더) 제어
 * - 토글 스위치 생성 유틸(addToggle)
 * ----------------------------------------------------------------------
 * ⚙️ 주요 기능:
 * 1️⃣ 센터 기본 정보 수정 모달(loadCenterBasicInfoModal)
 * 2️⃣ 볼륨 조절 UI (음소거 버튼 + range 슬라이더)
 * 3️⃣ 토글 스위치 생성(createToggle) 유틸 함수
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - `<app-settings-page>` 컴포넌트로 구성
 *   → `<app-center-setting-menu>` 포함
 * - 볼륨 UI: `<app-volume-control>` 컴포넌트화
 * - addToggle() → `<app-toggle>` 리스트로 변환
 * - volume 상태 관리: Reactive Form 또는 signal 기반 상태로 연동
 * ----------------------------------------------------------------------
 * 🪄 관련 SCSS:
 * - settings.scss
 * - toggle.scss / button.scss / tooltip.scss
 * ======================================================================
 */

/* ======================================================================
   📦 Import (필요한 컴포넌트 / 모듈)
   ====================================================================== */
import { loadCenterBasicInfoModal } from "./center-basic-info-edit.js";
import "./center-setting-menu.js";
import "./settings.scss";

import "../../components/button/button.js";
import "../../components/tooltip/tooltip.js";
import "../../pages/common/main-menu.js";

import { createToggle } from "../../components/toggle/create-toggle.js";
import "../../components/toggle/toggle.scss";

/* ======================================================================
   🏁 초기화: 센터 설정 페이지 (기본 설정)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 공통 “센터 기본 정보 수정 모달” HTML + 필드 초기화
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCenterBasicInfoModal();
});

/* ======================================================================
   🔊 볼륨 조절 UI (Mute + Range)
   ----------------------------------------------------------------------
   ✅ 기능:
   - 음소거 버튼 + 슬라이더 + 레이블 구성
   - rangeInput 값(0~10)에 따라 아이콘 / 트랙 / 라벨 UI 동기화
   - 음소거 시 0으로 설정, 해제 시 이전 값 복구
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.querySelector(".mute-toggle-btn");
  const muteIcon = muteBtn.querySelector(".icon");
  const rangeInput = document.getElementById("volume-range");
  const thumbLabel = document.getElementById("slider-thumb-label");
  const volumeScaleSpans = document.querySelectorAll(".volume-scale span");

  // 마지막 볼륨 기억 (음소거 해제 시 복원용)
  let previousVolume = parseInt(rangeInput.value, 10);

  /* --------------------------------------------------
     1️⃣ 음소거 버튼 클릭 시
     -------------------------------------------------- */
  muteBtn.addEventListener("click", () => {
    const currentVolume = parseInt(rangeInput.value, 10);

    if (currentVolume !== 0) {
      // 🔹 현재 볼륨이 0이 아닐 경우 → 저장 후 0으로 전환
      previousVolume = currentVolume;
      rangeInput.value = 0;
      updateUI(0);
    } else {
      // 🔹 현재 0일 경우 → 저장된 볼륨 복구 (없으면 5)
      const restoreVolume = previousVolume > 0 ? previousVolume : 5;
      rangeInput.value = restoreVolume;
      updateUI(restoreVolume);
    }
  });

  /* --------------------------------------------------
     2️⃣ 슬라이더 직접 조작 시
     -------------------------------------------------- */
  rangeInput.addEventListener("input", () => {
    const volume = parseInt(rangeInput.value, 10);
    updateUI(volume);

    // 0이 아닐 때는 현재값을 복구용(previousVolume)에 저장
    if (volume > 0) previousVolume = volume;
  });

  /* --------------------------------------------------
     🧩 UI 업데이트 함수 모음
     -------------------------------------------------- */
  function updateUI(volume) {
    updateIcon(volume);
    updateSliderTrack(volume);
    updateThumbLabel(volume);
  }

  /**
   * 🔈 아이콘 상태 갱신 (스피커 ↔ 음소거)
   */
  function updateIcon(volume) {
    muteIcon.classList.toggle("icon--speaker-high", volume !== 0);
    muteIcon.classList.toggle("icon--speaker-slash", volume === 0);
  }

  /**
   * 🎚 range input 트랙 색상 채우기 (CSS 변수 활용)
   */
  function updateSliderTrack(volume) {
    rangeInput.style.setProperty("--range-fill", `${volume * 10}%`);
  }

  /**
   * 🏷 슬라이더 손잡이(label) 표시
   */
  function updateThumbLabel(volume) {
    if (!thumbLabel) return;
    thumbLabel.textContent = volume;
    // TODO: 필요 시 위치 조정 로직 추가
  }

  // 페이지 진입 시 초기 상태 반영
  updateUI(previousVolume);
});

/* ======================================================================
   🔘 토글 스위치 생성 유틸
   ----------------------------------------------------------------------
   ✅ 기능:
   - containerId 위치에 createToggle() 결과 삽입
   - 옵션 기반으로 variant/size/checked 제어
   ====================================================================== */

/**
 * 🧱 토글 생성 함수
 * @param {string} containerId - 토글을 삽입할 container ID
 * @param {object} options - createToggle 옵션 객체
 */
function addToggle(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.insertAdjacentHTML("beforeend", createToggle(options));
}

/* ======================================================================
   🪄 예시: 재입장 알림 토글 생성
   ----------------------------------------------------------------------
   ✅ 기능:
   - 두 개의 독립 토글 생성 (기본 ON / OFF)
   ====================================================================== */

// “입장 알림” 토글 (기본 ON)
addToggle("reentry-notification-toggle-1", {
  id: "toggle-entry-notification",
  size: "medium",
  variant: "standard",
  checked: true,
});

// “재입장 알림” 토글 (기본 OFF)
addToggle("reentry-notification-toggle-2", {
  id: "toggle-reentry-notification",
  size: "medium",
  variant: "standard",
});
