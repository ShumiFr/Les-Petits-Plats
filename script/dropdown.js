import { recipes } from "./recipes.js";
import { strUcFirst } from "./filterActive.js";
import { displayActiveFilters } from "./researchBar.js";
import { activeFilters } from "./researchBar.js";
import { removeActiveFilter } from "./filterActive.js";
import { filterRecipes } from "./researchBar.js";
import { displayRecipes } from "./researchBar.js";

const dropdownContainer = document.querySelector(".filter-dropdowns");

/* ----------------- Fonctions ----------------- */

function generateDropdownHTML(props, items) {
  const dropdownItems = items
    .map((item) => `<li><a class="dropdown-item" href="#">${item}</a></li>`)
    .join("");
  console.log(items);

  const dropdownHTML = `
    <button class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <p>${props.title}</p>
        <i class="fa-solid fa-chevron-down"></i>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <div class="input-group bg-white">
            <input
            type="text"
            class="form-control""
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

function handleDropdownItemClick(
  event,
  items,
  activeFilters,
  updateDropdownItems,
  dropdown,
  input,
  dropdownItemContainer,
  filterRecipes,
  displayRecipes
) {
  if (event.target.matches(".dropdown-item")) {
    event.preventDefault();
    const selectedItem = event.target.textContent.toLowerCase();
    displayActiveFilters(selectedItem);
    if (!activeFilters.includes(selectedItem)) {
      activeFilters.push(selectedItem);
    }
    const index = items.indexOf(selectedItem);
    if (index > -1) {
      items.splice(index, 1);
    }
    updateDropdownItems(
      items,
      activeFilters,
      dropdown,
      input,
      dropdownItemContainer,
      filterRecipes,
      displayRecipes
    );
  }
}

export function updateDropdownItems(
  items,
  activeFilters,
  dropdown,
  input,
  dropdownItemContainer,
  filterRecipes,
  displayRecipes
) {
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(input.value.toLowerCase())
  );

  const activeItemsContainer = dropdown.querySelector(".dropdown-active-items");
  activeItemsContainer.innerHTML = activeFilters.map(
    (filter) =>
      ` <li data-filter="${filter.toLowerCase()}">
          <p>${filter}</p>
          <button class="filter-delete"><i class="fa-solid fa-xmark"></i></button>
        </li>
      `
  );

  activeItemsContainer.querySelectorAll(".filter-delete").forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const filter = activeFilters[index];
      removeActiveFilter(filter, activeFilters, filterRecipes, displayRecipes);
      updateDropdownItems(
        items,
        activeFilters,
        dropdown,
        input,
        dropdownItemContainer,
        filterRecipes,
        displayRecipes
      );
    });
  });

  dropdownItemContainer.innerHTML = filteredItems
    .map((item) => {
      const isActiveFilter = activeFilters.includes(item);
      return `<li><a class="dropdown-item ${
        isActiveFilter ? "active" : ""
      }" data-filter="${item.toLowerCase()}" href="#">${item}</a></li>`;
    })
    .join("");
}

export function createDropdown(props, items, activeFilters, filterRecipes, displayRecipes) {
  const dropdownHTML = generateDropdownHTML(props, items, activeFilters);
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
    updateDropdownItems(
      items,
      activeFilters,
      dropdown,
      input,
      dropdownItemContainer,
      filterRecipes,
      displayRecipes
    )
  );

  dropdownItemContainer.addEventListener("click", (event) => {
    handleDropdownItemClick(event, items, activeFilters, () =>
      updateDropdownItems(
        items,
        activeFilters,
        dropdown,
        input,
        dropdownItemContainer,
        filterRecipes,
        displayRecipes
      )
    );
    console.log(activeFilters);
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

dropdownContainer.appendChild(
  createDropdown(
    { title: "Ingrédients" },
    ingredients,
    activeFilters,
    filterRecipes,
    displayRecipes
  )
);
dropdownContainer.appendChild(
  createDropdown({ title: "Ustensiles" }, utensils, activeFilters, filterRecipes, displayRecipes)
);
dropdownContainer.appendChild(
  createDropdown({ title: "Appareils" }, appliances, activeFilters, filterRecipes, displayRecipes)
);
