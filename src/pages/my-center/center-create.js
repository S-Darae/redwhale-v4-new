import "../../components/button/button.js";
import "../../components/tooltip/tooltip.js";
import "./center-create-field.js";
import "./center-create.scss";

/* ==========================
   뒤로 가기 (나가기 버튼, 취소 버튼)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  // 모든 back-btn에 동일 동작 연결
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.history.back(); // 이전 화면으로 이동
    });
  });
});

/* ==========================
   주소 (임시 토글)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".address-search-btn");
  const addressField = document.querySelector(".center-create__address-field");

  if (searchBtn && addressField) {
    // 처음엔 주소 필드 숨김
    addressField.style.display = "none";

    searchBtn.addEventListener("click", () => {
      searchBtn.style.display = "none";
      addressField.style.display = "block";
    });
  }
});

/* ==========================
   사업자 등록증 (임시 토글)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".biz-license-add-btn");
  const uploadWrap = document.querySelector(
    ".center-create__biz-license-upload"
  );
  const previewWrap = document.querySelector(
    ".center-create__biz-license-preview"
  );

  addBtn?.addEventListener("click", () => {
    uploadWrap.style.display = "none";
    previewWrap.style.display = "block";
  });
});
