"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { getLenis } from "@/lib/scroll";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const subsections: Record<string, { id: string; label: string }[]> = {
  expertises: site.expertises.items.map((item, i) => ({ id: `expertise-${i}`, label: item.title })),
  approche: site.approche.steps.map((item, i) => ({ id: `approche-${i}`, label: item.title })),
  realisations: site.realisations.items.map((item, i) => ({ id: `realisation-${i}`, label: item.type })),
  entreprise: [{ id: "entreprise-metier", label: "Notre métier" }, ...site.entreprise.commitments.map((item, i) => ({ id: `entreprise-engagement-${i}`, label: item.title }))],
  contact: [{ id: "contact-projet", label: "Votre projet" }, { id: "contact-siege", label: "Notre siège" }],
};

function MenuIcon({ open }: { open: boolean }) {
  return <span className={`nav-menu-icon${open ? " is-open" : ""}`} aria-hidden="true"><span /><span /></span>;
}

export function Nav() {
  const [heroActive, setHeroActive] = useState(true);
  const [active, setActive] = useState<string>(site.nav[0].id);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const previousOverflow = useRef("");

  useEffect(() => {
    const menu = dialog.current;
    const hero = document.getElementById("accueil");
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    site.nav.forEach(item => { const section = document.getElementById(item.id); if (section) io.observe(section); });
    const update = () => setHeroActive(hero ? hero.getBoundingClientRect().bottom > 0 : false);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      animation.current?.kill();
      if (menu?.open) {
        document.documentElement.style.overflow = previousOverflow.current;
        getLenis()?.start();
      }
    };
  }, []);

  const showMenu = () => {
    const element = dialog.current!;
    animation.current?.kill();
    closing.current = false;
    previousOverflow.current = document.documentElement.style.overflow;
    element.showModal();
    element.scrollTop = 0;
    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();
    setOpen(true);
    const groups = element.querySelectorAll(".nav-menu-group, .nav-menu-footer");
    const reduced = prefersReducedMotion();
    animation.current = gsap.timeline()
      .fromTo(panel.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : .55, ease: "power4.out" })
      .fromTo(groups, { y: reduced ? 0 : 20, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : .4, stagger: reduced ? 0 : .045, ease: "power3.out" }, reduced ? 0 : .12);
  };

  const closeMenu = (afterClose?: () => void) => {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    animation.current?.kill();
    setOpen(false);
    animation.current = gsap.timeline({ onComplete: () => {
      dialog.current?.close();
      document.documentElement.style.overflow = previousOverflow.current;
      getLenis()?.start();
      closing.current = false;
      toggle.current?.focus({ preventScroll: true });
      afterClose?.();
    } }).to(panel.current, { clipPath: "inset(0 0 100% 0)", duration: prefersReducedMotion() ? 0 : .3, ease: "power3.inOut" });
  };

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu(() => {
      const target = document.getElementById(id);
      if (!target) return;
      // Selecting a realization opens its accordion panel.
      if (target instanceof HTMLButtonElement) target.click();
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      const extra = id.startsWith("entreprise-") ? (innerWidth < 768 ? 88 : 32) : 24;
      const gallery = id.startsWith("realisation-") ? target.closest<HTMLElement>(".projects-gallery-stage") : null;
      const position = (gallery ?? target).getBoundingClientRect().top + scrollY - header - extra;
      const lenis = getLenis();
      const selectProject = () => { if (target instanceof HTMLButtonElement) target.click(); };
      if (lenis && !prefersReducedMotion()) lenis.scrollTo(position, { duration: .9, onComplete: selectProject });
      else {
        window.scrollTo({ top: position, behavior: "auto" });
        requestAnimationFrame(selectProject);
      }
      history.pushState(null, "", `#${id}`);
      const focusTarget = target;
      const oldTabIndex = focusTarget.getAttribute("tabindex");
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
      focusTarget.addEventListener("blur", () => {
        if (oldTabIndex === null) focusTarget.removeAttribute("tabindex");
        else focusTarget.setAttribute("tabindex", oldTabIndex);
      }, { once: true });
    });
  };

  return <>
    <header className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${heroActive ? "border-transparent bg-transparent text-white" : "site-nav-light border-[var(--content-line)] bg-[var(--content-bg)]/90 backdrop-blur-md text-(--content-ink)"}`}>
      <nav aria-label="Navigation principale" className="container-x flex h-(--header-h) items-center justify-between">
        <a href="#accueil" aria-label="Geotehnika — accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wordmark.svg" alt="" width={150} height={28} className="h-7 w-auto" />
        </a>
        <button ref={toggle} type="button" className="nav-menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={showMenu}>
          <span>Menu</span><MenuIcon open={false} />
        </button>
      </nav>
    </header>
    <dialog ref={dialog} id="site-menu" className="nav-menu-dialog" aria-label="Menu de navigation" data-lenis-prevent onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div ref={panel} className="nav-menu-panel">
        <div className="container-x nav-menu-top">
          <a href="#accueil" onClick={event => navigate(event, "accueil")} aria-label="Geotehnika — accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.svg" alt="" width={150} height={28} className="h-7 w-auto" />
          </a>
          <button type="button" autoFocus className="nav-menu-toggle" aria-label="Fermer le menu" onClick={() => closeMenu()}><span>Fermer</span><MenuIcon open={open} /></button>
        </div>
        <nav className="container-x nav-menu-content" aria-label="Sections et sous-sections">
          <div className="nav-menu-grid">
            {site.nav.map(item => <div key={item.id} className="nav-menu-group">
              <a className="nav-menu-heading" href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={event => navigate(event, item.id)}>
                {item.label}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </a>
              {subsections[item.id] && <ul className="nav-menu-subsections">{subsections[item.id].map(child => <li key={child.id}><a href={`#${child.id}`} onClick={event => navigate(event, child.id)}>{child.label}</a></li>)}</ul>}
            </div>)}
          </div>
          <div className="nav-menu-footer">
            <a href={site.contact.email.href}>{site.contact.email.label}</a>
            <a href={site.contact.phone.href}>{site.contact.phone.label}</a>
            <span>Casablanca, Maroc</span>
          </div>
        </nav>
      </div>
    </dialog>
  </>;
}
