/* ======================================================================
   📦 user-management-search.js — 회원 검색 필드 생성
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 회원관리 상단 및 필터 사이드바 내 검색 필드 자동 생성
   - createTextField() 공통 함수 활용 (variant: "search")
   - 필드별 placeholder 문구 및 ID 자동 지정
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - Reactive Form 기반 FormControl로 구성 가능
   - <app-search-field> 컴포넌트로 분리 시 템플릿 단순화
   - placeholder, label, icon 등 @Input()으로 전달 가능
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - text-field.scss / user-management.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 텍스트 필드 컴포넌트 및 스타일
   ====================================================================== */
import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

/* ======================================================================
   🚀 검색 필드 생성
   ----------------------------------------------------------------------
   ✅ 역할:
   - 각 위치별 컨테이너(#id)에 createTextField()로 HTML 삽입
   - 모든 필드는 variant: "search" / size: "small" 공통 적용
   - placeholder는 위치별로 다르게 지정
   ----------------------------------------------------------------------
   ✅ Angular 변환:
   - *ngIf 또는 @ViewChild로 엘리먼트 주입 후 <app-text-field> 사용
   - (input)="onSearch($event)" 바인딩으로 이벤트 처리 가능
   ====================================================================== */

/* --------------------------------------------------
   1️⃣ 상단 헤더 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-management-header__search
   ✅ 기능:
   - 회원 이름, 전화번호 검색 전용
   -------------------------------------------------- */
document.querySelector("#user-management-header__search").innerHTML =
  createTextField({
    id: "search-small-header",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  });

/* --------------------------------------------------
   2️⃣ 사이드바 - 회원명/전화번호 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--user
   ✅ 기능:
   - 이름 또는 연락처 기반 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--user").innerHTML = createTextField(
  {
    id: "search-small-user",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  }
);

/* --------------------------------------------------
   3️⃣ 사이드바 - 주소 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--address
   ✅ 기능:
   - 주소 텍스트 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--address").innerHTML =
  createTextField({
    id: "search-small-address",
    variant: "search",
    size: "small",
    placeholder: "주소 검색",
  });

/* --------------------------------------------------
   4️⃣ 사이드바 - 상품명 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--product
   ✅ 기능:
   - 회원권 / 락커 / 운동복 등 상품명 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--product").innerHTML =
  createTextField({
    id: "search-small--product",
    variant: "search",
    size: "small",
    placeholder: "상품 검색",
  });

/* --------------------------------------------------
   5️⃣ 사이드바 - 메모 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--memo
   ✅ 기능:
   - 회원 메모 내용 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--memo").innerHTML = createTextField(
  {
    id: "search-small--memo",
    variant: "search",
    size: "small",
    placeholder: "메모 검색",
  }
);

/* --------------------------------------------------
   6️⃣ 사이드바 - 회원번호 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--user-id
   ✅ 기능:
   - 고유 회원번호(ID)로 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--user-id").innerHTML =
  createTextField({
    id: "search-small--user-id",
    variant: "search",
    size: "small",
    placeholder: "회원번호 검색",
  });

/* --------------------------------------------------
   7️⃣ 사이드바 - 앱 계정(이메일) 검색 필드
   --------------------------------------------------
   ✅ 위치:
   - #user-filter__field--app-account
   ✅ 기능:
   - 이메일 주소(앱 계정)로 검색
   -------------------------------------------------- */
document.querySelector("#user-filter__field--app-account").innerHTML =
  createTextField({
    id: "search-small--app-account",
    variant: "search",
    size: "small",
    placeholder: "이메일 주소 검색",
  });
