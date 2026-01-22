
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');
    
    // 1. Check for saved preference
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        icon.className = "ri-sun-line"; 
    } else if (currentTheme == "light") {
        document.documentElement.setAttribute("data-theme", "light");
        icon.className = "ri-moon-line";
    }

    // 2. Handle Click
    toggleBtn.addEventListener('click', function() {
        let theme = "light";
        if (document.documentElement.getAttribute("data-theme") !== "dark") {
            theme = "dark";
            icon.className = "ri-sun-line";
        } else {
            icon.className = "ri-moon-line";
        }
        
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem('theme', theme);
    });