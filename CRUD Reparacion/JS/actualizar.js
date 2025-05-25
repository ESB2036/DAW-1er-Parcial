document.addEventListener("DOMContentLoaded", () => {
  const tablaReparaciones = document.getElementById("tablaReparaciones");
  const formularioEditarContainer = document.getElementById("formularioEditarContainer");
  const formEditar = document.getElementById("formEditar");

  let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
  let indexAEditar = null;

  function mostrarReparaciones() {
    tablaReparaciones.innerHTML = "";

    if (reparaciones.length === 0) {
      const filaVacia = document.createElement("tr");
      filaVacia.innerHTML = `<td colspan="7">No hay reparaciones registradas.</td>`;
      tablaReparaciones.appendChild(filaVacia);
      return;
    }

    reparaciones.forEach((rep, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${rep.vehiculo}</td>
        <td>${rep.tecnico}</td>
        <td>${rep.descripcion}</td>
        <td>${rep.diagnostico}</td>
        <td>${rep.tipo}</td>
        <td>$${parseFloat(rep.costo).toFixed(2)}</td>
        <td>
          <i class="fa-solid fa-pen-to-square" style="color:green; cursor:pointer;" title="Editar" data-index="${index}"></i>
          <i class="fa-solid fa-trash" style="color:red; cursor:pointer; margin-left:10px;" title="Eliminar" data-index="${index}"></i>
        </td>
      `;
      tablaReparaciones.appendChild(fila);
    });

    // Asignar eventos a botones de acción
    document.querySelectorAll(".fa-pen-to-square").forEach(btn => {
      btn.addEventListener("click", (e) => {
        indexAEditar = e.target.dataset.index;
        cargarDatosEnFormulario(reparaciones[indexAEditar]);
        formularioEditarContainer.classList.remove("hidden");
        window.scrollTo(0, document.body.scrollHeight);
      });
    });

    document.querySelectorAll(".fa-trash").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (confirm("¿Estás seguro de eliminar esta reparación?")) {
          reparaciones.splice(index, 1);
          localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
          mostrarReparaciones();
        }
      });
    });
  }

  function cargarDatosEnFormulario(rep) {
    document.getElementById("vehiculoEditar").value = rep.vehiculo;
    document.getElementById("tecnicoEditar").value = rep.tecnico;
    document.getElementById("descripcionEditar").value = rep.descripcion;
    document.getElementById("diagnosticoEditar").value = rep.diagnostico;
    document.getElementById("tipoEditar").value = rep.tipo;
    document.getElementById("costoEditar").value = rep.costo;
  }

  formEditar.addEventListener("submit", (e) => {
    e.preventDefault();

    const reparacionEditada = {
      vehiculo: document.getElementById("vehiculoEditar").value,
      tecnico: document.getElementById("tecnicoEditar").value,
      descripcion: document.getElementById("descripcionEditar").value,
      diagnostico: document.getElementById("diagnosticoEditar").value,
      tipo: document.getElementById("tipoEditar").value,
      costo: document.getElementById("costoEditar").value
    };

    reparaciones[indexAEditar] = reparacionEditada;
    localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
    formularioEditarContainer.classList.add("hidden");
    formEditar.reset();
    mostrarReparaciones();
    alert("Reparación actualizada correctamente.");
  });

  mostrarReparaciones();
});
