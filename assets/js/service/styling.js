// Define a mapping of CSS custom property names to their corresponding values in window.App.config.styling
const variableLegend = [
    ["app-primary-color", (app) => app.config.styling.color.primary],
    ["app-on-primary-color", (app) => app.config.styling.color.onPrimary],
  
    // Container sizing
    ["app-container-max-width", (app) => app.config.styling.sizing.container.maxWidth],
  ];
  
  export default {
    // Event handler for page load (onLoad)
    event: {
      onLoad() {
        // Loop through each item in the variableLegend array
        for (let varLegend of variableLegend) {
          // Set the CSS custom property using the name (varLegend[0]) and the value from window.App (varLegend[1](window.App))
          document.body.style.setProperty(
            `--${varLegend[0]}`, // Custom CSS variable name, prefixed with '--'
            varLegend[1](window.App) // Value from the function in the second array element, which accesses window.App
          );
        }
      },
    },
  };
  