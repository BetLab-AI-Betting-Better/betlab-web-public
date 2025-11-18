/**
 * Sport Type Enum
 * Currently only Football is supported
 */

export enum SportType {
  FOOTBALL = 'football',
}

export const SportTypeConfig = {
  [SportType.FOOTBALL]: {
    name: 'Football',
    icon: '⚽',
    slug: 'football',
  },
} as const;

export type SportTypeKey = keyof typeof SportType;
