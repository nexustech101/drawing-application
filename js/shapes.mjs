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
    constructor() {
        this.manager = new CanvasManager("canvas");
        this.ctx = this.manager.getContext();
        this.canvas = this.manager.canvas;
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.radius = 15; // Default radius of particles
        this.text = 'K';  // Default text displayed on the particle
        this.mass = 1;    // Assumes a default mass of 1 for simplicity
        this.velocity = {
            dx: Math.random() * 5 - 1.5,  // Initial horizontal velocity
            dy: Math.random() * 5 - 1.5,  // Initial vertical velocity
        };
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

        // Drawing text at the particle's center
        this.ctx.font = `${this.radius / 2}px Arial`;
        this.ctx.fillStyle = 'white';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x - 3, this.y + 3);
    }

    /**
     * Updates the particle's position based on its velocity, checks for collisions, and handles boundary interactions.
     * 
     * @param {Array<Particle>} particles - The list of all other particles to check for collisions.
     * @returns {void}
     */
    update(particles) {
        this.draw();

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
    }

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
    }

    /**
     * Calculates the Euclidean distance between two points.
     * @param {int} x1 - The x-coordinate of the first point.
     * @param {int} x2 - The x-coordinate of the second point.
     * @param {int} y1 - The y-coordinate of the first point.
     * @param {int} y2 - The y-coordinate of the second point.
     * @returns {int} The distance between the two points.
     */
    distance(x1, x2, y1, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

}

