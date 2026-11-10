const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const initialState = document.querySelector(".initial-state");
const loadingState = document.querySelector(".loading-state");
const errorState = document.querySelector(".error-state");
const profileDataContainer = document.querySelector(".profile-data-container");
const recentSearchesContainer = document.querySelector(".recent-searches-container");
const rateLimitText = document.querySelector("#rate-limit-text");
const reposListContainer = document.querySelector(".repos-list-container") || null;

let recentSearches = [];

function saveRecentToLS() {
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function addRecentSearch(login) {
  recentSearches = recentSearches.filter(function (name) {
    return name.toLowerCase() !== login.toLowerCase();
  });
  recentSearches.unshift(login);
  recentSearches = recentSearches.slice(0, 5);
  saveRecentToLS();
  renderRecentSearches();
}

recentSearchesContainer.addEventListener("click" , (e) => {
const chip = e.target.closest("[data-userName]");
if (!chip) return;
getUser(chip.dataset.userName);
})

function renderRecentSearches() {
  recentSearchesContainer.innerHTML = recentSearches.map(function (name) {
      return `<button data-userName=${name} class="recent-search-tag whitespace-nowrap px-3 py-1.5 rounded-full bg-gh-card border border-gh-border text-sm text-gh-text hover:border-gh-muted transition-colors">${name}</button>`;
      
  }).join(" ");
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = searchInput.value.trim();

    if (userName === "") {
        return;
    }
    getUser(userName);
    searchForm.reset();
})

showState(initialState)
getSearchLimit()
renderRecentSearches()

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
            throw new Error("User not found");
        }
        const data = await response.json();
        addRecentSearch(data.login)
        renderUser(data)
        getRepos(userName);
        getSearchLimit()
        showState(profileDataContainer);
        console.log(data)

    } catch (error) {
        showState(errorState);
    }
}

async function getRepos(userName) {
    const response = await fetch("https://api.github.com/users/" + userName + "/repos?sort=updated&per_page=3");
    const repos = await response.json();
    renderRepos(repos);
    console.log(repos)
}

function createRepoCard(repo) {
    return `
    <a href="${repo.html_url}" target="_blank" class="repo-card group bg-gh-card border border-gh-border hover:border-gh-muted rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm block">
      <div class="flex items-start justify-between gap-4">
        <h4 class="text-gh-focus font-semibold text-lg group-hover:underline truncate">${repo.name}</h4>
        <span class="px-2.5 py-0.5 rounded-full border border-gh-border text-xs text-gh-muted font-medium bg-gh-bg whitespace-nowrap">Public</span>
      </div>
      <p class="text-sm text-gh-muted mt-2 line-clamp-2 leading-relaxed">${repo.description || "No description"}</p>
      <div class="flex items-center gap-4 mt-4 text-xs text-gh-muted font-medium">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-yellow-300 shadow-sm border border-black/10"></span> ${repo.language || "Not specified"}
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z"></path></svg>
          ${repo.stargazers_count}
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.739 12.033a3 3 0 10-3-5.196L4.502 9.278a3 3 0 101.498 2.6l4.237-2.441a2.983 2.983 0 001.502.596v4.468a3 3 0 101.5 0V10.033a3 3 0 10-1.5-5.196L7.502 2.396a3 3 0 10-1.498 2.6l4.237 2.441a2.983 2.983 0 001.502-.596v4.468a3 3 0 10-.004 2.724z"></path></svg>
          ${repo.forks_count}
        </div>
      </div>
    </a>
  `;
}

function renderUser(userData) {
    profileDataContainer.innerHTML = "";

    profileDataContainer.innerHTML = `
    
   <aside class="profile-card-container w-full md:w-1/3 lg:w-[320px] bg-gh-card border border-gh-border rounded-2xl p-6 shadow-sm">
    
    <div class="flex md:flex-col items-center md:items-start gap-5">
        <img src="${userData.avatar_url}" alt="${userData.name || userData.login}'s Avatar" class="js-avatar w-24 h-24 md:w-full md:h-auto md:aspect-square rounded-full border border-gh-border shadow-md object-cover">
        <div>
            <h2 class="js-name text-2xl font-bold text-gh-text leading-tight">${userData.name || 'GitHub User'}</h2>
            <p class="js-login text-xl text-gh-muted font-light">@${userData.login}</p>
        </div>
    </div>

    <!-- Bio -->
    <p class="js-bio text-gh-text mt-5 leading-relaxed text-sm">${userData.bio || 'No bio available'}</p>

    <!-- Followers/Following -->
    <div class="flex items-center gap-4 mt-5 text-sm text-gh-muted">
        <a href="https://github.com{userData.login}?tab=followers" target="_blank" class="hover:text-gh-focus transition-colors flex items-center gap-1.5">
            <svg class="w-4 h-4 text-gh-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
            <span class="js-followers-count font-semibold text-gh-text">${userData.followers}</span> followers
        </a>
        <span>·</span>
        <a href="https://github.com{userData.login}?tab=following" target="_blank" class="hover:text-gh-focus transition-colors">
            <span class="js-following-count font-semibold text-gh-text">${userData.following}</span> following
        </a>
    </div>

    <!-- Meta Links (Location, Website) -->
    <ul class="mt-5 space-y-3 text-sm text-gh-text">
                    <li class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-gh-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>${userData.location}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-gh-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        <a href="https://github.com/about" target="_blank" class="hover:underline hover:text-gh-focus truncate">${userData.blog.startsWith('http') ? userData.blog : 'https://' + userData.blog}</a>
                    </li>
                </ul>

    <!-- Action Button -->
    <a href="${userData.html_url}" target="_blank" class="js-profile-link mt-6 w-full flex items-center justify-center bg-gh-accent hover:bg-gh-accentHover text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm">
        View on GitHub
    </a>
</aside>

<!-- RIGHT COLUMN: Stats & Repositories -->
<div class="flex-1 w-full flex flex-col gap-6">
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="bg-gh-card border border-gh-border rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
            <span class="text-gh-muted text-xs font-semibold uppercase tracking-wider mb-1">Public Repos</span>
            <span class="js-repos-count text-3xl font-bold text-gh-text">${userData.public_repos}</span>
        </div>
        <div class="bg-gh-card border border-gh-border rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
            <span class="text-gh-muted text-xs font-semibold uppercase tracking-wider mb-1">Public Gists</span>
            <span class="text-3xl font-bold text-gh-text">${userData.public_gists}</span>
        </div>
        <div class="bg-gh-card border border-gh-border rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm col-span-2 sm:col-span-1">
            <span class="text-gh-muted text-xs font-semibold uppercase tracking-wider mb-1">Joined</span>
            <span class="text-xl font-bold text-gh-text mt-1">
                ${new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
        </div>
    </div>

    <!-- Latest Repos Block -->
    <div class="mt-2">
        <h3 class="text-lg font-semibold text-gh-text mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gh-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
            Latest Repositories
        </h3>
        
        <div id="repos-list-container" class="grid grid-cols-1 gap-4">


                    </div>
                </div>
            </div>
    
    `
}

function renderRepos(repos) {
    const reposListContainer = document.querySelector("#repos-list-container");

    if (!reposListContainer) return;

    if (!repos || repos.length === 0) {
        reposListContainer.innerHTML = `<p class="text-gh-muted text-sm py-2">No public repositories found.</p>`;
        return;
    }
    reposListContainer.innerHTML = repos.map(createRepoCard).join("");
}

async function getSearchLimit() {
    const response = await fetch("https://api.github.com/rate_limit");
    const data = await response.json();
    const core = data.resources.core;
    rateLimitText.textContent = `Requests left: ${core.remaining} / ${core.limit}`;
}


// Username type karke search (button ya Enter)
// Profile card: photo, naam, repos ki ginti, followers (jo tum ne chune) folloers (also)
// Loading state: fetch ke dauran “Loading...” dikhe
// Error state: user na mile to “User not found” dikhe
// Shuru ki khali state: pehli baar page khulne par “Search a GitHub username” jaisa message
// Bio aur “View Profile” link
// Latest 5 repos ki list:
// Recent searches
// Rate Limit Indicator (api request limit)


// const avatarEl = document.querySelector(".js-avatar");
// const nameEl = document.querySelector(".js-name");
// const loginEl = document.querySelector(".js-login");
// const bioEl = document.querySelector(".js-bio");
// const reposCountEl = document.querySelector(".js-repos-count");
// const followersCountEl = document.querySelector(".js-followers-count");
// const followingCountEl = document.querySelector(".js-following-count");
// const profileLinkEl = document.querySelector(".js-profile-link");

// const emptyState = document.querySelector(".empty-state");
// const errorState = document.querySelector(".error-state");

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



                        // <!-- Repo Card Item 1 -->
                        // <a href="#" target="_blank" class="repo-card group bg-gh-card border border-gh-border hover:border-gh-muted rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm block">
                        //     <div class="flex items-start justify-between gap-4">
                        //         <h4 class="text-gh-focus font-semibold text-lg group-hover:underline truncate">github/copilot-docs</h4>
                        //         <span class="px-2.5 py-0.5 rounded-full border border-gh-border text-xs text-gh-muted font-medium bg-gh-bg whitespace-nowrap">Public</span>
                        //     </div>
                        //     <p class="text-sm text-gh-muted mt-2 line-clamp-2 leading-relaxed">Documentation for GitHub Copilot, the AI pair programmer.</p>
                        //     <div class="flex items-center gap-4 mt-4 text-xs text-gh-muted font-medium">
                        //         <div class="flex items-center gap-1.5">
                        //             <span class="w-3 h-3 rounded-full bg-yellow-300 shadow-sm border border-black/10"></span> JavaScript
                        //         </div>
                        //         <div class="flex items-center gap-1 hover:text-gh-focus transition-colors">
                        //             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z"></path></svg>
                        //             1.2k
                        //         </div>
                        //         <div class="flex items-center gap-1 hover:text-gh-focus transition-colors">
                        //             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.739 12.033a3 3 0 10-3-5.196L4.502 9.278a3 3 0 101.498 2.6l4.237-2.441a2.983 2.983 0 001.502.596v4.468a3 3 0 101.5 0V10.033a3 3 0 10-1.5-5.196L7.502 2.396a3 3 0 10-1.498 2.6l4.237 2.441a2.983 2.983 0 001.502-.596v4.468a3 3 0 10-.004 2.724z"></path></svg>
                        //             342
                        //         </div>
                        //     </div>
                        // </a>

                        // <!-- Repo Card Item 2 -->
                        // <a href="#" target="_blank" class="repo-card group bg-gh-card border border-gh-border hover:border-gh-muted rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm block">
                        //     <div class="flex items-start justify-between gap-4">
                        //         <h4 class="text-gh-focus font-semibold text-lg group-hover:underline truncate">github/linguist</h4>
                        //         <span class="px-2.5 py-0.5 rounded-full border border-gh-border text-xs text-gh-muted font-medium bg-gh-bg whitespace-nowrap">Public</span>
                        //     </div>
                        //     <p class="text-sm text-gh-muted mt-2 line-clamp-2 leading-relaxed">Language Savant. If your repository's language is being reported incorrectly, send us a pull request!</p>
                        //     <div class="flex items-center gap-4 mt-4 text-xs text-gh-muted font-medium">
                        //         <div class="flex items-center gap-1.5">
                        //             <span class="w-3 h-3 rounded-full bg-[#701516] shadow-sm border border-black/10"></span> Ruby
                        //         </div>
                        //         <div class="flex items-center gap-1">
                        //             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z"></path></svg>
                        //             10.5k
                        //         </div>
                        //         <div class="flex items-center gap-1">
                        //             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.739 12.033a3 3 0 10-3-5.196L4.502 9.278a3 3 0 101.498 2.6l4.237-2.441a2.983 2.983 0 001.502.596v4.468a3 3 0 101.5 0V10.033a3 3 0 10-1.5-5.196L7.502 2.396a3 3 0 10-1.498 2.6l4.237 2.441a2.983 2.983 0 001.502-.596v4.468a3 3 0 10-.004 2.724z"></path></svg>
                        //             3.1k
                        //         </div>
                        //     </div>
                        // </a>