import Canvas from './canvas.mjs';
import CanvasManager from './canvasManager.mjs';
import Particle from './shapes.mjs';
import { handleCollision, getDistance } from './utils.mjs';

const manager = new CanvasManager("canvas");
const canvas = manager.canvas;
const ctx = manager.getContext();
const particles = [];

// Instantiates the Canvas class, effectively starting the application.
window.addEventListener("DOMContentLoaded", () => {
    const canvasApp = new Canvas();

    function init() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(particles));
        };
    };

    function mainLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(particles);
        };
        requestAnimationFrame(mainLoop);
    };

    init();
    mainLoop();

});