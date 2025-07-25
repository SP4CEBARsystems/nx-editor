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
        this.textarea.addEventListener("input", this.updateLineNumbers.bind(this));
        this.textarea.addEventListener("scroll", this.syncScroll.bind(this));

        // Initial draw
        this.updateLineNumbers();
    }

    getLineCount() {
        return this.textarea.value.split("\n").length;
    }

    /**
     * Updates the line numbers to match the number of lines in the textarea.
     */
    updateLineNumbers() {
        const totalLines = this.getLineCount();
        this.lineNumbers.innerHTML = "";
        for (let i = 1; i <= totalLines; i++) {
            const line = document.createElement("span");
            line.textContent = i.toString();
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

