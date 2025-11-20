# Contributing to Workout Tracker

Thank you for your interest in contributing to Workout Tracker! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Enhancements

We welcome feature suggestions! Please create an issue with:
- A clear, descriptive title
- Detailed description of the proposed feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive commit messages
- Update the README.md if you change functionality
- Add tests for new features
- Ensure all tests pass before submitting

#### Commit Message Format

```
type: brief description

Longer description if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add weight tracking for exercises
fix: resolve dark mode toggle persistence issue
docs: update README with new features
```

## Coding Standards

### JavaScript

- Use ES6+ features
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code style
- Avoid global variables when possible

### CSS

- Use CSS custom properties for theming
- Follow BEM naming convention where applicable
- Keep selectors specific but not overly complex
- Maintain responsive design principles

### HTML

- Use semantic HTML5 elements
- Ensure accessibility (ARIA labels, alt text, etc.)
- Keep structure clean and organized

## Testing

- Write tests for new features
- Ensure existing tests pass
- Run `npm test` before submitting PR
- Aim for good test coverage

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/workout-tracker.git
cd workout-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

4. Make your changes and test them

5. Run tests:
```bash
npm test
```

## Questions?

Feel free to create an issue with your question or reach out to the maintainers.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

Thank you for contributing! 🎉
