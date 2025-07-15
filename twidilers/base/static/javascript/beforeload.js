function detectColorScheme() {
  // 1) read raw saved theme
  const savedTheme = localStorage.getItem("theme");
  const isValid    = (savedTheme === "light" || savedTheme === "dark");

  // 2) detect OS preference
  const prefersDark = window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches;

  // 3) decide final theme
  let theme;
  if (savedTheme !== null) {
    if (isValid) {
      theme = savedTheme;
    } else {
      console.error(
        `Invalid theme in localStorage: "${savedTheme}". ` +
        `Expected "light" or "dark".`
      );
      theme = prefersDark ? "dark" : "light";
    }
  } else {
    theme = prefersDark ? "dark" : "light";
  }

  // 4) apply immediately
  document.documentElement.setAttribute("data-theme", theme);
  console.log("Applied theme:", theme);
  localStorage.setItem("theme", theme); // persist the theme
}

detectColorScheme();