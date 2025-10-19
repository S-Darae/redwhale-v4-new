import "./table.scss";

/**
 * ======================================================================
 * 🧭 Table Hover Sync Script (테이블 hover 동기화 스크립트)
 * ----------------------------------------------------------------------
 * ✅ 역할:
 * - `.table` 컴포넌트 내의 이름 영역(name)과 본문 영역(body)을 연결하여
 *   동일 인덱스(index)를 가진 행에 동시에 hover 효과를 부여함.
 * - 예: `.name-1` hover 시 `.body-1`도 함께 hover 적용
 * ----------------------------------------------------------------------
 * ⚙️ 작동 방식:
 * 1️⃣ `.table` 단위로 반복 순회
 * 2️⃣ `.table__name` / `.table__body` 행에서 인덱스 번호 추출
 * 3️⃣ 동일 인덱스(`name-${i}`, `body-${i}`)를 가진 요소 쌍을 찾아 hover 이벤트 동기화
 * ----------------------------------------------------------------------
 * 🧩 Angular 변환 가이드:
 * - 현재 구조는 DOM className 기반 hover 동기화 → Angular에서는 상태 바인딩으로 대체 가능
 * - 각 행 컴포넌트를 `<tr app-hover-sync [index]="i">` 형태로 감싸고
 *   Hover 상태를 `@Input()` 또는 shared service로 전달 가능
 * ----------------------------------------------------------------------
 * 📘 예시 구조 (Vanilla JS)
 * <div class="table">
 *   <div class="table__name name-1">홍길동</div>
 *   <div class="table__body body-1">회원권 A</div>
 *   <div class="table__name name-2">김철수</div>
 *   <div class="table__body body-2">회원권 B</div>
 * </div>
 * ----------------------------------------------------------------------
 * 📘 Angular 전환 예시
 * <app-table-row
 *   *ngFor="let row of rows; index as i"
 *   [index]="i"
 *   [hovered]="hoveredIndex === i"
 *   (mouseenter)="hoveredIndex = i"
 *   (mouseleave)="hoveredIndex = null">
 * </app-table-row>
 * ======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     🔍 모든 .table 요소 순회
     ---------------------------------------------------------
     - 각 테이블 단위로 name/body 행을 연결
     ========================================================= */
  const tables = document.querySelectorAll(".table");

  tables.forEach((table) => {
    /* =========================================================
       🎯 name/body 셀 그룹 추출
       ---------------------------------------------------------
       - 각 행은 .table__name 또는 .table__body 클래스를 가짐
       - 클래스명 끝의 숫자(index)를 이용해 서로 매칭
       ========================================================= */
    const rows = table.querySelectorAll(".table__name, .table__body");

    rows.forEach((row) => {
      // className에서 인덱스 추출 (예: name-1 → 1, body-1 → 1)
      const match = row.className.match(/(?:name|body)-(\d+)/);
      if (match) {
        const index = match[1]; // 추출된 인덱스 번호
        const nameElement = table.querySelector(`.name-${index}`);
        const bodyElement = table.querySelector(`.body-${index}`);

        /* =========================================================
           ✅ name / body 쌍 존재 시 hover 이벤트 동기화
           ---------------------------------------------------------
           - 마우스가 name에 들어오면 → body에도 hover 클래스 추가
           - 반대도 동일하게 동작
           ========================================================= */
        if (nameElement && bodyElement) {
          // hover 추가 함수
          const addHover = () => {
            nameElement.classList.add("hover");
            bodyElement.classList.add("hover");
          };

          // hover 해제 함수
          const removeHover = () => {
            nameElement.classList.remove("hover");
            bodyElement.classList.remove("hover");
          };

          // name 영역 hover 동기화
          nameElement.addEventListener("mouseenter", addHover);
          nameElement.addEventListener("mouseleave", removeHover);

          // body 영역 hover 동기화
          bodyElement.addEventListener("mouseenter", addHover);
          bodyElement.addEventListener("mouseleave", removeHover);
        }
      }
    });
  });
});
