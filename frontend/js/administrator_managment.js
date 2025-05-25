const buttoReadInvoice = document.getElementById("button-read-administrator");
const buttoUpdateInvoice = document.getElementById(
  "button-update-administrator"
);

buttoReadInvoice.addEventListener("click", function () {
  // Redirigir a la página de consulta de administradores:
  window.location.href = "../CRUDs/Read/read_administrator.html";
});

buttoUpdateInvoice.addEventListener("click", function () {
  // Redirigir a la página de actualizar de administradores:
  window.location.href = "../CRUDs/Update/update_administrator.html";
});
