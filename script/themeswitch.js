    // ===== Управление темой =====
    (function() {
        const themeSwitch = document.getElementById('themeSwitch');
        const body = document.body;
        
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeSwitch) themeSwitch.classList.add('active');
        }
        
        // Переключение темы
        if (themeSwitch) {
            themeSwitch.addEventListener('click', function() {
                this.classList.toggle('active');
                
                if (body.classList.contains('dark-theme')) {
                    body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }
    })();