// Importation des modules nécessaires
import { recipes } from "./recipes.js";
import { extractUniqueItems, initializeDropdown} from "./libs.js"


// Sélection du conteneur pour les menus déroulants
const dropdownContainer = document.querySelector(".filter-dropdowns");

/* ----------------- Création des fonctions ----------------- */



/* ----------------- Appels des fonctions ----------------- */

// Récupère les ingrédients, ustensiles et appareils uniques
const ingredients = extractUniqueItems(recipes, 'ingredients');
const utensils = extractUniqueItems(recipes, 'ustensils');
const appliances = extractUniqueItems(recipes, 'appliance');

// Ajoute les menus déroulants pour les ingrédients, ustensiles et appareils au conteneur
dropdownContainer.appendChild(initializeDropdown("Ingrédients", ingredients));
dropdownContainer.appendChild(initializeDropdown("Ustensiles", utensils));
dropdownContainer.appendChild(initializeDropdown("Appareils", appliances));
