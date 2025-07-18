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
    .catch(error => console.log(error))
    .finally(() => {
        showPlayer();
        console.log('player shown');
    });
});

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
