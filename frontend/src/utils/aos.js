import AOS from "aos";

const MOBILE_BREAKPOINT = 1024;

export function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

export const AOS_CONFIG = {
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 80,
  mirror: false,
  disable: () => isMobileViewport(),
};

export function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
}

export function resetHorizontalScroll() {
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
}

export function initAos() {
  AOS.init(AOS_CONFIG);
}

export function refreshAos() {
  if (!isMobileViewport()) {
    AOS.refresh();
  }
}
