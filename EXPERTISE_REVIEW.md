# Expertise hover preview review

Method: dual-agent (A: /root/preview_design_review · B: /root/preview_evidence_review). Both reviewed the original implementation independently. Source: `CursorPreviewShutter.tsx`, selected by `CursorPreview.tsx`; incumbent context: `globals.css`, `MOTION.md`, and shared section motion. B's valid browser evidence came from localhost:3001; its initial localhost:3000 timeout was discarded.

## Original design health

Scores apply to this decorative preview, not the whole site.

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| Visibility of state | 3 | Correct image and caption; prolonged reveal |
| Match with real world | 4 | Discipline-specific illustrations, honest label |
| User control | 3 | Leave/scroll dismiss; pointer-following obstruction |
| Consistency | 1 | Rounded card, perspective and shutters conflict with planar masks |
| Error prevention | n/a | No input or irreversible action |
| Recognition | 4 | Image corresponds to visible service name |
| Flexibility/efficiency | 3 | Immediate reduced motion, touch exclusion |
| Minimalism | 2 | Several simultaneous motion cues |
| Error recovery | n/a | No user task/error flow |
| Help/documentation | n/a | Decorative supplement to complete text |
| Total | 20/28 | Functional foundation; presentation needs refinement |

## Design specificity and impression

The imagery belongs to the four engineering disciplines. The interaction's 12px rounding, broad soft shadow, 18-degree perspective, rotation, red shutter stagger and zoom introduce a portfolio-card vocabulary absent from the surrounding open typography, technical rails and directional masks. The useful moment of visual recognition is delayed by choreography that calls attention to itself.

The four services do not overload choices. Attentional load comes from following, rotating, staggered shutter movement and zoom competing with the explanation. Fast scanners repeatedly wait for the 800ms crop settlement; first-time visitors can lose the description behind the image. Motion-sensitive visitors benefit from the existing immediate reduced-motion path.

## Two priority areas

1. **P2 — Inconsistent presentation.** Replace rounded elevation and layered 3D/shutter choreography with a square, restrained illustration plate and one directional mask using existing easing. Preserve the frame when the selected image changes. Increase the 10px caption to 12px.
2. **P2 — Reading and robustness.** Both reviewers observed the image covering service text. B measured a 340×251.5px plate at x546.6/y394.1 over the first service. Place it outside the active text block and constrain the crop to neighboring text and short viewports. Coordinate reveal with successful image load, preserving the unobstructed text when loading fails.

## Strengths retained

- Four supplied discipline illustrations and honest Illustration labeling.
- Decorative accessibility treatment, pointer-event transparency, and complete information in the text.
- Dismissal on leave, cancel, scroll, blur and resize; touch exclusion and immediate reduced motion.

B verified six rapid leave/reentries recovered correctly; leave, scroll and resize hid the original preview; reduced motion cleared transforms; touch rendered no image children. All original assets loaded locally. Cold-network flicker and short-height clipping were source-based risks, not observed baseline failures.

## Implemented refinement

The active `CursorPreview.tsx` now uses a square surface and one diagonal mask with shared `SECTION_MOTION` easing. Entry is 420ms, exit 220ms; service changes crossfade over 180ms without replaying the entrance. Perspective, rotation, zoom and red shutters are absent. A restrained shadow and 12px provenance strip retain image legibility.

The image occupies the opposite timeline column and crops to the available gap between adjacent service blocks. Vertical pointer drift is bounded to 12px. Narrow layouts below 768px and coarse pointers do not mount preview images. Loaded images reveal only for the still-hovered service; failed images leave the preview hidden. Interrupted exits are cancelled before reopening.

Validation: browser assertions passed at 1440×1080, 1024×768 and 800×300, including all four services, viewport bounds, no active-text overlap, repeated reentry, reduced motion and scroll dismissal. A 390px touch viewport rendered no preview images. An aborted image request did not show a blank plate. TypeScript and ESLint passed. A later visual crop-width correction explicitly sets the media width to 100%; final visual review follows that correction.

Questions skipped: the synthesis has two priority areas, and the user already requested improving this preview to match the existing site.

Final disposition: **ship**. Assessment A performed a fresh final desktop browser review after the crop-width correction and confirmed square edges, restrained shadow, readable caption, and unobstructed active/neighboring text. The constrained crop is deliberately shallower in tight gaps while retaining recognizable equipment. Screenshot: `/tmp/geotehnika-review/preview-final-desktop.png`.

Run notes: both independent assessments completed; no ignore file existed. Detector and critique-storage slug commands failed with exit 126 (launcher permission denied). Consequently no detector overlay, standardized snapshot, or trend read was available. This Markdown file records the critique and implementation instead. Browser screenshots were captured in fresh Chrome pages; browsers were closed by their scripts. Evidence and temporary test scripts remain in `/tmp/geotehnika-review` for inspection. No Impeccable live server was started. The parent preview server on port 3001 was stopped after verification; the existing port 3000 process was left alone.
