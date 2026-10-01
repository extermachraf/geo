"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setupGsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/scroll";

/**
 * The page's single scroll authority: Lenis, driven by gsap.ticker so Lenis → ScrollTrigger
 * land in the same frame. Under reduced motion there is no Lenis (native scrolling), followed live.
 * Same-page anchors go through Lenis, offset by the fixed header.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupGsap();
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY);

    const raf = (time: number) => getLenis()?.raf(time * 1000);

    const start = () => {
      if (getLenis()) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
      if (document.documentElement.hasAttribute("data-site-loading")) lenis.stop();
    };
    const stop = () => {
      const lenis = getLenis();
      if (!lenis) return;
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
    const apply = () => (reduce.matches ? stop() : start());
    apply();
    reduce.addEventListener("change", apply);

    const headerHeight = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      ) || 0;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      event.preventDefault();
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { offset: -headerHeight() });
      else target.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
      history.pushState(null, "", id ? `#${id}` : location.pathname);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      reduce.removeEventListener("change", apply);
      stop();
    };
  }, []);

  return <>{children}</>;
}
