export function strUcFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createActiveFilter(keyword, activeFilters, filterRecipes, displayRecipes) {
  let keywordUcFirst = strUcFirst(keyword);

  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");
  filterDiv.innerHTML = `
          <p>${keywordUcFirst}</p>
          <button class="filter-delete">
              <i class="fa-solid fa-xmark"></i>
          </button>
        `;

  filterDiv.querySelector(".filter-delete").addEventListener("click", function () {
    filterDiv.remove();

    const index = activeFilters.indexOf(keyword);
    if (index > -1) {
      activeFilters.splice(index, 1);
    }

    const filteredRecipes = filterRecipes();

    displayRecipes(filteredRecipes);
    console.log(activeFilters);
  });

  return filterDiv;
}
