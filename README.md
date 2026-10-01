# Geotehnika SARL — site vitrine

Site « page produit » à défilement cinématique : une séquence d'images dessinée sur un `<canvas>` et pilotée par le scroll, puis les sections Expertises, Approche, Réalisations, Entreprise et Contact.

Stack : **Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger · Lenis**. Les décisions de motion sont dans [MOTION.md](MOTION.md).

## Lancer

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

Node 20+, pnpm. Les polices (Inter, Inter Tight) sont téléchargées une fois au build par `next/font` : la première compilation a besoin du réseau.

## Où modifier quoi

| Quoi | Où |
|---|---|
| Tous les textes (nav, hero, légendes, cartes, contact, footer) | [src/content/site.ts](src/content/site.ts) — dans un titre, `*mot*` marque le mot accentué (vert ; rouge dans le H1) |
| Séquence d'images (nombre de frames, dossiers, dimensions) | [src/content/frames.ts](src/content/frames.ts) |
| Moments d'apparition des légendes sur le film | `BEATS` dans [src/components/Hero.tsx](src/components/Hero.tsx) (fractions de la plage de 400 vh) |
| Palette, typographie, boutons, cartes | [src/app/globals.css](src/app/globals.css) — les variables `--bg`, `--green`, … sont les seules couleurs autorisées |
| Logo | `public/logo.svg`, `public/logo-wordmark.svg` (+ `.png` transparents), `public/favicon.svg` |
| Photos de réalisations | Photos fournies sous `assets/realisations/`, WebP et miniatures sous `public/realisations/`. Séries et légendes dans `site.realisations.items`. Provenance dans `assets/realisations/manifest.json`. |
| Mentions légales | [src/app/mentions-legales/page.tsx](src/app/mentions-legales/page.tsx) (identifiants à compléter) |

### Remplacer la séquence (film du hero)

1. Déposer la nouvelle vidéo dans `assets/source.mp4` (plan continu, sans coupe franche : le scroll arrière la rejoue à l'envers).
2. Extraire les frames — ~150–240 frames, WebP q75, premières et dernières frames incluses :

   ```sh
   # desktop, 1920 px de large (adapter -t à la durée utile ; ici la fin figée était coupée à 7,625 s)
   ffmpeg -y -i assets/source.mp4 -t 7.625 -vf "scale=1920:-2:flags=lanczos" \
     -c:v libwebp -lossless 0 -quality 75 -compression_level 6 public/frames/desktop/frame_%04d.webp
   # mobile, recadrage central 9:16 → 720×1280
   ffmpeg -y -i assets/source.mp4 -t 7.625 -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=720:1280:flags=lanczos" \
     -c:v libwebp -lossless 0 -quality 75 -compression_level 6 public/frames/mobile/frame_%04d.webp
   ```

   Pour une vidéo à 30 fps ou plus longue, ajouter `fps=24` (ou `fps=<N/durée>`) dans `-vf` pour rester sous ~240 frames.
3. Mettre à jour `count`, `width`, `height` dans `src/content/frames.ts`.
4. Recaler `BEATS` dans `Hero.tsx` si les plans changent.

Le poster (LCP) est `frame_0001.webp` de chaque jeu ; rien d'autre à changer.

### Remplacer le logo

Le logo est une image (le mot-symbole n'est pas composé en police). `public/logo-wordmark.svg` est utilisé dans la nav ; `public/logo.svg` est la version complète avec la signature. Les deux ont été vectorisés depuis `assets/logo.png` (fond blanc) avec les couleurs de la palette ; pour un nouveau logo, remplacer ces fichiers (SVG sur fond transparent) en gardant les noms.

### Carte

La carte interactive utilise l’iframe OpenStreetMap, sans clé API. Le repère `33.5314883, -7.6477044` provient de la fiche publique Geotehnika sur Waze (Place ID `ChIJhbQSTMIypg0RFj4e857hhCY`), correspondant à l’adresse de Sidi Maârouf. Le lien Itinéraire ouvre Google Maps. Les coordonnées et le Place ID se configurent dans `src/content/site.ts`. La carte est chargée paresseusement ; le lien d’itinéraire reste disponible si le fournisseur externe ne charge pas.

### Formulaire

Le formulaire valide les champs avec des erreurs françaises intégrées, puis affiche un aperçu du message. Le visiteur ouvre sa messagerie (`mailto:`) ou copie le message ; il peut revenir modifier le formulaire. Aucun message n’est transmis au serveur ni enregistré. Une route API ou un service de formulaire reste nécessaire pour un envoi direct depuis le site.

## Décisions prises (à valider)

- **Frames** : la source fait 1280×720 ; le jeu desktop est agrandi à 1920 px comme demandé (8,4 Mo pour 183 frames), le jeu mobile est un recadrage central 9:16 à **720×1280** plutôt que 1080 px de large — au-delà de ×1,8 l'agrandissement ne fait qu'ajouter des octets sans détail. Le jeu mobile est choisi par **orientation portrait**, pas par largeur (une tablette en paysage garde le jeu desktop).
- **Fin figée** de la vidéo (7,625 s → 8,04 s) coupée ; aucune frame noire au début.
- **`scrub: 0.6`** conservé comme demandé, bien que Lenis lisse déjà (voir MOTION.md) ; sur tactile, Lenis est natif et c'est le seul lissage.
- **Contraste** : `--green` (#1E8449) sur `--bg` fait 4,2:1, donc tout texte vert **petit** utilise `--green-bright` (6,9:1) ; `--green` sert au mot accentué des titres (texte large). Le bouton primaire est en texte `--bg` sur `--green-bright` (6,9:1) — blanc sur `--green` ne fait que 4,3:1 (Lighthouse l'a relevé) et blanc sur `--green-bright` 2,6:1. Au survol, le vert s'éclaircit par `color-mix` avec `--white` : aucune couleur hors palette.
- **Révélations** : elles animent `opacity` seulement (pas `visibility`), sinon les `h2` disparaissent de l'arbre d'accessibilité tant qu'ils ne sont pas défilés.
- **Rouge** : mot « voient » du H1, point actif de la nav, point du menu mobile — rien d'autre.
- **Numéros** uniquement sur les 4 étapes de l'approche (une vraie séquence), pas sur les autres sections.
- **Textes** : les descriptions des métiers, des étapes, des engagements et le paragraphe entreprise sont une proposition rédigée à partir du brief ; à relire par Geotehnika (aucun chiffre ajouté au-delà de ceux du brief). Les 6 réalisations sont des **exemples fictifs** à remplacer.
- **Mentions légales** : page minimale créée pour éviter un lien mort ; identifiants à compléter.
- **Menu mobile** : simple panneau sous la barre (pas de plein écran) ; Lenis est stoppé pendant l'ouverture.
- Le skill `scroll-animation` nomme son fichier de préflight `ANIMATION.md` ; il est ici `MOTION.md` comme demandé. Son bloc `frame-sequence` (worker de décodage, fenêtre de bitmaps) n'a pas été copié : le composant [src/lib/frame-sequence.ts](src/lib/frame-sequence.ts) est plus simple (préchargement progressif, frame la plus proche déjà chargée, densité plafonnée aux frames) et suit ses règles.

## Vérification

Contrôlé dans Chrome (desktop 1440×900, iPhone 390×844 émulé, `prefers-reduced-motion` forcé) et avec Lighthouse sur le build de production : **performance mobile 95, accessibilité 100, bonnes pratiques 100, SEO 100** ; `/` pèse 158 kB de JS au premier chargement. Le détail (points de progression mesurés, ce qui reste à valider sur un vrai iPhone) est dans la section « Verification » de [MOTION.md](MOTION.md).
