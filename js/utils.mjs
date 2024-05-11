/**
 * Handles the collision between two particle objects by adjusting their velocities
 * based on their masses and the angle of impact. This function modifies the velocities
 * of both particles directly to reflect the outcome of an elastic collision.
 *
 * @param {object} first - The first particle involved in the collision.
 * @param {object} second - The second particle involved in the collision.
 */
export default function handleCollision(first, second) {
    const dx = second.velocity.dx - first.velocity.dx; // Relative velocity in x direction
    const dy = second.velocity.dy - first.velocity.dy; // Relative velocity in y direction
    const xd = first.x - second.x; // Distance between particles in x direction
    const yd = first.y - second.y; // Distance between particles in y direction

    // Check if the particles are moving towards each other
    if (dx * xd + dy * yd >= 0) {
        // Calculate the angle of collision
        const angle = -Math.atan2(second.y - first.y, second.x - first.x);

        // Masses used for calculating resultant velocities
        const firstMass = first.mass;
        const secondMass = second.mass;

        // Rotate particle velocities
        const firstV = rotate(first.velocity, angle);
        const secondV = rotate(second.velocity, angle);

        // Velocity calculations using one-dimensional elastic collision equations
        const v1 = {
            dx: firstV.dx * (firstMass - secondMass) / (firstMass + secondMass) + secondV.dx * 2 * firstMass / (firstMass + secondMass),
            dy: firstV.dy
        };
        const v2 = {
            dx: secondV.dx * (secondMass - firstMass) / (firstMass + secondMass) + firstV.dx * 2 * secondMass / (firstMass + secondMass),
            dy: secondV.dy
        };

        // Rotate velocities back and update original particles
        const final1 = rotate(v1, -angle);
        const final2 = rotate(v2, -angle);

        first.velocity.dx = final1.dx;
        first.velocity.dy = final1.dy;
        second.velocity.dx = final2.dx;
        second.velocity.dy = final2.dy;
    }
};

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The distance between the two points.
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
 * @param {number} angle - The angle in radians to rotate the vector.
 * @returns {object} The rotated velocity vector.
 */
function rotate(velocity, angle) {
    const rotatedVelocity = {
        dx: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
        dy: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle),
    };
    return rotatedVelocity;
};
