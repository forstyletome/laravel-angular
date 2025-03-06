export interface Translations {
  [languageCode: string]: {
    [key: string]: string | { [key: string]: string };
  };
}
