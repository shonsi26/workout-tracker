# 💪 Workout Tracker

A simple and intuitive web application to track your workout exercises, sets, and reps. Built with vanilla JavaScript, HTML, and CSS.

## Features

- ✅ Add exercises with custom sets and reps
- 📊 Real-time statistics tracking (total exercises, sets, and reps)
- 🌓 Dark mode toggle for comfortable viewing
- 💾 Local storage persistence - your workouts are saved automatically
- 🗑️ Easy exercise removal and clear all functionality
- 📱 Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- For running tests: Node.js and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workout-tracker
```

2. Open `index.html` in your web browser:
```bash
open index.html
```

That's it! No build process or dependencies required for the main application.

### Running Tests

If you want to run the test suite:

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

## Usage

1. **Add an Exercise**: Enter the exercise name, number of sets, and reps per set, then click "Add Exercise"
2. **View Statistics**: See your total exercises, sets, and reps update in real-time
3. **Remove Exercise**: Click the "Remove" button on any exercise card
4. **Clear All**: Use the "Clear All" button to reset your workout
5. **Toggle Dark Mode**: Click the "Toggle Dark Mode" button for a different theme

## Project Structure

```
workout-tracker/
├── index.html          # Main HTML structure
├── styles.css          # Styling and dark mode
├── script.js           # Application logic
├── script.test.js      # Jest tests
├── setup.js            # Test setup configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with custom properties for theming
- **JavaScript (ES6+)** - Application logic
- **Jest** - Testing framework
- **Local Storage API** - Data persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Future Enhancements

- Add weight tracking for exercises
- Workout history and calendar view
- Exercise categories and filtering
- Export workout data
- Progressive Web App (PWA) support
- Exercise timer/rest timer
