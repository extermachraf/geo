"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, REDUCED_MOTION_QUERY, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { FRAME_SETS } from "@/content/frames";
import { site } from "@/content/site";

/** One bounded introduction per home-page mount, including every full reload. */
export function PageEntrance({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const page = content.current!;
    const screen = overlay.current!;
    const html = document.documentElement;
    const oldOverflow = html.style.overflow;
    const oldInert = page.inert;
    const preference = matchMedia(REDUCED_MOTION_QUERY);
    let disposed = false;
    let ending = false;
    let released = false;
    let frame = 0;
    let settled = 0;
    let progress = 1;
    let printed = 1;
    const started = performance.now();
    const images: HTMLImageElement[] = [];
    let exit: gsap.core.Timeline | undefined;

    html.setAttribute("data-site-loading", "");
    html.style.overflow = "hidden";
    page.inert = true;
    getLenis()?.stop();
    const release = () => {
      if (released) return;
      released = true;
      html.removeAttribute("data-site-loading");
      html.style.overflow = oldOverflow;
      page.inert = oldInert;
      getLenis()?.start();
      ScrollTrigger.refresh();
    };
    const print = (value: number) => {
      const integer = Math.max(1, Math.min(100, Math.floor(value)));
      if (counter.current && integer !== printed) {
        counter.current.textContent = String(integer).padStart(2, "0");
        printed = integer;
      }
      if (rail.current) rail.current.style.transform = `scaleX(${value / 100})`;
      if (logo.current) logo.current.style.clipPath = preference.matches ? "inset(0 0 0 0)" : `inset(0 ${100 - value}% 0 0)`;
    };
    const complete = (skip = false) => {
      if (disposed || ending) return;
      ending = true;
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      const reduced = prefersReducedMotion();
      if (!skip) print(100);
      screen.querySelectorAll<HTMLElement>("[data-loading-copy]").forEach(copy => { copy.style.animation = "none"; });
      screen.style.animation = "preloader-failsafe 0s 8s forwards";
      exit = gsap.timeline({ onComplete: () => {
        if (disposed) return;
        release();
        setDone(true);
      } });
      if (reduced) exit.to(screen, { opacity: 0, duration: .12 });
      else {
        exit.to(screen.querySelectorAll("[data-loading-copy]"), {
          x: 16, opacity: 0, duration: .2, ease: "power2.in",
        }, skip ? 0 : .18);
        exit.to(screen, {
          clipPath: "polygon(100% 0%, 136% 0%, 112% 100%, 100% 100%)",
          duration: .55, ease: "power3.inOut",
        }, skip ? .08 : .3);
      }
    };

    const markSettled = () => { if (!disposed) settled += 1; };
    const imageReady = (src: string) => {
      const image = new Image();
      images.push(image);
      image.onload = image.onerror = markSettled;
      image.src = src;
    };
    const set = matchMedia("(orientation: portrait)").matches ? FRAME_SETS.mobile : FRAME_SETS.desktop;
    imageReady(`${set.dir}/frame_0001.webp`);
    imageReady("/logo-wordmark.svg");
    void document.fonts.ready.then(markSettled, markSettled);
    const deadline = window.setTimeout(() => complete(), 6000);
    const tick = (now: number) => {
      if (disposed || ending) return;
      const minimum = preference.matches ? 0 : 1550;
      const elapsed = now - started;
      const target = 1 + (settled / 3) * 98;
      const timeLimit = minimum ? 1 + (elapsed / minimum) * 98 : 99;
      progress = Math.max(progress, Math.min(99, target, timeLimit));
      print(progress);
      if (settled === 3 && elapsed >= minimum) return complete();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") complete(true); };
    const reduce = () => {
      if (!preference.matches) return;
      gsap.set(screen.querySelectorAll("[data-loading-copy]"), { clearProps: "transform,opacity,clipPath" });
      if (logo.current) logo.current.style.clipPath = "inset(0 0 0 0)";
      // A live preference change also removes an in-progress spatial exit.
      if (ending) { exit?.kill(); release(); setDone(true); }
    };
    window.addEventListener("keydown", escape);
    preference.addEventListener("change", reduce);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      exit?.kill();
      images.forEach(image => { image.onload = image.onerror = null; });
      window.removeEventListener("keydown", escape);
      preference.removeEventListener("change", reduce);
      release();
    };
  }, []);

  return <>
    <div ref={content} data-page-content>{children}</div>
    {!done && <div ref={overlay} className="site-preloader" data-site-preloader>
      <div className="preloader-layout">
        <div className="preloader-content" data-loading-copy>
          <div className="preloader-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="preloader-mark-base" src="/logo-wordmark.svg" alt="Geotehnika" width={256} height={48} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={logo} className="preloader-mark-fill" src="/logo-wordmark.svg" alt="" aria-hidden="true" width={256} height={48} />
          </div>
          <div className="preloader-progress">
            <p role="status">{site.loading.label}</p>
            <div className="preloader-count" aria-hidden="true"><span ref={counter}>01</span><span className="preloader-total">%</span></div>
          </div>
          <div className="preloader-rail" aria-hidden="true"><span ref={rail} /></div>
        </div>
      </div>
    </div>}
    <noscript><style>{".site-preloader { display: none !important; }"}</style></noscript>
  </>;
}
