import { createCheckbox } from "../../components/checkbox/create-checkbox.js";
import modal from "../../components/modal/modal.js";


document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById(
    "user-table-setting-modal__checkbox-wrap"
  );
  if (!wrap) return;

  /* ==========================
     컬럼 목록
     ========================== */
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

  /* ==========================
     체크박스 생성
     ==========================
     - createCheckbox() 공통 컴포넌트 활용
     - id 규칙: user-table-col-[index]
     - 기본값: 모두 checked
     ========================== */
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

  /* ==========================
     초기화 버튼 (Reset)
     ==========================
     - 모든 항목을 다시 체크 상태로 복원
     - 상태값은 따로 저장되지 않음 (프론트 한정 리셋)
     ========================== */
  wrap
    .closest(".user-table-setting-modal")
    .querySelector(".reset-btn")
    ?.addEventListener("click", () => {
      wrap
        .querySelectorAll("input[type='checkbox']")
        .forEach((cb) => (cb.checked = true));
    });

  /* ==========================
     저장 버튼 (Save)
     ==========================
     - 현재 체크된 컬럼 ID 배열 생성
     - 실제 적용 로직은 추후 테이블 렌더링 쪽에서 연동 가능
     - modal.close(true): dirty 상태와 무관하게 즉시 닫기
     ========================== */
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
