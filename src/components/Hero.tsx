"use client";

import { useEffect, useRef, useState } from "react";
import {
  gsap,
  setupGsap,
  useGSAP,
  prefersReducedMotion,
  REDUCED_MOTION_QUERY,
} from "@/lib/gsap";
import { FrameSequence } from "@/lib/frame-sequence";
import { FRAME_SETS } from "@/content/frames";
import { site } from "@/content/site";
import { Accent } from "./Accent";

/** One rest for the intro, then one rest for each caption across the 400lvh range. */
const BEATS: [number, number][] = [
  [0.2, 0.45],
  [0.45, 0.7],
  [0.7, 0.95],
  [0.92, 1],
];
const FADE = 0.05;

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

const POSTER = {
  desktop: `${FRAME_SETS.desktop.dir}/frame_0001.webp`,
  mobile: `${FRAME_SETS.mobile.dir}/frame_0001.webp`,
};

function Poster() {
  // The LCP element: a real image, painted before hydration, under the canvas.
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={POSTER.mobile} />
      <img
        src={POSTER.desktop}
        alt=""
        width={FRAME_SETS.desktop.width}
        height={FRAME_SETS.desktop.height}
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

function HeroCopy() {
  const { hero } = site;
  return (
    <div data-hero-copy>
      <h1 className="display-1 max-w-[17ch]">
        <Accent text={hero.title} color="red" />
      </h1>
      <p className="mt-6 max-w-[44ch] text-white/90 md:text-xl">
        {hero.subtitle}
      </p>
      <a href={hero.cta.href} className="btn btn-primary mt-8">
        {hero.cta.label}
      </a>
    </div>
  );
}

export function Hero() {
  const reduced = useMedia(REDUCED_MOTION_QUERY);
  const portrait = useMedia("(orientation: portrait)");
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      // Read the media query live too: the first render happens before the `reduced` state lands,
      // and without this the prefix frames would be fetched for nothing.
      if (
        reduced ||
        prefersReducedMotion() ||
        !canvasRef.current ||
        !root.current
      )
        return;
      setupGsap();
      const set = portrait ? FRAME_SETS.mobile : FRAME_SETS.desktop;
      const seq = new FrameSequence(canvasRef.current, set, {
        bg: "#0A0A0A",
        prefix: 20,
        onFirstDraw: () => setReady(true),
      });
      seq.resize();
      void seq.load();
      const ro = new ResizeObserver(() => seq.resize());
      ro.observe(canvasRef.current);

      const q = gsap.utils.selector(root);
      const film = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      // Scroll progress drives the frame index continuously across the pinned runway.
      tl.to(
        film,
        {
          frame: set.count - 1,
          duration: 1,
          onUpdate: () => seq.setFrame(Math.round(film.frame)),
        },
        0,
      );
      tl.to(q("[data-scroll-hint]"), { autoAlpha: 0, duration: 0.04 }, 0.02);
      tl.to(
        q("[data-hero-copy]"),
        { autoAlpha: 0, y: -32, duration: 0.07 },
        0.13,
      );
      q("[data-caption]").forEach((el, i) => {
        const [enter, leave] = BEATS[i];
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: FADE },
          enter,
        );
        if (i < BEATS.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -28, duration: FADE }, leave - FADE);
        }
      });
      // Dim the bright sky so the last caption reads and the exit to the dark page is soft.
      tl.to(q("[data-veil]"), { opacity: 0.6, duration: 0.12 }, 0.88);

      return () => {
        ro.disconnect();
        seq.destroy();
      };
    },
    { scope: root, dependencies: [reduced, portrait], revertOnUpdate: true },
  );

  if (reduced) {
    // Reduced motion: no pin, a static frame, the captions as a plain list.
    return (
      <section id="accueil" className="hero-surface" aria-label="Accueil">
        <div className="relative flex min-h-svh items-end overflow-clip">
          <Poster />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-bg to-transparent" />
          <div className="container-x relative pb-20 pt-40">
            <HeroCopy />
          </div>
        </div>
        <ul className="container-x grid gap-4 py-16 md:grid-cols-2">
          {site.hero.captions.map((caption) => (
            <li key={caption} className="display-3 text-white">
              {caption}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      id="accueil"
      ref={root}
      className="scene-root"
      aria-label="Accueil"
    >
      <div className="scene-pin bg-bg">
        <Poster />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={site.hero.filmLabel}
          className={`absolute inset-0 block h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
        {/* Scrims: top for the transparent nav, bottom so captions stay readable. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-bg/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-bg via-bg/60 to-transparent" />
        <div
          data-veil
          className="pointer-events-none absolute inset-0 bg-bg opacity-0"
        />

        <div className="container-x absolute inset-x-0 bottom-0 pb-20 md:pb-28">
          <HeroCopy />
          {site.hero.captions.map((caption) => (
            <p
              key={caption}
              data-caption
              className="display-2 absolute bottom-20 left-6 max-w-[16ch] font-display font-bold tracking-[-0.03em] text-white opacity-0 md:bottom-28 md:left-10"
            >
              {caption}
            </p>
          ))}
        </div>

        <div
          data-scroll-hint
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-sm text-white/80 md:flex"
        >
          <span>{site.hero.scrollHint}</span>
          <span className="h-10 w-px bg-white/50" />
        </div>
      </div>
    </section>
  );
}
