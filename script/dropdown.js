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

// Gestionnaire d'événements qui ajoute l'élément sélectionné dans le tableau des filtres actifs
function handleDropdownItemClick(event, type) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault(); // Empêche l'action par défaut
    const selectedItem = event.target.textContent.toLowerCase(); // Récupère l'élément sélectionné
    const filterObject = { item: selectedItem, type: type }; // Crée un objet avec l'élément et son type

    // Vérifie si l'objet n'est pas déjà présent dans le tableau des filtres avancés
    const isAlreadyIncluded = globalResearchResults.advancedFilterResults.some(
      (filter) => filter.item === selectedItem && filter.type === type
    );

    if (!isAlreadyIncluded) {
      globalResearchResults.advancedFilterResults.push(filterObject);
      console.log("Filtres actifs :", globalResearchResults); // Ajoute l'objet au tableau des filtres avancés
      globalSearch(); // Lance la recherche globale
    }
  }
}

// Fonction pour mettre à jour les éléments du menu déroulant en fonction de la saisie
export function updateDropdownItems(items, dropdown, input, dropdownItemContainer) {
  // On vérifie que l'élément n'est pas ni dans les filtres actifs ni dans la barre de recherche

  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(input.value.toLowerCase()) &&
      !globalResearchResults.advancedFilterResults.some(
        (filter) => filter.item === item.toLowerCase()
      )
  );

  // Si c'est le cas on affiche les éléments filtrés sinon on le retire de la liste ( Pour evité les doublons )
  dropdownItemContainer.innerHTML = filteredItems
    .map(
      (item) => `<li >
                    <a class="dropdown-item href="#"">${item}</a>
                </li>`
    )
    .join("");

  // Sélectionne et met à jour le conteneur des éléments actifs
  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");
  activeItemsContainer.innerHTML = globalResearchResults.advancedFilterResults
    .map(
      (filter) =>
        ` <li data-filter="${filter.item}">
        <p>${strUcFirst(filter.item)}</p>
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
      // Trouve l'index du filtre à supprimer
      const filterIndex = globalResearchResults.advancedFilterResults.findIndex(
        (filter) => filter.item === filterToRemove
      );
      if (filterIndex > -1) {
        globalResearchResults.advancedFilterResults.splice(filterIndex, 1); // Supprime le filtre
        updateDropdownItems(items, dropdown, input, dropdownItemContainer); // Met à jour les éléments du menu déroulant
        globalSearch(); // Lance la recherche globale
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
    handleDropdownItemClick(event, type); // Gère les clics sur les éléments avec le type spécifié
  });

  return dropdown; // Retourne le menu déroulant créé
}

// Fonction pour mettre a jour le dropdown
export function updateDropdown(title, items) {
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
