/**
 * @class CodeSaver
 * @classdesc Handles saving, downloading, and tracking changes for a textarea's content.
 * @property {HTMLTextAreaElement} textarea - The textarea element to save from.
 * @property {HTMLButtonElement} downloadBtn - The button element to trigger download.
 * @property {string} storageKey - The key used for localStorage.
 * @property {string} lastSavedText - The last saved text value.
 */
export default class CodeSaver {
    /**
     * Creates an instance of CodeSaver.
     * @param {string} textareaId - The ID of the textarea element.
     * @param {string} downloadBtnId - The ID of the download button element.
     * @param {string} uploadBtnId - The key for localStorage.
     * @param {string} uploadInputId - The key for localStorage.
     * @param {string} [storageKey='unsavedText'] - The key for localStorage.
     */
    constructor(textareaId, downloadBtnId, uploadBtnId, uploadInputId, storageKey = 'unsavedText') {
        this.textarea = document.getElementById(textareaId);
        this.downloadBtn = document.getElementById(downloadBtnId);
        this.uploadBtn = document.getElementById(uploadBtnId);
        this.uploadInput = document.getElementById(uploadInputId);
        this.storageKey = storageKey;
        this.lastSavedText = '';
        this.loadText();
        this.attachEvents();
    }

    /**
     * Loads text from localStorage into the textarea.
     * @returns {void}
     */
    loadText() {
        const savedText = localStorage.getItem(this.storageKey);
        if (savedText === null || savedText === '') {
            this.lastSavedText = this.textarea.value ?? '';
        } else {
            this.textarea.value = savedText;
            this.lastSavedText = savedText;
        }
    }

    /**
     * Saves the current textarea value to localStorage.
     * @returns {void}
     */
    saveToLocalStorage() {
        const text = this.textarea.value;
        localStorage.setItem(this.storageKey, text);
    }

    /**
     * Downloads the current textarea value as a text file.
     * @returns {void}
     */
    downloadTextAsFile() {
        const text = this.textarea.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'my_program.nx';
        link.click();
        this.markAsSaved();
    }

    /**
     * Marks the current textarea value as saved.
     * @returns {void}
     */
    markAsSaved() {
        this.lastSavedText = this.textarea.value;
    }

    /**
     * Checks if there are unsaved changes in the textarea.
     * @returns {boolean} True if there are unsaved changes, false otherwise.
     */
    hasUnsavedChanges() {
        const currentText = this.textarea.value;
        return currentText.trim().length > 0 && currentText !== this.lastSavedText;
    }

    handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.textarea.value = e.target.result;
            this.markAsSaved();
            this.saveToLocalStorage();
        };
        reader.readAsText(file);
    }


    /**
     * Warns if unsaved changes are found
     * @param {BeforeUnloadEvent} e 
     */
    beforeUnloadHandler(e) {
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    }

    /**
     * Attaches event listeners for saving, downloading, and unload warning.
     * @returns {void}
     */
    attachEvents() {
        // Save to localStorage on input
        this.textarea.addEventListener('input', this.saveToLocalStorage.bind(this));
        // Handle download button click
        this.downloadBtn.addEventListener('click', this.downloadTextAsFile.bind(this));
        // Warn on page unload if there are unsaved changes
        window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));

        if (this.uploadBtn && this.uploadInput) {
            this.uploadBtn.addEventListener('click', () => {
                this.uploadInput.click();
            });

            this.uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.name.endsWith('.nx')) {
                    this.handleFileUpload(file);
                } else {
                    alert('Please upload a valid .nx file');
                }
                e.target.value = ''; // Reset input so re-selecting the same file works
            });
        }
    }
}