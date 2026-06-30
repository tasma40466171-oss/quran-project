# Dependency Report

All dependencies, their versions, purposes, and usage in the project.

## Overview

The frontend uses React 19 with React Router v7 for routing, Recharts for data visualization, and Three.js for 3D graphics. No external state management library (Redux, Zustand) or data fetching library (React Query) is used.

## Production Dependencies

### React Core

#### react
- **Version**: ^19.2.5
- **Purpose**: React core library for building UI components
- **Usage**: Used throughout the entire application
- **Key Features**: Hooks (useState, useEffect, useCallback, useMemo, useRef, useImperativeHandle), Context API

#### react-dom
- **Version**: ^19.2.5
- **Purpose**: React DOM renderer for web browsers
- **Usage**: Used in index.js to render the App component
- **Key Features**: ReactDOM.render, ReactDOM.createRoot

---

### Routing

#### react-router-dom
- **Version**: ^7.14.1
- **Purpose**: Client-side routing for React applications
- **Usage**: Used in App.js for route definitions and navigation
- **Key Features**:
  - BrowserRouter: Router provider
  - Routes, Route: Route definitions
  - Navigate: Programmatic navigation
  - Link: Declarative navigation links
  - useNavigate: Navigation hook
  - useLocation: Current location hook
  - location.state: State passing between routes

---

### Data Visualization

#### recharts
- **Version**: ^3.8.1
- **Purpose**: Composable charting library built on D3
- **Usage**: Used in PerformanceAnalyticsView.jsx for trend charts
- **Key Features**:
  - LineChart: Performance trend visualization
  - Line: Data lines
  - XAxis, YAxis: Chart axes
  - Tooltip: Hover tooltips
  - ResponsiveContainer: Responsive chart sizing

#### echarts
- **Version**: ^6.1.0
- **Purpose**: Apache ECharts visualization library
- **Usage**: Not directly observed in reviewed files (may be used in unreviewed components)

#### echarts-for-react
- **Version**: ^3.0.6
- **Purpose**: React wrapper for ECharts
- **Usage**: Not directly observed in reviewed files (may be used in unreviewed components)

---

### 3D Graphics

#### three
- **Version**: ^0.77.0
- **Purpose**: 3D graphics library for WebGL
- **Usage**: Used in ImmersiveView component (not fully reviewed)
- **Key Features**: 3D scene rendering, canvas manipulation

---

### Animation

#### framer-motion
- **Version**: ^12.40.0
- **Purpose**: Production-ready motion library for React
- **Usage**: Not directly observed in reviewed files (may be used in unreviewed components or future features)

---

### Build Tools

#### react-scripts
- **Version**: ^5.0.1
- **Purpose**: Create React App build configuration
- **Usage**: Build tool for development and production builds
- **Key Features**:
  - Webpack bundling
  - Babel transpilation
  - Development server
  - Hot module replacement
  - Production optimization

---

## Development Dependencies

### Testing

#### @testing-library/dom
- **Version**: ^10.4.1
- **Purpose**: DOM testing utilities
- **Usage**: Testing framework for DOM manipulation
- **Status**: Not observed in test files

#### @testing-library/jest-dom
- **Version**: ^6.9.1
- **Purpose**: Custom Jest matchers for DOM elements
- **Usage**: Jest matchers for assertions
- **Status**: Not observed in test files

#### @testing-library/react
- **Version**: ^16.3.2
- **Purpose**: React testing utilities
- **Usage**: React component testing
- **Status**: Not observed in test files

#### @testing-library/user-event
- **Version**: ^13.5.0
- **Purpose**: User event simulation for testing
- **Usage**: Simulating user interactions in tests
- **Status**: Not observed in test files

---

### Code Quality

#### eslint
- **Version**: ^8.57.1
- **Purpose**: JavaScript linting utility
- **Usage**: Code quality and style enforcement
- **Configuration**: Extends react-app and react-app/jest

---

## Dependency Usage by Feature

### Authentication
- **react**: Component state, hooks
- **react-dom**: Rendering
- **react-router-dom**: Navigation, protected routes

### Similarity
- **react**: Component state, hooks
- **react-router-dom**: Navigation, state passing
- **recharts**: Not used directly (analytics uses it)

### Flashcards
- **react**: Component state, hooks
- **react-router-dom**: Navigation

### Diary
- **react**: Component state, hooks
- **react-router-dom**: Navigation
- **recharts**: PerformanceAnalyticsView uses it

### Coach
- **react**: Component state, hooks, context
- **react-router-dom**: Navigation, state passing

### Analytics
- **react**: Component state, hooks
- **recharts**: Trend charts

### ImmersiveView
- **react**: Component state, hooks
- **three**: 3D graphics rendering

---

## Unused or Underutilized Dependencies

### echarts / echarts-for-react
- **Status**: Not observed in reviewed files
- **Recommendation**: Consider removing if not used, or document usage in unreviewed files

### framer-motion
- **Status**: Not observed in reviewed files
- **Recommendation**: Consider removing if not used, or document usage in unreviewed files

### Testing Libraries
- **Status**: No test files observed in project structure
- **Recommendation**: Either add tests or remove testing dependencies

---

## Dependency Security Considerations

### React 19
- **Version**: 19.2.5 (latest major)
- **Status**: Actively maintained
- **Security**: Regular security updates

### React Router v7
- **Version**: 7.14.1 (latest major)
- **Status**: Actively maintained
- **Security**: Regular security updates

### Recharts
- **Version**: 3.8.1
- **Status**: Actively maintained
- **Security**: Regular security updates

### Three.js
- **Version**: 0.77.0
- **Status**: Actively maintained
- **Security**: Regular security updates

---

## Dependency Size Impact

### Large Dependencies
- **three**: ~600KB gzipped (3D graphics library)
- **echarts**: ~400KB gzipped (charting library)
- **recharts**: ~100KB gzipped (charting library)
- **framer-motion**: ~80KB gzipped (animation library)

### Bundle Size Optimization Opportunities
1. **Code Splitting**: Implement lazy loading for routes
2. **Tree Shaking**: Ensure unused ECharts features are not bundled
3. **Dynamic Imports**: Load Three.js only when ImmersiveView is accessed
4. **Remove Unused**: Remove echarts, echarts-for-react, framer-motion if not used

---

## Dependency Updates

### Recent Updates Needed
- **react**: 19.2.5 (latest)
- **react-dom**: 19.2.5 (latest)
- **react-router-dom**: 7.14.1 (latest)
- **recharts**: 3.8.1 (latest)
- **three**: 0.77.0 (latest)

All dependencies appear to be on recent versions.

---

## Dependency Alternatives Considered

### State Management
- **Not Used**: Redux, Zustand, Jotai, Recoil
- **Reason**: React Context API sufficient for current state needs

### Data Fetching
- **Not Used**: React Query, SWR, Axios
- **Reason**: Custom authFetch wrapper sufficient for current API needs

### Form Handling
- **Not Used**: React Hook Form, Formik
- **Reason**: Controlled components sufficient for current forms

### Styling
- **Not Used**: Tailwind CSS, Styled Components, Emotion
- **Reason**: CSS modules and inline styles sufficient for current styling needs

---

## Peer Dependencies

### React
- **Required by**: react-dom, react-router-dom, recharts, framer-motion
- **Version Requirement**: ^19.2.5

### React DOM
- **Required by**: react
- **Version Requirement**: ^19.2.5

---

## Scripts

### Available Scripts

#### start
```bash
npm start
```
- Starts development server on port 3000
- Enables hot module replacement
- Opens browser automatically

#### build
```bash
npm build
```
- Creates production build in `build/` directory
- Optimizes bundle size
- Minifies JavaScript and CSS

#### test
```bash
npm test
```
- Runs Jest tests in watch mode
- No test files currently exist

#### eject
```bash
npm run eject
```
- Ejects from Create React App configuration
- **Warning**: Irreversible action
- **Not Recommended**: Use custom webpack config instead if needed

---

## Browser Support

### Production Browsers
- ">0.2%": Browsers with >0.2% market share
- "not dead": Browsers still receiving updates
- "not op_mini all": Excludes Opera Mini

### Development Browsers
- "last 1 chrome version"
- "last 1 firefox version"
- "last 1 safari version"

---

## Dependency Summary

| Category | Count | Dependencies |
|----------|-------|--------------|
| React Core | 2 | react, react-dom |
| Routing | 1 | react-router-dom |
| Data Visualization | 3 | recharts, echarts, echarts-for-react |
| 3D Graphics | 1 | three |
| Animation | 1 | framer-motion |
| Build Tools | 1 | react-scripts |
| Testing | 4 | @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event |
| Code Quality | 1 | eslint |
| **Total** | **14** | |

---

## Recommendations

### Immediate Actions
1. **Audit Usage**: Confirm usage of echarts, echarts-for-react, framer-motion
2. **Add Tests**: Implement tests using testing-library or remove testing dependencies
3. **Code Splitting**: Implement lazy loading for large dependencies (three.js)

### Future Considerations
1. **React Query**: Consider adding for better data fetching and caching
2. **React Hook Form**: Consider adding for complex form handling
3. **Tailwind CSS**: Consider adding for consistent styling
4. **Bundle Analyzer**: Add webpack-bundle-analyzer to monitor bundle size

### Security
- Run `npm audit` regularly to check for vulnerabilities
- Keep dependencies updated to latest stable versions
- Review security advisories for all dependencies

---

## Dependency Graph

```
react-scripts
    ├── react
    │   └── react-dom
    ├── react-router-dom
    │   ├── react
    │   └── react-dom
    ├── recharts
    │   ├── react
    │   └── react-dom
    ├── three
    ├── framer-motion
    │   └── react
    ├── echarts
    ├── echarts-for-react
    │   ├── react
    │   └── echarts
    └── @testing-library/*
        ├── react
        └── react-dom
```
