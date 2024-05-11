import CanvasManager from "./canvasManager.mjs";
import { getDistance } from "./utils.mjs";

/**
 * Represents a particle with dynamic behaviors such as movement and collision handling within a bounded canvas area.
 * Each particle has properties that define its physical characteristics and appearance on the canvas.
 */
export default class Particle {
    /**
     * Initializes a new instance of the Particle class with random properties and associates it with a canvas.
     */
    constructor(particles) {
        this.manager = new CanvasManager("canvas");
        this.ctx = this.manager.getContext();
        this.canvas = this.manager.canvas;
        this.color = "#CCC";

        // this.x = Math.random() * this.canvas.width;
        // this.y = Math.random() * this.canvas.height;

        this.radius = 15; // Default radius of particles
        this.text = 'K';  // Default text displayed on the particle
        this.mass = 1;    // Assumes a default mass of 1 for simplicity
        this.isInShape = false;
        this.velocity = {
            dx: Math.random() * 5 - 1.5,  // Initial horizontal velocity
            dy: Math.random() * 5 - 1.5,  // Initial vertical velocity
        };

        // Continuously attempt to place the particle at a non-overlapping position
        do {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
        } while (this.isOverlapping(particles));

        this.canvas.addEventListener("mousemove", e => {
            this.handleMouseMove(e);
        });
    }

    /**
     * Handles the mouse move event over the canvas. This function is bound to the mousemove event of the canvas
     * and is triggered every time the mouse moves within the canvas area. It calculates the mouse's position relative
     * to the canvas and determines if the mouse pointer is within the radius of this particle instance. Based on this,
     * it updates the isInShape property, which indicates whether the mouse is currently hovering over the particle.
     *
     * @param {MouseEvent} event - The MouseEvent object containing information about the mouse event, including
     *                             the coordinates of the mouse pointer relative to the entire viewport.
     * @returns {void}
     */
    handleMouseMove(event) {
        // Get the bounding rectangle of the canvas to calculate the mouse's relative position correctly.
        const rect = this.canvas.getBoundingClientRect();

        // Calculate the mouse's x and y coordinates within the canvas by adjusting with the rectangle's position.
        // This accounts for any offset of the canvas element within the view.
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Calculate the distance from the current particle's center to the mouse position. This uses the Euclidean
        // distance formula, sqrt((x2 - x1)^2 + (y2 - y1)^2), where (x1, y1) is the particle center and (x2, y2) is
        // the mouse position.
        const distance = this.distance(mouseX, this.x, mouseY, this.y);

        // Update isInShape based on whether the calculated distance is less than the radius of the particle.
        // If the distance is less than the radius, the mouse is considered to be within the shape (hovering over it).
        this.isInShape = distance < this.radius;
    }


    /**
     * Draws the particle on the canvas, including its color and any text label.
     */
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = this.color;
        this.ctx.stroke();
        this.ctx.fill();

        // // Drawing text at the particle's center
        // this.ctx.font = `${this.radius / 2}px Arial`;
        // this.ctx.fillStyle = 'white';
        // this.ctx.textBaseline = 'middle';
        // this.ctx.fillText(this.text, this.x - 3, this.y + 3);
    }

    /**
     * Updates the particle's position based on its velocity, checks for collisions, and handles boundary interactions.
     * 
     * @param {Array<Particle>} particles - The list of all other particles to check for collisions.
     * @returns {void}
     */
    update(particles) {
        this.draw();
        this.changeColor();

        // Check for collisions with other particles
        particles.forEach((other) => {
            if (this !== other && this.distance(this.x, other.x, this.y, other.y) <= this.radius * 2) {
                this.handleCollision(this, other);
            }
        });

        // Reflect off the edges of the canvas
        if (this.x + this.radius >= this.canvas.width || this.x - this.radius <= 0) {
            this.velocity.dx = -this.velocity.dx;
        }
        if (this.y + this.radius >= this.canvas.height || this.y - this.radius <= 0) {
            this.velocity.dy = -this.velocity.dy;
        }

        // Update position with current velocity
        this.x += this.velocity.dx;
        this.y += this.velocity.dy;
    }

    /**
     * Handles the collision between two particles by adjusting their velocities to conserve both momentum and kinetic energy.
     * The method first calculates the angle of collision to align the velocity vectors along this axis.
     * It then applies the one-dimensional elastic collision equations in this rotated frame before
     * converting the velocities back to the original coordinate system.
     * 
     * This process involves:
     * - Calculating the angle of collision based on the position of the two particles.
     * - Rotating the velocity vectors so that the collision can be treated as a one-dimensional problem along the x-axis.
     * - Using the conservation of momentum and kinetic energy to find the new velocities in the rotated frame.
     * - Rotating the velocities back to their original orientation.
     * 
     * The method ensures that the particles reflect realistically off each other while preserving the total kinetic energy and momentum.
     *
     * @param {Particle} first - The first particle involved in the collision. This particle's velocity will be updated directly.
     * @param {Particle} second - The second particle involved in the collision. This particle's velocity will also be updated directly.
     * @returns {void}
     */
    handleCollision(first, second) {
        // Calculate the angle between the particles' centers to align the collision axis with the x-axis
        const angle = -Math.atan2(second.y - first.y, second.x - first.x);

        // Rotate the velocity vectors to simplify the collision to a one-dimensional problem along the x-axis
        const firstV = this.rotate(first.velocity, angle);
        const secondV = this.rotate(second.velocity, angle);

        // Apply the one-dimensional elastic collision equations to calculate the new velocities
        const v1 = {
            dx: firstV.dx * (first.mass - second.mass) / (first.mass + second.mass) + secondV.dx * 2 * second.mass / (first.mass + second.mass),
            dy: firstV.dy  // The y component remains unchanged because there is no force applied in the y-direction
        };
        const v2 = {
            dx: secondV.dx * (second.mass - first.mass) / (first.mass + second.mass) + firstV.dx * 2 * first.mass / (second.mass + first.mass),
            dy: secondV.dy  // The y component remains unchanged
        };

        // Rotate the new velocities back to the original coordinate system
        const final1 = this.rotate(v1, -angle);
        const final2 = this.rotate(v2, -angle);

        // Update the particles' velocities with the new computed values
        first.velocity.dx = final1.dx;
        first.velocity.dy = final1.dy;
        second.velocity.dx = final2.dx;
        second.velocity.dy = final2.dy;
    };

    /**
     * Rotates a velocity vector by a specified angle.
     * 
     * @param {object} velocity - The velocity vector to rotate.
     * @param {int} angle - The angle in radians to rotate the vector.
     * @returns {object} The rotated velocity vector.
     */
    rotate(velocity, angle) {
        return {
            dx: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
            dy: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle)
        };
    };

    /**
     * Calculates the Euclidean distance between two points.
     * 
     * @param {int} x1 - The x-coordinate of the first point.
     * @param {int} x2 - The x-coordinate of the second point.
     * @param {int} y1 - The y-coordinate of the first point.
     * @param {int} y2 - The y-coordinate of the second point.
     * @returns {int} The distance between the two points.
     */
    distance(x1, x2, y1, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };

    /**
     * Checks if the newly created particle overlaps with any existing particles.
     * 
     * @param {Array<Particle>} particles - The list of all existing particles.
     * @returns {boolean} True if there is an overlap, false otherwise.
     */
    isOverlapping(particles) {
        for (let i = 0; i < particles.length; i++) {
            const distance = this.distance(this.x, particles[i].x, this.y, particles[i].y);

            // Check if the distance is less than the sum of their radii
            if (distance <= this.radius + particles[i].radius) {
                return true;
            }
        }
        return false;
    };

    /**
     * Changes the color of the particle based on its hover state. This method is designed to visually indicate
     * whether the mouse is currently hovering over the particle by changing its color.
     *
     * The function checks the value of `this.isInShape`, which is a boolean indicating whether the mouse pointer
     * is within the particle's radius. If `this.isInShape` is true, indicating that the mouse is hovering over
     * the particle, the color is set to blue ('#0000ff'). If false, the color reverts to a default color ('#CCC').
     *
     * This method is typically called within the `update` method of the Particle class, allowing the particle's
     * color to dynamically change in response to mouse movements over the canvas.
     * 
     * @returns {void}
     */
    changeColor() {
        this.isInShape ? this.color = "#0000ff" : this.color = "#CCC";
    };
}
