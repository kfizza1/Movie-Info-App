document.addEventListener("DOMContentLoaded", () => {

const API_KEY = "3f70d607";

/* =========================
   HOME / SEARCH PAGE LOGIC
========================= */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesDiv = document.getElementById("movies");

if (searchInput && searchBtn && moviesDiv) {

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) fetchMovies(query);
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchBtn.click();
    });

    async function fetchMovies(query) {
        try {
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
            );
            const data = await res.json();

            moviesDiv.innerHTML = "";
            searchInput.value = "";

            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                moviesDiv.innerHTML = `<p>${data.Error}</p>`;
            }
        } catch {
            moviesDiv.innerHTML = `<p>Something went wrong</p>`;
        }
    }

    function displayMovies(movies) {
        movies.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");

            movieDiv.innerHTML = `
                <img src="${
                    movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/150x225?text=No+Image"
                }">
                <p>${movie.Title} (${movie.Year})</p>
            `;

            movieDiv.addEventListener("click", () => {
                window.open(`detail.html?id=${movie.imdbID}`, "_blank");
            });

            moviesDiv.appendChild(movieDiv);
        });
    }
}

/* =========================
   DETAIL PAGE LOGIC
========================= */

const detailContainer = document.getElementById("movie-detail");

if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    if (!movieId) {
        detailContainer.innerHTML = "<p>Movie not found</p>";
        return;
    }

    async function fetchMovieDetails() {
        const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`
        );
        const movie = await res.json();

        detailContainer.innerHTML = `
            <img src="${movie.Poster}">
            <div id="main-content">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>
<button onclick="window.location.href='index.html'">⬅ Back</button>
            </div>
        `;
    }

    fetchMovieDetails();
}

});
