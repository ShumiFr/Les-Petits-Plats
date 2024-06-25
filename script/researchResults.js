import { recipes } from "./recipes.js";
import { createCard } from "./card.js";

const searchInput = document.querySelector(".form-control");

export const globalResearchResults = {
  searchBarResults: "",
  advancedFilterResults: [],
};

export function globalResearch(keyword, data) {
  return data.filter((recipe) => {
    const isInName = recipe.name.toLowerCase().includes(keyword);
    const isInDescription = recipe.description.toLowerCase().includes(keyword);
    const isInIngredient = recipe.ingredients.some((ingredient) => {
      return ingredient.ingredient.toLowerCase().includes(keyword);
    });

    return isInName || isInIngredient || isInDescription;
  });
}

export function filtersResearch(filters, d1) {
  return d1.filter((recipe) => {
    return filters.every((filter) => {
      const isInName = recipe.name.toLowerCase().includes(filter);
      const isInDescription = recipe.description.toLowerCase().includes(filter);
      const isInIngredient = recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(filter);
      });
      const isInUstensils = recipe.ustensils.some((ustensil) => {
        return ustensil.toLowerCase().includes(filter);
      });
      const isInAppliances = recipe.appliance.toLowerCase().includes(filter);

      return isInName || isInIngredient || isInDescription || isInUstensils || isInAppliances;
    });
  });
}

export function reconstructDOM(d2) {
  const gallery = document.querySelector(".gallery");
  const numberRecipe = document.querySelector(".number-recipe");
  gallery.innerHTML = "";

  d2.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });

  numberRecipe.textContent = `${d2.length} recettes`;
}

export function globalSearch() {
  globalResearchResults.searchBarResults = searchInput.value.toLowerCase();

  const d1 = globalResearch(globalResearchResults.searchBarResults, recipes);
  const d2 = filtersResearch(globalResearchResults.advancedFilterResults, d1);

  console.log("GlovalResearchResults", globalResearchResults);

  reconstructDOM(d2);
}

searchInput.addEventListener("input", () => {
  const keybord = searchInput.value.toLowerCase();

  if (keybord.length >= 3) {
    globalSearch();
  } else {
    const d2 = filtersResearch(globalResearchResults.advancedFilterResults, recipes);
    reconstructDOM(d2);
  }
});

document.querySelectorAll(".dropdown-item").forEach((filter) => {
  filter.addEventListener("click", (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    if (!globalResearchResults.advancedFilterResults.includes(filterValue)) {
      globalResearchResults.advancedFilterResults.push(filterValue);
      globalSearch();
    }
  });
});
