"use client";

import { useRef } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { addSectionSurfaceReveal, addSectionSurfaceDeparture } from "@/lib/section-motion";

/** Shared dark entrance and white departure; content remains in its own layer. */
export function SectionSurfaceMotion({ departure = true }: { departure?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    setupGsap();
    const section = root.current!.closest("section")!;
    const entry = root.current!.querySelector(".section-surface-entry")!;
    const exit = root.current!.querySelector(".section-surface-exit")!;
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      if (conditions?.reduced) {
        gsap.set(section, { clearProps: "backgroundColor" });
        gsap.set([entry, exit], { clearProps: "clipPath" });
        return;
      }
      addSectionSurfaceReveal(section, entry, "#f7f8f6");
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      if (departure && section.nextElementSibling) addSectionSurfaceDeparture(section.nextElementSibling, exit, {
        start: () => `top ${Math.min(innerHeight * .25, header + 176)}px`,
        end: `top ${header}px`,
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [departure], revertOnUpdate: true });
  return <div ref={root} className="section-surface-motion" aria-hidden="true"><div className="section-surface-entry" /><div className="section-surface-exit" /></div>;
}
