export type Lang = "kk" | "ru" | "en";
export type L = Record<Lang, string>;

export function tx(text: L, lang: Lang): string {
  return text[lang];
}
