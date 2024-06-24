import { createCard } from "./card.js";
export let activeFilters = [];

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
