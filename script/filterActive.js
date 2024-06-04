// Fonction qui créé un filtre actif pour chaque mot clé donné, les ajoutes à la liste des filtres actifs et les affiches dans le conteneur des filtres actifs
export function createActiveFilter(keyword, activeFilters, filterRecipes, displayRecipes) {
  let keywordUcFirst = strUcFirst(keyword);

  // Fonction qui met en majuscule la première lettre d'une chaîne de caractères
  function strUcFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const filterDiv = document.createElement("div");
  filterDiv.classList.add("filter-active");
  filterDiv.innerHTML = `
          <p>${keywordUcFirst}</p>
          <button class="filter-delete">
              <i class="fa-solid fa-xmark"></i>
          </button>
        `;

  // Ecouteur d'evenement au bouton de suppression de filtre. Lorsqu'on clique sur le bouton de suppression de filtre, on supprime le filtre actif, on le retire de la liste des filtres actifs, on filtre les recettes et on les affiche
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
