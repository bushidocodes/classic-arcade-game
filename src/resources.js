const resourceCache = new Map();
const pendingLoads = new Set();
const readyCallbacks = [];

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
        return resourceCache.get(url);
    },
    isReady,
    onReady(fn) {
        readyCallbacks.push(fn);
    },
};
