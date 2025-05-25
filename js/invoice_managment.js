const buttonCreateInvoice = document.getElementById("button-create-invoice");
const buttoReadInvoice = document.getElementById("button-read-invoice");
const buttoUpdateInvoice = document.getElementById("button-update-invoice");

buttonCreateInvoice.addEventListener("click", function () {
  // Redirigir a la página de crear de factura:
  window.location.href = "../CRUDs/Create/create_invoice.html";
});

buttoReadInvoice.addEventListener("click", function () {
  // Redirigir a la página de consulta de facturas:
  window.location.href = "../CRUDs/Read/read_invoice.html";
});

buttoUpdateInvoice.addEventListener("click", function () {
  // Redirigir a la página de actualizar de facturas:
  window.location.href = "../CRUDs/Update/update_invoice.html";
});
