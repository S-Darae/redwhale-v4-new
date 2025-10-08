import "./table.scss";

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // 테이블 hover 동기화 스크립트
  // ==========================
  // .table 단위로 name 영역과 body 영역을 연결해
  // 같은 인덱스를 가진 name/body 셀에 동시에 hover 효과 적용

  // 모든 테이블 순회
  const tables = document.querySelectorAll(".table");

  tables.forEach((table) => {
    // 현재 테이블 내에서 name / body 셀 모음
    const rows = table.querySelectorAll(".table__name, .table__body");

    rows.forEach((row) => {
      // className에서 인덱스 추출 (예: name-1 → 1, body-1 → 1)
      const match = row.className.match(/(?:name|body)-(\d+)/);
      if (match) {
        const index = match[1]; // 추출된 인덱스 번호
        const nameElement = table.querySelector(`.name-${index}`);
        const bodyElement = table.querySelector(`.body-${index}`);

        if (nameElement && bodyElement) {
          // hover 이벤트 핸들러 정의
          const addHover = () => {
            nameElement.classList.add("hover");
            bodyElement.classList.add("hover");
          };
          const removeHover = () => {
            nameElement.classList.remove("hover");
            bodyElement.classList.remove("hover");
          };

          // name 영역에 hover 이벤트 연결
          nameElement.addEventListener("mouseenter", addHover);
          nameElement.addEventListener("mouseleave", removeHover);

          // body 영역에 hover 이벤트 연결
          bodyElement.addEventListener("mouseenter", addHover);
          bodyElement.addEventListener("mouseleave", removeHover);
        }
      }
    });
  });
});
