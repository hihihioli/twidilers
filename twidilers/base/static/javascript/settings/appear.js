
// Dark mode toggle handler
function handleDarkToggle() {
    const html   = document.documentElement;
    const toggle = document.getElementById("dark-mode-toggle");
    if (!toggle) return;          // no toggle on the page? bail out

    // sync the checkbox to whatever data-theme is right now
    isDark = (html.dataset.theme === "dark");
    console.log("Dark mode is", isDark ? "enabled" : "disabled");
    toggle.checked = isDark;

    // when the user flips the checkbox → set data-theme & persist
    toggle.addEventListener("change", function() {
        const newTheme = isDark ? "light" : "dark";
        html.dataset.theme = newTheme;
        localStorage.setItem("theme", newTheme);
        console.log("theme set to", newTheme);
        isDark = !isDark; 
        toggle.checked = isDark;
  });
}

