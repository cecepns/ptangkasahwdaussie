import { useState, useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handler = (event) => setIsDesktop(event.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export function useDirectionalAos(reverse = false) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return { text: "fade-up", image: "fade-up" };
  }

  return {
    text: reverse ? "fade-left" : "fade-right",
    image: reverse ? "fade-right" : "fade-left",
  };
}
