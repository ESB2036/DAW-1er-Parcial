document.addEventListener('DOMContentLoaded', () => {
  const listaVehiculos = document.getElementById('lista-vehiculos');
  const vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];

  // Función para crear la lista de vehículos
  const crearListaVehiculos = () => {
    if (vehiculos.length === 0) {
      listaVehiculos.innerHTML = '<li>No hay vehículos registrados.</li>';
      return;
    }

    listaVehiculos.innerHTML = '';
    vehiculos.forEach((vehiculo, index) => {
      const li = document.createElement('li');
      li.classList.add('vehiculo-item');
      li.innerHTML = `
        <span><strong>Placa:</strong> ${vehiculo.placa}</span> |
        <span><strong>Marca:</strong> ${vehiculo.marca}</span> |
        <span><strong>Modelo:</strong> ${vehiculo.modelo}</span>
        <span><strong>KM:</strong> ${vehiculo.kilometraje}</span>
        <span><strong>Color:</strong> ${vehiculo.color}</span>
        <a href="editarvehiculos.html" class="btn-editar" data-indice="${index}">Editar</a>
      `;
      listaVehiculos.appendChild(li);
    });

    // Agregar eventos a los enlaces de "Editar"
    const enlacesEditar = document.querySelectorAll('.btn-editar');
    enlacesEditar.forEach((enlace) => {
      enlace.addEventListener('click', (event) => {
        const indice = event.target.getAttribute('data-indice');
        localStorage.setItem('indiceEdicion', indice);  // Guardar el índice del vehículo seleccionado
      });
    });
  };

  // Cargar la lista de vehículos
  crearListaVehiculos();
});
