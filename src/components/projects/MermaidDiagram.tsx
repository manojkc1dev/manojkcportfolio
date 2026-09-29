import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'JetBrains Mono, monospace, sans-serif',
      });
      mermaidInitialized = true;
    }

    let isMounted = true;
    const renderSvg = async () => {
      try {
        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 10)}`;
        const { svg } = await mermaid.render(uniqueId, chart.trim());
        if (isMounted) {
          setSvgContent(svg);
          setHasError(false);
        }
      } catch (err) {
        console.warn('Mermaid rendering notice:', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    renderSvg();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (hasError || !svgContent) {
    return (
      <div className="p-5 rounded-2xl bg-neutral-950 text-neutral-300 font-mono text-xs overflow-x-auto border border-neutral-800">
        <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Architecture Spec</div>
        <pre className="leading-relaxed">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex justify-center [&>svg]:max-w-full [&>svg]:h-auto shadow-xs">
      <div
        className="w-full flex justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
