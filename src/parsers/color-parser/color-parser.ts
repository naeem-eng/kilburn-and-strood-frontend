export type ColorName =
  | "medium-gray"
  | "light-gray"
  | "dark-gray"
  | "bright-red"
  | "dark-red"
  | "yellow"
  | "dark-yellow"
  | "bright-green"
  | "dark-green"
  | "light-blue"
  | "dark-blue"
  | "light-purple"
  | "dark-purple";

  
export const colorMap: Record<ColorName, string> = {
  "medium-gray": "var(--color-medium-gray)",
  "light-gray": "var(--color-light-gray)",
  "dark-gray": "var(--color-dark-gray)",
  "bright-red": "var(--color-bright-red)",
  "dark-red": "var(--color-dark-red)",
  "yellow": "var(--color-yellow)",
  "dark-yellow": "var(--color-dark-yellow)",
  "bright-green": "var(--color-bright-green)",
  "dark-green": "var(--color-dark-green)",
  "light-blue": "var(--color-light-blue)",
  "dark-blue": "var(--color-dark-blue)",
  "light-purple": "var(--color-light-purple)",
  "dark-purple": "var(--color-dark-purple)",
};


export function colorParser(color: string | null | undefined) {
  if (!color) return null;
  return colorMap[color as ColorName] || null;
}



// WCAG 1.4.3: these brand colours are below 4.5:1 as text on white / light-gray,
// so text on light backgrounds uses the darker partner from the same palette.
// bright-red is the primary brand colour and is kept as-is by design.
const textSafeMap: Record<string, ColorName> = {
  "yellow": "dark-yellow",
  "light-blue": "dark-blue",
  "light-purple": "dark-purple",
  "bright-green": "dark-green",
  "light-green": "dark-green",
  "light-gray": "dark-gray",
};

/** Colour name that is safe to use as text on a white / light-gray background. */
export function textSafeColor(color: string | null | undefined): string {
  if (!color) return "dark-gray";
  return textSafeMap[color] || color;
}

/** Like colorParser, but returns the text-safe variant (for --dynamic-text-colors). */
export function textColorParser(color: string | null | undefined) {
  return colorParser(textSafeColor(color));
}

/** Text colour class for content placed on a brand-colour fill (white fails on the bright fills). */
export function textOnFillClass(color: string | null | undefined): string {
  if (color === "bright-red") return "text-black";
  if (color && /^(yellow|light-|bright-green)/.test(color)) return "text-dark-gray";
  return "text-white";
}
