import { initButtons } from './buttons.js';
import CodeSaver from './CodeSaver.js';
import IframeResizer from "./IframeResizer.js";
import scraper from './scraper.js';

document.addEventListener("DOMContentLoaded", function() {
    const runShowPlayerElement = document.getElementById('runShowPlayer');
    runShowPlayerElement?.addEventListener('click', showPlayer);
    initButtons();
    new IframeResizer();
    const codeSaver = new CodeSaver('basic-code', 'download-button', 'uploadBtn', 'uploadInput');
    scraper()
    .then(() => codeSaver.markAsSaved())
    .catch(console.error)
    .finally(() => {
        showPlayer();
        console.log('player shown');
    });
    setupCursorCoordinatesDisplay();
});

function setupCursorCoordinatesDisplay() {
    const colDisplay = document.getElementById("cursorDisplayColumn");
    const lineDisplay = document.getElementById("cursorDisplayLine");
    const textarea = /** @type {HTMLTextAreaElement} */(document.getElementById("basic-code"));
    if (!textarea) {
        return
    }

    textarea.addEventListener('keyup', updateCursorInfo);
    textarea.addEventListener('click', updateCursorInfo);

    function updateCursorInfo() {
        if (!textarea || !colDisplay || !lineDisplay) {
            return
        }
        const pos = textarea.selectionStart;
        const textBeforeCursor = textarea.value.slice(0, pos);

        // Count lines
        const lines = textBeforeCursor.split('\n');
        const line = lines.length; // line number starts from 1
        const col = lines[lines.length - 1].length + 1; // chars after last line break

        lineDisplay.textContent = line.toString();
        colDisplay.textContent = col.toString();
    }
}

function showPlayer() {
    setPlayer(elementToBlob("basic-code"));
}

/**
 * 
 * @param {string} elementId 
 * @returns {string}
 */
function elementToBlob(elementId) {
    const textareaElement = /** @type {HTMLTextAreaElement|null} */ (document.getElementById(elementId));
    const code = textareaElement?.value?? '';
    const blob = new Blob([code], { type: "text/plain" });
    const dataUrl = URL.createObjectURL(blob);
    return dataUrl;
}

/**
 * 
 * @param {string} dataUrl 
 */
function setPlayer(dataUrl) {
    const player = /** @type {HTMLIFrameElement|null} */ (document.getElementById("player"));
    if (!player) {
        return;
    }
    player.removeAttribute("src");
    player.setAttribute("src", "package/index.html?p=" + dataUrl);
    player.focus();
}
