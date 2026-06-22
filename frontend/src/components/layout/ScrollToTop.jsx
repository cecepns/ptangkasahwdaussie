import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAos, refreshAos, scrollToTop, resetHorizontalScroll } from "@/utils/aos";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    initAos();
  }, []);

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  useEffect(() => {
    scrollToTop();

    const raf = requestAnimationFrame(() => {
      scrollToTop();
      refreshAos();
    });

    const timer = setTimeout(() => {
      scrollToTop();
    }, 150);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => resetHorizontalScroll();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return null;
}
