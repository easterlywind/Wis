---
name: Smile Sprout UI/UX Pro Max
colors:
  background: "#f4f6f9"
  foreground: "#2c3152"
  card: "#ffffff"
  card-foreground: "#2c3152"
  primary: "#8573d8"
  on-primary: "#ffffff"
  secondary: "#63ba9c"
  on-secondary: "#ffffff"
  accent: "#8fcbe9"
  on-accent: "#2c3152"
  success: "#5eb98f"
  on-success: "#ffffff"
  destructive: "#e54d68"
  on-destructive: "#ffffff"
  emotion-happy: "#f2df79"
  emotion-sad: "#90a7da"
  emotion-angry: "#e57f7f"
  emotion-surprised: "#ce9edc"
  emotion-scared: "#b48fd3"
  emotion-excited: "#ebbb7a"
  app-bg: "radial-gradient(ellipse 80% 60% at 10% 10%, hsla(250 50% 85% / 0.12), transparent 60%), radial-gradient(ellipse 70% 50% at 90% 20%, hsla(200 50% 82% / 0.10), transparent 55%), radial-gradient(ellipse 60% 45% at 60% 90%, hsla(160 40% 80% / 0.10), transparent 55%), linear-gradient(180deg, hsl(210 30% 97%), hsl(220 25% 96%))"
typography:
  display-lg:
    fontFamily: "Fredoka, sans-serif"
    fontSize: "3rem"
    fontWeight: "800"
    letterSpacing: "-0.025em"
  headline-lg:
    fontFamily: "Fredoka, sans-serif"
    fontSize: "2.25rem"
    fontWeight: "800"
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Fredoka, sans-serif"
    fontSize: "1.875rem"
    fontWeight: "700"
  body-lg:
    fontFamily: "Nunito, sans-serif"
    fontSize: "1.125rem"
    fontWeight: "700"
  body-md:
    fontFamily: "Nunito, sans-serif"
    fontSize: "1rem"
    fontWeight: "600"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
  3xl: "1.5rem"
  clay: "2rem"
  hero: "2.5rem"
  full: "9999px"
spacing:
  unit: "8px"
  container-padding: "24px"
  card-gap: "24px"
  bento-padding: "32px"
shadows:
  soft: "0 4px 14px rgba(0, 0, 0, 0.05)"
  bento: "0 12px 35px rgba(0, 0, 0, 0.09)"
  clay: "0px 4px 0px hsla(230, 30%, 20%, 0.15), inset 0px -2px 6px rgba(0,0,0,0.1), inset 0px 2px 6px rgba(255,255,255,0.4)"
  clay-hover: "0px 6px 0px hsla(230, 30%, 20%, 0.15), inset 0px -2px 6px rgba(0,0,0,0.1), inset 0px 2px 6px rgba(255,255,255,0.5)"
components:
  clay-btn:
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.2xl}"
    boxShadow: "{shadows.clay}"
    border: "2px solid rgba(255,255,255,0.2)"
  clay-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.clay}"
    border: "4px solid #ffffff"
    boxShadow: "{shadows.soft}"
  bento-hero:
    rounded: "{rounded.hero}"
    borderBottom: "8px solid #ea580c"
    boxShadow: "{shadows.bento}"
    padding: "{spacing.bento-padding}"
---

## Brand & Style
Smile Sprout's design system is built specifically for children (especially autistic children), prioritizing high-contrast legibility, calm but vibrant color palettes, and playful physical interactions. The aesthetic is heavily inspired by modern gamified educational apps (like Duolingo), leaning into "Claymorphism" and "Bento Grids" to create an interface that feels like a collection of fun, tactile digital toys rather than a traditional software dashboard.

The emotional response is intended to be encouraging, safe, and engaging. Every interaction should feel responsive and rewarding.

## Colors
The color strategy utilizes deep, saturated accent colors against soft, dreamy pastel backgrounds to guide the user's attention without overwhelming them.

- **Primary Canvas (app-bg):** A very subtle, multi-layered radial gradient mesh combining soft lavender, light mint, and sky blue to create a calming, cloud-like atmosphere.
- **Emotion Colors:** Specific pastel tints are strictly mapped to emotions to aid in cognitive recognition (e.g., Yellow for Happy, Blue for Sad, Red for Angry).
- **Vibrant Gradients:** Large Bento Grid cards use highly saturated, bright gradient backgrounds (Amber to Orange, Emerald to Teal) to draw attention and feel magical.
- **Text:** Slate-800 (#1e293b) for extreme legibility instead of pure black, with Slate-500 (#64748b) for secondary descriptions.

## Typography
The system relies on a strict two-font pairing to balance playful personality with extreme readability.

- **Headings (Fredoka):** Used for all titles, large buttons, and important callouts. Its thick, rounded geometry feels friendly and non-threatening. Weights are kept heavy (ExtraBold/700-800).
- **Body (Nunito):** Used for all secondary text, instructions, and standard buttons. It pairs perfectly with Fredoka due to its rounded terminals but offers better legibility at smaller sizes. Weights are mostly Bold (600-700).

## Layout & Spacing
The layout abandons traditional, rigid dashboards in favor of an asymmetric **Bento Grid Layout** for larger screens, and a prominent bottom-navigation bar for mobile devices.

- **Bento Grid:** The main dashboard uses a 12-column grid with varying row spans. Hero features (like the Learning Path) occupy massive `col-span-8 row-span-2` blocks, while quick actions occupy smaller, squarish blocks.
- **Spacing:** Generous padding inside cards (32px+) ensures content breathes, while 24px gaps between Bento cards provide clear separation.

## Elevation & Depth (Claymorphism)
Depth is the defining characteristic of this design system, achieved through extreme, playful shadows that simulate chunky plastic or clay.

- **The Clay Button:** Buttons do not just change color on hover; they physically depress. They use a combination of a solid 4px downward drop shadow (`0px 4px 0px hsla(...)`), a top inner shadow for highlight, and a bottom inner shadow for volume. On `:active`, they translate down along the Y-axis and lose their outer drop shadow entirely, simulating a physical button press.
- **Bento Cards:** Large interactable cards utilize an exaggerated `border-bottom: 8px solid [Darker Color]` to look like thick 3D slabs. When hovered, they scale up slightly and translate upward on the Y-axis (`-translate-y-2`), increasing their drop shadow to feel like they are floating toward the user.

## Shapes & Radii
Sharp corners are strictly forbidden. The shape language is entirely rounded to evoke safety and playfulness.

- **Standard Buttons:** `rounded-2xl` (20px)
- **Small Cards / Elements:** `rounded-[2rem]` (32px)
- **Large Bento Cards:** `rounded-[2.5rem]` (40px)
- **Imagery:** 3D assets and icons are allowed to overlap or break out of their container borders (e.g., using negative absolute positioning) to create depth and energy.
