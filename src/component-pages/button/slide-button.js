import { createSlideButtons } from "../../components/button/create-slide-button.js";
import "./slide-button.scss";

document
  .getElementById("slide-1")
  .appendChild(
    createSlideButtons(1, 1, (p) => console.log("현재 슬라이드:", p))
  );

document
  .getElementById("slide-10")
  .appendChild(
    createSlideButtons(1, 10, (p) => console.log("현재 슬라이드:", p))
  );
