"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;

type Commitment = { title: string; text: string };
export function CompanyStory({ paragraphs, commitments }: { paragraphs: readonly string[]; commitments: readonly Commitment[] }) {
  const root = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const topics = [{ id: "entreprise-metier", title: "Notre métier", paragraphs }, ...commitments.map((item, i) => ({ id: `entreprise-engagement-${i}`, title: item.title, paragraphs: [item.text] }))];

  useEffect(() => {
    const element = root.current!;
    const entries = Array.from(element.querySelectorAll<HTMLElement>("[data-company-topic]"));
    let frame = 0;
    const update = () => {
      const mobile = innerWidth < 768;
      const line = headerHeight() + (mobile ? 108 : 112);
      let selected = 0;
      entries.forEach((entry, i) => { if (entry.getBoundingClientRect().top <= line) selected = i; });
      setActive(selected);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  useLayoutEffect(() => {
    let tween: gsap.core.Tween | undefined;
    const measure = () => {
      const link = links.current[active]!;
      const mobile = innerWidth < 768;
      tween?.kill();
      tween = gsap.to(indicator.current, {
        x: mobile ? link.offsetLeft : 0, y: mobile ? 0 : link.offsetTop + 12,
        width: mobile ? link.offsetWidth : 2, height: mobile ? 2 : 20,
        duration: prefersReducedMotion() ? 0 : .35, ease: "power3.out",
      });
      if (mobile) {
        const list = link.parentElement!;
        if (link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth) {
          list.scrollTo({ left: link.offsetLeft - 12, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        }
      }
    };
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    measure(); window.addEventListener("resize", measure); preference.addEventListener("change", measure);
    return () => { tween?.kill(); window.removeEventListener("resize", measure); preference.removeEventListener("change", measure); };
  }, [active]);

  return <div ref={root} className="company-story">
    <nav className="company-nav" aria-label="À propos de Geotehnika">
      <div className="company-nav-list" data-lenis-prevent>
        <span ref={indicator} className="company-nav-indicator" aria-hidden="true" />
        {topics.map((topic, i) => <a key={topic.id} href={`#${topic.id}`} ref={element => { links.current[i] = element; }} aria-current={active === i ? "location" : undefined}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); event.stopPropagation();
            const target = document.getElementById(topic.id)!;
            const offset = -headerHeight() - (innerWidth < 768 ? 88 : 32);
            // Numeric positions avoid Lenis adding CSS scroll margin/padding again.
            const position = target.getBoundingClientRect().top + scrollY + offset;
            const lenis = getLenis();
            if (lenis && !prefersReducedMotion()) lenis.scrollTo(position, { duration: .9 });
            else window.scrollTo({ top: position, behavior: "auto" });
          }}>{topic.title}</a>)}
      </div>
    </nav>
    <div className="company-topics">
      {topics.map(topic => <article key={topic.id} id={topic.id} className="company-topic" data-company-topic data-motion-group data-motion-side="right" data-motion-exit="after-read">
        <div data-motion-surface>
          <h3>{topic.title}</h3>
          {topic.paragraphs.map(text => <p key={text}>{text}</p>)}
        </div>
      </article>)}
    </div>
  </div>;
}
