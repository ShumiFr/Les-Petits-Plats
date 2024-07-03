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
