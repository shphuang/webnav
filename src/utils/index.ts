import { DOMParser, Element } from '@b-fuze/deno-dom';

// 缓存favicon URL结果和过期时间
const faviconCache = new Map<string, string>();
const FAVICON_TIMEOUT = 3000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// 获取iconUrl
export async function getIconUrl(url: string) {
  try {
    // URL合法性校验
    if (!isValidUrl(url)) {
      console.warn(`Invalid URL: ${url}`);
      return '';
    }

    // 获取url带协议的域名
    const origin = getDomain(url);

    // 从缓存中获取iconUrl
    const cached = faviconCache.get(origin);
    if (cached ) {
      return cached;
    }

    // 按优先级尝试获取favicon
    const iconUrl = await tryGetFaviconWithRetry(origin);

    // 缓存结果
    if (iconUrl) {
      faviconCache.set(origin, iconUrl);
    }

    return iconUrl || '';
  } catch (error) {
    console.error('Error getting icon URL:', error);
    return '';
  }
}

// 验证URL是否合法
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 带重试机制的favicon获取
async function tryGetFaviconWithRetry(
  origin: string,
  retries = MAX_RETRIES,
): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      // 按优先级尝试不同方式获取favicon
      const iconUrl = await Promise.race([
        tryAquiringFaviconIco(origin),
        tryAquiringFaviconIcoFromUrl(origin + '/index.html'),
        tryAquiringFaviconIcoFromUrl(origin),
      ]);

      if (iconUrl) {
        return iconUrl as string;
      }

      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    } catch (error) {
      console.warn(`Retry ${i + 1}/${retries + 1} failed:`, error);
      if (i === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  return '';
}

// 获取url带协议的域名
export function getDomain(url: string) {
  const u = new URL(url);
  return u.origin;
}

// 支持的图标文件格式
const ICON_EXTENSIONS = ['.ico', '.png', '.svg'];

async function tryAquiringFaviconIco(
  origin: string,
): Promise<string | boolean> {
  // 尝试不同格式的favicon
  for (const ext of ICON_EXTENSIONS) {
    const url = origin + '/favicon' + ext;
    const iconUrl = await tryFetchIconUrl(url);
    if (iconUrl) {
      return iconUrl;
    }
  }

  return false;
}

async function tryFetchIconUrl(url: string): Promise<string | false> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FAVICON_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return false;
    }

    const ct = response.headers.get('content-type');
    if (ct && ct.includes('image/')) {
      return url;
    }

    return false;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Favicon fetch timeout for ${url}`);
    } else {
      console.error(`Error fetching favicon from ${url}:`, error);
    }
    return false;
  }
}

async function tryAquiringFaviconIcoFromUrl(
  url: string,
): Promise<string | boolean> {
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FAVICON_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return false;
    }

    const ct = response.headers.get('content-type') as string;
    if (!ct?.includes('text/html')) {
      return false;
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // 扩展图标选择器支持
    const iconSelectors = [
      'link[rel*="icon"][type="image/x-icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="icon"]',
      'link[rel="apple-touch-icon"]',
    ];

    for (const selector of iconSelectors) {
      const link = doc.querySelector(selector) as Element;
      if (link) {
        const href = link.getAttribute('href');
        if (href) {
          // 处理相对路径
          if (href.startsWith('//')) {
            return 'https:' + href;
          } else if (href.startsWith('/')) {
            const origin = getDomain(url);
            return origin + href;
          } else if (!href.startsWith('http')) {
            const origin = getDomain(url);
            return origin + '/' + href;
          }
          return href;
        }
      }
    }
    return false;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Favicon fetch timeout for ${url}`);
    } else {
      console.error(`Error fetching favicon from ${url}:`, error);
    }
    return false;
  }
}
