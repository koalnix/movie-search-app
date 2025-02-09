const state = {
  search: {
    keyword: "", // The search term entered by the user
    sortBy: "", // The sort criteria for the search results
    page: 1, // The current page number for pagination
    loading: false, // Whether the search is currently loading
  },
  movies: {
    page: 1, // The current page number for the movie list
    total: 0, // The total number of movies available
    loading: true, // Whether the movie list is currently being loaded
    items: [], // An array to store the list of movies
    pages: 0,
  },
  movie: {
    data: null, // The data for a single movie (for detailed view)
    id: null,
    loading: false, // Whether the movie details are currently being loaded
  },
};

export default {
  state,
  watchers: {},

  // Method to update the state of a specific field
  update(field, value) {
    let keys = field.split("."); // Split the field by '.' to access nested values
    let currentStateVal = state; // Start with the state object

    // Traverse the state object to reach the correct nested field
    for (let i = 0; i < keys.length - 1; i++) {
      currentStateVal = currentStateVal[keys[i]];
    }

    let oldVal = this.get(field); // Get the old value of the field
    currentStateVal[keys[keys.length - 1]] = value; // Update the field with the new value

    // Dispatch an event if the value has changed
    setTimeout(() => {
      if (oldVal != value)
        window.dispatchEvent(new CustomEvent(`update-state|${field}`)); // Trigger event
    });
  },

  // Method to retrieve the current value of a specific field
  get(field) {
    let keys = field.split("."); // Split the field by '.' to access nested values
    let currentStateVal = state; // Start with the state object

    // Traverse the state object to get to the correct nested property
    for (let i = 0; i < keys.length - 1; i++) {
      currentStateVal = currentStateVal[keys[i]];
    }

    return currentStateVal[keys[keys.length - 1]]; // Return the value of the field
  },

  // Method to watch for changes in a specific field
  watch(field, callback) {
    // Define a callback function to be called when the field changes
    const eventCB = () => {
      console.log(field, this.get(field)); // Log the field and its new value
      callback(this.get(field)); // Call the callback with the updated value
    };

    // Add an event listener for the update-state event for this field
    window.addEventListener(`update-state|${field}`, eventCB);

    // Return the event listener so it can be removed later if necessary
    return [`update-state|${field}`, eventCB];
  },

  mutations: {
    movie: {
      // Method to search for movies based on the current search keyword and page
      search() {
        if (
          window.App.state.get("movies.pages") <
            window.App.state.get("search.page") &&
          window.App.state.get("search.page") != 1
        )
          return;
        return new Promise((res, rej) => {
          window.App.state.update("search.loading", true); // Set loading state to true
          if (window.App.state.get("search.page") == 1) {
            window.App.state.update("movies.loading", true); // Set movie list loading to true
          }
          window.App.state.update("movie.id", null);
          window.App.state.update("movie.data", null);

          // Send the API request to search for movies
          window.App.service.api.send(
            `/movie/browse?query=${window.App.state.get(
              "search.keyword"
            )}&page=${window.App.state.get("search.page")}`,
            { method: "GET" },
            {
              // When the request is successful, update the state with the results
              onSuccess: (result) => {
                window.App.state.update("search.page", result.page + 1);
                window.App.state.update("movies.loading", false); // Set movie list loading to false
                window.App.state.update("movies.page", result.page); // Update the current page
                window.App.state.update("movies.items", [
                  ...window.App.state.get("movies.items"),
                  ...result.results,
                ]); // Update the movie list
                window.App.state.update("movies.pages", result.total_pages); // Update the total number of results
                window.App.state.update("movies.total", result.total_results); // Update the total number of results
                window.App.state.update("search.loading", false); // Set search loading to false
                res();
              },
            }
          );

          window.App.state.update("search.loading", false);
        });
      },
      clearList() {
        window.App.state.update("movies.loading", false);
        window.App.state.update("movies.page", 1);
        window.App.state.update("movies.items", []);
        window.App.state.update("movies.total", 0);
      },
      async getMovie() {
        window.App.state.update("movie.loading", true);
        window.App.state.update("movie.data", null);

        window.App.service.api.send(
          `/movie?id=${window.App.state.get("movie.id")}`,
          { method: "GET" },
          {
            // When the request is successful, update the state with the results
            onSuccess: (result) => {
              window.App.state.update("movie.data", result);
              window.App.state.update("movie.loading", false);
            },
          }
        );
      },
    },
  },
};
