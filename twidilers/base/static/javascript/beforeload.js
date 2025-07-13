// For JS that needs to run before the page loads
//determines if the user has a set theme
console.log("Theme script loaded");
function detectColorScheme(){
      // 1) read saved theme
      const savedTheme = localStorage.getItem("theme");
      // 2) if no saved theme, fall back to OS preference
      const prefersDark = window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)").matches;
      // 3) pick final theme
      const theme = savedTheme
        ? savedTheme
        : (prefersDark ? "dark" : "light");
      // 4) apply it immediately
      document.documentElement.setAttribute("data-theme", theme);
      console.log("Applied theme:", theme);
}
detectColorScheme();