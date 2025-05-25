const clientesDummy = [
  { id: "1", nombre: "Juan Pérez" },
  { id: "2", nombre: "Ana López" },
  { id: "3", nombre: "Carlos Sánchez" }
];

function cargarVehiculos(filtro = "") {
  const tbody = document.querySelector("#tabla-vehiculos tbody");
  tbody.innerHTML = "";

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  vehiculos.forEach((v) => {
    if (v.placa.toLowerCase().includes(filtro.toLowerCase())) {
      const clienteNombre = clientesDummy.find(c => c.id === v.cliente_id)?.nombre || "Desconocido";

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${clienteNombre}</td>
        <td>${v.placa}</td>
        <td>${v.marca}</td>
        <td>${v.modelo}</td>
        <td>${v.anio}</td>
        <td>${v.color}</td>
        <td>${v.kilometraje}</td>
      `;
      tbody.appendChild(fila);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("busqueda");

  input.addEventListener("input", () => {
    cargarVehiculos(input.value);
  });

  cargarVehiculos(); // Mostrar todos al cargar
});
