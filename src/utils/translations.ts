export const translationDictionary: Record<string, string[]> = {
    // Português : [Inglês, Alemão]
    //"máquina": ["machine", "maschine"],
    "receita": ["recipe", "rezept"],
    "erro": ["error", "fehler"],
    "produção": ["production", "produktion"],
    "estado": ["state", "zustand"],
    };

/**
 * Recebe uma palavra-chave e retorna um array com ela e suas traduções.
 */
export function getTranslations(keyword: string): string[] {
    const lower = keyword.toLowerCase();
    if (translationDictionary[lower]) {
        return [lower, ...translationDictionary[lower]];
    }
    return [lower];
}

export { };