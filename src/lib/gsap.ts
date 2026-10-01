import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";

let registered = false;

/** Register GSAP once, client-side, before any block runs. Idempotent. */
export function setupGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    registered = true;
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    // An iOS toolbar show/hide fires `resize`; it is not a layout change. Without this the
    // pinned scene re-measures mid-scroll and visibly jumps (scroll-animation gsap/setup.ts).
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  return gsap;
}

/** Live, never cached: every manual writer re-reads it. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

export { gsap, ScrollTrigger, useGSAP };
