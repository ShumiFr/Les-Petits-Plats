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

// Mots à ignorer lors de la recherche
const ignoreWords = ["de", "à", "et", "en", "d'", "au"];

// Fonction qui prend un tableau de recettes, vide la gallerie, crée une carte pour chaque recette et les affiche dans la gallerie puis met a jour le nombre de recettes affichées
function displayRecipes(recipes) {
  gallery.innerHTML = ""; // Videz la galerie

  recipes.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });

  numberRecipe.textContent = `${recipes.length} recettes`;
}

// Fonction qui vérifie si tous les filtres actifs sont présents dans le nom ou dans l'un des ingrédients de la recette
function filterRecipes() {
  return recipes.filter((recipe) => {
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
}

// Fonction qui créé un filtre actif pour chaque mot clé donné, les ajoutes à la liste des filtres actifs et les affiches dans le conteneur des filtres actifs
function displayActiveFilters(keyword) {
  const filtersContainer = document.querySelector(".active-filters-container");
  const activeFilterHTML = createActiveFilter(
    keyword,
    activeFilters,
    filterRecipes,
    displayRecipes
  );
  filtersContainer.appendChild(activeFilterHTML);

  activeFilters.push(keyword);
}

// Ecouteur d'evenement au bouton de recherche. Lorsqu'on clique sur le bouton de recherche, on récupère la valeur de l'input de recherche, on l'affiche comme un filtre actif, on filtre les recettes et on les affiche
searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();

  displayActiveFilters(keyword);

  const filteredRecipes = filterRecipes();

  displayRecipes(filteredRecipes);
  console.log(activeFilters);
});
