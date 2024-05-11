# Drawing And Paint Application 

## Overview
This Drawing Application is an advanced JavaScript project that utilizes the HTML5 Canvas API and event-driven programming to facilitate interactive graphical applications. With features like undo/redo, image saving, and dynamic adjustments such as color and line width, the application offers a robust platform for creative expression.

## Modules
The application is structured into several modules, each designed to encapsulate specific functionalities:

### `canvas.mjs`
- **Purpose**: This module manages the drawing canvas and handles user interactions, ensuring a responsive and intuitive drawing experience.
- **Key Features**:
  - **Initialization and Configuration**: Sets up the HTML canvas element with appropriate dimensions and default settings.
  - **Drawing Operations**: Captures and processes mouse events to facilitate drawing operations.
  - **State Management**: Utilizes the `Cache` class to implement undo and redo actions, allowing users to navigate through their change history.
  - **Attribute Adjustments**: Enables dynamic modifications of drawing attributes such as color and line width through user interfaces.
  - **Canvas Reset**: Provides functionality to clear the canvas and revert it to its default state, ready for new drawings.

### `cache.mjs`
- **Purpose**: Manages the history of canvas states, providing a foundation for powerful undo and redo functionality.
- **Key Features**:
  - **History Tracking**: Uses a modified stack data structure to maintain a history of canvas states, optimizing memory and access speed.
  - **Undo/Redo Operations**: Allows users to step backwards or forwards through their drawing history with minimal latency.
  - **History Reset**: Clears the history stack when significant changes are made, such as clearing the canvas or starting a new project.

## Features

### Drawing
- **Interactive Drawing**: Start drawing with a simple mouse press and see your art take shape as you move the cursor. The application renders the stroke in real-time, applying the currently selected color and line width.

### Undo/Redo
- **History Navigation**: Each action on the canvas is recorded, allowing users to undo or redo steps seamlessly.

### Color and Line Width Adjustment
- **Customization Tools**: Easily adjust the drawing color and line width through intuitive user interface controls, enhancing creativity and control over the artwork.

### Saving Images
- **Export Options**: Save the current state of the canvas as an image file, providing users with a downloadable copy of their artwork.

### Clear Canvas
- **Quick Reset**: Users can clear the canvas at any point, enabling them to start over with a clean slate without needing to manually erase or adjust existing drawings.

## Setup and Usage
- **Installation**: Integrate the modules into your project environment by including them in your HTML or JavaScript setup.
- **Initialization**: Instantiate the `Canvas` class to activate the canvas and begin interacting with the application. See `canvas.mjs` for implementation details and examples.

## Future Features
- **Shape Tools**: Introduce tools for creating and manipulating geometric shapes, offering users more control and variety in their drawings.
- **Advanced Image Processing**: Develop additional features for image processing to allow more complex graphic editing capabilities, such as filters and effects.

