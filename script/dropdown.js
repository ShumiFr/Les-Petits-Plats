// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { strUcFirst } from "./utils.js";
import { globalResearchResults, globalSearch } from "./researchResults.js";

// Sélection du conteneur pour les menus déroulants
const dropdownContainer = document.querySelector(".filter-dropdowns");

/* ----------------- Création des donctions ----------------- */

// Fonction pour générer le HTML d'un menu déroulant
function generateDropdownHTML(props, items) {
  // Création des éléments de liste pour chaque item
  const dropdownItems = items
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");

  // Template HTML pour le menu déroulant
  const dropdownHTML = `
    <button class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <p>${props}</p>
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
        ${dropdownItems}
        </div>
    </div>
    `;

  return dropdownHTML; // Retourne le HTML généré
}

// Fonction pour gérer la saisie dans la barre de recherche
function handleSearchBarInput(items, input, dropdownItemContainer, type) {
  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(input.value.toLowerCase()) &&
      !globalResearchResults.advancedFilterResults.some(
        (filter) => filter.item === item.toLowerCase() && filter.type === type
      )
  );

  dropdownItemContainer.innerHTML = filteredItems
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");
}

// Fonction pour mettre à jour les éléments du menu déroulant
export function updateDropdownItems(items, dropdown, input, dropdownItemContainer, type) {
  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");

  const activeItemsHTML = globalResearchResults.advancedFilterResults
    .filter((filter) => filter.type === type)
    .map(
      (filter) =>
        `<li data-filter="${filter.item}"><p>${strUcFirst(
          filter.item
        )}</p><button class="filter-delete"><i class="fa-solid fa-xmark"></i></button></li>`
    )
    .join("");

  activeItemsContainer.innerHTML = activeItemsHTML;

  activeItemsContainer.querySelectorAll(".filter-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const filterToRemove = event.target.closest("li").getAttribute("data-filter");
      const filterIndex = globalResearchResults.advancedFilterResults.findIndex(
        (filter) => filter.item === filterToRemove && filter.type === type
      );
      if (filterIndex > -1) {
        globalResearchResults.advancedFilterResults.splice(filterIndex, 1);
        updateDropdownItems(items, dropdown, input, dropdownItemContainer, type); // Mise à jour après suppression d'un filtre
        globalSearch();
      }
    });
  });

  // Mise à jour de la liste des éléments disponibles après modification des filtres actifs
  handleSearchBarInput(items, input, dropdownItemContainer, type);
}

// Gestionnaire d'événements qui ajoute l'élément sélectionné dans le tableau des filtres actifs
function handleDropdownItemClick(event, type, items, dropdown, input, dropdownItemContainer) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault();
    const selectedItem = event.target.textContent.toLowerCase();
    const filterObject = { item: selectedItem, type: type };

    const isAlreadyIncluded = globalResearchResults.advancedFilterResults.some(
      (filter) => filter.item === selectedItem && filter.type === type
    );

    if (!isAlreadyIncluded) {
      globalResearchResults.advancedFilterResults.push(filterObject);
      console.log("Filtres actifs :", globalResearchResults);
      globalSearch();
      updateDropdownItems(items, dropdown, input, dropdownItemContainer, type); // Mise à jour après ajout d'un filtre
    }
  }
}

// Fonction pour créer un menu déroulant
export function createDropdown(props, items) {
  const dropdownHTML = generateDropdownHTML(props, items); // Génère le HTML du menu déroulant
  const dropdown = document.createElement("div"); // Crée un conteneur pour le menu déroulant
  dropdown.classList.add("dropdown"); // Ajoute la classe 'dropdown'
  dropdown.setAttribute("data-title", props); // Ajoute l'attribut 'data-title' avec le titre du menu
  dropdown.innerHTML = dropdownHTML; // Insère le HTML généré

  let type;
  switch (props.toLowerCase()) {
    case "ingrédients":
      type = "ingredient";
      break;
    case "ustensiles":
      type = "utensil";
      break;
    case "appareils":
      type = "appliance";
      break;
    default:
      type = "unknown";
  }

  // Ajoute des gestionnaires d'événements pour le bouton et les éléments du menu
  const button = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  button.addEventListener("click", () => {
    menu.classList.toggle("show"); // Affiche ou masque le menu
  });

  const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
  const input = dropdown.querySelector(".form-control");

  dropdownItemContainer.addEventListener("click", (event) => {
    handleDropdownItemClick(event, type, items, dropdown, input, dropdownItemContainer); // Gère les clics sur les éléments avec le type spécifié
  });

  input.addEventListener(
    "input",
    () => handleSearchBarInput(items, input, dropdownItemContainer, type) // Corrige l'ordre des paramètres ici
  );

  return dropdown; // Retourne le menu déroulant créé
}

// Fonction pour mettre a jour le dropdown
export function updateDropdown(title, items) {
  let dropdown = document.querySelector(`.dropdown[data-title="${title}"]`);
  if (dropdown) {
    let type;
    switch (title.toLowerCase()) {
      case "ingrédients":
        type = "ingredient";
        break;
      case "ustensiles":
        type = "utensil";
        break;
      case "appareils":
        type = "appliance";
        break;
      default:
        type = "unknown";
    }

    const dropdownMenu = dropdown.querySelector(".dropdown-items");
    dropdownMenu.innerHTML = ""; // Vider le contenu existant
    items.forEach((item) => {
      const itemElement = document.createElement("a");
      itemElement.classList.add("dropdown-item");
      itemElement.textContent = item;
      dropdownMenu.appendChild(itemElement);
    });

    const input = dropdown.querySelector(".form-control");
    const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
    updateDropdownItems(items, dropdown, input, dropdownItemContainer, type);
  }
}

/* ----------------- Création des filtres de recherche avancée ----------------- */

// Récupère et traite les ingrédients, ustensiles et appareils à partir des recettes
const ingredients = recipes.reduce((acc, recipe) => {
  recipe.ingredients.forEach((ingredient) => {
    const capitalizedIngredient = strUcFirst(ingredient.ingredient); // Capitalise l'ingrédient
    if (!acc.includes(capitalizedIngredient)) {
      acc.push(capitalizedIngredient); // Ajoute l'ingrédient s'il n'est pas déjà présent
    }
  });
  return acc;
}, []);

const utensils = recipes.reduce((acc, recipe) => {
  recipe.ustensils.forEach((utensil) => {
    const capitalizedUtensil = strUcFirst(utensil); // Capitalise l'ustensile
    if (!acc.includes(capitalizedUtensil)) {
      acc.push(capitalizedUtensil); // Ajoute l'ustensile s'il n'est pas déjà présent
    }
  });
  return acc;
}, []);

const appliances = recipes.reduce((acc, recipe) => {
  const capitalizedAppliance = strUcFirst(recipe.appliance); // Capitalise l'appareil
  if (!acc.includes(capitalizedAppliance)) {
    acc.push(capitalizedAppliance); // Ajoute l'appareil s'il n'est pas déjà présent
  }
  return acc;
}, []);

// Ajoute les menus déroulants pour les ingrédients, ustensiles et appareils au conteneur
dropdownContainer.appendChild(createDropdown("Ingrédients", ingredients));
dropdownContainer.appendChild(createDropdown("Ustensiles", utensils));
dropdownContainer.appendChild(createDropdown("Appareils", appliances));
