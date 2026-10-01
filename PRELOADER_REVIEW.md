# Minimal preloader refinement

Method: dual-agent (A: /root/preview_design_review · B: /root/preview_evidence_review). Both independently assessed `src/components/PageEntrance.tsx` and the loader CSS before edits. The user rejected the oversized editorial loader and explicitly requested a minimal animated-logo composition, a much smaller French phrase and an entrance for the entire component.

## Original preview health

Scores concern the loader, not the website.

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| Visibility of state | 4 | Clear counter and status |
| Match with real world | 3 | Familiar progress, but introduction feels like a hero |
| User control | 4 | Skip and Escape, bounded waiting |
| Consistency | 3 | Brand palette and exit fit; hierarchy misses brief |
| Error prevention | n/a | No user input or irreversible action |
| Recognition | 4 | Existing wordmark, clear French labels |
| Efficiency | 2 | Nonessential introduction dominates a short wait |
| Minimalism | 1 | Slogan and giant number compete with identity |
| Error recovery | n/a | No user error workflow |
| Help/documentation | n/a | Simple transient feedback |
| Total | 21/28 | Functional foundation, unsuitable hierarchy |

## Specificity, attention and journey

The palette, supplied logo and Cardo/Montserrat pairing belong to Geotehnika. The original large slogan and counter nevertheless make the loader an interchangeable editorial introduction. Its five signals are spread across three screen zones, creating an attentional cost rather than a decision overload. Visitors waiting to enter the site see the slogan before the brand, and the logo never participates in the animation. The user’s rejection is the strongest evidence that this expression missed the intended experience.

Useful strengths remain: generous space, restrained colors, stable status, skip/Escape, readiness deadline, reduced motion, and a diagonal exit connected to the rest of the site.

## Two priority areas

1. **P1 — Logo-led composition.** A’s design review and B’s computed-size evidence agree: the 150px corner logo loses to a 92.16px desktop slogan (40px mobile) and oversized number. Center one compact group, make the phrase secondary, and keep numerical progress quiet. Fast scanners and mobile visitors should recognize the brand without inspecting several distant zones.
2. **P1 — Coordinated arrival and logo motion.** The original GSAP entrance targets only the message and progress row; the logo and overlay have no arrival. Give the entire screen and compact group an entrance, animate the logo as the loading signal, and preserve the reliable exit/release behavior. Motion-sensitive visitors retain a fully visible, spatially quiet alternative.

B captured valid desktop/mobile screenshots; entrance scope is source-confirmed because its browser samples did not reliably catch hydrated animation. The original functional checks supply stronger evidence for completion and recovery than those samples.

## Implemented refinement

The new composition centers a wordmark up to 256px wide. Its brand colors reveal from left to right with loading progress over a grayscale base. The status and counter are 12px, the phrase is 15px, and the progress rail is one pixel. The quiet skip control remains at the bottom.

The whole screen enters through the established diagonal mask from first paint, and the complete central group settles together. CSS owns arrival so hydration cannot restart an already visible entrance; GSAP owns departure, with entrance animation cancelled before its exit. Underlying sticky page geometry remains untouched. Reduced motion removes both arrivals and the moving logo mask. Readiness, reload, skip, deadline and scroll restoration behavior are retained.

Final disposition: **ship**. Assessment A inspected fresh desktop and mobile captures after the changes and found the requested hierarchy cohesive, logo-led and minimal, with no material visual issues within this scope. Final screenshots: `/tmp/geotehnika-review/preloader-final-desktop.png` and `/tmp/geotehnika-review/preloader-final-mobile.png`.

Run notes: detector and critique-storage slug commands were attempted by B and failed exit126 because the launcher was not executable. No overlay, standardized snapshot or trend read was available; this Markdown file is the review record. No ignore file was present. Fresh browser pages and existing screenshots supplied the fallback evidence. Browsers close in their scripts; the existing implementation preview server at localhost:3001 was reused. Screenshot/test artifacts remain under `/tmp/geotehnika-review` for inspection. No extra critique live server was started.

Questions skipped: two priority areas; the user already specified minimalism, logo animation, smaller phrase and full-component arrival.
