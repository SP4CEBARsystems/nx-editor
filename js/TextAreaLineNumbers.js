import { mustGetElementById } from "./index.js";

/**
 * Class for managing line numbers for a textarea element.
 */
export default class TextAreaLineNumbers {
    /** @type {HTMLTextAreaElement} */
    textarea

    /** @type {HTMLElement} */
    lineNumbers

    /**
     * Initializes the TextAreaLineNumbers instance.
     * @throws {Error} If required elements are not found.
     * @param {[string, string]} ids
     */
    constructor(...ids) {
        [this.textarea, this.lineNumbers] = /** @type {[HTMLTextAreaElement, HTMLElement]} */
            (ids.map(mustGetElementById));
        this.textarea.oninput = this.updateLineNumbers.bind(this);
        this.textarea.onscroll = this.syncScroll.bind(this);
        // Initialize line numbers on load
        this.updateLineNumbers();
    }

    /**
     * Updates the line numbers to match the number of lines in the textarea.
     */
    updateLineNumbers() {
        const lines = this.textarea.value.split("\n").length;
        this.lineNumbers.innerHTML = "";
        for (let i = 1; i <= lines; i++) {
            const line = document.createElement("span");
            line.textContent = i;
            this.lineNumbers.appendChild(line);
        }
    }
    
    /**
     * Synchronizes the scroll position of the line numbers with the textarea.
     */
    syncScroll() {
        this.lineNumbers.scrollTop = this.textarea.scrollTop;
    }
}

