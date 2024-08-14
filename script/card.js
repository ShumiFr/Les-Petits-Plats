import { recipes } from "./recipes.js";

// Sélectionne l'élément DOM du nombre de recettes
const divNumberOfRecipes$ = document.querySelector(".number-recipe");
const divGallery$ = document.querySelector(".gallery");

/* ----------------- Création des fonctions ----------------- */

/**
 * Crée une carte pour une recette.
 * @param {Object} recipe - La recette.
 * @returns {string} - La carte HTML.
 */
export function createRecipeDivElement(recipe) {
  let ingredientsHTML = "";

  for (let ingredient of recipe.ingredients) {
    ingredientsHTML += `
      <div class="ingredient">
          <h4>${ingredient.ingredient}</h4>
          <p>${
            ingredient.quantity
              ? ingredient.quantity + (ingredient.unit ? " " + ingredient.unit : "")
              : "-"
          }</p>
      </div>
    `;
  }

  return `
    <div class="card">
      <img src="../assets/recette/${recipe.image}" class="card-img-top" alt="${recipe.name}" />
      <div class="time">${recipe.time} min</div>
      <div class="card-body">
        <div class="card-text">
          <h2>${recipe.name}</h2>
          <div class="card-recipe">
            <h3>Recette</h3>
            <p>${recipe.description}</p>
          </div>
          <div class="card-ingredient">
            <h3>Ingrédients</h3>
            <div class="ingredient-gallery">
              ${ingredientsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addRecipeToDOM(recipe) {
  const cardHTML = createRecipeDivElement(recipe);
  divGallery$.innerHTML += cardHTML;
}

/* ----------------- Appels des fonctions ----------------- */

// Créer une carte pour chaque recette
recipes.forEach(addRecipeToDOM);

divNumberOfRecipes$.textContent = `${recipes.length} recettes`;
