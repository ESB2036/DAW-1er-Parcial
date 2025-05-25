document.addEventListener("DOMContentLoaded", function () {
  const returnButton = document.getElementById("button-return");
  const formTitle = document.getElementById("form-title");
  const adminFields = document.getElementById("admin-fields");
  const tecnicoFields = document.getElementById("tecnico-fields");
  const clienteFields = document.getElementById("cliente-fields");

  // Obtener el tipo de persona de sessionStorage:
  const personType = sessionStorage.getItem("tipoPersona");
  console.log("Tipo de persona:", personType);

  // Configurar el formulario según el tipo:
  switch (personType) {
    case "Administrador":
      formTitle.textContent = "Crear Administrador";
      adminFields.classList.remove("hidden");
      returnButton.addEventListener("click", function () {
        window.location.href = "../../managments/administrator_managment.html";
      });
      break;
    case "Tecnico":
      formTitle.textContent = "Crear Técnico";
      tecnicoFields.classList.remove("hidden");
      returnButton.addEventListener("click", function () {
        window.location.href = "../../managments/technician_managment.html";
      });
      break;
    case "Cliente":
      formTitle.textContent = "Crear Cliente";
      clienteFields.classList.remove("hidden");
      returnButton.addEventListener("click", function () {
        window.location.href = "../../managments/customer_managment.html";
      });
      break;
    default:
      console.error("Tipo de persona no reconocido:", personType);
      // Redirigir a una página por defecto o mostrar error:
      window.location.href = "../../administrator_panel.html";
      return;
  }

  // Limpiar el sessionStorage después de usarlo:
  sessionStorage.removeItem("tipoPersona");

  // Manejar el envío del formulario:
  document
    .getElementById("person-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar cédula ecuatoriana (simulación, la validación real sería en el servidor):
      const cedula = document.getElementById("cedula").value;
      if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
        alert("Por favor ingrese una cédula ecuatoriana válida (10 dígitos)");
        return;
      }

      // Recolectar datos del formulario:
      const formData = {
        cedula: document.getElementById("cedula").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
        tipoPersona: personType,
      };

      // Agregar campos específicos según el tipo de persona:
      if (personType === "Administrador") {
        formData.username = document.getElementById("username").value;
        formData.contrasena = document.getElementById("contrasena").value;
      } else if (personType === "Tecnico") {
        formData.especialidad = document.getElementById("especialidad").value;
      } else if (personType === "Cliente") {
        formData.direccion = document.getElementById("direccion").value;
      }

      // Aquí iría la llamada para enviar los datos al servidor pero aún no hay pipipi:
      console.log("Datos a enviar:", formData);

      // Simular envío exitoso:
      alert(`${personType} creado exitosamente`);
      this.reset();

      // Redirigir después de crear:
      setTimeout(() => {
        if (personType === "Administrador") {
          window.location.href =
            "../../managments/administrator_managment.html";
        } else if (personType === "Tecnico") {
          window.location.href = "../../managments/technician_managment.html";
        } else {
          window.location.href = "../../managments/customer_managment.html";
        }
      }, 1000);
    });
});
