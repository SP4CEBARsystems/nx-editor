/**
 * Fetch and extract the first .nx file URL from a LowRes NX topic using a CORS proxy.
 * @returns {Promise<string>}
 */
async function getTopNxUrl(targetUrl = 'https://lowresnx.inutilis.com/topic.php?id=3') {
    const html = await fetchTextWithProxy(targetUrl);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // Look for links ending in .nx
    const nxLink = Array.from(doc.querySelectorAll('a[href$=".nx"]'))[0];
    if (!nxLink) {
        throw new Error('No .nx link element found.');
    }
    const href = nxLink.getAttribute('href');
    if (!href) {
        throw new Error('No .nx link element href found.');
    }
    const fullUrl = href.startsWith('http') ? href : new URL(href, targetUrl).href;
    if (!fullUrl) {
        throw new Error('No .nx link found.');
    }
    return fullUrl;
}

async function fetchTextWithProxy(url) {
    const corsProxy = 'https://corsproxy.io/?'; // Lightweight proxy
    return await fetchText(corsProxy + encodeURIComponent(url));
}

/**
 * 
 * @param {string} paramName 
 * @returns {string | null}
 */
function getUriParam(paramName) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get(paramName);
}

async function fetchText(url){
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.text();
}

async function loadTopNxUrl(param){
    let url;
    if (/^https:\/\/lowresnx\.inutilis\.com\/topic\.php\?id=\d+$/.test(param)) {
        url = await getTopNxUrl(param);
    } else {
        url = param;
    }
    return await fetchTextWithProxy(url);
}

/**
 * 
 */
export default async function scraper() {
    const codeElement = /** @type {HTMLInputElement} */(document.getElementById('basic-code'));
    if (!codeElement) {
        throw new Error('no code element');
    }
    const param = getUriParam('url');
    if (!param) {
        throw new Error('no param');
    }
    const file = await loadTopNxUrl(param)
    codeElement.value = file;
    console.log('Top .nx file:', file);
}
    