document.addEventListener('DOMContentLoaded', () => {
  const formularioVehiculo = document.getElementById('formulario-vehiculo');
  const indiceEdicion = document.getElementById('indice-edicion');

  // Cargar vehículos desde localStorage
  const vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];

  // Cargar datos del vehículo para edición
  const cargarDatosEdicion = () => {
    const indice = localStorage.getItem('indiceEdicion');  // Obtener el índice del vehículo desde localStorage

    if (indice !== null) {
      const vehiculo = vehiculos[indice];  // Obtener el vehículo correspondiente usando el índice
      if (vehiculo) {
        // Asignar los datos del vehículo a los campos del formulario
        indiceEdicion.value = indice;
        document.getElementById('placa').value = vehiculo.placa;
        document.getElementById('marca').value = vehiculo.marca;
        document.getElementById('modelo').value = vehiculo.modelo;
        document.getElementById('anio').value = vehiculo.anio;
        document.getElementById('color').value = vehiculo.color;
        document.getElementById('kilometraje').value = vehiculo.kilometraje;
      }
    }
  };

  cargarDatosEdicion();

  // Función para actualizar vehículo en localStorage
  formularioVehiculo.addEventListener('submit', (event) => {
    event.preventDefault();

    const indice = indiceEdicion.value;
    const vehiculoActualizado = {
      placa: document.getElementById('placa').value,
      marca: document.getElementById('marca').value,
      modelo: document.getElementById('modelo').value,
      anio: document.getElementById('anio').value,
      color: document.getElementById('color').value,
      kilometraje: document.getElementById('kilometraje').value,
    };

    vehiculos[indice] = vehiculoActualizado;  // Actualizar el vehículo en el array

    localStorage.setItem('vehiculos', JSON.stringify(vehiculos));  // Guardar los vehículos actualizados

    // Redirigir a la página de consulta de vehículos
    window.location.href = 'actualizacionvehiculos.html';  // Redirige a la página correcta
  });
});
