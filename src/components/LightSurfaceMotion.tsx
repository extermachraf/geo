"use client";

import { useRef } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { addSectionSurfaceReveal } from "@/lib/section-motion";

/** One reversible white curtain for an entire light surface, including its footer. */
export function LightSurfaceMotion() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    setupGsap();
    const surface = root.current!.closest("[data-light-surface]")!;
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      if (conditions?.reduced) {
        gsap.set(surface, { clearProps: "backgroundColor" });
        gsap.set(root.current, { clearProps: "clipPath" });
        return;
      }
      addSectionSurfaceReveal(surface, root.current!, "#0b0f0d");
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} className="light-surface-backdrop" aria-hidden="true" />;
}
