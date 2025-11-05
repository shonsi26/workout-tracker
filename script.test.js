/**
 * Unit tests for WorkoutTracker class
 * Framework: Jest
 */

const WorkoutTracker = require('./script.js');

describe('WorkoutTracker', () => {
    let app;
    let mockLocalStorage;

    beforeEach(() => {
        // Setup DOM structure
        document.body.innerHTML = `
            <form id="workoutForm">
                <input type="text" id="workoutName" />
                <input type="date" id="workoutDate" />
                <div id="exercisesList"></div>
                <button id="addExerciseBtn">Add Exercise</button>
                <button id="cancelBtn">Cancel</button>
                <button type="submit">Submit</button>
            </form>
            <div id="workoutsList" class="workouts-list"></div>
            <div id="emptyState" class="empty-state"></div>
            <div id="workoutModal" class="modal">
                <span class="close">&times;</span>
                <h2 id="modalWorkoutName"></h2>
                <p id="modalWorkoutDate"></p>
                <div id="modalExercises"></div>
                <button id="editWorkoutBtn">Edit</button>
                <button id="deleteWorkoutBtn">Delete</button>
                <button id="closeModalBtn">Close</button>
            </div>
        `;

        // Mock localStorage
        mockLocalStorage = {
            data: {},
            getItem: jest.fn((key) => mockLocalStorage.data[key] || null),
            setItem: jest.fn((key, value) => {
                mockLocalStorage.data[key] = value;
            }),
            removeItem: jest.fn((key) => {
                delete mockLocalStorage.data[key];
            }),
            clear: jest.fn(() => {
                mockLocalStorage.data = {};
            })
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        // Mock Date.now() for consistent IDs
        jest.spyOn(Date, 'now').mockReturnValue(1000000);

        // Mock alert and confirm
        global.alert = jest.fn();
        global.confirm = jest.fn();

        // Initialize app
        app = new WorkoutTracker();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mockLocalStorage.clear();
    });

    describe('Initialization', () => {
        test('Should initialize with empty workouts when localStorage is empty', () => {
            expect(app.workouts).toEqual([]);
            expect(app.currentEditingId).toBeNull();
            expect(app.exerciseCount).toBe(0);
        });

        test('Should load workouts from localStorage on initialization', () => {
            const mockWorkouts = [
                {
                    id: '123',
                    name: 'Chest Day',
                    date: '2024-01-15',
                    exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z'
                }
            ];
            mockLocalStorage.setItem('workouts', JSON.stringify(mockWorkouts));

            const newApp = new WorkoutTracker();
            expect(newApp.workouts).toEqual(mockWorkouts);
        });

        test('Should set today\'s date in the date input field', () => {
            const today = new Date().toISOString().split('T')[0];
            expect(document.getElementById('workoutDate').value).toBe(today);
        });
    });

    describe('Exercise Management', () => {
        test('Should add a new exercise input field when addExerciseInput is called', () => {
            app.addExerciseInput();

            const exerciseItems = document.querySelectorAll('.exercise-item');
            expect(exerciseItems.length).toBe(1);
            expect(exerciseItems[0].id).toBe('exercise-0');
        });

        test('Should increment exerciseCount when adding multiple exercises', () => {
            app.addExerciseInput();
            app.addExerciseInput();
            app.addExerciseInput();

            expect(app.exerciseCount).toBe(3);
            expect(document.querySelectorAll('.exercise-item').length).toBe(3);
        });

        test('Should remove an exercise input field when removeExerciseInput is called', () => {
            app.addExerciseInput();
            const exerciseId = 'exercise-0';

            app.removeExerciseInput(exerciseId);

            expect(document.getElementById(exerciseId)).toBeNull();
        });

        test('Should extract exercises from form with valid data', () => {
            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');

            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';
            exerciseItem.querySelector('.exercise-weight').value = '185 lbs';

            const exercises = app.getExercisesFromForm();

            expect(exercises).toHaveLength(1);
            expect(exercises[0]).toEqual({
                name: 'Bench Press',
                sets: 3,
                reps: 10,
                weight: '185 lbs'
            });
        });

        test('Should skip exercises with missing required fields', () => {
            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');

            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            const exercises = app.getExercisesFromForm();

            expect(exercises).toHaveLength(0);
        });

        test('Should handle optional weight field as null when empty', () => {
            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');

            exerciseItem.querySelector('.exercise-name').value = 'Bodyweight Squats';
            exerciseItem.querySelector('.exercise-sets').value = '4';
            exerciseItem.querySelector('.exercise-reps').value = '15';
            exerciseItem.querySelector('.exercise-weight').value = '';

            const exercises = app.getExercisesFromForm();

            expect(exercises[0].weight).toBeNull();
        });
    });

    describe('Form Submission', () => {
        test('Should save a new workout with valid name, date, and exercises', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts).toHaveLength(1);
            expect(app.workouts[0].name).toBe('Chest Day');
            expect(app.workouts[0].date).toBe('2024-01-15');
            expect(app.workouts[0].exercises).toHaveLength(1);
        });

        test('Should generate unique ID for new workout', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts[0].id).toBe('1000000');
        });

        test('Should set createdAt and updatedAt timestamps on new workout', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts[0].createdAt).toBeDefined();
            expect(app.workouts[0].updatedAt).toBeDefined();
        });

        test('Should show alert when form is submitted without name', () => {
            document.getElementById('workoutName').value = '';
            document.getElementById('workoutDate').value = '2024-01-15';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(global.alert).toHaveBeenCalled();
            expect(app.workouts).toHaveLength(0);
        });

        test('Should show alert when form is submitted without exercises', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(global.alert).toHaveBeenCalled();
            expect(app.workouts).toHaveLength(0);
        });

        test('Should reset form after successful submission', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            const exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            const form = document.getElementById('workoutForm');
            const event = new Event('submit');
            app.handleFormSubmit(event);

            expect(document.getElementById('workoutName').value).toBe('');
            expect(document.querySelectorAll('.exercise-item')).toHaveLength(0);
            expect(app.currentEditingId).toBeNull();
        });
    });

    describe('Workout Editing', () => {
        test('Should update an existing workout when editing', () => {
            // Create initial workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            const workoutId = app.workouts[0].id;

            // Edit the workout
            app.currentEditingId = workoutId;
            document.getElementById('workoutName').value = 'Updated Chest Day';
            document.getElementById('workoutDate').value = '2024-01-16';

            app.addExerciseInput();
            exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Incline Press';
            exerciseItem.querySelector('.exercise-sets').value = '4';
            exerciseItem.querySelector('.exercise-reps').value = '8';

            form = document.getElementById('workoutForm');
            event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts).toHaveLength(1);
            expect(app.workouts[0].name).toBe('Updated Chest Day');
            expect(app.workouts[0].date).toBe('2024-01-16');
            expect(app.workouts[0].id).toBe(workoutId);
        });

        test('Should preserve createdAt timestamp when editing', () => {
            // Create initial workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            const originalCreatedAt = app.workouts[0].createdAt;
            const workoutId = app.workouts[0].id;

            // Edit the workout
            app.currentEditingId = workoutId;
            document.getElementById('workoutName').value = 'Updated Chest Day';

            app.addExerciseInput();
            exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Incline Press';
            exerciseItem.querySelector('.exercise-sets').value = '4';
            exerciseItem.querySelector('.exercise-reps').value = '8';

            form = document.getElementById('workoutForm');
            event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts[0].createdAt).toBe(originalCreatedAt);
        });

        test('Should update updatedAt timestamp when editing', () => {
            // Create initial workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            const originalUpdatedAt = app.workouts[0].updatedAt;
            const workoutId = app.workouts[0].id;

            // Mock time passing
            jest.spyOn(Date, 'now').mockReturnValue(2000000);

            // Edit the workout
            app.currentEditingId = workoutId;
            document.getElementById('workoutName').value = 'Updated Chest Day';

            app.addExerciseInput();
            exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Incline Press';
            exerciseItem.querySelector('.exercise-sets').value = '4';
            exerciseItem.querySelector('.exercise-reps').value = '8';

            form = document.getElementById('workoutForm');
            event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts[0].updatedAt).not.toBe(originalUpdatedAt);
        });
    });

    describe('Workout Deletion', () => {
        test('Should delete a workout and remove it from the list', () => {
            // Create a workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts).toHaveLength(1);

            // Delete the workout
            global.confirm.mockReturnValue(true);
            const modal = document.getElementById('workoutModal');
            modal.dataset.workoutId = app.workouts[0].id;

            app.deleteWorkout();

            expect(app.workouts).toHaveLength(0);
        });

        test('Should not delete workout if user cancels confirmation', () => {
            // Create a workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            expect(app.workouts).toHaveLength(1);

            // Try to delete but cancel
            global.confirm.mockReturnValue(false);
            const modal = document.getElementById('workoutModal');
            modal.dataset.workoutId = app.workouts[0].id;

            app.deleteWorkout();

            expect(app.workouts).toHaveLength(1);
        });

        test('Should persist deletion to localStorage', () => {
            // Create a workout
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();
            let exerciseItem = document.querySelector('.exercise-item');
            exerciseItem.querySelector('.exercise-name').value = 'Bench Press';
            exerciseItem.querySelector('.exercise-sets').value = '3';
            exerciseItem.querySelector('.exercise-reps').value = '10';

            let form = document.getElementById('workoutForm');
            let event = new Event('submit');
            app.handleFormSubmit(event);

            // Delete the workout
            global.confirm.mockReturnValue(true);
            const modal = document.getElementById('workoutModal');
            modal.dataset.workoutId = app.workouts[0].id;

            app.deleteWorkout();

            const savedData = JSON.parse(mockLocalStorage.getItem('workouts'));
            expect(savedData).toHaveLength(0);
        });
    });

    describe('LocalStorage Persistence', () => {
        test('Should save workouts to localStorage when saveToLocalStorage is called', () => {
            const workout = {
                id: '123',
                name: 'Chest Day',
                date: '2024-01-15',
                exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };
            app.workouts.push(workout);
            app.saveToLocalStorage();

            const savedData = JSON.parse(mockLocalStorage.getItem('workouts'));
            expect(savedData).toEqual([workout]);
        });

        test('Should load workouts from localStorage when loadFromLocalStorage is called', () => {
            const mockWorkouts = [
                {
                    id: '123',
                    name: 'Chest Day',
                    date: '2024-01-15',
                    exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-01-15T10:00:00Z'
                }
            ];
            mockLocalStorage.setItem('workouts', JSON.stringify(mockWorkouts));

            const loadedWorkouts = app.loadFromLocalStorage();
            expect(loadedWorkouts).toEqual(mockWorkouts);
        });
    });

    describe('HTML Escaping', () => {
        test('Should escape HTML special characters in workout names', () => {
            const maliciousInput = '<script>alert("xss")</script>';
            const escaped = app.escapeHtml(maliciousInput);

            expect(escaped).not.toContain('<script>');
            expect(escaped).toContain('&lt;');
            expect(escaped).toContain('&gt;');
        });

        test('Should escape HTML special characters in exercise names', () => {
            const maliciousInput = '<img src=x onerror="alert(\'xss\')">';
            const escaped = app.escapeHtml(maliciousInput);

            expect(escaped).not.toContain('<img');
            expect(escaped).toContain('&lt;');
        });
    });

    describe('Modal Management', () => {
        test('Should close modal when closeModal is called', () => {
            const modal = document.getElementById('workoutModal');
            modal.style.display = 'block';

            app.closeModal();

            expect(modal.style.display).toBe('none');
        });

        test('Should display workout details in modal when showWorkoutDetail is called', () => {
            const workout = {
                id: '123',
                name: 'Chest Day',
                date: '2024-01-15',
                exercises: [
                    { name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' },
                    { name: 'Incline Press', sets: 3, reps: 8, weight: null }
                ],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };
            app.workouts.push(workout);

            app.showWorkoutDetail('123');

            expect(document.getElementById('modalWorkoutName').textContent).toBe('Chest Day');
            expect(document.getElementById('modalExercises').innerHTML).toContain('Bench Press');
            expect(document.getElementById('modalExercises').innerHTML).toContain('Incline Press');
        });
    });

    describe('Rendering', () => {
        test('Should display empty state when no workouts exist', () => {
            app.renderWorkouts();

            const emptyState = document.getElementById('emptyState');
            expect(emptyState.style.display).toBe('block');
        });

        test('Should hide empty state when workouts exist', () => {
            const workout = {
                id: '123',
                name: 'Chest Day',
                date: '2024-01-15',
                exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };
            app.workouts.push(workout);

            app.renderWorkouts();

            const emptyState = document.getElementById('emptyState');
            expect(emptyState.style.display).toBe('none');
        });

        test('Should render workout cards for each workout', () => {
            const workout1 = {
                id: '123',
                name: 'Chest Day',
                date: '2024-01-15',
                exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };
            const workout2 = {
                id: '456',
                name: 'Leg Day',
                date: '2024-01-16',
                exercises: [{ name: 'Squats', sets: 4, reps: 8, weight: '225 lbs' }],
                createdAt: '2024-01-16T10:00:00Z',
                updatedAt: '2024-01-16T10:00:00Z'
            };
            app.workouts.push(workout1, workout2);

            app.renderWorkouts();

            const cards = document.querySelectorAll('.workout-card');
            expect(cards).toHaveLength(2);
        });

        test('Should sort workouts by date in descending order', () => {
            const workout1 = {
                id: '123',
                name: 'Chest Day',
                date: '2024-01-15',
                exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: '185 lbs' }],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };
            const workout2 = {
                id: '456',
                name: 'Leg Day',
                date: '2024-01-20',
                exercises: [{ name: 'Squats', sets: 4, reps: 8, weight: '225 lbs' }],
                createdAt: '2024-01-20T10:00:00Z',
                updatedAt: '2024-01-20T10:00:00Z'
            };
            app.workouts.push(workout1, workout2);

            app.renderWorkouts();

            const cards = document.querySelectorAll('.workout-card');
            expect(cards[0].textContent).toContain('Leg Day');
            expect(cards[1].textContent).toContain('Chest Day');
        });
    });

    describe('Form Reset', () => {
        test('Should clear all form fields when resetForm is called', () => {
            document.getElementById('workoutName').value = 'Chest Day';
            document.getElementById('workoutDate').value = '2024-01-15';

            app.addExerciseInput();

            app.resetForm();

            expect(document.getElementById('workoutName').value).toBe('');
            expect(document.querySelectorAll('.exercise-item')).toHaveLength(0);
        });

        test('Should reset currentEditingId when resetForm is called', () => {
            app.currentEditingId = '123';

            app.resetForm();

            expect(app.currentEditingId).toBeNull();
        });

        test('Should reset exerciseCount when resetForm is called', () => {
            app.addExerciseInput();
            app.addExerciseInput();

            app.resetForm();

            expect(app.exerciseCount).toBe(0);
        });
    });
});
