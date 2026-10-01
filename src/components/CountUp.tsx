"use client";

import { useRef } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";

/** A number counting up once when it enters the viewport. Renders its final value without JS. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      setupGsap();
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
        if (conditions?.reduced) {
          el.textContent = `${prefix}${to}${suffix}`;
          return;
        }
        const counter = { value: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(counter, {
          value: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="tnum">
      {prefix}
      {to}
      {suffix}
    </span>
  );
}
