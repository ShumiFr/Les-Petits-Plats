import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { updateDropdown } from "./dropdown.js";
import { strUcFirst } from "./utils.js";

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
    return filters.every((filterObj) => {
      const filter = filterObj.item.toLowerCase();
      let isInFilter = false;
      switch (filterObj.type) {
        case "ingredient":
          isInFilter = recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(filter)
          );
          break;
        case "utensil":
          isInFilter = recipe.ustensils.some((ustensil) => ustensil.toLowerCase().includes(filter));
          break;
        case "appliance":
          isInFilter = recipe.appliance.toLowerCase().includes(filter);
          break;
        default:
          break;
      }
      return isInFilter;
    });
  });
}

export function reconstructDOM(d2) {
  const gallery = document.querySelector(".gallery");
  const numberRecipe = document.querySelector(".number-recipe");
  gallery.innerHTML = "";

  if (d2.length === 0) {
    const errorMessage = `<div class="no-recipes">Aucune recette ne contient '${searchInput.value}', vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>`;
    gallery.innerHTML = errorMessage;
    numberRecipe.textContent = "0 recettes";
  } else {
    // Sinon, construisez le DOM avec les recettes trouvées
    d2.forEach((recipe) => {
      const cardHTML = createCard(recipe);
      gallery.innerHTML += cardHTML;
    });

    numberRecipe.textContent = `${d2.length} recettes`;
  }
}

searchInput.addEventListener("input", () => {
  globalSearch();
});

export function globalSearch() {
  globalResearchResults.searchBarResults = searchInput.value.toLowerCase();

  let d1;
  if (globalResearchResults.searchBarResults.length >= 3) {
    d1 = globalResearch(globalResearchResults.searchBarResults, recipes);
  } else {
    d1 = recipes;
  }

  const d2 = filtersResearch(globalResearchResults.advancedFilterResults, d1);

  const ingredients = d2.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const capitalizedIngredient = strUcFirst(ingredient.ingredient);
      if (!acc.includes(capitalizedIngredient)) {
        acc.push(capitalizedIngredient);
      }
    });
    return acc;
  }, []);

  const utensils = d2.reduce((acc, recipe) => {
    recipe.ustensils.forEach((utensil) => {
      const capitalizedUtensil = strUcFirst(utensil);
      if (!acc.includes(capitalizedUtensil)) {
        acc.push(capitalizedUtensil);
      }
    });
    return acc;
  }, []);

  const appliances = d2.reduce((acc, recipe) => {
    const capitalizedAppliance = strUcFirst(recipe.appliance);
    if (!acc.includes(capitalizedAppliance)) {
      acc.push(capitalizedAppliance);
    }
    return acc;
  }, []);

  updateDropdown("Ingrédients", ingredients);
  updateDropdown("Ustensiles", utensils);
  updateDropdown("Appareils", appliances);

  reconstructDOM(d2);
}
