import { gsap } from "./gsap";

/** Scroll-distance units, not seconds: use these with one scrubbed master timeline. */
export const SECTION_MOTION = {
  scrub: .4,
  entrance: { heading: 180, lead: 160, stagger: 40 },
  step: { node: 60, connector: 90, copy: 108, stagger: 16, connectorDelay: 16, copyDelay: 32 },
  exit: { heading: 150, lead: 120 },
  travel: { desktop: 128, mobile: 48, serviceDesktop: 32, serviceMobile: 16 },
  opacity: { waiting: .15, active: 1 },
  ease: { enter: "power3.out", settle: "power2.out", exit: "power2.in" },
} as const;

/** Reversible diagonal surface change, completed before the introduction lands. */
export function addSectionSurfaceReveal(section: Element, backdrop: Element, base: string) {
  gsap.set(section, { backgroundColor: base });
  return gsap.fromTo(backdrop, {
    clipPath: "polygon(0% 0%, -12% 0%, -24% 100%, 0% 100%)",
  }, {
    clipPath: "polygon(0% 0%, 136% 0%, 112% 100%, 0% 100%)",
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: section, start: "top 95%", end: "top 70%",
      scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
    },
  });
}

/** Left-to-right white departure into the following light section. */
export function addSectionSurfaceDeparture(next: Element, backdrop: Element,
  range: { start: string | (() => string); end: string | (() => string) } = { start: "top 70%", end: "top 30%" },
) {
  return gsap.fromTo(backdrop, {
    clipPath: "polygon(0% 0%, -12% 0%, -24% 100%, 0% 100%)",
  }, {
    clipPath: "polygon(0% 0%, 136% 0%, 112% 100%, 0% 100%)",
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: next, start: range.start, end: range.end,
      scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true,
    },
  });
}

export function addSectionIntro(
  timeline: gsap.core.Timeline,
  heading: Element,
  lead: Element,
  options: { travel: number; exitAt: number },
) {
  const { entrance, exit, ease } = SECTION_MOTION;
  timeline.addLabel("intro", 0);
  timeline.fromTo(heading, { x: -options.travel, opacity: 0 },
    { x: 0, opacity: 1, duration: entrance.heading, ease: ease.enter }, "intro");
  timeline.fromTo(lead, { x: options.travel, opacity: 0 },
    { x: 0, opacity: 1, duration: entrance.lead, ease: ease.enter }, entrance.stagger);
  timeline.addLabel("exit", options.exitAt - exit.heading);
  timeline.to(heading, { x: options.travel, opacity: 0, duration: exit.heading, ease: ease.exit }, "exit");
  timeline.to(lead, { x: -options.travel, opacity: 0, duration: exit.lead, ease: ease.exit }, options.exitAt - exit.lead);
}

export function addSectionStep(
  timeline: gsap.core.Timeline,
  targets: { copy: Element; connector: Element; node: Element },
  options: { at: number; label: string; direction: number; travel: number; connectorOrigin: string; inactive: string; active: string },
) {
  const { step, ease } = SECTION_MOTION;
  timeline.addLabel(options.label, options.at);
  timeline.fromTo(targets.node, { backgroundColor: options.inactive, scale: .8 },
    { backgroundColor: options.active, scale: 1, duration: step.node, ease: ease.settle }, options.at);
  timeline.fromTo(targets.connector, { scaleX: 0, transformOrigin: options.connectorOrigin },
    { scaleX: 1, duration: step.connector, ease: ease.settle }, options.at + step.connectorDelay);
  const copyParts = targets.copy.querySelectorAll("h3, p");
  const number = targets.copy.querySelector(".expertise-timeline-index");
  if (number) timeline.fromTo(number, { opacity: .35 },
    { opacity: 1, duration: step.node, ease: ease.settle }, options.at);
  timeline.fromTo(copyParts.length ? copyParts : targets.copy,
    { x: options.direction * options.travel, opacity: SECTION_MOTION.opacity.waiting },
    { x: 0, opacity: SECTION_MOTION.opacity.active, duration: step.copy, stagger: step.stagger, ease: ease.enter },
    options.at + step.copyDelay);
}
