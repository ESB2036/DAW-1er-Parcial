// Validación básica de cédula (10 dígitos numéricos)
function validarCedula(cedula) {
  if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
    return { valido: false, mensaje: "La cédula debe tener 10 dígitos numéricos" };
  }
  return { valido: true, mensaje: "" };
}

// Validación en tiempo real para el campo de cédula
function configurarValidacionCedula(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  input.addEventListener('input', () => {
    const cedula = input.value;
    const resultado = validarCedula(cedula);
    input.classList.toggle('error', !resultado.valido);
    error.textContent = resultado.mensaje;
  });
}

// Cargar técnicos en el select de Actualizar Técnico
function cargarTecnicosSelect() {
  const select = document.getElementById("tecnico");
  if (!select) return;

  const tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];
  select.innerHTML = '<option value="" disabled selected>Seleccione...</option>';

  tecnicos.forEach((t, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${t.cedula} - ${t.nombre} ${t.apellido}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const indice = select.value;
    select.classList.remove('error');
    document.getElementById("tecnico-error").textContent = '';

    if (indice !== "") {
      const t = tecnicos[indice];
      document.getElementById("cedula").value = t.cedula;
      document.getElementById("nombre").value = t.nombre;
      document.getElementById("apellido").value = t.apellido;
      document.getElementById("telefono").value = t.telefono;
      document.getElementById("email").value = t.email;
      document.getElementById("especialidad").value = t.especialidad;
      document.getElementById("estado").value = t.estado;
      document.getElementById("cedula").classList.remove('error');
      document.getElementById("cedula-error").textContent = '';
    }
  });
}

// Validar unicidad de cédula, email y teléfono
function validarUnicidad(tecnico, tecnicos, indiceActual) {
  return {
    cedula: tecnicos.some((t, i) => t.cedula === tecnico.cedula && i !== parseInt(indiceActual)),
    email: tecnicos.some((t, i) => t.email === tecnico.email && i !== parseInt(indiceActual)),
    telefono: tecnicos.some((t, i) => t.telefono === tecnico.telefono && i !== parseInt(indiceActual))
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // Configurar validación de cédula
  configurarValidacionCedula('cedula', 'cedula-error');

  // Cargar técnicos en el select (solo para Actualizar Técnico)
  cargarTecnicosSelect();

  // Formulario de Registro
  const formRegistro = document.getElementById("formulario-tecnico");
  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();

      const cedula = document.getElementById("cedula").value;
      const resultadoCedula = validarCedula(cedula);
      if (!resultadoCedula.valido) {
        document.getElementById("cedula").classList.add('error');
        document.getElementById("cedula-error").textContent = resultadoCedula.mensaje;
        return;
      }

      const tecnico = {
        cedula,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
        especialidad: document.getElementById("especialidad").value,
        estado: "Activo",
        tipoPersona: "Tecnico"
      };

      let tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];
      const indice = document.getElementById("indice-edicion").value;

      const unicidad = validarUnicidad(tecnico, tecnicos, indice);
      if (unicidad.cedula) {
        document.getElementById("cedula").classList.add('error');
        document.getElementById("cedula-error").textContent = "La cédula ya está registrada";
        return;
      }
      if (unicidad.email) {
        alert("El email ya está registrado");
        return;
      }
      if (unicidad.telefono) {
        alert("El teléfono ya está registrado");
        return;
      }

      if (indice === "") {
        tecnicos.push(tecnico);
        alert("Técnico registrado localmente.");
      } else {
        tecnicos[indice] = tecnico;
        alert("Técnico actualizado.");
        document.getElementById("btn-crear").textContent = "Crear";
      }

      localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
      formRegistro.reset();
      document.getElementById("indice-edicion").value = "";
      document.getElementById("cedula").classList.remove('error');
      document.getElementById("cedula-error").textContent = "";
    });
  }

  // Formulario de Actualización
  const formActualizar = document.getElementById("formulario-actualizar-tecnico");
  if (formActualizar) {
    formActualizar.addEventListener("submit", (e) => {
      e.preventDefault();

      const select = document.getElementById("tecnico");
      const indice = select.value;
      if (indice === "" || isNaN(indice)) {
        select.classList.add('error');
        document.getElementById("tecnico-error").textContent = "Por favor seleccione un técnico";
        return;
      }

      const cedula = document.getElementById("cedula").value;
      const resultadoCedula = validarCedula(cedula);
      if (!resultadoCedula.valido) {
        document.getElementById("cedula").classList.add('error');
        document.getElementById("cedula-error").textContent = resultadoCedula.mensaje;
        return;
      }

      const tecnico = {
        cedula,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
        especialidad: document.getElementById("especialidad").value,
        estado: document.getElementById("estado").value,
        tipoPersona: "Tecnico"
      };

      let tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];

      const unicidad = validarUnicidad(tecnico, tecnicos, indice);
      if (unicidad.cedula) {
        document.getElementById("cedula").classList.add('error');
        document.getElementById("cedula-error").textContent = "La cédula ya está registrada";
        return;
      }
      if (unicidad.email) {
        alert("El email ya está registrado");
        return;
      }
      if (unicidad.telefono) {
        alert("El teléfono ya está registrado");
        return;
      }

      tecnicos[indice] = tecnico;
      localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
      alert("Técnico actualizado correctamente.");
      window.location.href = "ConsultarTecnicos.html";
    });
  }
});