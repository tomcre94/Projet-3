import { URL } from "./constants.js";

const inputMail = document.getElementById("email");
const inputPassword = document.getElementById("password");
let logIn = document.querySelectorAll(".LogInElementsconnect");

// écouteur d'évènement sur le bouton se connecter
logIn[0].addEventListener("click", (e) => {
  // Empêche le rechargement de la page
  e.preventDefault();
  // récupération des valeurs des deux input
  const user = {
    email: inputMail.value,
    password: inputPassword.value,
  };
  // transformation en JSON de user
  const jsonUser = JSON.stringify(user);

  // message d'erreur si input vide
  if (user.email == "" || user.password == "") {
    alert("Veuillez remplir tous les champs.");
    return false;
  }

  fetch(URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonUser,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        // redirection vers l'index
        window.location.href = "/index.html";
      } else {
        console.error("Le token n'a pas été trouvé");
        alert("Identifiant ou Mot de passe incorrect");
      }
      console.log(data.token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
