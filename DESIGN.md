# Design System Document: The Kinetic Monolith

## 1. Overview & Creative North Star
**Creative North Star: The Architectural Precision**

This design system moves away from the "cluttered dashboard" trope of project management tools. Instead, it adopts the philosophy of **The Architectural Precision**: a workspace that feels like a high-end physical studio. We achieve a premium, custom feel through intentional asymmetry, dramatic typographic scale, and "Atmospheric Depth." By rejecting standard 1px borders and rigid grids in favor of tonal shifts and layered surfaces, we create a tool that feels less like software and more like a curated environment for high-performance teams.

---

## 2. Color & Atmospheric Tones
The palette is rooted in a "Deep Charcoal" foundation, utilizing a sophisticated range of grays to define space without the need for structural lines.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed. If a section feels "lost," increase the tonal contrast between containers rather than adding a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper.
* **Base Layer:** `surface` (#fcf9f8)
* **Receded Areas:** `surface-container-low` (#f6f3f2) for sidebar backgrounds or inactive regions.
* **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a "lifted" feel for primary tasks.
* **Active Overlays:** `surface-container-highest` (#e5e2e1) for temporary modals or popovers.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating navigation and context menus.
* **Token:** `surface-variant` at 70% opacity with a `24px` backdrop-blur.
* **Signature CTA Texture:** For primary actions, use a linear gradient from `primary` (#3525cd) to `primary-container` (#4f46e5) at a 135-degree angle. This provides a "visual soul" that a flat hex code cannot achieve.

---

## 3. Typography: The Editorial Edge
The type system pairs the geometric authority of **Manrope** for high-level branding with the Swiss-style utility of **Inter** for data-heavy work.

* **The Display Scale:** Use `display-lg` (3.5rem) with `font-weight: 800` for empty states or project milestones. This creates an editorial, "poster-like" impact.
* **Headline Hierarchy:** `headline-sm` (1.5rem) should be used for project titles to maintain an authoritative presence.
* **The Utility Duo:** `body-md` (Inter, 0.875rem) handles the bulk of task descriptions, while `label-sm` (0.6875rem) in all-caps with `letter-spacing: 0.05rem` is reserved for metadata like "DUE DATE" or "ASSIGNEE."

---

## 4. Elevation & Depth
In this design system, depth is a functional tool for focus, not just a decoration.

* **The Layering Principle:** Stacking tiers is our primary method of organization. Place a `surface-container-lowest` card on a `surface-container-low` background to create a soft, natural lift.
* **Ambient Shadows:** For "floating" elements (modals, dropdowns), use extra-diffused shadows:
* `box-shadow: 0 20px 40px rgba(28, 27, 27, 0.06);` (Using the `on-surface` color for the shadow tint).
* **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": `outline-variant` (#c7c4d8) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components & Interaction Patterns

### Buttons (The Kinetic Triggers)
* **Primary:** Indigo gradient (`primary` to `primary-container`), `DEFAULT` radius (0.5rem), white text.
* **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
* **Tertiary:** Transparent background with `primary` text. Use for low-emphasis actions like "Cancel."

### Input Fields
* **Base State:** Use `surface-container-low` background.
* **Focus State:** Transition to `surface-container-lowest` with a 2px `primary` bottom-bar only (no full-box stroke). This mimics high-end stationery.

### Cards & Lists
* **The "No-Divider" Rule:** Forbid the use of divider lines. Separate list items using `12px` of vertical white space and a subtle `on-surface-variant` (10% opacity) hover state that fills the entire row.

### Real-Time Collaboration Indicators
* **Presence:** Use `secondary` (#58579b) for active user cursors.
* **Status Pulsing:** High-contrast `primary` dots for "Live" updates, utilizing a soft glow effect: `box-shadow: 0 0 8px #3525cd;`

---

## 6. Do's and Don'ts

### Do:
* **Embrace Negative Space:** If a screen feels busy, increase the padding between sections rather than adding containers.
* **Layer Tones:** Use `surface-container` tiers to guide the eye from the general (sidebar) to the specific (task details).
* **Use Bold Weight for Hierarchy:** Rely on font weight (600, 700) rather than color to differentiate titles from body text.

### Don't:
* **Don't Use Pure Black:** Always use `on-surface` (#1c1b1b) for text to maintain a premium, ink-like feel.
* **Don't Use Standard Shadows:** Avoid heavy, dark shadows. If it looks like a "drop shadow," it's too heavy. It should look like "ambient light."
* **Don't Use Lines:** Never use a line when a color shift or whitespace can do the job.