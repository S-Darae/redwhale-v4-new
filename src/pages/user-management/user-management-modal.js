/* ======================================================================
   📦 user-management-table-settings.js — 회원 테이블 컬럼 설정 모달
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - “표시 컬럼 선택” 모달 내 체크박스 항목 동적 생성
   - 초기화(Reset) 및 저장(Save) 버튼 동작 제어
   - 선택된 컬럼 ID 콘솔 출력 (실제 적용은 테이블 렌더링 측과 연동 예정)
   ----------------------------------------------------------------------
   ✅ Angular 변환 가이드:
   - <app-user-table-settings-modal> 컴포넌트로 분리 가능
   - 컬럼 목록은 *ngFor로 렌더링
   - 선택 상태는 FormArray 기반 Reactive Form으로 관리 가능
   - Reset/Save는 서비스 주입으로 상태 공유 가능
   ----------------------------------------------------------------------
   🪄 관련 SCSS:
   - user-management.scss / modal.scss / checkbox.scss
   ====================================================================== */

/* ======================================================================
   📘 Import — 공통 컴포넌트 및 유틸 모듈 로드
   ====================================================================== */
import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import modal from "../../components/modal/modal.js";

/* ======================================================================
   🚀 초기 실행
   ----------------------------------------------------------------------
   ✅ 역할:
   - DOMContentLoaded 시 컬럼 목록 체크박스 자동 생성
   - Reset / Save 버튼 이벤트 바인딩
   - createCheckbox 공통 함수 활용
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("user-table-setting-modal__checkbox-wrap");
  if (!wrap) return;

  /* --------------------------------------------------
     1️⃣ 컬럼 목록 정의
     --------------------------------------------------
     - 회원 테이블에 표시할 컬럼 텍스트 배열
     - 실제 키(key) 대신 단순 라벨 텍스트로 구성
     - 추후 데이터 구조 변경 시 키 매핑 가능
     -------------------------------------------------- */
  const columns = [
    "성별",
    "나이",
    "주소",
    "상품",
    "시작일",
    "만료일",
    "락커 만료일",
    "남은 기간",
    "남은 횟수",
    "메모",
    "담당자",
    "미수금",
    "누적 결제금액",
    "누적 환불금액",
    "누적 방문수",
    "회원번호",
    "앱 연동",
    "앱 계정",
    "최근 결제일",
    "최근 방문일",
  ];

  /* --------------------------------------------------
     2️⃣ 체크박스 항목 동적 생성
     --------------------------------------------------
     ✅ 기능 요약:
     - createCheckbox() 공통 컴포넌트로 체크박스 렌더링
     - id 규칙: user-table-col-[index]
     - 기본 상태: 모두 체크 (checked: true)
     --------------------------------------------------
     ✅ Angular 변환:
     - *ngFor + [formControlName] 기반 렌더링 가능
     - (change) 이벤트로 상태 실시간 업데이트 가능
     -------------------------------------------------- */
  wrap.innerHTML = columns
    .map((label, i) =>
      createCheckbox({
        id: `user-table-col-${i + 1}`,
        size: "small",
        variant: "standard",
        label,
        checked: true,
      })
    )
    .join("");

  /* --------------------------------------------------
     3️⃣ 초기화 버튼 (Reset)
     --------------------------------------------------
     ✅ 기능 요약:
     - 모든 항목을 다시 체크 상태로 복원
     - 실제 저장 상태는 고려하지 않음 (UI 한정 리셋)
     --------------------------------------------------
     ✅ Angular 변환:
     - form.reset() 또는 FormArray.controls.forEach → setValue(true)
     -------------------------------------------------- */
  wrap
    .closest(".user-table-setting-modal")
    .querySelector(".reset-btn")
    ?.addEventListener("click", () => {
      wrap
        .querySelectorAll("input[type='checkbox']")
        .forEach((cb) => (cb.checked = true));
    });

  /* --------------------------------------------------
     4️⃣ 저장 버튼 (Save)
     --------------------------------------------------
     ✅ 기능 요약:
     - 체크된 항목 ID 배열 생성 후 콘솔 출력
     - modal.close(true): dirty 상태 무시하고 즉시 닫기
     - 실제 적용 로직은 추후 테이블 렌더링 쪽에서 연동 예정
     --------------------------------------------------
     ✅ Angular 변환:
     - FormArray.value 활용 (checked 항목만 필터링)
     - 저장 시 Service로 상태 전달 가능
     -------------------------------------------------- */
  wrap
    .closest(".user-table-setting-modal")
    .querySelector(".save-btn")
    ?.addEventListener("click", () => {
      const checked = Array.from(
        wrap.querySelectorAll("input[type='checkbox']:checked")
      ).map((cb) => cb.id);

      console.log("✅ 선택된 컬럼:", checked);
      modal.close(true); // dirty 여부 무시하고 강제 닫기
    });
});
