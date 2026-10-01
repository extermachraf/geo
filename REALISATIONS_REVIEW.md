# Réalisations refinement

The user preferred the original expanding accordion and rejected the replacement gallery. The final implementation restores that composition: horizontal expanding panels on desktop, stacked panels on mobile, square surfaces and the existing section curtain.

The baseline independent design and evidence reviews identified two priorities: replace repeated generated illustrations with authentic photographs and improve browsing/readability. The initial design review scored the applicable criteria 19/28. Its replacement-gallery recommendation was superseded by the user’s explicit preference to preserve the accordion.

## Final scope

- All 14 supplied JPEGs are available across six descriptive photo groups, with optimized WebP derivatives. Original assets are untouched; assets/realisations/manifest.json records provenance.
- No unverified cities or project claims are attached to the photographs.
- The original panel interaction is retained, with shorter 550ms transitions and the shared motion easing.
- Portrait and landscape photos retain their full framing. Small internal controls browse additional photos.
- Keyboard selection, focus-visible controls, inactive inert content and reduced motion remain supported.
- Gallery exit is delayed until its bottom leaves the reading area.

Questions skipped for the restoration: the user specified the layout and scope. No new independent critique was requested for this narrow reversal; baseline independent reviews informed the retained improvements.

## Validation

ESLint and TypeScript passed. Browser checks passed at 1440px, 390px and 320px (including reduced motion): keyboard selection, internal photo browsing, loaded real images and no page overflow. Desktop and mobile screenshots confirmed the original panel composition and full image framing after correcting intrinsic image sizing.
