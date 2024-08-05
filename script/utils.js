/**
 * Capitalise la première lettre d'une chaîne de caractères.
 * @param {string} string - La chaîne de caractères à modifier.
 * @returns {string} - La chaîne de caractères avec la première lettre en majuscule.
 */
export function strUcFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}