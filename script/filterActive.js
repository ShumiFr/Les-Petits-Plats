import { strUcFirst } from "./utils.js";
import { globalResearchResults, globalSearch } from "./researchResults.js";
import { updateDropdownItems } from "./dropdown.js";

export function createActiveFilter(keyword, items, dropdown, input, dropdownItemContainer, type) {
  let keywordUcFirst = strUcFirst(keyword);

  const activeFiltersContainer = document.querySelector(".active-filters-container");

  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");
  filterDiv.id = `filter-tag-${keyword}`;

  // Création du paragraphe pour le nom du filtre
  const filterName = document.createElement("p");
  filterName.textContent = keywordUcFirst;
  filterDiv.appendChild(filterName);

  // Création du bouton de suppression
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("active-filter-delete");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-xmark");
  deleteButton.appendChild(deleteIcon);

  // Ajout de l'écouteur d'événement sur le bouton de suppression
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const filterToRemove = filterDiv.id.replace("filter-tag-", "");
    const filterIndex = globalResearchResults.advancedFilterResults.findIndex(
      (filter) => filter.item === filterToRemove
    );
    if (filterIndex > -1) {
      globalResearchResults.advancedFilterResults.splice(filterIndex, 1);
      updateDropdownItems(items, dropdown, input, dropdownItemContainer, type);
      globalSearch();
    }
    filterDiv.remove(); // Supprime le div du filtre
  });

  filterDiv.appendChild(deleteButton);

  // Ajout du filterDiv au conteneur
  activeFiltersContainer.appendChild(filterDiv);
}
