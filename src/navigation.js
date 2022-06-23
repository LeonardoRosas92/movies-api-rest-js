window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

back.addEventListener('click', () => {
    history.back();
});

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
    console.log({ location });
    if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        moviePage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    smoothscroll();
}

function searchPage() {
    console.log('categories!!');
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
}
function moviePage() {
    console.log('Movie!!');
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
    console.log('categories!!');
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
}
function homePage() {
    location.hash = `#home`;
    console.log('Home');
    inputSearch.value = '';
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