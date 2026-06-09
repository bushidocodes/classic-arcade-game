const resourceCache = new Map();
const pendingLoads = new Set();
const readyCallbacks = [];

// A 1×1 transparent canvas used as a safe fallback when a requested image is
// missing or failed to load. drawImage() accepts CanvasImageSource, so this
// prevents TypeErrors without altering visible rendering.
let _fallbackCanvas = null;
function getFallback() {
    if (!_fallbackCanvas) {
        _fallbackCanvas = document.createElement('canvas');
        _fallbackCanvas.width = 1;
        _fallbackCanvas.height = 1;
    }
    return _fallbackCanvas;
}

function _load(url) {
    if (resourceCache.has(url)) return;
    pendingLoads.add(url);
    const img = new Image();
    img.onload = () => {
        resourceCache.set(url, img);
        pendingLoads.delete(url);
        if (isReady()) readyCallbacks.forEach(fn => fn());
    };
    img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        pendingLoads.delete(url);
        if (isReady()) readyCallbacks.forEach(fn => fn());
    };
    img.src = url;
}

function isReady() {
    return pendingLoads.size === 0 && resourceCache.size > 0;
}

export const Resources = {
    load(urlOrArr) {
        const urls = Array.isArray(urlOrArr) ? urlOrArr : [urlOrArr];
        urls.forEach(_load);
    },
    get(url) {
        const img = resourceCache.get(url);
        if (img == null) {
            console.warn(`Resources.get: image not found in cache: ${url}`);
            return getFallback();
        }
        return img;
    },
    isReady,
    onReady(fn) {
        readyCallbacks.push(fn);
    },
};
