/**
 * Hilfsmodule zum Umgang mit Text in der Amiga-Umgebung
 */

/**
 * Ersetzt "ß" durch "ss" für bessere Kompatibilität mit der Topaz-Schriftart
 * 
 * @param {string} text - Der Text mit möglicherweise "ß"-Zeichen
 * @returns {string} - Der Text mit "ss" anstelle von "ß"
 */
export function replaceEszett(text) {
  return text.replace(/ß/g, 'ss');
}

/**
 * Bereitet deutschen Text für die Amiga-Anzeige vor
 * 
 * @param {string} text - Der ursprüngliche Text
 * @returns {string} - Für Amiga optimierter Text
 */
export function prepareGermanText(text) {
  return replaceEszett(text);
}

/**
 * Erzeugt ein Objekt mit HTML-Attributen für deutsche Texte
 * die in der Topaz-Schriftart angezeigt werden
 * 
 * @returns {Object} - HTML-Attribute für bessere Darstellung
 */
export function germanTextAttrs() {
  return {
    class: 'german-text'
  };
}
