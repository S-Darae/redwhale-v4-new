import "../../components/text-field/create-text-field.js";
import "../../components/text-field/text-field.js";
import "../../components/text-field/text-field.scss";

document.querySelector("#user-management-header__search").innerHTML =
  createTextField({
    id: "search-small-header",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  });

document.querySelector("#user-filter__field--user").innerHTML = createTextField(
  {
    id: "search-small-user",
    variant: "search",
    size: "small",
    placeholder: "회원 이름, 전화번호 검색",
  }
);

document.querySelector("#user-filter__field--address").innerHTML =
  createTextField({
    id: "search-small-address",
    variant: "search",
    size: "small",
    placeholder: "주소 검색",
  });

document.querySelector("#user-filter__field--product").innerHTML =
  createTextField({
    id: "search-small--product",
    variant: "search",
    size: "small",
    placeholder: "상품 검색",
  });

document.querySelector("#user-filter__field--memo").innerHTML = createTextField(
  {
    id: "search-small--memo",
    variant: "search",
    size: "small",
    placeholder: "메모 검색",
  }
);

document.querySelector("#user-filter__field--user-id").innerHTML =
  createTextField({
    id: "search-small--user-id",
    variant: "search",
    size: "small",
    placeholder: "회원번호 검색",
  });

document.querySelector("#user-filter__field--app-account").innerHTML =
  createTextField({
    id: "search-small--app-account",
    variant: "search",
    size: "small",
    placeholder: "이메일 주소 검색",
  });
