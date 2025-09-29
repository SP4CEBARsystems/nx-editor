/**
 * @type {HTMLIFrameElement}
 */
let iframe

/**
 * @type {Window}
 */
let targetWindow;

let doc

export function initButtons() {
    iframe = /** @type {HTMLIFrameElement}*/(document.getElementById('player'));
    
    // const file = "<!DOCTYPE html><html><head><style>body{margin:0;padding:1rem;font-family:sans-serif;}</style></head><body>Editable area. Click here or use buttons.</body></html>";
    // iframe.srcdoc = file;

    if (!iframe) {
        console.error('no iframe');
        return;
    }
    
    iframe.addEventListener('load', onIframeLoaded);
}

function onIframeLoaded(event) {
    // event.targetWindow
    if (iframe.contentWindow) targetWindow = iframe.contentWindow;
    const doc = iframe.contentDocument || targetWindow.document;
    // doc = targetWindow.document;

    if (!doc) {
        console.error('no doc');
        return;
    }
    
    // ✅ Set editable via JS — guaranteed to work
    doc.body.setAttribute('contenteditable', 'true');
    // iframe.focus();
    iframe.focus();
    
    // ✅ Confirm it worked
    console.log('Editable now?', doc.body.isContentEditable); // should be true
    
    // const iframe = document.querySelector("iframe");
    console.log('Body is contenteditable?', doc.body.isContentEditable);
    
    iframe.focus();
    setTimeout(() => {
        console.log('Active element in iframe:', doc.activeElement);
    }, 50);
    document.querySelectorAll("button[data-key]").forEach(handleButton);
    setupTextInputHandlers();
};

const keyCodeMap = {
  ArrowUp: 38,
  ArrowDown: 40,
  ArrowLeft: 37,
  ArrowRight: 39,
  Tab: 9,
  Enter: 13,
  Escape: 27,
  // ...add more as needed
};

function setupTextInputHandlers() {
    const keyInput = document.getElementById("playerTextInput");
    keyInput.addEventListener('keydown', (event) => {
        sendKeyboardKey(event, true);
    });
    keyInput.addEventListener('keyup', (event) => {
        sendKeyboardKey(event, false);
    });

    /**
     * 
     * @param {KeyboardEvent} event 
     * @param {boolean} isDown 
     */
    function sendKeyboardKey(event, isDown) {
        // console.log(`Key ${isDown? 'pressed' : 'lifted'}:`, event.key, event);
        // const eventData = {
        //     type: event.type,
        //     key: event.key,
        //     code: event.code,
        //     keyCode: event.keyCode,
        //     charCode: event.charCode,
        //     which: event.which,
        //     altKey: event.altKey,
        //     ctrlKey: event.ctrlKey,
        //     shiftKey: event.shiftKey,
        //     metaKey: event.metaKey,
        //     repeat: event.repeat,
        //     location: event.location,
        //     isTrusted: true,
        // };
        // iframe.contentWindow?.postMessage(eventData, '*');
        // iframe.focus();
        // if (targetWindow.document.activeElement.dispatchEvent && event) {
        //     console.log('objects, ', targetWindow.document.activeElement.dispatchEvent, event)
        //     targetWindow.document.activeElement.dispatchEvent(event);
        // }
        // sendKey(targetWindow, 'keyup', event.key);
    }
}

function getKeyCode(key) {
  return keyCodeMap[key] ?? key.toUpperCase().charCodeAt(0);
}

function createCustomKeyboardEvent(type, key) {
    const code = getKeyCode(key);
    return new KeyboardEvent(type, {
        key,
        keyCode: code,    // legacy
        which: code,      // legacy
        bubbles: true,
        cancelable: true,
        composed: true
    });
}

function createNormalKeyboardEvent(type, key) {
    const code = getKeyCode(key);
    return new KeyboardEvent(type, {
        key,
        keyCode: code,    // legacy
        which: code,      // legacy
        bubbles: true,
        cancelable: true,
        composed: true,

        // code: `key${code}`,
        // isTrusted: true,
    });
}

function sendKey(targetWindow, type, key) {
    iframe.focus();
    const event = createCustomKeyboardEvent(type, key)
    targetWindow.document.activeElement.dispatchEvent(event);
    console.log(type, key, targetWindow, iframe);
}

/**
 * 
 * @param {Element} button 
 */
function handleButton(button) {
    let key = button.dataset.key;
    console.log('handling', key);

    // button.addEventListener('mousedown', () => {
    //  sendKey(targetWindow, 'keydown', key);
    // });

    // button.addEventListener('mouseup', () => {
    //  sendKey(targetWindow, 'keyup', key);
    // });

    // button.addEventListener('mouseleave', () => {
    //  sendKey(targetWindow, 'keyup', key);
    // });

    button.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        iframe.focus();
        sendKey(targetWindow, 'keydown', key);
    });

    button.addEventListener('pointerup', (e) => {
        e.preventDefault();
        iframe.focus();
        sendKey(targetWindow, 'keyup', key);
    });

    button.addEventListener('touchstart', e => {
        e.preventDefault();
        sendKey(targetWindow, 'keydown', key);
    }, { passive: false });

    button.addEventListener('touchend', e => {
        e.preventDefault();
        sendKey(targetWindow, 'keyup', key);
    });
}