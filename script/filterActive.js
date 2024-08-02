import { strUcFirst } from "./utils.js";
import { globalResearchResults, performGlobalSearch } from "./researchResults.js";
import { refreshDropdownItems } from "./dropdown.js";

/* ----------------- Création des fonctions ----------------- */

/**
 * Crée un filtre actif et l'ajoute au conteneur des filtres actifs.
 * @param {string} keyword - Le mot-clé du filtre.
 * @param {Array} items - La liste des éléments.
 * @param {HTMLElement} dropdown - Le menu déroulant.
 * @param {HTMLInputElement} input - Le champ de saisie.
 * @param {HTMLElement} dropdownItemContainer - Le conteneur des éléments du menu déroulant.
 * @param {string} type - Le type de filtre.
 */
export function createActiveFilter(keyword, items, dropdown, input, dropdownItemContainer, type) {
  const keywordUcFirst = strUcFirst(keyword);
  const activeFiltersContainer = document.querySelector(".active-filters-container");

  // Créer le conteneur du filtre actif
  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");
  filterDiv.id = `filter-tag-${keyword}`;

  // Ajouter le nom du filtre
  const filterName = document.createElement("p");
  filterName.textContent = keywordUcFirst;
  filterDiv.appendChild(filterName);

  // Créer le bouton de suppression
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("active-filter-delete");
  deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  // Ajouter l'écouteur d'événement pour le bouton de suppression
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const filterToRemove = filterDiv.id.replace("filter-tag-", "");
    const filterIndex = globalResearchResults.advancedFilterResults.findIndex(
      (filter) => filter.item === filterToRemove
    );
    if (filterIndex > -1) {
      globalResearchResults.advancedFilterResults.splice(filterIndex, 1);
      refreshDropdownItems(items, dropdown, input, dropdownItemContainer, type);
      performGlobalSearch();
    }
    filterDiv.remove(); // Supprime le div du filtre
  });

  filterDiv.appendChild(deleteButton);
  activeFiltersContainer.appendChild(filterDiv); // Ajouter le filtre actif au conteneur
}