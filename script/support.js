document.addEventListener('DOMContentLoaded', function() {
            // ===== Dropdown меню =====
            const dropdowns = {
                user: {
                    btn: document.getElementById('userMenuBtn'),
                    menu: document.getElementById('userDropdown')
                }
            };

            function closeAllDropdowns(except = null) {
                Object.keys(dropdowns).forEach(key => {
                    if (except !== key && dropdowns[key].menu) {
                        dropdowns[key].menu.classList.remove('show');
                    }
                });
            }

            function toggleDropdown(name) {
                const dropdown = dropdowns[name];
                if (!dropdown.btn || !dropdown.menu) return;

                if (dropdown.menu.classList.contains('show')) {
                    dropdown.menu.classList.remove('show');
                } else {
                    closeAllDropdowns(name);
                    dropdown.menu.classList.add('show');
                }
            }

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

            document.addEventListener('click', function(e) {
                let clickedInsideDropdown = false;
                
                Object.keys(dropdowns).forEach(key => {
                    const dropdown = dropdowns[key];
                    if (dropdown.menu && dropdown.menu.contains(e.target)) {
                        clickedInsideDropdown = true;
                    }
                    if (dropdown.btn && dropdown.btn.contains(e.target)) {
                        clickedInsideDropdown = true;
                    }
                });

                if (!clickedInsideDropdown) {
                    closeAllDropdowns();
                }
            });

            // ===== Поддержка =====
            
            // Переключение вкладок
            const tabs = document.querySelectorAll('.tab-btn');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Здесь можно фильтровать тикеты
                    alert(`Фильтр: ${this.dataset.tab} тикеты`);
                });
            });

            // Выбор тикета
            const ticketItems = document.querySelectorAll('.ticket-item');
            
            ticketItems.forEach(item => {
                item.addEventListener('click', function() {
                    ticketItems.forEach(t => t.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Здесь можно загрузить данные выбранного тикета
                    const ticketTitle = this.querySelector('.ticket-title').textContent;
                    document.querySelector('.detail-title').textContent = ticketTitle;
                });
            });

            // Модальное окно
            const modal = document.getElementById('ticketModal');
            const newTicketBtn = document.getElementById('newTicketBtn');
            const closeModal = document.getElementById('closeModal');
            const cancelModal = document.getElementById('cancelModal');

            newTicketBtn.addEventListener('click', function() {
                modal.classList.add('show');
            });

            function closeModalFunc() {
                modal.classList.remove('show');
            }

            closeModal.addEventListener('click', closeModalFunc);
            cancelModal.addEventListener('click', closeModalFunc);

            // Закрытие модалки при клике вне
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModalFunc();
                }
            });

            // Поиск по тикетам
            const searchInput = document.getElementById('ticketSearch');
            
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                
                ticketItems.forEach(item => {
                    const title = item.querySelector('.ticket-title').textContent.toLowerCase();
                    const customer = item.querySelector('.ticket-customer').textContent.toLowerCase();
                    const id = item.querySelector('.ticket-id').textContent.toLowerCase();
                    
                    if (title.includes(searchText) || customer.includes(searchText) || id.includes(searchText)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            // Фильтр по приоритету
            const priorityFilter = document.getElementById('priorityFilter');
            
            priorityFilter.addEventListener('change', function() {
                const priority = this.value;
                
                ticketItems.forEach(item => {
                    if (priority === 'all') {
                        item.style.display = '';
                        return;
                    }
                    
                    const priorityElement = item.querySelector('.ticket-priority');
                    if (priorityElement) {
                        const priorityClass = priorityElement.classList;
                        if (priority === 'high' && priorityClass.contains('priority-high')) {
                            item.style.display = '';
                        } else if (priority === 'medium' && priorityClass.contains('priority-medium')) {
                            item.style.display = '';
                        } else if (priority === 'low' && priorityClass.contains('priority-low')) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });

            // Отправка ответа
            const sendButtons = document.querySelectorAll('.btn-primary, .btn-success');
            
            sendButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const textarea = document.querySelector('.reply-textarea');
                    if (textarea.value.trim() === '') {
                        alert('Напишите текст ответа');
                        return;
                    }
                    
                    alert('Ответ отправлен');
                    textarea.value = '';
                    
                    if (btn.classList.contains('btn-success')) {
                        setTimeout(() => {
                            alert('Тикет закрыт');
                        }, 500);
                    }
                });
            });

            // Шаблоны ответов
            document.querySelectorAll('.btn-outline').forEach(btn => {
                if (btn.textContent.includes('Благодарим') || 
                    btn.textContent.includes('Проблема') || 
                    btn.textContent.includes('Запрос') || 
                    btn.textContent.includes('Инструкция')) {
                    
                    btn.addEventListener('click', function() {
                        const textarea = document.querySelector('.reply-textarea');
                        textarea.value = this.textContent + ':\n\n' + textarea.value;
                    });
                }
            });

            // Мобильное меню
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const menuToggle = document.getElementById('menuToggle');
            const closeSidebar = document.getElementById('closeSidebar');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    sidebar.classList.add('active');
                    overlay.classList.add('active');
                    closeAllDropdowns();
                });
            }
            
            if (closeSidebar) {
                closeSidebar.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
            
            if (overlay) {
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    closeAllDropdowns();
                });
            }
            
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && sidebar) {
                    sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                }
            });

            // Выход
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Вы уверены, что хотите выйти?')) {
                        alert('Выход из системы');
                    }
                });
            }
        });