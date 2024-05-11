import { ctx, canvas } from "./settings.mjs";
import { getDistance } from "./utils.mjs";

/**
 * Represents a particle with physical properties and behaviors such as
 * movement and collision handling within a bounded canvas area.
 */
export default class Particle {
    /**
     * Initializes a new instance of the Particle class with random properties.
     */
    constructor() {
        this.radius = 15;
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.text = 'K';  // Default text displayed on the particle
        this.mass = 1;  // Static mass for simplicity, could be randomized for varied dynamics
        this.velocity = {
            dx: Math.random() * 5 - 1.5,  // Horizontal velocity component
            dy: Math.random() * 5 - 1.5,  // Vertical velocity component
        };
    };

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();

        // Draw text on the particle
        ctx.font = `${this.radius / 2}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';  // Corrects property name to 'textBaseline'
        ctx.fillText(this.text, this.x - 3, this.y + 3);
    };

    /**
     * Updates the particle's position and handles collisions and boundary interactions.
     * @param {Array<Particle>} particles - The list of all particles for collision detection.
     */
    update(particles) {
        this.draw();

        // Collision detection and handling
        particles.forEach((other) => {
            if (this !== other && this.distance(this.x, other.x, this.y, other.y) <= this.radius * 2) {
                this.handleCollision(this, other);
            }
        });

        // Boundary conditions
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.velocity.dx = -this.velocity.dx;
        }
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
            this.velocity.dy = -this.velocity.dy;
        }

        // Update position
        this.x += this.velocity.dx;
        this.y += this.velocity.dy;
    };

    /**
     * Handles the collision between two particles by adjusting their velocities.
     * @param {Particle} first - The first particle involved in the collision.
     * @param {Particle} second - The second particle involved in the collision.
     */
    handleCollision(first, second) {
        const angle = -Math.atan2(second.y - first.y, second.x - first.x);
        const firstV = this.rotate(first.velocity, angle);
        const secondV = this.rotate(second.velocity, angle);

        const v1 = {
            dx: firstV.dx * (first.mass - second.mass) / (first.mass + second.mass) + secondV.dx * 2 * second.mass / (first.mass + second.mass),
            dy: firstV.dy
        };

        const v2 = {
            dx: secondV.dx * (second.mass - first.mass) / (second.mass + first.mass) + firstV.dx * 2 * first.mass / (second.mass + first.mass),
            dy: secondV.dy
        };

        const final1 = this.rotate(v1, -angle);
        const final2 = this.rotate(v2, -angle);

        first.velocity.dx = final1.dx;
        first.velocity.dy = final1.dy;
        second.velocity.dx = final2.dx;
        second.velocity.dy = final2.dy;
    };

    /**
     * Rotates a velocity vector by a given angle.
     * @param {object} velocity - The velocity vector to rotate.
     * @param {number} angle - The angle in radians to rotate the vector.
     * @returns {object} The rotated velocity vector.
     */
    rotate(velocity, angle) {
        return {
            dx: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
            dy: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle)
        };
    };

    /**
     * Calculates the distance between two points.
     * @param {number} x1 - The x-coordinate of the first point.
     * @param {number} x2 - The x-coordinate of the second point.
     * @param {number} y1 - The y-coordinate of the first point.
     * @param {number} y2 - The y-coordinate of the second point.
     * @returns {number} The distance between the two points.
     */
    distance(x1, x2, y1, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };
}

/**
 * Draws lines between close particles to visualize their relationships.
 * @param {Array<Particle>} particles - The list of particles to draw lines between.
 */
export function handleParticles(particles) {
    ctx.beginPath();
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((other) => {
            const distance = getDistance(particle.x, other.x, particle.y, other.y);
            if (distance < 100) {
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
            }
        });
    });
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
};
