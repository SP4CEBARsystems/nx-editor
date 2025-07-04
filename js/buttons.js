let iframe, doc;
export function initButtons() {
    iframe = document.getElementById('player');
    
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
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    // doc = iframe.contentWindow.document;

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
};

function sendKey(targetWindow, type, key) {
    iframe.focus();
    const event = new KeyboardEvent(type, {
        key,
        bubbles: true,
        cancelable: true
    });
    targetWindow.document.activeElement.dispatchEvent(event);
    console.log(type, key, targetWindow, iframe);
}

function handleButton(button) {
    let key = button.dataset.key;
    const targetWindow = iframe.contentWindow;
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