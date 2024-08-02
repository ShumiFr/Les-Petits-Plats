// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { strUcFirst } from "./utils.js";
import { globalResearchResults, performGlobalSearch } from "./researchResults.js";
import { createActiveFilter } from "./filterActive.js";

// Sélection du conteneur pour les menus déroulants
const dropdownContainer = document.querySelector(".filter-dropdowns");

/* ----------------- Création des fonctions ----------------- */

/**
 * Génère le HTML d'un menu déroulant.
 * @param {string} title - Le titre du menu déroulant.
 * @param {Array} items - La liste des éléments du menu déroulant.
 * @returns {string} - Le HTML généré pour le menu déroulant.
 */
function createDropdownHTML(title, items) {
  // Création des éléments de liste pour chaque item
  const dropdownItemsHtml = items
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");

  // Template HTML pour le menu déroulant
  const dropdownHTML = `
    <button class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <p>${title}</p>
        <i class="fa-solid fa-chevron-down"></i>
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <div class="input-group bg-white">
            <input
            type="text"
            class="form-control"
            aria-label="Barre de recherche"
            aria-describedby="bouton"
            />
            <button class="research-btn btn border-0" type="button">
            <img src="./assets/loupe_grey.svg" alt="loupe" />
            </button>
        </div>
        <ul class="dropdown-active-items">
        </ul>
        <div class="dropdown-items">
        ${dropdownItemsHtml}
        </div>
    </div>
    `;

  return dropdownHTML; // Retourne le HTML généré
}

/**
 * Filtre les éléments du menu déroulant en fonction de la saisie de l'utilisateur.
 * @param {Array} items - La liste des éléments du menu déroulant.
 * @param {HTMLInputElement} searchInput - L'élément de saisie de recherche.
 * @param {HTMLElement} dropdownItemContainer - Le conteneur des éléments du menu déroulant.
 * @param {string} filterType - Le type de filtre appliqué.
 */
function filterDropdownItems(items, searchInput, dropdownItemContainer, filterType) {
  // Filtrer les items en fonction de la saisie et des filtres actifs
  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(searchInput.value.toLowerCase()) &&
      !globalResearchResults.advancedFilterResults.some(
        (filter) => filter.item === item.toLowerCase() && filter.type === filterType
      )
  );

  // Générer le HTML pour les items filtrés et les insérer dans le conteneur
  dropdownItemContainer.innerHTML = filteredItems
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");
}

/**
 * Rafraîchit les éléments du menu déroulant en fonction des filtres actifs.
 * @param {Array} items - La liste des éléments du menu déroulant.
 * @param {HTMLElement} dropdown - L'élément du menu déroulant.
 * @param {HTMLInputElement} searchInput - L'élément de saisie de recherche.
 * @param {HTMLElement} dropdownItemContainer - Le conteneur des éléments du menu déroulant.
 * @param {string} filterType - Le type de filtre appliqué.
 */
export function refreshDropdownItems(items, dropdown, searchInput, dropdownItemContainer, filterType) {
  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");

  // Générer le HTML pour les filtres actifs
  const activeItemsHTML = globalResearchResults.advancedFilterResults
    .filter((filter) => filter.type === filterType)
    .map(
      (filter) =>
        `<li data-filter="${filter.item}"><p>${strUcFirst(
          filter.item
        )}</p><button class="filter-delete"><i class="fa-solid fa-xmark"></i></button></li>`
    )
    .join("");

  // Insérer les filtres actifs dans le conteneur
  activeItemsContainer.innerHTML = activeItemsHTML;

  // Mise à jour de la liste des éléments disponibles après modification des filtres actifs
  filterDropdownItems(items, searchInput, dropdownItemContainer, filterType);

  // Ajouter des écouteurs d'événements pour les boutons de suppression des filtres
  activeItemsContainer.querySelectorAll(".filter-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const filterToRemove = event.target.closest("li").getAttribute("data-filter");
      const filterId = `filter-tag-${filterToRemove.toLowerCase()}`;
      const filterElementToRemove = document.getElementById(filterId);

      // Supprimer l'élément de filtre actif
      if (filterElementToRemove) {
        filterElementToRemove.remove();
      }

      // Retirer le filtre des résultats de recherche avancée
      const filterIndex = globalResearchResults.advancedFilterResults.findIndex(
        (filter) => filter.item === filterToRemove && filter.type === filterType
      );
      if (filterIndex > -1) {
        globalResearchResults.advancedFilterResults.splice(filterIndex, 1);

        // Mettre à jour les éléments du menu déroulant et relancer la recherche globale
        refreshDropdownItems(items, dropdown, searchInput, dropdownItemContainer, filterType);
        performGlobalSearch();
      }
    });
  });
}

/**
 * Ajoute l'élément sélectionné aux filtres actifs et met à jour l'affichage.
 * @param {Event} event - L'événement de sélection de l'élément.
 * @param {Array} items - La liste des éléments du menu déroulant.
 * @param {HTMLElement} dropdown - L'élément du menu déroulant.
 * @param {HTMLInputElement} searchInput - L'élément de saisie de recherche.
 * @param {HTMLElement} dropdownItemContainer - Le conteneur des éléments du menu déroulant.
 * @param {string} filterType - Le type de filtre appliqué.
 */
function addSelectedItemToActiveFilters(event, items, dropdown, searchInput, dropdownItemContainer, filterType) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault();
    const selectedItem = event.target.textContent.toLowerCase();
    const filterObject = { item: selectedItem, type: filterType };

    // Vérifier si l'élément est déjà inclus dans les filtres actifs
    const isAlreadyIncluded = globalResearchResults.advancedFilterResults.some(
      (filter) => filter.item === selectedItem && filter.type === filterType
    );

    // Ajouter l'élément aux filtres actifs s'il n'est pas déjà inclus
    if (!isAlreadyIncluded) {
      globalResearchResults.advancedFilterResults.push(filterObject);
      performGlobalSearch();
    }

    // Créer et afficher le filtre actif
    createActiveFilter(selectedItem, items, dropdown, searchInput, dropdownItemContainer, filterType);
  }
}

/**
 * Initialise un menu déroulant avec la configuration et les éléments spécifiés.
 * @param {string} config - La configuration du menu déroulant (titre).
 * @param {Array} items - La liste des éléments du menu déroulant.
 * @returns {HTMLElement} - Le menu déroulant créé.
 */
export function initializeDropdown(config, items) {
  const dropdownHTML = createDropdownHTML(config, items); // Génère le HTML du menu déroulant
  const dropdown = document.createElement("div"); // Crée un conteneur pour le menu déroulant
  dropdown.classList.add("dropdown"); // Ajoute la classe 'dropdown'
  dropdown.setAttribute("data-title", config); // Ajoute l'attribut 'data-title' avec le titre du menu
  dropdown.innerHTML = dropdownHTML; // Insère le HTML généré

  let filterType;
  switch (config.toLowerCase()) {
    case "ingrédients":
      filterType = "ingredient";
      break;
    case "ustensiles":
      filterType = "utensil";
      break;
    case "appareils":
      filterType = "appliance";
      break;
    default:
      filterType = "unknown";
  }

  // Ajoute des gestionnaires d'événements pour le bouton et les éléments du menu
  const toggleButton = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  toggleButton.addEventListener("click", () => {
    menu.classList.toggle("show"); // Affiche ou masque le menu
  });

  const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
  const searchInput = dropdown.querySelector(".form-control");

  dropdownItemContainer.addEventListener("click", (event) => {
    addSelectedItemToActiveFilters(event, items, dropdown, searchInput, dropdownItemContainer, filterType); // Gère les clics sur les éléments avec le type spécifié
  });

  searchInput.addEventListener(
    "input",
    () => filterDropdownItems(items, searchInput, dropdownItemContainer, filterType) // Corrige l'ordre des paramètres ici
  );

  return dropdown; // Retourne le menu déroulant créé
}

/**
 * Met à jour le menu déroulant avec les nouveaux éléments.
 * @param {string} title - Le titre du menu déroulant.
 * @param {Array} items - La liste des nouveaux éléments du menu déroulant.
 */
export function updateDropdown(title, items) {
  let dropdown = document.querySelector(`.dropdown[data-title="${title}"]`);
  if (dropdown) {
    let filterType;
    switch (title.toLowerCase()) {
      case "ingrédients":
        filterType = "ingredient";
        break;
      case "ustensiles":
        filterType = "utensil";
        break;
      case "appareils":
        filterType = "appliance";
        break;
      default:
        filterType = "unknown";
    }

    const dropdownMenu = dropdown.querySelector(".dropdown-items");
    dropdownMenu.innerHTML = ""; // Vider le contenu existant
    items.forEach((item) => {
      const itemElement = document.createElement("a");
      itemElement.classList.add("dropdown-item");
      itemElement.textContent = item;
      dropdownMenu.appendChild(itemElement);
    });

    const searchInput = dropdown.querySelector(".form-control");
    const dropdownItemContainer = dropdown.querySelector(".dropdown-items");

    refreshDropdownItems(items, dropdown, searchInput, dropdownItemContainer, filterType);
  }
}

/**
 * Extrait les éléments uniques d'une liste de recettes en fonction de la clé spécifiée.
 * @param {Array} recipes - La liste des recettes.
 * @param {string} key - La clé pour extraire les éléments (par exemple, 'ingredients', 'ustensiles', 'appareils').
 * @returns {Array} - La liste des éléments uniques.
 */
function extractUniqueItems(recipes, key) {
  return recipes.reduce((acc, recipe) => {
    const items = key === 'ingredients' 
      ? recipe[key].map(item => item.ingredient) 
      : [].concat(recipe[key]); // Convertit en tableau si ce n'est pas déjà le cas

    items.forEach(item => {
      const capitalizedItem = strUcFirst(item);
      if (!acc.includes(capitalizedItem)) {
        acc.push(capitalizedItem);
      }
    });

    return acc;
  }, []);
}

/* ----------------- Appels des fonctions ----------------- */

// Récupère les ingrédients, ustensiles et appareils uniques
const ingredients = extractUniqueItems(recipes, 'ingredients');
const utensils = extractUniqueItems(recipes, 'ustensils');
const appliances = extractUniqueItems(recipes, 'appliance');

// Ajoute les menus déroulants pour les ingrédients, ustensiles et appareils au conteneur
dropdownContainer.appendChild(initializeDropdown("Ingrédients", ingredients));
dropdownContainer.appendChild(initializeDropdown("Ustensiles", utensils));
dropdownContainer.appendChild(initializeDropdown("Appareils", appliances));
