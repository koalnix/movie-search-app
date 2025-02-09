// Function to render the HTML for each movie card
const renderMovieCard = (movie) => {
  const releaseYear = movie.release_date.substr(0, 4); // Extract the release year from the date string
  const buttonElement = document.createElement("button");
  buttonElement.addEventListener("click", () => {
    window.App.state.update("movie.data", null);
    window.App.state.update("movie.loading", false);
    window.App.state.update("movie.id", movie.id);
    window.App.state.mutations.movie.clearList();
  });
  buttonElement.classList = "moviecard";
  buttonElement.innerHTML = `
  ${
    movie.poster_path
      ? `<img class="movie__banner" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />` // If poster exists, display it
      : ""
  }
  <div class="movie__overlay">
    <span class="movie__title">${movie.title}</span>
      <span class="movie__overview">${movie.overview}</span>
      <span class="movie__release">${releaseYear}</span>
    </div> `;
  return buttonElement;
};

export default {
  ref: null, // Reference to the DOM element for the component
  selector: "[movie-list]", // Selector for the component
  dependencies: [
    "movies.list", // List of movies to display
    "movies.loading", // Loading state for fetching movies
    "movies.page", // Current page number
    "movies.total", // Total number of movies
    "movie.id", // If movie is selected
  ],
  listeners: [], // Stores event listeners
  mounted: false, // Boolean flag to track if the component is mounted

  // Function to render the component
  render() {
    if (!this.mounted) {
      // Initialize component if not already mounted
      this.ref.classList = "movielist container"; // Set the class for styling

      let scrollReachedLoading = false;
      document.addEventListener("scroll", async () => {
        if (
          window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 10
        ) {
          if (scrollReachedLoading) return;

          scrollReachedLoading = true;
          console.log("Reached bottom! Load more...");
          await window.App.state.mutations.movie.search();
          scrollReachedLoading = false;
        }
      });
    }
    if (window.App.state.get("movie.id")) {
      this.ref.innerHTML = null;
      return;
    }

    if (!window.App.state.get("movies.loading")) {
      // If movies are not loading, display them
      this.ref.innerHTML = "";
      this.ref.append(
        ...window.App.state
          .get("movies.items") // Get the list of movies from the state
          .map(renderMovieCard)
      );
    } else {
      // If movies are still loading, show a loading message
      this.ref.innerHTML = "LOADING...";
    }
  },

  // Cleanup function to remove listeners and reset the component when destroyed
  destroy() {
    for (let listener of this.listeners) {
      window.removeEventListener(...listener); // Remove event listeners
    }
    this.ref.innerHTML = ""; // Clear the component's HTML content
    this.mounted = false; // Reset mounted state
  },
};
