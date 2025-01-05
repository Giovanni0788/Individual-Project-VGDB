const gameList = document.querySelector(".gameList");
const loaderEl = document.getElementById('js-preloader');
const loadMoreGamesBtn = document.querySelector(".main-button");
const gameSearch = document.querySelector(".search");

let nextGameListUrl = null;

const url = `https://api.rawg.io/api/games?key=${APIKEY}&ordering=released&dates=1980-01-01,2025-01-01`

const getPlatformStr = (platforms) => {
    const platformStr = platforms.map(pl => pl.platform.name).join(", ");
    if (platformStr.length > 30) {
        return platformStr.substring(0, 30) + "...";
    }
    return platformStr;
}

function loadGames(url){
    loaderEl.classList.remove("loaded");
    
    // Fetch recently released games from RAWG API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            nextGameListUrl = data.next ? data.next : null;
            const games = data.results;
    
            games.map(game => {
                const gameItemEl = `
                <div class="col">
                        <div class="item">
                        <img class="img" src="${game.background_image}" alt="${game.name} image">
                            <h4 class="game-name">Name: ${game.name}</h4><span class="platforms">Platforms: ${getPlatformStr(game.parent_platforms)}</span>
                            <ul>
                            <li><i class="fa fa-star"></i> <span class="rating">${game.rating}</span></li>
                                <li><i class="fa-regular fa-calendar"></i> <span class="date">${game.released}</span></li>
                                </ul>
                        </div>
                        </div>
                `
                gameList.insertAdjacentHTML("beforeend", gameItemEl)
            });
            loaderEl.classList.add("loaded");
            if (nextGameListUrl) {
                loadMoreGamesBtn.classList.remove("hidden");
            } else {
                loadMoreGamesBtn.classList.add("hidden");
            }
        })
        .catch(error => {
            console.log("An error occurred:", error);
        });
}


// load games
loadGames(url);

loadMoreGamesBtn.addEventListener("click", ()=>{
    if(nextGameListUrl){
        loadGames(nextGameListUrl);
    }
})
// search games
if (gameSearch) {
    gameSearch.addEventListener('input', (e) => {
        const searchString = e.target.value.toLowerCase();
        gameList.innerHTML = '';  
        const searchUrl = `https://api.rawg.io/api/games?key=${APIKEY}&search=${searchString}&ordering=released&dates=1980-01-01,2025-01-01`;
        loadGames(searchUrl);
    });
}


const loadGameResults = () => {
    try {
        const res =  fetch(url&gameSearch)
        .then(res => {return res.json()});
    } catch (err) {
        console.error(err);
    }
};

const  displayGameResults = (results) => {
    const htmlString = results
    .map((loaderEl) => {
            return `<div class="col">
            <div class="item">
            <img class="img" src="${game.background_image}" alt="${game.name} image">
                <h4 class="game-name">Name: ${game.name}</h4><span class="platforms">Platforms: ${getPlatformStr(game.parent_platforms)}</span>
                <ul>
                <li><i class="fa fa-star"></i> <span class="rating">${game.rating}</span></li>
                    <li><i class="fa-regular fa-calendar"></i> <span class="date">${game.released}</span></li>
                    </ul>
            </div>
            </div>`
        })
        .join('');
        loaderEl.innerHTML = htmlString;
};

loadGameResults();