"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { site } from "@/content/site";
import { AnimatedSectionHead } from "./AnimatedSectionHead";
import { DirectionalContent } from "./DirectionalContent";

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function Contact() {
  const { contact } = site;
  const [errors, setErrors] = useState<Partial<Record<"nom" | "email" | "message", string>>>({});
  const [draft, setDraft] = useState({ name: "", email: "", message: "", href: "", body: "" });
  const [feedback, setFeedback] = useState("");
  const [formFeedback, setFormFeedback] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const fieldError = (name: "nom" | "email" | "message", value: string) => {
    if (!value.trim()) return { nom: "Indiquez votre nom.", email: "Indiquez votre adresse e-mail.", message: "Décrivez brièvement votre projet." }[name];
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Vérifiez l’adresse e-mail, par exemple vous@entreprise.ma.";
    return "";
  };
  const validateField = (name: "nom" | "email" | "message", value: string) => {
    setErrors(previous => ({ ...previous, [name]: fieldError(name, value) }));
  };
  const closeDialog = () => {
    gsap.killTweensOf(panel.current);
    if (matchMedia(REDUCED_MOTION_QUERY).matches) dialog.current?.close();
    else gsap.to(panel.current, { y: 16, opacity: 0, duration: .2, ease: "power2.in", onComplete: () => dialog.current?.close() });
  };
  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(`À : ${contact.email.label}\nObjet : Projet — ${draft.name}\n\n${draft.body}`);
      setFeedback("Message copié. Collez-le dans votre messagerie pour l’envoyer.");
    } catch {
      setFeedback("Copie indisponible. Vous pouvez sélectionner le message ci-dessus et le copier manuellement.");
    }
  };
  const { lat, lng } = contact.map;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${contact.map.placeId}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - .005},${lat - .003},${lng + .005},${lat + .003}&layer=mapnik&marker=${lat},${lng}`;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors = Object.fromEntries((["nom", "email", "message"] as const).map(name => [name, fieldError(name, String(data.get(name) ?? ""))]));
    setErrors(nextErrors);
    const firstInvalid = (["nom", "email", "message"] as const).find(name => nextErrors[name]);
    if (firstInvalid) {
      setFormFeedback("Vérifiez les champs indiqués avant de préparer votre message.");
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }
    const name = String(data.get("nom")).trim();
    const email = String(data.get("email")).trim();
    const message = String(data.get("message")).trim();
    const body = `${message}\n\n${name}\n${email}`;
    setDraft({ name, email, message, body, href: `${contact.email.href}?subject=${encodeURIComponent(`Projet — ${name}`)}&body=${encodeURIComponent(body)}` });
    setFeedback("");
    setFormFeedback("");
    dialog.current?.showModal();
    gsap.killTweensOf(panel.current);
    gsap.fromTo(panel.current, { y: 24, opacity: 0, clipPath: "inset(8% 0 0 0)" }, {
      y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: matchMedia(REDUCED_MOTION_QUERY).matches ? 0 : .4, ease: "power3.out",
    });
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container-x">
        <AnimatedSectionHead title={contact.title} lead={contact.lead} />
        <DirectionalContent className="contact-layout">
          <div className="contact-form-group" data-motion-group data-motion-side="right" data-motion-exit="after-read">
            <form id="contact-projet" noValidate onSubmit={onSubmit} data-motion-surface className="contact-form">
              <h3 className="display-3 contact-column-heading">Votre projet</h3>
              <p className="contact-required">Tous les champs sont requis.</p>
              <div className="contact-fields">
                <label>
                  <span id="contact-nom-label">{contact.form.name}</span>
                  <input id="contact-nom" aria-labelledby="contact-nom-label" aria-invalid={Boolean(errors.nom)} aria-describedby="contact-nom-error" onBlur={event => validateField("nom", event.currentTarget.value)} onChange={event => { if (errors.nom) validateField("nom", event.currentTarget.value); }} name="nom" type="text" autoComplete="name" required placeholder="Votre nom" className="field" />
                  <span className="contact-field-error" id="contact-nom-error" aria-live="polite">{errors.nom}</span>
                </label>
                <label>
                  <span id="contact-email-label">{contact.form.email}</span>
                  <input id="contact-email" aria-labelledby="contact-email-label" aria-invalid={Boolean(errors.email)} aria-describedby="contact-email-error" onBlur={event => validateField("email", event.currentTarget.value)} onChange={event => { if (errors.email) validateField("email", event.currentTarget.value); }} name="email" type="email" autoComplete="email" required placeholder="vous@entreprise.ma" className="field" />
                  <span className="contact-field-error" id="contact-email-error" aria-live="polite">{errors.email}</span>
                </label>
                <label className="contact-message">
                  <span id="contact-message-label">{contact.form.message}</span>
                  <textarea id="contact-message" aria-labelledby="contact-message-label" aria-invalid={Boolean(errors.message)} aria-describedby="contact-message-error contact-message-help" onBlur={event => validateField("message", event.currentTarget.value)} onChange={event => { if (errors.message) validateField("message", event.currentTarget.value); }} name="message" rows={5} required placeholder="Parlez-nous du terrain et de l’ouvrage envisagé…" className="field" />
                  <span className="contact-help" id="contact-message-help">{contact.form.messagePlaceholder}</span>
                  <span className="contact-field-error" id="contact-message-error" aria-live="polite">{errors.message}</span>
                </label>
              </div>
              <div className="contact-form-actions">
                <button type="submit" className="btn btn-primary">{contact.form.submit}<Arrow /></button>
                <p>Le message s’ouvrira dans votre messagerie. Vous pourrez le relire avant de l’envoyer.</p>
                <p>{contact.form.privacy}</p>
              </div>
              <p role="status" aria-live="polite" className="contact-status">{formFeedback}</p>
            </form>
          </div>
          <div className="contact-location-group" data-motion-group data-motion-side="left" data-motion-exit="after-read">
            <div id="contact-siege" data-motion-surface className="contact-location">
              <h3 className="display-3 contact-column-heading">Notre siège</h3>
              <address className="contact-address">
                <p className="contact-street">{contact.address.map(line => <span key={line}>{line}</span>)}</p>
                <div className="contact-direct">
                  <a className="tnum" href={contact.phone.href}>{contact.phone.label}<Arrow /></a>
                  <a href={contact.email.href}>{contact.email.label}<Arrow /></a>
                </div>
              </address>
              <div className="contact-map">
                <iframe src={mapSrc} title="Localisation du siège Geotehnika à Sidi Maârouf, Casablanca" loading="lazy" referrerPolicy="no-referrer" />
              </div>
              <div className="contact-map-caption">
                <span>Sidi Maârouf · Casablanca</span>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer">{contact.map.linkLabel}<Arrow /></a>
              </div>
            </div>
          </div>
        </DirectionalContent>
      </div>
      <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-draft-title" aria-describedby="contact-draft-help" onCancel={event => { event.preventDefault(); closeDialog(); }} onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div ref={panel} className="contact-dialog-panel" data-lenis-prevent>
          <button type="button" className="contact-dialog-close" aria-label="Fermer l’aperçu" onClick={closeDialog}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
          <h2 id="contact-draft-title">Votre message,<br />prêt à partir.</h2>
          <p id="contact-draft-help">Rien n’est encore envoyé. Ouvrez votre messagerie ou copiez le message pour l’envoyer à notre équipe.</p>
          <dl className="contact-draft-details"><div><dt>À</dt><dd>{contact.email.label}</dd></div><div><dt>De</dt><dd>{draft.name} · {draft.email}</dd></div></dl>
          <p className="contact-draft-message">{draft.message}</p>
          <div className="contact-dialog-actions">
            <a className="btn btn-primary" href={draft.href} onClick={() => setFeedback("Message préparé. Envoyez-le depuis votre messagerie. Si elle ne s’ouvre pas, utilisez « Copier le message ».")}>Ouvrir ma messagerie<Arrow /></a>
            <button type="button" className="contact-copy" onClick={copyDraft}>Copier le message</button>
          </div>
          <p role="status" aria-live="polite" className="contact-draft-feedback">{feedback}</p>
          <button type="button" className="contact-edit" onClick={closeDialog}>Revenir au projet</button>
        </div>
      </dialog>
    </section>
  );
}
