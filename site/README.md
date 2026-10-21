# elev8 BMI calculator

A static site built from the Claude Design handoff in `../project/elev8 BMI.dc.html`. It needs no build step: open `index.html` in a browser, or serve the folder with any static server (`npx serve site`).

| Page | Design | What it is |
| --- | --- | --- |
| `index.html` | — | Links to the three directions |
| `product.html` | 1a | Hero headline beside a calculator card with a BMI scale bar; lean mass, FFMI and fat mass cards below |
| `big-number.html` | 1b | BMI as the hero, a settings-sheet of controls, a training-type picker and an FFMI panel |
| `rings.html` | 1c | BMI, FFMI and body fat as concentric rings on dark sage |

## Files

- `css/organic.css` holds the Organic design-system tokens and components, copied unchanged from the handoff's `_ds/` folder. Take colors, fonts and radii from its variables.
- `css/app.css` holds the page layouts, plus breakpoints at 1180, 980, 760 and 560px.
- `js/bmi.js` holds the shared calculation (BMI, lean mass, FFMI with height normalisation, category text, sport ranges) and a small binder. Pages mark live values with `data-text`, `data-vars`, `data-attr`, `data-input`, `data-unit` and `data-sport` and call `Elev8.mount(document)`.

The infinity logo is still the placeholder from the mockup. To replace it, swap the inline `<svg class="logo">` on each page.
