const buttonCreatePerson = document.getElementById("button-create-person");

buttonCreatePerson.addEventListener("click", function () {
  // Guardar el tipo de persona en sessionStorage antes de redirigir
  if (window.location.href.includes("administrator_managment.html")) {
    sessionStorage.setItem("tipoPersona", "Administrador");
  } else if (window.location.href.includes("technician_managment.html")) {
    sessionStorage.setItem("tipoPersona", "Tecnico");
  } else if (window.location.href.includes("customer_managment.html")) {
    sessionStorage.setItem("tipoPersona", "Cliente");
  }

  // Redirigir a la página de creación de persona:
  window.location.href = "../CRUDs/Create/create_person.html";
});
