document
  .getElementById("button-consult-repairs-for-customers")
  .addEventListener("click", function () {
    // Dirige a la página de consulta de los vehículos que están siendo reparados en el taller:
    window.location.href = "consult_repairs_for_customers.html";
  });

document.getElementById("button-login").addEventListener("click", function () {
  // Dirige a la página con el formulario de login para administradores:
  window.location.href = "login.html";
});
