function cargarTecnicos(filtro = "") {
  const tbody = document.querySelector("#tabla-tecnicos tbody");
  tbody.innerHTML = "";

  const tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];

  tecnicos.forEach((t, i) => {
    if (
      t.cedula.toLowerCase().includes(filtro.toLowerCase()) ||
      t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      t.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
      t.especialidad.toLowerCase().includes(filtro.toLowerCase())
    ) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${t.cedula}</td>
        <td>${t.nombre}</td>
        <td>${t.apellido}</td>
        <td>${t.telefono}</td>
        <td>${t.email}</td>
        <td>${t.especialidad}</td>
        <td>${t.estado}</td>
        <td class="acciones">
          <button onclick="eliminarTecnico(${i})">🗑️</button>
        </td>
      `;
      tbody.appendChild(fila);
    }
  });
}

function eliminarTecnico(indice) {
  const tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];
  if (confirm("¿Seguro que deseas eliminar este técnico?")) {
    tecnicos.splice(indice, 1);
    localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
    cargarTecnicos(document.getElementById("busqueda").value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("busqueda");

  input.addEventListener("input", () => {
    cargarTecnicos(input.value);
  });

  cargarTecnicos(); // Mostrar todos al cargar
});