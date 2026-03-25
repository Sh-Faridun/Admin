    document.addEventListener('DOMContentLoaded', function() {
        // ===== Управление всеми dropdown =====
        const dropdowns = {
            user: {
                btn: document.getElementById('userMenuBtn'),
                menu: document.getElementById('userDropdown')
            },
            notifications: {
                btn: document.getElementById('notificationsBtn'),
                menu: document.getElementById('notificationsDropdown')
            }
        };

        // Функция для закрытия всех dropdown
        function closeAllDropdowns(except = null) {
            Object.keys(dropdowns).forEach(key => {
                if (except !== key && dropdowns[key].menu) {
                    dropdowns[key].menu.classList.remove('show');
                }
            });
        }

        // Открытие/закрытие конкретного dropdown
        function toggleDropdown(name) {
            const dropdown = dropdowns[name];
            if (!dropdown.btn || !dropdown.menu) return;

            // Если меню открыто - закрываем его
            if (dropdown.menu.classList.contains('show')) {
                dropdown.menu.classList.remove('show');
            } else {
                // Закрываем все другие меню
                closeAllDropdowns(name);
                // Открываем нужное
                dropdown.menu.classList.add('show');
            }
        }

        // Навешиваем обработчики на кнопки
        Object.keys(dropdowns).forEach(key => {
            const dropdown = dropdowns[key];
            if (dropdown.btn && dropdown.menu) {
                dropdown.btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(key);
                });
            }
        });

        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            let clickedInsideDropdown = false;
            
            // Проверяем, был ли клик внутри какого-либо dropdown
            Object.keys(dropdowns).forEach(key => {
                const dropdown = dropdowns[key];
                if (dropdown.menu && dropdown.menu.contains(e.target)) {
                    clickedInsideDropdown = true;
                }
                if (dropdown.btn && dropdown.btn.contains(e.target)) {
                    clickedInsideDropdown = true;
                }
            });

            // Если клик был вне всех dropdown - закрываем их
            if (!clickedInsideDropdown) {
                closeAllDropdowns();
            }
        });

        // Предотвращаем закрытие при клике внутри меню
        Object.keys(dropdowns).forEach(key => {
            const dropdown = dropdowns[key];
            if (dropdown.menu) {
                dropdown.menu.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        });

        // ===== Функционал уведомлений =====
        const markReadBtn = document.querySelector('.mark-read');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                    const dot = item.querySelector('.unread-dot');
                    if (dot) dot.remove();
                });
                
                // Обновить счетчик
                const badge = document.querySelector('.notifications .badge');
                if (badge) {
                    badge.textContent = '0';
                }
                
                alert('Все уведомления отмечены как прочитанные');
            });
        }

        // ===== Обработка выхода =====
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (confirm('Вы уверены, что хотите выйти?')) {
                    alert('Выход из системы');
                    window.location.href = 'login.html';
                }
            });
        }

        // ===== Мобильное меню =====
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        
        if (menuToggle && sidebar && overlay) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.add('active');
                overlay.classList.add('active');
                
                // Закрываем dropdown при открытии мобильного меню
                closeAllDropdowns();
            });
        }
        
        if (closeSidebar && sidebar && overlay) {
            closeSidebar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        if (overlay && sidebar) {
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                // Закрываем dropdown при клике на оверлей
                closeAllDropdowns();
            });
        }
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && sidebar && overlay) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Закрываем dropdown при нажатии ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllDropdowns();
                
                // Также закрываем мобильное меню
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            }
        });

        console.log('Dropdown меню инициализированы и работают корректно');
    });