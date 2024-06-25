// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { createCard } from "./card.js";
import { globalSearch, globalResearchResults } from "./researchResults.js";

// Sélection des éléments du DOM
const searchInput = document.querySelector(".form-control");
const searchButton = document.querySelector(".research-btn");
const gallery = document.querySelector(".gallery");
const numberRecipe = document.querySelector(".number-recipe");

/* ---------------------------------------------------------------- Fonctions ---------------------------------------------------------------- */

export function displayRecipes(filteredRecipes = globalResearchResults.filteredRecipes) {
  gallery.innerHTML = "";

  filteredRecipes.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });

  numberRecipe.textContent = `${filteredRecipes.length} recettes`;
}

/* ---------------------------------------------------------- Ecouteurs d'évènements --------------------------------------------------------- */

searchButton.addEventListener("click", () => {
  globalSearch();
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  if (keyword.length >= 3) {
    globalSearch();
  } else {
    displayRecipes(recipes);
  }
});
