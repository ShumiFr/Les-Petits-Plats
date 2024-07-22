// Setup Block
import { recipes } from "./recipes.js";

const searchInput = document.querySelector(".form-control");

// Setup Block
export const globalResearchResults = {
  searchBarResults: "",
  advancedFilterResults: [],
};

// Code Block
export function globalResearch(keyword, data) {
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

// Code Block
export function globalSearch() {
  globalResearchResults.searchBarResults = searchInput.value.toLowerCase();

  let d1;
  if (globalResearchResults.searchBarResults.length >= 3) {
    d1 = globalResearch(globalResearchResults.searchBarResults, recipes);
  } else {
    d1 = recipes;
  }
}

globalSearch();
