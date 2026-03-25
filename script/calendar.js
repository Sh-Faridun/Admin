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

            // ===== Календарь =====
            const currentDate = new Date();
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();
            let currentView = 'month'; // month, week, day
            let selectedDate = new Date();

            // Элементы
            const monthView = document.getElementById('monthView');
            const weekView = document.getElementById('weekView');
            const dayView = document.getElementById('dayView');
            const monthGrid = document.getElementById('monthGrid');
            const weekHeader = document.getElementById('weekHeader');
            const weekGrid = document.getElementById('weekGrid');
            const dayHeader = document.getElementById('dayHeader');
            const dayGrid = document.getElementById('dayGrid');
            const currentMonthYear = document.getElementById('currentMonthYear');
            const miniMonthYear = document.getElementById('miniMonthYear');
            const miniDays = document.getElementById('miniDays');
            const viewBtns = document.querySelectorAll('.view-btn');

            // События (пример)
            let events = [
                {
                    id: 1,
                    title: 'Встреча с командой',
                    date: '2026-03-15',
                    time: '10:00',
                    color: 'blue',
                    description: 'Обсуждение нового проекта'
                },
                {
                    id: 2,
                    title: 'Презентация клиенту',
                    date: '2026-03-16',
                    time: '14:30',
                    color: 'green',
                    description: 'Презентация нового дизайна'
                },
                {
                    id: 3,
                    title: 'Дедлайн отчета',
                    date: '2026-03-20',
                    time: '18:00',
                    color: 'orange',
                    description: 'Сдать отчет за март'
                },
                {
                    id: 4,
                    title: 'Корпоратив',
                    date: '2026-03-25',
                    time: '19:00',
                    color: 'pink',
                    description: 'Вечеринка в честь дня рождения компании'
                }
            ];

            // Названия месяцев
            const monthNames = [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ];

            // Названия дней недели
            const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            const fullDayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

            // Обновление календаря
            function renderCalendar() {
                updateMonthYear();
                renderMiniCalendar();
                
                if (currentView === 'month') {
                    renderMonthView();
                } else if (currentView === 'week') {
                    renderWeekView();
                } else if (currentView === 'day') {
                    renderDayView();
                }
            }

            // Обновление заголовка с месяцем/годом
            function updateMonthYear() {
                currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
                miniMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            }

            // Миникалендарь
            function renderMiniCalendar() {
                const firstDay = new Date(currentYear, currentMonth, 1);
                const lastDay = new Date(currentYear, currentMonth + 1, 0);
                const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Пн = 0
                const totalDays = lastDay.getDate();
                
                let html = '';
                
                // Пустые ячейки перед первым днем
                for (let i = 0; i < startingDay; i++) {
                    html += '<div class="mini-day"></div>';
                }
                
                // Дни месяца
                for (let day = 1; day <= totalDays; day++) {
                    const isToday = currentYear === new Date().getFullYear() && 
                                   currentMonth === new Date().getMonth() && 
                                   day === new Date().getDate();
                    
                    const hasEvent = events.some(e => {
                        const eventDate = new Date(e.date);
                        return eventDate.getDate() === day && 
                               eventDate.getMonth() === currentMonth && 
                               eventDate.getFullYear() === currentYear;
                    });
                    
                    const classes = [];
                    if (isToday) classes.push('today');
                    if (hasEvent) classes.push('has-event');
                    if (selectedDate && selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth && 
                        selectedDate.getFullYear() === currentYear) {
                        classes.push('active');
                    }
                    
                    html += `<div class="mini-day ${classes.join(' ')}" data-day="${day}" data-month="${currentMonth}" data-year="${currentYear}">${day}</div>`;
                }
                
                miniDays.innerHTML = html;
                
                // Добавляем обработчики на дни
                document.querySelectorAll('.mini-day[data-day]').forEach(day => {
                    day.addEventListener('click', function() {
                        const dayNum = this.dataset.day;
                        const monthNum = this.dataset.month;
                        const yearNum = this.dataset.year;
                        
                        // Убираем активный класс у всех
                        document.querySelectorAll('.mini-day.active').forEach(d => d.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Выбираем этот день
                        selectedDate = new Date(yearNum, monthNum, dayNum);
                        
                        // Переключаемся на дневной вид
                        switchView('day');
                    });
                });
            }

            // Месячный вид
            function renderMonthView() {
                const firstDay = new Date(currentYear, currentMonth, 1);
                const lastDay = new Date(currentYear, currentMonth + 1, 0);
                const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const totalDays = lastDay.getDate();
                
                const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
                
                let html = '';
                
                // Дни предыдущего месяца
                for (let i = startingDay - 1; i >= 0; i--) {
                    const day = prevMonthLastDay - i;
                    html += `<div class="month-day other-month"><div class="day-number">${day}</div><div class="day-events"></div></div>`;
                }
                
                // Текущий месяц
                for (let day = 1; day <= totalDays; day++) {
                    const isToday = currentYear === new Date().getFullYear() && 
                                   currentMonth === new Date().getMonth() && 
                                   day === new Date().getDate();
                    
                    const dayEvents = events.filter(e => {
                        const eventDate = new Date(e.date);
                        return eventDate.getDate() === day && 
                               eventDate.getMonth() === currentMonth && 
                               eventDate.getFullYear() === currentYear;
                    });
                    
                    let eventsHtml = '';
                    dayEvents.forEach(event => {
                        eventsHtml += `<div class="calendar-event event-${event.color}" draggable="true" data-event-id="${event.id}">${event.time ? event.time + ' ' : ''}${event.title}</div>`;
                    });
                    
                    html += `<div class="month-day ${isToday ? 'today' : ''}" data-day="${day}"><div class="day-number">${day}</div><div class="day-events">${eventsHtml}</div></div>`;
                }
                
                // Дни следующего месяца
                const totalCells = 42; // 6 недель * 7 дней
                const remainingCells = totalCells - (startingDay + totalDays);
                for (let day = 1; day <= remainingCells; day++) {
                    html += `<div class="month-day other-month"><div class="day-number">${day}</div><div class="day-events"></div></div>`;
                }
                
                monthGrid.innerHTML = html;
                
                // Добавляем обработчики для drag & drop
                initDragAndDrop();
                
                // Добавляем обработчики клика на ячейки
                document.querySelectorAll('.month-day[data-day]').forEach(cell => {
                    cell.addEventListener('click', function(e) {
                        if (e.target.classList.contains('calendar-event')) return;
                        
                        const day = this.dataset.day;
                        document.getElementById('eventDate').value = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        document.getElementById('eventModal').classList.add('show');
                    });
                });
            }

            // Недельный вид
            function renderWeekView() {
                // Получаем первый день недели (понедельник)
                const firstDayOfWeek = new Date(currentYear, currentMonth, 1);
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() === 0 ? 6 : firstDayOfWeek.getDay() - 1));
                
                // Заголовок недели
                let headerHtml = '<div class="week-time-gutter"></div>';
                for (let i = 0; i < 7; i++) {
                    const day = new Date(firstDayOfWeek);
                    day.setDate(firstDayOfWeek.getDate() + i);
                    
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    headerHtml += `
                        <div class="week-day ${isToday ? 'today' : ''}">
                            <div class="week-day-name">${fullDayNames[i]}</div>
                            <div class="week-day-date">${day.getDate()} ${monthNames[day.getMonth()].slice(0,3)}</div>
                        </div>
                    `;
                }
                weekHeader.innerHTML = headerHtml;
                
                // Сетка по часам
                let gridHtml = '';
                for (let hour = 8; hour <= 20; hour++) {
                    gridHtml += `<div class="week-time-slot">${hour}:00</div>`;
                    
                    for (let day = 0; day < 7; day++) {
                        const dayDate = new Date(firstDayOfWeek);
                        dayDate.setDate(firstDayOfWeek.getDate() + day);
                        
                        // Проверяем события в этот день и час
                        const dayEvents = events.filter(e => {
                            const eventDate = new Date(e.date);
                            return eventDate.toDateString() === dayDate.toDateString() && 
                                   e.time && parseInt(e.time) === hour;
                        });
                        
                        let eventsHtml = '';
                        dayEvents.forEach(event => {
                            eventsHtml += `<div class="calendar-event event-${event.color}" draggable="true" data-event-id="${event.id}">${event.title}</div>`;
                        });
                        
                        gridHtml += `<div class="week-cell" data-date="${dayDate.toISOString().split('T')[0]}" data-hour="${hour}">${eventsHtml}</div>`;
                    }
                }
                weekGrid.innerHTML = gridHtml;
                
                initDragAndDrop();
            }

            // Дневной вид
            function renderDayView() {
                if (!selectedDate) selectedDate = new Date();
                
                const day = selectedDate.getDate();
                const month = selectedDate.getMonth();
                const year = selectedDate.getFullYear();
                
                dayHeader.innerHTML = `
                    <h2>${day} ${monthNames[month]} ${year}</h2>
                    <p>${fullDayNames[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]}</p>
                `;
                
                let gridHtml = '';
                for (let hour = 0; hour < 24; hour++) {
                    const timeStr = `${String(hour).padStart(2, '0')}:00`;
                    
                    // Проверяем события в этот час
                    const dayEvents = events.filter(e => {
                        const eventDate = new Date(e.date);
                        return eventDate.getDate() === day && 
                               eventDate.getMonth() === month && 
                               eventDate.getFullYear() === year && 
                               e.time && parseInt(e.time) === hour;
                    });
                    
                    let eventsHtml = '';
                    dayEvents.forEach(event => {
                        eventsHtml += `<div class="calendar-event event-${event.color}" draggable="true" data-event-id="${event.id}">${event.title}</div>`;
                    });
                    
                    gridHtml += `
                        <div class="day-hour-row">
                            <div class="hour-label">${timeStr}</div>
                            <div class="hour-cell" data-hour="${hour}">${eventsHtml}</div>
                        </div>
                    `;
                }
                dayGrid.innerHTML = gridHtml;
                
                initDragAndDrop();
            }

            // Переключение видов
            function switchView(view) {
                currentView = view;
                
                // Обновляем активную кнопку
                viewBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.view === view);
                });
                
                // Показываем нужный вид
                monthView.style.display = view === 'month' ? 'block' : 'none';
                weekView.style.display = view === 'week' ? 'block' : 'none';
                dayView.style.display = view === 'day' ? 'block' : 'none';
                
                renderCalendar();
            }

            // Drag & drop
            function initDragAndDrop() {
                const draggables = document.querySelectorAll('[draggable="true"]');
                const dropZones = document.querySelectorAll('.month-day, .week-cell, .hour-cell');
                
                draggables.forEach(draggable => {
                    draggable.addEventListener('dragstart', function(e) {
                        this.classList.add('dragging');
                        e.dataTransfer.setData('text/plain', this.dataset.eventId || this.dataset.task);
                    });
                    
                    draggable.addEventListener('dragend', function(e) {
                        this.classList.remove('dragging');
                    });
                });
                
                dropZones.forEach(zone => {
                    zone.addEventListener('dragover', function(e) {
                        e.preventDefault();
                        this.classList.add('drag-over');
                    });
                    
                    zone.addEventListener('dragleave', function() {
                        this.classList.remove('drag-over');
                    });
                    
                    zone.addEventListener('drop', function(e) {
                        e.preventDefault();
                        this.classList.remove('drag-over');
                        
                        const eventId = e.dataTransfer.getData('text/plain');
                        if (eventId) {
                            // Перемещение события
                            const event = events.find(e => e.id == eventId);
                            if (event) {
                                // Получаем новую дату
                                let newDate;
                                if (this.dataset.date) {
                                    newDate = new Date(this.dataset.date);
                                } else if (this.dataset.day) {
                                    newDate = new Date(currentYear, currentMonth, this.dataset.day);
                                } else {
                                    return;
                                }
                                
                                // Обновляем дату события
                                event.date = newDate.toISOString().split('T')[0];
                                
                                // Если есть час, обновляем время
                                if (this.dataset.hour) {
                                    event.time = `${String(this.dataset.hour).padStart(2, '0')}:00`;
                                }
                                
                                renderCalendar();
                            }
                        }
                    });
                });
            }

            // Чекбоксы задач
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', function() {
                    this.classList.toggle('checked');
                    const taskTitle = this.closest('.task-item').querySelector('.task-title');
                    taskTitle.classList.toggle('checked');
                });
            });

            // Переключение месяцев
            document.getElementById('prevMonth').addEventListener('click', () => {
                if (currentMonth === 0) {
                    currentMonth = 11;
                    currentYear--;
                } else {
                    currentMonth--;
                }
                renderCalendar();
            });

            document.getElementById('nextMonth').addEventListener('click', () => {
                if (currentMonth === 11) {
                    currentMonth = 0;
                    currentYear++;
                } else {
                    currentMonth++;
                }
                renderCalendar();
            });

            document.getElementById('miniPrev').addEventListener('click', () => {
                if (currentMonth === 0) {
                    currentMonth = 11;
                    currentYear--;
                } else {
                    currentMonth--;
                }
                renderCalendar();
            });

            document.getElementById('miniNext').addEventListener('click', () => {
                if (currentMonth === 11) {
                    currentMonth = 0;
                    currentYear++;
                } else {
                    currentMonth++;
                }
                renderCalendar();
            });

            document.getElementById('todayBtn').addEventListener('click', () => {
                currentMonth = new Date().getMonth();
                currentYear = new Date().getFullYear();
                selectedDate = new Date();
                renderCalendar();
                switchView('month');
            });

            // Переключение видов
            viewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    switchView(btn.dataset.view);
                });
            });

            // Модальное окно
            const modal = document.getElementById('eventModal');
            const addEventBtn = document.getElementById('addEventBtn');
            const closeModal = document.getElementById('closeModal');
            const cancelModal = document.getElementById('cancelModal');
            const saveEvent = document.getElementById('saveEvent');
            const colorOptions = document.querySelectorAll('.color-option');

            addEventBtn.addEventListener('click', () => {
                // Устанавливаем сегодняшнюю дату по умолчанию
                const today = new Date();
                document.getElementById('eventDate').value = today.toISOString().split('T')[0];
                document.getElementById('eventTime').value = '12:00';
                document.getElementById('eventTitle').value = '';
                document.getElementById('eventDescription').value = '';
                
                // Сбрасываем выбранный цвет
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                document.querySelector('.color-blue').classList.add('selected');
                
                modal.classList.add('show');
            });

            function closeModalFunc() {
                modal.classList.remove('show');
            }

            closeModal.addEventListener('click', closeModalFunc);
            cancelModal.addEventListener('click', closeModalFunc);

            // Выбор цвета
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Сохранение события
            saveEvent.addEventListener('click', () => {
                const title = document.getElementById('eventTitle').value;
                const date = document.getElementById('eventDate').value;
                const time = document.getElementById('eventTime').value;
                const description = document.getElementById('eventDescription').value;
                const selectedColor = document.querySelector('.color-option.selected').dataset.color;

                if (!title || !date) {
                    alert('Заполните название и дату события');
                    return;
                }

                // Создаем новое событие
                const newEvent = {
                    id: events.length + 1,
                    title,
                    date,
                    time,
                    color: selectedColor,
                    description
                };

                events.push(newEvent);
                renderCalendar();
                closeModalFunc();
            });

            // Закрытие модалки при клике вне
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModalFunc();
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

            // Инициализация
            renderCalendar();
        });