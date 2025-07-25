import { mustGetElementById } from "./index.js";

/**
 * TextAreaLineNumbers provides dynamic line numbering for a textarea element,
 * including support for wrapped lines. It synchronizes line numbers with the
 * textarea's content and scroll position
 * for accurate measurement.
 *
 * @class
 * @example
 * // HTML:
 * // <textarea id="editor"></textarea>
 * // <div id="lineNumbers"></div>
 * //
 * // JS:
 * // const lineNumbers = new TextAreaLineNumbers("editor", "lineNumbers");
 *
 * @property {HTMLTextAreaElement} textarea - The textarea element being monitored.
 * @property {HTMLElement} lineNumbers - The container for displaying line numbers.
 *
 * @throws {Error} If required elements are not found.
 *
 * @param {[string, string]} ids - Array containing the IDs of the textarea and line number container.
 */
export default class TextAreaLineNumbers {
    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {HTMLElement} */
    lineNumbers;

    /** @type {number} */
    charWidth;

    /**
     * Initializes the TextAreaLineNumbers instance.
     * @throws {Error} If required elements are not found.
     * @param {[string, string]} ids - [textareaId, lineNumberContainerId]
     */
    constructor(...ids) {
        [this.textarea, this.lineNumbers] = /** @type {[HTMLTextAreaElement, HTMLElement]} */
            (ids.map(mustGetElementById));

        this.charWidth = this.measureCharWidth();
        this.textarea.addEventListener("input", this.updateLineNumbers.bind(this));
        this.textarea.addEventListener("scroll", this.syncScroll.bind(this));
        window.addEventListener("resize", this.updateLineNumbers.bind(this));

        this.updateLineNumbers();
    }

    getLineCount() {
        return this.textarea.value.split("\n");
    }

    /**
     * Calculates how many characters fit per line in the textarea.
     * Only works correctly with monospaced fonts.
     * this method appears to be inaccurate
     * @returns {number}
     */
    getCharactersPerLine() {
        // return 61;
        const contentWidth = this.textarea.clientWidth; // width excluding scrollbar, borders
        console.log('getCharactersPerLine', contentWidth / this.charWidth, contentWidth, this.charWidth)
        return Math.floor(contentWidth / this.charWidth);
    }

    /**
     * @returns {number} the measured width of a character in a monospaced font
     */
    measureCharWidth() {
        const style = getComputedStyle(this.textarea);
        // Create a span with one character
        const testSpan = document.createElement("span");
        testSpan.textContent = "M"; // use a wide monospaced char
        testSpan.style.font = style.font;
        testSpan.style.visibility = "hidden";
        document.body.appendChild(testSpan);

        const charWidth = testSpan.getBoundingClientRect().width;
        document.body.removeChild(testSpan);
        return charWidth;
    }

    /**
     * Calculates how many visual lines (wraps) a given line will occupy,
     * assuming no word breaking and a monospaced font.
     * @param {string} lineText
     * @returns {number}
     */
    calculateWraps(lineText) {
        const charsPerLine = this.getCharactersPerLine();
        if (!lineText.length) return 1;

        const words = lineText.split(/(\s+)/); // split by words & keep spaces
        let lineLength = 0;
        let wraps = 1;

        for (const word of words) {
            const wordLength = word.length;
            if (lineLength + wordLength > charsPerLine) {
                // If word doesn't fit, wrap
                if (word.trim().length > 0) {
                    wraps++;
                    lineLength = wordLength;
                } else {
                    // If it's just spaces that overflow, reset line length but don't count as new line
                    lineLength = 0;
                }
            } else {
                lineLength += wordLength;
            }
        }

        return wraps;
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
            // const wraps = Math.round(height / lineHeight) || 1;
            // const wraps = Math.floor(lineText.length / this.getCharactersPerLine()) + 1;
            const wraps = this.calculateWraps(lineText);
            for (let j = 0; j < wraps; j++) {
                const line = document.createElement("span");
                line.textContent = (j == 0) ? (i + 1).toString() : '';
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
