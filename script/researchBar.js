import { recipes } from "./recipes.js";
import { globalResearch, filtersResearch, reconstructDOM } from "./research.js";
import { createActiveFilter } from "./filterActive.js";

const searchInput = document.querySelector(".form-control");
const advancedFilters = document.querySelectorAll(".dropdown-item");
const filtersContainer = document.querySelector(".active-filters-container");

export const globalResearchResults = {
  searchBarResult: "",
  advancedFiltersResults: [],
};

function consoleLogResults(results) {
  console.log("Results", results);
}

function updateGlobalResearchResults() {
  globalResearchResults.searchBarResult = searchInput.value.toLowerCase();
  const d1 = globalResearch(globalResearchResults.searchBarResult, recipes);
  const d2 = filtersResearch(globalResearchResults.advancedFiltersResults, d1);
  reconstructDOM(d2);
}

function addAdvancedFilter(filterValue) {
  if (!globalResearchResults.advancedFiltersResults.includes(filterValue)) {
    globalResearchResults.advancedFiltersResults.push(filterValue);
    updateGlobalResearchResults();
    consoleLogResults(globalResearchResults);
  }
}

export function displayActiveFilters(keyword, createFilter = true) {
  const keywords = keyword.split(",").map((word) => word.trim());

  keywords.forEach((word) => {
    if (!globalResearchResults.advancedFiltersResults.includes(word)) {
      if (createFilter) {
        const activeFilterHTML = createActiveFilter(
          word,
          globalResearchResults.advancedFiltersResults
        );
        filtersContainer.appendChild(activeFilterHTML);
      }
      globalResearchResults.advancedFiltersResults.push(word);
    }
  });

  console.log("Global Research Results", globalResearchResults);
  updateGlobalResearchResults();
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  if (keyword.length >= 3) {
    updateGlobalResearchResults();
    consoleLogResults(globalResearchResults);
  } else {
    const d2 = filtersResearch(globalResearchResults.advancedFiltersResults, recipes);
    reconstructDOM(d2);
    consoleLogResults(globalResearchResults);
  }
});
