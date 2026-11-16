# PetCareLog — Design System

> **Version:** 1.0  
> **Framework:** Next.js 16 (App Router) · Tailwind CSS v4 · TypeScript  
> **Inspiration:** Provided veterinary landing page reference + Apple HIG principles

---

## 1. Design Philosophy

PetCareLog's visual identity is **warm, trustworthy, and premium** — a healthcare platform that pet owners trust with their most loved companions. The design draws from:

- **Apple's eight principles**: Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight.
- **The inspiration reference**: Sky-blue gradient hero, clean white service cards, circular doctor portraits, structured layouts with generous whitespace.
- **Medical trust**: Clean lines, calm colors, and clear hierarchy instill confidence without feeling clinical or cold.

**The signature**: A sky-to-soft-white color system paired with paw-print accents — immediately recognizable as a pet health platform, never generic.

---

## 2. Color System

```css
/* Tailwind CSS v4 theme — defined in globals.css */

/* Brand — sky blue (from inspiration: hero gradient, card accents) */
--color-brand-50:  #eff8ff;
--color-brand-100: #dbeffe;
--color-brand-200: #b9e1fd;
--color-brand-300: #7ccbfb;
--color-brand-400: #37aef5;
--color-brand-500: #0d96e6;   /* Primary interactive */
--color-brand-600: #0178c5;   /* Hover */
--color-brand-700: #015fa0;
--color-brand-800: #064f83;
--color-brand-900: #0b426d;

/* Accent — warm amber for highlights */
--color-accent-400: #fbbf24;
--color-accent-500: #f59e0b;

/* Coral — urgency / heart */
--color-coral-400: #fb7185;
--color-coral-500: #f43f5e;

/* Surface — neutral whites and greys */
--color-surface-0:   #ffffff;
--color-surface-50:  #f7fbff;   /* Page background — very faint blue tint */
--color-surface-100: #eef5fc;
--color-surface-200: #dce9f5;
--color-surface-800: #1e3148;
--color-surface-900: #0f1f30;

/* Text */
--color-text-primary:   #0f1f30;
--color-text-secondary: #4a6b87;
--color-text-muted:     #7a9ab5;
--color-text-inverse:   #ffffff;
```

### Contrast ratios (WCAG AA)
| Foreground | Background | Ratio | Pass |
|---|---|---|---|
| `text-primary` (#0f1f30) | `surface-0` (#fff) | 16.9:1 | ✅ AAA |
| `brand-600` (#0178c5) | `surface-0` (#fff) | 4.6:1 | ✅ AA |
| `text-secondary` (#4a6b87) | `surface-0` (#fff) | 5.0:1 | ✅ AA |
| `text-inverse` (#fff) | `brand-500` (#0d96e6) | 3.2:1 | ✅ AA large |

---

## 3. Typography

**Display face:** `Plus Jakarta Sans` — modern, friendly, premium. Used for hero headings and section titles.  
**Body face:** `Inter` — neutral, highly legible. Used for body, labels, navigation.  

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display-2xl` | 60px / 3.75rem | 700 | 1.1 | Hero headline |
| `display-xl` | 48px / 3rem | 700 | 1.15 | Section hero |
| `display-lg` | 36px / 2.25rem | 600 | 1.2 | Section titles |
| `display-md` | 30px / 1.875rem | 600 | 1.3 | Card titles, subsections |
| `body-xl` | 20px / 1.25rem | 400 | 1.6 | Hero subtext |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | Body copy |
| `body-md` | 16px / 1rem | 400 | 1.5 | Default body |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Captions, meta |
| `label-lg` | 14px / 0.875rem | 600 | 1.2 | Buttons, badges |
| `label-sm` | 12px / 0.75rem | 600 | 1.2 | Tags, overlines |

---

## 4. Spacing & Layout

```
Spacing scale: 4px base unit (Tailwind default)
Section vertical rhythm: py-20 (80px) on desktop, py-12 (48px) on mobile
Content max-width: max-w-7xl (1280px), centered with px-6 sm:px-8 lg:px-12
Grid columns: 12-column grid with gap-6 (24px) default, gap-8 (32px) for cards
```

### Section rhythm
- Hero: `pt-32 pb-24` (128px / 96px)
- Sections: `py-20` (80px top/bottom)
- Tight sections: `py-12` (48px)

---

## 5. Border Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 6px | Tags, badges |
| `rounded-md` | 8px | Inputs, small buttons |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Feature cards, modals |
| `rounded-2xl` | 20px | Hero cards, prominent panels |
| `rounded-3xl` | 24px | Large hero containers |
| `rounded-full` | 9999px | Buttons (pill), avatars |

---

## 6. Shadows & Surfaces

```css
/* Card — subtle elevation */
shadow-card: 0 2px 16px -4px rgba(13, 150, 230, 0.08), 0 1px 4px -1px rgba(15, 34, 56, 0.04);

/* Hover — lifted elevation */
shadow-hover: 0 12px 32px -8px rgba(13, 150, 230, 0.15), 0 4px 8px -2px rgba(15, 34, 56, 0.06);

/* Glass — navigation / overlays */
backdrop-filter: blur(16px) saturate(180%);
background: rgba(255, 255, 255, 0.85);
border: 1px solid rgba(255, 255, 255, 0.6);
```

### Surface types
1. **Page surface**: `bg-surface-50` — very faint blue-white
2. **Card surface**: `bg-white` with `shadow-card` and `border border-surface-100`
3. **Accent card**: `bg-brand-50` with `border-brand-100`
4. **Glass nav**: `backdrop-blur-md bg-white/85 border-b border-white/60`

---

## 7. Component Specifications

### Navigation
- **Sticky glass header** with `backdrop-blur-md bg-white/85`
- Logo left, links center, CTA button right
- Mobile: hamburger → slide-down drawer
- Height: `h-16` (64px) desktop, `h-14` (56px) mobile

### Hero Section
- Full-width with gradient background (`from-brand-50 via-sky-50 to-white`)
- Two-column layout on desktop (text left, image/visual right)
- Headline + subtitle + two CTAs (primary filled, secondary ghost)
- Subtle floating pet images or illustrated elements

### Service Cards (from inspiration: grid of service tiles)
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Each card: icon + title + feature list + arrow CTA
- Hover: `shadow-hover` + translate-y-1 lift
- Featured card (large): spans 2 rows on desktop

### Doctor/Provider Cards (from inspiration: circular portrait grid)
- Circular portrait images `w-32 h-32 rounded-full`
- Name + specialty beneath
- Connected with subtle line decoration (or clean grid)

### Stats/Promo Banner (from inspiration: 50% discount panel)
- Split panel: left = text + CTA, right = visual/stats
- Rounded large container with `bg-brand-500` or gradient

### CTA / Contact Section
- Split: left = form, right = contact info
- Form inputs: `rounded-lg border-surface-200 focus:border-brand-500`

### Buttons
```
primary:   bg-brand-500 text-white rounded-full hover:bg-brand-600 shadow-sm
secondary: bg-white text-brand-600 border border-brand-200 rounded-full hover:bg-brand-50
ghost:     text-brand-600 hover:bg-brand-50 rounded-full
danger:    bg-coral-500 text-white rounded-full hover:bg-coral-600
```

---

## 8. Animation & Interactions

### React Lenis (Smooth Scroll)
- Installed: `lenis` package
- Wrapper: `<LenisProvider>` in root layout (client component)
- Config: `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (expo out)
- Respects `prefers-reduced-motion` — disables Lenis when set

### Scroll-triggered animations
- Use CSS `@keyframes` + Intersection Observer (`useInView` hook)
- Fade-up: `opacity: 0 → 1`, `translateY: 24px → 0`, duration 0.5s, ease-out
- Stagger: children delay 0.1s increments
- Section titles: slide-in from left

### Hover interactions
- Cards: `transition-all duration-300 hover:shadow-hover hover:-translate-y-1`
- Buttons: `transition-colors duration-200`
- Nav links: `transition-colors duration-150` with underline grow

### Page transitions
- Next.js built-in — no extra library needed for MVP

---

## 9. Responsive Breakpoints

```
sm:  640px   — large phones landscape / small tablets
md:  768px   — tablet portrait
lg:  1024px  — laptop / tablet landscape  
xl:  1280px  — desktop
2xl: 1536px  — wide desktop
```

### Mobile-first rules
- Navigation collapses to hamburger below `lg`
- Hero becomes single column below `lg`
- Service cards: 1 col on mobile, 2 col on `sm`, 3 col on `lg`
- Typography scales down by ~20% on mobile (`text-4xl` → `text-6xl` on desktop)
- Touch targets minimum 44×44px

---

## 10. Accessibility Standards

- Color contrast: all text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Focus rings: `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables Lenis and animations
- Semantic HTML: proper heading hierarchy, `<nav>`, `<main>`, `<section>`, `<footer>`
- Interactive elements have `aria-label` when icon-only

---

## 11. File Architecture

```
app/
├── globals.css              ← Tailwind v4 @theme tokens
├── layout.tsx               ← Root layout with fonts + LenisProvider
├── page.tsx                 ← Landing page (home)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── providers/
│   │   └── LenisProvider.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── StatsSection.tsx
│       ├── ServicesSection.tsx
│       ├── DoctorsSection.tsx
│       ├── ClinicSection.tsx
│       └── ContactSection.tsx
└── lib/
    ├── utils.ts
    └── hooks/
        └── useInView.ts
```
