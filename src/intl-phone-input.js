import { buildCountryList } from "./countries.data.js";
import i18nStrings from "./i18n.js";

const UI_STRINGS = i18nStrings;

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      --ipi-font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      --ipi-surface: linear-gradient(135deg, #111c2c, #0b1220);
      --ipi-input-surface: rgba(20, 30, 48, 0.65);
      --ipi-border: rgba(148, 163, 184, 0.35);
      --ipi-border-strong: rgba(148, 163, 184, 0.6);
      --ipi-focus: #38bdf8;
      --ipi-shadow: 0 18px 35px rgba(8, 13, 23, 0.45);
      --ipi-text: #e2e8f0;
      --ipi-muted: rgba(148, 163, 184, 0.9);
      --ipi-accent: #38bdf8;
      --ipi-radius: 18px;
      --ipi-flag-size: 1.35rem;
      --ipi-dropdown-bg: rgba(15, 23, 42, 0.98);
      --ipi-dropdown-border: rgba(56, 189, 248, 0.25);
      --ipi-highlight: rgba(56, 189, 248, 0.16);
      --ipi-scrollbar: rgba(148, 163, 184, 0.2);
      --ipi-backdrop: blur(18px);
      display: inline-flex;
      position: relative;
      min-width: 280px;
      font-family: var(--ipi-font-family);
      color: var(--ipi-text);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .field {
      display: inline-flex;
      align-items: center;
      width: 100%;
      background: var(--ipi-surface);
      border: 1px solid var(--ipi-border);
      border-radius: var(--ipi-radius);
      box-shadow: var(--ipi-shadow);
      overflow: visible;
      transition: border-color 0.2s ease, box-shadow 0.2s ease,
        transform 0.2s ease;
      backdrop-filter: var(--ipi-backdrop);
    }

    .field:focus-within {
      border-color: var(--ipi-focus);
      box-shadow: 0 25px 45px rgba(56, 189, 248, 0.12);
      transform: translateY(-1px);
    }

    .selector {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font: inherit;
      color: inherit;
      position: relative;
      white-space: nowrap;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .selector:focus-visible {
      outline: none;
      color: var(--ipi-accent);
    }

    .selector[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .selector__flag {
      font-size: var(--ipi-flag-size);
      line-height: 1;
      filter: drop-shadow(0 3px 6px rgba(8, 13, 23, 0.45));
    }

    .selector__name {
      font-size: 0.9rem;
      font-weight: 500;
      color: inherit;
    }

    .selector__dial {
      font-size: 0.8rem;
      color: var(--ipi-muted);
    }

    .selector__chevron {
      font-size: 0.65rem;
      color: var(--ipi-muted);
      margin-left: 0.35rem;
      transition: transform 0.2s ease;
    }

    .field.has-dial-code .selector__chevron {
      display: none;
    }

    .dial-code-pill {
      display: none;
      align-items: center;
      padding: 0 1rem;
      border-right: 1px solid var(--ipi-border-strong);
      background: rgba(15, 23, 42, 0.65);
      color: inherit;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
    }

    .field.has-dial-code .dial-code-pill {
      display: inline-flex;
    }

    .phone-input {
      flex: 1;
      border: none;
      padding: 0.9rem 1rem;
      font: inherit;
      color: inherit;
      background: var(--ipi-input-surface);
      min-width: 0;
      letter-spacing: 0.01em;
    }

    .phone-input::placeholder {
      color: var(--ipi-muted);
      opacity: 0.65;
    }

    .phone-input:focus {
      outline: none;
    }

    .phone-input:disabled {
      background: rgba(15, 23, 42, 0.45);
      cursor: not-allowed;
      color: var(--ipi-muted);
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      z-index: var(--dd-z, 40);
      background: var(--ipi-dropdown-bg);
      border: 1px solid var(--ipi-dropdown-border);
      border-radius: calc(var(--ipi-radius) - 2px);
      box-shadow: 0 28px 65px rgba(8, 13, 23, 0.55);
      padding: 0.85rem;
      display: none;
      backdrop-filter: var(--ipi-backdrop);
    }

    .dropdown.open {
      display: block;
    }

    .dropdown__search {
      position: relative;
      margin-bottom: 0.5rem;
    }

    .dropdown__search input {
      width: 100%;
      border: 1px solid transparent;
      border-radius: 0.9rem;
      padding: 0.6rem 0.85rem;
      font: inherit;
      background: rgba(15, 23, 42, 0.65);
      color: inherit;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .dropdown__search input:focus {
      outline: none;
      border-color: var(--ipi-focus);
      background: rgba(15, 23, 42, 0.85);
    }

    .country-list {
      max-height: 260px;
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      list-style: none;
      scrollbar-width: thin;
      scrollbar-color: var(--ipi-scrollbar) transparent;
    }

    .country-list::-webkit-scrollbar {
      width: 8px;
    }

    .country-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .country-list::-webkit-scrollbar-thumb {
      background: var(--ipi-scrollbar);
      border-radius: 999px;
    }

    .country-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.65rem;
      padding: 0.55rem 0.65rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.15s ease;
      color: inherit;
    }

    .country-option:hover,
    .country-option.active {
      background: var(--ipi-highlight);
      transform: translateX(2px);
    }

    .country-option.selected {
      background: rgba(56, 189, 248, 0.24);
    }

    .country-option__flag {
      font-size: var(--ipi-flag-size);
      margin-right: 0.35rem;
    }

    .country-option__meta {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
    }

    .country-option__name {
      font-size: 0.85rem;
      color: inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .country-option__dial {
      font-size: 0.8rem;
      color: var(--ipi-muted);
    }

    .country-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--ipi-muted);
      margin: 0.4rem 0 0.45rem;
      padding: 0 0.35rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  </style>
  <div class="field">
    <button class="selector" type="button" aria-haspopup="listbox" aria-expanded="false">
      <span class="selector__flag" aria-hidden="true"></span>
      <span class="selector__name"></span>
      <span class="selector__dial"></span>
      <span class="selector__chevron" aria-hidden="true">▾</span>
    </button>
    <div class="dial-code-pill"></div>
    <input class="phone-input" type="tel" autocomplete="tel" />
    <div class="dropdown" role="listbox">
      <div class="dropdown__search">
        <label class="sr-only" for="country-search">Search country</label>
        <input id="country-search" type="search" placeholder="Search" aria-label="Search country" />
      </div>
      <ul class="country-list"></ul>
    </div>
  </div>
`;

const isoToFlag = (iso2 = "") => {
  if (!iso2) return "🏳";
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

const toDigits = (value = "") => String(value).replace(/\D/g, "");

const normalizeE164 = (value) => {
  if (!value) return "";
  const digits = toDigits(value);
  return digits ? `+${digits}` : "";
};

export class IntlPhoneInputElement extends HTMLElement {
  static get observedAttributes() {
    return [
      "value",
      "default-country",
      "preferred-countries",
      "allowed-countries",
      "placeholder-as-example",
      "separate-dial-code",
      "autocomplete",
      "disabled",
      "required",
      "language",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    this.countries = [];
    this.selectedCountry = null;
    this.nationalDigits = "";
    this.preferredIso = [];
    this.allowedIso = null;
    this.dropdownOpen = false;
    this.countryOptionEls = [];
    this.highlightedIndex = -1;
    this.lastValidity = null;
    this._value = "";
    this._reflecting = false;
    this._connected = false;
    this.locale = "en";
    this.localeBase = "en";

    this.elements = {
      field: this.shadowRoot.querySelector(".field"),
      selector: this.shadowRoot.querySelector(".selector"),
      selectorFlag: this.shadowRoot.querySelector(".selector__flag"),
      selectorName: this.shadowRoot.querySelector(".selector__name"),
      selectorDial: this.shadowRoot.querySelector(".selector__dial"),
      dialCodePill: this.shadowRoot.querySelector(".dial-code-pill"),
      input: this.shadowRoot.querySelector(".phone-input"),
      dropdown: this.shadowRoot.querySelector(".dropdown"),
      search: this.shadowRoot.querySelector("#country-search"),
      list: this.shadowRoot.querySelector(".country-list"),
      searchLabel: this.shadowRoot.querySelector("label[for='country-search']"),
    };

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleSelectorClick = this.handleSelectorClick.bind(this);
    this.handleSelectorKeydown = this.handleSelectorKeydown.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleDropdownKeydown = this.handleDropdownKeydown.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;

    this.applyAutocomplete();
    this.applyDisabled();
    this.applyRequired();
    this.refreshPreferred();
    this.refreshAllowed();
    this.refreshCountries();
    this.ensureSelection();

    if (this.hasAttribute("value")) {
      this.applyE164Value(this.getAttribute("value"), { emit: false });
    } else {
      this.updateInputDisplay();
      this.updateValue({ emitInput: false, emitValidity: true });
    }

    this.updatePlaceholder();
    this.updateDialCodeUI();
    this.updateLocale(this.getAttribute("language"));
    this.renderCountryList();

    this.attachEvents();
  }

  disconnectedCallback() {
    this.elements.selector.removeEventListener(
      "click",
      this.handleSelectorClick
    );
    this.elements.selector.removeEventListener(
      "keydown",
      this.handleSelectorKeydown
    );
    this.elements.input.removeEventListener("input", this.handleInput);
    this.elements.input.removeEventListener("change", this.handleChange);
    this.elements.input.removeEventListener("focus", this.handleFocus);
    this.elements.input.removeEventListener("blur", this.handleBlur);
    this.elements.input.removeEventListener("paste", this.handlePaste);
    this.elements.search.removeEventListener("input", this.handleSearchInput);
    this.elements.search.removeEventListener(
      "keydown",
      this.handleDropdownKeydown
    );
    this.elements.list.removeEventListener(
      "keydown",
      this.handleDropdownKeydown
    );
    this.elements.list.removeEventListener("click", this.handleListClick);
    document.removeEventListener("click", this.handleDocumentClick, true);
    this._connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || this._reflecting) return;

    switch (name) {
      case "value":
        if (this._connected) {
          this.applyE164Value(newValue, { emit: false });
        }
        break;
      case "default-country":
        if (this._connected) {
          this.ensureSelection(newValue);
          this.updatePlaceholder();
          this.renderCountryList();
        }
        break;
      case "preferred-countries":
        this.refreshPreferred();
        this.renderCountryList();
        break;
      case "allowed-countries":
        this.refreshAllowed();
        this.refreshCountries();
        this.ensureSelection();
        this.renderCountryList();
        this.updatePlaceholder();
        break;
      case "placeholder-as-example":
        this.updatePlaceholder();
        break;
      case "separate-dial-code":
        this.updateDialCodeUI();
        this.updatePlaceholder();
        this.updateInputDisplay();
        break;
      case "autocomplete":
        this.applyAutocomplete();
        break;
      case "disabled":
        this.applyDisabled();
        break;
      case "required":
        this.applyRequired();
        break;
      case "language":
        this.updateLocale(newValue);
        if (this._connected) {
          this.renderCountryList();
        }
        break;
      default:
        break;
    }
  }

  normalizeLocale(value) {
    if (!value && value !== 0) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    return raw.replace(/_/g, "-").toLowerCase();
  }

  resolveLocale(preferred) {
    const normalizedPreferred = this.normalizeLocale(preferred);
    if (normalizedPreferred) return normalizedPreferred;

    if (typeof navigator !== "undefined") {
      const candidates = Array.isArray(navigator.languages)
        ? navigator.languages
        : navigator.language
        ? [navigator.language]
        : [];
      for (const candidate of candidates) {
        const normalizedCandidate = this.normalizeLocale(candidate);
        if (normalizedCandidate) {
          return normalizedCandidate;
        }
      }
    }

    return "en";
  }

  updateLocale(preferred) {
    const resolved = this.resolveLocale(preferred);
    const base = resolved.split("-")[0] || resolved;
    const changed = resolved !== this.locale;

    this.locale = resolved;
    this.localeBase = base;

    if (this._connected) {
      this.updateLocalization();
      if (changed) {
        this.updateCountryLabel();
      }
    }
  }

  getLocaleCandidates() {
    const candidates = [];
    if (this.locale) candidates.push(this.locale);
    if (this.localeBase && this.localeBase !== this.locale) {
      candidates.push(this.localeBase);
    }
    candidates.push("default");
    return candidates;
  }

  t(key) {
    const dictionary = UI_STRINGS[key];
    if (!dictionary) return "";
    for (const candidate of this.getLocaleCandidates()) {
      if (dictionary[candidate]) {
        return dictionary[candidate];
      }
    }
    return dictionary.default;
  }

  updateLocalization() {
    const placeholder = this.t("searchPlaceholder");
    if (this.elements.search) {
      this.elements.search.placeholder = placeholder;
      this.elements.search.setAttribute("aria-label", this.t("searchAria"));
    }
    if (this.elements.searchLabel) {
      this.elements.searchLabel.textContent = this.t("searchLabel");
    }

    if (this.elements.selector) {
      const ariaLabel = this.t("selectorLabel");
      const countryName = this.getCountryName(this.selectedCountry);
      this.elements.selector.setAttribute(
        "aria-label",
        countryName ? `${ariaLabel}: ${countryName}` : ariaLabel
      );
    }
  }

  getCountryName(country) {
    if (!country) return "";
    const translations = country.translations || {};
    for (const candidate of this.getLocaleCandidates()) {
      if (candidate === "default") continue;
      if (translations[candidate]) {
        return translations[candidate];
      }
    }
    if (country.nativeName) return String(country.nativeName);
    return country.name;
  }

  getCountrySearchValue(country) {
    if (!country) return "";
    if (country._searchIndex) return country._searchIndex;

    const values = new Set();
    values.add(country.name);
    values.add(country.iso2);
    if (country.dialCode) {
      values.add(`+${country.dialCode}`);
      values.add(country.dialCode);
    }
    values.add(country.nativeName);
    if (country.translations) {
      Object.values(country.translations).forEach((value) => values.add(value));
    }

    const normalized = Array.from(values)
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    country._searchIndex = normalized;
    return normalized;
  }

  compareCountries(a, b) {
    const nameA = this.getCountryName(a);
    const nameB = this.getCountryName(b);
    return nameA.localeCompare(nameB, this.locale, { sensitivity: "base" });
  }

  get value() {
    return this._value;
  }

  set value(val) {
    const normalized = normalizeE164(val);
    if (!normalized) {
      this._reflecting = true;
      this.removeAttribute("value");
      this._reflecting = false;
      this.applyE164Value("", { emit: false });
    } else {
      this._reflecting = true;
      this.setAttribute("value", normalized);
      this._reflecting = false;
      this.applyE164Value(normalized, { emit: false });
    }
  }

  attachEvents() {
    this.elements.selector.addEventListener("click", this.handleSelectorClick);
    this.elements.selector.addEventListener(
      "keydown",
      this.handleSelectorKeydown
    );
    this.elements.input.addEventListener("input", this.handleInput);
    this.elements.input.addEventListener("change", this.handleChange);
    this.elements.input.addEventListener("focus", this.handleFocus);
    this.elements.input.addEventListener("blur", this.handleBlur);
    this.elements.input.addEventListener("paste", this.handlePaste);
    this.elements.search.addEventListener("input", this.handleSearchInput);
    this.elements.search.addEventListener(
      "keydown",
      this.handleDropdownKeydown
    );
    this.elements.list.addEventListener("keydown", this.handleDropdownKeydown);
    this.elements.list.addEventListener("click", this.handleListClick);
    document.addEventListener("click", this.handleDocumentClick, true);
  }

  refreshPreferred() {
    const attr = this.getAttribute("preferred-countries") || "";
    this.preferredIso = attr
      .split(",")
      .map((code) => code.trim().toLowerCase())
      .filter(Boolean);
  }

  refreshAllowed() {
    const attr = this.getAttribute("allowed-countries");
    if (!attr) {
      this.allowedIso = null;
      return;
    }

    const list = attr
      .split(",")
      .map((code) => code.trim().toLowerCase())
      .filter(Boolean);
    this.allowedIso = list.length ? list : null;
  }

  refreshCountries() {
    const all = buildCountryList();
    const filtered = this.allowedIso
      ? all.filter((country) => this.allowedIso.includes(country.iso2))
      : all;

    this.countries = filtered;
  }

  ensureSelection(preferredIso) {
    if (!this.countries.length) {
      this.selectedCountry = null;
      return;
    }

    const requestedIso = (
      preferredIso ||
      this.getAttribute("default-country") ||
      "br"
    ).toLowerCase();

    const findByIso = (iso) =>
      this.countries.find((country) => country.iso2 === iso);

    if (this.selectedCountry) {
      const stillAvailable = findByIso(this.selectedCountry.iso2);
      if (stillAvailable) {
        this.selectedCountry = stillAvailable;
        return;
      }
    }

    const preferred = findByIso(requestedIso);
    if (preferred) {
      this.setCountry(preferred, { emit: false });
      return;
    }

    for (const iso of this.preferredIso) {
      const match = findByIso(iso);
      if (match) {
        this.setCountry(match, { emit: false });
        return;
      }
    }

    this.setCountry(this.countries[0], { emit: false });
  }

  updateCountryLabel() {
    if (!this.selectedCountry) return;
    this.elements.selectorFlag.textContent = isoToFlag(
      this.selectedCountry.iso2
    );
    const localizedName = this.getCountryName(this.selectedCountry);
    this.elements.selectorName.textContent = localizedName;
    this.elements.selectorDial.textContent = `+${this.selectedCountry.dialCode}`;
    if (this.elements.selector) {
      const ariaLabel = this.t("selectorLabel");
      this.elements.selector.setAttribute(
        "aria-label",
        localizedName ? `${ariaLabel}: ${localizedName}` : ariaLabel
      );
    }
  }

  updateDialCodeUI() {
    const show = this.hasAttribute("separate-dial-code");
    this.elements.field.classList.toggle("has-dial-code", show);
    this.elements.dialCodePill.textContent = this.selectedCountry
      ? `+${this.selectedCountry.dialCode}`
      : "";
  }

  updatePlaceholder() {
    const showExample = this.hasAttribute("placeholder-as-example");
    if (!this.selectedCountry) {
      this.elements.input.placeholder = showExample ? "+" : "";
      return;
    }

    if (!showExample) {
      this.elements.input.placeholder = "";
      return;
    }

    const separate = this.hasAttribute("separate-dial-code");
    if (separate) {
      this.elements.input.placeholder =
        this.selectedCountry.exampleDisplay || this.selectedCountry.mask || "";
    } else {
      const example =
        this.selectedCountry.example || this.selectedCountry.exampleDisplay;
      this.elements.input.placeholder = example || "";
    }
  }

  updateInputDisplay() {
    if (!this.selectedCountry) return;
    const mask = this.selectedCountry.mask || "";
    const formatted = mask
      ? this.applyMask(mask, this.nationalDigits)
      : this.nationalDigits;
    if (this.elements.input.value !== formatted) {
      const wasActive = this.shadowRoot.activeElement === this.elements.input;
      this.elements.input.value = formatted;
      if (wasActive) {
        const position = formatted.length;
        try {
          this.elements.input.setSelectionRange(position, position);
        } catch (error) {
          // Some input types may not support setSelectionRange; ignore.
        }
      }
    }
    this.elements.dialCodePill.textContent = this.selectedCountry
      ? `+${this.selectedCountry.dialCode}`
      : "";
  }

  updateValue({
    emitInput = false,
    emitChange = false,
    emitValidity = true,
  } = {}) {
    const dial = this.selectedCountry ? this.selectedCountry.dialCode : "";
    const e164 = this.nationalDigits ? `+${dial}${this.nationalDigits}` : "";

    this._value = e164;
    this.reflectValueAttribute(e164);

    if (emitInput) {
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: e164,
          bubbles: true,
          composed: true,
        })
      );
    }

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: e164,
          bubbles: true,
          composed: true,
        })
      );
    }

    if (emitValidity) {
      this.evaluateValidity(true);
    } else {
      this.evaluateValidity(false);
    }

    return e164;
  }

  reflectValueAttribute(e164) {
    this._reflecting = true;
    if (e164) {
      this.setAttribute("value", e164);
    } else {
      this.removeAttribute("value");
    }
    this._reflecting = false;
  }

  evaluateValidity(emit) {
    if (!this.selectedCountry) return false;
    const expectedLengths = Array.isArray(this.selectedCountry.lengths)
      ? this.selectedCountry.lengths
      : [];
    let isValid = true;

    if (expectedLengths.length) {
      isValid = expectedLengths.includes(this.nationalDigits.length);
    } else {
      isValid = this.nationalDigits.length > 0;
    }

    if (emit && this.lastValidity !== isValid) {
      this.dispatchEvent(
        new CustomEvent(isValid ? "valid" : "invalid", {
          detail: { isValid },
          bubbles: true,
          composed: true,
        })
      );
    }

    this.lastValidity = isValid;
    return isValid;
  }

  applyMask(mask, digits) {
    let result = "";
    let digitIndex = 0;

    for (let i = 0; i < mask.length; i += 1) {
      const char = mask[i];
      if (char === "#") {
        if (digitIndex < digits.length) {
          result += digits[digitIndex];
          digitIndex += 1;
        } else {
          break;
        }
      } else if (digitIndex < digits.length) {
        result += char;
      }
    }

    if (digitIndex < digits.length) {
      result += digits.slice(digitIndex);
    }

    return result;
  }

  applyE164Value(value, { emit } = { emit: false }) {
    const normalized = normalizeE164(value);
    if (!normalized) {
      this.nationalDigits = "";
      this.updateInputDisplay();
      this.updateValue({ emitInput: emit, emitValidity: true });
      return;
    }

    const digits = normalized.replace(/^\+/, "");
    const match = this.matchCountryByDialCode(digits);

    if (match) {
      const { country, national } = match;
      this.setCountry(country, { emit });
      // Keep previously typed digits visible until we have a national portion.
      if (national.length || !this.nationalDigits.length) {
        this.nationalDigits = national;
      }
    } else if (this.selectedCountry) {
      const dialLength = this.selectedCountry.dialCode.length;
      this.nationalDigits = digits.startsWith(this.selectedCountry.dialCode)
        ? digits.slice(dialLength)
        : digits;
    } else {
      this.nationalDigits = digits;
    }

    this.updateInputDisplay();
    this.updateValue({ emitInput: emit, emitValidity: true });
  }

  matchCountryByDialCode(digits) {
    if (!digits) return null;
    const ordered = [...this.countries].sort(
      (a, b) => b.dialCode.length - a.dialCode.length
    );
    for (const country of ordered) {
      if (!country.dialCode) continue;
      if (digits.startsWith(country.dialCode)) {
        return {
          country,
          national: digits.slice(country.dialCode.length),
        };
      }
    }
    return null;
  }

  handleInput(event) {
    if (typeof event?.stopPropagation === "function") {
      event.stopPropagation();
    }
    if (!this.selectedCountry) return;
    const digits = toDigits(event.target.value);
    this.nationalDigits = digits;
    this.updateInputDisplay();
    this.updateValue({ emitInput: true, emitValidity: true });
  }

  handleChange() {
    this.updateValue({ emitChange: true, emitValidity: true });
  }

  handleFocus() {
    this.dispatchEvent(
      new Event("focus", {
        bubbles: true,
        composed: true,
      })
    );
  }

  handleBlur() {
    this.dispatchEvent(
      new Event("blur", {
        bubbles: true,
        composed: true,
      })
    );
  }

  handlePaste(event) {
    const text = (event.clipboardData || window.clipboardData).getData("text");
    if (!text) return;
    const cleaned = text.replace(/[^+\d]/g, "");
    if (/^\+?\d{3,}$/.test(cleaned)) {
      event.preventDefault();
      const normalized = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
      this.applyE164Value(normalized, { emit: true });
      this.closeDropdown();
    }
  }

  handleSelectorClick() {
    if (this.elements.selector.hasAttribute("disabled")) return;
    this.toggleDropdown();
  }

  handleSelectorKeydown(event) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      this.toggleDropdown(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.openDropdown(true);
      this.moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.openDropdown(true);
      this.moveHighlight(-1);
    }
  }

  handleDocumentClick(event) {
    if (!this.dropdownOpen) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this.closeDropdown();
  }

  handleSearchInput() {
    this.renderCountryList();
  }

  handleDropdownKeydown(event) {
    if (!this.dropdownOpen) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.moveHighlight(-1);
        break;
      case "Enter":
        event.preventDefault();
        this.selectHighlighted();
        break;
      case "Escape":
        event.preventDefault();
        this.closeDropdown(true);
        this.elements.selector.focus();
        break;
      default:
        break;
    }
  }

  handleListClick(event) {
    const option = event.target.closest(".country-option");
    if (!option) return;
    const iso = option.getAttribute("data-iso");
    if (iso) {
      this.selectCountryByIso(iso, { focusInput: true, emit: true });
    }
  }

  openDropdown(focusSearch = false) {
    if (this.dropdownOpen || this.elements.selector.hasAttribute("disabled"))
      return;
    this.dropdownOpen = true;
    this.elements.dropdown.classList.add("open");
    this.elements.selector.setAttribute("aria-expanded", "true");
    this.renderCountryList();
    if (focusSearch) {
      requestAnimationFrame(() => this.elements.search.focus());
    }
  }

  closeDropdown(focusInput = false) {
    if (!this.dropdownOpen) return;
    this.dropdownOpen = false;
    this.elements.dropdown.classList.remove("open");
    this.elements.selector.setAttribute("aria-expanded", "false");
    if (focusInput) {
      requestAnimationFrame(() => this.elements.input.focus());
    }
  }

  toggleDropdown(focusSearch = false) {
    if (this.dropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown(focusSearch);
    }
  }

  moveHighlight(direction) {
    if (!this.countryOptionEls.length) return;
    if (this.highlightedIndex === -1) {
      this.highlightedIndex = this.countryOptionEls.findIndex(
        (el) => el.getAttribute("data-iso") === this.selectedCountry?.iso2
      );
      if (this.highlightedIndex === -1) {
        this.highlightedIndex = 0;
      }
    } else {
      this.highlightedIndex =
        (this.highlightedIndex + direction + this.countryOptionEls.length) %
        this.countryOptionEls.length;
    }

    this.updateHighlight();
  }

  updateHighlight() {
    this.countryOptionEls.forEach((el) => el.classList.remove("active"));
    if (
      this.highlightedIndex < 0 ||
      this.highlightedIndex >= this.countryOptionEls.length
    )
      return;
    const current = this.countryOptionEls[this.highlightedIndex];
    current.classList.add("active");
    if (typeof current.scrollIntoView === "function") {
      try {
        current.scrollIntoView({ block: "nearest" });
      } catch (error) {
        current.scrollIntoView();
      }
    }
  }

  selectHighlighted() {
    if (
      this.highlightedIndex < 0 ||
      this.highlightedIndex >= this.countryOptionEls.length
    )
      return;
    const option = this.countryOptionEls[this.highlightedIndex];
    const iso = option.getAttribute("data-iso");
    if (iso) {
      this.selectCountryByIso(iso, { focusInput: true, emit: true });
    }
  }

  selectCountryByIso(iso, { focusInput = false, emit = true } = {}) {
    const country = this.countries.find(
      (item) => item.iso2 === iso.toLowerCase()
    );
    if (!country) return;
    this.setCountry(country, { emit });
    this.renderCountryList();
    this.closeDropdown(focusInput);
    this.updateInputDisplay();
    this.updateValue({ emitInput: true, emitValidity: true });
  }

  setCountry(country, { emit = true } = {}) {
    if (!country) return;
    const changed = this.selectedCountry?.iso2 !== country.iso2;
    this.selectedCountry = country;
    this.updateCountryLabel();
    this.updatePlaceholder();
    this.updateDialCodeUI();
    if (changed && emit) {
      this.dispatchEvent(
        new CustomEvent("country-change", {
          detail: {
            iso2: country.iso2,
            dialCode: country.dialCode,
            name: country.name,
            displayName: this.getCountryName(country),
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  renderCountryList() {
    const list = this.elements.list;
    list.innerHTML = "";
    this.countryOptionEls = [];
    this.highlightedIndex = -1;

    if (!this.countries.length) return;

    const searchTerm = this.elements.search.value.trim().toLowerCase();
    let items;

    if (searchTerm) {
      items = this.countries
        .filter((country) =>
          this.getCountrySearchValue(country).includes(searchTerm)
        )
        .sort((a, b) => this.compareCountries(a, b));
    } else {
      const preferred = this.preferredIso
        .map((iso) => this.countries.find((country) => country.iso2 === iso))
        .filter(Boolean);
      const remaining = this.countries
        .filter(
          (country) => !preferred.some((pref) => pref.iso2 === country.iso2)
        )
        .sort((a, b) => this.compareCountries(a, b));
      const sortedPreferred = preferred.sort((a, b) =>
        this.compareCountries(a, b)
      );
      items = [...sortedPreferred, ...remaining];
    }

    const fragment = document.createDocumentFragment();
    const addLabel = (text) => {
      const label = document.createElement("li");
      label.className = "country-label";
      label.textContent = text;
      fragment.appendChild(label);
    };

    if (!searchTerm && this.preferredIso.length) {
      const preferredItems = items
        .filter((item) => this.preferredIso.includes(item.iso2))
        .sort((a, b) => this.compareCountries(a, b));
      const otherItems = items
        .filter((item) => !this.preferredIso.includes(item.iso2))
        .sort((a, b) => this.compareCountries(a, b));

      if (preferredItems.length) {
        addLabel(this.t("preferred"));
        preferredItems.forEach((country) =>
          fragment.appendChild(this.createCountryOption(country))
        );
      }

      if (otherItems.length) {
        if (preferredItems.length) {
          addLabel(this.t("allCountries"));
        }
        otherItems.forEach((country) =>
          fragment.appendChild(this.createCountryOption(country))
        );
      } else if (!preferredItems.length) {
        addLabel(this.t("noMatches"));
      }
    } else {
      if (items.length) {
        items.forEach((country) =>
          fragment.appendChild(this.createCountryOption(country))
        );
      } else {
        addLabel(this.t("noMatches"));
      }
    }

    list.appendChild(fragment);
    this.countryOptionEls = Array.from(
      list.querySelectorAll(".country-option")
    );
    this.highlightedIndex = this.countryOptionEls.findIndex(
      (el) => el.getAttribute("data-iso") === this.selectedCountry?.iso2
    );
    if (this.highlightedIndex >= 0) {
      this.updateHighlight();
    }
  }

  createCountryOption(country) {
    const li = document.createElement("li");
    li.className = "country-option";
    li.setAttribute("role", "option");
    li.setAttribute("data-iso", country.iso2);
    if (this.selectedCountry && this.selectedCountry.iso2 === country.iso2) {
      li.classList.add("selected");
      li.setAttribute("aria-selected", "true");
    } else {
      li.setAttribute("aria-selected", "false");
    }

    const localizedName = this.getCountryName(country);
    li.setAttribute("aria-label", `${localizedName}, +${country.dialCode}`);

    li.innerHTML = `
      <span class="country-option__meta">
        <span class="country-option__flag" aria-hidden="true">${isoToFlag(
          country.iso2
        )}</span>
        <span class="country-option__name">${localizedName}</span>
      </span>
      <span class="country-option__dial">+${country.dialCode}</span>
    `;

    return li;
  }

  applyAutocomplete() {
    const attr = this.getAttribute("autocomplete") || "tel";
    this.elements.input.setAttribute("autocomplete", attr);
  }

  applyDisabled() {
    const disabled = this.hasAttribute("disabled");
    if (disabled) {
      this.elements.selector.setAttribute("disabled", "true");
    } else {
      this.elements.selector.removeAttribute("disabled");
    }
    this.elements.input.disabled = disabled;
    if (disabled) {
      this.closeDropdown();
    }
  }

  applyRequired() {
    const required = this.hasAttribute("required");
    if (required) {
      this.elements.input.setAttribute("required", "true");
    } else {
      this.elements.input.removeAttribute("required");
    }
  }
}

export { buildCountryList };

const hasCustomElements =
  typeof window !== "undefined" && !!window.customElements;

if (hasCustomElements && !window.customElements.get("intl-phone-input")) {
  window.customElements.define("intl-phone-input", IntlPhoneInputElement);
}

export default IntlPhoneInputElement;
