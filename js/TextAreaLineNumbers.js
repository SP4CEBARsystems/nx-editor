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

    /** @type {HTMLElement} */
    mirror;

    /**
     * Initializes the TextAreaLineNumbers instance.
     * @throws {Error} If required elements are not found.
     * @param {[string, string]} ids - [textareaId, lineNumberContainerId]
     */
    constructor(...ids) {
        [this.textarea, this.lineNumbers] = /** @type {[HTMLTextAreaElement, HTMLElement]} */
            (ids.map(mustGetElementById));
        this.mirror = mustGetElementById("mirror");

        this.copyStyles();
        this.textarea.addEventListener("input", this.updateLineNumbers.bind(this));
        this.textarea.addEventListener("scroll", this.syncScroll.bind(this));
        window.addEventListener("resize", this.updateLineNumbers.bind(this));

        this.updateLineNumbers();
    }

    getLineCount() {
        return this.textarea.value.split("\n");
    }

    /**
     * Copy computed styles from the textarea to the mirror div.
     */
    copyStyles() {
        const style = getComputedStyle(this.textarea);
        const propertiesToCopy = [
            "font", "padding", "border", "boxSizing", "lineHeight",
            "whiteSpace", "wordWrap", "letterSpacing", "width"
        ];

        for (const prop of propertiesToCopy) {
            this.mirror.style[prop] = style[prop];
        }

        this.mirror.style.whiteSpace = "pre-wrap";
        this.mirror.style.wordWrap = "break-word";
        this.mirror.style.overflowWrap = "break-word";
    }

    /**
     * Updates the line numbers, including wrapped lines.
     */
    updateLineNumbers() {
        const lines = this.getLineCount();
        this.lineNumbers.innerHTML = "";

        const lineHeight = parseFloat(getComputedStyle(this.textarea).lineHeight || "16");

        for (let i = 0; i < lines.length; i++) {
            const lineText = lines[i] || " ";
            this.mirror.textContent = lineText;

            const height = this.mirror.scrollHeight;
            const wraps = Math.round(height / lineHeight) || 1;

            for (let j = 0; j < wraps; j++) {
                const line = document.createElement("span");
                line.textContent = (i + 1).toString();
                this.lineNumbers.appendChild(line);
            }
        }
    }

    /**
     * Synchronizes the scroll position of the line numbers with the textarea.
     */
    syncScroll() {
        this.lineNumbers.scrollTop = this.textarea.scrollTop;
    }
}
