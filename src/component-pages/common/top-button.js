document.addEventListener("DOMContentLoaded", () => {
  const topButton = document.getElementById("top-button");

  // 스크롤 시 탑 버튼 보이기/숨기기
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      // 스크롤 위치가 100px 이상이면 버튼 보이기
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  });

  // 탑 버튼 클릭 시 부드러운 스크롤
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // 클릭 시 맨 위로
  });
});
