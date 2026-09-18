import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Routes start at the top; in-page hashes (/#work) scroll to their
 * section. Without this, coming back from a project page lands you
 * halfway down the homepage.
 */
export function useScrollRestoration() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);
}
