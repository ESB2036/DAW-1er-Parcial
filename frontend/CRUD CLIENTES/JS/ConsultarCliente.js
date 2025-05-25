document.addEventListener("DOMContentLoaded", () => {
  mostrarClientes();

  // Buscador por cédula
  const inputBusqueda = document.getElementById("busqueda");
  inputBusqueda.addEventListener("input", () => {
    const filtro = inputBusqueda.value.trim().toLowerCase();
    mostrarClientes(filtro);
  });
});

function mostrarClientes(filtro = "") {
  const tbody = document.querySelector("#tabla-clientes tbody");
  tbody.innerHTML = "";

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  const filtrados = clientes.filter(cliente =>
    cliente.cedula.toLowerCase().includes(filtro)
  );

  filtrados.forEach((c) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${c.cedula}</td>
      <td>${c.nombre}</td>
      <td>${c.apellido}</td>
      <td>${c.telefono}</td>
      <td>${c.email}</td>
      <td>${c.direccion}</td>
    `;
    tbody.appendChild(fila);
  });
}