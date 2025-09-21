# Custom Title Graphic Generator — Creative Brief

## Product Goals & Moodboard (Step 1)
- **Purpose:** Provide designers and storytellers with a playful yet precise tool for crafting distinctive SVG title graphics that can drop into pictorial spreads or digital publications without rasterization.
- **Core feelings:** Vibrant, experimental, futuristic warmth. Think synthwave sunsets blended with editorial typography and generative art.
- **Inspiration references:**
  - Variable fonts showcased on [axis-praxis.org](https://axis-praxis.org).
  - Gradient-rich poster designs from 1980s airbrush art.
  - Modern design playgrounds like "Figma Font Playground" and "Shape Fest".
- **Key capabilities:**
  - Variable typography controls (size, weight, slant, letter spacing, line height).
  - Decorative treatments: gradient fills, outlines, glow and shadow filters.
  - Layout flourishes: background gradients, orbits and halo rings, wave distortions.
  - Export as clean inline SVG, ready for copy/paste.

## User Experience Exploration (Step 2)
- **Primary Flow:**
  1. Land on a hero panel with welcoming copy and immediate preview.
  2. Enter or paste the desired title text.
  3. Tweak style panels (Typography, Color & Light, Layout, Effects).
  4. Export SVG via copy or download.
- **UI concept:** Two-column responsive layout with left control stack and right immersive preview, both wrapped in a soft neon gradient background.
- **Key interactions:**
  - Real-time preview updates with smooth transitions.
  - Preset chips at the top for quick vibe swaps.
  - Toggle advanced controls to avoid overwhelming beginners.

## Scope & Prioritization (Step 3)
- **MVP Controls:** Text input, font family, font weight, font size, letter spacing, line height, uppercase toggle, gradient colors, stroke width, background gradient, glow amount, wave amplitude and frequency, preset management, SVG export.
- **Stretch Ideas (not in MVP):** Multi-line layout templates, AI palette suggestions, animated backgrounds, PNG export, team sharing.
- **Data Structures:** Parameter object persisted in local storage, preset array storing named parameter bundles.

## Architecture & Tech Stack Decisions (Step 4)
- **Stack:** Vanilla HTML/CSS/JS to integrate smoothly with the static site, using modern ES modules. No build step required.
- **Rendering:** SVG constructed dynamically with template literals, applying `<defs>` for gradients, filters, and paths.
- **State Management:** Single `state` object, Proxy-wrapped for reactivity, with change handlers connected to UI inputs.
- **Export:** Create XML serializer string and offer two actions—copy to clipboard and download as `.svg` file.

