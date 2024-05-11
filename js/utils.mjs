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
export function handleCollision(first, second) {
    // Calculate the angle between the particles' centers to align the collision axis with the x-axis
    const angle = -Math.atan2(second.y - first.y, second.x - first.x);

    // Rotate the velocity vectors to simplify the collision to a one-dimensional problem along the x-axis
    const firstV = rotate(first.velocity, angle);
    const secondV = rotate(second.velocity, angle);

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
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param {int} x1 - The x-coordinate of the first point.
 * @param {int} x2 - The x-coordinate of the second point.
 * @param {int} y1 - The y-coordinate of the first point.
 * @param {int} y2 - The y-coordinate of the second point.
 * @returns {int} The distance between the two points.
 */
export function getDistance(x1, x2, y1, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};

/**
 * Rotates a velocity vector by a specified angle. This is used to simplify the collision
 * handling calculations by aligning the collision along the x-axis.
 *
 * @param {object} velocity - The original velocity vector {dx, dy}.
 * @param {int} angle - The angle in radians to rotate the vector.
 * @returns {object} The rotated velocity vector.
 */
function rotate(velocity, angle) {
    const rotatedVelocity = {
        dx: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
        dy: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle),
    };
    return rotatedVelocity;
};

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
