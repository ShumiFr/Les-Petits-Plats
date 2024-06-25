import { globalResearchResults, globalSearch } from "./researchResults.js";

export function strUcFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addActiveFilter(keyword) {
  if (!globalResearchResults.advancedFilterResults.includes(keyword)) {
    globalResearchResults.advancedFilterResults.push(keyword);
    globalSearch();
  }
}

export function removeActiveFilter(keyword) {
  const index = globalResearchResults.advancedFilterResults.indexOf(keyword);
  if (index > -1) {
    globalResearchResults.advancedFilterResults.splice(index, 1);
    globalSearch();
  }
}

export function createActiveFilterElement(keyword) {
  let keywordUcFirst = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");
  filterDiv.id = `filter-tag-${keyword}`;
  filterDiv.innerHTML = `
          <p>${keywordUcFirst}</p>
          <button class="filter-delete">
              <i class="fa-solid fa-xmark"></i>
          </button>
        `;

  filterDiv.querySelector(".filter-delete").addEventListener("click", function () {
    filterDiv.remove();
    removeActiveFilter(keyword);
  });

  return filterDiv;
}
