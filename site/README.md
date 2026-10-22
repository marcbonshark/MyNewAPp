# elev8 BMI calculator

A static site built from the Claude Design handoff in `../project/elev8 BMI.dc.html`. It needs no build step: open `index.html` in a browser, or serve the folder with any static server (`npx serve site`).

The whole site is one page, `index.html`: the brand hero, the elev8 statement, three principles, then two calculators that each keep their own state.

| Section | Design | What it is |
| --- | --- | --- |
| `#calculator` | 1b | BMI as the hero, a settings-sheet of controls, a training-type picker and an FFMI panel |
| `#rings` | 1c | BMI, FFMI and body fat as concentric rings on dark sage |

## Files

- `css/organic.css` holds the Organic design-system tokens and components, copied unchanged from the handoff's `_ds/` folder. Take colors, fonts and radii from its variables.
- `css/app.css` holds the page layouts, plus breakpoints at 1180, 980, 760 and 560px.
- `js/bmi.js` holds the shared calculation (BMI, lean mass, FFMI with height normalisation, category text, sport ranges) and a small binder. Pages mark live values with `data-text`, `data-vars`, `data-attr`, `data-input`, `data-unit` and `data-sport` and call `Elev8.mount(sectionElement)` once per calculator.

The infinity logo is still the placeholder from the mockup. To replace it, swap the inline `<svg class="logo">` in `index.html`.
