import { recipes } from "./recipes.js";
import { strUcFirst } from "./filterActive.js";
import { globalResearchResults, globalSearch, filtersResearch } from "./researchResults.js";

const dropdownContainer = document.querySelector(".filter-dropdowns");

function generateDropdownHTML(props, items) {
  const dropdownItems = items
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");

  const dropdownHTML = `
    <button class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <p>${props.title}</p>
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

  return dropdownHTML;
}

function handleDropdownItemClick(event) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault();
    const selectedItem = event.target.textContent.toLowerCase();
    if (!globalResearchResults.advancedFilterResults.includes(selectedItem)) {
      globalResearchResults.advancedFilterResults.push(selectedItem);
      globalSearch();
    }
  }
}

export function updateDropdownItems(items, dropdown, input, dropdownItemContainer) {
  const filteredItems = items.filter(
    (item) =>
      item.toLowerCase().includes(input.value.toLowerCase()) &&
      !globalResearchResults.advancedFilterResults.includes(item.toLowerCase())
  );

  dropdownItemContainer.innerHTML = filteredItems
    .map((item) => `<li class="dropdown-item">${item}</li>`)
    .join("");

  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");
  activeItemsContainer.innerHTML = globalResearchResults.advancedFilterResults
    .map(
      (filter) =>
        ` <li data-filter="${filter.toLowerCase()}">
          <p>${filter}</p>
          <button class="filter-delete"><i class="fa-solid fa-xmark"></i></button>
        </li>
      `
    )
    .join("");

  activeItemsContainer.querySelectorAll(".filter-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const filterToRemove = event.target.closest("li").getAttribute("data-filter");
      const filterIndex = globalResearchResults.advancedFilterResults.indexOf(filterToRemove);
      if (filterIndex > -1) {
        globalResearchResults.advancedFilterResults.splice(filterIndex, 1);
        globalSearch();
        updateDropdownItems(items, dropdown, input, dropdownItemContainer);
      }
    });
  });
}

export function createDropdown(props, items) {
  const dropdownHTML = generateDropdownHTML(props, items);
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  dropdown.innerHTML = dropdownHTML;

  const button = dropdown.querySelector(".dropdown-toggle");
  const menu = dropdown.querySelector(".dropdown-menu");

  button.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  const dropdownItemContainer = dropdown.querySelector(".dropdown-items");
  const input = dropdown.querySelector(".form-control");

  input.addEventListener("input", () =>
    updateDropdownItems(items, dropdown, input, dropdownItemContainer)
  );

  dropdownItemContainer.addEventListener("click", (event) => {
    handleDropdownItemClick(event);
  });

  return dropdown;
}

/* ----------------- Creation des filtres de recherche avancée ----------------- */

const ingredients = recipes.reduce((acc, recipe) => {
  recipe.ingredients.forEach((ingredient) => {
    const capitalizedIngredient = strUcFirst(ingredient.ingredient);
    if (!acc.includes(capitalizedIngredient)) {
      acc.push(capitalizedIngredient);
    }
  });
  return acc;
}, []);

const utensils = recipes.reduce((acc, recipe) => {
  recipe.ustensils.forEach((utensil) => {
    const capitalizedUtensil = strUcFirst(utensil);
    if (!acc.includes(capitalizedUtensil)) {
      acc.push(capitalizedUtensil);
    }
  });
  return acc;
}, []);

const appliances = recipes.reduce((acc, recipe) => {
  const capitalizedAppliance = strUcFirst(recipe.appliance);
  if (!acc.includes(capitalizedAppliance)) {
    acc.push(capitalizedAppliance);
  }
  return acc;
}, []);

dropdownContainer.appendChild(createDropdown({ title: "Ingrédients" }, ingredients));
dropdownContainer.appendChild(createDropdown({ title: "Ustensiles" }, utensils));
dropdownContainer.appendChild(createDropdown({ title: "Appareils" }, appliances));
