document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitButton");
  const list = document.getElementById("list");
  const inputTask = document.getElementById("inputTask");

  // Charger la liste depuis le stockage local lors du chargement de la page
  loadListFromLocalStorage();

  // Ajouter un écouteur d'événement pour le clic sur le bouton de soumission
  submitButton?.addEventListener("click", function () {
    // Vérifier si l'élément inputTask existe et est bien une balise <input> HTML
    if (inputTask && inputTask instanceof HTMLInputElement) {
      // Récupérer la valeur de l'input et supprimer les espaces inutiles
      const inputValue = inputTask.value.trim();

      // Vérifier si la valeur de l'input n'est pas vide
      if (inputValue !== "") {
        // Créer un élément <li> pour représenter la nouvelle tâche
        var task = document.createElement("li");

        // Créer un élément <span> pour afficher le nom de la tâche
        const taskText = document.createElement("span");
        taskText.innerText = inputValue;

        // Créer un élément <span> pour afficher le statut de la tâche
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status"); // Ajouter une classe pour le style

        // Créer une icône de corbeille pour supprimer la tâche
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fas", "fa-trash-alt");
        trashIcon.addEventListener("click", () => {
          task.remove(); // Supprimer la tâche du DOM
          saveListToLocalStorage(); // Mettre à jour le stockage local après la suppression
        });

        // Ajouter les éléments au DOM
        task.appendChild(taskText); // Nom de la tâche
        task.appendChild(document.createTextNode(" "));
        task.appendChild(statusSpan); // Statut de la tâche
        task.appendChild(document.createTextNode(" "));
        task.appendChild(trashIcon); // Icône de corbeille

        // Ajouter un gestionnaire d'événement pour changer le statut de la tâche au clic
        task.addEventListener("click", () => {
          // Modifier le statut de la tâche en fonction de sa classe actuelle
          if (task.classList.contains("todo")) {
            task.classList.replace("todo", "selected");
            statusSpan.innerText = "Statut: En cours";
          } else if (task.classList.contains("selected")) {
            task.classList.replace("selected", "finished");
            statusSpan.innerText = "Statut: Terminé";
          } else if (task.classList.contains("finished")) {
            task.classList.remove("finished");
            statusSpan.innerText = "Statut: A faire";
            task.classList.add("todo");
          } else {
            task.classList.add("todo");
            statusSpan.innerText = "Statut: A faire";
          }
          saveListToLocalStorage(); // Mettre à jour le stockage local après la modification
        });

        // Ajouter la tâche au conteneur de la liste
        list?.appendChild(task);

        // Mettre à jour le stockage local après l'ajout de la tâche
        saveListToLocalStorage();

        // Réinitialiser l'input après l'ajout
        inputTask.value = "";
      }
    } else {
      // Afficher une erreur si l'élément inputTask n'est pas trouvé
      console.error("Element with ID 'inputTask' not found.");
    }
  });

  // Fonction pour sauvegarder la liste dans le stockage local
  function saveListToLocalStorage() {
    // Créer un tableau d'objets pour stocker les informations de chaque tâche
    const tasks = Array.from(list.children).map((task) => {
      // Sélectionner l'élément <span> contenant le nom de la tâche (ignorer le span de statut)
      const taskText = task.querySelector("span:not(.status)");

      // Créer un objet représentant les informations de la tâche
      return {
        text: taskText?.textContent, // Nom de la tâche
        isSelected: task.classList.contains("selected"), // Statut : En cours
        isFinished: task.classList.contains("finished"), // Statut : Terminé
        isTodo: task.classList.contains("todo"), // Statut : A faire
      };
    });

    // Convertir le tableau d'objets en chaîne JSON et enregistrer dans le stockage local
    localStorage.setItem("taskList", JSON.stringify(tasks));
  }

  // Fonction pour charger la liste depuis le stockage local
  function loadListFromLocalStorage() {
    // Récupérer les données de la liste de tâches depuis le stockage local
    const savedTasks = localStorage.getItem("taskList");

    // Vérifier si des tâches sont enregistrées dans le stockage local
    if (savedTasks) {
      // Parser les données JSON pour obtenir la liste des tâches
      const tasks = JSON.parse(savedTasks);

      // Parcourir chaque tâche dans la liste
      tasks.forEach((taskInfo) => {
        // Créer un élément <li> pour représenter la tâche
        var task = document.createElement("li");

        // Créer un élément <span> pour afficher le nom de la tâche
        const taskText = document.createElement("span");
        taskText.innerText = taskInfo.text;

        // Créer un élément <span> pour afficher le statut de la tâche
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status"); // Ajouter une classe pour le style

        // Vérifier le statut de la tâche et mettre à jour les classes et le texte du statut en conséquence
        if (taskInfo.isSelected) {
          task.classList.add("selected");
          statusSpan.innerText = "Statut: En cours";
        }
        if (taskInfo.isFinished) {
          task.classList.add("finished");
          statusSpan.innerText = "Statut: Terminé";
        }
        if (taskInfo.isTodo) {
          task.classList.add("todo");
          statusSpan.innerText = "Statut: A faire";
        }

        // Créer une icône de corbeille pour supprimer la tâche
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fas", "fa-trash-alt");
        trashIcon.addEventListener("click", () => {
          task.remove(); // Supprimer la tâche du DOM
          saveListToLocalStorage(); // Mettre à jour le stockage local
        });

        // Ajouter les éléments au DOM
        task.appendChild(taskText); // Nom de la tâche
        task.appendChild(document.createTextNode(" "));
        task.appendChild(statusSpan); // Statut de la tâche
        task.appendChild(document.createTextNode(" "));
        task.appendChild(trashIcon); // Icône de corbeille

        // Ajouter un gestionnaire d'événement pour changer le statut de la tâche au clic
        task.addEventListener("click", () => {
          if (task.classList.contains("todo")) {
            task.classList.replace("todo", "selected");
            statusSpan.innerText = "Statut: En cours";
          } else if (task.classList.contains("selected")) {
            task.classList.replace("selected", "finished");
            statusSpan.innerText = "Statut: Terminé";
          } else if (task.classList.contains("finished")) {
            task.classList.remove("finished");
            statusSpan.innerText = "Statut: A faire";
            task.classList.add("todo");
          } else {
            task.classList.add("todo");
            statusSpan.innerText = "Statut: A faire";
          }
          saveListToLocalStorage(); // Mettre à jour le stockage local
        });

        // Ajouter la tâche au conteneur de la liste
        list?.appendChild(task);
      });
    }
  }
});
