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


