import { useEffect, useRef, useState } from 'react';

/**
 * Adds `is-visible` once an element scrolls into view. Fires once.
 * Under prefers-reduced-motion the CSS already renders the element
 * in its resting state, so this only drives the animated case.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}
