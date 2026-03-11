const STORAGE_KEY = 'studyTrackerData';
const ROUTINE_STORAGE_KEY = 'studyTrackerRoutine';
const HABITS_STORAGE_KEY = 'studyTrackerHabits';
const LANG_KEY = 'studyTrackerLang';

// --- Translations ---
const translations = {
    en: {
        app_title: "Study Tracker | POJ",
        dashboard: "Dashboard",
        daily_habits: "Daily Habits",
        daily_routine: "Daily Routine",
        subjects: "SUBJECTS",
        your_subjects: "Your Subjects",
        new_subject: "New Subject",
        back_to_dashboard: "Back to Dashboard",
        subject_name_placeholder: "Subject Name",
        edit_name: "Edit Name",
        course_progress: "Course Progress",
        prev_day: "Previous Day",
        today: "Today",
        next_day: "Next Day",
        add_new_habit: "Add a new habit",
        habit_placeholder: "e.g., Read 10 pages, Meditate",
        save: "Save",
        cancel: "Cancel",
        habit_name: "Habit Name",
        close_tracker: "Close Tracker",
        add_routine_task: "Add a routine task",
        routine_placeholder: "What's your daily routine?",
        add_new_subject_modal: "Add New Subject",
        subject_name_label: "Subject Name",
        subject_name_placeholder_input: "e.g., Machine Learning, Data Structures",
        duration: "Duration",
        standard_16_weeks: "Standard 16 Weeks",
        custom_duration: "Custom Duration",
        custom_weeks_placeholder: "Number of weeks (e.g., 8)",
        create: "Create",
        delete_subject_title: "Delete Subject?",
        delete_subject_desc: "Are you sure you want to delete this subject? All tasks and progress will be lost permanently.",
        delete: "Delete",
        delete_subject: "Delete Subject",
        add_a_task: "Add a task",
        what_needs_to_be_done: "What needs to be done?",
        edit_task: "Edit Task",
        delete_task: "Delete Task",
        delete_habit: "Delete Habit",
        lang_toggle: "UZ",
        // Dynamic JS Strings
        no_subjects: "No subjects yet. Click \"New Subject\" to get started!",
        weeks_completed: "{completed} / {total} weeks",
        week_num: "Week {num}",
        tasks_count: "{completed}/{total} tasks",
        tasks_zero: "0 tasks",
        yesterday: "Yesterday",
        habits_completed: "{completed} of {total} habits completed today",
        tasks_completed_summary: "Tasks completed: {completed} / {total}",
        tracker_stats: "Started on: {date} • Tracking for: {days} day{plural}",
        completed_status: "Completed",
        missed_status: "Missed",
        future_status: "Future",
        alert_invalid_weeks: "Please enter a valid positive number for weeks."
    },
    uz: {
        app_title: "Study Tracker | POJ",
        dashboard: "Bosh sahifa",
        daily_habits: "Kunlik odatlar",
        daily_routine: "Kunlik reja",
        subjects: "FANLAR",
        your_subjects: "Sizning fanlaringiz",
        new_subject: "Yangi fan",
        back_to_dashboard: "Bosh sahifaga qaytish",
        subject_name_placeholder: "Fan nomi",
        edit_name: "Nomini tahrirlash",
        course_progress: "Kurs jarayoni",
        prev_day: "Oldingi",
        today: "Bugun",
        next_day: "Keyingi",
        add_new_habit: "Yangi odat qo‘shish",
        habit_placeholder: "Masalan: 10 sahifa o'qish, Meditatsiya",
        save: "Saqlash",
        cancel: "Bekor qilish",
        habit_name: "Odat nomi",
        close_tracker: "Trekerni yopish",
        add_routine_task: "Kunlik vazifa qo‘shish",
        routine_placeholder: "Kunlik rejangiz qanday?",
        add_new_subject_modal: "Yangi fan qo'shish",
        subject_name_label: "Fan nomi",
        subject_name_placeholder_input: "Masalan: Machine Learning, Data Structures",
        duration: "Davomiyligi",
        standard_16_weeks: "Standart 16 hafta",
        custom_duration: "Boshqa davomiylik",
        custom_weeks_placeholder: "Haftalar soni (masalan, 8)",
        create: "Yaratish",
        delete_subject_title: "Fanni o'chirish?",
        delete_subject_desc: "Haqiqatan ham bu fanni o'chirmoqchimisiz? Barcha vazifalar va jarayon yo'qoladi.",
        delete: "O'chirish",
        delete_subject: "Fanni o'chirish",
        add_a_task: "Vazifa qo'shish",
        what_needs_to_be_done: "Nima qilish kerak?",
        edit_task: "Vazifani tahrirlash",
        delete_task: "Vazifani o'chirish",
        delete_habit: "Odatni o'chirish",
        lang_toggle: "EN",
        // Dynamic JS Strings
        no_subjects: "Hali fanlar yo'q. \"Yangi fan\" tugmasini bosib boshlang!",
        weeks_completed: "{completed} / {total} hafta",
        week_num: "{num}-hafta",
        tasks_count: "{completed}/{total} ta bildirishnoma", // Oops, tasks
        tasks_zero: "0 ta vazifa",
        yesterday: "Kecha",
        habits_completed: "Bugun {total} ta odatdan {completed} tasi bajarildi",
        tasks_completed_summary: "Bajarilgan vazifalar: {completed} / {total}",
        tracker_stats: "Boshlandi: {date} • Kuzatilmoqda: {days} kun",
        completed_status: "Bajarildi",
        missed_status: "Bajarilmadi",
        future_status: "Kelajak",
        alert_invalid_weeks: "Iltimos, haftalar uchun to'g'ri musbat son kiriting."
    }
};

// Fix translations typo
translations.uz.tasks_count = "{completed}/{total} ta vazifa";

// --- State ---
let subjects = [];
let routineTasks = {}; // Now a dictionary: { "YYYY-MM-DD": [tasks] }
let habitsData = { habits: [], history: {} };
let currentSubjectId = null;
let realTodayStr = ''; // Always represents today's actual date
let viewingDateStr = ''; // The date currently being viewed in Habits/Routine
let currentLang = 'en';

// --- DOM Elements ---
const views = {
    dashboard: document.getElementById('dashboard-view'),
    subject: document.getElementById('subject-view'),
    dailyRoutine: document.getElementById('daily-routine-view'),
    dailyHabits: document.getElementById('daily-habits-view')
};

const navDashboard = document.getElementById('nav-dashboard');
const navDailyHabits = document.getElementById('nav-daily-habits');
const navDailyRoutine = document.getElementById('nav-daily-routine');
const sidebarSubjectsList = document.getElementById('sidebar-subjects-list');

// Modals
const subjectsGrid = document.getElementById('subjects-grid');
const addSubjectBtn = document.getElementById('add-subject-btn');
const addSubjectModal = document.getElementById('add-subject-modal');
const newSubjectInput = document.getElementById('new-subject-input');
const durationRadios = document.querySelectorAll('input[name="subject-duration"]');
const customWeeksContainer = document.getElementById('custom-weeks-container');
const customWeeksInput = document.getElementById('custom-weeks-input');
const confirmAddSubjectBtn = document.getElementById('confirm-add-subject-btn');
const closeAddModalBtns = document.querySelectorAll('.close-modal-btn');

// Mobile Menu Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Language toggle button
const langToggleBtn = document.getElementById('lang-toggle-btn');

// --- Templates ---
const sidebarSubjectTemplate = document.getElementById('sidebar-subject-item-template');
const subjectCardTemplate = document.getElementById('subject-card-template');
const weekBlockTemplate = document.getElementById('week-block-template');
const taskItemTemplate = document.getElementById('task-item-template');
const habitCardTemplate = document.getElementById('habit-card-template');

// --- Subject View Elements ---
const backBtn = document.getElementById('back-btn');
const currentSubjectTitle = document.getElementById('current-subject-title');
const editSubjectTitleBtn = document.getElementById('edit-subject-title-btn');
const subjectProgressPercent = document.getElementById('subject-progress-percent');
const subjectProgressFill = document.getElementById('subject-progress-fill');
const weeksContainer = document.getElementById('weeks-container');

// --- Modal Elements ---
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const closeDeleteModalBtns = document.querySelectorAll('.close-delete-modal-btn');
const confirmDeleteSubjectBtn = document.getElementById('confirm-delete-subject-btn');
let subjectToDeleteId = null;

// --- Daily Habits Elements ---
const habitsDateDisplay = document.getElementById('habits-date-display');
const habitsPrevDayBtn = document.getElementById('habits-prev-day');
const habitsNextDayBtn = document.getElementById('habits-next-day');
const habitsTodayBtn = document.getElementById('habits-today-btn');
const habitsGrid = document.getElementById('habits-grid');
const habitsSummaryText = document.getElementById('habits-summary-text');
const addHabitBtn = document.getElementById('add-habit-btn');
const addHabitForm = document.getElementById('add-habit-form');
const habitInput = document.getElementById('habit-input');
const saveHabitBtn = document.getElementById('save-habit-btn');
const cancelHabitBtn = document.getElementById('cancel-habit-btn');
const habitTrackerContainer = document.getElementById('habit-tracker-container');
const trackerHabitName = document.getElementById('tracker-habit-name');
const trackerGrid = document.getElementById('tracker-grid');
const closeTrackerBtn = document.getElementById('close-tracker-btn');

// --- Daily Routine Elements ---
const routineDateDisplay = document.getElementById('routine-date-display');
const routinePrevDayBtn = document.getElementById('routine-prev-day');
const routineNextDayBtn = document.getElementById('routine-next-day');
const routineTodayBtn = document.getElementById('routine-today-btn');
const routineTasksList = document.getElementById('routine-tasks-list');
const addRoutineTaskBtn = document.getElementById('add-routine-task-btn');
const addRoutineForm = document.getElementById('add-routine-form');
const routineTaskInput = document.getElementById('routine-task-input');
const saveRoutineBtn = document.getElementById('save-routine-btn');
const cancelRoutineBtn = document.getElementById('cancel-routine-btn');

// --- Initialization ---
function init() {
    loadLanguage();
    updateCurrentDate();
    loadData();
    setupEventListeners();
    renderSidebarSubjects();
    renderDashboard();
    updateSidebarActiveState();
    applyLanguage(); // Apply language on load
}

function loadLanguage() {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }
}

function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    // Fallback to English
    return translations['en'][key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLang;

    // Update static HTML elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });

    // Update toggle button text
    if (langToggleBtn) {
        langToggleBtn.querySelector('.lang-text').textContent = t('lang_toggle');
    }

    // Re-render views if they depend on dynamic translations
    if (!views.dashboard.classList.contains('hidden')) renderDashboard();
    if (!views.dailyRoutine.classList.contains('hidden')) renderDailyRoutine();
    if (!views.dailyHabits.classList.contains('hidden')) renderDailyHabits();
    if (!views.subject.classList.contains('hidden') && currentSubjectId) renderSubjectView();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'uz' : 'en';
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
}

function updateCurrentDate() {
    const now = new Date();
    realTodayStr = formatDate(now);
    if (!viewingDateStr) {
        viewingDateStr = realTodayStr;
    }
}

function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function changeDateOffset(daysOffset) {
    const [year, month, day] = viewingDateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + daysOffset);
    viewingDateStr = formatDate(date);

    // Re-render the active view
    if (!views.dailyRoutine.classList.contains('hidden')) {
        renderDailyRoutine();
    } else if (!views.dailyHabits.classList.contains('hidden')) {
        renderDailyHabits();
        habitTrackerContainer.classList.add('hidden'); // Close tracker on date change
    }
}

function resetDateToToday() {
    viewingDateStr = realTodayStr;
    if (!views.dailyRoutine.classList.contains('hidden')) {
        renderDailyRoutine();
    } else if (!views.dailyHabits.classList.contains('hidden')) {
        renderDailyHabits();
        habitTrackerContainer.classList.add('hidden');
    }
}

function getFormattedDateDisplay(dateStr) {
    if (dateStr === realTodayStr) return t('today');

    // Check if it's yesterday
    const [tYear, tMonth, tDay] = realTodayStr.split('-').map(Number);
    const today = new Date(tYear, tMonth - 1, tDay);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === formatDate(yesterday)) return t('yesterday');

    // Otherwise return formatted date
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}


// --- Data Management ---
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        subjects = JSON.parse(data);
    } else {
        subjects = [];
    }
    const routineData = localStorage.getItem(ROUTINE_STORAGE_KEY);
    if (routineData) {
        const parsedData = JSON.parse(routineData);
        // Migration check: if it's an array, convert to date-indexed object for today
        if (Array.isArray(parsedData)) {
            routineTasks = {};
            if (parsedData.length > 0) {
                routineTasks[realTodayStr] = parsedData;
            }
            saveRoutineData(); // Save converted format
        } else {
            routineTasks = parsedData;
        }
    } else {
        routineTasks = {};
    }

    // Ensure array for today exists
    if (!routineTasks[realTodayStr]) {
        routineTasks[realTodayStr] = [];
    }

    const habitsDataStr = localStorage.getItem(HABITS_STORAGE_KEY);
    if (habitsDataStr) {
        habitsData = JSON.parse(habitsDataStr);
    } else {
        habitsData = { habits: [], history: {} };
    }
}

function saveRoutineData() {
    localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(routineTasks));
}

function saveHabitsData() {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitsData));
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    renderSidebarSubjects(); // Keep sidebar in sync with data changes like add/delete/rename
}

function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

function createNewSubject(name, weeksCount = 16) {
    const newSubject = {
        id: generateId('sub'),
        name: name,
        weeks: []
    };

    for (let i = 1; i <= weeksCount; i++) {
        newSubject.weeks.push({
            weekNumber: i,
            completed: false,
            collapsed: true,
            tasks: []
        });
    }

    return newSubject;
}

// --- Main Render Logic ---
function closeMobileSidebar() {
    if (sidebar && sidebarOverlay) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
}

function showView(viewName) {
    // Hide all
    Object.values(views).forEach(v => v.classList.add('hidden'));

    // Show requested
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
    }

    if (viewName === 'dashboard') {
        currentSubjectId = null;
        renderDashboard();
    } else if (viewName === 'dailyRoutine') {
        currentSubjectId = null;
        renderDailyRoutine();
    } else if (viewName === 'dailyHabits') {
        currentSubjectId = null;
        renderDailyHabits();
    }

    updateSidebarActiveState();
    closeMobileSidebar(); // Auto-close drawer on mobile after navigation
}

// --- Sidebar Render Logic ---
function renderSidebarSubjects() {
    sidebarSubjectsList.innerHTML = '';

    subjects.forEach(subject => {
        const itemNode = sidebarSubjectTemplate.content.cloneNode(true);
        const li = itemNode.querySelector('.sidebar-subject-item');

        li.dataset.id = subject.id;
        li.querySelector('.subject-name').textContent = subject.name;

        li.addEventListener('click', () => {
            openSubjectView(subject.id);
        });

        sidebarSubjectsList.appendChild(li);
    });

    updateSidebarActiveState();
}

function updateSidebarActiveState() {
    // Reset all
    navDashboard.classList.remove('active');
    navDailyRoutine.classList.remove('active');
    navDailyHabits.classList.remove('active');
    document.querySelectorAll('.sidebar-subject-item').forEach(li => {
        li.classList.remove('active');
    });

    if (!currentSubjectId && views.dashboard && !views.dashboard.classList.contains('hidden')) {
        navDashboard.classList.add('active');
    } else if (!currentSubjectId && views.dailyRoutine && !views.dailyRoutine.classList.contains('hidden')) {
        navDailyRoutine.classList.add('active');
    } else if (!currentSubjectId && views.dailyHabits && !views.dailyHabits.classList.contains('hidden')) {
        navDailyHabits.classList.add('active');
    } else if (currentSubjectId) {
        const activeItem = document.querySelector(`.sidebar-subject-item[data-id="${currentSubjectId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

function calculateProgress(subject) {
    const totalWeeks = subject.weeks.length || 1;
    const completedWeeks = subject.weeks.filter(w => w.completed).length;
    const percentage = Math.round((completedWeeks / totalWeeks) * 100);
    return { completedWeeks, percentage, totalWeeks };
}

// --- Dashboard Logic ---
function renderDashboard() {
    subjectsGrid.innerHTML = '';

    if (subjects.length === 0) {
        subjectsGrid.innerHTML = `<div style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
            ${t('no_subjects')}
        </div>`;
        return;
    }

    subjects.forEach(subject => {
        const { completedWeeks, percentage, totalWeeks } = calculateProgress(subject);

        const cardNode = subjectCardTemplate.content.cloneNode(true);
        const card = cardNode.querySelector('.subject-card');

        card.querySelector('.card-title').textContent = subject.name;
        card.querySelector('.weeks-completed-text').textContent = t('weeks_completed').replace('{completed}', completedWeeks).replace('{total}', totalWeeks);
        card.querySelector('.progress-percent').textContent = `${percentage}%`;
        card.querySelector('.progress-bar-fill').style.width = `${percentage}%`;

        // Subject click event
        card.addEventListener('click', (e) => {
            if (e.target.closest('.delete-subject-btn')) return;
            openSubjectView(subject.id);
        });

        // Delete subject event
        const deleteBtn = card.querySelector('.delete-subject-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDeleteModal(subject.id);
        });

        subjectsGrid.appendChild(card);
    });
}

function openAddModal() {
    newSubjectInput.value = '';
    customWeeksInput.value = '';
    document.querySelector('input[name="subject-duration"][value="auto"]').checked = true;
    customWeeksContainer.classList.add('hidden');
    addSubjectModal.classList.remove('hidden');
    newSubjectInput.focus();
}

function closeAddModal() {
    addSubjectModal.classList.add('hidden');
}

function openDeleteModal(id) {
    subjectToDeleteId = id;
    deleteConfirmModal.classList.remove('hidden');
}

function closeDeleteModal() {
    subjectToDeleteId = null;
    deleteConfirmModal.classList.add('hidden');
}

function confirmAddSubject() {
    const name = newSubjectInput.value.trim();
    if (!name) return;

    const durationType = document.querySelector('input[name="subject-duration"]:checked').value;
    let weeksCount = 16;

    if (durationType === 'custom') {
        const val = parseInt(customWeeksInput.value, 10);
        if (isNaN(val) || val <= 0) {
            alert(t('alert_invalid_weeks'));
            return;
        }
        weeksCount = val;
    }

    const newSub = createNewSubject(name, weeksCount);
    subjects.push(newSub);
    saveData();
    closeAddModal();
    renderDashboard();
}

function renderDailyHabits() {
    habitsDateDisplay.textContent = getFormattedDateDisplay(viewingDateStr);

    // Hide/show the "Today" button if we are on today
    if (viewingDateStr === realTodayStr) {
        habitsTodayBtn.style.visibility = 'hidden';
    } else {
        habitsTodayBtn.style.visibility = 'visible';
    }

    habitsGrid.innerHTML = '';

    const viewHistory = habitsData.history[viewingDateStr] || [];
    let completedCount = 0;

    habitsData.habits.forEach(habit => {
        const isCompleted = viewHistory.includes(habit.id);
        if (isCompleted) completedCount++;

        const cardNode = habitCardTemplate.content.cloneNode(true);
        const card = cardNode.querySelector('.habit-card');

        card.querySelector('.habit-text').textContent = habit.text;

        if (isCompleted) {
            card.classList.add('completed');
        }

        // Toggle completion status
        card.addEventListener('click', (e) => {
            if (e.target.closest('.delete-habit-btn')) return;

            let historyForDate = habitsData.history[viewingDateStr] || [];

            if (historyForDate.includes(habit.id)) {
                // Remove
                historyForDate = historyForDate.filter(id => id !== habit.id);
            } else {
                // Add
                historyForDate.push(habit.id);
            }

            habitsData.history[viewingDateStr] = historyForDate;
            saveHabitsData();
            renderDailyHabits();

            // Show tracker for this habit
            renderHabitTrackerGrid(habit.id, habit.text);
        });

        // Delete habit
        const deleteBtn = card.querySelector('.delete-habit-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            habitsData.habits = habitsData.habits.filter(h => h.id !== habit.id);
            saveHabitsData();
            renderDailyHabits();
        });

        habitsGrid.appendChild(card);
    });

    habitsSummaryText.textContent = t('habits_completed').replace('{completed}', completedCount).replace('{total}', habitsData.habits.length);
}

function renderHabitTrackerGrid(habitId, habitName) {
    const habit = habitsData.habits.find(h => h.id === habitId);
    trackerHabitName.textContent = habitName;
    trackerGrid.innerHTML = '';

    // Find when this habit was first tracked to determine "missed" vs "no data"
    let allDatesWithAnyHabit = Object.keys(habitsData.history).sort((a, b) => new Date(a) - new Date(b));
    let earliestRecordedDate = allDatesWithAnyHabit.find(date => habitsData.history[date].includes(habitId));

    let startDateStr = habit.createdAt || earliestRecordedDate || realTodayStr;

    // If the earliest recorded date is BEFORE the createdAt date, use the earliest recorded date
    if (earliestRecordedDate && new Date(earliestRecordedDate) < new Date(startDateStr)) {
        startDateStr = earliestRecordedDate;
    }

    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const startDateObj = new Date(sYear, sMonth - 1, sDay);

    const [eYear, eMonth, eDay] = realTodayStr.split('-').map(Number);
    const endDateObj = new Date(eYear, eMonth - 1, eDay);

    let currentDate = new Date(startDateObj);
    let daysTracked = 0;

    // Always render chronologically from the start date forward
    while (currentDate <= endDateObj) {
        const cellDateStr = formatDate(currentDate);
        const cell = document.createElement('div');
        cell.className = 'tracker-cell';

        const historyForDate = habitsData.history[cellDateStr] || [];
        let stateText = '';

        if (historyForDate.includes(habitId)) {
            cell.classList.add('completed');
            stateText = t('completed_status');
        } else {
            cell.classList.add('missed');
            stateText = t('missed_status');
        }

        const displayDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `${displayDate}<br/>${stateText}`;
        cell.appendChild(tooltip);

        trackerGrid.appendChild(cell);

        currentDate.setDate(currentDate.getDate() + 1);
        daysTracked++;
    }

    // Pad unused future cells to fill out the grid nicely
    // CSS Grid renders 7 rows per column.
    // Ensure we render at least 4 columns (28 cells) minimum so it doesn't look empty for new habits
    const minCells = 28;
    let extraCells = 0;
    if (daysTracked < minCells) {
        extraCells = minCells - daysTracked;
    } else if (daysTracked % 7 !== 0) {
        extraCells = 7 - (daysTracked % 7);
    }

    for (let i = 0; i < extraCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'tracker-cell no-data';

        const displayDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `${displayDate}<br/>${t('future_status')}`;
        cell.appendChild(tooltip);

        trackerGrid.appendChild(cell);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate stats sub-header
    const displayStartDate = startDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const statsElem = document.getElementById('tracker-habit-stats');
    if (statsElem) {
        statsElem.textContent = t('tracker_stats').replace('{date}', displayStartDate).replace('{days}', daysTracked).replace('{plural}', daysTracked === 1 ? '' : 's');
    }

    habitTrackerContainer.classList.remove('hidden');
}

function renderDailyRoutine() {
    routineDateDisplay.textContent = getFormattedDateDisplay(viewingDateStr);

    // Hide/show the "Today" button if we are on today
    if (viewingDateStr === realTodayStr) {
        routineTodayBtn.style.visibility = 'hidden';
    } else {
        routineTodayBtn.style.visibility = 'visible';
    }

    routineTasksList.innerHTML = '';

    // If viewing a date that has no tasks, auto-fill it from the most recent previous day
    if (!routineTasks[viewingDateStr]) {
        // Find most recent day with tasks
        const allDates = Object.keys(routineTasks).sort((a, b) => new Date(b) - new Date(a));
        let mostRecentDate = null;
        for (const d of allDates) {
            if (new Date(d) <= new Date(viewingDateStr) && routineTasks[d].length > 0) {
                mostRecentDate = d;
                break;
            }
        }

        if (mostRecentDate) {
            // Copy tasks, set to incomplete
            routineTasks[viewingDateStr] = routineTasks[mostRecentDate].map(t => ({
                ...t,
                id: generateId('rtn'), // New ID so it doesn't conflict
                completed: false
            }));
            saveRoutineData();
        } else {
            routineTasks[viewingDateStr] = [];
        }
    }

    const currentTasks = routineTasks[viewingDateStr] || [];
    let completedTasks = 0;

    currentTasks.forEach(task => {
        const taskNode = taskItemTemplate.content.cloneNode(true);
        const taskItemElement = taskNode.querySelector('.task-item');

        if (task.completed) {
            taskItemElement.classList.add('completed');
            completedTasks++;
        }

        taskItemElement.querySelector('.task-text').textContent = task.text;
        taskItemElement.querySelector('.task-edit-input').value = task.text;
        taskItemElement.querySelector('.task-checkbox').checked = task.completed;

        const checkbox = taskItemElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => {
            task.completed = e.target.checked;
            saveRoutineData();
            if (task.completed) taskItemElement.classList.add('completed');
            else taskItemElement.classList.remove('completed');
            renderDailyRoutine(); // Re-render to update summary
        });

        const deleteBtn = taskItemElement.querySelector('.delete-task-btn');
        deleteBtn.addEventListener('click', () => {
            routineTasks[viewingDateStr] = routineTasks[viewingDateStr].filter(t => t.id !== task.id);
            saveRoutineData();
            renderDailyRoutine();
        });

        const editBtn = taskItemElement.querySelector('.edit-task-btn');
        const textSpan = taskItemElement.querySelector('.task-text');
        const editInput = taskItemElement.querySelector('.task-edit-input');

        editBtn.addEventListener('click', () => {
            textSpan.classList.add('hidden');
            editInput.classList.remove('hidden');
            editInput.focus();
            taskItemElement.querySelector('.task-actions').style.display = 'none';
        });

        const finishEdit = () => {
            const newText = editInput.value.trim();
            if (newText) {
                task.text = newText;
                textSpan.textContent = newText;
                saveRoutineData();
            } else {
                editInput.value = task.text;
            }
            textSpan.classList.remove('hidden');
            editInput.classList.add('hidden');
            taskItemElement.querySelector('.task-actions').style.display = 'flex';
        };

        editInput.addEventListener('blur', finishEdit);
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
            if (e.key === 'Escape') {
                editInput.value = task.text;
                finishEdit();
            }
        });

        routineTasksList.appendChild(taskItemElement);
    });

    // Add summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'progress-info';
    summaryDiv.style.marginTop = '16px';
    summaryDiv.style.paddingTop = '16px';
    summaryDiv.style.borderTop = '1px solid var(--border-color)';
    summaryDiv.innerHTML = `<span style="font-size: 14px;">${t('tasks_completed_summary').replace('{completed}', completedTasks).replace('{total}', currentTasks.length)}</span>`;
    if (currentTasks.length > 0) {
        routineTasksList.appendChild(summaryDiv);
    }
}

// --- Subject View Logic ---
function openSubjectView(id) {
    currentSubjectId = id;
    renderSubjectView();
    showView('subject');
}

function renderSubjectView() {
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (!subject) {
        showView('dashboard');
        return;
    }

    // Update Header
    currentSubjectTitle.textContent = subject.name;

    // Update Progress
    updateSubjectProgress(subject);

    // Render Weeks
    weeksContainer.innerHTML = '';

    subject.weeks.forEach((week, index) => {
        const weekNode = weekBlockTemplate.content.cloneNode(true);
        const weekBlock = weekNode.querySelector('.week-block');

        if (week.collapsed) weekBlock.classList.add('collapsed');
        if (week.completed) weekBlock.classList.add('completed');

        weekBlock.querySelector('.week-title').textContent = t('week_num').replace('{num}', week.weekNumber);
        weekBlock.querySelector('.week-checkbox').checked = week.completed;

        const tasksCount = week.tasks.length;
        const tasksCompleted = week.tasks.filter(t => t.completed).length;
        weekBlock.querySelector('.task-count').textContent = tasksCount > 0 ? t('tasks_count').replace('{completed}', tasksCompleted).replace('{total}', tasksCount) : t('tasks_zero');

        const toggleBtn = weekBlock.querySelector('.toggle-collapse-btn');
        const weekCompleter = weekBlock.querySelector('.week-checkbox');
        const tasksList = weekBlock.querySelector('.tasks-list');
        const addTaskBtn = weekBlock.querySelector('.add-task-btn');
        const addTaskForm = weekBlock.querySelector('.add-task-form');
        const taskInput = weekBlock.querySelector('.task-input');
        const saveTaskBtn = weekBlock.querySelector('.save-task-btn');
        const cancelTaskBtn = weekBlock.querySelector('.cancel-task-btn');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            week.collapsed = !week.collapsed;
            saveData();
            weekBlock.classList.toggle('collapsed');
        });

        weekBlock.querySelector('.week-header').addEventListener('click', (e) => {
            if (!e.target.closest('.week-completer') && !e.target.closest('.toggle-collapse-btn')) {
                week.collapsed = !week.collapsed;
                saveData();
                weekBlock.classList.toggle('collapsed');
            }
        });

        weekCompleter.addEventListener('change', (e) => {
            week.completed = e.target.checked;
            saveData();
            if (week.completed) {
                weekBlock.classList.add('completed');
            } else {
                weekBlock.classList.remove('completed');
            }
            updateSubjectProgress(subject);
            renderDashboard(); // Update dashboard progress too!
        });

        addTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.add('hidden');
            addTaskForm.classList.remove('hidden');
            taskInput.focus();
        });

        cancelTaskBtn.addEventListener('click', () => {
            addTaskForm.classList.add('hidden');
            addTaskBtn.classList.remove('hidden');
            taskInput.value = '';
        });

        const submitTask = () => {
            const text = taskInput.value.trim();
            if (text) {
                week.tasks.push({
                    id: generateId('tsk'),
                    text: text,
                    completed: false
                });
                saveData();
                renderSubjectView();
            }
        };

        saveTaskBtn.addEventListener('click', submitTask);
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitTask();
            if (e.key === 'Escape') cancelTaskBtn.click();
        });

        week.tasks.forEach(task => {
            const taskNode = taskItemTemplate.content.cloneNode(true);
            const taskItemElement = taskNode.querySelector('.task-item');

            if (task.completed) taskItemElement.classList.add('completed');

            taskItemElement.querySelector('.task-text').textContent = task.text;
            taskItemElement.querySelector('.task-edit-input').value = task.text;
            taskItemElement.querySelector('.task-checkbox').checked = task.completed;

            const checkbox = taskItemElement.querySelector('.task-checkbox');
            checkbox.addEventListener('change', (e) => {
                task.completed = e.target.checked;
                saveData();
                if (task.completed) taskItemElement.classList.add('completed');
                else taskItemElement.classList.remove('completed');
                renderWeekTaskCounter(weekBlock, week);
            });

            const deleteBtn = taskItemElement.querySelector('.delete-task-btn');
            deleteBtn.addEventListener('click', () => {
                week.tasks = week.tasks.filter(t => t.id !== task.id);
                saveData();
                renderSubjectView();
            });

            const editBtn = taskItemElement.querySelector('.edit-task-btn');
            const textSpan = taskItemElement.querySelector('.task-text');
            const editInput = taskItemElement.querySelector('.task-edit-input');

            editBtn.addEventListener('click', () => {
                textSpan.classList.add('hidden');
                editInput.classList.remove('hidden');
                editInput.focus();
                taskItemElement.querySelector('.task-actions').style.display = 'none';
            });

            const finishEdit = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    task.text = newText;
                    textSpan.textContent = newText;
                    saveData();
                } else {
                    editInput.value = task.text;
                }
                textSpan.classList.remove('hidden');
                editInput.classList.add('hidden');
                taskItemElement.querySelector('.task-actions').style.display = 'flex';
            };

            editInput.addEventListener('blur', finishEdit);
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') finishEdit();
                if (e.key === 'Escape') {
                    editInput.value = task.text;
                    finishEdit();
                }
            });

            tasksList.appendChild(taskItemElement);
        });

        weeksContainer.appendChild(weekBlock);
    });
}

function renderWeekTaskCounter(weekBlock, week) {
    const tasksCount = week.tasks.length;
    const tasksCompleted = week.tasks.filter(t => t.completed).length;
    weekBlock.querySelector('.task-count').textContent = tasksCount > 0 ? t('tasks_count').replace('{completed}', tasksCompleted).replace('{total}', tasksCount) : t('tasks_zero');
}

function updateSubjectProgress(subject) {
    const { percentage } = calculateProgress(subject);
    subjectProgressPercent.textContent = `${percentage}%`;
    subjectProgressFill.style.width = `${percentage}%`;
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    navDashboard.addEventListener('click', () => showView('dashboard'));
    navDailyHabits.addEventListener('click', () => showView('dailyHabits'));
    navDailyRoutine.addEventListener('click', () => showView('dailyRoutine'));
    backBtn.addEventListener('click', () => showView('dashboard'));

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Date Navigation Listeners
    habitsPrevDayBtn.addEventListener('click', () => changeDateOffset(-1));
    habitsNextDayBtn.addEventListener('click', () => changeDateOffset(1));
    habitsTodayBtn.addEventListener('click', resetDateToToday);

    routinePrevDayBtn.addEventListener('click', () => changeDateOffset(-1));
    routineNextDayBtn.addEventListener('click', () => changeDateOffset(1));
    routineTodayBtn.addEventListener('click', resetDateToToday);

    closeTrackerBtn.addEventListener('click', () => {
        habitTrackerContainer.classList.add('hidden');
    });

    durationRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customWeeksContainer.classList.remove('hidden');
                customWeeksInput.focus();
            } else {
                customWeeksContainer.classList.add('hidden');
            }
        });
    });

    // Daily Habits listeners
    addHabitBtn.addEventListener('click', () => {
        addHabitBtn.classList.add('hidden');
        addHabitForm.classList.remove('hidden');
        habitInput.focus();
    });

    cancelHabitBtn.addEventListener('click', () => {
        addHabitForm.classList.add('hidden');
        addHabitBtn.classList.remove('hidden');
        habitInput.value = '';
    });

    const submitHabit = () => {
        const text = habitInput.value.trim();
        if (text) {
            habitsData.habits.push({
                id: generateId('hab'),
                text: text,
                createdAt: viewingDateStr
            });
            saveHabitsData();
            renderDailyHabits();

            habitInput.value = '';
            habitInput.focus();
        }
    };

    saveHabitBtn.addEventListener('click', submitHabit);
    habitInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitHabit();
        if (e.key === 'Escape') cancelHabitBtn.click();
    });

    // Daily Routine listeners

    addRoutineTaskBtn.addEventListener('click', () => {
        addRoutineTaskBtn.classList.add('hidden');
        addRoutineForm.classList.remove('hidden');
        routineTaskInput.focus();
    });

    cancelRoutineBtn.addEventListener('click', () => {
        addRoutineForm.classList.add('hidden');
        addRoutineTaskBtn.classList.remove('hidden');
        routineTaskInput.value = '';
    });

    const submitRoutine = () => {
        const text = routineTaskInput.value.trim();
        if (text) {
            if (!routineTasks[viewingDateStr]) {
                routineTasks[viewingDateStr] = [];
            }
            routineTasks[viewingDateStr].push({
                id: generateId('rtn'),
                text: text,
                completed: false
            });
            saveRoutineData();
            renderDailyRoutine();

            routineTaskInput.value = '';
            routineTaskInput.focus();
        }
    };

    saveRoutineBtn.addEventListener('click', submitRoutine);
    routineTaskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitRoutine();
        if (e.key === 'Escape') cancelRoutineBtn.click();
    });

    addSubjectBtn.addEventListener('click', openAddModal);
    confirmAddSubjectBtn.addEventListener('click', confirmAddSubject);

    newSubjectInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmAddSubject();
    });

    closeAddModalBtns.forEach(btn => btn.addEventListener('click', closeAddModal));

    closeDeleteModalBtns.forEach(btn => btn.addEventListener('click', closeDeleteModal));
    confirmDeleteSubjectBtn.addEventListener('click', () => {
        if (subjectToDeleteId) {
            subjects = subjects.filter(s => s.id !== subjectToDeleteId);
            saveData();
            closeDeleteModal();
            // If deleting current view
            if (currentSubjectId === subjectToDeleteId) {
                showView('dashboard');
            } else {
                renderDashboard();
            }
        }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
                if (overlay.id === 'delete-confirm-modal') subjectToDeleteId = null;
            }
        });
    });

    editSubjectTitleBtn.addEventListener('click', () => {
        currentSubjectTitle.contentEditable = true;
        currentSubjectTitle.focus();
        const range = document.createRange();
        range.selectNodeContents(currentSubjectTitle);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    });

    const finishTitleEdit = () => {
        currentSubjectTitle.contentEditable = false;
        const newTitle = currentSubjectTitle.textContent.trim();
        const subject = subjects.find(s => s.id === currentSubjectId);

        if (newTitle && subject) {
            subject.name = newTitle;
            saveData();
            renderDashboard(); // Re-render to update dashboard title
        } else if (subject) {
            currentSubjectTitle.textContent = subject.name;
        }
    };

    currentSubjectTitle.addEventListener('blur', finishTitleEdit);
    currentSubjectTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishTitleEdit();
        }
    });
}

// Start sequence
document.addEventListener('DOMContentLoaded', init);
