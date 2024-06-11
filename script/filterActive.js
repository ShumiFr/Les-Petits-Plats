export function strUcFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeActiveFilter(keyword, activeFilters, filterRecipes, displayRecipes) {
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

  const filteredRecipes = filterRecipes();
  displayRecipes(filteredRecipes);
}

export function createActiveFilter(keyword, activeFilters, filterRecipes, displayRecipes) {
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

  filterDiv.querySelector(".filter-delete").addEventListener("click", function () {
    filterDiv.remove();
    removeActiveFilter(keyword, activeFilters, filterRecipes, displayRecipes);
  });

  return filterDiv;
}
