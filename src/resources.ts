const resourceCache = new Map<string, HTMLImageElement>();
const pendingLoads = new Set<string>();
const { promise: readyPromise, resolve: resolveReady } = Promise.withResolvers<void>();

// A 1×1 transparent canvas used as a safe fallback when a requested image is
// missing or failed to load. drawImage() accepts CanvasImageSource, so this
// prevents TypeErrors without altering visible rendering.
let _fallbackCanvas: HTMLCanvasElement | null = null;
function getFallback(): HTMLCanvasElement {
  if (!_fallbackCanvas) {
    _fallbackCanvas = document.createElement("canvas");
    _fallbackCanvas.width = 1;
    _fallbackCanvas.height = 1;
  }
  return _fallbackCanvas;
}

function _load(url: string): void {
  if (resourceCache.has(url)) return;
  pendingLoads.add(url);
  const img = new Image();
  img.onload = () => {
    resourceCache.set(url, img);
    pendingLoads.delete(url);
    if (isReady()) resolveReady();
  };
  img.onerror = () => {
    console.warn(`Failed to load image: ${url}`);
    pendingLoads.delete(url);
    if (isReady()) resolveReady();
  };
  img.src = url;
}

function isReady(): boolean {
  return pendingLoads.size === 0 && resourceCache.size > 0;
}

export const Resources = {
  load(urlOrArr: string | string[]): void {
    const urls = Array.isArray(urlOrArr) ? urlOrArr : [urlOrArr];
    urls.forEach(_load);
  },
  get(url: string): HTMLImageElement | HTMLCanvasElement {
    const img = resourceCache.get(url);
    if (img == null) {
      console.warn(`Resources.get: image not found in cache: ${url}`);
      return getFallback();
    }
    return img;
  },
  isReady,
  onReady(fn: () => void): void {
    void readyPromise.then(fn);
  },
};
