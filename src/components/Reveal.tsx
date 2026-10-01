"use client";

import { useRef } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";

/**
 * One entrance per section (trigger clock): fades and lifts its children once, when the
 * block's top crosses 85% of the viewport. Under reduced motion nothing is hidden.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      setupGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        // opacity, not autoAlpha: `visibility: hidden` would drop the headings from the
        // accessibility tree until scrolled (axe then reports h1 → h3 as a skipped level).
        gsap.from(ref.current, {
          opacity: 0,
          y: 28,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
