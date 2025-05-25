document.getElementById("button-return").addEventListener("click", () => {
  // Redirige a la página principal:
  window.location.href = "index.html";
});

// Filtro en la tabla de vehículos:
document.getElementById("search-filter").addEventListener("input", function () {
  const Filtro = this.value.toLowerCase().trim();
  const Filas = document.querySelectorAll("#table-repairs tbody tr");

  Filas.forEach((fila) => {
    // Se obtienen los valores de las celdas relevantes para búsqueda:
    const Cedula = fila.cells[0].textContent.toLowerCase();
    const Cliente = fila.cells[1].textContent.toLowerCase();
    const Placa = fila.cells[2].textContent.toLowerCase();
    const Marca = fila.cells[3].textContent.toLowerCase();
    const Modelo = fila.cells[4].textContent.toLowerCase();

    // Verifica si el filtro coincide con alguna de las columnas:
    const Coincide =
      Cedula.includes(Filtro) ||
      Cliente.includes(Filtro) ||
      Placa.includes(Filtro) ||
      Marca.includes(Filtro) ||
      Modelo.includes(Filtro);

    // Muestra u oculta la fila según la coincidencia:
    fila.style.display = Coincide ? "" : "none";
  });
});

// Estilizado de celdas por estado de la reparación:
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("td").forEach((celda) => {
    const EstadoReparacion = celda.textContent.trim().toLowerCase();

    switch (EstadoReparacion) {
      case "completada":
        celda.style.backgroundColor = "#c8e6c9";
        celda.style.color = "green";
        celda.style.fontWeight = "bold";
        break;

      case "en proceso":
        celda.style.backgroundColor = "rgb(255 231 165)";
        celda.style.color = "#6b5400";
        celda.style.fontWeight = "bold";
        break;

      case "pendiente":
        celda.style.backgroundColor = "rgb(219 219 219)";
        celda.style.color = "black";
        celda.style.fontWeight = "bold";
        break;
    }
  });
});
