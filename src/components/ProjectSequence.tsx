"use client";

import { useRef, useState, useId } from "react";
import { gsap, setupGsap, useGSAP, MOTION_OK_QUERY, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { addSectionSurfaceReveal, SECTION_MOTION } from "@/lib/section-motion";

type Photo = { image: string; thumbnail: string; caption: string; alt: string; width: number; height: number };
type Project = { type: string; photos: readonly Photo[] };

export function ProjectSequence({ items }: { items: readonly Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [photos, setPhotos] = useState(() => items.map(() => 0));
  const id = useId();
  useGSAP(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY, desktop: "(min-width: 768px)" }, ({ conditions }) => {
      const element = root.current!;
      const section = element.closest("section")!;
      const backdrop = section.querySelector(".projects-backdrop")!;
      const surface = element.querySelector(".projects-gallery")!;
      if (conditions?.reduced) {
        gsap.set(section, { clearProps: "backgroundColor" });
        gsap.set([element, surface, backdrop], { clearProps: "transform,opacity,clipPath" });
        return;
      }
      addSectionSurfaceReveal(section, backdrop, "#0b0f0d");
      const travel = conditions?.desktop ? SECTION_MOTION.travel.desktop : SECTION_MOTION.travel.mobile;
      gsap.fromTo(surface, {
        clipPath: "polygon(0% 0%, -12% 0%, -24% 100%, 0% 100%)", opacity: 0, x: -travel,
      }, {
        clipPath: "polygon(0% 0%, 136% 0%, 112% 100%, 0% 100%)", opacity: 1, x: 0,
        ease: SECTION_MOTION.ease.enter,
        scrollTrigger: { trigger: element, start: "top 88%", end: "top 58%", scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true },
      });
      gsap.fromTo(element, { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }, {
        opacity: 0, x: travel, clipPath: "inset(0 0 0 100%)",
        ease: SECTION_MOTION.ease.exit, immediateRender: false,
        // The reading controls remain visible until the end of the gallery leaves.
        scrollTrigger: { trigger: element, start: "bottom 22%", end: "bottom top", scrub: SECTION_MOTION.scrub, invalidateOnRefresh: true },
      });
    });
    return () => media.revert();
  }, { scope: root });


  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: MOTION_OK_QUERY, reduced: REDUCED_MOTION_QUERY, desktop: "(min-width: 768px)" }, ({ conditions }) => {
      const panels = root.current!.querySelectorAll<HTMLElement>(".project-panel");
      panels.forEach((panel, index) => {
        const open = index === active;
        const content = panel.querySelector(".project-panel-content");
        const image = panel.querySelector("img");
        const target = { flexGrow: open ? (conditions?.desktop ? 7 : 6) : 1 };
        gsap.killTweensOf([panel, content, image]);
        if (conditions?.reduced) {
          gsap.set(panel, target);
          gsap.set(content, { opacity: open ? 1 : 0, clearProps: "transform" });
          gsap.set(image, { clearProps: "transform" });
        } else {
          gsap.to(panel, { ...target, duration: .55, ease: SECTION_MOTION.ease.enter });
          gsap.to(content, { opacity: open ? 1 : 0, duration: open ? .35 : .18, delay: open ? .1 : 0, ease: SECTION_MOTION.ease.enter });
          gsap.to(image, { scale: open ? 1 : 1.035, duration: .55, ease: SECTION_MOTION.ease.enter });
        }
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active] });

  return <div ref={root} className="projects-gallery-stage">
    <div className="projects-gallery" aria-label="Photographies de nos chantiers">
      {items.map((item, index) => {
        const photo = item.photos[photos[index]];
        const open = active === index;
        return <div className="project-panel" key={item.type} data-active={open}>
          <button type="button" id={`realisation-${index}`} ref={element => { buttons.current[index] = element; }}
            className="project-panel-trigger" aria-expanded={open} aria-controls={`${id}-${index}`}
            onClick={() => setActive(index)} onFocus={() => setActive(index)}
            onPointerEnter={event => {
              if (event.pointerType === "mouse" && !root.current?.contains(document.activeElement)) setActive(index);
            }}
            onKeyDown={event => {
              const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % items.length
                : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index - 1 + items.length) % items.length
                : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
              if (next !== null) { event.preventDefault(); buttons.current[next]?.focus(); }
            }}><span>{item.type}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={open ? "M6 12h12" : "M6 12h12M12 6v12"} /></svg></button>
          <div className="project-panel-content" id={`${id}-${index}`} inert={!open} aria-hidden={!open}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
            {item.photos.length > 1 && <div className="project-panel-pagination">
              <span className="tnum">{photos[index] + 1} / {item.photos.length}</span>
              <button type="button" aria-label={`Photo suivante — ${item.type}`} onClick={() => setPhotos(current => current.map((value, i) => i === index ? (value + 1) % item.photos.length : value))}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>
            </div>}
          </div>
        </div>;
      })}
    </div>
  </div>;
}
