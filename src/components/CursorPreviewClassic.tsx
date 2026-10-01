"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, setupGsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";

type PreviewItem = { title: string; previewImage: string };

/** Decorative hover media; it never captures input or replaces service content. */
export function CursorPreviewClassic({ area, items }: {
  area: RefObject<HTMLDivElement | null>;
  items: readonly PreviewItem[];
}) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add({ hover: "(hover: hover) and (pointer: fine)", reduced: REDUCED_MOTION_QUERY }, ({ conditions }) => {
      const element = preview.current;
      const region = area.current;
      if (!element || !region) return;
      setEnabled(Boolean(conditions?.hover));
      if (!conditions?.hover) {
        gsap.set(element, { opacity: 0 });
        return;
      }
      const reduced = Boolean(conditions.reduced);
      gsap.set(element, { opacity: 0, scale: reduced ? 1 : .94, rotation: 0,
        clipPath: reduced ? "inset(0% 0% 0% 0% round 12px)" : "inset(12% 0% 12% 0% round 12px)" });
      const xTo = gsap.quickTo(element, "x", { duration: .22, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: .22, ease: "power3.out" });
      let visible = false;
      let current = -1;
      const hide = () => {
        visible = false;
        gsap.to(element, {
          opacity: 0, scale: reduced ? 1 : .96, rotation: 0,
          clipPath: reduced ? "inset(0% 0% 0% 0% round 12px)" : "inset(8% 0% 8% 0% round 12px)",
          duration: reduced ? 0 : .2, ease: "power2.in", overwrite: "auto",
        });
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        const target = (event.target as Element).closest<HTMLElement>("[data-preview-index]");
        if (!target || !region.contains(target)) return hide();
        const index = Number(target.dataset.previewIndex);
        if (!items[index]) return hide();
        if (current !== index) {
          current = index;
          setActive(index);
        }
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const x = Math.max(16, Math.min(innerWidth - width - 16,
          event.clientX + width + 40 > innerWidth ? event.clientX - width - 24 : event.clientX + 24));
        const y = Math.max(80, Math.min(innerHeight - height - 16, event.clientY - height * .35));
        if (!visible || reduced) {
          xTo.tween.pause();
          yTo.tween.pause();
          gsap.set(element, { x, y });
        } else {
          xTo(x);
          yTo(y);
        }
        if (!visible) {
          visible = true;
          gsap.set(element, { opacity: 0, scale: reduced ? 1 : .94, rotation: reduced ? 0 : -.8 });
          gsap.to(element, {
            opacity: 1, scale: 1, rotation: 0,
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            duration: reduced ? 0 : .38, ease: "power3.out", overwrite: "auto",
          });
        }
      };
      region.addEventListener("pointermove", move);
      region.addEventListener("pointerleave", hide);
      region.addEventListener("pointercancel", hide);
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("blur", hide);
      window.addEventListener("resize", hide);
      return () => {
        region.removeEventListener("pointermove", move);
        region.removeEventListener("pointerleave", hide);
        region.removeEventListener("pointercancel", hide);
        window.removeEventListener("scroll", hide);
        window.removeEventListener("blur", hide);
        window.removeEventListener("resize", hide);
        xTo.tween.kill();
        yTo.tween.kill();
        gsap.killTweensOf(element);
        gsap.set(element, { opacity: 0 });
      };
    });
    return () => media.revert();
  }, [area, items]);

  return (
    <div ref={preview} className="expertise-cursor-preview" aria-hidden="true">
      {enabled && <>
        <div className="expertise-cursor-images">
          {items.map((item, index) => (
            /* Generated illustrations are decorative, not project references. */
            // eslint-disable-next-line @next/next/no-img-element
            <img key={item.title} src={item.previewImage} alt="" width={960} height={640}
              className={index === active ? "is-active" : ""} decoding="async" />
          ))}
        </div>
        <div className="expertise-cursor-caption"><span>{items[active]?.title}</span><span>Illustration</span></div>
      </>}
    </div>
  );
}
