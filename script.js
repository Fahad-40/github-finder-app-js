const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

const initialState = document.querySelector(".initial-state");
const emptyState = document.querySelector(".js-empty-state");
const loadingState = document.querySelector(".js-loading-state");
const errorState = document.querySelector(".js-error-state");
const errorMessage = document.querySelector(".js-error-message");
const resultSection = document.querySelector(".js-result");


searchForm.addEventListener("submit" , (e) => {
e.preventDefault();
const userName = searchInput.value.trim();

if (userName === " ") {
    return;
}
console.log(userName)
searchForm.reset();
})