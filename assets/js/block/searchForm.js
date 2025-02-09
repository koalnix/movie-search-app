export default {
    ref: null, // Reference to the DOM element for the component
    selector: "[search-form]", // Selector for the component
    dependencies: ["search.keyword"], // Dependencies to track (e.g., search keyword)
    listeners: [], // Stores event listeners
    mounted: false, // Boolean flag to track if the component is mounted
    events: {
      // Event to trigger search when the form is submitted
      async search() {
        window.App.state.update("search.page", 1); // Reset to the first page on search
        await window.App.state.mutations.movie.search(); // Trigger search in the state
      },
    },
    render() {
      // Rendering the component
      if (!this.mounted) {
        this.events.search(); // Trigger the initial search
        // Initial render: inject HTML for search input and button
        this.ref.innerHTML = `
          <input placeholder="Search by title, ID, Genre..."></input>
          <button>Search</button>
        `;
  
        // Initial event listeners
        // Update search keyword in the state when user types in the input field
        this.ref.querySelector("input").addEventListener("input", (e) => {
          window.App.state.update("search.keyword", e.target.value);
        });
  
        // Prevent form submission default action and trigger search event
        this.ref.addEventListener("submit", (e) => {
          e.preventDefault();
          this.events.search();
        });
      }
  
      // Get the necessary DOM elements (submit button and input)
      const submitButton = this.ref.querySelector("button");
      const keywordInput = this.ref.querySelector("input");
  
      // Disable input elements while loading
      submitButton.disabled = window.App.state.get("search.loading");
      keywordInput.disabled = window.App.state.get("search.loading");
  
      // Update input field value with the current search keyword from the state
      keywordInput.value = window.App.state.get("search.keyword");
    },
    destroy() {
      // Clean up event listeners when the component is destroyed
      for (let listener of this.listeners) {
        window.removeEventListener(...listener);
      }
      // Clear the component's HTML content
      this.ref.innerHTML = "";
    },
  };
  