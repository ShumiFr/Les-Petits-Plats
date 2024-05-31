import { recipes } from "./recipes.js";
import { createCard } from "./card.js";

const searchInput = document.querySelector(".form-control");
const searchButton = document.querySelector(".research-btn");
const gallery = document.querySelector(".gallery");

// Liste des mots à ignorer
const ignoreWords = ["de", "à", "et", "en", "d'", "au"];

function displayRecipes(recipes) {
  gallery.innerHTML = ""; // Videz la galerie

  recipes.forEach((recipe) => {
    const cardHTML = createCard(recipe);
    gallery.innerHTML += cardHTML;
  });
}

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();
  const keywordParts = keyword.split(" ");

  const filteredRecipes = recipes.filter((recipe) => {
    return keywordParts.every((part) => {
      // Si le mot fait partie des mots à ignorer, retournez true
      if (ignoreWords.includes(part)) {
        return true;
      }

      // Sinon, vérifiez si le mot est inclus dans les ingrédients
      return recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(part);
      });
    });
  });

  displayRecipes(filteredRecipes);
});
