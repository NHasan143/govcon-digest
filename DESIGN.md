---
name: Govcon Digest
description: Newspaper typography and section color for federal business coverage.
colors:
  paper: "#ffffff"
  ink: "#1a1a1a"
  rule: "#e5e5e5"
  accent: "#007bff"
  error: "#dc3545"
  success: "#28a745"
  dark-paper: "#1a1a1a"
  dark-ink: "#ffffff"
  dark-rule: "#333333"
  dark-accent: "#4dabf7"
  dark-error: "#ff6b6b"
  dark-success: "#51cf66"
  government-contracting: "#1d4e89"
  defense: "#2f5d3a"
  artificial-intelligence: "#5b3a8e"
  cybersecurity: "#8a2f3b"
  federal-technology: "#0f6470"
  financial-news: "#8a5a1f"
  executive-moves: "#4a4a55"
typography:
  headline:
    fontFamily: "EB Garamond, serif"
    fontSize: "42px"
    fontWeight: 400
  subheadline:
    fontFamily: "EB Garamond, serif"
    fontSize: "24px"
    fontWeight: 400
  title:
    fontFamily: "EB Garamond, serif"
    fontSize: "20px"
    fontWeight: 400
  body:
    fontFamily: "Lora, serif"
    fontSize: "18px"
    fontWeight: 400
  topics-display:
    fontFamily: "EB Garamond, serif"
    fontSize: "clamp(64px, 7vw, 96px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  topics-title:
    fontFamily: "EB Garamond, serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  topics-featured-title:
    fontFamily: "EB Garamond, serif"
    fontSize: "clamp(38px, 3.5vw, 50px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  topics-body:
    fontFamily: "Lora, serif"
    fontSize: "13px"
    lineHeight: 1.8
  navigation:
    fontFamily: "Lora, serif"
    fontSize: "clamp(11px, 0.9vw, 13px)"
    fontWeight: 700
    letterSpacing: "0.035em"
rounded:
  search-field: "0.5rem"
  form-field: "0.25rem"
  topics-card: "14px"
  menu-panel: "0 0 12px 12px"
  circle: "50%"
spacing:
  form-gap: "1rem"
  topics-gap: "24px"
  topics-mobile-gap: "16px"
  topics-card-padding: "28px 30px 22px"
  topics-featured-padding: "36px 38px 28px"
  topics-mobile-padding: "26px 24px 20px"
components:
  search-submit:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.search-field}"
    padding: "0.75rem 1.5rem"
  search-submit-hover:
    backgroundColor: "#0056b3"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.search-field}"
    padding: "0.75rem 1rem"
  topics-search:
    textColor: "{colors.ink}"
    padding: "12px 0"
    height: "48px"
  topics-card:
    rounded: "{rounded.topics-card}"
    padding: "{spacing.topics-card-padding}"
  topics-featured-card:
    textColor: "{colors.paper}"
    rounded: "{rounded.topics-card}"
    padding: "{spacing.topics-featured-padding}"
---

# Design System: Govcon Digest

## Overview

**Creative North Star: "Newspaper"**

Govcon Digest uses the user-confirmed newspaper identity: EB Garamond headlines, Lora reading text, paper and ink, and established section colors. The publication serves GovCon professionals scanning coverage and selecting reporting. Its existing logo and masthead remain identity assets.

This document records the incumbent system and the completed Topics extension. Tokens prefixed with topics are local to that directory; its mosaic composition and GSAP behavior are not requirements for other pages.

**Key Characteristics:**
- Serif headlines and reading text.
- Section colors connect navigation and coverage.
- Hairline rules and generous space organize editorial content.
- Topics uses readable, flat colored cards with direct links.

## Colors

The primary publication materials are paper and ink. Coverage identity comes from the category registry; utility accents remain separate from those editorial colors.

### Primary

- **Utility blue (`accent`):** search submission and general form focus. Dark theme uses `dark-accent`.

### Secondary

- **Contracting blue, Defense green, AI purple, Cybersecurity burgundy, Federal Technology teal, Financial News ochre, Executive Moves slate:** the seven registry accents. Navigation panels use solid section color with white text. Topics features Contracting and Defense in solid color; other cards mix their section color into paper at 5%, increasing to 9% for interaction.
- **Error red and success green:** existing form feedback, with their dark-theme counterparts.

### Neutral

- **Paper, ink, rule:** theme-bound background, primary text, and dividers. Dark counterparts reverse paper and ink and darken rules. Topics muted text mixes 72% ink into paper. The page inherits theme values rather than defining another palette.

**The Section Continuity Rule.** Use the category registry color for its section across navigation and Topics; preserve the established category identity.

## Typography

**Display Font:** EB Garamond, serif fallback.
**Body Font:** Lora, serif fallback. Fonts load through Next.js font variables in the frontend layout.

Serif headings provide the newspaper voice; Lora carries introductions, descriptions, topic links, and menu labels. The global element hierarchy is headline, subheadline, title, then smaller headings (18px); article headline reduces on mobile (32px). Paragraph defaults use the body token.

Topics has its own display, title, featured-title, and compact body roles in the frontmatter. Its introduction uses a larger reading size (19px, line-height 1.65, maximum 40ch); featured descriptions use a slight increase (14px). Below the narrow breakpoint, Topics display remains (64px), titles use a responsive range (28–34px), and introductions reduce (15px). Do not apply this directory scale to article content.

**The Editorial Pairing Rule.** Use EB Garamond for headings and Lora for reading text in the publication system.

## Layout

The shared main wrapper uses the incumbent Bootstrap container: full width with half-gutters (12px), then maximum widths (540px, 720px, 960px, 1140px, 1320px) at minimum viewport widths (576px, 768px, 992px, 1200px, 1400px). Masthead, navigation, main content, and footer establish the shared publication frame.

Topics is a local 12-column mosaic: Contracting spans seven columns and Defense five; the next three sections span four each; the last pair spans six each. Desktop gaps use topics-gap; below (1200px) gaps reduce to (18px). Below (992px), cards span six and the final card twelve. Below (576px), everything stacks into one column using topics-mobile-gap and topics-mobile-padding. Filtered results use equal half-width cards; one result spans the grid with a maximum width (760px), reverting to the mobile column at the narrow breakpoint.

Topics page vertical space is (48px 0 80px), reducing on phones (32px 0 48px). Search is (360px) wide on desktop and full width on phones. Topic links and clear-search controls keep minimum interaction height (44px). The directory retains seven sections and 21 topics; the mosaic is a surface decision, not a global grid prescription.

## Elevation & Depth

Topics cards are flat at rest and during interaction. Section tint, solid feature color, a fine divider, and an animated wash provide separation without shadows. The existing dropdown menu uses an overlay shadow (`0 22px 44px -16px rgb(0 0 0 / 28%)`), appropriate to its position above page content. This is a component distinction, not a site-wide shadow prohibition.

## Shapes

Topics cards use topics-card rounding, while navigation panels round only their lower corners. Search fields and ordinary form fields retain their existing smaller rounding. Topic heading arrows are circular bordered controls (44px); the Topics search is square and underline-only. Internal rules and field underlines are fine (1px). These variations belong to their components rather than one universal corner rule.

## Components

### Search and buttons

The existing general search field uses theme-bound paper, ink, and a border; focus uses the utility accent with a ring (`0 0 0 2px rgba(0, 123, 255, 0.25)`). Its submit button uses the utility accent, white text, search-field rounding, and the recorded padding; disabled opacity is (0.6). The Topics search instead uses an underline and transparent field with compact Lora text (13px); focus-within darkens the underline to ink. Its clear control is an accessible inline SVG control.

### Navigation

The existing desktop section menu uses compact uppercase Lora labels and a section-colored bottom rule (3px). Dropdowns pair solid section-color introductions with paper topic lists separated by fine rules. Keyboard focus is visibly outlined; reduced-motion preference disables reveal and transitions. Mobile navigation remains the incumbent Sections control and shared publication header.

### Topics cards

Each card groups an EB Garamond section link, registry description, a fine rule, and three direct topic links. Solid featured cards use white text; ordinary cards use ink on lightly tinted paper. Hovering topic links underlines their text and strengthens SVG arrows. Keyboard focus uses a current-color outline (2px, offset 4px).

Topics alone dynamically imports GSAP and owns its lifecycle with matchMedia. A short rule sweep lasts (0.48s), staggered (0.035s), with power3.out easing. Pointer hover on fine pointers and keyboard focus reveal a reversible wash and rotate the heading arrow (-45deg) over (0.3s). Reduced motion skips the sweep and makes feedback immediate without arrow rotation; the small topic-arrow CSS transition is also disabled. Reinitialization and unmount revert animations and remove listeners. Cards stay visible before hydration and if motion fails to load.

## Do's and Don'ts

### Do:

- Do preserve the incumbent logo, newspaper typography, paper and ink, and original section accents.
- Do keep local Topics display sizing, mosaic spans, card treatments, and GSAP behavior scoped to Topics.
- Do retain direct section and topic links, visible keyboard focus, and readable content before animation loads.

### Don't:

- Don't change category colors independently of the registry.
- Don't make the Topics card radius, mosaic composition, or animation a universal site rule.
- Don't hide Topics content pending JavaScript or motion initialization.


Pre-existing drift not canonized: legacy template helpers retain Arial, several older accent values, icon-font glyphs, and button focus removal. They were outside the Topics redesign and have not been repaired or promoted into rules for new screens.
