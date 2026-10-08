import { useEffect, useState } from 'react';
import { getCurrentlyBuilding } from '../lib/api';
import { currentlyBuilding as staticCurrentlyBuilding, type CurrentItem } from '../data/currentlyBuilding';

export function useCurrentlyBuilding(): CurrentItem[] {
  const [items, setItems] = useState<CurrentItem[]>(staticCurrentlyBuilding);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    getCurrentlyBuilding(undefined, { signal: controller.signal })
      .then((apiItems) => {
        if (isCancelled || controller.signal.aborted) return;
        if (Array.isArray(apiItems) && apiItems.length > 0) {
          setItems(apiItems);
        }
      })
      .catch((error) => {
        if (isCancelled || controller.signal.aborted) return;

        if (import.meta.env.DEV) {
          console.warn(
            '[useCurrentlyBuilding] API unavailable — using static fallback:',
            error instanceof Error ? error.message : error
          );
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, []);

  return items;
}
