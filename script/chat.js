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

            // ===== Чат функционал =====
            
            // Переключение контактов
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                item.addEventListener('click', function() {
                    contactItems.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Здесь можно загрузить историю чата для выбранного контакта
                    const userName = this.querySelector('.contact-name').textContent;
                    document.querySelector('.chat-user-details h4').textContent = userName;
                });
            });

            // Отправка сообщения
            const messageInput = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendMessage');
            const messagesContainer = document.getElementById('messagesContainer');

            function sendMessage() {
                const text = messageInput.value.trim();
                if (text === '') return;

                const messageHTML = `
                    <div class="message outgoing">
                        <div class="message-content">
                            <div class="message-bubble">
                                <div class="message-text">${text}</div>
                            </div>
                            <span class="message-time">только что</span>
                        </div>
                    </div>
                `;

                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                messageInput.value = '';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Эмодзи
            const emojiBtn = document.getElementById('emojiBtn');
            const emojiPanel = document.getElementById('emojiPanel');
            const emojiItems = document.querySelectorAll('.emoji-item');

            emojiBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                emojiPanel.classList.toggle('show');
            });

            emojiItems.forEach(emoji => {
                emoji.addEventListener('click', function() {
                    messageInput.value += this.textContent;
                    messageInput.focus();
                    emojiPanel.classList.remove('show');
                });
            });

            // Закрыть панель эмодзи при клике вне
            document.addEventListener('click', function(e) {
                if (!emojiBtn.contains(e.target) && !emojiPanel.contains(e.target)) {
                    emojiPanel.classList.remove('show');
                }
            });

            // Загрузка файла
            const attachBtn = document.getElementById('attachFile');
            attachBtn.addEventListener('click', function() {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.click();
                
                fileInput.addEventListener('change', function() {
                    if (fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        const fileSize = (file.size / 1024 / 1024).toFixed(1);
                        
                        const messageHTML = `
                            <div class="message outgoing">
                                <div class="message-content">
                                    <div class="message-bubble">
                                        <div class="message-text">Отправил(а) файл</div>
                                        <div class="message-file">
                                            <i class="fas fa-file"></i>
                                            <div class="file-info">
                                                <div class="file-name">${file.name}</div>
                                                <div class="file-size">${fileSize} MB</div>
                                            </div>
                                            <i class="fas fa-download file-download"></i>
                                        </div>
                                    </div>
                                    <span class="message-time">только что</span>
                                </div>
                            </div>
                        `;
                        
                        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                });
            });

            // Скачивание файла (пример)
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('fa-download') || e.target.classList.contains('file-download')) {
                    alert('Скачивание файла...');
                }
            });

            // Поиск в контактах
            const searchInput = document.querySelector('.contacts-search input');
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                contactItems.forEach(item => {
                    const name = item.querySelector('.contact-name').textContent.toLowerCase();
                    if (name.includes(searchText)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
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