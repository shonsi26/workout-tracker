# 💪 Workout Tracker

A simple, elegant web application for tracking your fitness workouts. Create, edit, and manage your workout routines with ease.

## Features

- ✅ **Create Workouts** - Add new workouts with multiple exercises
- ✅ **Edit Workouts** - Modify existing workouts and track changes
- ✅ **Delete Workouts** - Remove workouts you no longer need
- ✅ **Exercise Management** - Add multiple exercises per workout with sets, reps, and weight
- ✅ **Local Storage** - All data persists in your browser
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Date Tracking** - Organize workouts by date
- ✅ **XSS Protection** - HTML escaping for security
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Workout Statistics** - View total workouts and exercises count
- ✅ **Enhanced Animations** - Smooth transitions and visual feedback

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** Browser LocalStorage
- **Testing:** Jest with jsdom
- **Build Tool:** npm

## Project Structure

```
workout-tracker/
├── index.html          # Main HTML file
├── script.js           # Core application logic
├── styles.css          # Styling
├── script.test.js      # Unit tests (34 tests)
├── package.json        # Dependencies and scripts
├── jest.config.js      # Jest configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Open in browser:
```bash
open index.html
```

## Usage

### Creating a Workout

1. Enter a **Workout Name** (e.g., "Chest Day")
2. Select a **Date**
3. Click **"+ Add Exercise"** to add exercises
4. For each exercise, enter:
   - Exercise Name (e.g., "Bench Press")
   - Sets (e.g., 3)
   - Reps (e.g., 10)
   - Weight (optional, e.g., "185 lbs")
5. Click **"Save Workout"**

### Editing a Workout

1. Click on a workout card to view details
2. Click **"Edit"** button
3. Modify the workout details
4. Click **"Save Workout"**

### Deleting a Workout

1. Click on a workout card to view details
2. Click **"Delete"** button
3. Confirm the deletion

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Test Coverage

- **34 unit tests** covering all major functionality
- **9 test suites** organized by feature
- **100% pass rate**

Test categories:
- Initialization
- Exercise Management
- Form Submission
- Workout Editing
- Workout Deletion
- LocalStorage Persistence
- HTML Escaping (Security)
- Modal Management
- Rendering
- Form Reset

## Data Structure

### Workout Object

```javascript
{
  id: "1705305600000",           // Unique timestamp-based ID
  name: "Chest Day",              // Workout name
  date: "2024-01-15",             // Date in YYYY-MM-DD format
  exercises: [                    // Array of exercises
    {
      name: "Bench Press",
      sets: 3,
      reps: 10,
      weight: "185 lbs"           // Optional
    }
  ],
  createdAt: "2024-01-15T10:00:00Z",  // ISO 8601 timestamp
  updatedAt: "2024-01-15T10:00:00Z"   // ISO 8601 timestamp
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- **XSS Protection** - All user input is HTML-escaped before rendering
- **Input Validation** - Form validation prevents invalid data
- **LocalStorage Isolation** - Data stored locally, not sent to servers

## API Reference

### WorkoutTracker Class

#### Constructor
```javascript
const tracker = new WorkoutTracker();
```

#### Methods

| Method | Description |
|--------|-------------|
| `addExerciseInput()` | Adds a new exercise input field to the form |
| `removeExerciseInput(exerciseId)` | Removes an exercise input field |
| `getExercisesFromForm()` | Extracts exercise data from form inputs |
| `handleFormSubmit(e)` | Handles form submission (create/update) |
| `resetForm()` | Clears all form fields |
| `renderWorkouts()` | Renders the workout list |
| `showWorkoutDetail(workoutId)` | Displays workout details in modal |
| `editWorkout()` | Loads workout data into form for editing |
| `deleteWorkout()` | Deletes a workout after confirmation |
| `closeModal()` | Closes the detail modal |
| `saveToLocalStorage()` | Persists workouts to browser storage |
| `loadFromLocalStorage()` | Loads workouts from browser storage |
| `escapeHtml(text)` | Escapes HTML special characters |

## Development

### Code Style

- ES6+ JavaScript
- Object-oriented design with classes
- Vanilla JavaScript (no frameworks)
- Semantic HTML5
- CSS Grid and Flexbox for layout

### Adding New Features

1. Create a new method in the `WorkoutTracker` class
2. Add corresponding unit tests in `script.test.js`
3. Run tests to ensure everything passes
4. Update this README if needed

## Known Limitations

- Data is stored locally in the browser (not synced across devices)
- Clearing browser data will delete all workouts
- No user authentication or cloud sync
- No export/import functionality

## Future Enhancements

- [ ] Cloud synchronization
- [ ] User authentication
- [ ] Export workouts to CSV/PDF
- [ ] Workout templates
- [ ] Advanced progress tracking and charts
- [x] Dark mode (Added in v1.1)
- [x] Basic statistics (Added in v1.1)
- [ ] Mobile app version

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with 💪 for fitness enthusiasts**
