import { createSlideButtons } from "../button/create-slide-button.js";
import "./carousel.scss";

/**
 * Carousel 컴포넌트
 * - 좌우 슬라이드 이동을 지원하는 캐러셀(수평 슬라이드) UI
 * - 슬라이드 버튼(createSlideButtons)을 함께 사용하여
 *   현재 슬라이드 위치와 전체 개수를 표시하고 이동 제어
 *
 * 구성 요소 (필수 DOM 구조):
 * <div class="carousel">
 *   <div class="carousel__track">
 *     <div class="carousel__slide">슬라이드1</div>
 *     <div class="carousel__slide">슬라이드2</div>
 *     ...
 *   </div>
 *   <div class="carousel__controls"></div> <!-- 버튼 UI 삽입 -->
 * </div>
 */
export class Carousel {
  /**
   * @param {HTMLElement} container - 캐러셀 최상위 컨테이너
   */
  constructor(container) {
    this.container = container;
    this.track = container.querySelector(".carousel__track"); // 실제 슬라이드 이동 영역
    this.slides = Array.from(container.querySelectorAll(".carousel__slide")); // 모든 슬라이드
    this.total = this.slides.length; // 총 슬라이드 개수
    this.current = 1; // 현재 활성화된 슬라이드 (1부터 시작)
    this.controls = container.querySelector(".carousel__controls"); // 컨트롤 버튼 영역

    this.init();
  }

  /**
   * 초기화
   * - 슬라이드 버튼 생성 및 컨트롤 영역에 삽입
   * - 최초 위치 업데이트
   */
  init() {
    // createSlideButtons: 현재/총 개수 + 좌우 이동 버튼
    const slideButtons = createSlideButtons(this.current, this.total, (page) =>
      this.goTo(page)
    );
    this.controls.appendChild(slideButtons);

    // 첫 상태 업데이트
    this.update();
  }

  /**
   * 특정 슬라이드로 이동
   * @param {number} index - 이동할 슬라이드 번호 (1-based)
   */
  goTo(index) {
    // index를 1~total 범위 안으로 제한
    this.current = Math.max(1, Math.min(this.total, index));
    this.update();
  }

  /**
   * 뷰 업데이트
   * - 현재 페이지에 맞게 track을 translateX로 이동
   * - ex) 2페이지 → -100%, 3페이지 → -200%
   */
  update() {
    const offset = -(this.current - 1) * 100;
    this.track.style.transform = `translateX(${offset}%)`;
  }
}
