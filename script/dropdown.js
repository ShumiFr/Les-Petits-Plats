// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { strUcFirst } from "./filterActive.js";
import { globalResearchResults, globalSearch, filtersResearch } from "./researchResults.js";

// Sélection du conteneur pour les menus déroulants
const dropdownContainer = document.querySelector(".filter-dropdowns");

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
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
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
    </ul>
    `;

  return dropdownHTML; // Retourne le HTML généré
}

// Gestionnaire d'événements qui ajoute l'élément sélectionné dans le tableau des filtres actifs
function handleDropdownItemClick(event, items) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault(); // Empêche l'action par défaut
    const selectedItem = event.target.textContent.toLowerCase(); // Récupère l'élément sélectionné
    // Vérifie si l'élément n'est pas déjà dans les résultats de recherche avancée
    if (!globalResearchResults.advancedFilterResults.includes(selectedItem)) {
      globalResearchResults.advancedFilterResults.push(selectedItem); // Ajoute l'élément au tableau des filtres avancés
      globalSearch(); // Lance la recherche globale

      // Récupère les éléments nécessaires pour mettre à jour l'affichage
      const dropdown = event.target.closest(".dropdown");
      const input = dropdown.querySelector(".form-control");
      const dropdownItemContainer = dropdown.querySelector(".dropdown-items");

      // Met à jour les éléments du menu déroulant pour refléter les filtres actifs
      updateDropdownItems(items, dropdown, input, dropdownItemContainer);
    }
  }
}

// Fonction pour mettre à jour les éléments du menu déroulant en fonction de la saisie
export function updateDropdownItems(items, dropdown, input, dropdownItemContainer) {
  // On vérifie que l'élément n'est pas ni dans les filtres actifs ni dans la barre de recherche

  if (
    typeof globalResearchResults === "undefined" ||
    !globalResearchResults.advancedFilterResults
  ) {
    console.error("globalResearchResults n'est pas encore initialisé.");
    return; // Sortie anticipée de la fonction si globalResearchResults n'est pas défini
  }

  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(input.value.toLowerCase()) &&
      !globalResearchResults.advancedFilterResults.includes(item.toLowerCase())
  );

  // Si c'est le cas on affiche les éléments filtrés sinon on le retire de la liste ( Pour evité les doublons )
  dropdownItemContainer.innerHTML = filteredItems
    .map((item) => `<li class="dropdown-item">${item}</li>`)
    .join("");

  // Sélectionne et met à jour le conteneur des éléments actifs
  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");
  activeItemsContainer.innerHTML = globalResearchResults.advancedFilterResults
    .map(
      (filter) =>
        ` <li data-filter="${filter.toLowerCase()}">
          <p>${strUcFirst(filter)}</p>
          <button class="filter-delete"><i class="fa-solid fa-xmark"></i></button>
        </li>
      `
    )
    .join("");

  // Ajoute des gestionnaires d'événements pour supprimer des filtres
  activeItemsContainer.querySelectorAll(".filter-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche l'événement de se propager
      const filterToRemove = event.target.closest("li").getAttribute("data-filter"); // Récupère le filtre à supprimer
      const filterIndex = globalResearchResults.advancedFilterResults.indexOf(filterToRemove); // Trouve l'index du filtre
      if (filterIndex > -1) {
        globalResearchResults.advancedFilterResults.splice(filterIndex, 1); // Supprime le filtre
        globalSearch(); // Lance la recherche globale
        updateDropdownItems(items, dropdown, input, dropdownItemContainer); // Met à jour les éléments du menu déroulant
      }
    });
  });
}

// Fonction pour créer un menu déroulant
export function createDropdown(props, items) {
  const dropdownHTML = generateDropdownHTML(props, items); // Génère le HTML du menu déroulant
  const dropdown = document.createElement("div"); // Crée un conteneur pour le menu déroulant
  dropdown.classList.add("dropdown"); // Ajoute la classe 'dropdown'
  dropdown.setAttribute("data-title", props); // Ajoute l'attribut 'data-title' avec le titre du menu
  dropdown.innerHTML = dropdownHTML; // Insère le HTML généré

  // Ajoute des gestionnaires d'événements pour le bouton et les éléments du menu
  const button = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  button.addEventListener("click", () => {
    menu.classList.toggle("show"); // Affiche ou masque le menu
  });

  const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
  const input = dropdown.querySelector(".form-control");

  input.addEventListener(
    "input",
    () => updateDropdownItems(items, dropdown, input, dropdownItemContainer) // Met à jour les éléments en fonction de la saisie
  );

  dropdownItemContainer.addEventListener("click", (event) => {
    handleDropdownItemClick(event, items); // Gère les clics sur les éléments
  });

  return dropdown; // Retourne le menu déroulant créé
}

export function updateOrCreateDropdown(title, items) {
  let dropdown = document.querySelector(`.dropdown[data-title="${title}"]`);
  if (dropdown) {
    // Vider le contenu existant et ajouter les nouveaux éléments
    const dropdownMenu = dropdown.querySelector(".dropdown-items");
    dropdownMenu.innerHTML = ""; // Vider le contenu existant
    items.forEach((item) => {
      const itemElement = document.createElement("a");
      itemElement.classList.add("dropdown-item");
      itemElement.textContent = item;
      dropdownMenu.appendChild(itemElement);
    });
  }

  // Après la création ou la mise à jour, mettre à jour les éléments du menu déroulant pour afficher les filtres actifs
  const input = dropdown.querySelector(".form-control");
  const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
  updateDropdownItems(items, dropdown, input, dropdownItemContainer);
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
