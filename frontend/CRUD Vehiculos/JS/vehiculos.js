const clientesDummy = [
  { id: "1", nombre: "Juan Pérez" },
  { id: "2", nombre: "Ana López" },
  { id: "3", nombre: "Carlos Sánchez" }
];

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("cliente");
  clientesDummy.forEach(cliente => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nombre;
    select.appendChild(option);
  });

  mostrarVehiculos();
});

document.getElementById("formulario-vehiculo").addEventListener("submit", function (e) {
  e.preventDefault();

  const vehiculo = {
    cliente_id: document.getElementById("cliente").value,
    placa: document.getElementById("placa").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    anio: document.getElementById("anio").value,
    color: document.getElementById("color").value,
    kilometraje: document.getElementById("kilometraje").value
  };

  let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  const indice = document.getElementById("indice-edicion").value;

  if (indice === "") {
    vehiculos.push(vehiculo);
    alert("Vehículo registrado localmente.");
  } else {
    vehiculos[indice] = vehiculo;
    alert("Vehículo actualizado.");
    document.getElementById("btn-crear").textContent = "Crear";
  }

  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  this.reset();
  document.getElementById("indice-edicion").value = "";
  mostrarVehiculos();
});

function mostrarVehiculos() {
  const tbody = document.querySelector("#tabla-vehiculos tbody");
  tbody.innerHTML = "";

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  vehiculos.forEach((v, i) => {
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
      <td class="acciones">
        <button onclick="editarVehiculo(${i})">✏️</button>
        <button onclick="eliminarVehiculo(${i})">🗑️</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function editarVehiculo(indice) {
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  const v = vehiculos[indice];

  document.getElementById("cliente").value = v.cliente_id;
  document.getElementById("placa").value = v.placa;
  document.getElementById("marca").value = v.marca;
  document.getElementById("modelo").value = v.modelo;
  document.getElementById("anio").value = v.anio;
  document.getElementById("color").value = v.color;
  document.getElementById("kilometraje").value = v.kilometraje;

  document.getElementById("indice-edicion").value = indice;
  document.getElementById("btn-crear").textContent = "Actualizar";
}

function eliminarVehiculo(indice) {
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
    vehiculos.splice(indice, 1);
    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    mostrarVehiculos();
  }
}
