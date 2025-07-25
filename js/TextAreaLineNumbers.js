import { mustGetElementById } from "./index.js";

/**
 * Class for managing line numbers for a textarea element,
 * including support for wrapped lines.
 */
export default class TextAreaLineNumbers {
    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {HTMLElement} */
    lineNumbers;

    /**
     * Initializes the TextAreaLineNumbers instance.
     * @throws {Error} If required elements are not found.
     * @param {[string, string]} ids - [textareaId, lineNumberContainerId]
     */
    constructor(...ids) {
        [this.textarea, this.lineNumbers] = /** @type {[HTMLTextAreaElement, HTMLElement]} */
            (ids.map(mustGetElementById));
        this.textarea.addEventListener("input", this.updateLineNumbers.bind(this));
        this.textarea.addEventListener("scroll", this.syncScroll.bind(this));

        this.updateLineNumbers();
    }

    getLineCount() {
        return this.textarea.value.split("\n");
    }

    /**
     * Updates the line numbers, including wrapped lines.
     */
    updateLineNumbers() {
        const lines = this.getLineCount();
        this.lineNumbers.innerHTML = "";
        for (let i = 1; i <= lines.length; i++) {
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
