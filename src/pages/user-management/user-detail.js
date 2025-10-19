/* ======================================================================
   📦 user-detail.js — 회원 상세 페이지
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원 상세 페이지 초기화 (메인 메뉴, 탭, 툴팁, 버튼 등 포함)
   - 회원 메모 필드(textarea) 생성
   - 회원 주요 정보 영역 토글 기능 제어
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-user-detail> 페이지 컴포넌트로 전체 구성
   - 메모 필드는 <app-textarea-field>로 분리 가능
   - 주요 정보 토글은 *ngIf + (click) 이벤트 기반으로 구현
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - user-detail.scss / tab.scss / tooltip.scss / button.scss / text-field.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 및 페이지별 컴포넌트
   ====================================================================== */
import "../../pages/common/main-menu.js"; // 공통 메인 메뉴
import "./tabs/tabs.js"; // 탭 UI 초기화
import "./user-detail-tab.js"; // 상세 탭별 기능 (예: 결제, 방문, 메모 등)
import "./user-detail.scss"; // 회원 상세 페이지 스타일

// 공통 UI 컴포넌트
import "../../components/button/button.js";
import "../../components/tab/tab.js";
import "../../components/tooltip/tooltip.js";

// 텍스트 필드 (createTextField 포함)
import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ======================================================================
   📝 회원 메모 필드 생성
   ----------------------------------------------------------------------
   ✅ 역할:
   - 회원 상세 정보 섹션 내 메모 입력 필드를 생성
   - variant: "textarea" / size: "small"
   - 기본 value 지정 (예시 문구)
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - <app-textarea-field [(ngModel)]="member.memo"> 형태로 바인딩 가능
   - placeholder, value 등 @Input() 속성으로 전달 가능
   ====================================================================== */
document.querySelector("#member-info__field--memo").innerHTML = createTextField(
  {
    id: "textarea-small-memo",
    variant: "textarea",
    size: "small",
    placeholder: "회원 메모",
    value: "홈에서 표는 최대 7줄까지",
  }
);

/* ======================================================================
   📂 회원 주요 정보 토글 (Summary Section)
   ----------------------------------------------------------------------
   ✅ 역할:
   - `.member-info__summary-header` 클릭 시
     상세 정보(body) 영역 show/hide 제어
   - 아이콘 회전(rotate)으로 시각적 상태 표시
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - (click)="isCollapsed = !isCollapsed"
   - [class.collapsed]="isCollapsed"
   - [style.transform]="isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'"
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".member-info__summary-header");
  const body = document.querySelector(".member-info__summary-body");
  const icon = header.querySelector(".icon");

  if (!header || !body || !icon) return;

  header.addEventListener("click", () => {
    // collapsed 클래스 토글 → show/hide
    const isCollapsed = body.classList.toggle("collapsed");

    // 아이콘 회전 처리
    icon.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
  });
});
