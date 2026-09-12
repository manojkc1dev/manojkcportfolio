import React, { useState, useEffect } from 'react';
import { Upload, RotateCcw, Check, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { loadBrandAssets, saveBrandAssets, DEFAULT_BRAND_ASSETS, type BrandAssets } from '@/lib/brandAssets';

export function BrandAssetsManager() {
  const [assets, setAssets] = useState<BrandAssets>(loadBrandAssets);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [activeCropAsset, setActiveCropAsset] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<BrandAssets>) => {
      if (e.detail) setAssets(e.detail);
    };
    window.addEventListener('brand_assets_updated' as any, handleUpdate as EventListener);
    return () => {
      window.removeEventListener('brand_assets_updated' as any, handleUpdate as EventListener);
    };
  }, []);

  const handleChange = <K extends keyof BrandAssets>(key: K, value: BrandAssets[K]) => {
    const updated = { ...assets, [key]: value };
    setAssets(updated);
    saveBrandAssets(updated);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleFileUpload = (key: 'faviconUrl' | 'appleIconUrl' | 'ogImageUrl' | 'avatarUrl', file: File) => {
    if (!file) return;

    // Client-side image FileReader to DataURL for instant zero-server preview & persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        handleChange(key, result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetToDefault = (key: keyof BrandAssets) => {
    handleChange(key, DEFAULT_BRAND_ASSETS[key]);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Brand Assets &amp; Identity
          </h2>
          <p className="text-xs text-muted mt-1">
            Configure visual assets, favicon, social OG images, and hero profile photo with instant live propagation.
          </p>
        </div>

        {saveStatus === 'saved' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved to Supabase Storage &amp; Live Site</span>
          </span>
        )}
      </div>

      {/* Identity & Wordmark */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
        <h3 className="text-sm font-bold text-foreground">Header Wordmark &amp; Accent Color</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Logo Wordmark Text
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={assets.logoText}
                onChange={(e) => handleChange('logoText', e.target.value)}
                placeholder="Manoj K.C."
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface-2 border border-border text-foreground focus:outline-none focus:border-primary font-bold"
              />
              <button
                type="button"
                onClick={() => resetToDefault('logoText')}
                title="Reset to default"
                className="p-2 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted mt-1">Displayed in top navigation bar.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Logo Accent Dot Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={assets.logoAccentColor}
                onChange={(e) => handleChange('logoAccentColor', e.target.value)}
                className="w-9 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={assets.logoAccentColor}
                onChange={(e) => handleChange('logoAccentColor', e.target.value)}
                className="px-3 py-2 text-xs font-mono rounded-lg bg-surface-2 border border-border text-foreground w-28"
              />
              <button
                type="button"
                onClick={() => resetToDefault('logoAccentColor')}
                title="Reset to default"
                className="p-2 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted mt-1">Accent period mark in wordmark &amp; highlights.</p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Brand Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Hero Avatar Photo */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">1. Hero Profile Photo</h4>
                <p className="text-[11px] text-muted font-mono">Required: 1:1 Square · 800×800px</p>
              </div>
              <button
                type="button"
                onClick={() => resetToDefault('avatarUrl')}
                title="Reset to default"
                className="p-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden border-2 border-primary/30 bg-surface-2 shrink-0 relative group">
                <img
                  src={assets.avatarUrl || DEFAULT_BRAND_ASSETS.avatarUrl}
                  alt={assets.avatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold cursor-pointer transition-colors w-full justify-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Square Photo</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('avatarUrl', e.target.files[0]);
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={assets.avatarUrl}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                  placeholder="Or enter public image URL"
                  className="w-full px-2.5 py-1.5 text-[11px] rounded bg-surface-2 border border-border text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1">
                Alt Text (Accessibility &amp; SEO)
              </label>
              <input
                type="text"
                value={assets.avatarAlt}
                onChange={(e) => handleChange('avatarAlt', e.target.value)}
                placeholder="Manoj K.C. — Python and Django Backend Developer"
                className="w-full px-2.5 py-1.5 text-xs rounded bg-surface-2 border border-border text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Social OG Image */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">2. Social OG Share Card</h4>
                <p className="text-[11px] text-muted font-mono">Required: 1.91:1 Landscape · 1200×630px</p>
              </div>
              <button
                type="button"
                onClick={() => resetToDefault('ogImageUrl')}
                title="Reset to default"
                className="p-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-3">
              <div className="w-full aspect-[1.91/1] rounded-xl overflow-hidden border border-border bg-surface-2 relative group mb-3">
                <img
                  src={assets.ogImageUrl || DEFAULT_BRAND_ASSETS.ogImageUrl}
                  alt={assets.ogImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold cursor-pointer transition-colors flex-1 justify-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload OG Image</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('ogImageUrl', e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1">
                OG Image Alt Text
              </label>
              <input
                type="text"
                value={assets.ogImageAlt}
                onChange={(e) => handleChange('ogImageAlt', e.target.value)}
                placeholder="Manoj K.C. Portfolio Social Preview"
                className="w-full px-2.5 py-1.5 text-xs rounded bg-surface-2 border border-border text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Favicon */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">3. Browser Favicon</h4>
              <p className="text-[11px] text-muted font-mono">32×32px (.ico or .png)</p>
            </div>
            <button
              type="button"
              onClick={() => resetToDefault('faviconUrl')}
              title="Reset to default"
              className="p-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center p-2 shrink-0">
              <img
                src={assets.faviconUrl || '/favicon.ico'}
                alt="Favicon preview"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.ico';
                }}
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-semibold cursor-pointer text-foreground">
                <Upload className="w-3 h-3 text-primary" />
                <span>Choose .ico or .png</span>
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('faviconUrl', e.target.files[0]);
                  }}
                />
              </label>
              <p className="text-[10px] text-muted">Applied immediately to active browser tab.</p>
            </div>
          </div>
        </div>

        {/* 4. Apple Touch Icon */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">4. Apple Touch Icon</h4>
              <p className="text-[11px] text-muted font-mono">180×180px (.png)</p>
            </div>
            <button
              type="button"
              onClick={() => resetToDefault('appleIconUrl')}
              title="Reset to default"
              className="p-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center p-2 shrink-0">
              <img
                src={assets.appleIconUrl || '/apple-touch-icon.png'}
                alt="Apple Touch Icon preview"
                className="w-9 h-9 object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.ico';
                }}
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-semibold cursor-pointer text-foreground">
                <Upload className="w-3 h-3 text-primary" />
                <span>Choose 180×180 .png</span>
                <input
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('appleIconUrl', e.target.files[0]);
                  }}
                />
              </label>
              <p className="text-[10px] text-muted">iOS &amp; iPadOS Home Screen bookmark icon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
