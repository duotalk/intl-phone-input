import rawCountries from "./countries.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

const digitsTemplate = "1234567890";

const stripLeadingDialCode = (value, dialCode) => {
  if (!dialCode) return value;
  const digits = String(dialCode).split("");
  let index = 0;
  let pointer = 0;

  let matched = false;

  while (pointer < value.length && index < digits.length) {
    const char = value[pointer];
    if (/\d/.test(char)) {
      if (char === digits[index]) {
        matched = true;
        index += 1;
        pointer += 1;
      } else {
        break;
      }
    } else if (matched && /[\s().-]/.test(char)) {
      pointer += 1;
    } else if (!matched && /[\s-]/.test(char)) {
      pointer += 1;
    } else {
      break;
    }
  }

  return value.slice(pointer);
};

const normalizeMaskValue = (value, dialCode) => {
  if (value === undefined || value === null) return null;
  let raw = String(value).trim();
  if (!raw) return null;

  if (raw.startsWith("+")) {
    raw = raw.slice(1).trimStart();
  }

  raw = stripLeadingDialCode(raw, dialCode).trimStart();
  raw = raw.replace(/^[\s-]+/, "");

  const normalized = raw.replace(/[0-9xX]/g, "#");
  return normalized.includes("#") ? normalized : null;
};

const fillMaskWithDigits = (mask) => {
  if (!mask) return null;
  let index = 0;
  let display = "";
  let digits = "";

  for (const char of mask) {
    if (char === "#") {
      const digit = digitsTemplate[index % digitsTemplate.length];
      index += 1;
      display += digit;
      digits += digit;
    } else {
      display += char;
    }
  }

  if (!digits.length) return null;
  return { display, digits };
};

const sanitizeCountry = (country) => {
  if (!country) return null;

  const isoSource =
    country.iso2 || country.alpha2 || country.alpha_2 || country.code || "";
  const iso2 = String(isoSource).trim().toLowerCase();
  if (!iso2) return null;

  const name = country.name ? String(country.name) : iso2.toUpperCase();

  const dialSource =
    country.dialCode ||
    country.phone_code ||
    country.dail_code ||
    country.callingCode ||
    country.calling_code ||
    "";
  const dialCode = String(dialSource).replace(/[^\d]/g, "");
  if (!dialCode) return null;

  const rawMask =
    country.phone_mask !== undefined && country.phone_mask !== null
      ? country.phone_mask
      : country.mask;
  const mask = normalizeMaskValue(rawMask, dialCode);

  const lengthsBase = Array.isArray(country.lengths)
    ? country.lengths
        .map((len) => parseInt(len, 10))
        .filter((len) => !Number.isNaN(len))
    : [];
  let lengths = Array.from(new Set(lengthsBase));

  let example = country.example ? String(country.example) : null;
  let exampleDisplay = country.exampleDisplay
    ? String(country.exampleDisplay)
    : null;

  const translations = {};
  if (country.translations && typeof country.translations === "object") {
    Object.entries(country.translations).forEach(([key, value]) => {
      if (!value) return;
      const normalizedKey = String(key).toLowerCase();
      const stringValue = String(value);
      translations[normalizedKey] = stringValue;
      const baseKey = normalizedKey.split(/[-_]/)[0];
      if (baseKey && !translations[baseKey]) {
        translations[baseKey] = stringValue;
      }
    });
  }

  const nativeName = country.native || country.nativeName || null;

  if (mask) {
    const filled = fillMaskWithDigits(mask);
    if (filled) {
      if (!exampleDisplay) {
        exampleDisplay = filled.display;
      }
      if (!example) {
        example = `+${dialCode}${filled.digits}`;
      }
      if (!lengths.length) {
        lengths = [filled.digits.length];
      }
    }
  }

  return {
    iso2,
    name,
    dialCode,
    mask,
    example,
    exampleDisplay,
    lengths,
    translations,
    nativeName,
  };
};

const buildBaseCountries = () => {
  const registry = new Map();

  rawCountries.forEach((entry) => {
    const sanitized = sanitizeCountry(entry);
    if (!sanitized) return;
    registry.set(sanitized.iso2, sanitized);
  });

  return Array.from(registry.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const BASE_COUNTRIES = buildBaseCountries();

const getExtras = () => {
  if (typeof window === "undefined") return [];
  const extras = window.IntlPhoneInputCountriesExtra;
  return Array.isArray(extras) ? extras : [];
};

export const defaultCountries = clone(BASE_COUNTRIES);

export function buildCountryList() {
  const merged = new Map();

  clone(BASE_COUNTRIES).forEach((item) => {
    const sanitized = sanitizeCountry(item);
    if (sanitized) {
      merged.set(sanitized.iso2, sanitized);
    }
  });

  getExtras().forEach((item) => {
    const sanitized = sanitizeCountry(item);
    if (!sanitized) return;
    const existing = merged.get(sanitized.iso2) || { iso2: sanitized.iso2 };
    merged.set(sanitized.iso2, {
      ...existing,
      ...sanitized,
      lengths: sanitized.lengths.length
        ? sanitized.lengths
        : existing.lengths || [],
      mask: sanitized.mask || existing.mask || null,
      example: sanitized.example || existing.example || null,
      exampleDisplay:
        sanitized.exampleDisplay ||
        sanitized.example ||
        existing.exampleDisplay ||
        existing.example ||
        null,
      translations: {
        ...(existing.translations || {}),
        ...(sanitized.translations || {}),
      },
      nativeName: sanitized.nativeName || existing.nativeName || null,
    });
  });

  return Array.from(merged.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export default defaultCountries;
