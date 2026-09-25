// PROYECTA-IA — Portal central actualizado.
// La autenticación se gestiona exclusivamente desde:
// https://luisctito-sketch.github.io/proyecta-ia-acceso/access.js
//
// Por ello, cuando ingresen nuevos estudiantes, no es necesario modificar este portal
// ni los chatbots individuales: solo se actualiza el access.js central.

document.querySelectorAll(".module-link").forEach(link=>{
  link.addEventListener("click", ()=>{
    // No se almacena información académica en el portal.
  });
});
