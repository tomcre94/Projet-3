window.initData = [];
import { URL } from "./constants.js";

// une fonction qui filtre initData et qui renvoit un tableau filtré selon id
function filterFiguresByTag(initData, id) {
  if (id != "all") {
    return initData.filter((element) => element.categoryId == id);
  }
  return initData;
}

// fonction qui filtre les elements DOM via insertFiguresByTag
function insertFiguresByTagDOM(button) {
  // Récupération de la gallery
  const divGallery = document.getElementById("gallery");

  //supprime les childrens de la gallery
  while (divGallery.firstChild) {
    divGallery.removeChild(divGallery.firstChild);
  }

  // Récupération des éléments filtrés
  let filteredElements = filterFiguresByTag(initData, button.id);
  // Ajout de chaque élément à divGallery
  filteredElements.forEach((element) => {
    createFigureElementDOM(element);
  });
}

// Fonction pour créer une figure
export function createFigureElementDOM(respElement) {
  // Récupération de l'élément du DOM qui accueillera les figures
  const divImg = document.getElementById("gallery");
  // Création de la figure
  const figure = document.createElement("figure");

  // on attribue la classe et l'id correspondante à la figure
  figure.setAttribute("id", respElement.id);

  // création img + infos API
  const imgElement = document.createElement("img");
  imgElement.src = respElement.imageUrl;

  // Création du titre + infos API
  const titleElement = document.createElement("p");
  titleElement.innerText = respElement.title;

  // On rattache les éléments créés à leurs parents
  divImg.appendChild(figure);
  figure.appendChild(imgElement);
  figure.appendChild(titleElement);
}
// Récupération des projets depuis l'API
async function fetchProjects() {
  try {
    const response = await fetch(URL + "/works", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // on récupère le resp dans initData
    initData = data;

    //récupération des boutons filtres
    const buttons = document.querySelectorAll("#buttons button");

    // On parcourt resp et on créée les figure avec la fonction dédiée
    data.forEach(createFigureElementDOM);

    // Ajout d'un écouteur d'événements aux boutons filtres
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        insertFiguresByTagDOM(button);
      });
    });
  } catch (error) {
    console.log("error", error);
  }
}

fetchProjects();
