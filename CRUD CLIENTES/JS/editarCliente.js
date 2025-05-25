document.addEventListener('DOMContentLoaded', () => {
  const formularioCliente = document.getElementById('formulario-cliente');
  const indiceEdicionInput = document.getElementById('indice-edicion');

  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  // Obtener el índice desde localStorage
  const indice = localStorage.getItem('indiceEdicion');

  if (indice !== null) {
    const cliente = clientes[indice];

    if (cliente) {
      indiceEdicionInput.value = indice;
      document.getElementById('cedula').value = cliente.cedula;
      document.getElementById('nombre').value = cliente.nombre;
      document.getElementById('apellido').value = cliente.apellido;
      document.getElementById('telefono').value = cliente.telefono;
      document.getElementById('email').value = cliente.email;
      document.getElementById('direccion').value = cliente.direccion;
    }
  }

  formularioCliente.addEventListener('submit', (event) => {
    event.preventDefault();

    const indice = indiceEdicionInput.value;

    const clienteActualizado = {
      cedula: document.getElementById('cedula').value,
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      telefono: document.getElementById('telefono').value,
      email: document.getElementById('email').value,
      direccion: document.getElementById('direccion').value
    };

    clientes[indice] = clienteActualizado;
    localStorage.setItem('clientes', JSON.stringify(clientes));

    alert('Cliente actualizado correctamente.');

    localStorage.removeItem('indiceEdicion'); // Limpia el índice
    window.location.href = 'ActualizarClientes.html';
  });
});