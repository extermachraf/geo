"use client";

import { useRef, type ReactNode } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { addSectionSurfaceReveal, SECTION_MOTION } from "@/lib/section-motion";

/** The rail leads; each number and its copy settle behind it in reading order. */
export function ApproachSequence({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY, desktop: "(min-width: 1100px)", tablet: "(min-width: 640px) and (max-width: 1099px)" }, ({ conditions }) => {
      const element = root.current!;
      const section = element.closest("section")!;
      const backdrop = section.querySelector(".approach-backdrop")!;
      const exitBackdrop = section.querySelector(".approach-exit-backdrop")!;
      if (conditions?.reduced) {
        gsap.set(section, { clearProps: "backgroundColor" });
        gsap.set([backdrop, exitBackdrop], { clearProps: "clipPath" });
        gsap.set(element.querySelectorAll(".approach-step, .approach-rail > span, .approach-number, .approach-copy h3, .approach-copy p, .approach-stats-shell, .approach-stats, .approach-stats > div, .approach-stats dt, .approach-stats dd"), {
          clearProps: "transform,opacity,clipPath",
        });
        return;
      }
      // A solid black curtain replaces the muddy palette crossfade.
      // Overshoot moves the diagonal edge beyond the content before its entrance.
      addSectionSurfaceReveal(section, backdrop, "#f7f8f6");
      // White sweeps over the departing dark surface and its content together.
      // This avoids white lettering lingering on the newly exposed white surface.
      gsap.fromTo(exitBackdrop, {
        clipPath: "polygon(0% 0%, -12% 0%, -24% 100%, 0% 100%)",
      }, {
        clipPath: "polygon(0% 0%, 136% 0%, 112% 100%, 0% 100%)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section.nextElementSibling, start: "top 70%", end: "top 30%",
          scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
        },
      });
      const columns = conditions?.desktop ? 4 : conditions?.tablet ? 2 : 1;
      const steps = Array.from(element.querySelectorAll(".approach-step"));
      for (let row = 0; row < steps.length; row += columns) {
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: steps[row], start: "top 88%", end: "top 58%",
          scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
        } });
        steps.slice(row, row + columns).forEach((step, index) => {
          const at = index * .12;
          timeline.fromTo(step.querySelector(".approach-rail span"), { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: .55, ease: SECTION_MOTION.ease.settle }, at);
          timeline.fromTo(step.querySelector(".approach-number"), { opacity: .25, y: 10 },
            { opacity: 1, y: 0, duration: .4, ease: SECTION_MOTION.ease.enter }, at + .08);
          timeline.fromTo(step.querySelectorAll("h3, p"), { opacity: .15, clipPath: "inset(0 0 100% 0)", x: columns === 1 ? 24 : 0, y: columns === 1 ? 0 : 18 },
            { opacity: 1, clipPath: "inset(0 0 0% 0)", x: 0, y: 0, duration: .6, stagger: .08, ease: SECTION_MOTION.ease.enter }, at + .16);
        });
        // Exit owns the outer step; entry owns its children, so the two never fight.
        const exit = gsap.timeline({ scrollTrigger: {
          trigger: steps[row], start: "top 24%", end: "bottom 12%",
          scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
        } });
        steps.slice(row, row + columns).forEach((step, index) => {
          exit.fromTo(step, { opacity: 1, x: 0, y: 0 }, {
            opacity: 0, x: (index % 2 ? 1 : -1) * (columns === 1 ? 12 : 24), y: -12,
            duration: .45, ease: SECTION_MOTION.ease.exit, immediateRender: false,
          }, index * .05);
        });
      }
      const stats = element.querySelector(".approach-stats")!;
      const landing = gsap.timeline({ scrollTrigger: {
        trigger: stats, start: "top 92%", end: "top 65%", scrub: SECTION_MOTION.scrub,
        invalidateOnRefresh: true,
      } });
      landing.fromTo(stats, { clipPath: "inset(0 100% 0 0)", y: 36, opacity: 0 }, {
        clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1, duration: .7, ease: SECTION_MOTION.ease.enter,
      }, 0);
      const groups = Array.from(stats.querySelectorAll(":scope > div"));
      groups.forEach((group, index) => {
        const at = .22 + index * .1;
        landing.fromTo(group.querySelector("dd"), { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" }, {
          opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .5, ease: SECTION_MOTION.ease.enter,
        }, at);
        landing.fromTo(group.querySelector("dt"), { opacity: 0, x: 18 }, {
          opacity: 1, x: 0, duration: .4, ease: SECTION_MOTION.ease.enter,
        }, at + .1);
      });
      const departure = gsap.timeline({ scrollTrigger: {
        trigger: stats, start: "top 20%", end: "bottom 12%", scrub: SECTION_MOTION.scrub,
        invalidateOnRefresh: true,
      } });
      // Group wrappers own text departure; the shell owns the green panel's wipe.
      groups.forEach((group, index) => departure.fromTo(group, { opacity: 1, y: 0, x: 0 }, {
        opacity: 0, y: -20, x: -12, duration: .3, ease: SECTION_MOTION.ease.exit,
        immediateRender: false,
      }, index * .06));
      departure.fromTo(stats.parentElement, { opacity: 1, y: 0, clipPath: "inset(0 0 0 0%)" }, {
        opacity: 0, y: -16, clipPath: "inset(0 0 0 100%)", duration: .4, ease: SECTION_MOTION.ease.exit,
        immediateRender: false,
      }, .2);
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} className="approach-sequence">{children}</div>;
}
