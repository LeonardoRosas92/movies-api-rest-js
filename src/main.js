const baseURLImg = 'https://image.tmdb.org/t/p/w500';
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
});

/* UTILS */
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url);
        }
    });
});

function createMovies(movies, container, title, { lazyLoad = false, clean = false } = {}) {
    if (clean) {
        container.innerHTML = '';
    }
    if (title) {
        const divContainerTitle = document.createElement('div');
        divContainerTitle.classList.add(`${container.id}__title`);
        const h2 = document.createElement('h2');
        h2.innerHTML = title;
        divContainerTitle.appendChild(h2);
        container.appendChild(divContainerTitle);
    }
    const divContainerCards = document.createElement('div');
    divContainerCards.classList.add(`${container.id}__cards`);
    movies.forEach(movie => {
        if (movie.poster_path) {
            const divContainerCardsCard = document.createElement('div');
            divContainerCardsCard.classList.add(`${container.id}__cards__card`);
            divContainerCardsCard.addEventListener('click', () => {
                location.hash = `#movie=${movie.id}`;
            });
            const divContainerCardsCardImg = document.createElement('div');
            divContainerCardsCardImg.classList.add(`${container.id}__cards__card__img`);
            const img = document.createElement('img');
            img.src = baseURLImg + movie.poster_path;
            img.setAttribute('alt', movie.title);
            img.setAttribute(
                'src',
                'https://image.tmdb.org/t/p/w500' + movie.poster_path,
            );
            divContainerCardsCardImg.appendChild(img);
            divContainerCardsCard.appendChild(divContainerCardsCardImg);
            const divContainerCardsInfo = document.createElement('div');
            divContainerCardsInfo.classList.add(`${container.id}__cards__card__info`);
            const pTitle = document.createElement('p');
            pTitle.innerHTML = movie.title;
            const pRelease = document.createElement('p');
            pRelease.innerHTML = movie.release_date;
            divContainerCardsInfo.appendChild(pTitle);
            divContainerCardsInfo.appendChild(pRelease);
            divContainerCardsCard.appendChild(divContainerCardsInfo);
            if (clean) {
                divContainerCards.appendChild(divContainerCardsCard);
            }else{
                let divContainerCardsPaginated = document.querySelector('.movies__cards');
                divContainerCardsPaginated.appendChild(divContainerCardsCard);
            }

            if (lazyLoad) {
                lazyLoader.observe(divContainerCardsCard);
            }
        }
    });
    container.appendChild(divContainerCards);
}

async function getTrendingMoviesPreview() {
    const { data } = await api('/trending/movie/day');
    const movies = data.results;
    createMovies(movies, trending, '¡The most popular!', { lazyLoad : false, clean : true } );
}

async function getMoviesByCategory(id, categoryName) {
    page = 1;
    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id
        }
    });
    const moviesResult = data.results;
    maxPage = data.total_pages;
    createMovies(moviesResult, movies, categoryName, { lazyLoad : true, clean : true } );
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('/discover/movie', {
                params: {
                    with_genres: id,
                    page

                }
            });
            const moviesResult = data.results;
            createMovies(moviesResult, movies, null ,{ lazyLoad: true, clean: false });
        }
    }
}
async function getMoviesByName(title) {
    page = 1;
    const { data } = await api('/search/movie', {
        params: {
            query: decodeURIComponent(title)
        }
    });
    const moviesResult = data.results;
    maxPage = data.total_pages;
    createMovies(moviesResult, movies, `"${title}"`,{ lazyLoad: true, clean: true });
}
function getPaginatedMoviesByName(title){
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('/search/movie', {
                params: {
                    query: decodeURIComponent(title),
                    page
                }
            });
            const moviesResult = data.results;
            createMovies(moviesResult, movies, null ,{ lazyLoad: true, clean: false });
        }
    }
}

async function getMovieById(id) {
    /* MOVIE */
    movie.innerHTML = "";
    const { data: movieResult } = await api(`/movie/${id}`);
    const { data: movieVideos } = await api(`/movie/${id}/videos`);
    const { data: movieImages } = await api(`/movie/${id}/images`);
    const { data: movieCastResult } = await api(`/movie/${id}/credits`);

    /* MOVIE__INFO */
    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');
    if (movieResult.backdrop_path) {
        movieInfo.style.background = `url(https://image.tmdb.org/t/p/w500/${movieResult.backdrop_path}), rgba(190, 186, 186, 0.6)`;
        movieInfo.style.backgroundSize = "cover";
    }

    /* MOVIE__INFO__IMG */
    const movieInfoImg = document.createElement('div');
    movieInfoImg.classList.add('movie__info__img');
    const movieInfoImg_img = document.createElement('img');
    movieInfoImg_img.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + movieResult.poster_path);
    movieInfoImg.appendChild(movieInfoImg_img);
    movieInfo.appendChild(movieInfoImg);

    /* MOVIE__INFO__TEXT */
    const movieInfoText = document.createElement('div');
    movieInfoText.classList.add('movie__info__text');
    const movieInfoText_h1 = document.createElement('h1');
    movieInfoText_h1.innerHTML = movieResult.title;
    movieInfoText.appendChild(movieInfoText_h1);

    const movieInfoTextRelease = document.createElement('div');
    movieInfoTextRelease.classList.add('movie__info__text__release');
    const movieInfoTextRelease_h2_1 = document.createElement('h2');
    movieInfoTextRelease_h2_1.innerHTML = movieResult.release_date;
    movieInfoTextRelease.appendChild(movieInfoTextRelease_h2_1);
    const movieInfoTextReleaseCategories = document.createElement('div');
    movieResult.genres.forEach(category => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.id = `genre-${category.id}`;
        li.innerHTML = category.name;
        li.appendChild(span);
        li.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        movieInfoTextReleaseCategories.appendChild(li);
    });
    movieInfoTextRelease.appendChild(movieInfoTextReleaseCategories);
    movieInfoText.appendChild(movieInfoTextRelease);

    const movieInfoText_h2_1 = document.createElement('h2');
    movieInfoText_h2_1.innerHTML = 'Overview:';
    movieInfoText.appendChild(movieInfoText_h2_1);
    const movieInfoText_p = document.createElement('p');
    movieInfoText_p.innerHTML = movieResult.overview;
    movieInfoText.appendChild(movieInfoText_p);


    const movieInfoTextProduction_h2_2 = document.createElement('h2');
    movieInfoTextProduction_h2_2.innerHTML = movieResult.vote_average;
    const movieInfoTextProduction_h2_span = document.createElement('span');
    movieInfoTextProduction_h2_span.classList.add('fa-solid');
    movieInfoTextProduction_h2_span.classList.add('fa-star');
    movieInfoTextProduction_h2_2.appendChild(movieInfoTextProduction_h2_span);
    movieInfoText.appendChild(movieInfoTextProduction_h2_2);
    movieInfo.appendChild(movieInfoText);

    /* MOVIE_MEDIA */
    const movieMedia = document.createElement('div');
    movieMedia.classList.add('movie__media');
    /* MOVIE_MEDIA_TRAILER */
    const movieMediaTrailer = document.createElement('div');
    movieMediaTrailer.classList.add('movie__media__trailer');
    if (movieVideos.results.length > 0) {
        const movieMediaTrailerTitle = document.createElement('div');
        movieMediaTrailerTitle.classList.add('movie__media__trailer__title');
        const movieMediaTrailerTitle_h2 = document.createElement('h2');
        movieMediaTrailerTitle_h2.innerHTML = "Trailer";
        movieMediaTrailerTitle.appendChild(movieMediaTrailerTitle_h2);
        movieMediaTrailer.appendChild(movieMediaTrailerTitle);
        movieMedia.appendChild(movieMediaTrailer);
        const movieMediaTrailerVideo = document.createElement('div');
        movieMediaTrailerVideo.classList.add('movie__media__trailer__video');
        const movieMediaTrailerVideo_embed = document.createElement('embed');
        movieMediaTrailerVideo_embed.setAttribute('src', `https://www.youtube.com/embed/${movieVideos.results[0].key}?autoplay=1`);
        movieMediaTrailerVideo.appendChild(movieMediaTrailerVideo_embed);
        movieMediaTrailer.appendChild(movieMediaTrailerVideo);
    }

    /* MOVIE_MEDIA_GALLERY */
    const movieMediaGallery = document.createElement('div');
    movieMediaGallery.classList.add('movie__media__gallery');
    if (movieImages.posters.length > 0) {
        const movieMediaGalleryTitle = document.createElement('div');
        movieMediaGalleryTitle.classList.add('movie__media__gallery__title');
        const movieMediaGalleryTitle_h2 = document.createElement('h2');
        movieMediaGalleryTitle_h2.innerHTML = "Posters";
        movieMediaGalleryTitle.appendChild(movieMediaGalleryTitle_h2);
        movieMediaGallery.appendChild(movieMediaGalleryTitle);

        const movieMediaGalleryImg = document.createElement('div');
        movieMediaGalleryImg.classList.add('movie__media__gallery__img');
        movieImages.posters.forEach(poster => {
            if (poster.iso_639_1 === 'en' || poster.iso_639_1 === null || poster.iso_639_1 === 'es') {
                const imgGallery = document.createElement('img');
                imgGallery.setAttribute('src', 'https://image.tmdb.org/t/p/w500/' + poster.file_path);
                movieMediaGalleryImg.appendChild(imgGallery);
            }
        });
        movieMediaGallery.appendChild(movieMediaGalleryImg);
    }

    movieMedia.appendChild(movieMediaGallery);

    /* MOVIE_CAST */
    const movieCast = document.createElement('div');
    movieCast.classList.add('movie__cast');
    if (movieCastResult.cast.length > 0) {
        const movieCastTitle = document.createElement('div');
        movieCastTitle.classList.add('movie__cast__title');
        const movieCastTitle_h2 = document.createElement('h2');
        movieCastTitle_h2.innerHTML = "Cast"
        movieCastTitle.appendChild(movieCastTitle_h2);
        movieCast.appendChild(movieCastTitle);

        const movieCastCards = document.createElement('div');
        movieCastCards.classList.add('movie__cast__cards');
        movieCastResult.cast.forEach(cast => {
            if (cast.profile_path) {
                const movieCastCardsCard = document.createElement('div');
                movieCastCardsCard.classList.add('movie__cast__cards__card');
                const movieCastCardsCardImg = document.createElement('div');
                movieCastCardsCardImg.classList.add('movie__cast__cards__img');
                const movieCastCardsCardImg_img = document.createElement('img');
                movieCastCardsCardImg_img.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + cast.profile_path);
                movieCastCardsCardImg.appendChild(movieCastCardsCardImg_img);
                movieCastCardsCard.appendChild(movieCastCardsCardImg);

                const movieCastCardsName = document.createElement('div');
                movieCastCardsName.classList.add('movie__cast__cards__name');
                const movieCastCardsName_p = document.createElement('p');
                movieCastCardsName_p.innerHTML = cast.name;
                movieCastCardsName.appendChild(movieCastCardsName_p);
                movieCastCardsCard.appendChild(movieCastCardsName);
                movieCastCards.appendChild(movieCastCardsCard);
            }
        });
        movieCast.appendChild(movieCastCards);
    }


    movie.appendChild(movieInfo);
    movie.appendChild(movieMedia);
    movie.appendChild(movieCast);
}

async function getCategoriesPreview() {
    const { data } = await api('/genre/movie/list');
    const genres = data.genres;

    categories.innerHTML = "";
    /* CATEGORIES_TITLE */
    const categoriesTitle = document.createElement('div');
    categoriesTitle.classList.add('categories__title');
    const categoriesTitle_h2 = document.createElement('h2');
    categoriesTitle_h2.innerHTML = 'Categories';
    categoriesTitle.appendChild(categoriesTitle_h2);
    categories.appendChild(categoriesTitle);

    /* CATEGORIES_TITLE */
    const categoriesContent = document.createElement('div');
    categoriesContent.classList.add('categories__content');
    genres.forEach(category => {
        const categoriesContentCategory = document.createElement('div');
        categoriesContentCategory.id = `genre-${category.id}`;
        categoriesContentCategory.classList.add('categories__content__category');
        categoriesContentCategory.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const img = document.createElement('img');
        img.setAttribute('src', `img/genreMovies/${category.name}.png`);
        const p = document.createElement('p');
        p.innerHTML = category.name;
        categoriesContentCategory.appendChild(img);
        categoriesContentCategory.appendChild(p);
        categoriesContent.appendChild(categoriesContentCategory);
    });
    categories.appendChild(categoriesContent);
}

