let maxPage;
let page = 1;
let infiniteScroll;

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

back.addEventListener('click', () => {
    history.back();
});

/* BTN SEARCH */
btnSearch.addEventListener('click', () => {
    location.hash = `#search=${inputSearch.value}`;
});

inputSearch.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        location.hash = `#search=${inputSearch.value}`;
    }
});

function navigator() {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }
    console.log(location.hash);
    if (location.hash.startsWith('#search=')) {
        movie.innerHTML = "";
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        moviePage();
    } else if (location.hash.startsWith('#category=')) {
        movie.innerHTML = "";
        categoriesPage();
    } else {
        homePage();
    }
    smoothscroll();
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false });
    }
}

function searchPage() {
    const [_, title] = location.hash.split('=');
    getMoviesByName(title.replaceAll('%20', ' '));
    inputSearch.value = title.replaceAll('%20', ' ');
    navigation.classList.remove('inactive');
    back.classList.remove('inactive');
    header.classList.add('inactive');
    trending.classList.add('inactive');
    categories.classList.add('inactive');
    movie.classList.add('inactive');
    movies.classList.remove('inactive');
    footer.classList.remove('inactive');
    infiniteScroll = getPaginatedMoviesByName(title.replaceAll('%20', ' '));
}
function moviePage() {
    const [_, idMovie] = location.hash.split('=');
    getMovieById(idMovie);
    navigation.classList.remove('inactive');
    back.classList.remove('inactive');
    header.classList.add('inactive');
    trending.classList.add('inactive');
    categories.classList.add('inactive');
    movie.classList.remove('inactive');
    movies.classList.add('inactive');
    footer.classList.remove('inactive');
}
function categoriesPage() {
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    getMoviesByCategory(categoryId, categoryName.replace('%20', ' '));
    navigation.classList.remove('inactive');
    back.classList.remove('inactive');
    header.classList.add('inactive');
    trending.classList.add('inactive');
    categories.classList.add('inactive');
    movie.classList.add('inactive');
    movies.classList.remove('inactive');
    footer.classList.remove('inactive');

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}
function homePage() {
    location.hash = `#home`;
    inputSearch.value = '';
    movie.innerHTML = "";
    getTrendingMoviesPreview();
    getCategoriesPreview();
    navigation.classList.remove('inactive');
    back.classList.add('inactive');
    header.classList.remove('inactive');
    trending.classList.remove('inactive');
    categories.classList.remove('inactive');
    movie.classList.add('inactive');
    movies.classList.add('inactive');
    footer.classList.remove('inactive');
}

function smoothscroll() {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
};