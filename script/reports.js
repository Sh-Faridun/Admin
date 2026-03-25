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

            // ===== Отчеты =====
            
            // Переключение вкладок
            const tabs = document.querySelectorAll('.tab-btn');
            const templatesTab = document.getElementById('templatesTab');
            const savedTab = document.getElementById('savedTab');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (this.dataset.tab === 'templates') {
                        templatesTab.style.display = 'grid';
                        savedTab.style.display = 'none';
                    } else if (this.dataset.tab === 'saved') {
                        templatesTab.style.display = 'none';
                        savedTab.style.display = 'block';
                    }
                });
            });

            // Графики
            // Линейный график продаж
            const salesCtx = document.getElementById('salesChart').getContext('2d');
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['1 мар', '2 мар', '3 мар', '4 мар', '5 мар', '6 мар', '7 мар', '8 мар', '9 мар', '10 мар'],
                    datasets: [{
                        label: 'Продажи 2026',
                        data: [12450, 14320, 13100, 17850, 16200, 19880, 18760, 15120, 17360, 20440],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            // Круговая диаграмма категорий
            const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
            new Chart(categoriesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Электроника', 'Одежда', 'Книги', 'Дом', 'Спорт'],
                    datasets: [{
                        data: [45, 25, 15, 10, 5],
                        backgroundColor: ['#4361ee', '#f72585', '#4cc9f0', '#f8961e', '#00b894'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Столбчатая диаграмма товаров
            const productsCtx = document.getElementById('productsChart').getContext('2d');
            new Chart(productsCtx, {
                type: 'bar',
                data: {
                    labels: ['iPhone 15', 'MacBook Pro', 'AirPods', 'iPad Pro', 'Samsung S24', 'Watch Ultra', 'Sony WH', 'Dell XPS'],
                    datasets: [{
                        label: 'Продажи, $',
                        data: [12990, 8490, 4990, 3990, 2990, 1990, 990, 790],
                        backgroundColor: '#4361ee',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            // Экспорт в Excel
            document.getElementById('exportExcelBtn').addEventListener('click', function() {
                alert('Экспорт в Excel: отчет будет скачан');
            });

            // Экспорт в CSV
            document.getElementById('exportCSVBtn').addEventListener('click', function() {
                alert('Экспорт в CSV: отчет будет скачан');
            });

            // Печать
            document.getElementById('printBtn').addEventListener('click', function() {
                window.print();
            });

            // Модальное окно
            const modal = document.getElementById('reportModal');
            const generateBtn = document.getElementById('generateReportBtn');
            const closeModal = document.getElementById('closeModal');
            const cancelModal = document.getElementById('cancelModal');
            const generateModalBtn = document.getElementById('generateModalBtn');

            generateBtn.addEventListener('click', function() {
                modal.classList.add('show');
            });

            function closeModalFunc() {
                modal.classList.remove('show');
            }

            closeModal.addEventListener('click', closeModalFunc);
            cancelModal.addEventListener('click', closeModalFunc);

            generateModalBtn.addEventListener('click', function() {
                const reportName = document.getElementById('reportName').value || 'Новый отчет';
                alert(`Отчет "${reportName}" создан и готов к скачиванию`);
                closeModalFunc();
            });

            // Выбор шаблона
            document.querySelectorAll('.template-card').forEach(card => {
                card.addEventListener('click', function() {
                    const template = this.dataset.template;
                    document.getElementById('modalReportType').value = 
                        this.querySelector('.template-title').textContent;
                    modal.classList.add('show');
                });
            });

            // Применить фильтры
            document.getElementById('applyFilters').addEventListener('click', function() {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                const type = document.getElementById('reportType').value;
                alert(`Фильтры применены: ${startDate} - ${endDate}, ${type}`);
            });

            // Действия с сохраненными отчетами
            document.querySelectorAll('.report-btn .fa-eye').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('Просмотр отчета');
                });
            });

            document.querySelectorAll('.report-btn .fa-download').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('Скачивание отчета');
                });
            });

            document.querySelectorAll('.report-btn .fa-trash').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Удалить отчет?')) {
                        this.closest('.report-item').remove();
                    }
                });
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