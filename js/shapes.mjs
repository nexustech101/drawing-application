// Abstract Shape class
class Shape {
    constructor(x, y) {
        if (new.target === Shape) {
            throw new TypeError("Cannot construct Shape instances directly");
        }
        this.x = x;
        this.y = y;
        this.isResizing = false;
    }

    draw(ctx) {
        throw new Error("Method 'draw()' must be implemented.");
    }

    resize() {
        throw new Error("Method 'resize()' must be implemented.");
    }

    contains(point) {
        throw new Error("Method 'contains()' must be implemented.");
    }
}

// Square class
class Square extends Shape {
    constructor(x, y, sideLength) {
        super(x, y);
        this.sideLength = sideLength;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.sideLength, this.sideLength);
        ctx.fill();
    }

    resize(newSize) {
        this.sideLength = newSize;
    }

    contains(point) {
        return point.x >= this.x && point.x <= this.x + this.sideLength &&
            point.y >= this.y && point.y <= this.y + this.sideLength;
    }
}

// Rectangle class
class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
    }

    contains(point) {
        return point.x >= this.x && point.x <= this.x + this.width &&
            point.y >= this.y && point.y <= this.y + this.height;
    }
}

// Additional classes for Circle, Triangle, and Line can be implemented similarly.

// Usage
let shapes = [
    new Square(10, 10, 100),
    new Rectangle(50, 50, 150, 100)
    // Add other shapes as needed
];

// Example function to draw all shapes on a canvas
function drawAllShapes(ctx, shapes) {
    shapes.forEach(shape => shape.draw(ctx));
}

// Function to handle canvas resizing
function resizeShape(shape, newSize) {
    if (shape instanceof Square || shape instanceof Circle) {
        shape.resize(newSize);
    } else if (shape instanceof Rectangle) {
        shape.resize(newSize.width, newSize.height);
    }
    // Implement other specific resize logic for different shapes
}
