const renderMovieDetail = (movie) => {
  const releaseYear = movie.release_date
    ? movie.release_date.substr(0, 4)
    : "N/A";
  const genres = movie.genres
    ? movie.genres.map((genre) => genre.name).join(", ")
    : "N/A";

  return `
      <div class="movie-detail-page">
        <div class="movie-detail-banner">
          ${
            movie.poster_path
              ? `<img class="movie-detail-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>`
              : `<div class="no-poster">No Image</div>`
          }
        </div>
        <div class="movie-detail-info">
          <h1 class="movie-title">${movie.title}</h1>
          <span class="movie-release-year">${releaseYear}</span>
          <span class="movie-genres">${genres}</span>
          <p class="movie-overview">${
            movie.overview || "No overview available."
          }</p>
          <div class="movie-ratings">
            <span>Rating: ${movie.vote_average}</span>
          </div>
        </div>
      </div>
    `;
};

export default {
  ref: null,
  selector: "[movie-details]",
  dependencies: ["movie.data", "movie.id", "movie.loading"],
  listeners: [],
  mounted: false,

  render() {
    if (!this.mounted) {
      this.ref.classList.add("movie-detail-container");
      this.mounted = true;
    }
    if (
      window.App.state.get("movie.id") &&
      !window.App.state.get("movie.data") &&
      !window.App.state.get("movie.loading")
    ) {
      window.App.state.mutations.movie.getMovie();
    }

    if (!window.App.state.get("movie.id")) {
      this.ref.innerHTML = null;
      return;
    }

    // Display loading state while waiting for data
    if (window.App.state.get("movie.loading")) {
      this.ref.innerHTML = "<p>Loading movie details...</p>";
    } else {
      const movie = window.App.state.get("movie.data");
      if (movie) {
        this.ref.innerHTML = renderMovieDetail(movie);
      } else {
        this.ref.innerHTML = "<p>No movie data available.</p>";
      }
    }
  },

  destroy() {
    this.ref.innerHTML = "";
    this.mounted = false;
  },
};
