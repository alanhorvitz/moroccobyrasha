import { en } from './en';
import { ar } from './ar';
import { fr } from './fr';
import { es } from './es';
import { it } from './it';

export const translations = {
  en,
  ar,
  fr,
  es,
  it,
};

export type TranslationKey = keyof typeof en;