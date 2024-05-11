/**
 * The Cache class implements a modified stack data structure specifically designed 
 * to manage the history of canvas states, allowing for efficient undo and redo operations. 
 * This class demonstrates the application of the Last In, First Out (LIFO) principle, 
 * central to stack operations, with enhancements to navigate forwards and backwards 
 * through the stack, thus enabling redo functionality alongside undo.
 *
 * Features:
 *  - Push: Adds a new canvas state to the history, automatically adjusting the history
 *    to ensure it only contains relevant states from the current point.
 *  - Undo: Moves backwards in the history to retrieve and return the previous state, 
 *    without removing the current state, allowing for potential redos.
 *  - Redo: Moves forwards in the history when possible, to reapply states that have 
 *    been undone.
 *  - Reset: Clears the entire history and resets the index, typically used when a 
 *    significant change occurs that invalidates past states.
 *
 * Usage:
 *  The class is utilized in applications requiring a record of states for the purpose
 *  of stepping backwards and forwards through those states, such as in graphic editors
 *  or any interactive environment where previous actions need to be reversible.
 */


export default class Cache {
    /**
     * Constructs a new instance of the Cache class, initializing an empty history stack
     * and setting the starting index to -1, indicating no states have been recorded yet.
     * This setup is essential for managing the undo and redo functionality within applications
     * that require historical state tracking, such as graphic editors or interactive tools.
     *
     * The constructor sets up the following properties:
     * - `data`: An array that will store the historical states of the canvas. Each state
     *   is expected to be of type ImageData, which contains the pixel data of the canvas at
     *   a given point in time.
     * - `index`: A numerical index that tracks the current position in the history. It is 
     *   initialized to -1 to indicate that there are no states in the history upon creation.
     *   This index will update as new states are pushed onto the stack or as undo/redo 
     *   operations are performed.
     *
     * The Cache class provides a structured way to navigate through these states using LIFO 
     * principles but with the ability to move both backwards and forwards, enhancing the 
     * traditional stack structure to suit interactive applications.
     * 
     * @returns {void}
     */
    constructor() {
        this.data = [];  // Holds the image data states of the canvas
        this.index = -1; // Tracks the current state in the history
    }

    /**
     * Pushes a new state onto the stack. If the current index is not at the last position,
     * it truncates the stack to the current index before pushing to ensure the redo history
     * is cleared when new actions are taken after an undo.
     *
     * @param {ImageData} data The canvas state to be pushed onto the stack.
     * @returns {void}
     */
    push(data) {
        this.index++;
        this.data.splice(this.index, this.data.length - this.index, data);
    }

    /**
     * Performs the undo operation by stepping back in the stack, decreasing the index
     * to access the previous state. It returns this state so that it can be restored.
     *
     * @returns {ImageData|null} The previous state from the stack or null if no previous state exists.
     */
    undo() {
        if (this.index > 0) {
            this.index--;
            return this.data[this.index];
        }
        return null;
    }

    /**
     * Performs the redo operation by stepping forward in the stack, if possible, 
     * increasing the index to access the next state.
     *
     * @returns {ImageData|null} The next state from the stack or null if no next state exists.
     */
    redo() {
        if (this.index < this.data.length - 1) {
            this.index++;
            return this.data[this.index];
        }
        return null;
    }

    /**
     * Resets the history by clearing the stack and reinitializing the index.
     * This is typically called when the canvas is cleared or restarted.
     * 
     * @returns {void}
     */
    reset() {
        this.data = [];  // Initializes the stack as an empty array.
        this.index = -1; // Sets the starting index to -1, indicating an empty history.
    }

}
