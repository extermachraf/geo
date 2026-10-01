# Contact — Impeccable review

Method: two independent assessments, `/root/contact_design_review` and `/root/contact_interaction_review`. Target: `src/components/Contact.tsx`. Assessment A used source and current desktop/mobile screenshots; its fresh browser launch failed in the sandbox. Assessment B used fresh browser pages at 1440, 390 and 320px. Original design score: **25/40**.

| Nielsen heuristic | Score /4 | Original finding |
| --- | ---: | --- |
| System status | 2 | Small status assumes email app opens |
| Real-world language | 3 | French copy appropriate; handoff unexplained |
| Control and freedom | 3 | Editable inputs; missing email fallback |
| Consistency | 3 | Correct fonts; browser-dependent validation |
| Error prevention | 2 | Required guidance not visible |
| Recognition | 3 | Persistent labels; disappearing project guidance |
| Efficiency | 3 | Phone, email and itinerary alternatives |
| Aesthetic clarity | 3 | Balanced columns; faint field boundaries |
| Error recovery | 1 | Native bubbles only |
| Help | 2 | Missing completion/recovery explanation |

Specificity: the terrain headline, French engineering copy, Casablanca address and Montserrat/Cardo pairing are product-specific. The former input styling was interchangeable. Preserve the established identity and motion.

Strengths: calm composition, consistent headings and typography, real lazy-loaded map, autocomplete, visible keyboard focus, labelled controls, and alternatives to form completion.

Cognitive load is low while writing, moderate at external email handoff. The emotional valley was after the main action: the site cannot verify whether a mail application opens, and nothing is sent from the site. The large mobile map delayed the primary inquiry task.

Priority issues and changes:
- P1: uncertain email handoff and no recovery. Add honest draft preview and explicit external send explanation; offer copying the draft when no mail application is available.
- P2: faint field boundaries. Introduce complete borders, white surfaces, restrained radii, inner padding, and green focus treatment while preserving Montserrat at 16px.
- P2: native validation bubbles. Replace them with French inline errors, required guidance, associated descriptions, invalid states, and first-error focus. Validate on blur/submit; correct existing errors while typing.
- P2: disappearing guidance. Keep project guidance below the message field with `aria-describedby`.
- P2: mobile map before inquiry. Put the form first in DOM and on mobile, retaining desktop location/form columns.
- P2: small links. Use 44px minimum click areas for phone, email, directions and dialog controls.

Persona findings: first-time visitors need to understand that a prepared email must still be sent. Keyboard/screen-reader users need associated error text and stable focus. Distracted mobile visitors need direct access to the form and a fallback when an external app does not open.

Minor observations: preserve native textarea resize and map attribution. Keep feedback at readable helper-text size. Keep the shared Contact/footer curtain and opposing content motion. Do not animate a focused control out of view.

Questions considered: does the map need to precede the primary action on mobile? What happens when the visitor has no configured email client? The user's request already authorizes improvements to the complete section, inputs and popups; the implementation addresses these questions without an additional scope approval.

Run notes: independent reviews completed. Ignore file absent. Slug helper and CLI detector failed because the Impeccable engine 0.1.8 was unavailable and its cache unwritable. Formal snapshot/trend unavailable; this file is a manual review record, not a generated detector snapshot. Mutable injection preflight passed in Assessment B, but no detector overlay or visibility claim was made. No visualization server started; existing development server preserved. Assessment B removed its temporary script and retained screenshots. Browser review provided fallback evidence.
