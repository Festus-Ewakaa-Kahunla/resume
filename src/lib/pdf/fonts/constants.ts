const SANS_SERIF_ENGLISH_FONT_FAMILIES = [
  "Roboto",
  "Lato",
  "Montserrat",
  "OpenSans",
  "Raleway",
] as const;

const SERIF_ENGLISH_FONT_FAMILIES = [
  "Caladea",
  "Lora",
  "RobotoSlab",
  "PlayfairDisplay",
  "Merriweather",
] as const;

export const ENGLISH_FONT_FAMILIES = [
  ...SANS_SERIF_ENGLISH_FONT_FAMILIES,
  ...SERIF_ENGLISH_FONT_FAMILIES,
];

export type FontFamily = (typeof ENGLISH_FONT_FAMILIES)[number];

export const FONT_FAMILY_TO_STANDARD_SIZE_IN_PT: Record<FontFamily, number> = {
  Roboto: 12,
  Lato: 12,
  Montserrat: 11,
  OpenSans: 12,
  Raleway: 11,
  Caladea: 12,
  Lora: 12,
  RobotoSlab: 11,
  PlayfairDisplay: 11,
  Merriweather: 11,
};

export const FONT_FAMILY_TO_DISPLAY_NAME: Record<FontFamily, string> = {
  Roboto: "Roboto",
  Lato: "Lato",
  Montserrat: "Montserrat",
  OpenSans: "Open Sans",
  Raleway: "Raleway",
  Caladea: "Caladea",
  Lora: "Lora",
  RobotoSlab: "Roboto Slab",
  PlayfairDisplay: "Playfair Display",
  Merriweather: "Merriweather",
};
