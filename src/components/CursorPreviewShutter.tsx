"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, setupGsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";

type PreviewItem = { title: string; previewImage: string };

export function CursorPreviewShutter({ area, items }: {
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
      gsap.set(element, { opacity: 0 });
      if (!conditions?.hover) return;
      const reduced = Boolean(conditions.reduced);
      const xTo = gsap.quickTo(element, "x", { duration: .28, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: .28, ease: "power3.out" });
      let visible = false;
      let current = -1;
      let choreography: gsap.core.Timeline | undefined;
      const parts = () => ({
        surface: element.querySelector(".expertise-preview-surface"),
        curtains: element.querySelectorAll(".expertise-preview-shutter"),
        images: element.querySelector(".expertise-cursor-images"),
        caption: element.querySelector(".expertise-cursor-caption"),
      });
      const hide = () => {
        if (!visible) return;
        visible = false;
        choreography?.kill();
        const { surface, curtains, caption } = parts();
        if (reduced || !surface) return void gsap.set(element, { opacity: 0 });
        choreography = gsap.timeline();
        choreography.to(caption, { y: 8, opacity: 0, duration: .12, ease: "power2.in" }, 0);
        choreography.to(curtains, { scaleY: 1, duration: .22, stagger: { each: .035, from: "end" }, ease: "power3.inOut" }, 0);
        choreography.to(surface, { rotationY: 10, rotationZ: 2, scale: .96, duration: .3, ease: "power2.in" }, 0);
        choreography.to(element, { opacity: 0, duration: .1 }, .22);
      };
      const show = (side: number) => {
        visible = true;
        choreography?.kill();
        const { surface, curtains, images, caption } = parts();
        gsap.set(element, { opacity: 1 });
        if (!surface) return;
        if (reduced) {
          gsap.set(surface, { clearProps: "transform" });
          gsap.set(curtains, { scaleY: 0 });
          gsap.set(images, { clearProps: "transform" });
          gsap.set(caption, { opacity: 1, y: 0 });
          return;
        }
        gsap.set(surface, { transformPerspective: 900, rotationY: -18 * side, rotationZ: -3 * side, scale: .91, transformOrigin: side > 0 ? "left center" : "right center" });
        gsap.set(curtains, { scaleY: 1, transformOrigin: "center bottom" });
        gsap.set(images, { scale: 1.15, x: -12 * side });
        gsap.set(caption, { y: 12, opacity: 0 });
        choreography = gsap.timeline();
        choreography.to(surface, { rotationY: 0, rotationZ: 0, scale: 1, duration: .65, ease: "expo.out" }, 0);
        choreography.to(curtains, { scaleY: 0, duration: .48, stagger: { each: .055, from: side > 0 ? "start" : "end" }, ease: "power3.inOut" }, .035);
        choreography.to(images, { scale: 1, x: 0, duration: .8, ease: "power3.out" }, .035);
        choreography.to(caption, { y: 0, opacity: 1, duration: .26, ease: "power3.out" }, .28);
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        const target = (event.target as Element).closest<HTMLElement>("[data-preview-index]");
        if (!target || !region.contains(target)) return hide();
        const index = Number(target.dataset.previewIndex);
        if (!items[index]) return hide();
        const changed = current !== index;
        if (changed) { current = index; setActive(index); }
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const flip = event.clientX + width + 48 > innerWidth;
        const x = Math.max(24, Math.min(innerWidth - width - 24, flip ? event.clientX - width - 28 : event.clientX + 28));
        const y = Math.max(88, Math.min(innerHeight - height - 24, event.clientY - height * .35));
        if (!visible || reduced) {
          xTo.tween.pause(); yTo.tween.pause();
          gsap.set(element, { x, y });
        } else { xTo(x); yTo(y); }
        if (!visible || changed) show(flip ? -1 : 1);
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
        choreography?.kill(); xTo.tween.kill(); yTo.tween.kill();
        gsap.killTweensOf(element);
        gsap.set(element, { opacity: 0 });
      };
    });
    return () => media.revert();
  }, [area, items]);

  return (
    <div ref={preview} className="expertise-cursor-preview is-shutter" aria-hidden="true">
      {enabled && <div className="expertise-preview-surface">
        <div className="expertise-preview-media">
          <div className="expertise-cursor-images">
            {items.map((item, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={item.title} src={item.previewImage} alt="" width={960} height={640}
                className={index === active ? "is-active" : ""} decoding="async" />
            ))}
          </div>
          <div className="expertise-preview-shutters">
            <span className="expertise-preview-shutter" /><span className="expertise-preview-shutter" /><span className="expertise-preview-shutter" />
          </div>
        </div>
        <div className="expertise-cursor-caption"><span>{items[active]?.title}</span><span>Illustration</span></div>
      </div>}
    </div>
  );
}
