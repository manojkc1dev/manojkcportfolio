import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface OverflowItem {
  selector: string;
  tag: string;
  className: string;
  elementWidth: number;
  parentWidth: number;
  overflowAmount: number;
}

export function OverflowDetector() {
  const [overflows, setOverflows] = useState<OverflowItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightActive, setHighlightActive] = useState(false);

  const checkOverflows = useCallback(() => {
    if (typeof window === 'undefined') return;

    const docWidth = document.documentElement.clientWidth || window.innerWidth;
    const items: OverflowItem[] = [];

    const allElements = document.querySelectorAll('body *');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Skip detector UI itself
      if (htmlEl.closest('#overflow-detector-root')) return;

      const rect = htmlEl.getBoundingClientRect();
      const parent = htmlEl.parentElement;
      const parentWidth = parent ? parent.getBoundingClientRect().width : docWidth;

      // Element exceeds window width or parent element width by > 1.5px
      if (rect.right > docWidth + 1.5 || (parent && rect.width > parentWidth + 1.5 && parentWidth > 0)) {
        const idStr = htmlEl.id ? `#${htmlEl.id}` : '';
        const classStr = typeof htmlEl.className === 'string' && htmlEl.className
          ? `.${htmlEl.className.trim().split(/\s+/).slice(0, 2).join('.')}`
          : '';
        const selector = `${htmlEl.tagName.toLowerCase()}${idStr}${classStr}`;

        items.push({
          selector,
          tag: htmlEl.tagName.toLowerCase(),
          className: typeof htmlEl.className === 'string' ? htmlEl.className : '',
          elementWidth: Math.round(rect.width),
          parentWidth: Math.round(parentWidth),
          overflowAmount: Math.round(rect.width - parentWidth),
        });

        if (highlightActive) {
          htmlEl.style.outline = '2px dashed #f85149';
        }
      } else if (!highlightActive && htmlEl.style.outline.includes('#f85149')) {
        htmlEl.style.outline = '';
      }
    });

    setOverflows(items.slice(0, 10)); // Top 10

    if (items.length > 0 && process.env.NODE_ENV !== 'production') {
      console.warn(`[OverflowDetector] Detected ${items.length} element(s) exceeding boundary:`, items);
    }
  }, [highlightActive]);

  useEffect(() => {
    checkOverflows();
    const handleResize = () => {
      checkOverflows();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    const observer = new MutationObserver(() => {
      checkOverflows();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [checkOverflows]);

  // Clean up any outlines on unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll('*').forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style?.outline?.includes('#f85149')) {
          htmlEl.style.outline = '';
        }
      });
    };
  }, []);

  return (
    <div
      id="overflow-detector-root"
      className="fixed bottom-4 left-4 z-40 font-mono text-xs select-none"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Viewport Overflow Diagnostics (Dev Tool)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-md backdrop-blur-md transition-all cursor-pointer ${
            overflows.length > 0
              ? 'bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30'
              : 'bg-surface/80 border-border text-muted hover:text-foreground'
          }`}
        >
          {overflows.length > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-destructive animate-pulse" />
              <span className="font-semibold">{overflows.length} Overflows</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-success" />
              <span>0 Overflows</span>
            </>
          )}
        </button>

        {overflows.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setHighlightActive(!highlightActive);
              checkOverflows();
            }}
            className={`px-2 py-1 rounded-full text-[10px] border cursor-pointer ${
              highlightActive
                ? 'bg-destructive text-white border-destructive'
                : 'bg-surface-2 border-border text-foreground hover:bg-surface'
            }`}
          >
            {highlightActive ? 'Hide Outlines' : 'Highlight Outlines'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-2 w-80 max-w-[calc(100vw-2rem)] p-3 rounded-xl bg-surface/95 border border-border backdrop-blur-lg shadow-xl text-foreground">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <span className="font-bold text-[11px] uppercase tracking-wider text-muted">
              Responsive Overflow Audit
            </span>
            <span className="text-[10px] text-muted">
              Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}px` : 'N/A'}
            </span>
          </div>

          {overflows.length === 0 ? (
            <p className="text-xs text-success flex items-center gap-1.5 py-2">
              <CheckCircle className="w-4 h-4" />
              Clean layout! No container overflows found.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide text-[11px]">
              {overflows.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-surface-2 border border-border/60">
                  <div className="font-semibold text-primary truncate">{item.selector}</div>
                  <div className="text-muted text-[10px] mt-0.5">
                    Width: {item.elementWidth}px &gt; Parent: {item.parentWidth}px (+{item.overflowAmount}px)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
