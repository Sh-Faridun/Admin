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

            // ===== Платежи =====
            
            // Переключение вкладок
            const tabs = document.querySelectorAll('.tab-btn');
            const transactionsTab = document.getElementById('transactionsTab');
            const invoicesTab = document.getElementById('invoicesTab');
            const disputesTab = document.getElementById('disputesTab');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (this.dataset.tab === 'transactions') {
                        transactionsTab.style.display = 'block';
                        invoicesTab.style.display = 'none';
                        disputesTab.style.display = 'none';
                    } else if (this.dataset.tab === 'invoices') {
                        transactionsTab.style.display = 'none';
                        invoicesTab.style.display = 'grid';
                        disputesTab.style.display = 'none';
                    } else if (this.dataset.tab === 'disputes') {
                        transactionsTab.style.display = 'none';
                        invoicesTab.style.display = 'none';
                        disputesTab.style.display = 'block';
                    }
                });
            });

            // Графики
            // Доход по дням
            const incomeCtx = document.getElementById('incomeChart').getContext('2d');
            new Chart(incomeCtx, {
                type: 'line',
                data: {
                    labels: ['1 мар', '3 мар', '5 мар', '7 мар', '9 мар', '11 мар', '13 мар', '15 мар'],
                    datasets: [{
                        label: 'Доход',
                        data: [12450, 14320, 16200, 18760, 17360, 20440, 19880, 22450],
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

            // Платежные системы
            const paymentCtx = document.getElementById('paymentChart').getContext('2d');
            new Chart(paymentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Visa/Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
                    datasets: [{
                        data: [55, 25, 12, 8],
                        backgroundColor: ['#4361ee', '#f72585', '#4cc9f0', '#f8961e'],
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

            // Модальное окно инвойса
            const modal = document.getElementById('invoiceModal');
            const closeModal = document.getElementById('closeModal');

            // Открытие инвойса
            document.querySelectorAll('.invoice-card .btn-outline:first-child').forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.classList.add('show');
                });
            });

            document.querySelectorAll('.action-btn .fa-eye').forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.classList.add('show');
                });
            });

            closeModal.addEventListener('click', function() {
                modal.classList.remove('show');
            });

            // Закрытие модалки при клике вне
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });

            // Возвраты
            document.querySelectorAll('.action-btn.refund').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Оформить возврат по этой транзакции?')) {
                        alert('Запрос на возврат отправлен');
                    }
                });
            });

            // Экспорт
            document.querySelectorAll('.btn-outline .fa-file-excel, .btn-outline .fa-file-pdf').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('Экспорт данных');
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