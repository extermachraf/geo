"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, setupGsap, useGSAP, ScrollTrigger, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";

import { SECTION_MOTION, addSectionIntro, addSectionStep } from "@/lib/section-motion";

import { Accent } from "./Accent";
import { CursorPreview } from "./CursorPreview";

type ExpertiseItem = { title: string; scope: string; text: string; previewImage: string };

export function ExpertiseTimeline({ items, title, lead }: { items: readonly ExpertiseItem[]; title: string; lead: string }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [layout, setLayout] = useState("");
  useEffect(() => {
    const section = root.current?.closest<HTMLElement>(".expertise-section");
    const intro = section?.querySelector<HTMLElement>(".expertise-intro");
    const pin = root.current?.querySelector<HTMLElement>(".expertise-timeline-pin");
    if (!section || !intro || !pin) return;
    setupGsap();
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
        const offset = header;
        const fits = window.innerWidth >= 768 && offset + pin.offsetHeight + 24 <= window.innerHeight;
        const body = pin.querySelector<HTMLElement>(".expertise-timeline-body")!;
        const nodes = body.querySelectorAll<HTMLElement>("[data-timeline-node]");
        const firstRow = nodes[0]?.parentElement;
        const lastRow = nodes[nodes.length - 1]?.parentElement;
        if (firstRow && lastRow) {
          const mobile = window.innerWidth < 768;
          const firstCenter = firstRow.offsetTop + (mobile ? 8 : firstRow.offsetHeight / 2);
          const lastCenter = lastRow.offsetTop + (mobile ? 8 : lastRow.offsetHeight / 2);
          body.style.setProperty("--timeline-line-top", `${firstCenter}px`);
          body.style.setProperty("--timeline-line-bottom", `${body.offsetHeight - lastCenter}px`);
        }
        setLayout(`${window.innerWidth}:${window.innerHeight}:${pin.offsetHeight}:${intro.offsetHeight}`);
        const nextOffset = `${offset}px`;
        if (section.classList.contains("expertise-can-pin") !== fits || section.style.getPropertyValue("--expertise-pin-top") !== nextOffset) {
          section.style.setProperty("--expertise-pin-top", nextOffset);
          section.classList.toggle("expertise-can-pin", fits);
          setPinned(fits);
          ScrollTrigger.refresh();
        }
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(intro);
    observer.observe(pin);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      section.classList.remove("expertise-can-pin");
      section.style.removeProperty("--expertise-pin-top");
    };
  }, []);
  useGSAP(() => {
    setupGsap();
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      const q = gsap.utils.selector(root);
      const rows = q(".expertise-timeline-row");
      const items = q("[data-timeline-item]");
      const connectors = q("[data-timeline-connector]");
      const nodes = q("[data-timeline-node]");
      const line = q("[data-timeline-progress]");
      const introCopy = q(".expertise-intro h2, .expertise-intro p");
      const serviceCopy = q("[data-timeline-item] h3, [data-timeline-item] p, .expertise-timeline-index");
      if (conditions?.reduced) {
        gsap.set([...items, ...serviceCopy, ...connectors, ...nodes, ...line, ...introCopy], { clearProps: "transform,opacity,backgroundColor,filter" });
        return;
      }
      const intro = q(".expertise-intro")[0] as HTMLElement;
      const panel = q(".expertise-timeline-pin")[0] as HTMLElement;
      const body = q(".expertise-timeline-body")[0] as HTMLElement;
      const mobile = window.innerWidth < 768;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      const styles = getComputedStyle(root.current!);
      const inactive = styles.getPropertyValue("--content-line").trim();
      const active = styles.getPropertyValue("--green").trim();
      const centers = rows.map((row) => row.offsetTop + (mobile ? 8 : row.offsetHeight / 2));
      const first = centers[0] ?? 0;
      const last = centers[centers.length - 1] ?? first;
      const ratios = centers.map(center => (center - first) / Math.max(1, last - first));
      const stickyStart = window.innerHeight * .85 - header;
      const stickyTravel = Math.max(1, stage.current!.offsetHeight - panel.offsetHeight);
      const stepFinish = SECTION_MOTION.step.copyDelay + SECTION_MOTION.step.copy + SECTION_MOTION.step.stagger * 2;
      const activations = centers.map((center, index) => pinned
        ? stickyStart + ratios[index] * Math.max(1, stickyTravel - stepFinish)
        : Math.max(SECTION_MOTION.entrance.stagger + SECTION_MOTION.entrance.lead,
          intro.offsetHeight + center + window.innerHeight * .3 - stepFinish));
      const introExit = pinned
        ? stickyStart + stickyTravel + intro.offsetHeight
        : window.innerHeight * .85 + intro.offsetHeight - header;
      const duration = Math.max(introExit, (activations.at(-1) ?? 0) + stepFinish + 40);
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage.current,
          start: "top 85%",
          end: `+=${duration}`,
          scrub: SECTION_MOTION.scrub,
          invalidateOnRefresh: true,
        },
      });
      addSectionIntro(timeline, introCopy[0], introCopy[1], {
        travel: mobile ? SECTION_MOTION.travel.mobile : SECTION_MOTION.travel.desktop,
        exitAt: introExit,
      });
      timeline.set(line, { scaleY: 0, transformOrigin: "top center" }, 0);
      rows.forEach((_, index) => {
        const at = activations[index];
        // Each line segment ends at its node's activation label.
        if (index > 0) timeline.to(line, {
          scaleY: ratios[index],
          duration: at - activations[index - 1],
          ease: "none",
        }, activations[index - 1]);
        addSectionStep(timeline,
          { copy: items[index], connector: connectors[index], node: nodes[index] },
          {
            at, label: `service-${index + 1}`,
            direction: index % 2 ? 1 : -1,
            travel: mobile ? SECTION_MOTION.travel.serviceMobile : SECTION_MOTION.travel.serviceDesktop,
            connectorOrigin: mobile || index % 2 ? "left center" : "right center",
            inactive, active,
          });
      });
      // Preserve the final reading pause, even when the last reveal is the last tween.
      timeline.to({}, { duration: 1 }, duration - 1);
      // Measurements come from the untransformed layout, not animated text bounds.
      body.style.setProperty("--timeline-line-top", `${first}px`);
      body.style.setProperty("--timeline-line-bottom", `${body.offsetHeight - last}px`);
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [items.length, pinned, layout], revertOnUpdate: true });

  return (
    <div ref={root} className="expertise-timeline">
      <div ref={stage} className="expertise-timeline-stage">
        <div className="expertise-timeline-pin">
          <div className="expertise-intro">
            <h2 className="display-2"><Accent text={title} /></h2>
            <p className="prose-max">{lead}</p>
          </div>
          <div className="expertise-timeline-body">
          <div className="expertise-timeline-line" aria-hidden="true"><span data-timeline-progress /></div>
          <ol className="expertise-timeline-items">
            {items.map((item, index) => (
              <li id={`expertise-${index}`} key={item.title} className={`expertise-timeline-row expertise-timeline-row-${index % 2 ? "right" : "left"}`}>
                <div data-timeline-item data-preview-index={index} className="expertise-timeline-item">
                  <span className="expertise-timeline-index" aria-hidden="true">0<span className="expertise-timeline-digit">{index + 1}</span></span>
                  <h3>{item.title}</h3>
                  <p className="expertise-timeline-description">{item.text}</p>
                  <p className="expertise-timeline-scope">{item.scope}</p>
                </div>
                <span data-timeline-connector className="expertise-timeline-connector" aria-hidden="true" />
                <span data-timeline-node className="expertise-timeline-node" aria-hidden="true" />
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
      <CursorPreview area={root} items={items} />
    </div>
  );
}
