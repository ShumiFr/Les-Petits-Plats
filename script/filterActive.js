export function createActiveFilter(keyword) {
  let keywordUcFirst = strUcFirst(keyword);

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

  return filterDiv;
}
