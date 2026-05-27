---
name: Aetheric Command
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
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
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
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
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
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
  mono-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  stack-gap-sm: 8px
  stack-gap-md: 16px
  stack-gap-lg: 32px
---

## Brand & Style
The design system is engineered for high-stakes financial operations, evoking a sense of "Mission Control" for modern fintech. It targets risk analysts and operations leads who require a high-density, low-latency interface that feels both powerful and precise.

The aesthetic blends **Corporate Modern** efficiency with **Glassmorphism** and **Futuristic** accents. It prioritizes data clarity through a dark-first environment, using depth and luminosity to guide the eye toward critical decision-making points. The emotional response is one of calm authority and technological sophistication.

## Colors
This design system utilizes a deep-space palette to minimize eye strain during long-duration monitoring.

- **Primary & Accents:** Electric Blue (#3b82f6) is the primary action color. Violet and Cyan are used for data visualization categories and secondary highlights.
- **Risk Indicators:** A traffic-light system is strictly enforced. High-risk items use a Red/Orange glow (#ef4444), Medium-risk uses Amber (#f59e0b), and Low-risk uses Emerald (#10b981).
- **Surfaces:** The foundation is Deep Navy (#020617), with container surfaces using Near-Black (#0f172a) at 5-10% transparency to enable backdrop blurring.

## Typography
Typography is optimized for legibility in high-density data environments. **Geist** is used for headlines and UI labels to provide a technical, sharp appearance. **Inter** handles body text for maximum readability across various sizes.

- **Contrast:** Use white (90% opacity) for primary text and slate-400 for secondary metadata.
- **Data:** Use JetBrains Mono for transaction IDs, API keys, and numerical tables to ensure character alignment and a "developer-tool" precision.

## Layout & Spacing
The layout follows a **Fluid Grid** system with fixed-width sidebars for navigation. 

- **Desktop (1440px+):** 12-column grid, 24px gutters, 32px outer margins.
- **Tablet (768px - 1439px):** 8-column grid, 16px gutters, 24px outer margins.
- **Mobile (<767px):** 4-column grid, 12px gutters, 16px outer margins.

The spacing rhythm is based on a **4px scale**. Components should favor generous internal padding (16px - 24px) to balance the high information density.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

- **Base Layer:** #020617 (Flat).
- **Surface Layer:** #0f172a with 1px border of white (10% opacity).
- **Overlay Layer:** Background blur (12px) with a 5% white tint.
- **Active State Glow:** Critical components or active navigation items use an outer glow (box-shadow: 0 0 15px -3px) matching their functional color (e.g., Blue for active, Red for high-risk).

## Shapes
The shape language balances the "hard" technical nature of fintech with the "soft" premium feel of modern SaaS.

- **Cards & Containers:** Use `rounded-2xl` (16px) for main dashboard modules.
- **Buttons & Inputs:** Use `rounded-lg` (8px) for a more precise, tool-like feel.
- **Badges:** Use full pill-shaping (9999px) for status indicators to distinguish them from interactive buttons.

## Components
### Metric Cards
Dashboard cards must include a primary value (Title-MD), a sparkline trend graph (1px stroke width), and a percentage change label. Backgrounds should use `backdrop-blur-md` with `bg-white/5`.

### Data Tables
Tables are high-density. Rows should have a subtle hover state (`bg-white/5`) and a 1px bottom border (`border-white/5`). Risk badges within tables should feature a soft glow of their respective status color.

### Command Palette
A global search overlay centered on the screen. It uses the `Overlay Layer` style with a prominent `primary_color_hex` border. Results are categorized with `label-md` headers.

### Navigation Sidebar
Collapsible design. Active items are indicated by a vertical 2px line on the left and a subtle `0.1 opacity` primary color background tint with a 5px glow.

### Health Indicators
Small circular indicators. Use a CSS pulse animation (1.5s duration, infinite) on the outer ring for "Live" or "Critical" statuses to draw immediate attention.

### Buttons
- **Primary:** Solid `primary_color_hex` with white text.
- **Secondary:** Ghost style with `border-white/10` and `hover:bg-white/5`.
- **Destructive:** Solid `danger_color_hex` with a subtle red glow.