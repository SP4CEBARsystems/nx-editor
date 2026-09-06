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

/**
 * 
 * @param {string} url url to fetch text from through corsproxy
 * @returns text from url
 */
async function fetchTextWithProxy(url) {
    const encodedUrl = encodeURIComponent(url);
    const apiKey = 'e58d94d9';
    const proxyUrl = `https://corsproxy.io/?key=${apiKey}&url=${encodedUrl}`; // Lightweight proxy
    return await fetchText(proxyUrl);
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

/**
 * 
 * @param {string} url url to fetch text from
 * @returns text from url
 */
async function fetchText(url){
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.text();
}

/**
 * 
 * @inputUrl {string} inputUrl parameter key name from uri
 * @returns fetched text
 */
async function loadTopNxUrl(inputUrl){
    let url;
    const urlSupportTestingRegex = /^https:\/\/lowresnx\.inutilis\.com\/topic\.php\?id=\d+$/;
    if (urlSupportTestingRegex.test(inputUrl)) {
        url = await getTopNxUrl(inputUrl);
    } else {
        url = inputUrl;
    }
    return await fetchTextWithProxy(url);
}

/**
 * Scrapes and loads NX files from NX pages
 */
export default async function scraper() {
    const codeElement = /** @type {HTMLInputElement} */(document.getElementById('basic-code'));
    if (!codeElement) {
        throw new Error('no code element');
    }
    const inputUrl = getUriParam('url');
    if (!inputUrl) {
        throw new Error('no param');
    }
    const file = await loadTopNxUrl(inputUrl)
    codeElement.value = file;
    console.log('Top .nx file:', file);
}
    