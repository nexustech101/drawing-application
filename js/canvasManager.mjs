/**
 * Manages a canvas element for drawing and interactions in a web application.
 * This class encapsulates all aspects of canvas management including initial setup, dynamic resizing,
 * context retrieval, and clear operations. It provides a simplified interface for interacting with the
 * canvas, ensuring that the canvas element is always optimized for the current view and ready for rendering.
 *
 * Key Features:
 * - Initial Setup: Configures the canvas to full browser window size and sets a default background color.
 * - Dynamic Resizing: Adjusts the canvas dimensions automatically in response to window resizing to ensure
 *   that drawings scale correctly without distortion.
 * - Context Management: Provides easy access to the canvas's 2D rendering context, allowing other components
 *   of the application to perform drawing operations.
 * - Clear Operations: Offers a method to clear all content from the canvas, useful for reset or new drawing actions.
 *
 * This class is typically used in applications where canvas-based drawing or rendering is a core feature,
 * such as graphic design tools, games, or interactive educational platforms.
 */

export default class CanvasManager {
    /**
     * Initializes a new instance of the CanvasManager class.
     * 
     * @param {string} canvasId - The DOM ID of the canvas element this manager will control.
     * @returns {void}
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);  // Locate the canvas element by its ID.
        this.ctx = this.canvas.getContext('2d');  // Get the 2D rendering context for drawing on the canvas.
        this.initCanvas();  // Perform initial setup of the canvas dimensions and styles.
    }

    /**
     * Sets up the canvas dimensions and background color.
     * This method configures the canvas to occupy the full window and sets a default background color.
     * 
     * @returns {void}
     */
    initCanvas() {
        this.canvas.width = window.innerWidth;  // Set the canvas width to the width of the window.
        this.canvas.height = window.innerHeight;  // Set the canvas height to the height of the window.
        this.canvas.style.backgroundColor = '#1f1f1f';  // Set a dark background color for the canvas.
    }

    /**
     * Returns the 2D rendering context of the canvas, which can be used for drawing operations.
     * 
     * @returns {CanvasRenderingContext2D} The 2D context of the canvas.
     */
    getContext() {
        return this.ctx;  // Return the 2D rendering context.
    }

    /**
     * Clears all content from the canvas, effectively resetting it.
     * This method uses the clearRect function to clear the canvas, removing all drawings or content.
     * 
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // Clear the entire canvas area.
    }

}

