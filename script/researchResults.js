import { recipes } from "./recipes.js";
import { createRecipeDivElement } from "./card.js";
import { updateDropdown } from "./libs.js";
import { strUcFirst } from "./utils.js";

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
 * @param {Array} recipes - La liste des recettes.
 * @returns {Array} - Les recettes filtrées.
 */
export function filterRecipesByKeyword(keyword, recipes) {
  const lowerCaseKeyword = keyword.toLowerCase();

  return recipes.filter((recipe) => {
    const isInName = recipe.name.toLowerCase().includes(lowerCaseKeyword);
    const isInDescription = recipe.description.toLowerCase().includes(lowerCaseKeyword);
    const isInIngredients = recipe.ingredients.some((ingredient) => {
      return ingredient.ingredient.toLowerCase().includes(lowerCaseKeyword);
    });

    return isInName || isInDescription || isInIngredients;
  });
}

/**
 * Filtre les recettes en fonction de critères spécifiques.
 * @param {Array} filterCriteria - Les critères de filtrage.
 * @param {Array} recipes - La liste des recettes.
 * @returns {Array} - Les recettes filtrées.
 */
export function filterRecipesByCriteria(filterCriteria, recipes) {
  return recipes.filter((recipe) => {
    console.log("filterCriteria", filterCriteria)
    return filterCriteria.every((criteria) => {
      const filter = criteria.item.toLowerCase();
      let matchesFilter = false;

      switch (criteria.type) {
        case "ingredient":
          matchesFilter = recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(filter)
          );
          break;
        case "utensil":
          matchesFilter = recipe.ustensils.some((utensil) =>
            utensil.toLowerCase().includes(filter)
          );
          break;
        case "appliance":
          matchesFilter = recipe.appliance.toLowerCase().includes(filter);
          break;
        default:
          break;
      }

      return matchesFilter;
    });
  });
}

/**
 * Reconstruit le DOM pour afficher les recettes.
 * @param {Array} recipes - La liste des recettes à afficher.
 */
export function reconstructDOM(recipes) {
  const gallery = document.querySelector(".gallery");
  const numberRecipe = document.querySelector(".number-recipe");
  gallery.innerHTML = "";

  if (recipes.length === 0) {
    const errorMessage = `<div class="no-recipes">Aucune recette ne contient '${searchInput.value}', vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>`;
    gallery.innerHTML = errorMessage;
    numberRecipe.textContent = "0 recettes";
  } else {
    recipes.forEach((recipe) => {
      const cardHTML = createRecipeDivElement(recipe);
      gallery.innerHTML += cardHTML;
    });

    numberRecipe.textContent = `${recipes.length} recettes`;
  }
}

/**
 * Exécute une recherche globale sur les recettes.
 */
export function performGlobalSearch() {
  globalResearchResults.searchBarResults = searchInput.value.toLowerCase();

  let searchResults;
  if (globalResearchResults.searchBarResults.length >= 3) {
    searchResults = filterRecipesByKeyword(globalResearchResults.searchBarResults, recipes);
  } else {
    searchResults = recipes;
  }

  searchResults = filterRecipesByCriteria(globalResearchResults.advancedFilterResults, searchResults);

  const ingredients = searchResults.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const capitalizedIngredient = strUcFirst(ingredient.ingredient);
      if (!acc.includes(capitalizedIngredient)) {
        acc.push(capitalizedIngredient);
      }
    });
    return acc;
  }, []);

  const utensils = searchResults.reduce((acc, recipe) => {
    recipe.ustensils.forEach((utensil) => {
      const capitalizedUtensil = strUcFirst(utensil);
      if (!acc.includes(capitalizedUtensil)) {
        acc.push(capitalizedUtensil);
      }
    });
    return acc;
  }, []);

  const appliances = searchResults.reduce((acc, recipe) => {
    const capitalizedAppliance = strUcFirst(recipe.appliance);
    if (!acc.includes(capitalizedAppliance)) {
      acc.push(capitalizedAppliance);
    }
    return acc;
  }, []);

  updateDropdown("Ingrédients", ingredients);
  updateDropdown("Ustensiles", utensils);
  updateDropdown("Appareils", appliances);

  reconstructDOM(searchResults);
}

/* ----------------- Appels des fonctions ----------------- */

// Exécute une recherche globale lors de la saisie dans le champ de recherche
searchInput.addEventListener("input", () => {
  performGlobalSearch();
});
