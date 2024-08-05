import { recipes } from "./recipes.js";

// Sélectionne l'élément DOM du champ de recherche
const searchInput = document.querySelector(".form-control");

// Objet global pour stocker les résultats de recherche
export const globalResearchResults = {
  searchBarResults: "",
  advancedFilterResults: [],
};

/* ----------------- Création des fonctions ----------------- */

/**
 * Filtre les recettes en fonction d'un mot-clé.
 * @param {string} keyword - Le mot-clé de recherche.
 * @param {Array} data - La liste des recettes.
 * @returns {Array} - Les recettes filtrées.
 */
export function filterRecipesByKeyword(keyword, data) {
  const results = [];
  for (let i = 0; i < data.length; i++) {
    const recipe = data[i];
    const isInName = recipe.name.toLowerCase().includes(keyword);
    const isInDescription = recipe.description.toLowerCase().includes(keyword);
    let isInIngredient = false;
    for (let j = 0; j < recipe.ingredients.length; j++) {
      if (recipe.ingredients[j].ingredient.toLowerCase().includes(keyword)) {
        isInIngredient = true;
        break;
      }
    }

    if (isInName || isInIngredient || isInDescription) {
      results.push(recipe);
    }
  }
  return results;
}

/**
 * Filtre les recettes en fonction de critères spécifiques.
 * @param {Array} filterCriteria - Les critères de filtrage.
 * @param {Array} recipes - La liste des recettes.
 * @returns {Array} - Les recettes filtrées.
 */
export function performGlobalSearch() {
  globalResearchResults.searchBarResults = searchInput.value.toLowerCase();

  let d1;
  if (globalResearchResults.searchBarResults.length >= 3) {
    d1 = filterRecipesByKeyword(globalResearchResults.searchBarResults, recipes);
  } else {
    d1 = recipes;
  }
}

/* ----------------- Appels des fonctions ----------------- */

// Appel de la fonction globalSearch
performGlobalSearch();
