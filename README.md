# Intl Phone Input

Aurora-inspired international phone number input delivered as a framework-agnostic Web Component. Ships with a curated country dataset, localisation helpers, and a fully customisable glassmorphism UI.

## Highlights

- Zero-dependency Custom Element that works in any framework.
- Country list with localisation, preferred/allowed filters, dial-code matching, and examples.
- “Aurora” default theme with a rich token set for light/dark or brand-specific styles.
- SSR-safe definition helpers so you can opt-in to registering the element in SPA, SSR, or MPA setups.

## Installation

```bash
npm install @duotalk/intl-phone-input
# or
pnpm add @duotalk/intl-phone-input
```

Use the scoped package name above or rename it before publishing to npm if you plan to release under a different scope.

### CDN / Direct `<script type="module">`

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@duotalk/intl-phone-input/dist/index.js"
></script>
```

Replace the CDN base once you publish (jsDelivr will point to the latest version automatically).

## Quick Start

### Auto-registration (browser)

```js
import "@duotalk/intl-phone-input";
// <intl-phone-input> is now available globally
```

### Manual registration (SSR-friendly)

```js
import { defineIntlPhoneInput } from "@duotalk/intl-phone-input/define";

defineIntlPhoneInput(); // registers "intl-phone-input"
// defineIntlPhoneInput("my-phone-input"); // custom tag name
```

### Basic markup

```html
<intl-phone-input
  default-country="br"
  preferred-countries="br,us,pt,ar"
  placeholder-as-example
  language="pt-BR"
></intl-phone-input>
```

Listen for updates:

```js
const input = document.querySelector("intl-phone-input");

input.addEventListener("input", (event) => {
  console.log(event.detail); // "+554899999999" or ""
});

input.addEventListener("country-change", (event) => {
  console.log(event.detail); // { iso2, dialCode, name, displayName }
});
```

## Attributes

| Attribute                | Type               | Default | Description                                                                                      |
| ------------------------ | ------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `value`                  | `string`           | `""`    | E.164 value reflected as an attribute.                                                           |
| `default-country`        | `string`           | `auto`  | ISO2 code used when no value is present.                                                         |
| `preferred-countries`    | comma separated    | `""`    | Country ISO2 codes pinned to the top.                                                            |
| `allowed-countries`      | comma separated    | `""`    | Optional whitelist (falls back to all).                                                          |
| `placeholder-as-example` | boolean attribute  | off     | Use example numbers as placeholders.                                                             |
| `autocomplete`           | `string`           | `tel`   | Forwarded to the native `<input>`.                                                               |
| `disabled`, `required`   | boolean attributes | off     | Forwarded to the native `<input>`.                                                               |
| `appearance`             | token list         | `""`    | Optional UI toggles: `borderless`, `shadowless`, `no-radius`, `no-effects`. Combine as needed. |
| `country-display`        | enum               | `name`  | Selector label format: `name` (full), `abbr` (ISO), or `none` (hide).                            |
| `language`               | `string` (BCP 47)  | browser | Controls UI strings and country name localisation.                                               |

## Events

| Event            | Detail payload                                |
| ---------------- | --------------------------------------------- |
| `input`          | `string` – live E.164 value (or `""`).        |
| `change`         | `string` – committed value after blur/input.  |
| `country-change` | `{ iso2, dialCode, name, displayName }`.      |
| `valid`          | `{ isValid: true }`.                          |
| `invalid`        | `{ isValid: false }`.                         |
| `focus` / `blur` | Native events forwarded from the inner input. |

## Styling the Aurora Theme

The component uses a custom design system built with CSS custom properties. Override them per element to match your brand:

```css
intl-phone-input {
  --ipi-surface: linear-gradient(135deg, #fdf2f8, #f8fafc);
  --ipi-input-surface: rgba(255, 255, 255, 0.85);
  --ipi-text: #0f172a;
  --ipi-muted: rgba(71, 85, 105, 0.75);
  --ipi-border: rgba(148, 163, 184, 0.35);
  --ipi-focus: #ec4899;
  --ipi-shadow: 0 20px 45px rgba(236, 72, 153, 0.25);
}
```

Core tokens you can override:

| Variable                                                         | Purpose                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `--ipi-font-family`                                              | Base font family.                                                       |
| `--ipi-surface`                                                  | Background for the outer field.                                         |
| `--ipi-input-surface`                                            | Background for the `<input>` portion.                                   |
| `--ipi-border`, `--ipi-border-strong`                            | Border colours for the shell and dropdown.                              |
| `--ipi-focus`                                                    | Accent colour used on focus/active states.                              |
| `--ipi-text` / `--ipi-muted`                                     | Text and secondary text colours.                                        |
| `--ipi-accent`                                                   | Highlight colour for the selector iconography.                          |
| `--ipi-radius`                                                   | Corner radius applied to the shell & dropdown.                          |
| `--ipi-dropdown-bg`                                              | Dropdown container background.                                          |
| `--ipi-highlight`                                                | Hover/active colour for country options.                                |
| `--ipi-shadow`                                                   | Shadow used by the outer field.                                         |
| `--ipi-scrollbar`                                                | Scrollbar colour inside the dropdown.                                   |
| `--ipi-flag-size`                                                | Size of rendered emoji flags.                                           |
| `--ipi-backdrop`                                                 | `backdrop-filter` applied to field/dropdown.                            |
| `--dd-z`                                                         | Override the dropdown `z-index` if needed.                              |
| `--ipi-field-border`                                             | Border declaration for the shell; set to `0 solid transparent` to hide. |
| `--ipi-field-shadow` / `--ipi-field-focus-shadow`                | Resting/focused box shadows for the shell.                              |
| `--ipi-field-focus-translate`                                    | Vertical offset applied to the shell on focus.                          |
| `--ipi-input-disabled-background`                                | Background colour when the input is disabled.                           |
| `--ipi-dropdown-shadow`                                          | Shadow used by the dropdown panel.                                      |
| `--ipi-dropdown-border-width`                                    | Border width for the dropdown; use `0` to remove it.                    |
| `--ipi-dropdown-radius`                                          | Border radius for the dropdown panel.                                   |
| `--ipi-search-background` / `--ipi-search-focus-background`      | Surface colours for the search field.                                   |
| `--ipi-option-hover-background`                                  | Background applied when hovering list rows.                             |
| `--ipi-option-selected-background`                               | Background for the selected country option.                             |
| `--ipi-country-option-hover-transform`                           | Transform applied to hovered country rows.                              |
| `--ipi-country-name-white-space` / `--ipi-country-name-overflow` | Control ellipsis behaviour in the list.                                 |
| `--ipi-transition-duration` / `--ipi-option-transition-duration` | Animation timings for shell and list.                                   |
| `--ipi-transition-easing`                                        | Easing curve shared by interactive transitions.                         |

Tip: declare the token overrides on `.dark intl-phone-input` or container elements to theme per section.

### Appearance tokens

Use the `appearance` attribute to tone down the built-in chrome without having to override CSS:

```html
<intl-phone-input appearance="borderless no-effects"></intl-phone-input>
```

| Token         | Effect                                                            |
| ------------- | ----------------------------------------------------------------- |
| `borderless`  | Removes the outer shell border and dropdown border.               |
| `shadowless`  | Strips shadows from the shell, dropdown, and flag avatar.         |
| `no-radius`   | Forces square corners by zeroing the shell & dropdown radius.     |
| `no-effects`  | Disables hover/focus animations and highlight backgrounds.        |

Tokens can be combined freely, and you can still override the CSS variables above for finer control.

### Selector label modes

Control the flag selector caption with `country-display`:

```html
<intl-phone-input country-display="abbr"></intl-phone-input>
```

- `name` (default) renders the fully localised country name.
- `abbr` shows the ISO 3166-1 alpha-2 code instead.
- `none` hides the country name, leaving just the flag and dial code.

## Extending the Country list

Provide additional country metadata before the component loads. Entries are merged by `iso2`.

```html
<script>
  window.IntlPhoneInputCountriesExtra = [
    {
      iso2: "mx",
      name: "México",
      dialCode: "52",
      mask: "## #### ####",
      example: "+52 55 1234 5678",
      exampleDisplay: "55 1234 5678",
      lengths: [10],
    },
  ];
</script>
<script type="module" src="/dist/index.js"></script>
```

For complete programmatic control you can import the builder:

```js
import { buildCountryList } from "@duotalk/intl-phone-input/intl-phone-input"; // exposed through the dist copy
```

## Local Development

```bash
npm install      # install once
npm run build    # copies ./src → ./dist
```

- `examples/` contains ready-to-open demos (Web Component + Vue 2/3).
- `scripts/build.js` is used by `npm run build` and `npm publish` to keep `dist` in sync.

## Publishing Checklist

1. Update `package.json` fields (`name`, `description`, `repository`, `author`) to match your public project.
2. Run `npm run build` and commit the generated `dist/` output if you want it checked into GitHub.
3. Tag a release (`git tag v1.0.0 && git push --tags`).
4. Publish to npm: `npm publish --access public`.
5. Push to GitHub: `git push origin main` (or your default branch).

## Examples

- `examples/index.html` – vanilla web component demo.
- `examples/vue2-demo.html` – Vue 2 Options API example.
- `examples/vue3-demo.html` – Vue 3 Composition API example.
