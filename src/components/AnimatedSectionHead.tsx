"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { addSectionIntro, SECTION_MOTION } from "@/lib/section-motion";
import { Accent } from "./Accent";

/** The same directional entrance/hold/exit choreography used by expertise. */
export function AnimatedSectionHead({ title, lead }: { title: string; lead: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState("");

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLayout(`${innerWidth}:${innerHeight}:${element.offsetHeight}`));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useGSAP(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      const element = root.current!;
      const heading = element.querySelector("h2")!;
      const paragraph = element.querySelector("p")!;
      if (conditions?.reduced) {
        gsap.set([heading, paragraph], { clearProps: "transform,opacity" });
        return;
      }
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      const distance = Math.max(240, innerHeight * .85 + element.offsetHeight - header);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: `+=${distance}`,
          scrub: SECTION_MOTION.scrub,
          invalidateOnRefresh: true,
        },
      });
      addSectionIntro(timeline, heading, paragraph, {
        travel: innerWidth < 768 ? SECTION_MOTION.travel.mobile : SECTION_MOTION.travel.desktop,
        exitAt: distance,
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [layout], revertOnUpdate: true });

  return (
    <div ref={root} className="section-intro-motion max-w-4xl">
      <h2 className="display-2"><Accent text={title} /></h2>
      <p className="prose-max mt-6 md:text-xl">{lead}</p>
    </div>
  );
}
