// Workout Tracker JavaScript

// Data storage
var exercises = [];

// DOM elements
var exerciseNameInput = document.getElementById('exerciseName');
var setsInput = document.getElementById('sets');
var repsInput = document.getElementById('reps');
var addExerciseBtn = document.getElementById('addExercise');
var clearAllBtn = document.getElementById('clearAll');
var exerciseList = document.getElementById('exerciseList');
var totalExercisesEl = document.getElementById('totalExercises');
var totalSetsEl = document.getElementById('totalSets');
var totalRepsEl = document.getElementById('totalReps');
var darkModeToggle = document.getElementById('darkModeToggle');
var html = document.documentElement;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    updateDisplay();

    if (localStorage.getItem('darkMode') === 'enabled') {
        html.classList.add('dark-mode');
    }
});

// Add exercise event
addExerciseBtn.addEventListener('click', addExercise);

// Clear all exercises event
clearAllBtn.addEventListener('click', clearAllExercises);

darkModeToggle.addEventListener('click', () => {
    html.classList.toggle('dark-mode');

    if (html.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.removeItem('darkMode');
    }
});

// Allow Enter key to add exercise
exerciseNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addExercise();
    }
});

// Add exercise function
function addExercise() {
    const name = exerciseNameInput.value.trim();
    const sets = parseInt(setsInput.value);
    const reps = parseInt(repsInput.value);
    
    if (!name) {
        showNotification('Please enter an exercise name', 'error');
        return;
    }
    
    if (sets < 1 || reps < 1) {
        showNotification('Sets and reps must be at least 1', 'error');
        return;
    }
    
    const exercise = {
        id: Date.now(),
        name: name,
        sets: sets,
        reps: reps,
        timestamp: new Date().toLocaleTimeString()
    };
    
    exercises.push(exercise);
    saveExercises();
    updateDisplay();
    
    // Clear input
    exerciseNameInput.value = '';
    exerciseNameInput.focus();
    
    showNotification('Exercise added successfully!', 'success');
}

// Delete exercise function
function deleteExercise(id) {
    const index = exercises.findIndex(exercise => exercise.id === id);
    if (index > -1) {
        exercises.splice(index, 1);
    }
    saveExercises();
    updateDisplay();
    showNotification('Exercise removed', 'info');
}

// Clear all exercises
function clearAllExercises() {
    if (exercises.length === 0) {
        showNotification('No exercises to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all exercises?')) {
        exercises.splice(0);
        saveExercises();
        updateDisplay();
        showNotification('All exercises cleared', 'info');
    }
}

// Update display
function updateDisplay() {
    // Update exercise list
    if (exercises.length === 0) {
        exerciseList.innerHTML = `
            <div class="empty-state">
                <p>No exercises yet. Add your first exercise above!</p>
            </div>
        `;
    } else {
        exerciseList.innerHTML = exercises.map(exercise => `
            <div class="exercise-item">
                <div class="exercise-info">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-details">
                        <span>🔢 Sets: ${exercise.sets}</span>
                        <span>🔄 Reps: ${exercise.reps}</span>
                        <span>⏰ ${exercise.timestamp}</span>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteExercise(${exercise.id})">Delete</button>
            </div>
        `).join('');
    }
    
    // Update statistics
    updateStats();
}

// Update statistics
function updateStats() {
    const totalExercises = exercises.length;
    const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
    const totalReps = exercises.reduce((sum, exercise) => sum + (exercise.sets * exercise.reps), 0);
    
    // Animate the numbers
    animateValue(totalExercisesEl, parseInt(totalExercisesEl.textContent) || 0, totalExercises, 500);
    animateValue(totalSetsEl, parseInt(totalSetsEl.textContent) || 0, totalSets, 500);
    animateValue(totalRepsEl, parseInt(totalRepsEl.textContent) || 0, totalReps, 500);
}

// Animate number changes
function animateValue(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    const increment = range / (duration / 10);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 10);
}

// Save exercises to localStorage
function saveExercises() {
    const today = new Date().toDateString();
    const data = {
        date: today,
        exercises: exercises
    };
    localStorage.setItem('workoutData', JSON.stringify(data));
}

// Load exercises from localStorage
function loadExercises() {
    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const today = new Date().toDateString();
        
        // Only load if it's the same day
        if (data.date === today) {
            exercises.splice(0);
            exercises.push(...(data.exercises || []));
        } else {
            // Clear old data if it's a new day
            exercises.splice(0);
            saveExercises();
        }
    }
}

// Show notification
function showNotification(message, type) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            break;
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        notification.style.animationFillMode = 'forwards';
        
        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Expose to global for testing
global.exercises = exercises;
global.exerciseNameInput = exerciseNameInput;
global.setsInput = setsInput;
global.repsInput = repsInput;
global.addExerciseBtn = addExerciseBtn;
global.clearAllBtn = clearAllBtn;
global.exerciseList = exerciseList;
global.totalExercisesEl = totalExercisesEl;
global.totalSetsEl = totalSetsEl;
global.totalRepsEl = totalRepsEl;
global.addExercise = addExercise;
global.deleteExercise = deleteExercise;
global.clearAllExercises = clearAllExercises;
global.updateStats = updateStats;
global.loadExercises = loadExercises;
global.saveExercises = saveExercises;
global.showNotification = showNotification;
global.updateDisplay = updateDisplay;
global.animateValue = animateValue;
global.darkModeToggle = darkModeToggle;