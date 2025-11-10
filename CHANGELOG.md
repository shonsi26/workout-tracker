# Changelog

All notable changes to the Workout Tracker project will be documented in this file.

## [1.1.0] - 2024-12-19

### Added
- **Dark Mode Support**: Toggle between light and dark themes with a button in the header
  - Theme preference is saved in localStorage
  - Smooth transitions between themes
  - Optimized color scheme for better readability in dark mode

- **Workout Statistics**: Real-time statistics display in the header
  - Total workouts counter
  - Total exercises counter across all workouts
  - Updates automatically when workouts are added/edited/deleted

- **Enhanced Animations**: Improved visual feedback
  - Slide-in animation for new exercise inputs
  - Fade-in-up animation for workout cards
  - Smooth hover effects and transitions

- **UI Improvements**:
  - CSS variables for consistent theming
  - Better color contrast in dark mode
  - Improved button hover states
  - More polished visual design

### Changed
- Updated README.md to reflect new features
- Refactored CSS to use CSS custom properties for theming
- Enhanced JavaScript with new methods for statistics and theme management

### Technical Details
- Added `updateStatistics()` method to track workout metrics
- Added `initDarkMode()` and `toggleDarkMode()` methods for theme management
- Implemented CSS custom properties for dynamic theming
- Added new animations using CSS keyframes

## [1.0.0] - Initial Release

### Features
- Create, edit, and delete workouts
- Add multiple exercises per workout
- Track sets, reps, and weight
- Local storage persistence
- Responsive design
- XSS protection
- Full test coverage