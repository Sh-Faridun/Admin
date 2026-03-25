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

            // ===== Файловый менеджер =====
            
            // Переключение вида сетка/список
            const viewBtns = document.querySelectorAll('.view-btn');
            const filesGrid = document.getElementById('filesGrid');
            const filesList = document.getElementById('filesList');

            viewBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    viewBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (this.dataset.view === 'grid') {
                        filesGrid.style.display = 'grid';
                        filesList.classList.remove('show');
                    } else {
                        filesGrid.style.display = 'none';
                        filesList.classList.add('show');
                    }
                });
            });

            // Выбор файлов
            function handleFileSelect(element) {
                if (element.classList.contains('file-card') || element.classList.contains('list-item')) {
                    element.classList.toggle('selected');
                    
                    // Обновляем чекбокс
                    const checkbox = element.querySelector('.file-checkbox, .list-checkbox');
                    if (checkbox) {
                        // Визуально чекбокс обновляется через CSS
                    }
                }
            }

            document.querySelectorAll('.file-card, .list-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    // Не выделять при клике на кнопки действий
                    if (e.target.closest('.list-action-btn')) return;
                    
                    handleFileSelect(this);
                });
            });

            // Поиск файлов
            const searchInput = document.getElementById('fileSearch');
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                
                document.querySelectorAll('.file-card, .list-item').forEach(item => {
                    const name = item.dataset.name.toLowerCase();
                    if (name.includes(searchText)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            // Фильтр по типу
            const typeFilter = document.getElementById('typeFilter');
            typeFilter.addEventListener('change', function() {
                const filterType = this.value;
                
                document.querySelectorAll('.file-card, .list-item').forEach(item => {
                    if (filterType === 'all' || item.dataset.type === filterType) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            // Сортировка
            const sortFilter = document.getElementById('sortFilter');
            sortFilter.addEventListener('change', function() {
                const sortBy = this.value;
                const grid = document.getElementById('filesGrid');
                const items = Array.from(document.querySelectorAll('.file-card'));
                
                items.sort((a, b) => {
                    const aName = a.dataset.name;
                    const bName = b.dataset.name;
                    const aDate = new Date(a.dataset.date);
                    const bDate = new Date(b.dataset.date);
                    const aSize = parseFloat(a.dataset.size) || 0;
                    const bSize = parseFloat(b.dataset.size) || 0;
                    
                    switch(sortBy) {
                        case 'name':
                            return aName.localeCompare(bName);
                        case 'date':
                            return bDate - aDate;
                        case 'size':
                            return bSize - aSize;
                        case 'type':
                            return (a.dataset.type || '').localeCompare(b.dataset.type || '');
                        default:
                            return 0;
                    }
                });
                
                items.forEach(item => grid.appendChild(item));
            });

            // Предпросмотр изображений
            const previewModal = document.getElementById('previewModal');
            const previewTitle = document.getElementById('previewTitle');
            const previewImage = document.getElementById('previewImage');
            const closePreview = document.getElementById('closePreview');

            document.querySelectorAll('[data-type="image"]').forEach(item => {
                item.addEventListener('dblclick', function() {
                    const name = this.dataset.name;
                    previewTitle.textContent = name;
                    previewImage.src = `https://placehold.co/800x600/4361ee/white?text=${name}`;
                    previewModal.classList.add('show');
                });
            });

            closePreview.addEventListener('click', function() {
                previewModal.classList.remove('show');
            });

            // Загрузка файлов
            const uploadModal = document.getElementById('uploadModal');
            const uploadBtn = document.getElementById('uploadBtn');
            const closeUpload = document.getElementById('closeUpload');
            const cancelUpload = document.getElementById('cancelUpload');
            const uploadArea = document.getElementById('uploadArea');

            uploadBtn.addEventListener('click', function() {
                uploadModal.classList.add('show');
            });

            function closeUploadModal() {
                uploadModal.classList.remove('show');
            }

            closeUpload.addEventListener('click', closeUploadModal);
            cancelUpload.addEventListener('click', closeUploadModal);

            // Drag & drop загрузка
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = 'var(--primary)';
                this.style.background = 'var(--light)';
            });

            uploadArea.addEventListener('dragleave', function() {
                this.style.borderColor = '';
                this.style.background = '';
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '';
                this.style.background = '';
                
                const files = e.dataTransfer.files;
                alert(`Загружено ${files.length} файлов`);
                // Здесь можно добавить реальную загрузку
            });

            uploadArea.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.click();
                
                input.addEventListener('change', function() {
                    alert(`Выбрано ${this.files.length} файлов`);
                });
            });

            // Контекстное меню
            const contextMenu = document.getElementById('contextMenu');
            
            document.querySelectorAll('.file-card, .list-item').forEach(item => {
                item.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = e.pageX + 'px';
                    contextMenu.style.top = e.pageY + 'px';
                    contextMenu.classList.add('show');
                    
                    // Выделяем файл
                    handleFileSelect(this);
                });
            });

            document.addEventListener('click', function() {
                contextMenu.classList.remove('show');
            });

            // Действия с файлами
            document.querySelectorAll('.list-action-btn .fa-trash, .context-menu-item.delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Удалить этот файл?')) {
                        alert('Файл удален');
                    }
                });
            });

            document.querySelectorAll('.list-action-btn .fa-download, .context-menu-item .fa-download').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('Скачивание файла...');
                });
            });

            document.querySelectorAll('.list-action-btn .fa-eye, .context-menu-item .fa-eye').forEach(btn => {
                btn.addEventListener('click', function() {
                    const item = this.closest('[data-type]');
                    if (item && item.dataset.type === 'image') {
                        previewModal.classList.add('show');
                    } else {
                        alert('Предпросмотр недоступен для этого типа файлов');
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