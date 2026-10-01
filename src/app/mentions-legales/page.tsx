import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales — Geotehnika",
};

// TODO(client): complete the legal identifiers (RC, ICE, IF, capital, hébergeur).
export default function MentionsLegales() {
  return (
    <main className="container-x min-h-svh py-32">
      <Link href="/" className="text-sm text-white hover:text-green-bright">
        ← Retour à l&apos;accueil
      </Link>
      <h1 className="display-2 mt-8">Mentions légales</h1>
      <dl className="prose-max mt-12 space-y-6">
        <div>
          <dt className="font-medium text-white">Éditeur</dt>
          <dd>
            {site.name} — {site.contact.address.join(", ")}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-white">Contact</dt>
          <dd>
            {site.contact.phone.label} · {site.contact.email.label}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-white">Identifiants</dt>
          <dd>RC, ICE, IF et capital social : à compléter.</dd>
        </div>
        <div>
          <dt className="font-medium text-white">Hébergement</dt>
          <dd>À compléter.</dd>
        </div>
      </dl>
    </main>
  );
}
