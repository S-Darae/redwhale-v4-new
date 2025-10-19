/* ======================================================================
   📦 center-create.js
   ----------------------------------------------------------------------
   ✅ 역할 요약:
   - 센터 생성 페이지의 상호작용 스크립트
   - 뒤로가기, 주소 입력 표시 토글, 사업자등록증 업로드 미리보기 제어
   ----------------------------------------------------------------------
   ✅ Angular 변환 시 참고:
   - 뒤로가기 → Router.navigateBack() 또는 Location.back()으로 대체
   - 주소/사업자등록증 토글 → *ngIf, [hidden]으로 제어 가능
   ====================================================================== */

import "../../components/button/button.js";
import "../../components/speech-bubble/speech-bubble.js";
import "../../components/tooltip/tooltip.js";
import "./center-create-field.js";
import "./center-create.scss";

/* ======================================================================
   🔙 뒤로 가기 (나가기 버튼 / 취소 버튼)
   ----------------------------------------------------------------------
   ✅ 역할:
   - .back-btn 클릭 시 브라우저 이전 페이지로 이동
   - window.history.back() 호출
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - Router.navigateByUrl('/previous') 또는 Location.back() 활용
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 모든 .back-btn 요소에 공통 이벤트 연결
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.history.back(); // 브라우저 이전 화면으로 이동
    });
  });
});

/* ======================================================================
   🏠 주소 입력 필드 (임시 토글)
   ----------------------------------------------------------------------
   ✅ 역할:
   - “주소 검색” 버튼 클릭 시 주소 입력 필드 노출
   - 초기에 주소 입력 영역은 숨김 상태
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - *ngIf로 검색 버튼/주소 필드 전환 가능
   - 예: <button *ngIf="!showAddress" (click)="showAddress = true">
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".address-search-btn");
  const addressField = document.querySelector(".center-create__address-field");

  if (searchBtn && addressField) {
    // 초기 상태: 주소 필드 숨김
    addressField.style.display = "none";

    // 검색 버튼 클릭 시 표시 전환
    searchBtn.addEventListener("click", () => {
      searchBtn.style.display = "none";
      addressField.style.display = "block";
    });
  }
});

/* ======================================================================
   🧾 사업자 등록증 (임시 업로드 토글)
   ----------------------------------------------------------------------
   ✅ 역할:
   - “추가” 버튼 클릭 시 업로드 영역 → 미리보기 영역 전환
   - 실제 업로드 로직은 아직 미구현 상태
   ----------------------------------------------------------------------
   ✅ Angular 참고:
   - *ngIf로 업로드 상태 구분 가능
   - 예: <div *ngIf="!hasFile">업로드 버튼</div>
         <div *ngIf="hasFile">미리보기</div>
   ====================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".biz-license-add-btn");
  const uploadWrap = document.querySelector(
    ".center-create__biz-license-upload"
  );
  const previewWrap = document.querySelector(
    ".center-create__biz-license-preview"
  );

  // 추가 버튼 클릭 시 업로드 → 미리보기 전환
  addBtn?.addEventListener("click", () => {
    uploadWrap.style.display = "none";
    previewWrap.style.display = "block";
  });
});
