// PROYECTA-IA — Portal principal público.
//
// El portal principal NO solicita C.I.
// Cada chatbot individual mantiene su propio acceso y consulta la misma base central:
// https://luisctito-sketch.github.io/proyecta-ia-acceso/access.js
//
// Cuando ingresen nuevos estudiantes, solo se actualiza access.js en proyecta-ia-acceso.

document.querySelectorAll(".module-link").forEach(link => {
  link.addEventListener("click", () => {
    // El control de acceso se realiza dentro del chatbot seleccionado.
  });
});
