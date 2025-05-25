document.addEventListener("DOMContentLoaded", () => {
  mostrarClientes();
});

document.getElementById("formulario-cliente").addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = {
    cedula: document.getElementById("cedula").value,
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    direccion: document.getElementById("direccion").value
  };

  let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  // Evitar duplicados por cédula
  const existe = clientes.some(c => c.cedula === cliente.cedula);
  if (existe) {
    alert("Ya existe un cliente con esta cédula.");
    return;
  }

  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  alert("Cliente registrado correctamente.");
  this.reset();
  mostrarClientes();
});

function mostrarClientes() {
  const tabla = document.querySelector("#tabla-clientes tbody");
  if (!tabla) return; // Si no hay tabla en esta página, salta

  tabla.innerHTML = "";

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  clientes.forEach(cliente => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cliente.cedula}</td>
      <td>${cliente.nombre}</td>
      <td>${cliente.apellido}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.email}</td>
      <td>${cliente.direccion}</td>
    `;
    tabla.appendChild(fila);
  });
}