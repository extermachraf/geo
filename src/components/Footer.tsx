import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { DirectionalContent } from "./DirectionalContent";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <DirectionalContent className="container-x footer-content">
        <div className="footer-grid">
          <div data-motion-group data-motion-side="left" data-motion-entry="page-end" data-motion-exit="after-read">
            <div data-motion-surface className="footer-brand">
              <Link href="#accueil" aria-label="Geotehnika — Accueil" className="footer-logo">
                <Image src="/logo-wordmark.svg" alt="Geotehnika" width={240} height={45} />
              </Link>
              <p>{site.hero.subtitle}</p>
              <a className="footer-social" href={site.footer.linkedin.href} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.4 7.8H1.8V22h3.6V7.8ZM3.6 2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM22.2 13.5c0-4.3-2.3-6.3-5.3-6.3-2.4 0-3.5 1.3-4.1 2.2V7.8H9.2V22h3.6v-7.9c0-2.1.4-4.1 3-4.1 2.5 0 2.6 2.3 2.6 4.2V22H22v-8.5h.2Z" /></svg>
                {site.footer.linkedin.label}
              </a>
            </div>
          </div>
          <div data-motion-group data-motion-side="right" data-motion-entry="page-end" data-motion-exit="after-read">
            <nav data-motion-surface aria-label="Navigation de pied de page">
              <h2 className="footer-heading">Explorer</h2>
              <ul className="footer-links">
                {site.nav.filter(item => item.id !== "accueil").map(item => <li key={item.id}><Link href={`#${item.id}`}>{item.label}</Link></li>)}
              </ul>
            </nav>
          </div>
          <div data-motion-group data-motion-side="right" data-motion-entry="page-end" data-motion-exit="after-read">
            <div data-motion-surface>
              <h2 className="footer-heading">Informations</h2>
              <ul className="footer-links"><li><Link href={site.footer.legal.href}>{site.footer.legal.label}</Link></li><li><Link href="#approche">Notre approche</Link></li></ul>
            </div>
          </div>
          <div data-motion-group data-motion-side="right" data-motion-entry="page-end" data-motion-exit="after-read">
            <div data-motion-surface>
              <h2 className="footer-heading">Nous contacter</h2>
              <address className="footer-address">
                <p>{site.contact.address.map(line => <span className="block" key={line}>{line}</span>)}</p>
                <a href={site.contact.email.href}>{site.contact.email.label}</a>
                <a className="tnum" href={site.contact.phone.href}>{site.contact.phone.label}</a>
              </address>
            </div>
          </div>
        </div>
        <div className="footer-bottom" data-motion-group data-motion-side="left" data-motion-entry="page-end" data-motion-exit="after-read">
          <p data-motion-surface>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
        </div>
      </DirectionalContent>
    </footer>
  );
}
