import { createClassDetailPopover } from "./create-class-popover.js";
import { createMembershipDetailPopover } from "./create-membership-popover.js";
import { createProductPopover } from "./create-product-popover.js";

/* =====================================================================
📦 Module: Popover Manager (initPopover)
-----------------------------------------------------------------------
- 역할: 수업 / 회원권 / 상품 카드 클릭 시 상세 팝오버를 생성·표시·닫기 관리
- 구조: 이벤트 위임(document click) 기반으로 동작 → 동적 요소 자동 대응
- 외부 클릭 / 스크롤 / 리사이즈 시 팝오버 자동 닫힘
- 옵션 카드 / 체크박스 카드와의 이벤트 충돌 완전 분리

🧩 Angular 변환 시 가이드
-----------------------------------------------------------------------
1️⃣ Service 형태로 전환 권장
   ▶ PopoverService (Singleton)
   - openPopover(card, type)
   - closePopover()
   - registerData({ classes, memberships, products })

2️⃣ Angular @Injectable Service 예시
    @Injectable({ providedIn: 'root' })
    export class PopoverService {
      private activePopover: HTMLElement | null = null;
      private activeCard: HTMLElement | null = null;
      private data = { classes: [], memberships: [], products: [] };

      registerData(data: any) { this.data = data; }
      open(card: HTMLElement, type: string) { ... }
      close() { ... }
    }

3️⃣ Angular Component 상호작용
    - <app-product-card (openPopover)="popoverService.open($event.card, 'product')">
    - window resize / scroll → HostListener로 close()
===================================================================== */

/* =====================================================
   🔧 상태 변수 (전역 관리)
   -----------------------------------------------------
   - 현재 활성 팝오버 및 카드 추적
   - 데이터는 initPopover() 호출 시 갱신됨
===================================================== */
let activeCard = null;
let activePopover = null;
let classData = [];
let membershipData = [];
let productData = [];
let isInitialized = false;

/* =====================================================
   🧩 initPopover({ classes, memberships, products })
   -----------------------------------------------------
   - 최초 1회만 호출되어 전역 이벤트 등록
   - 페이지별 데이터(class/membership/product)를 등록
===================================================== */
export function initPopover({
  classes = [],
  memberships = [],
  products = [],
} = {}) {
  classData = classes;
  membershipData = memberships;
  productData = products;

  /* =====================================================
     🎯 openPopover(card, type)
     -----------------------------------------------------
     - 클릭된 카드 기준으로 팝오버 생성 및 body에 추가
     - 위치 계산 후 표시
     - 동일 카드 재클릭 시 closePopover()로 닫힘
     - Angular: PopoverService.open(card, type)
  ===================================================== */
  function openPopover(card, type) {
    closePopover(); // 기존 팝오버 닫기

    let popoverEl = null;

    // 타입별 팝오버 생성
    if (type === "membership") {
      const data = membershipData.find((m) => m.id === card.dataset.id);
      if (data) popoverEl = createMembershipDetailPopover(data);
    } else if (type === "class") {
      const data = classData.find((c) => c.id === card.dataset.id);
      if (data) popoverEl = createClassDetailPopover(data);
    } else if (type === "product") {
      const data = productData.find((p) => p.id === card.dataset.id);
      if (data) popoverEl = createProductPopover(data);
    }

    // 데이터 없음 → 종료
    if (!popoverEl) return;

    // 문자열일 경우 DOM 변환
    if (typeof popoverEl === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = popoverEl.trim();
      popoverEl = wrapper.firstElementChild;
    }

    // 팝오버 body에 추가
    document.body.appendChild(popoverEl);

    /* -----------------------------------------------------
       위치 계산 및 렌더링
       - 카드 위치 기준 좌/우 자동 배치
       - 화면 하단 넘침 방지
       - Angular: PopoverComponent 내부에서 CDK Overlay로 대체 가능
    ----------------------------------------------------- */
    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;
      const popoverWidth = 390;
      const popoverHeight = popoverEl.offsetHeight;

      const isRight = rect.left + rect.width / 2 > window.innerWidth / 2;
      const left = isRight
        ? rect.left + scrollLeft - popoverWidth - 8
        : rect.right + scrollLeft + 8;

      const rawTop = rect.top + scrollTop;
      const maxTop = scrollTop + window.innerHeight - popoverHeight - 8;
      const top = Math.min(rawTop, maxTop);

      popoverEl.style.position = "absolute";
      popoverEl.style.left = `${Math.max(
        8,
        Math.min(left, window.innerWidth - popoverWidth - 8)
      )}px`;
      popoverEl.style.top = `${Math.max(8, top)}px`;
      popoverEl.style.zIndex = "1000";
      popoverEl.classList.add(isRight ? "left" : "right");
    });

    // 상태 업데이트
    activeCard = card;
    activePopover = popoverEl;
    card.classList.add("popover-is-active");

    // 닫기 버튼 바인딩
    popoverEl.querySelector(".x-btn")?.addEventListener("click", closePopover);
  }

  /* =====================================================
     ❌ closePopover()
     -----------------------------------------------------
     - 현재 활성 팝오버 제거 및 상태 초기화
     - Angular: PopoverService.close()
  ===================================================== */
  function closePopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }

    document
      .querySelectorAll(
        ".membership-card.popover-is-active, .class-card.popover-is-active, .product-card.popover-is-active"
      )
      .forEach((c) => c.classList.remove("popover-is-active"));

    activeCard = null;
  }

  /* =====================================================
     🧭 이벤트 위임 (document level)
     -----------------------------------------------------
     - 카드 클릭, 외부 클릭, 옵션 행 클릭 등 처리
     - 최초 1회만 등록됨
     - Angular: HostListener('document:click') 형태로 전환 가능
  ===================================================== */
  if (!isInitialized) {
    document.addEventListener("click", (e) => {
      const membershipCard = e.target.closest(".membership-card");
      const classCard = e.target.closest(".class-card");
      const productCard = e.target.closest(".product-card");

      /* ----------------------------------------------
         1️⃣ 카드 외부 클릭 → 팝오버 닫기
      ---------------------------------------------- */
      if (!membershipCard && !classCard && !productCard) {
        if (!activePopover?.contains(e.target)) closePopover();
        return;
      }

      /* ----------------------------------------------
         2️⃣ 옵션 행 클릭 → 팝오버 무시
         - `.membership-card-detail-row` 클릭 시
           옵션 체크만 수행 (팝오버 열지 않음)
      ---------------------------------------------- */
      if (membershipCard && e.target.closest(".membership-card-detail-row")) {
        return;
      }

      /* ----------------------------------------------
         3️⃣ 카드 타입 식별
      ---------------------------------------------- */
      const card = membershipCard || classCard || productCard;
      if (!card) return;
      const type = membershipCard
        ? "membership"
        : classCard
        ? "class"
        : "product";

      /* ----------------------------------------------
         4️⃣ 체크박스 모드 → 팝오버 비활성
         - `.checkbox-mode`는 선택용 UI로 팝오버 무시
         - Angular: `[popoverEnabled]="!isCheckboxMode"`
      ---------------------------------------------- */
      if (card.classList.contains("checkbox-mode")) return;

      /* ----------------------------------------------
         5️⃣ data-popover="false" → 팝오버 차단
      ---------------------------------------------- */
      if (card.dataset.popover === "false") return;

      /* ----------------------------------------------
         6️⃣ 동일 카드 클릭 → 팝오버 닫기
      ---------------------------------------------- */
      if (activeCard === card) {
        closePopover();
        return;
      }

      /* ----------------------------------------------
         7️⃣ 새로운 카드 클릭 → 팝오버 열기
      ---------------------------------------------- */
      openPopover(card, type);
    });

    /* ----------------------------------------------
       8️⃣ 화면 리사이즈 / 스크롤 시 자동 닫기
       - Angular: @HostListener('window:resize') close()
    ---------------------------------------------- */
    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopover, { passive: true });

    isInitialized = true;
  }
}
