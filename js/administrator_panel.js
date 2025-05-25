document.getElementById("button-logout").addEventListener("click", function () {
  let logout = confirm("¿Seguro de que desea cerrar sesión?");

  if (logout) {
    // Redirige a la página de inicio:
    window.location.href = "index.html";
  }
});

document
  .getElementById("button-customers")
  .addEventListener("click", function () {
    window.location.href = "./managments/customer_managment.html";
  });

document
  .getElementById("button-vehicles")
  .addEventListener("click", function () {
    window.location.href = "./managments/vehicle_managment.html";
  });

document
  .getElementById("button-technicians")
  .addEventListener("click", function () {
    window.location.href = "./managments/technician_managment.html";
  });

document
  .getElementById("button-repairs")
  .addEventListener("click", function () {
    window.location.href = "./managments/repair_managment.html";
  });

document
  .getElementById("button-administrators")
  .addEventListener("click", function () {
    window.location.href = "./managments/administrator_managment.html";
  });

document
  .getElementById("button-invoices")
  .addEventListener("click", function () {
    window.location.href = "./managments/invoice_managment.html";
  });
