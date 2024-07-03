import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { updateDropdown } from "./dropdown.js";
import { strUcFirst } from "./filterActive.js";

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

  const ingredients = d2.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const capitalizedIngredient = strUcFirst(ingredient.ingredient); // Capitalise l'ingrédient
      if (!acc.includes(capitalizedIngredient)) {
        acc.push(capitalizedIngredient); // Ajoute l'ingrédient s'il n'est pas déjà présent
      }
    });
    return acc;
  }, []);

  const utensils = d2.reduce((acc, recipe) => {
    recipe.ustensils.forEach((utensil) => {
      const capitalizedUtensil = strUcFirst(utensil); // Capitalise l'ustensile
      if (!acc.includes(capitalizedUtensil)) {
        acc.push(capitalizedUtensil); // Ajoute l'ustensile s'il n'est pas déjà présent
      }
    });
    return acc;
  }, []);

  const appliances = d2.reduce((acc, recipe) => {
    const capitalizedAppliance = strUcFirst(recipe.appliance); // Capitalise l'appareil
    if (!acc.includes(capitalizedAppliance)) {
      acc.push(capitalizedAppliance); // Ajoute l'appareil s'il n'est pas déjà présent
    }
    return acc;
  }, []);

  updateDropdown("Ingrédients", ingredients);
  updateDropdown("Ustensiles", utensils);
  updateDropdown("Appareils", appliances);

  reconstructDOM(d2);
}

searchInput.addEventListener("input", () => {
  const keybord = searchInput.value.toLowerCase();

  if (keybord.length >= 3) {
    globalSearch();
  }
  const d2 = filtersResearch(globalResearchResults.advancedFilterResults, recipes);
  console.log(globalResearchResults.advancedFilterResults);
  reconstructDOM(d2);
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
