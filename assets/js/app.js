// Import the necessary modules for configuration, state management, blocks, services
import config from "./config.js"; // Configuration data
import state from "./state.js"; // State management

// Import blocks for the search form and movie list
import searchFormBlock from "./block/searchForm.js";
import movieListBlock from "./block/movieList.js";
import movieDetailsBlock from "./block/movieDetails.js";

// Import service modules for API and styling
import apiService from "./service/api.js";
import stylingService from "./service/styling.js";

// Function to trigger an event across all services in the App
const triggerServiceEvent = (event) => {
  // Iterate through all services in window.App.service
  for (let service in window.App.service) {
    const targetService = window.App.service[service];
    // Check if the event is defined for each service
    if (
      typeof targetService.event != "undefined" &&
      typeof targetService.event[event] != "undefined"
    ) {
      // Trigger the event if it exists for the service
      targetService.event[event]();
    }
  }
};

// Function to mount blocks (components) to the page
const mountBlocks = () => {
  // Loop through all blocks and assign the reference (DOM element) based on selector
  for (let block of window.App.blocks) {
    block.ref = document.querySelector(block.selector);
  }

  // Loop through all blocks again to render and watch dependencies
  for (let block of window.App.blocks) {
    // For each dependency, set up a listener to re-render the block when the dependency changes
    for (let dependency of block.dependencies) {
      block.listeners.push(
        window.App.state.watch(dependency, () => {
          block.render(); // Re-render the block
        })
      );
    }

    block.render(); // Initial render of the block
    block.mounted = true; // Set the block as mounted
  }
};

// Immediately invoked function expression (IIFE) to initialize the application
export default (function () {
  window.App = {
    config, // Configuration settings
    service: {
      styling: stylingService, // Styling service for the app
      api: apiService, // API service for interacting with the backend
    },
    blocks: [searchFormBlock, movieListBlock,movieDetailsBlock], // The list of blocks (components) used in the app
    state, // State management
  };

  // Trigger the 'onLoad' event for all services to initialize them
  triggerServiceEvent("onLoad");

  // Mount the blocks to the DOM
  mountBlocks();
})();
