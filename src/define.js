import IntlPhoneInputElement from "./intl-phone-input.js";

export function defineIntlPhoneInput(tagName = "intl-phone-input") {
  if (typeof window === "undefined" || !window.customElements) {
    return IntlPhoneInputElement;
  }

  if (!window.customElements.get(tagName)) {
    window.customElements.define(tagName, IntlPhoneInputElement);
  }

  return IntlPhoneInputElement;
}

export default defineIntlPhoneInput;
