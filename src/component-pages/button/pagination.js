import { createPagination } from "../../components/button/create-pagination.js";
import "./pagination.scss";

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("pagination-1")
    ?.appendChild(
      createPagination(1, 1, "small", (p) => console.log("페이지:", p))
    );

  document
    .getElementById("pagination-3")
    ?.appendChild(
      createPagination(2, 3, "small", (p) => console.log("페이지:", p))
    );

  document
    .getElementById("pagination-7")
    ?.appendChild(
      createPagination(4, 7, "small", (p) => console.log("페이지:", p))
    );

  document
    .getElementById("pagination-999")
    ?.appendChild(
      createPagination(500, 999, "small", (p) => console.log("페이지:", p))
    );
});
