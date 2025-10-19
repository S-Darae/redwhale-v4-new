import { createSlideButtons } from "../button/create-slide-button.js";
import "./carousel.scss";

/* =====================================================================
📦 Component: Carousel (수평 슬라이드 컴포넌트)
-----------------------------------------------------------------------
- 역할: 좌우 슬라이드 이동 및 현재 슬라이드 위치를 제어하는 UI 컴포넌트
- 구성:
  <div class="carousel">
    <div class="carousel__track">
      <div class="carousel__slide">슬라이드1</div>
      <div class="carousel__slide">슬라이드2</div>
      ...
    </div>
    <div class="carousel__controls"></div> <!-- createSlideButtons() 삽입 -->
  </div>

🧩 Angular 변환 시 가이드
-----------------------------------------------------------------------
1️⃣ Angular 컴포넌트 예시
    <app-carousel
      [slides]="bannerList"
      [startIndex]="1"
      (slideChange)="onSlideChange($event)">
    </app-carousel>

2️⃣ Angular @Input() 속성
    @Input() slides: any[] = [];
    @Input() startIndex: number = 1;

3️⃣ Angular @Output() 이벤트
    @Output() slideChange = new EventEmitter<number>();

4️⃣ 내부 구조
    <div class="carousel__track" [style.transform]="translateX">
      <ng-content></ng-content> <!-- or *ngFor="let slide of slides" -->
    </div>
    <div class="carousel__controls">
      <app-slide-buttons
        [current]="current"
        [total]="total"
        (navigate)="goTo($event)">
      </app-slide-buttons>
    </div>

5️⃣ 주요 전환 포인트
    - createSlideButtons → <app-slide-buttons> 컴포넌트로 교체
    - translateX() 이동 → style binding으로 전환
    - goTo() → (navigate) 이벤트 바인딩으로 제어
===================================================================== */

export class Carousel {
  /**
   * @param {HTMLElement} container - 캐러셀 루트 엘리먼트
   *
   * 필수 내부 구조:
   * - .carousel__track : 슬라이드 래퍼 (translateX 이동 대상)
   * - .carousel__slide : 개별 슬라이드 요소
   * - .carousel__controls : 페이지 표시 및 이동 버튼 컨테이너
   */
  constructor(container) {
    this.container = container;
    this.track = container.querySelector(".carousel__track");
    this.slides = Array.from(container.querySelectorAll(".carousel__slide"));
    this.total = this.slides.length; // 전체 슬라이드 개수
    this.current = 1; // 현재 활성 슬라이드 (1-based index)
    this.controls = container.querySelector(".carousel__controls");

    this.init();
  }

  /* ============================================================
     🧭 init()
     ------------------------------------------------------------
     - 캐러셀 초기화
     - createSlideButtons() 호출하여 컨트롤 버튼 추가
     - 초기 슬라이드 위치 업데이트
     ------------------------------------------------------------
     Angular 변환 시:
       - ngOnInit()에서 slide 버튼 렌더링 대신
         <app-slide-buttons> 컴포넌트로 대체 가능
  ============================================================ */
  init() {
    // 슬라이드 버튼 생성 (현재/전체 페이지 표시 + 좌우 이동 콜백)
    const slideButtons = createSlideButtons(this.current, this.total, (page) =>
      this.goTo(page)
    );
    this.controls.appendChild(slideButtons);

    // 초기 상태 반영
    this.update();
  }

  /* ============================================================
     🎯 goTo(index)
     ------------------------------------------------------------
     - 특정 슬라이드로 이동
     - 인덱스를 1~total 범위로 제한 후 update() 호출
     ------------------------------------------------------------
     Angular 변환 시:
       - navigate(page: number) 메서드로 동일 로직 처리
       - EventEmitter<number>로 slideChange 이벤트 발생
  ============================================================ */
  goTo(index) {
    this.current = Math.max(1, Math.min(this.total, index));
    this.update();
  }

  /* ============================================================
     🔄 update()
     ------------------------------------------------------------
     - 현재 슬라이드 번호에 따라 트랙을 translateX로 이동
     - ex) 1페이지 → 0%, 2페이지 → -100%, 3페이지 → -200%
     ------------------------------------------------------------
     Angular 변환 시:
       - `[style.transform]="'translateX(-' + (current - 1) * 100 + '%)'"` 로 바인딩
       - changeDetection 시 자동 반영
  ============================================================ */
  update() {
    const offset = -(this.current - 1) * 100;
    this.track.style.transform = `translateX(${offset}%)`;
  }
}
