import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { createActiveFilter } from "./filterActive.js";

const searchInput = document.querySelector(".form-control");
const searchButton = document.querySelector(".research-btn");
const gallery = document.querySelector(".gallery");
const numberRecipe = document.querySelector(".number-recipe");
const activeFilters = [];

// Liste des mots à ignorer
const ignoreWords = ["de", "à", "et", "en", "d'", "au"];

function displayRecipes(recipes) {
  gallery.innerHTML = ""; // Videz la galerie

  recipes.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });

  numberRecipe.textContent = `${recipes.length} recettes`;
}

function displayActiveFilters(keyword) {
  const filtersContainer = document.querySelector(".active-filters-container");
  const activeFilterHTML = createActiveFilter(keyword);
  filtersContainer.appendChild(activeFilterHTML);

  activeFilters.push(keyword);
}

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();

  displayActiveFilters(keyword);

  const filteredRecipes = recipes.filter((recipe) => {
    return activeFilters.every((filter) => {
      const filterParts = filter.split(" ");

      return filterParts.every((part) => {
        if (ignoreWords.includes(part)) {
          return true;
        }

        const isInName = recipe.name.toLowerCase().includes(part);
        const isInIngredient = recipe.ingredients.some((ingredient) => {
          return ingredient.ingredient.toLowerCase().includes(part);
        });

        return isInName || isInIngredient;
      });
    });
  });

  displayRecipes(filteredRecipes);
});
