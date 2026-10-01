"use client";

import { useRef, type ReactNode } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { SECTION_MOTION } from "@/lib/section-motion";

/** The site's entrance / reading pause / rightward exit for normal-flow content. */
export function DirectionalContent({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY, desktop: "(min-width: 768px)" }, ({ conditions }) => {
      const groups = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-motion-group]"));
      if (conditions?.reduced) {
        gsap.set([...groups, ...root.current!.querySelectorAll("[data-motion-surface]")], { clearProps: "transform,opacity,clipPath" });
        return;
      }
      const travel = conditions?.desktop ? SECTION_MOTION.travel.desktop : SECTION_MOTION.travel.mobile;
      groups.forEach(group => {
        const surface = group.querySelector("[data-motion-surface]")!;
        const left = group.dataset.motionSide === "left";
        const pageEnd = group.dataset.motionEntry === "page-end";
        const readingTopic = group.dataset.motionExit === "after-read";
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
        gsap.fromTo(surface, {
          x: left ? -travel : travel, opacity: 0,
          clipPath: left ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
        }, {
          x: 0, opacity: 1, clipPath: "inset(0 0% 0 0%)", ease: SECTION_MOTION.ease.enter,
          scrollTrigger: { trigger: group, start: pageEnd ? "clamp(top bottom)" : "top 88%", end: pageEnd ? "clamp(top 75%)" : "top 58%", scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true },
        });
        // Outer groups own departure; their inner surfaces own arrival.
        gsap.fromTo(group, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }, {
          opacity: 0, x: travel, clipPath: "inset(0 0 0 100%)", ease: SECTION_MOTION.ease.exit,
          immediateRender: false,
          scrollTrigger: {
            trigger: group,
            start: readingTopic ? () => `bottom ${Math.min(innerHeight * .22, header + 64)}px` : "top 24%",
            end: readingTopic ? `bottom ${header + 8}px` : "bottom 12%",
            scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
          },
        });
      });
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} className={className}>{children}</div>;
}
