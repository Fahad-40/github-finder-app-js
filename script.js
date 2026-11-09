const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

const initialState = document.querySelector(".initial-state");
const loadingState = document.querySelector(".loading-state");
const errorState = document.querySelector(".error-state");
const profileDataContainer = document.querySelector(".profile-data-container");

const avatarEl = document.querySelector(".js-avatar");
const nameEl = document.querySelector(".js-name");
const loginEl = document.querySelector(".js-login");
const bioEl = document.querySelector(".js-bio");
const reposCountEl = document.querySelector(".js-repos-count");
const followersCountEl = document.querySelector(".js-followers-count");
const followingCountEl = document.querySelector(".js-following-count");
const profileLinkEl = document.querySelector(".js-profile-link");

// const emptyState = document.querySelector(".empty-state");
// const errorState = document.querySelector(".error-state");

searchForm.addEventListener("submit" , (e) => {
e.preventDefault();
const userName = searchInput.value.trim();

if (userName === " ") {
    return;
}
getUser(userName);
searchForm.reset();
})
showState(initialState)
function showState(stateToShow) {
  initialState.classList.add("hidden");
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  profileDataContainer.classList.add("hidden");

  stateToShow.classList.remove("hidden");
}

async function getUser(userName) {
showState(loadingState)

    try {
        const response = await fetch("https://api.github.com/users/" + userName);
        
        if (!response.ok) {
             showState(errorState);
        throw new Error(response.status === 404? "User Not Found!" : "Something went wrong!")
        
        }
        const data = await response.json();
         showState(profileDataContainer);
        console.log(data)
        
    } catch (error) {
        errorState.textContent = error.message;
   showState(errorState);
    }
}

// console.log("initialState:", initialState);
// console.log("loadingState:", loadingState);
// console.log("errorMessage:", errorMessage);
// console.log("resultSection:", resultSection);

// console.log("avatarEl:", avatarEl);
// console.log("nameEl:", nameEl);
// console.log("loginEl:", loginEl);
// console.log("bioEl:", bioEl);
// console.log("reposCountEl:", reposCountEl);
// console.log("followersCountEl:", followersCountEl);
// console.log("followingCountEl:", followingCountEl);
// console.log("profileLinkEl:", profileLinkEl);
