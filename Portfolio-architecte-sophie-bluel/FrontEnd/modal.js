import { URL } from "./constants.js";
import { createFigureElementDOM } from "./index.js";

// ------------------------------- constants -----------------------//
// Créer un bouton pour ouvrir la modal
const btn = document.getElementById("linkModal");

let logoutButton;
// le bouton est initialement caché
btn.style.display = "none";

async function fetchWorks() {
  const response = await fetch(`${URL}/works`);
  const works = await response.json();
  initData = works;
  return works;
}

//récupération du token
const token = localStorage.getItem("token");

// --------------------------------------- fonctions ------------------------- //
handleClickLogout();

// gère le comportement au clic sur login selon que l'on est connecté ou non
function handleClickLogout() {
  //récupération du bouton du menu login/logout
  logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", function () {
    if (logoutButton.textContent === "login") {
      window.location.href = "./login.html";
    } else if (logoutButton.textContent === "logout") {
      window.location.href = "./index.html";
      logoutButton.textContent = "login";
      localStorage.removeItem("token");
      document.getElementById("modalHeader").style.display = "none";
      document.getElementById("buttons").style.display = "block";
      document.getElementById("linkModal").style.display = "none";
    }
  });
}

//si admin connecté, login -> logout, afficher le lien pour la modal, cacher filtres
function createAdminItems() {
  logoutButton = document.getElementById("logout");
  if (token) {
    logoutButton.textContent = "logout";
    const linkModal = document.getElementById("linkModal");
    document.getElementById("header").style.marginTop = "50px";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("gallery").style.marginTop = "50px";
    linkModal.style.display = "block";
  }
}

// fonction qui crée le bandeau noir en haut
function createHeadBandAdmin() {
  const header = document.getElementById("header");

  header.insertAdjacentHTML(
    "beforeend",
    `
    <div id="displayHeadband"> 
      <aside
        id="modalHeader"
        aria-hidden="true"
      >
        <div  class="modalHeaderDisplay">
          <p> <i class="fa-regular fa-pen-to-square"></i> Mode édition </p>
        </div>
      </aside>    
    </div>
  `
  );
}

/* fonction de création de la modale */
function createModal() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal" id="modal"><span class="close" id="close">x</span></div>  
    <div class="overlay" id="overlay"></div>
  `
  );

  // ferme la fenêtre modale lorsqu'on clique sur le bouton de fermeture/overlay
  const closeBtn = document.getElementById("close");
  closeBtn.addEventListener("click", closeModal);
  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", closeModal);
}

// Fonction pour fermer la modale et l'overlay
function closeModal() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");

  modal.parentNode.removeChild(modal);
  overlay.parentNode.removeChild(overlay);
}

// Fonction pour insérer le contenu dans la modale
async function insertModalContent() {
  const modalContentDivbis = await modalInitContentcreation();
  document
    .getElementById("modal")
    .insertAdjacentHTML("beforeend", modalContentDivbis.innerHTML);
}

// Fonction pour initialiser la modale
async function initModal() {
  await insertModalContent();
  deleteImg();
  activeModalNext();
}

// Fonction pour créer le contenu de la modale
async function modalInitContentcreation() {
  var modalContentHTML = `
      <div class="modal-content" id="modal-content">
        <h2>Galerie photo</h2>
        <div class="modal_Content_figure" id="modal_Content_figure"></div>
        <hr>
        <form id="formBtnMdl" class="formBtnMdl">
          <button class="submitBtnMdl" id="submitBtnMdl"> Ajouter une photo </button>
        </form>
      </div>
    `;

  var modalContentDiv = document.createElement("div");
  modalContentDiv.innerHTML = modalContentHTML;

  const works = await fetchWorks();
  const figureContainer = modalContentDiv.querySelector(
    "#modal_Content_figure"
  );

  works.forEach((object) => {
    const figureHTML = `
        <figure class="figureCreateGallery">
          <i class="fa-solid fa-trash-can" id="delete__picture"></i>
          <img class="imgCreateGallery" src="${object.imageUrl}" data-id=${object.id} alt="${object.id}">
        </figure>
      `;
    figureContainer.innerHTML += figureHTML;
  });

  return modalContentDiv;
}

/* fonction qui permet la suppression d'une image et qui rafraichit la modale */
async function deleteImg() {
  const deleteButtons = document.querySelectorAll(".fa-trash-can");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const figure = event.target.closest("figure");
      const id = figure.querySelector("img").getAttribute("data-id");

      // Envoyer une requête à l'API pour supprimer l'image avec l'ID correspondant
      try {
        const response = await fetch(`${URL}/works/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Image supprimée avec succès");
          alert("Image supprimée avec succès");

          figure.remove();

          // On récupère la gallery et son dernier élément
          var div = document.getElementById("gallery");
          var lastChild = div.lastChild;

          // On supprime le dernier enfant de la div
          div.removeChild(lastChild);
        } else {
          alert("Erreur lors de la suppression de l'image");
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

//fonction qui génère le contenu de la modale suivante
function createAddWork() {
  // crée le contenu de la nouvelle modale
  const modalContentNext = document.getElementById("modal-content");
  modalContentNext.innerHTML = `
    <i class="fa-solid fa-arrow-left" id="openModalPrevious"></i>
    <h2>Ajout photo</h2>
    <div class="upload-btn-wrapper">
      <img id="imagePreview" class="imagePreview" style="max-width: 100%; max-height: 100%; display: block; margin: auto;">
      <i class="fa-regular fa-image"></i>
      <button class="btnMdlNxt" onclick="document.getElementById('file-input').click()">+ Ajouter photo</button>
      <input type="file" id="file-input" accept=".jpg, .png" style="display:none">
      <p>jpg, png; 4mo max</p>
    </div>
    
    <label for="title-input">Titre</label>
    <input type="text" id="title-input" class="selectCatMdlNxt">
    <label for="categorieSelect"> Catégorie </label>
    <select name="categorie" id="categorieSelect" class="selectCatMdlNxt">
    <option value="" disabled selected></option>
    </select>
    <hr>
    <button id="validateBtnModalNext">Valider</button>
      `;

  fetch(`${URL}/categories`)
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("categorieSelect");
      for (const category of data) {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        select.appendChild(option);
      }
    });

  document.getElementById("file-input").addEventListener("change", function () {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector(".fa-regular.fa-image").style.display = "none";
      document.querySelector(".btnMdlNxt").style.display = "none";
      document.querySelector("#file-input").style.display = "none";
      document.querySelector(".upload-btn-wrapper p").style.display = "none";
      document.getElementsByClassName("imagePreview")[0].src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  });
  document
    .getElementById("categorieSelect")
    .addEventListener("click", function () {
      const title = document.getElementById("title-input").value;
      const category = document.querySelector('select[name="categorie"]').value;
      const image = document.querySelector('input[type="file"]').files[0];
      if (title && category && image) {
        const validateBtn = document.getElementById("validateBtnModalNext");
        validateBtn.style.backgroundColor = "#1D6154";
      } else {
        validateBtn.style.background = "#A7A7A7";
      }
    });
  // appelle la fonction qui permet le retour à la modal précédente
  returnToPreviousMdl();
  // appelle la fonction qui permet l'ajout d'un projet
  addProjectFromModal();
}

function returnToPreviousMdl() {
  var returnToPreviousMdlBtn = document.getElementById("openModalPrevious");
  returnToPreviousMdlBtn.addEventListener("click", function () {
    // Supprimer la div dont l'id est "modal-content"
    var modalContent = document.getElementById("modal-content");
    modalContent.remove();
    // Recréer le contenu de la modale
    initModal();
  });
}

function activeModalNext() {
  var submitBtnMdlNxt = document.getElementById("submitBtnMdl");
  submitBtnMdlNxt.addEventListener("click", createAddWork);
}

function addProjectFromModal() {
  const validateBtn = document.getElementById("validateBtnModalNext");
  validateBtn.addEventListener("click", function () {
    const title = document.getElementById("title-input").value;
    const category = document.querySelector('select[name="categorie"]').value;
    const image = document.querySelector('input[type="file"]').files[0];
    // donner un nom ou un ID et changer le queryselector
    if (!title || !category || !image) {
      alerte("Veuillez remplir tous les champs du formulaire");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    async function postDataToAPI(data) {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      };

      try {
        const response = await fetch(`${URL}/works`, options);

        if (response.ok) {
          // Injecter un paragraphe dans l'HTML
          alert("Data successfully sent to API");
          closeModal();

          // Convertir FormData en objet JavaScript
          const reader = new FileReader();

          reader.onload = function (event) {
            const imgUrl = event.target.result;
            const respElement = {
              title: formData.get("title"),
              id: formData.get("category"),
              imageUrl: imgUrl,
            };
            createFigureElementDOM(respElement);
          };
          reader.readAsDataURL(image);
        } else {
          // message d'erreur
          throw new Error("Error sending data to API");
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Utilisation de la fonction
    postDataToAPI(formData);
  });
}

// si l'utilisateur est connecté -> mode admin
if (token) {
  createAdminItems();
  createHeadBandAdmin();
  // ouvre la fenêtre modale lorsqu'on clique sur le bouton
  btn.addEventListener("click", function () {
    createModal();
    initModal();
  });
}
