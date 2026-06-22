import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

function getScrollProgress() {
  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const { pathname } = useLocation();
  const rafRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setProgress(getScrollProgress());
    });
  }, []);

  useEffect(() => {
    updateProgress();

    window.addEventListener("scroll", updateProgress, { passive: true, capture: true });
    document.addEventListener("scroll", updateProgress, { passive: true, capture: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    window.addEventListener("wheel", updateProgress, { passive: true });
    window.addEventListener("touchmove", updateProgress, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", updateProgress, { capture: true });
      document.removeEventListener("scroll", updateProgress, { capture: true });
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("wheel", updateProgress);
      window.removeEventListener("touchmove", updateProgress);
    };
  }, [updateProgress]);

  useEffect(() => {
    updateProgress();
    const timer = setTimeout(updateProgress, 100);
    return () => clearTimeout(timer);
  }, [pathname, updateProgress]);

  return progress;
}
