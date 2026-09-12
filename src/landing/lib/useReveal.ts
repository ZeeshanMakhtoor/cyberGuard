import { useEffect, useRef, useState } from "react";

/**
 * Adds the lp-visible class once an element scrolls into view, for the
 * lp-fade-up CSS transition. Triggers slightly before the element reaches
 * the bottom of the viewport (rootMargin) so the reveal feels like it's
 * already in motion by the time it's on screen, rather than starting cold.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
