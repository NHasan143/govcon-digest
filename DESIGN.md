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
  cms-paper: "#faf9f6"
  cms-ink: "#17212b"
  cms-muted: "#58616a"
  cms-rule: "#d9dcd9"
  cms-blue: "#1d4e89"
  cms-soft: "#edf2f7"
  cms-field-rule: "#aab1b5"
  cms-blue-hover: "#153a67"
  cms-blue-active: "#102e52"
  cms-error-paper: "#faeeeb"
  cms-error-ink: "#932d23"
  cms-error-rule: "#e3bbb4"
  cms-published-paper: "#eaf1ed"
  cms-draft-paper: "#f6efdf"
  cms-draft-ink: "#79541e"
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
  cms-login-display:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "5.5rem"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  cms-desk-display:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  cms-form-title:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  cms-section-title:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  cms-story-title:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.25
  cms-body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  cms-description:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  cms-control:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  cms-meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    lineHeight: 1.5
  cms-status:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  search-field: "0.5rem"
  form-field: "0.25rem"
  topics-card: "14px"
  menu-panel: "0 0 12px 12px"
  circle: "50%"
  cms-control: "4px"
  cms-status: "3px"
spacing:
  form-gap: "1rem"
  topics-gap: "24px"
  topics-mobile-gap: "16px"
  topics-card-padding: "28px 30px 22px"
  topics-featured-padding: "36px 38px 28px"
  topics-mobile-padding: "26px 24px 20px"
  cms-field-gap: "1.25rem"
  cms-button-padding: "0.75rem 1.125rem"
  cms-field-padding: "0.75rem 0.875rem"
  cms-story-padding: "1.25rem 0.25rem"
  cms-desk-gap: "3rem"
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
  cms-button-primary:
    backgroundColor: "{colors.cms-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.cms-control}"
    rounded: "{rounded.cms-control}"
    padding: "{spacing.cms-button-padding}"
  cms-button-primary-hover:
    backgroundColor: "{colors.cms-blue-hover}"
  cms-button-primary-active:
    backgroundColor: "{colors.cms-blue-active}"
  cms-button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cms-ink}"
    typography: "{typography.cms-control}"
    rounded: "{rounded.cms-control}"
    padding: "{spacing.cms-button-padding}"
  cms-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.cms-ink}"
    typography: "{typography.cms-body}"
    rounded: "{rounded.cms-control}"
    padding: "{spacing.cms-field-padding}"
    height: "50px"
  cms-story-row:
    textColor: "{colors.cms-ink}"
    padding: "{spacing.cms-story-padding}"
  cms-status-published:
    backgroundColor: "{colors.cms-published-paper}"
    textColor: "{colors.defense}"
    typography: "{typography.cms-status}"
    rounded: "{rounded.cms-status}"
    padding: "0.2rem 0.5rem"
  cms-status-draft:
    backgroundColor: "{colors.cms-draft-paper}"
    textColor: "{colors.cms-draft-ink}"
    typography: "{typography.cms-status}"
    rounded: "{rounded.cms-status}"
    padding: "0.2rem 0.5rem"
---

# Design System: Govcon Digest

## Overview

**Creative North Star: "Newspaper"**

Govcon Digest uses the user-confirmed newspaper identity: EB Garamond headlines, Lora reading text, paper and ink, and established section colors. The publication serves GovCon professionals scanning coverage and selecting reporting. Its existing logo and masthead remain identity assets.

This document records the incumbent system and the completed Topics and private CMS extensions. Tokens prefixed with topics are local to that directory; its mosaic composition and GSAP behavior are not requirements for other pages. Tokens prefixed with cms belong only to the editorial sign-in and dashboard. Their warm paper, system sans controls, and split composition extend the newspaper identity without replacing the public palette or reading typography.

**Key Characteristics:**
- Serif headlines and reading text.
- Section colors connect navigation and coverage.
- Hairline rules and generous space organize editorial content.
- Topics uses readable, flat colored cards with direct links.
- The private CMS pairs serif editorial headings with compact sans controls and ruled working lists.

## Colors

The primary publication materials are paper and ink. Coverage identity comes from the category registry; utility accents remain separate from those editorial colors.

### Primary

- **Utility blue (`accent`):** search submission and general form focus. Dark theme uses `dark-accent`.
- **CMS contracting blue (`cms-blue`):** private workspace actions, text selection, carets, and focus outlines; hover and active use the scoped deeper blue tokens.

### Secondary

- **Contracting blue, Defense green, AI purple, Cybersecurity burgundy, Federal Technology teal, Financial News ochre, Executive Moves slate:** the seven registry accents. Navigation panels use solid section color with white text. Topics features Contracting and Defense in solid color; other cards mix their section color into paper at 5%, increasing to 9% for interaction.
- **Error red and success green:** existing form feedback, with their dark-theme counterparts.
- **CMS feedback:** error-paper, error-ink, and error-rule frame sign-in and loading feedback. Published uses cms-published-paper with the existing Defense green; Draft uses cms-draft-paper and cms-draft-ink. These indicate publishing state rather than coverage category.

### Neutral

- **Paper, ink, rule:** theme-bound background, primary text, and dividers. Dark counterparts reverse paper and ink and darken rules. Topics muted text mixes 72% ink into paper. The page inherits theme values rather than defining another palette.
- **CMS warm paper, blue-black ink, muted slate, and pale rule:** the scoped light workspace materials. CMS fields use white paper and cms-field-rule; cms-soft provides hover feedback. The native Payload navigation keeps its own theme.

**The Section Continuity Rule.** Use the category registry color for its section across navigation and Topics; preserve the established category identity.

## Typography

**Display Font:** EB Garamond, serif fallback.
**Body Font:** Lora, serif fallback. Fonts load through Next.js font variables in the frontend layout.

Serif headings provide the newspaper voice; Lora carries introductions, descriptions, topic links, and menu labels. The global element hierarchy is headline, subheadline, title, then smaller headings (18px); article headline reduces on mobile (32px). Paragraph defaults use the body token.

Topics has its own display, title, featured-title, and compact body roles in the frontmatter. Its introduction uses a larger reading size (19px, line-height 1.65, maximum 40ch); featured descriptions use a slight increase (14px). Below the narrow breakpoint, Topics display remains (64px), titles use a responsive range (28–34px), and introductions reduce (15px). Do not apply this directory scale to article content.

**The Editorial Pairing Rule.** Use EB Garamond for headings and Lora for reading text in the publication system.

The private CMS deliberately uses a system sans stack for controls, descriptions, and metadata while keeping EB Garamond for editorial headings. Its font loader supplies weights (500, 600) through a local variable; display text never uses the system face. The login display reduces from its frontmatter size to (4.5rem) at or below (1100px), (3.5rem) at or below (760px), and (3rem) at or below (380px). The form title retains its recorded scale. Login introductory copy uses (1.125rem, line-height 1.7, maximum 36ch), reducing to (1rem) on phones.

The dashboard uses the CMS desk, section, and story title roles. At or below (760px), desk display reduces to (44px) and story titles to (22px). Dashboard type uses explicit pixels to preserve the intended hierarchy inside Payload's root sizing; do not infer it from rem values alone. Sans descriptions, controls, metadata, and status text follow their CMS roles; publishing numbers use tabular figures (22px, weight 600). This scale stays private to the workspace.

**The CMS Type Separation Rule.** Keep EB Garamond on editorial headings and system sans on private workspace controls; retain the public publication's Lora reading text.

## Layout

The shared main wrapper uses the incumbent Bootstrap container: full width with half-gutters (12px), then maximum widths (540px, 720px, 960px, 1140px, 1320px) at minimum viewport widths (576px, 768px, 992px, 1200px, 1400px). Masthead, navigation, main content, and footer establish the shared publication frame.

Topics is a local 12-column mosaic: Contracting spans seven columns and Defense five; the next three sections span four each; the last pair spans six each. Desktop gaps use topics-gap; below (1200px) gaps reduce to (18px). Below (992px), cards span six and the final card twelve. Below (576px), everything stacks into one column using topics-mobile-gap and topics-mobile-padding. Filtered results use equal half-width cards; one result spans the grid with a maximum width (760px), reverting to the mobile column at the narrow breakpoint.

Topics page vertical space is (48px 0 80px), reducing on phones (32px 0 48px). Search is (360px) wide on desktop and full width on phones. Topic links and clear-search controls keep minimum interaction height (44px). The directory retains seven sections and 21 topics; the mosaic is a surface decision, not a global grid prescription.

The CMS sign-in is a full-height warm-paper workspace with an identity header, a centered editorial statement and narrow form. The sign-in omits the brand subtitle, introductory description, and footer; other CMS surfaces retain their branding. Its body has a maximum width (1220px), columns (1.35fr 1fr), and an (8%) gap; the right form is at most (410px) wide. Outer padding is (2.5rem 5vw 1.5rem), and body padding is (5rem 0). At or below (760px), statement and form stack within (480px), with a (2.75rem) gap, body padding (3rem 0), and outer padding (1.5rem); the supporting desktop note and short rule are hidden. At or below (380px), outer padding becomes (1.25rem).

The signed-in CMS dashboard keeps Payload's native sidebar and header. The desk places its title and writing actions above a ruled publishing overview, then a broad recent-story queue beside a narrow shortcuts column (250px), separated by cms-desk-gap. At or below (1100px), the column narrows to (210px), the gap becomes (1.75rem), and header actions move below the title. At or below (760px), the columns stack with a (2.5rem) gap and dashboard padding becomes (1.5rem 1.25rem 2.5rem). These two editorial splits are local CMS topology, not publication-wide layout requirements.

## Elevation & Depth

Topics cards are flat at rest and during interaction. Section tint, solid feature color, a fine divider, and an animated wash provide separation without shadows. The existing dropdown menu uses an overlay shadow (`0 22px 44px -16px rgb(0 0 0 / 28%)`), appropriate to its position above page content. This is a component distinction, not a site-wide shadow prohibition.

CMS content is flat at rest and during interaction. Ink rules establish section starts, lighter rules divide working rows, and soft tonal fills indicate hover and publishing state. CMS content uses no shadows; the native Payload shell remains outside this local rule.

## Shapes

Topics cards use topics-card rounding, while navigation panels round only their lower corners. Search fields and ordinary form fields retain their existing smaller rounding. Topic heading arrows are circular bordered controls (44px); the Topics search is square and underline-only. Internal rules and field underlines are fine (1px). These variations belong to their components rather than one universal corner rule.

CMS fields, buttons, and feedback panels use cms-control rounding; publishing status uses cms-status rounding. Editorial sections and story rows remain open, square, and separated by fine rules (1px), without card enclosures.

## Components

### Search and buttons

The existing general search field uses theme-bound paper, ink, and a border; focus uses the utility accent with a ring (`0 0 0 2px rgba(0, 123, 255, 0.25)`). Its submit button uses the utility accent, white text, search-field rounding, and the recorded padding; disabled opacity is (0.6). The Topics search instead uses an underline and transparent field with compact Lora text (13px); focus-within darkens the underline to ink. Its clear control is an accessible inline SVG control.

### Navigation

The existing desktop section menu uses compact uppercase Lora labels and a section-colored bottom rule (3px). Dropdowns pair solid section-color introductions with paper topic lists separated by fine rules. Keyboard focus is visibly outlined; reduced-motion preference disables reveal and transitions. Mobile navigation remains the incumbent Sections control and shared publication header.

### Topics cards

Each card groups an EB Garamond section link, registry description, a fine rule, and three direct topic links. Solid featured cards use white text; ordinary cards use ink on lightly tinted paper. Hovering topic links underlines their text and strengthens SVG arrows. Keyboard focus uses a current-color outline (2px, offset 4px).

Topics alone dynamically imports GSAP and owns its lifecycle with matchMedia. A short rule sweep lasts (0.48s), staggered (0.035s), with power3.out easing. Pointer hover on fine pointers and keyboard focus reveal a reversible wash and rotate the heading arrow (-45deg) over (0.3s). Reduced motion skips the sweep and makes feedback immediate without arrow rotation; the small topic-arrow CSS transition is also disabled. Reinitialization and unmount revert animations and remove listeners. Cards stay visible before hydration and if motion fails to load.

### CMS controls

CMS primary actions use contracting blue with white text; secondary actions are transparent with ink text and a pale rule. Buttons maintain a minimum height (44px), and the full-width sign-in button uses (50px). Primary hover and active states deepen blue; secondary hover uses soft fill and the field-rule stroke. Busy sign-in changes its label and disables the button with opacity (0.65). Publication and tool links use inline SVG arrows and underline on hover.

Fields keep persistent labels, white fill, the field-rule stroke, and the recorded (50px) height. Hover darkens the stroke to muted ink; focus changes it to contracting blue. The inline password control has a (44px) target and toggles Show/Hide text. The optional authenticator retains its visible label and hint. Errors use the scoped feedback palette rather than floating overlays. Workspace links, buttons, and inputs share a blue keyboard outline (2px, offset 4px).

### CMS editorial desk

The publishing overview is a ruled row with tabular counts. Recent stories are direct resume links with serif titles, sans collection/category/date metadata, and text status badges. Titles wrap freely; status and the SVG arrow occupy a separate trailing column. Hover softly fills the row and underlines the title. Collection shortcuts retain compact ruled links, while the empty desk uses the same serif/sans hierarchy. Available tools and writing actions follow the signed-in user's permissions.

CMS motion is state feedback only: background and border transitions last (180ms) using CSS's default ease. The sign-in button acknowledges pressing with a (120ms) scale change, reveals its pending label over (220ms), rotates its indicator over (900ms), and sweeps an indeterminate bottom rule over (1400ms) while authentication is pending. These effects are scoped to the sign-in button; no artificial request delay is added, and the pending state remains until navigation starts. Failed requests restore the ready state. Reduced-motion preference removes transitions, scaling, and animated loops while retaining the pending label, static indicator, and full-width subdued rule. The CMS adds no load sequence or GSAP choreography.

## Do's and Don'ts

### Do:

- Do preserve the incumbent logo, newspaper typography, paper and ink, and original section accents.
- Do keep local Topics display sizing, mosaic spans, card treatments, and GSAP behavior scoped to Topics.
- Do retain direct section and topic links, visible keyboard focus, and readable content before animation loads.
- Do keep CMS palette, sans controls, display scale, split layouts, and state-only motion scoped to the private editorial workspace.
- Do retain persistent CMS field labels, visible focus, text publishing states, and direct resume links in the recent-story queue.

### Don't:

- Don't change category colors independently of the registry.
- Don't make the Topics card radius, mosaic composition, or animation a universal site rule.
- Don't hide Topics content pending JavaScript or motion initialization.
- Don't replace the public palette or Lora reading typography with the local CMS warm-paper and sans-control treatment.
- Don't introduce decorative entry motion or shadowed cards into the ruled CMS workspace.


Pre-existing drift not canonized: legacy template helpers retain Arial, several older accent values, icon-font glyphs, and button focus removal. They were outside the Topics redesign and have not been repaired or promoted into rules for new screens.
