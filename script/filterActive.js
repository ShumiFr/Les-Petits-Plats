import { globalResearch, filtersResearch, reconstructDOM } from "./research.js";
import { recipes } from "./recipes.js";
import { getActiveFilters } from "./researchBar.js";

export function strUcFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeActiveFilter(keyword) {
  const activeFilters = getActiveFilters();
  const index = activeFilters.indexOf(keyword);
  if (index > -1) {
    activeFilters.splice(index, 1);
  }

  const filterTag = document.getElementById(`filter-tag-${keyword}`);
  if (filterTag) {
    filterTag.remove();
  }

  const dropdownFilter = document.querySelector(`[data-filter="${keyword}"]`);

  if (dropdownFilter) {
    dropdownFilter.remove();
  }

  const d1 = globalResearch(document.querySelector(".form-control"), recipes);
  const d2 = filtersResearch(activeFilters, d1);
  reconstructDOM(d2);
}

export function createActiveFilter(keyword) {
  let keywordUcFirst = strUcFirst(keyword);

  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");

  filterDiv.id = `filter-tag-${keyword}`;
  filterDiv.innerHTML = `
          <p>${keywordUcFirst}</p>
          <button class="filter-delete">
              <i class="fa-solid fa-xmark"></i>
          </button>
        `;

  filterDiv
    .querySelector(".filter-delete")
    .addEventListener("click", function () {
      filterDiv.remove();
      removeActiveFilter(keyword);
    });

  return filterDiv;
}
