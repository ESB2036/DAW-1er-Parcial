document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReparacion");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener los datos del formulario
    const nuevaReparacion = {
      vehiculo: document.getElementById("vehiculo").value,
      tecnico: document.getElementById("tecnico").value,
      descripcion: document.getElementById("descripcion").value,
      diagnostico: document.getElementById("diagnostico").value,
      tipo: document.getElementById("tipo").value,
      costo: document.getElementById("costo").value
    };

    // Leer reparaciones previas del localStorage
    let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

    // Agregar nueva reparación
    reparaciones.push(nuevaReparacion);

    // Guardar en localStorage
    localStorage.setItem("reparaciones", JSON.stringify(reparaciones));

    alert("Reparación registrada correctamente.");

    // Redirigir a la página de consulta
    window.location.href = "../HTML/consultar.html";
  });
});
