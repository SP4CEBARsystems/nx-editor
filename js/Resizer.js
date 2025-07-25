import { mustGetElementById } from "./index.js";

/**
 * Class for handling a draggable resizer between two elements.
 */
export default class Resizer {
    /**
     * Initializes the resizer and sets up event listeners.
     */
    constructor() {
        this.resizer = mustGetElementById('resizer');
        this.left = this.resizer.previousElementSibling;
        this.right = this.resizer.nextElementSibling;
        this.container = this.resizer.parentElement;
        this.isDragging = false;
        this.resizer.addEventListener('mousedown', this.startDrag.bind(this));
        this.resizer.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
        console.log('init drag successful');
    }

    /**
     * Starts the drag operation.
     * @param {MouseEvent | TouchEvent} e - The event object.
     */
    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        document.addEventListener('mousemove', this.onDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchmove', this.onDragTouch.bind(this), { passive: false });
        document.addEventListener('touchend', this.stopDrag.bind(this));
        console.log('startdrag successful');
    };

    /**
     * Stops the drag operation and removes event listeners.
     */
    stopDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        document.removeEventListener('touchmove', this.onDragTouch);
        document.removeEventListener('touchend', this.stopDrag);
    };

    /**
     * Handles mouse drag events to resize the left element.
     * @param {MouseEvent} e - The mouse event object.
     */
    onDrag(e) {
        if (!this.isDragging) return;
        const containerRect = this.container.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        // const minWidth = 100;
        const minWidth = 0;
        const maxWidth = containerRect.width - minWidth;
        
        console.log('ondrag', newLeftWidth, 'total:', newLeftWidth > minWidth && newLeftWidth < maxWidth, 'segments:', newLeftWidth > minWidth, '&&', newLeftWidth < maxWidth, 'values:', newLeftWidth, '>', minWidth, '&&', newLeftWidth, '<', maxWidth);
        if (newLeftWidth > minWidth && newLeftWidth < maxWidth) {
            console.log('valid ondrag', newLeftWidth);
            this.left.style.width = `${newLeftWidth}px`;
        }
    };

    /**
     * Handles touch drag events to resize the left element.
     * @param {TouchEvent} e - The touch event object.
     */
    onDragTouch(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.onDrag({ clientX: touch.clientX });
    };
}