---
name: Aetheric Command
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-page: 2rem
  gutter-grid: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  inset-card: 1.5rem
---

## Brand & Style
This design system is engineered for the high-stakes world of institutional fintech, where precision meets visionary technology. The aesthetic is a refined fusion of **Glassmorphism** and **Corporate Modernism**, designed to evoke a "mission-control" atmosphere. It targets sophisticated users who require rapid data synthesis without sacrificing a premium, cutting-edge experience.

The UI should feel like a high-end command deck: expansive, deeply layered, and authoritative. By utilizing a "dark-first" philosophy, we reduce cognitive load and eye strain for professional operators while allowing vibrant accent colors to signal critical system health and risk status with immediate clarity.

## Colors
The palette is rooted in the "Deepest Navy" (#070d1f), providing a vast, stable canvas that pushes foreground elements forward. 

- **Primary (Electric Blue):** Used for primary actions and system-wide focus states.
- **Secondary (Violet):** Used for analytical insights, trend lines, and secondary interactive elements.
- **Tertiary (Cyan):** Reserved for technical data markers and high-frequency updates.
- **Emerald:** Specifically utilized for positive growth metrics and "Healthy" system states.
- **Neutral/Surface:** We use semi-transparent white overlays (rgba(255, 255, 255, 0.04 to 0.1)) to build depth rather than using solid grays.

## Typography
The typography system utilizes **Geist** for technical precision and **Inter** for sustained reading. 

- **Display & Headlines:** Use Geist with tight letter-spacing. Its geometric, slightly technical character reinforces the fintech narrative.
- **Body Text:** Inter is used for all tabular data and long-form descriptions to ensure maximum legibility at small sizes.
- **Labels:** Small Geist labels should always use a slight letter-spacing increase (tracking) to maintain clarity against dark, glass-textured backgrounds.
- **Numeric Data:** For high-density tables, consider tabular lining figures to ensure columns of numbers align vertically.

## Layout & Spacing
This design system employs a **12-column fluid grid** for dashboard views, allowing metric cards to resize based on screen real estate while maintaining a fixed maximum width for text-heavy settings pages.

- **Dashboard Layout:** A "Fixed-Sidebar / Fluid-Content" model.
- **Rhythm:** A strict 4px/8px baseline grid maintains vertical alignment.
- **Safe Areas:** Margin and gutter sizes remain consistent (24px-32px) to provide "breathing room" between high-density data visualizations. 
- **Reflow:** On mobile, the 12-column grid collapses into a single-column vertical stack, with the sidebar transitioning to a bottom navigation bar or a hidden drawer.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional shadows. This mimics a futuristic HUD (Heads-Up Display).

- **Surface Tiers:** 
  - **Level 0 (Background):** Deepest Navy (#070d1f).
  - **Level 1 (Cards):** Semi-transparent white (10% opacity) with a `backdrop-filter: blur(12px)`.
  - **Level 2 (Modals/Popovers):** Higher opacity (15% white) with a `backdrop-filter: blur(20px)`.
- **Borders:** Every glass element must feature a 1px solid border at 10% white opacity. This "stroke" defines the shape against the dark background.
- **Glows:** Key interactive components (active states, high-priority metrics) use a `box-shadow` with high spread and low opacity, color-matched to the primary or success colors to simulate an emissive light source.

## Shapes
The shape language is sophisticated and modern, utilizing substantial corner radii to soften the technical nature of the data.

- **Main Containers:** Use a `2xl` radius (1.5rem / 24px) to create a friendly, premium feel for dashboard cards.
- **Small Elements:** Buttons and input fields use a standard `md` radius (0.5rem / 8px) to maintain a sense of precision.
- **Interactive States:** When a card is hovered, the border opacity should increase from 10% to 30% to provide tactile feedback.

## Components
Consistent styling of the "mission-control" components is vital for a unified experience:

- **Metric Cards:** Large Geist numbers. Background features a subtle radial gradient glow in the bottom-right corner (using the primary or emerald color at 5% opacity).
- **Data Tables:** No vertical borders. Horizontal borders are 1px white at 5% opacity. Hovering a row should apply a subtle white tint (2% opacity) and change the text color to the primary blue.
- **Risk Indicators:** Use "Pill" shapes with glowing borders. Low risk (Emerald), Medium risk (Cyan/Blue), High risk (Violet/Red).
- **Input Fields:** Dark, recessed backgrounds (black at 20% opacity) with 1px borders. On focus, the border glows with the primary electric blue.
- **System Health:** A pulsing "Live" indicator dot (Emerald) with a CSS animation to suggest real-time connectivity.
- **Buttons:** 
  - *Primary:* Solid Electric Blue with white text.
  - *Secondary:* Ghost style with 1px Violet border and a subtle backdrop blur.