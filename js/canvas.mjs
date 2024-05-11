import Cache from "./cache.mjs";
import CanvasManager from "./canvasManager.mjs";
import ImageProcessor from "./image.mjs";

/**
 * The Canvas class encapsulates the functionality of a drawing canvas within a web application.
 * It integrates user interactions for drawing, utilizes a caching system for undo/redo functionality,
 * and handles dynamic adjustments such as changing drawing colors and line widths. This class
 * demonstrates effective use of HTML5 Canvas API along with event-driven programming to enable
 * interactive graphical applications.
 *
 * Responsibilities:
 *  - Initialize and configure the HTML canvas element.
 *  - Handle user input for drawing operations via mouse events.
 *  - Support undo and redo actions using the Cache class to manage state history.
 *  - Provide methods to change drawing attributes like color and line width.
 *  - Allow clearing of the canvas and resetting to a default state.
 *
 * The class uses event listeners to manage mouse interactions for drawing lines and shapes on the canvas.
 * It also interfaces with the Cache class to provide a history stack that records each state change,
 * enabling the user to revert or reapply changes.
 */

export default class Canvas {
    /**
     * Initializes a new instance of the drawing application class, setting up the canvas,
     * related controls, and interaction mechanisms.
     * 
     * This constructor performs several key initializations:
     * - Sets up the canvas manager to handle drawing operations.
     * - Retrieves and initializes UI controls such as buttons for clearing the canvas, undo/redo actions,
     *   and color selection.
     * - Initializes components for image processing and saving.
     * - Sets default properties for drawing such as color and line width.
     * - Establishes mouse interaction states to track drawing status.
     * - Prepares the undo/redo functionality by initializing a cache system.
     * - Attaches event listeners to handle user inputs and actions.
     * 
     * @returns {void}
     */
    constructor() {
        // Element and context setup
        this.manager = new CanvasManager("canvas");
        this.ctx = this.manager.getContext();
        this.canvas = this.manager.canvas;

        // Buttons and inputs for colors and redu/undo
        this.clearBtn = document.querySelector("#clearBtn");
        this.undoBtn = document.querySelector("#undo");
        this.redoBtn = document.querySelector("#redo");
        this.colorInput = document.querySelector("#color")
        this.link = document.querySelector("#download");

        // Image data variables
        this.saveButton = document.querySelector("#saveButton");
        this.imageContainer = document.querySelector("#image-container");
        this.imageProcessor = new ImageProcessor(this.saveButton, this.imageContainer);
        this.imageData = '';

        // Set the canvas dimensions to fill the window
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;

        // Default styling and state
        this.color = "white";  // Default drawing color
        this.lineWidth = 2;  // Default line width for drawing

        // Mouse interaction state
        this.mouse = {
            x: null,
            y: null,
            isDrawing: false,  // Flag to track whether the drawing is active
        };

        // Initialize the Cache object for undo/redo functionality
        this.memory = new Cache();

        // Setup event listeners for user interaction
        this.initListeners();
    }

    /**
     * Initializes all necessary event listeners for the canvas to handle mouse interactions and control buttons
     * for various operations like drawing, clearing, undoing, redoing, and color changes.
     * This method sets up listeners for:
     * - Mouse events on the canvas for starting, moving, ending, and leaving the drawing session.
     * - Button clicks for clearing the canvas, undoing, and redoing actions.
     * - Color changes from predefined color options and resizing of the window.
     * 
     * @returns {void}
     */
    initListeners() {
        this.canvas.addEventListener("mousedown", this.startDraw.bind(this), false);
        this.canvas.addEventListener("mousemove", this.draw.bind(this), false);
        this.canvas.addEventListener("mouseup", this.setActiveStatus.bind(this), false);
        this.canvas.addEventListener("mouseout", this.setActiveStatus.bind(this), false);
        this.canvas.addEventListener("dblclick", e => alert([e.clientX, e.clientY]), false)
        this.clearBtn.addEventListener("click", this.clearCanvas.bind(this), false);
        this.undoBtn.addEventListener("click", this.undo.bind(this), false);
        this.redoBtn.addEventListener("click", this.redo.bind(this), false);
        this.saveButton.addEventListener("click", (e) => this.save(), false);
        this.colorInput.addEventListener("change", (e) => this.changeColor(e.target.value), false);
        window.addEventListener("resize", this.handleResize.bind(this), false);
        
        // Loop through all elmeents with className color
        document.querySelectorAll('.color').forEach(colorSpan => {
            // Get the background color from each span that was clicked
            colorSpan.addEventListener('click', (e) => {
                // Change the brush color to the color of the span
                this.changeColor(e.target.style.backgroundColor);
            }, false);
        });

        // Handle click event for saveImage button
        this.link.addEventListener("click", (e) => { 
            this.downloadImage()
            console.log(this.imageData)
        }, false)
    }

    /**
     * Initiates the drawing process on the canvas. This function is triggered by a mousedown event.
     * It sets the initial position for drawing and prepares the canvas to begin a path.
     * 
     * @param {MouseEvent} e - The event object containing the mouse coordinates.
     * @returns {void}
     */
    startDraw(e) {
        this.mouse.isDrawing = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.ctx.stroke();
    }

    /**
     * Handles the mouse movement for drawing lines on the canvas when the mouse is pressed and moved.
     * This function draws a line from the last position to the new position as the mouse moves,
     * continuously updating the line path and applying styles like color and width.
     * 
     * @param {MouseEvent} e - The event object containing the mouse coordinates.
     * @returns {void}
     */
    draw(e) {
        if (this.mouse.isDrawing) {
            this.ctx.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.stroke();
            this.save();
        }
    }

    /**
     * Clears the canvas to its default state and resets the undo/redo history.
     * This function performs the following actions:
     * - Sets the canvas fill style to the current background color of the canvas.
     * - Clears the entire canvas area to remove any existing drawing.
     * - Fills the cleared canvas area with the current background color, effectively resetting the visual state.
     * - Clears any images displayed in the associated image container.
     * - Resets the memory cache used for undo/redo operations, clearing all historical states.
     * 
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.fillStyle = this.canvas.style.backgroundColor;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageContainer.innerHTML = '';
        this.memory.reset();
    }

    /**
     * Undoes the last action by restoring the previous canvas state from the history.
     * This function retrieves the last saved state before the most recent change and applies it to the canvas, allowing the user to revert one step backward in their drawing actions.
     * - Retrieves the previous state from the memory cache.
     * - If a previous state exists, it uses putImageData to paint that state onto the canvas, effectively undoing the last change.
     * 
     * @returns {void}
     */
    undo() {
        const prevData = this.memory.undo();
        if (prevData) {
            this.ctx.putImageData(prevData, 0, 0);
            this.save();
        }
    }

    /**
     * Redoes an undone action by restoring the next canvas state from the history.
     * This function retrieves the next state from the memory cache that was undone previously and re-applies it to the canvas, allowing the user to step forward to a state that was undone.
     * - Retrieves the next state from the memory cache.
     * - If the next state exists, it uses putImageData to paint that state onto the canvas, effectively redoing the action.
     * 
     * @returns {void}
     */
    redo() {
        const nextData = this.memory.redo();
        if (nextData) {
            this.ctx.putImageData(nextData, 0, 0);
            this.save();
        }
    }

    /**
     * Captures the current state of the canvas and prepares it for display and download.
     * 
     * This function performs the following steps:
     * 1. Creates a new 'a' element to facilitate image downloading.
     * 2. Converts the canvas content to a Data URL format, capturing the current visual state.
     * 3. Creates a new Image element and assigns the Data URL to its source.
     * 4. Sets up event listeners to manage the image loading process:
     *    - On successful load, the image is added to a specified container on the page, 
     *      replacing any previously displayed images.
     *    - On error, logs the error to the console.
     * 5. Sets the dimensions of the image for consistent display.
     * 6. Returns the Data URL of the image, which can be used for downloading or further processing.
     * 
     * @returns {string} The Data URL of the current canvas image.
     */
    save() {
        const imageData = this.canvas.toDataURL();
        const image = new Image();
        this.imageData = imageData;

        image.onload = () => {
            console.log("Image loaded successfully");
            this.imageContainer.innerHTML = '';  // Clear previous images
            this.imageContainer.appendChild(image);  // Append new image
        };

        image.onerror = (e) => {
            console.error("Failed to load the image", e);
        };

        image.src = imageData;
        image.style.height = '125px';
        image.style.width = '200px';

        return imageData;
    }

    /**
     * Initiates the download of the most recently captured canvas image.
     * 
     * Assumes that imageData has been previously set by the save function and uses this data to:
     * 1. Update the href attribute of a predefined 'a' element (this.link) with the image data URL.
     * 2. Set the intended filename for the downloaded image to 'canvas-image.png'.
     * 
     * This function does not directly invoke the download; it prepares the link which should be triggered
     * separately, typically through a user action like clicking a button.
     * 
     * @returns {void}
     */
    downloadImage() {
        const data = this.canvas.toDataURL();
        if (data !== null | undefined || data !== '') {
            this.imageData = data;
            this.link.href = this.imageData;
            this.link.download = 'canvas-image.png';
        }
    }

    /**
     * Finalizes the drawing process when the mouse button is released or the cursor leaves the canvas.
     * It also captures the current canvas state in the history for undo/redo functionality.
     * 
     * @param {MouseEvent} e - The event object that triggers the end of the drawing session.
     * @returns {void}
     */
    setActiveStatus(e) {
        this.mouse.isDrawing = false;
        // this.save();
        if (e.type !== "mouseout") {
            this.memory.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        }
    }

    /**
     * Responds to window resize events by adjusting the canvas dimensions to match the new window size.
     * After resizing the canvas, it reapplies the background style and calls redraw() to ensure that
     * any graphical elements are correctly scaled and positioned according to the new dimensions.
     * This ensures the canvas content remains consistent and visually correct after a resize event.
     *
     * @returns {void} Nothing is returned from this method.
     */
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = this.canvas.style.backgroundColor;
        this.redraw();
    }

    /**
     * Redraws the contents of the canvas to reflect any changes in canvas size or state.
     * This method is crucial for maintaining the visual integrity of the canvas content after
     * operations such as resizing. It should be tailored to redraw all necessary elements that were
     * previously rendered on the canvas. In its current implementation, it simply draws a fixed-size
     * rectangle as a placeholder, illustrating how elements might be redrawn.
     *
     * @returns {void} Nothing is returned from this method.
     */
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, 100, 100);
    }

    /**
     * Changes the current drawing color used on the canvas. This method updates the internal state
     * to reflect the new color choice, affecting all subsequent drawing operations. This allows dynamic
     * updates to the drawing color based on user interactions or other inputs.
     *
     * @param {string} newColor - The new color to be used for drawing. This should be a valid CSS color string.
     * @returns {void} Nothing is returned from this method.
     */
    changeColor(newColor) {
        this.color = newColor;
    }

}
