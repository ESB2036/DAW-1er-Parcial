document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tablaResultados");

  // Obtener datos de localStorage
  const reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

  // Verificar si hay datos
  if (reparaciones.length === 0) {
    const filaVacia = document.createElement("tr");
    filaVacia.innerHTML = `
      <td colspan="6">No hay reparaciones registradas.</td>
    `;
    tbody.appendChild(filaVacia);
    return;
  }

  // Llenar la tabla
  reparaciones.forEach((reparacion) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reparacion.vehiculo}</td>
      <td>${reparacion.tecnico}</td>
      <td>${reparacion.descripcion}</td>
      <td>${reparacion.diagnostico}</td>
      <td>${reparacion.tipo}</td>
      <td>$${parseFloat(reparacion.costo).toFixed(2)}</td>
    `;
    tbody.appendChild(fila);
  });
});
