"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, setupGsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { SECTION_MOTION } from "@/lib/section-motion";

const MASK = {
  enter: "polygon(0% 0%, -12% 0%, -24% 100%, 0% 100%)",
  open: "polygon(0% 0%, 136% 0%, 112% 100%, 0% 100%)",
  exit: "polygon(100% 0%, 136% 0%, 112% 100%, 100% 100%)",
};

/** Decorative, pointer-only illustrations; all service information stays in the page. */
export function CursorPreview({ area, items }: {
  area: RefObject<HTMLDivElement | null>;
  items: readonly { title: string; previewImage: string }[];
}) {
  const preview = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ hover: "(min-width: 768px) and (hover: hover) and (pointer: fine)", reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      const element = preview.current;
      const region = area.current;
      if (!element || !region) return;
      setEnabled(Boolean(conditions?.hover));
      gsap.set(element, { opacity: 0 });
      if (!conditions?.hover) return;

      const reduced = Boolean(conditions.reduced);
      const xTo = gsap.quickTo(element, "x", { duration: .16, ease: SECTION_MOTION.ease.enter });
      const yTo = gsap.quickTo(element, "y", { duration: .16, ease: SECTION_MOTION.ease.enter });
      let visible = false;
      let current = -1;
      let pointer: { x: number; y: number; index: number; target: HTMLElement } | null = null;
      let choreography: gsap.core.Timeline | undefined;
      const surface = () => element.querySelector<HTMLElement>(".expertise-preview-surface");
      const hide = () => {
        if (!visible) return;
        visible = false;
        choreography?.kill();
        xTo.tween.pause(); yTo.tween.pause();
        if (reduced) { gsap.set(element, { opacity: 0 }); return; }
        choreography = gsap.timeline({ onComplete: () => { gsap.set(element, { opacity: 0 }); } })
          .to(surface(), { x: 20, clipPath: MASK.exit, duration: .22, ease: SECTION_MOTION.ease.exit });
      };
      const dismiss = () => { pointer = null; hide(); };
      const update = () => {
        if (!pointer) return;
        const { y: clientY, index, target } = pointer;
        const image = element.querySelector<HTMLImageElement>(`img[data-image-index="${index}"]`);
        // Never reveal an empty or failed image, including on a cold connection.
        if (!image?.complete || !image.naturalWidth) { hide(); return; }
        const changed = current !== index;
        if (changed) {
          current = index;
          element.querySelectorAll("img").forEach(img => img.classList.toggle("is-active", img === image));
          const caption = element.querySelector(".expertise-cursor-caption span");
          if (caption) caption.textContent = items[index].title;
        }
        const gutter = 16;
        // Use the opposite timeline column so the illustration cannot cover its description.
        const bounds = target.getBoundingClientRect();
        const rightColumn = Boolean(target.closest(".expertise-timeline-row-right"));
        const row = target.closest(".expertise-timeline-row");
        const previous = row?.previousElementSibling?.querySelector("[data-preview-index]")?.getBoundingClientRect();
        const next = row?.nextElementSibling?.querySelector("[data-preview-index]")?.getBoundingClientRect();
        const topLimit = Math.max(80, (previous?.bottom ?? 68) + 12);
        const bottomLimit = Math.min(innerHeight - gutter, (next?.top ?? innerHeight) - 12);
        const captionHeight = element.querySelector<HTMLElement>(".expertise-cursor-caption")?.offsetHeight ?? 48;
        const media = element.querySelector<HTMLElement>(".expertise-cursor-images");
        const mediaHeight = Math.min(innerHeight - 176, bottomLimit - topLimit - captionHeight);
        if (!media || mediaHeight < 48) { hide(); return; }
        media.style.maxHeight = `${mediaHeight}px`;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const preferredX = rightColumn ? bounds.left - width - 24 : bounds.right + 24;
        const x = Math.max(gutter, Math.min(innerWidth - width - gutter, preferredX));
        const drift = Math.max(-12, Math.min(12, clientY - (bounds.top + bounds.height / 2)));
        const y = Math.max(topLimit, Math.min(bottomLimit - height, bounds.top + (bounds.height - height) / 2 + drift));
        if (!visible || reduced) {
          xTo.tween.pause(); yTo.tween.pause();
          gsap.set(element, { x, y });
        } else { xTo(x); yTo(y); }
        if (visible) return; // Service changes crossfade; the frame stays settled.
        visible = true;
        const interrupted = choreography?.isActive();
        choreography?.kill();
        gsap.set(element, { opacity: 1 });
        if (reduced) { gsap.set(surface(), { x: 0, clipPath: MASK.open }); return; }
        if (!interrupted) gsap.set(surface(), { x: -20, clipPath: MASK.enter });
        choreography = gsap.timeline().to(surface(), {
          x: 0, clipPath: MASK.open, duration: .42, ease: SECTION_MOTION.ease.enter,
        });
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        const target = (event.target as Element).closest<HTMLElement>("[data-preview-index]");
        const index = Number(target?.dataset.previewIndex);
        if (!target || !region.contains(target) || !items[index]) return dismiss();
        pointer = { x: event.clientX, y: event.clientY, index, target };
        update();
      };
      // Image load is asynchronous: reveal only the still-hovered service when ready.
      const imageReady = () => update();
      region.addEventListener("pointermove", move);
      region.addEventListener("pointerleave", dismiss);
      region.addEventListener("pointercancel", dismiss);
      element.addEventListener("load", imageReady, true);
      element.addEventListener("error", imageReady, true);
      window.addEventListener("scroll", dismiss, { passive: true });
      window.addEventListener("blur", dismiss);
      window.addEventListener("resize", dismiss);
      return () => {
        region.removeEventListener("pointermove", move);
        region.removeEventListener("pointerleave", dismiss);
        region.removeEventListener("pointercancel", dismiss);
        element.removeEventListener("load", imageReady, true);
        element.removeEventListener("error", imageReady, true);
        window.removeEventListener("scroll", dismiss);
        window.removeEventListener("blur", dismiss);
        window.removeEventListener("resize", dismiss);
        choreography?.kill(); xTo.tween.kill(); yTo.tween.kill();
        gsap.set(element, { opacity: 0 });
      };
    });
    return () => media.revert();
  }, [area, items]);

  return <div ref={preview} className="expertise-cursor-preview is-directional" aria-hidden="true">
    {enabled && <div className="expertise-preview-surface">
      <div className="expertise-cursor-images">
        {items.map((item, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.title} data-image-index={index} src={item.previewImage} alt="" width={960} height={640} decoding="async" />
        ))}
      </div>
      <div className="expertise-cursor-caption"><span /><span>Illustration</span></div>
    </div>}
  </div>;
}
