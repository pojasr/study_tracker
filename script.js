// --- Constants & Config ---
const STORAGE_KEY = 'studyTrackerData';
const THEME_KEY = 'studyTrackerTheme';
const TOTAL_WEEKS = 16;

// --- State ---
let subjects = [];
let currentSubjectId = null;

// --- DOM Elements ---
const views = {
    dashboard: document.getElementById('dashboard-view'),
    subject: document.getElementById('subject-view')
};

const navDashboard = document.getElementById('nav-dashboard');
const sidebarSubjectsList = document.getElementById('sidebar-subjects-list');

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

// Dashboard elements
const subjectsGrid = document.getElementById('subjects-grid');
const addSubjectBtn = document.getElementById('add-subject-btn');
const addSubjectModal = document.getElementById('add-subject-modal');
const newSubjectInput = document.getElementById('new-subject-input');
const confirmAddSubjectBtn = document.getElementById('confirm-add-subject-btn');
const closeAddModalBtns = document.querySelectorAll('.close-modal-btn');

// Delete Subject Modal
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const confirmDeleteSubjectBtn = document.getElementById('confirm-delete-subject-btn');
const closeDeleteModalBtns = document.querySelectorAll('.close-delete-modal-btn');
let subjectToDeleteId = null;

// Subject View elements
const backBtn = document.getElementById('back-btn');
const currentSubjectTitle = document.getElementById('current-subject-title');
const editSubjectTitleBtn = document.getElementById('edit-subject-title-btn');
const subjectProgressPercent = document.getElementById('subject-progress-percent');
const subjectProgressFill = document.getElementById('subject-progress-fill');
const weeksContainer = document.getElementById('weeks-container');

// Templates
const sidebarSubjectTemplate = document.getElementById('sidebar-subject-item-template');
const subjectCardTemplate = document.getElementById('subject-card-template');
const weekBlockTemplate = document.getElementById('week-block-template');
const taskItemTemplate = document.getElementById('task-item-template');

// --- Initialization ---
function init() {
    initTheme();
    loadData();
    setupEventListeners();
    renderSidebarSubjects();
    renderDashboard();
    updateSidebarActiveState();
}

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.replace('bx-moon', 'bx-sun');
    } else {
        themeIcon.classList.replace('bx-sun', 'bx-moon');
    }
}

// --- Data Management ---
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        subjects = JSON.parse(data);
    } else {
        subjects = []; // Start fresh
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    renderSidebarSubjects(); // Keep sidebar in sync with data changes like add/delete/rename
}

function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

function createNewSubject(name) {
    const newSubject = {
        id: generateId('sub'),
        name: name,
        weeks: []
    };

    for (let i = 1; i <= TOTAL_WEEKS; i++) {
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
    }

    updateSidebarActiveState();
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
    document.querySelectorAll('.sidebar-subject-item').forEach(li => {
        li.classList.remove('active');
    });

    if (!currentSubjectId) {
        navDashboard.classList.add('active');
    } else {
        const activeItem = document.querySelector(`.sidebar-subject-item[data-id="${currentSubjectId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

function calculateProgress(subject) {
    const completedWeeks = subject.weeks.filter(w => w.completed).length;
    const percentage = Math.round((completedWeeks / TOTAL_WEEKS) * 100);
    return { completedWeeks, percentage };
}

// --- Dashboard Logic ---
function renderDashboard() {
    subjectsGrid.innerHTML = '';

    if (subjects.length === 0) {
        subjectsGrid.innerHTML = `<div style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
            No subjects yet. Click "New Subject" to get started!
        </div>`;
        return;
    }

    subjects.forEach(subject => {
        const { completedWeeks, percentage } = calculateProgress(subject);

        const cardNode = subjectCardTemplate.content.cloneNode(true);
        const card = cardNode.querySelector('.subject-card');

        card.querySelector('.card-title').textContent = subject.name;
        card.querySelector('.weeks-completed-text').textContent = `${completedWeeks} / ${TOTAL_WEEKS} weeks`;
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
    if (name) {
        const newSub = createNewSubject(name);
        subjects.push(newSub);
        saveData();
        closeAddModal();
        renderDashboard();
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

        weekBlock.querySelector('.week-title').textContent = `Week ${week.weekNumber}`;
        weekBlock.querySelector('.week-checkbox').checked = week.completed;

        const tasksCount = week.tasks.length;
        const tasksCompleted = week.tasks.filter(t => t.completed).length;
        weekBlock.querySelector('.task-count').textContent = tasksCount > 0 ? `${tasksCompleted}/${tasksCount} tasks` : `0 tasks`;

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
    weekBlock.querySelector('.task-count').textContent = tasksCount > 0 ? `${tasksCompleted}/${tasksCount} tasks` : `0 tasks`;
}

function updateSubjectProgress(subject) {
    const { percentage } = calculateProgress(subject);
    subjectProgressPercent.textContent = `${percentage}%`;
    subjectProgressFill.style.width = `${percentage}%`;
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    navDashboard.addEventListener('click', () => showView('dashboard'));
    backBtn.addEventListener('click', () => showView('dashboard'));

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
