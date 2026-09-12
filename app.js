// Portal público de PROYECTA-IA.
// El control de acceso permanece únicamente dentro de cada chatbot.
// Los enlaces se abren en una pestaña nueva y cada módulo solicita el C.I. autorizado.

document.querySelectorAll(".module-link").forEach(link=>{
  link.addEventListener("click", ()=>{
    // No se almacena información personal ni académica en este portal.
  });
});
