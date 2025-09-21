# Title Forge — User Guide

Title Forge is an interactive playground for crafting expressive SVG title graphics with fine-grained control over typography, color, and atmospheric treatments.

## Getting Started
1. Open [`title-lab.html`](../title-lab.html) in a modern browser.
2. Enter your desired headline in the **Title text** box. Use line breaks to create stacked lines.
3. Explore curated vibes via the preset chips at the top or start from scratch.

## Controls Overview
- **Typography**
  - *Font family / weight / size:* Choose from a curated font list (Manrope, Syne, Playfair Display, Space Grotesk, Archivo Black, Pacifico).
  - *Letter spacing & line height:* Adjust tracking and vertical rhythm.
  - *Uppercase:* Force all-caps styling.
  - *Outline stroke:* Toggle a contrasting outline and fine-tune stroke color + width.
  - *Slant:* Apply a skew transform for energetic italics.
- **Color & Light**
  - *Gradient stops & angle:* Blend two colors across the letterforms with rotational control.
  - *Glow:* Amplify or soften the neon haze surrounding the text.
  - *Shadow depth:* Adjust drop-shadow spread for depth.
- **Layout & Atmosphere**
  - *Backdrop style:* Switch between halo, orbit rings, aurora bars, or a clean background.
  - *Backdrop gradient & blur:* Paint the canvas and soften it with Gaussian blur.
  - *Wave warp & detail:* Introduce organic distortions via a turbulence filter.
- **Presets & Export**
  - *Save preset:* Store your current configuration locally (persisted via `localStorage`).
  - *Copy SVG:* Copies the inline SVG markup to the clipboard.
  - *Download .svg:* Downloads the SVG file with a slugified filename.

## Tips
- Small tweaks to **letter spacing** paired with **wave warp** yield dynamic motion.
- Try combining a **halo backdrop** with a subtle **glow** for ethereal aesthetics.
- Multi-line titles work best with higher **line height** values (130–160).
- Use saved presets to build a personal library of moods; they are retained per browser.

## Exporting
- The exported SVG includes gradients, filters, and background shapes in a single file.
- Paste the code into design tools, illustration software, or HTML as needed.
- For raster exports, open the SVG in your vector editor of choice and export to PNG.

Enjoy crafting vibrant title vibes! ✨
