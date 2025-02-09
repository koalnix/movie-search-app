// Utility functions to parse the response based on its content type
const utils = {
    parseBody(xml) {
      // Check if the response is in JSON format and parse it
      if (xml.getResponseHeader("Content-Type") == "application/json") {
        return JSON.parse(xml.responseText); // Parse the response as JSON
      }
  
      return xml.response; // If not JSON, return the raw response
    },
  };
  
  export default {
    // Main function to send an HTTP request
    send(
      endpoint, // The API endpoint to which the request is sent
      { method, body, headers } = { method: "POST", body: null, headers: {} }, // Default options for method, body, and headers
      { onProgress, onError, onSuccess } = {} // Optional callback functions for handling progress, error, and success
    ) {
      // Return a Promise to handle asynchronous nature of the request
      return new Promise((res, rej) => {
        const xml = new XMLHttpRequest(); // Create a new XMLHttpRequest instance
  
        // Set request headers
        for (let header in headers) {
          xml.setRequestHeader(header, headers[header]);
        }
  
        // Event listener for tracking progress
        xml.onprogress = (e) => {
          const totalProgress = (e.loaded / e.total) * 100; // Calculate progress percentage
          if (onProgress) onProgress(totalProgress); // Call onProgress callback if provided
        };
  
        // Event listener for handling errors
        xml.onerror = (e) => {
          if (onError) onError(e); // Call onError callback if provided
          res(); // Resolve the promise after an error
        };
  
        // Event listener for handling the load (successful response)
        xml.onload = (e) => {
          if (xml.status == 200) { // Check if the status is 200 (OK)
            if (onSuccess) onSuccess(utils.parseBody(xml)); // Call onSuccess callback with parsed body if provided
            res(); // Resolve the promise after successful load
            return;
          }
          res(); // Resolve the promise for other status codes
        };
  
        // Construct the full API URL using the base URL from the config
        const targetUrl = `${window.App.config.apiBaseUrl}${endpoint}`;
  
        xml.open(method, targetUrl); // Initialize the request with the specified method and URL
        xml.send(body); // Send the request with the provided body
      });
    },
  };
  