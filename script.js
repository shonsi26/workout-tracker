// Workout Tracker App
// Main application class for managing workouts
class WorkoutTracker {
    constructor() {
        this.workouts = this.loadFromLocalStorage();
        this.currentEditingId = null;
        this.exerciseCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setTodayDate();
        this.renderWorkouts();
        this.updateStatistics();
        this.initDarkMode();
    }

    setupEventListeners() {
        // Form events
        document.getElementById('workoutForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('addExerciseBtn').addEventListener('click', () => this.addExerciseInput());

        // Modal events
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('editWorkoutBtn').addEventListener('click', () => this.editWorkout());
        document.getElementById('deleteWorkoutBtn').addEventListener('click', () => this.deleteWorkout());

        // Dark mode toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleDarkMode());

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('workoutModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Export to CSV
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportToCSV());
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workoutDate').value = today;
    }

    addExerciseInput() {
        const exercisesList = document.getElementById('exercisesList');
        const exerciseId = `exercise-${this.exerciseCount++}`;
        
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.id = exerciseId;
        exerciseItem.innerHTML = `
            <button type="button" class="remove-exercise-btn" onclick="app.removeExerciseInput('${exerciseId}')">Remove</button>
            <div class="exercise-inputs">
                <div class="exercise-input-group">
                    <label>Exercise Name:</label>
                    <input type="text" class="exercise-name" placeholder="e.g., Bench Press" required>
                </div>
                <div class="exercise-input-group">
                    <label>Sets:</label>
                    <input type="number" class="exercise-sets" min="1" placeholder="3" required>
                </div>
                <div class="exercise-input-group">
                    <label>Reps:</label>
                    <input type="number" class="exercise-reps" min="1" placeholder="10" required>
                </div>
                <div class="exercise-input-group">
                    <label>Weight (optional):</label>
                    <input type="text" class="exercise-weight" placeholder="e.g., 185 lbs">
                </div>
            </div>
        `;
        
        exercisesList.appendChild(exerciseItem);
    }

    removeExerciseInput(exerciseId) {
        const element = document.getElementById(exerciseId);
        if (element) {
            element.remove();
        }
    }

    getExercisesFromForm() {
        const exercises = [];
        const exerciseItems = document.querySelectorAll('.exercise-item');
        
        exerciseItems.forEach(item => {
            const name = item.querySelector('.exercise-name').value.trim();
            const sets = item.querySelector('.exercise-sets').value;
            const reps = item.querySelector('.exercise-reps').value;
            const weight = item.querySelector('.exercise-weight').value.trim();
            
            if (name && sets && reps) {
                exercises.push({
                    name,
                    sets: parseInt(sets),
                    reps: parseInt(reps),
                    weight: weight || null
                });
            }
        });
        
        return exercises;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('workoutName').value.trim();
        const date = document.getElementById('workoutDate').value;
        const exercises = this.getExercisesFromForm();
        
        if (!name || !date || exercises.length === 0) {
            alert('Please fill in all fields and add at least one exercise.');
            return;
        }
        
        if (this.currentEditingId) {
            // Update existing workout
            const workoutIndex = this.workouts.findIndex(w => w.id === this.currentEditingId);
            if (workoutIndex !== -1) {
                this.workouts[workoutIndex] = {
                    id: this.currentEditingId,
                    name,
                    date,
                    exercises,
                    createdAt: this.workouts[workoutIndex].createdAt,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Create new workout
            const workout = {
                id: Date.now().toString(),
                name,
                date,
                exercises,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.workouts.push(workout);
        }
        
        this.saveToLocalStorage();
        this.resetForm();
        this.renderWorkouts();
        this.updateStatistics();
    }

    resetForm() {
        document.getElementById('workoutForm').reset();
        document.getElementById('exercisesList').innerHTML = '';
        this.currentEditingId = null;
        this.exerciseCount = 0;
        this.setTodayDate();
    }

    renderWorkouts() {
        const workoutsList = document.getElementById('workoutsList');
        const emptyState = document.getElementById('emptyState');
        
        workoutsList.innerHTML = '';
        
        if (this.workouts.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Sort workouts by date (newest first)
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedWorkouts.forEach(workout => {
            const card = document.createElement('div');
            card.className = 'workout-card';
            card.onclick = () => this.showWorkoutDetail(workout.id);
            
            const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            card.innerHTML = `
                <h3>${this.escapeHtml(workout.name)}</h3>
                <p class="date">📅 ${formattedDate}</p>
                <p><span class="exercise-count">${workout.exercises.length} exercises</span></p>
            `;
            
            workoutsList.appendChild(card);
        });
    }

    showWorkoutDetail(workoutId) {
        const workout = this.workouts.find(w => w.id === workoutId);
        if (!workout) return;
        
        const modal = document.getElementById('workoutModal');
        const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('modalWorkoutName').textContent = workout.name;
        document.getElementById('modalWorkoutDate').textContent = `📅 ${formattedDate}`;
        
        const exercisesHtml = workout.exercises.map(exercise => `
            <div class="modal-exercise">
                <h4>${this.escapeHtml(exercise.name)}</h4>
                <p><strong>Sets:</strong> ${exercise.sets}</p>
                <p><strong>Reps:</strong> ${exercise.reps}</p>
                ${exercise.weight ? `<p><strong>Weight:</strong> ${this.escapeHtml(exercise.weight)}</p>` : ''}
            </div>
        `).join('');
        
        document.getElementById('modalExercises').innerHTML = exercisesHtml;
        
        // Store current workout ID for edit/delete operations
        modal.dataset.workoutId = workoutId;
        
        modal.style.display = 'block';
    }

    editWorkout() {
        const modal = document.getElementById('workoutModal');
        const workoutId = modal.dataset.workoutId;
        const workout = this.workouts.find(w => w.id === workoutId);
        
        if (!workout) return;
        
        this.currentEditingId = workoutId;
        
        // Populate form with workout data
        document.getElementById('workoutName').value = workout.name;
        document.getElementById('workoutDate').value = workout.date;
        
        // Clear and populate exercises
        document.getElementById('exercisesList').innerHTML = '';
        this.exerciseCount = 0;
        
        workout.exercises.forEach(exercise => {
            this.addExerciseInput();
            const exerciseItems = document.querySelectorAll('.exercise-item');
            const lastItem = exerciseItems[exerciseItems.length - 1];
            
            lastItem.querySelector('.exercise-name').value = exercise.name;
            lastItem.querySelector('.exercise-sets').value = exercise.sets;
            lastItem.querySelector('.exercise-reps').value = exercise.reps;
            if (exercise.weight) {
                lastItem.querySelector('.exercise-weight').value = exercise.weight;
            }
        });
        
        this.closeModal();
        
        // Scroll to form
        document.querySelector('.add-workout-section').scrollIntoView({ behavior: 'smooth' });
    }

    deleteWorkout() {
        const modal = document.getElementById('workoutModal');
        const workoutId = modal.dataset.workoutId;
        
        if (confirm('Are you sure you want to delete this workout?')) {
            this.workouts = this.workouts.filter(w => w.id !== workoutId);
            this.saveToLocalStorage();
            this.closeModal();
            this.renderWorkouts();
            this.updateStatistics();
        }
    }

    closeModal() {
        document.getElementById('workoutModal').style.display = 'none';
    }

    saveToLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.workouts));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('workouts');
        return data ? JSON.parse(data) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // New methods for statistics and dark mode
    updateStatistics() {
        const totalWorkouts = this.workouts.length;
        const totalExercises = this.workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
        
        document.getElementById('totalWorkouts').textContent = totalWorkouts;
        document.getElementById('totalExercises').textContent = totalExercises;
    }

    initDarkMode() {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    }

    toggleDarkMode() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        }
    }

    exportToCSV() {
        const headers = [
            'Workout Name',
            'Date',
            'Exercise Name',
            'Sets',
            'Reps',
            'Weight'
        ];

        const rows = this.workouts.flatMap(workout =>
            workout.exercises.map(exercise => [
                `"${workout.name.replace(/"/g, '""')}"`,
                workout.date,
                `"${exercise.name.replace(/"/g, '""')}"`,
                exercise.sets,
                exercise.reps,
                `"${(exercise.weight || '').replace(/"/g, '""')}"`
            ].join(','))
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'workouts.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize app only in browser environment
if (typeof document !== 'undefined' && document.getElementById('workoutForm')) {
    const app = new WorkoutTracker();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkoutTracker;
}
