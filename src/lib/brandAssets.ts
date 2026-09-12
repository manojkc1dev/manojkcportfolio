export interface BrandAssets {
  faviconUrl: string;
  appleIconUrl: string;
  ogImageUrl: string;
  avatarUrl: string;
  avatarAlt: string;
  ogImageAlt: string;
  logoText: string;
  logoAccentColor: string;
}

export const DEFAULT_BRAND_ASSETS: BrandAssets = {
  faviconUrl: '/favicon.ico',
  appleIconUrl: '/apple-touch-icon.png',
  ogImageUrl: '/static/images/manoj-kc-python-backend-developer.jpg',
  avatarUrl: '/static/images/manoj-kc-python-backend-developer.jpg',
  avatarAlt: 'Manoj K.C. — Python and Django Backend Developer',
  ogImageAlt: 'Manoj K.C. Portfolio and Backend Engineering Showcase',
  logoText: 'Manoj K.C.',
  logoAccentColor: '#5E6AD2',
};

const STORAGE_KEY = 'manojkc_brand_assets';

export function loadBrandAssets(): BrandAssets {
  if (typeof window === 'undefined') return DEFAULT_BRAND_ASSETS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_BRAND_ASSETS, ...JSON.parse(saved) };
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_BRAND_ASSETS;
}

export function saveBrandAssets(assets: BrandAssets): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));

    // Update document favicon dynamically
    if (assets.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = assets.faviconUrl;
    }

    // Update apple-touch-icon dynamically
    if (assets.appleIconUrl) {
      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = assets.appleIconUrl;
    }

    window.dispatchEvent(new CustomEvent('brand_assets_updated', { detail: assets }));
  } catch (err) {
    console.error('Failed to save brand assets:', err);
  }
}
