// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { globalResearch, filtersResearch, reconstructDOM } from "./research.js";
import { createActiveFilter } from "./filterActive.js";
import { activeFilters } from "./research.js";

// Sélection des éléments du DOM
const searchInput = document.querySelector(".form-control");
const searchButton = document.querySelector(".research-btn");
const advancedFilters = document.querySelectorAll(".dropdown-item");

/* ---------------------------------------------------------------- Fonctions ---------------------------------------------------------------- */

export function getActiveFilters() {
  return activeFilters;
}

export function displayActiveFilters(keyword, createFilter = true) {
  const filtersContainer = document.querySelector(".active-filters-container");

  // Divisez le mot-clé par des virgules et supprimez les espaces avant et après chaque élément
  const keywords = keyword.split(",").map((word) => word.trim());

  keywords.forEach((word) => {
    if (!activeFilters.includes(word)) {
      if (createFilter) {
        const activeFilterHTML = createActiveFilter(word, activeFilters);
        filtersContainer.appendChild(activeFilterHTML);
      }

      activeFilters.push(word);
    }
  });

  // Filtrer les recettes chaque fois qu'un filtre est ajouté
  const d1 = globalResearch(searchInput, recipes);
  const d2 = filtersResearch(activeFilters, d1);

  // Afficher les recettes filtrées
  reconstructDOM(d2);
}

/* ---------------------------------------------------------- Ecouteurs d'évènements --------------------------------------------------------- */

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();

  displayActiveFilters(keyword, false);
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  if (keyword.length >= 3) {
    const d1 = globalResearch(searchInput, recipes);
    const d2 = filtersResearch(activeFilters, d1);
    reconstructDOM(d2);
  } else {
    // Si la longueur du mot-clé est inférieure à 3, affichez toutes les recettes
    const d2 = filtersResearch(activeFilters, recipes);
    reconstructDOM(d2);
  }
});

// Ajoutez un écouteur d'événements pour chaque filtre avancé
advancedFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const keyword = searchInput.value.toLowerCase();

    // Effectuez une recherche globale avec le mot-clé de la barre de recherche
    const d1 = globalResearch(searchInput, recipes);

    // Appliquez les filtres avancés aux résultats de la recherche globale
    const d2 = filtersResearch(activeFilters, d1);

    // Affichez les recettes filtrées
    reconstructDOM(d2);
  });
});
