// Setup Block
import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { updateDropdown } from "./dropdown.js";
import { strUcFirst } from "./utils.js";

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
export function filtersResearch(filters, d1) {
  const results = [];
  for (let i = 0; i < d1.length; i++) {
    const recipe = d1[i];
    let matchesAllFilters = true;
    for (let j = 0; j < filters.length; j++) {
      const filterObj = filters[j];
      const filter = filterObj.item.toLowerCase();
      let isInFilter = false;
      switch (filterObj.type) {
        case "ingredient":
          for (let k = 0; k < recipe.ingredients.length; k++) {
            if (recipe.ingredients[k].ingredient.toLowerCase().includes(filter)) {
              isInFilter = true;
              break;
            }
          }
          break;
        case "utensil":
          for (let k = 0; k < recipe.ustensils.length; k++) {
            if (recipe.ustensils[k].toLowerCase().includes(filter)) {
              isInFilter = true;
              break;
            }
          }
          break;
        case "appliance":
          isInFilter = recipe.appliance.toLowerCase().includes(filter);
          break;
        default:
          matchesAllFilters = false;
          break;
      }
      if (!isInFilter) {
        matchesAllFilters = false;
        break;
      }
    }
    if (matchesAllFilters) {
      results.push(recipe);
    }
  }
  return results;
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

// Code Block
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

  // Sans ça
  updateDropdown("Ingrédients", ingredients);
  updateDropdown("Ustensiles", utensils);
  updateDropdown("Appareils", appliances);

  reconstructDOM(d2);
}
