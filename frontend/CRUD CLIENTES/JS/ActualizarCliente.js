document.addEventListener('DOMContentLoaded', () => {
  const listaClientes = document.getElementById('lista-clientes');
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  const crearListaClientes = () => {
    if (clientes.length === 0) {
      listaClientes.innerHTML = '<li>No hay clientes registrados.</li>';
      return;
    }

    listaClientes.innerHTML = '';
    clientes.forEach((cliente, index) => {
      const li = document.createElement('li');
      li.classList.add('cliente-item');
      li.innerHTML = `
        <span><strong>Cédula:</strong> ${cliente.cedula}</span> |
        <span><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellido}</span> |
        <span><strong>Teléfono:</strong> ${cliente.telefono}</span> |
        <span><strong>Email:</strong> ${cliente.email}</span> |
        <span><strong>Dirección:</strong> ${cliente.direccion}</span>
        <a href="editarcliente.html" class="btn-editar" data-indice="${index}">✏️</a>
        <button class="btn-eliminar" data-indice="${index}">🗑️</button>
      `;
      listaClientes.appendChild(li);
    });

    // Evento para botones Editar
    document.querySelectorAll('.btn-editar').forEach((boton) => {
      boton.addEventListener('click', (event) => {
        const indice = event.target.getAttribute('data-indice');
        localStorage.setItem('indiceEdicion', indice);
      });
    });

    // Evento para botones Eliminar
    document.querySelectorAll('.btn-eliminar').forEach((boton) => {
      boton.addEventListener('click', (event) => {
        const indice = event.target.getAttribute('data-indice');
        eliminarCliente(indice);
      });
    });
  };

  const eliminarCliente = (indice) => {
    const confirmacion = confirm('¿Seguro que deseas eliminar este cliente?');
    if (!confirmacion) return;

    clientes.splice(indice, 1);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    crearListaClientes(); // Recargar lista
  };

  crearListaClientes();
});
