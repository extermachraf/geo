# MOTION.md — Geotehnika SARL

Preflight from the `scroll-animation` skill (it names this file `ANIMATION.md`; kept as `MOTION.md` per the brief).
Written before the first block; update it when a decision changes.

## Decisions

| Decision         | Value                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Profile          | Expressive: one pinned, stepped film on the home page; inertial scroll with snap rests                                                                                                                                                                                                                                                                       |
| Scroll authority | `/` → **Lenis** (lerp 0.1, `autoRaf: false`, driven by `gsap.ticker`; touch stays native, Lenis default). Reduced motion → **native** (Lenis torn down live). `/mentions-legales` inherits the provider (no scenes there).                                                                                                                                   |
| Engines          | CSS + **GSAP 3 (ScrollTrigger)** through `@gsap/react`. No Motion: GSAP is already paid for, one engine per element.                                                                                                                                                                                                                                         |
| Pinned scenes    | 1 (the hero film), 4 viewports of runway (`400lvh`), CSS sticky pin (`100lvh`, `overflow: clip`)                                                                                                                                                                                                                                                             |
| Budgets          | JS ≤ 160 kB gz on `/` · frames: desktop 183 × ~45 kB = **8.4 MB** (progressive: 20 first, then batches of 6), mobile 183 × ~16 kB = **3.4 MB** · poster = frame 1 (LCP element, `fetchpriority=high`, never waits for hydration) · decoded memory: browser image cache over `HTMLImageElement`s, canvas backing store never finer than the frames, DPR cap 2 |
| Reduced motion   | No Lenis. Hero renders **unpinned** with the static poster frame + copy, and the four captions as a plain list under it. Reveals and counters render their end state.                                                                                                                                                                                        |
| Layout scale     | Plain px (no fluid-design). Breakpoint `md` = 768px for nav; frame set chosen by **orientation** (portrait → mobile set).                                                                                                                                                                                                                                    |
| Existing motion  | None (greenfield)                                                                                                                                                                                                                                                                                                                                            |
| Film interaction | The pinned film and captions follow continuous Lenis scrolling through the 400lvh runway. `scrub: 0.6` keeps frame transitions fluid without forced snap points.                                                                                                                                                                                             |

## Scene ledger

| #   | Section                                      | Clock   | Block (engine)                                                                                                                   | Runway      | Reduced motion        |
| --- | -------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 1   | Nav                                          | scroll  | surface switch at `scrollY > 24` (React state, per transition) + IntersectionObserver active section (red dot)                   | —           | same, no motion       |
| 2   | Hero film                                    | media   | `FrameSequence` (canvas, cover-fit) fed by a paused GSAP timeline with directional snap at 0, .25, .5 and .75; natural exit at 1 | 4 viewports | static poster, no pin |
| 3   | Hero copy, scroll hint, 4 captions, end veil | scroll  | tweens on the same timeline (windows below), `opacity`/`transform` only                                                          | in the pin  | captions as a list    |
| 4   | Section headlines (5)                        | trigger | `Reveal`: one `gsap.from` per section, `once: true`, start `top 85%`                                                             | —           | visible at rest       |
| 5   | Stats (2 numbers)                            | trigger | `CountUp`, once, 1.6 s                                                                                                           | —           | final numbers         |
| 6   | Cards                                        | —       | CSS hover: divider turns `--green-bright`                                                                                        | —           | —                     |

## Film ↔ scroll mapping

- Source `assets/source.mp4`: 1280×720, 24 fps, 8.04 s. Frozen tail from 7.625 s trimmed → **183 frames** (0–7.625 s).
- Shots: golden-hour wide shot 0–1.4 s · whip pan 1.4–2.0 s · quarry excavator digging 2.0–5.3 s · tilt up to the sun 5.3–7.6 s.
- Progress `p` over the 400lvh range (≈ 19 px of scroll per frame at 1080 px tall), settling at five beats:
  - `0`: intro copy
  - `0.25`: caption 1
  - `0.5`: caption 2
  - `0.75`: caption 3
- `0.92 → 1`: caption 4 and exit veil, then the next section

| Element                                                 | In             | Out         |
| ------------------------------------------------------- | -------------- | ----------- |
| Hero copy (H1, sub, CTA)                                | visible from 0 | 0.13 → 0.20 |
| Scroll hint                                             | visible from 0 | 0.02 → 0.06 |
| Caption 1 « Chaque terrain est différent. »             | 0.26           | 0.42        |
| Caption 2 « Nous étudions, puis nous forons. »          | 0.45           | 0.60        |
| Caption 3 « Précision millimétrique, sous la surface. » | 0.63           | 0.78        |
| Caption 4 « Le résultat : des ouvrages qui durent. »    | 0.83           | stays to 1  |
| End veil (`--bg` at 60 %)                               | 0.88           | 1           |

## Invariants applied

- One scroll authority per page; Lenis never runs its own loop; ScrollTrigger updates from Lenis's scroll event in the same ticker frame.
- Range wrapper is measured, never the sticky pin; pin is `100lvh` (never `dvh`); no transform or `overflow: hidden` on the pin or its ancestors.
- Scroll paths write `opacity`/`transform` and the canvas only; state changes (nav surface, active link, ready) happen per transition.
- `ScrollTrigger.config({ ignoreMobileResize: true })` so the iOS toolbar collapse doesn't re-measure the scene mid-scroll.
- Canvas: draws the nearest loaded frame while the exact one loads, never a blank; hidden until first draw (poster underneath).

## Verification

Done 30 Sep 2026 in headless Chrome (DevTools MCP) against `next dev`, then Lighthouse 12 against `next build` + `next start`.

**Ran and passed**

- Desktop 1440×900 (DPR 1.1): canvas backing store 1425×900 (capped by DPR, never finer than the frames); scene = 4 viewports; measured at p = 0 / 0.1 / 0.17 / 0.33 / 0.52 / 0.70 / 0.95 / 1: copy 1 → 0.43 → 0, captions exactly one at a time (1/0), veil 0.35 at 0.95 and 0.6 at 1; nav transparent at scrollY 0, elevated + blurred from scrollY 25; H1 on 3 lines; contact form logs to the console and shows its confirmation; console clean.
- Mobile 390×844 DPR 3, touch: portrait set chosen (`/frames/mobile`), backing store 591×1280, 143 of 183 frames fetched within 2 s of load, no horizontal overflow, hero and mid-film caption readable, menu opens with Lenis stopped (`lenis-stopped`) and the red active dot, console clean.
- Reduced motion (`matchMedia` forced): no Lenis class on `<html>`, no canvas and no pinned scene, poster + copy + the 4 captions as a list, section headlines at rest, no frame request beyond the poster.
- Lighthouse mobile (simulated throttling): **performance 95, accessibility 100, best practices 100, SEO 100**; FCP 0.8 s, LCP 2.9 s (the H1), TBT 100 ms, CLS 0. The first run scored 87 / 95 and found two real defects, both fixed: white on `--green` is 4.32:1 (button recoloured), and `autoAlpha` reveals hid every `h2` from the accessibility tree at load (reveals now animate opacity only).
- Build: `/` is 158 kB first-load JS (budget 160 kB); `pnpm lint` and `tsc --noEmit` clean.

**Not provable headlessly — to do on devices**

- iPhone Safari: toolbar collapse over the `100lvh` pin, feel of `scrub: 0.6` under native touch scrolling, tab-bar tint during the pinned scene (ios-safari-motion.md §1).
- Android Chrome: scrub smoothness on a mid-tier phone, decode cost of the mobile set.
- Keyboard walk-through of the mobile menu and the form on a device; Lighthouse on the final hosting (real cache headers for `/frames`).

## Expertise timeline — 1 Oct 2026 correction

The heading and alternating timeline now share one sticky container. Pinning is enabled only when the entire group fits below the fixed navigation; otherwise the timeline scrolls naturally. A ResizeObserver measures the actual rendered group, including font wrapping, instead of assuming a fixed heading height. The line endpoints follow the first and last node centers.

One GSAP master timeline coordinates both layouts. Pinned service phases fit within the available sticky travel (`stage height - group height`); normal-layout phases are derived from each row’s measured position and the viewport. The line reaches each node at its corresponding activation label. The heading enters from the left and the subtitle from the right, hold in place, then exit in opposite directions as the heading leaves the viewport. Services enter with alternating horizontal movement; no blur is used. Reduced motion removes the runway and explicitly clears animated styles, including blur, when the preference changes while the page is open.

Browser review used headless Chrome with emulated desktop, tablet, and mobile viewports (1440×1080, 1440×900, 1280×720, 768×1024, 390×844, 320×568). Checks cover all four nodes and the line reaching completion, heading separation, horizontal overflow, and readable service text. A confirmation round additionally exercises live viewport resizing and switching reduced motion on and off. These checks do not constitute physical-device or Safari validation.

## Reusable synchronized section motion

Saved in `src/lib/section-motion.ts` as `SECTION_MOTION`, `addSectionIntro`, and `addSectionStep`. Expertise uses a single GSAP timeline and a single ScrollTrigger for the entire section, including entry, service progression, hold, and exit. All choreography uses scroll-distance units; do not treat these durations as seconds in a time-driven timeline.

Sequence:

1. `intro`: heading enters from the left; the lead enters from the right 40 scroll units later. Both settle before the service sequence starts.
2. `service-N`: the main line reaches the node precisely at its activation label. The node activates, the connector follows after 16 units, then the service title, description, and specialties settle in sequence after a 32-unit delay, staggered by 16 units. Each starts at 15% opacity and reaches full opacity as it slides into place. Left connectors grow from the timeline outward, mirrored for right connectors.
3. Hold: completed services remain readable. No blur is used.
4. `exit`: heading and lead depart in opposite directions as the heading group leaves view. Reverse scrolling reverses the same master timeline.

To reuse: create one scrubbed GSAP timeline; call `addSectionIntro(timeline, heading, lead, { travel, exitAt })`; call `addSectionStep` for each connected content group with its activation position and semantic label. Map activation positions from the real layout and scroll distance. Use the mobile travel values on narrow screens, resolve active/inactive colors from design tokens, and provide a reduced-motion branch that clears transform, opacity, and other animated inline styles. The expertise component demonstrates fitting the sticky group, recalculating on resize, and deriving connector positions from node geometry.

The shared preset is used by expertise and the approach heading. `AnimatedSectionHead.tsx` reuses the exact heading/lead entry, hold, exit, easing, and scrub settings for normal-flow section headings, including resize and reduced-motion handling. Heading travel is 128px on desktop and 48px on mobile; text wrappers clip sideways overflow. Service travel remains 32px/16px. Hero motion remains independent.

### Expertise cursor preview

`CursorPreview.tsx` renders a decorative, square illustration plate using the site's diagonal mask and shared `SECTION_MOTION` easing. It enters from the left over 420ms and leaves to the right over 220ms, without perspective, rotation, red shutters, or zoom. Switching services preserves the settled plate and crossfades images over 180ms. The caption is 12px and retains the honest Illustration label.

The plate sits in the opposite timeline column, outside the hovered service block, and allows at most 12px of vertical pointer drift with a restrained 160ms lag. The crop height fits between adjacent service blocks in that column, keeping their text visible. Viewport clamping and a short-viewport image-height limit keep it below the header and within the screen. It never intercepts input. Leave, cancel, scroll, blur, and resize dismiss it. Interrupted exits cannot hide a newly reopened preview. Images appear only after successful load; asynchronous completion only reveals the still-hovered service. Failed images leave the text unobstructed.

Touch/coarse-pointer devices and layouts below 768px neither display the preview nor mount its images. Reduced motion shows and places the plate immediately, without masks moving or image crossfades. All information remains in the service text; the hover imagery is decorative.

Image paths live in `previewImage` on each expertise entry in `src/content/site.ts`. The four generated discipline-specific illustrations are labeled Illustration and do not represent Geotehnika project photographs. WebP assets remain in `public/expertise/`; originals and prompt provenance remain unchanged. The previous classic and shutter source files remain inactive historical alternatives.

### Approach process refinement

The approach retains the shared opposing heading/lead entrance and exit. Its process is an open connected rail: four columns above 1100px, two at 640–1099px, and a vertical sequence below 640px. Each visible row uses one reversible scrubbed timeline: rail first, then number, heading and copy in reading order, with a bounded 120ms sibling offset. It shares expertise's easing and scrub preset; local durations are timeline units normalized to the row's scroll range. Statistics reveal together after the process, retaining their count-up behavior. Values appear above their labels, and Casablanca has a smaller type scale. Reduced motion restores final values and removes spatial reveals.

The section uses natural height with generous separation between introduction, steps and statistics, avoiding the global fixed-height section rule. Copy and company figures remain unchanged.

The next approach refinement places the introduction in two columns on tablet/desktop and stacks it on mobile. Larger red-accented process numbers lead the rail; copy uses a synchronized rectangular mask reveal with no blur. Statistics sit in one deep-green band with accessible tinted labels and white values. The process still uses 4/2/1 columns, natural section height, reversible scrub, count-up values, and shared directional heading/lead motion. Reduced motion also clears the copy masks.

Approach departure now runs per visible process row from `top 24%` to `bottom 12%`: the outer steps fade and move slightly outward/up, staggered by 0.05 timeline units. Entrance remains on their children so the two phases do not write the same transforms. Statistics land from `top 92%` to `top 65%`: the green panel wipes in from left to right and settles from 36px below, then its values/labels follow. The separate `.approach-stats-shell` fades and rises out from `top 20%` to `bottom 12%`, preserving the panel's reversible entrance. All phases use shared easing/scrub and clear transforms, opacity and masks under reduced motion.

Statistics now have distinct text and panel choreography: each value rises through a rectangular mask, with its label sliding in 0.1 timeline units later; groups follow in reading order at 0.1-unit offsets. On departure, the group wrappers fade and drift up/left first, then the outer green-panel shell wipes toward the right and rises away. Separate entry/exit ownership preserves reversal without competing transforms. Reduced motion clears the value masks, labels, group wrappers and panel shell.

Approach's transition now uses a solid diagonal black curtain instead of interpolating the palette through grey. A decorative `.approach-backdrop` sweeps across a light base from section `top 95%` to `top 70%` with the shared scrub and `power2.inOut` easing. Its diagonal overshoots the section bounds so the heading lands on solid black. Text keeps the final dark-theme colors throughout; Expertise retains its white surface. Reverse scrolling retracts the same curtain. Reduced motion and the no-JavaScript fallback show solid black immediately. The backdrop cannot intercept pointer events and sits behind the content.

### Réalisations

`ProjectSequence` preserves the original expanding accordion: six horizontal panels on desktop and six stacked panels on mobile. Active flex weights remain 7 and 6 respectively. Supplied photographs replace the generated illustrations; object-fit contain preserves portrait and landscape subjects. Panels settle over 550ms with the shared entrance easing, and their content reveals over 350ms after a 100ms offset. Hover, focus and tap open panels; pointer hover respects an existing keyboard focus. Arrow keys, Home and End select panels. A small next-photo control inside each open panel exposes the remaining supplied images without replacing the accordion with a separate gallery. Inactive content is inert; reduced motion switches immediately. The existing diagonal section entrance and white surface curtain remain. The directional exit begins only when the gallery bottom reaches 22% of the viewport, keeping the photos readable longer.

Approach also has an explicit left-to-right surface exit. A white `.approach-exit-backdrop` sweeps over both the dark background and departing content as Réalisations moves from `top 70%` to `top 30%`. It uses the same diagonal shape, scrub and easing as the entrance curtain, and sits above the content to prevent white text remaining over exposed white. It cannot intercept input. Reverse scrolling retracts the exit curtain; reduced motion leaves it clipped away so the static dark section remains readable.

The hover-expand gallery's outer choreography now matches the site's directional theme: its inner surface enters from the left (128px desktop / 48px mobile) through the shared diagonal curtain shape, then holds at full opacity. Its outer wrapper leaves toward the right by the same distance with a left-to-right mask. Entry and exit keep separate transform ownership, so panel expansion remains independent. Shared easing/scrub, reverse scrolling, responsive travel and reduced-motion clearing are preserved.

### Entreprise and mandatory content motion

`DirectionalContent` applies the shared entrance/hold/rightward-exit language to six normal-flow groups in Entreprise: the heading enters from the left, and both paragraphs and all three commitments enter from the right. Every group settles at center with a rectangular reveal, stays readable, then leaves to the right through a mask. Travel is 128px desktop / 48px mobile, with shared easing and scrub; per-group viewport triggers synchronize desktop columns and preserve reading order on mobile. Entry owns the inner surface; exit owns the outer group. Reduced motion clears all masks/transforms/opacity, and the section uses natural height with horizontal clipping. The wrapper and data attributes can be reused for other sections without changing their copy.

### Entreprise side-scroll navigation

Entreprise now uses an original implementation inspired by [Skiper60](https://skiper-ui.com/v1/skiper60): four concise destinations (Notre métier, Qualité, HSE, Respect des délais), a sticky desktop sidebar, and a sticky horizontally scrollable mobile navigation. A red indicator tracks the section crossing the reading line. Real anchor links use the existing Lenis scroll owner with offsets for the fixed header and mobile navigation; reduced motion uses immediate native scrolling and an immediate indicator. Existing company paragraphs and commitments are unchanged; only the short Notre métier label was added.

`SectionSurfaceMotion` supplies the same diagonal black entrance and left-to-right white departure through shared surface helpers. Company departure starts late, when Contact approaches the header, so clicking the last destination cannot hide its content under the curtain. Topic exits also wait until their bottom approaches the header, preserving readable click destinations. Content retains its directional arrival/exit masks. Natural height, 12rem minimum desktop topic spacing, and short mobile blocks keep the story compact. No Skiper source/assets or additional runtime dependencies are used.

Contact and footer reuse the shared directional motion: opposing entrances, a reading pause, and masked rightward departures. Contact's details and form use `after-read` so content remains visible until it passes the header. Contact uses natural height to preserve the form on short viewports. The footer follows the Footer-01 reference's brand/navigation/information/contact columns and separated copyright row, using only existing Geotehnika links. Footer groups use `data-motion-entry="page-end"`: their arrival ranges clamp to the document's scroll limit so every link and the copyright finish entering at the bottom. Scrolling back reverses these entrances; no empty scroll extension is added.

The Hero-to-Expertise gradient spacer is removed. Expertise and the combined Contact/footer surface now use `LightSurfaceMotion`, a single reversible white curtain over the dark base with the same `top 95%` → `top 70%` range, ease, and scrub as the other background reveals. Contact and footer share one backdrop; Entreprise no longer runs a second white departure curtain. Section boundary borders are removed while internal control and content dividers remain.

Contact polish retains the combined white curtain, opposing content entrances and after-read departures. The location column now holds the real OpenStreetMap embed and a separate directions link; the writing column uses open underline fields and visible keyboard focus. The map is lazy-loaded without an API key. Its coordinates are taken from Geotehnika's public Waze place listing, replacing the illustrative coordinates. The form prepares a mailto draft instead of simulating delivery.

Contact typography follows the existing split: Montserrat for the column headings, office details, links, labels, inputs and controls; Cardo for the introductory prose. Fields explicitly set their UI font to avoid the global `.field { font: inherit }` resetting them to Cardo. Both columns share the existing `display-3` heading scale and aligned heading spacing. Labels are 14px and input text is 16px across breakpoints.

Contact interaction review: complete input boundaries, green focus surfaces and red inline validation replace browser validation popups. Errors and persistent project help are associated with stable field labels; submit focuses the first invalid control. The form precedes location in DOM/mobile order, with desktop visual order retained. Valid preparation opens an accessible native dialog with a short GSAP masked entrance and downward exit, respecting reduced motion. Escape, close and return restore form focus; a clipboard fallback complements the mailto handoff. No delivery is claimed. Full review is recorded in CONTACT_REVIEW.md.

### First-visit and reload introduction

`PageEntrance` wraps the home page without transforming or clipping its content, preserving the hero's sticky geometry. Every home-page mount, including a reload, shows a compact centered logo-led group on the existing dark surface. The supplied wordmark progressively fills with its brand colors over a dim grayscale base, tied to actual readiness progress. “Chargement” and the 01%–100% counter use 12px Montserrat. The supporting phrase has been removed. A one-pixel rail sits beneath the progress row, with no skip button. French copy lives in `site.loading`.

The entire screen lands through the site's diagonal mask over 550ms from first paint, while the whole central group settles from 16px below over 600ms with a 100ms offset. Both entrances use CSS so hydration cannot first reveal and then re-hide an already painted composition. The logo's color reveal is the primary loading motion. At completion, the group departs right over 200ms and the full plate wipes away over 550ms. The underlying page wrapper never receives transforms. No new animation engine, fonts or assets are added.

The introduction waits for the orientation-appropriate hero poster, logo and document fonts. The counter advances monotonically with those settled tasks and a 1550ms minimum presentation; failed images settle their task. It reaches 100 before departure without claiming to preload the full progressive film. A 6-second deadline guarantees continuation when readiness stalls. No-JavaScript hides the plate immediately; an 8-second CSS failsafe prevents a permanently visible splash.

Reduced motion disables both CSS entrances, shows the complete colored logo without a moving mask, and uses a 120ms opacity exit without a minimum dwell. Live preference changes clear spatial movement. During loading, page content is inert and native/Lenis scrolling is locked. Completion, Escape, deadline and unmount restore access and scroll ownership. Escape offers immediate departure. A stable status avoids announcing every counter increment.

Validation includes 1440×900, 390×844, 320×568 and 800×300, monotonic progress, reload, menu access after release, skip/Escape, reduced motion, JavaScript-disabled access, stalled font readiness, failed poster loading, TypeScript and ESLint. Independent final desktop/mobile design review returned ship. Critique and provenance are recorded in PRELOADER_REVIEW.md.
