---
name: lazboy-pptx-generator
description: >
  Generate branded PowerPoint presentations using the official La-Z-Boy
  corporate template (.potx). This skill teaches agents how to use python-pptx
  to create on-brand slide decks with correct layouts, fonts, and colors.
  Use this skill whenever creating or generating PowerPoint files, slides,
  presentations, or decks for La-Z-Boy — even if the user doesn't explicitly
  mention brand guidelines. Trigger on: create pptx, PowerPoint, presentation,
  slides, deck, pitch deck, status report slides, quarterly review, or any
  request to generate a .pptx file for La-Z-Boy.
version: "1.0.0"
category: Designer
tags: [pptx, powerpoint, presentation, brand, template, slides]
compatibility: "Requires python-pptx (pip install python-pptx)"
---

# La-Z-Boy PowerPoint Generator

Create on-brand PowerPoint presentations using the official La-Z-Boy corporate template. Every generated deck uses the `.potx` template's slide masters — never create slides from scratch.

**Reference files:**
- `references/slide-layouts.md` — read to understand all 37 available slide layouts
- `assets/lazboy-template.potx` — the official corporate template (source of truth)
- `scripts/create_pptx.py` — helper script that handles .potx conversion and slide creation

---

## 1. Template Architecture

The La-Z-Boy template contains **37 slide layouts** across 3 brands:
- **Layouts 0–26**: La-Z-Boy brand (use by default)
- **Layouts 27–31**: England brand (only when explicitly requested)
- **Layouts 32–36**: Joybird brand (only when explicitly requested)

Slide dimensions: **13.3" x 7.5"** (Widescreen 16:9)

### Core Layouts You'll Use Most

| Layout | Index | When to Use |
|--------|-------|-------------|
| Title Slide | 0 | Opening/cover slide |
| Divider Slide | 3 | Section breaks |
| Content (Cream) | 7 | Default content slide (full-height body) |
| Content (White) | 8 | Content on white background |
| Two Column | 9 | Side-by-side comparisons |
| Image + Text | 12 | Visual content with description |
| Statistics | 21 | KPIs, metrics, numbers |
| Process | 20 | Step-by-step workflows |
| Quote | 19 | Testimonials, callout quotes |
| Profile | 14 | Team member bios |
| End Slide | 26 | Closing slide |

Consult `references/slide-layouts.md` for the full layout reference with placeholder indices.

---

## 2. Brand Colors (from brandguidelines.la-z-boy.com)

These colors are baked into the template's slide masters. Use them only when adding custom elements.

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#003349` | Headings, primary text |
| Accent Green | `#9AB9AD` | Callouts, highlights, borders |
| Dark Teal | `#244C5D` | Secondary headings |
| Warm Cream | `#E6E2D5` | Backgrounds |
| Blush | `#ECC3B2` | Accents |
| Brand Red | `#BD472A` | Alerts, emphasis |
| Soft Gold | `#FBE7C6` | Highlights |
| Neutral Base | `#F5F3EE` | Page backgrounds |

**Typography**: Montserrat (primary), Bookmania (secondary, weight 600)

---

## 3. Creating Presentations

### Quick Start — Using the Helper Script

```python
from scripts.create_pptx import create_presentation

slides = [
    {"layout": "title", "title": "Q1 2026 Results", "subtitle": "Engineering Team"},
    {"layout": "divider", "title": "Agenda"},
    {"layout": "content", "title": "Key Highlights", "body": "Revenue up 15%\nNew product launches\nTeam growth to 50+"},
    {"layout": "stats", "title": "By the Numbers", "body": "Strong quarter across all metrics",
     "stat1": "$2.1B", "stat1_label": "Revenue", "stat2": "15%", "stat2_label": "YoY Growth"},
    {"layout": "two_column", "title": "Priorities", "left": "Q1 Wins\n- Launched AI Hub\n- Reduced deploy time",
     "right": "Q2 Focus\n- Scale platform\n- Expand team"},
    {"layout": "end"},
]

create_presentation(slides, "q1_results.pptx")
```

### Direct python-pptx Usage

When you need more control, use python-pptx directly. **Always load from the template:**

```python
import zipfile, tempfile, os
from io import BytesIO
from pptx import Presentation

# Step 1: Convert .potx to .pptx (required — python-pptx doesn't read .potx)
def load_template(potx_path):
    tmp = tempfile.mktemp(suffix=".pptx")
    with open(potx_path, "rb") as f:
        data = f.read()
    bio = BytesIO(data)
    with zipfile.ZipFile(bio, "r") as zin:
        with zipfile.ZipFile(tmp, "w") as zout:
            for item in zin.infolist():
                content = zin.read(item.filename)
                if item.filename == "[Content_Types].xml":
                    content = content.replace(
                        b"presentationml.template.main+xml",
                        b"presentationml.presentation.main+xml",
                    )
                zout.writestr(item, content)
    return Presentation(tmp)

# Step 2: Add slides using layout indices
prs = load_template("assets/lazboy-template.potx")

# Title slide (layout 0)
slide = prs.slides.add_slide(prs.slide_layouts[0])
slide.placeholders[0].text = "Project Update"
slide.placeholders[1].text = "March 2026"

# Content slide (layout 7 — full-height cream)
slide = prs.slides.add_slide(prs.slide_layouts[7])
slide.placeholders[0].text = "Key Updates"
tf = slide.placeholders[1].text_frame
tf.text = "First bullet point"
tf.add_paragraph().text = "Second bullet point"
tf.add_paragraph().text = "Third bullet point"

# End slide (layout 26)
prs.slides.add_slide(prs.slide_layouts[26])

prs.save("output.pptx")
```

### Available Layout Keys for the Helper Script

```
title, title_alt1, title_alt2, divider, divider_alt,
content_cream, content_white, content, content_white_full,
two_column, round_image, image_text_white, image_text,
full_image, profile, title_only,
two_col_content, three_col_content, four_col_content,
quote, process, stats,
footer_only, blank, logo, brands, end
```

---

## 4. Recommended Slide Sequence

For a typical business presentation:

1. **Title Slide** (layout 0) — Cover with title and subtitle
2. **Divider** (layout 3) — Agenda/overview
3. **Content slides** (layout 7) — Main body (2-5 slides)
4. **Statistics** (layout 21) — KPIs and metrics
5. **Process** (layout 20) — Workflows or timelines
6. **Two Column** (layout 9) — Comparisons or pros/cons
7. **End Slide** (layout 26) — Branded closing

For image-heavy presentations, mix in layouts 11-13 between content slides.

---

## 5. What NOT to Do

- Never use `Presentation()` (empty) — always load from the `.potx` template
- Never create slides from a blank layout when a purpose-built layout exists
- Never override the template's fonts with arbitrary typefaces
- Never hardcode colors — use the template's theme colors
- Never use England (27-31) or Joybird (32-36) layouts unless explicitly requested
- Never add content outside placeholder boundaries — it breaks the branded layout
- Never skip the Title Slide (layout 0) — every deck must open with a branded cover
- Never skip the End Slide (layout 26) — every deck must close with the branded closer

---

## 6. Resources

| Resource | Path | When to Use |
|----------|------|-------------|
| Slide layouts reference | `references/slide-layouts.md` | Look up placeholder indices for any layout |
| Corporate template | `assets/lazboy-template.potx` | Source template for all presentations |
| Helper script | `scripts/create_pptx.py` | Generate decks from structured JSON input |
| Brand guidelines | https://brandguidelines.la-z-boy.com/ | Verify brand compliance |
