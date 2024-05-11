export default class ImageProcessor {

    constructor(saveButton, imageContainer) {
        this.size = 20;
        this.data = new Array(this.size).fill(null);

        this.height = "100px";
        this.width = "100px";

        this.saveButton = saveButton;
        this.imageContainer = imageContainer;

        // this.saveButton.addEventListener("click", () => this.createImage(), false);
    }

    /**
     * Stores image data into the array and handles image operations.
     */
    set(imageData) {
        if (this.data.length < this.size) {
            this.data.push(imageData);
            this.loadAndDisplayImage(imageData);
        } else {
            console.error("Array is full, please resize.");
        }
    }

    /**
     * Loads and displays an image, then offers a download.
     */
    loadAndDisplayImage(imageData) {
        console.log("Loading image in loadAndDisplayImage() function...")
        const image = new Image();

        image.onload = () => {
            console.log("Image loaded successfully");
            this.imageContainer.innerHTML = '';  // Clear previous images
            this.imageContainer.appendChild(image);  // Append new image
        };

        image.onerror = (e) => {
            console.error("Failed to load the image", e);
        };

        image.src = imageData;
        image.style.height = this.height;
        image.style.width = this.width;
    }

    /**
     * Creates an image from the last stored data and initiates a download.
     */
    createImage() {
        if (this.data.length > 0) {
            this.loadAndDisplayImage(this.data[0]);
            this.downloadImage(this.data[0]);
        }
    }

    /**
     * Initiates a download of the provided image data.
     */
    downloadImage(imageData) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'canvas-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Retrieves the last image data stored.
     */
    getFirst() {
        return this.data.length > 0 ? this.data[this.data.length - 1] : null;
    }

    /**
     * Renders all stored images into the container.
     */
    renderAllImages() {
        if (this.capacity() > 1) {
            this.imageContainer.innerHTML = '';  // Clear previous images
            for (let i = 0; i < this.data.length; i++) {
                const newData = this.data[i];
                if (newData) {
                    const image = new Image();
                    image.onload = () => {
                        console.log("Image loaded successfully");
                        this.imageContainer.appendChild(image);  // Append images from array
                    };
                    image.onerror = (e) => {
                        console.error("Failed to load the image", e);
                    };
                    image.src = newData;
                    image.style.height = this.height;
                    image.style.width = this.width;
                }
            }
        }
    }

    /**
     * 
     * @returns Capacity of array
     */
    capacity() {
        return this.data.length;
    }

}