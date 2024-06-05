// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { createActiveFilter } from "./filterActive.js";

// Sélection des éléments du DOM
const searchInput = document.querySelector(".form-control");
const searchButton = document.querySelector(".research-btn");
const gallery = document.querySelector(".gallery");
const numberRecipe = document.querySelector(".number-recipe");
const activeFilters = [];

/* ---------------------------------------------------------------- Fonctions ---------------------------------------------------------------- */

function displayRecipes(recipes) {
  gallery.innerHTML = ""; // Videz la galerie

  recipes.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });

  numberRecipe.textContent = `${recipes.length} recettes`;
}

function filterRecipes() {
  return recipes.filter((recipe) => {
    return activeFilters.every((filter) => {
      const isInName = recipe.name
        .toLowerCase()
        .split(" ")
        .some((word) => word.includes(filter));
      const isInDescription = recipe.description
        .toLowerCase()
        .split(" ")
        .some((word) => word.includes(filter));
      const isInIngredient = recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient
          .toLowerCase()
          .split(" ")
          .some((word) => word.includes(filter));
      });

      return isInName || isInIngredient || isInDescription;
    });
  });
}

function displayActiveFilters(keyword) {
  const filtersContainer = document.querySelector(".active-filters-container");

  // Divisez le mot-clé par des virgules et supprimez les espaces avant et après chaque élément
  const keywords = keyword.split(",").map((word) => word.trim());

  keywords.forEach((word) => {
    if (!activeFilters.includes(word)) {
      const activeFilterHTML = createActiveFilter(
        word,
        activeFilters,
        filterRecipes,
        displayRecipes
      );
      filtersContainer.appendChild(activeFilterHTML);

      activeFilters.push(word);
    }
  });
}

/* ---------------------------------------------------------- Ecouteurs d'évènements --------------------------------------------------------- */

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();

  displayActiveFilters(keyword);

  const filteredRecipes = filterRecipes();

  displayRecipes(filteredRecipes);
  console.log(activeFilters);
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  if (keyword.length >= 3) {
    const filteredRecipes = recipes.filter((recipe) => {
      const isInName = recipe.name.toLowerCase().includes(keyword);
      const isInDescription = recipe.description.toLowerCase().includes(keyword);
      const isInIngredient = recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(keyword);
      });

      return isInName || isInIngredient || isInDescription;
    });

    displayRecipes(filteredRecipes);
  } else if (keyword.length <= 3) {
    displayRecipes(recipes);
  }
});
