const $ = id => document.getElementById(id);
const esc = s => (s ?? "").toString().replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmtMin = m => {
  const sec=Math.round(Number(m)*60), mm=Math.floor(sec/60), ss=sec%60;
  return `${mm}:${String(ss).padStart(2,"0")}`;
};

const baseSections = [
  {name:"Carátula",slides:1,time:.25,purpose:"Presentación e identificación del proyecto."},
  {name:"Antecedentes + formulación del problema",slides:1,time:1.5,purpose:"Contexto breve y problema que se resolvió."},
  {name:"Objetivo General y Objetivos Específicos",slides:1,time:.5,purpose:"Qué se propuso alcanzar."},
  {name:"Alcance y limitaciones",slides:1,time:1,purpose:"Hasta dónde llega el trabajo y qué queda fuera."},
  {name:"Marco Teórico",slides:2,time:2,purpose:"Solo fundamentos indispensables para comprender la solución."},
  {name:"Marco Práctico / Ingeniería del Proyecto",slides:8,time:10,purpose:"Diseño, cálculos, simulación, implementación y resultados técnicos."},
  {name:"Análisis económico",slides:1,time:1,purpose:"Costo y viabilidad económica correspondiente."},
  {name:"Conclusiones y recomendaciones",slides:2,time:1.5,purpose:"Qué se logró y qué se recomienda."}
];
let planner = JSON.parse(JSON.stringify(baseSections));

function renderPlanner(){
  const body=$("plannerBody");
  body.innerHTML=planner.map((s,i)=>`<tr>
    <td><b>${esc(s.name)}</b></td>
    <td><input class="p-slides" data-i="${i}" type="number" min="0" max="20" value="${s.slides}"></td>
    <td><input class="p-time" data-i="${i}" type="number" min="0" step="0.25" max="30" value="${s.time}"></td>
    <td>${esc(s.purpose)}</td></tr>`).join("");
  document.querySelectorAll(".p-slides").forEach(x=>x.addEventListener("input",e=>{planner[+e.target.dataset.i].slides=+e.target.value;summaryPlanner()}));
  document.querySelectorAll(".p-time").forEach(x=>x.addEventListener("input",e=>{planner[+e.target.dataset.i].time=+e.target.value;summaryPlanner()}));
  summaryPlanner();
}
function summaryPlanner(){
  const slides=planner.reduce((a,b)=>a+Number(b.slides||0),0);
  const used=planner.reduce((a,b)=>a+Number(b.time||0),0);
  const allowed=Number($("slideMinutes").value||20);
  const proto=Number($("prototypeMinutes").value||10);
  const slack=allowed-used;
  const status=slack>=1.5?"🟢 Cómodo":slack>=0?"🟡 Ajustado":"🔴 Excedido";
  $("plannerSummary").innerHTML=`
    <div class="summary-kpi"><b>${slides}</b><span>diapositivas</span></div>
    <div class="summary-kpi"><b>${fmtMin(used)}</b><span>contenido planificado</span></div>
    <div class="summary-kpi"><b>${slack>=0?fmtMin(slack):"-"+fmtMin(Math.abs(slack))}</b><span>holgura</span></div>
    <div class="summary-kpi"><b>${status}</b><span>total sesión: ${fmtMin(allowed+proto)}</span></div>`;
}
$("slideMinutes").addEventListener("input",summaryPlanner);
$("prototypeMinutes").addEventListener("input",summaryPlanner);
$("resetPlanner").addEventListener("click",()=>{planner=JSON.parse(JSON.stringify(baseSections));$("slideMinutes").value=20;$("prototypeMinutes").value=10;renderPlanner()});
$("copyPlanner").addEventListener("click",async()=>{
  const t=planner.map((s,i)=>`${i+1}. ${s.name}: ${s.slides} diap. · ${fmtMin(s.time)}`).join("\n");
  await navigator.clipboard.writeText(`PLAN PROYECTA-IA\n${t}\nTiempo diapositivas: ${$("slideMinutes").value} min\nPrototipo: ${$("prototypeMinutes").value} min`);
  $("copyPlanner").textContent="Copiado";setTimeout(()=>$("copyPlanner").textContent="Copiar plan",1300);
});
renderPlanner();

$("reviewSlideBtn").addEventListener("click",()=>{
  const w=+$("wordsPerSlide").value, ideas=+$("ideasPerSlide").value, font=+$("minFont").value, vis=+$("visualCount").value;
  let issues=[],good=[];
  if(ideas>1)issues.push("Hay más de una idea principal. Divide el contenido o establece una jerarquía muy clara.");else good.push("La diapositiva conserva una idea central.");
  if(w>65)issues.push("La cantidad de texto es alta. Reduce a palabras clave, frases breves y datos esenciales.");
  else if(w>45)issues.push("La diapositiva puede estar algo cargada; comprueba que no te obligue a leer."); else good.push("La densidad textual es razonable.");
  if(font<20)issues.push("El texto mínimo puede resultar pequeño para un aula. Aumenta la tipografía y elimina contenido secundario.");else good.push("El tamaño mínimo es compatible con una lectura a distancia.");
  if(vis===0)issues.push("Considera un diagrama, fotografía, gráfico o ícono si aporta comprensión.");else if(vis>3)issues.push("Hay muchos elementos visuales principales; verifica que no compitan entre sí.");else good.push("La cantidad de elementos visuales es manejable.");
  const cls=issues.length>=3?"bad":issues.length?"warn":"ok";
  $("slideReviewOutput").className=`output-box ${cls}`;
  $("slideReviewOutput").innerHTML=`<h4>${issues.length>=3?"🔴 Simplifica":issues.length?"🟡 Revisa":"🟢 Bien encaminada"}</h4>
  ${good.length?`<p><b>Fortalezas:</b></p><ul>${good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
  ${issues.length?`<p><b>Ajustes:</b></p><ul>${issues.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}`;
  $("slideReviewOutput").classList.remove("hidden");
});

const questions=[
  ["¿Cuál es exactamente el problema que resuelve su proyecto?","Responde en una oración y sustenta después con la evidencia diagnóstica más importante."],
  ["¿Por qué eligió esa tecnología y no otra?","Cita criterios comparativos: precisión, compatibilidad, costo, disponibilidad, robustez o mantenimiento."],
  ["¿Qué parte del sistema diseñó usted?","Distingue claramente diseño propio, integración de módulos, programación, cálculo, simulación e implementación."],
  ["¿Cómo comprobó que el sistema funciona?","Describe protocolo de prueba, instrumento de referencia, número de repeticiones y resultado cuantitativo."],
  ["¿Cuál es la principal limitación técnica del proyecto?","Reconoce una limitación real y explica cómo se controló o qué trabajo futuro requiere."],
  ["¿Qué error o incertidumbre tienen sus mediciones?","Indica método, referencia, magnitud y cómo afecta la interpretación del resultado."],
  ["¿Cómo se relaciona este resultado con su Objetivo General?","Vincula resultado, acción del objetivo y evidencia, sin repetir el objetivo de memoria."],
  ["¿Qué ocurriría si falla un sensor o la comunicación?","Explica estado seguro, alarmas, validación de datos, redundancia o procedimiento de contingencia si existe."],
  ["¿Por qué su solución es económicamente justificable?","Resume costo, beneficio/ahorro o criterio económico que realmente calculaste."],
  ["¿Qué cambiaría para llevar el prototipo a una instalación definitiva?","Menciona PCB, gabinete, protecciones, certificación, calibración, mantenimiento y pruebas prolongadas cuando correspondan."],
  ["¿Qué aporte concreto realiza su proyecto?","Expresa el valor técnico o social sin usar frases genéricas como «es innovador» si no puedes demostrarlo."],
  ["¿Cuál fue la decisión de ingeniería más difícil?","Describe alternativas, criterio elegido y consecuencia técnica de esa decisión."]
];
let currentQ=null;
$("newQuestionBtn").addEventListener("click",()=>{
  currentQ=questions[Math.floor(Math.random()*questions.length)];
  $("questionBox").textContent=currentQ[0];$("answerGuide").classList.add("hidden");
});
$("showGuideBtn").addEventListener("click",()=>{
  if(!currentQ){$("newQuestionBtn").click();}
  $("answerGuide").className="output-box ok";
  $("answerGuide").innerHTML=`<b>Guía:</b> ${esc(currentQ[1])}<br><span class="small">No memorices esta frase; úsala para estructurar tu propia respuesta.</span>`;
});

let timerSec=20*60, timerId=null, running=false;
function paintTimer(){
  const m=Math.floor(timerSec/60),s=timerSec%60;
  $("timerDisplay").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  if(timerSec<=120)$("timerMessage").textContent="Estás dentro de los 2 minutos finales de holgura.";
  if(timerSec===0)$("timerMessage").textContent="Tiempo agotado. En la defensa real ya deberías haber cerrado.";
}
$("startTimer").addEventListener("click",()=>{
  if(running)return;running=true;
  timerId=setInterval(()=>{if(timerSec>0){timerSec--;paintTimer()}else{clearInterval(timerId);running=false}},1000);
});
$("pauseTimer").addEventListener("click",()=>{clearInterval(timerId);running=false});
$("resetTimer").addEventListener("click",()=>{clearInterval(timerId);running=false;timerSec=Math.round(Number($("slideMinutes").value||20)*60);$("timerMessage").textContent="Tiempo base para diapositivas.";paintTimer()});
$("slideMinutes").addEventListener("change",()=>{$("resetTimer").click()});
paintTimer();

$("evaluatePractice").addEventListener("click",()=>{
  const target=+$("slideMinutes").value||20, real=+$("realPracticeTime").value, reps=+$("fullRehearsals").value;
  let msg=[],cls="ok";
  if(real>target){msg.push(`Tu ensayo supera el tiempo por ${(real-target).toFixed(1)} min. Elimina contenido secundario antes de intentar hablar más rápido.`);cls="bad";}
  else if(real>target-1){msg.push("Estás demasiado cerca del límite. Busca al menos 1–2 minutos de margen para preguntas, transiciones o imprevistos.");cls="warn";}
  else msg.push("El tiempo deja un margen razonable.");
  if(reps<2){msg.push("Aún falta repetición. Ensaya la defensa completa varias veces, no solo secciones aisladas.");if(cls==="ok")cls="warn";}
  else if(reps<5)msg.push("Ya existe práctica, pero conviene repetir en condiciones similares a la defensa.");
  else msg.push("El número de ensayos completos aporta familiaridad con el recorrido.");
  $("practiceOutput").className=`output-box ${cls}`;
  $("practiceOutput").innerHTML=`<h4>${cls==="ok"?"🟢 Buen ritmo":cls==="warn"?"🟡 Ajusta":"🔴 Reestructura"}</h4><ul>${msg.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
  $("practiceOutput").classList.remove("hidden");
});

const checklist=[
  "El archivo abre sin errores en el equipo que se utilizará.",
  "Existe copia en USB y otra copia en la nube/correo.",
  "La presentación contiene aproximadamente 16–17 diapositivas para el plan base.",
  "La Ingeniería del Proyecto recibe la mayor parte del tiempo.",
  "Cada diapositiva comunica una idea principal.",
  "Los títulos son visibles y consistentes.",
  "Las gráficas tienen ejes, unidades y etiquetas legibles.",
  "Las fotografías muestran con claridad el prototipo y sus partes.",
  "Las tablas grandes fueron reemplazadas por síntesis visuales.",
  "No existen párrafos del documento copiados literalmente.",
  "El expositor puede explicar todas las fórmulas que aparecen.",
  "El Objetivo General y los resultados se relacionan claramente.",
  "Las conclusiones incluyen evidencia y no frases genéricas.",
  "El prototipo fue probado antes del día de la defensa.",
  "Existe Plan B: fotografías, video y capturas de mediciones.",
  "Fuente de alimentación, cables, adaptadores y extensiones están preparados.",
  "Se ensayó la exposición completa con cronómetro.",
  "Se ensayó la demostración del prototipo por separado.",
  "Se practicaron respuestas a preguntas técnicas.",
  "Se preparó una respuesta clara sobre limitaciones.",
  "Se sabe justificar por qué se eligieron los componentes principales.",
  "La postura, contacto visual y movimientos fueron ensayados.",
  "No se depende de leer las diapositivas.",
  "Se asistió u observó al menos una defensa/sustentación previa, si fue posible.",
  "Se conoce el procedimiento al finalizar la defensa y durante la deliberación del tribunal."
];
const saved=JSON.parse(localStorage.getItem("proyecta_defensa_check")||"[]");
function renderChecklist(){
  $("checklistItems").innerHTML=checklist.map((x,i)=>`<label class="check-item"><input type="checkbox" data-i="${i}" ${saved.includes(i)?"checked":""}><span>${esc(x)}</span></label>`).join("");
  document.querySelectorAll(".check-item input").forEach(cb=>cb.addEventListener("change",updateChecklist));
  updateChecklist();
}
function updateChecklist(){
  const marked=[...document.querySelectorAll(".check-item input")].filter(x=>x.checked).map(x=>+x.dataset.i);
  localStorage.setItem("proyecta_defensa_check",JSON.stringify(marked));
  const pct=Math.round(marked.length/checklist.length*100);
  $("checkBar").style.width=pct+"%";$("checkText").textContent=`${pct} % completado · ${marked.length}/${checklist.length}`;
}
$("resetChecklist").addEventListener("click",()=>{localStorage.removeItem("proyecta_defensa_check");document.querySelectorAll(".check-item input").forEach(x=>x.checked=false);updateChecklist()});
renderChecklist();

function personalText(){
  const title=$("projectTitle").value.trim()||"[Título del proyecto]";
  const problem=$("projectProblem").value.trim()||"[Problema central]";
  const objective=$("projectObjective").value.trim()||"[Objetivo General]";
  const result=$("projectResult").value.trim()||"[Resultado técnico principal]";
  const proto=$("projectPrototype").value.trim()||"[Prototipo o demostración]";
  return {title,problem,objective,result,proto};
}
$("buildDefensePlan").addEventListener("click",()=>{
  const d=personalText();
  $("personalPlan").className="output-box ok";
  $("personalPlan").innerHTML=`<h4>Ruta personal sugerida</h4>
  <ol>
    <li><b>Apertura:</b> presenta <i>${esc(d.title)}</i> y anticipa en una frase el problema.</li>
    <li><b>Problema:</b> explica «${esc(d.problem)}» usando una evidencia visual o cuantitativa.</li>
    <li><b>Objetivo:</b> conecta el problema con «${esc(d.objective)}».</li>
    <li><b>Ingeniería:</b> dedica el bloque principal a arquitectura, decisiones de diseño, cálculos, simulación e implementación.</li>
    <li><b>Resultado central:</b> destaca «${esc(d.result)}» con gráfico, fotografía o medición legible.</li>
    <li><b>Demostración:</b> muestra «${esc(d.proto)}» siguiendo propósito → prueba → medición → cierre.</li>
    <li><b>Cierre:</b> responde en una frase: ¿qué problema quedó atendido, con qué evidencia y qué queda como mejora futura?</li>
  </ol>`;
  $("personalPlan").classList.remove("hidden");
});
function promptText(){
  const d=personalText();
  return `ACTÚA COMO TRIBUNAL ACADÉMICO DE UNA PREDEFENSA/DEFENSA DE PROYECTO DE GRADO DE INGENIERÍA.

TÍTULO:
${d.title}

PROBLEMA:
${d.problem}

OBJETIVO GENERAL:
${d.objective}

RESULTADO TÉCNICO PRINCIPAL:
${d.result}

PROTOTIPO / DEMOSTRACIÓN:
${d.proto}

CONDICIONES DE LA DEFENSA:
- 20 minutos de exposición con diapositivas.
- Aproximadamente 16–17 diapositivas.
- 10 minutos para demostrar el prototipo.
- La mayor parte de la exposición debe concentrarse en la Ingeniería del Proyecto.
- No debo leer las diapositivas.
- Las respuestas al tribunal deben ser breves, técnicas y sustentadas.

ENTRÉNAME ASÍ:
1. Hazme una sola pregunta por vez.
2. Alterna preguntas sobre problema, objetivos, metodología, selección tecnológica, cálculos, diseño, simulación, implementación, pruebas, incertidumbre, análisis económico, limitaciones y conclusiones.
3. Después de cada respuesta mía, evalúa: claridad, precisión técnica, evidencia, seguridad y brevedad.
4. Señala primero el error o vacío; luego dime cómo mejorar mi razonamiento sin redactar una respuesta para memorizar.
5. Formula repreguntas cuando mi respuesta sea superficial.
6. Incluye preguntas difíciles de un tribunal exigente, pero mantén tono académico y profesional.
7. Al final de 10 preguntas, dame una calificación sobre 100 y tres prioridades de mejora.`;
}
$("copyDefensePrompt").addEventListener("click",async()=>{
  await navigator.clipboard.writeText(promptText());
  $("copyStatus").textContent="Prompt de ensayo copiado.";
  setTimeout(()=>$("copyStatus").textContent="",1600);
});


// --- Revisión integral de diapositivas ---
function deckReviewPrompt(){
  const slides = +$("reviewSlideCount").value || 0;
  const time = +$("reviewTotalTime").value || 20;
  const font = +$("reviewFontSize").value || 0;
  const background = $("reviewBackground").value;
  const concern = $("reviewConcern").value.trim() || "No se indicó una preocupación específica.";
  const avg = slides ? time*60/slides : 0;

  return `ACTÚA COMO REVISOR ACADÉMICO Y DISEÑADOR DE PRESENTACIONES PARA LA PREDEFENSA O DEFENSA FINAL DE UN PROYECTO DE GRADO.

Voy a adjuntar mi presentación en PowerPoint, PDF o imágenes de las diapositivas.

DATOS:
- Número de diapositivas: ${slides}
- Tiempo de exposición: ${time} minutos
- Promedio aproximado disponible: ${avg.toFixed(0)} segundos por diapositiva
- Tamaño mínimo de letra declarado: ${font} pt
- Fondo predominante: ${background}
- Preocupaciones del estudiante: ${concern}

REVISA TODA LA PRESENTACIÓN CON LOS CRITERIOS DE PROYECTA-IA Y DEL VIDEO DEL DOCENTE:
1. Fondo, contraste y legibilidad.
2. Tipos de letra, tamaño, jerarquía y consistencia tipográfica.
3. Ubicación, alineación, márgenes y equilibrio visual.
4. Exceso de texto y uso de palabras clave.
5. Una idea principal por diapositiva.
6. Calidad y pertinencia de imágenes, diagramas, fotografías e íconos.
7. Claridad de tablas, gráficas, ejes, unidades y números clave.
8. Uso correcto de fórmulas: solo las que el expositor pueda explicar.
9. Coherencia visual entre diapositivas.
10. Correspondencia entre número de diapositivas y tiempo disponible.
11. Prioridad otorgada a la Ingeniería del Proyecto / Marco Práctico.
12. Calidad de las diapositivas de resultados, conclusiones y recomendaciones.
13. Riesgo de que el estudiante termine leyendo las diapositivas.
14. Posibles mejoras para la demostración del prototipo.
15. Errores concretos de diseño que deban corregirse antes de la defensa.

FORMA DE RESPONDER:
- Revisa primero la presentación global.
- Luego analiza diapositiva por diapositiva.
- Para cada diapositiva indica: FORTALEZA, PROBLEMA y MEJORA CONCRETA.
- No cambies el contenido técnico sin justificarlo.
- Señala textos demasiado pequeños, elementos desalineados, gráficos ilegibles o fondos que reduzcan el contraste.
- Estima si la secuencia puede exponerse dentro del tiempo disponible.
- Al final otorga una calificación de preparación visual y comunicativa sobre 100.
- Termina con las 5 correcciones prioritarias que deberían hacerse antes de la defensa.

Material audiovisual de referencia del docente:
https://youtu.be/q9mI0dHx6xg`;
}

$("quickDeckReview").addEventListener("click",()=>{
  const slides=+$("reviewSlideCount").value||0;
  const time=+$("reviewTotalTime").value||20;
  const font=+$("reviewFontSize").value||0;
  const bg=$("reviewBackground").value;
  const sec=slides?time*60/slides:0;
  let issues=[], good=[];

  if(slides>=16 && slides<=18 && Math.abs(time-20)<=2) good.push("La cantidad de diapositivas está cerca de la ruta base recomendada para una exposición de 20 minutos.");
  else if(slides>22 && time<=20) issues.push("La cantidad de diapositivas puede obligarte a avanzar demasiado rápido. Revisa si existen láminas repetitivas o secundarias.");
  else if(slides<12 && time>=20) issues.push("La presentación es muy breve para el tiempo disponible; comprueba que la Ingeniería del Proyecto tenga suficiente evidencia visual.");

  if(sec<45) issues.push(`Dispones de solo ${sec.toFixed(0)} s por diapositiva en promedio. Algunas secciones necesitarán mucha síntesis.`);
  else if(sec>90) good.push(`El promedio de ${sec.toFixed(0)} s por diapositiva ofrece margen para explicar sin precipitarse.`);
  else good.push(`El promedio de ${sec.toFixed(0)} s por diapositiva es manejable si las láminas son visuales y no se leen.`);

  if(font<20) issues.push("El tamaño mínimo declarado puede ser difícil de leer desde el fondo del aula. Aumenta tipografía y reduce texto.");
  else if(font>=24) good.push("El tamaño mínimo declarado es adecuado como referencia general para una presentación académica.");

  if(bg==="mixto") issues.push("Usar fondos muy diferentes puede romper la identidad visual. Si cambias de fondo por secciones, conserva tipografía, paleta y estructura.");
  else good.push(`Un fondo predominantemente ${bg} puede funcionar si conserva contraste y consistencia.`);

  const cls=issues.length>=3?"bad":issues.length?"warn":"ok";
  $("deckReviewOutput").className=`output-box ${cls}`;
  $("deckReviewOutput").innerHTML=`
    <h4>${cls==="ok"?"🟢 Presentación bien encaminada":cls==="warn"?"🟡 Conviene revisar algunos puntos":"🔴 Reestructura antes de ensayar"}</h4>
    ${good.length?`<p><b>Fortalezas:</b></p><ul>${good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
    ${issues.length?`<p><b>Atención:</b></p><ul>${issues.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
    <p><b>Siguiente paso:</b> para una revisión real de diseño, comparte el PowerPoint, PDF o capturas con ChatGPT y utiliza el prompt de revisión completa.</p>`;
  $("deckReviewOutput").classList.remove("hidden");
});

$("copyDeckReviewPrompt").addEventListener("click",async()=>{
  await navigator.clipboard.writeText(deckReviewPrompt());
  $("deckReviewStatus").textContent="Prompt de revisión completa copiado. Adjunta tu presentación en ChatGPT y pégalo.";
  setTimeout(()=>$("deckReviewStatus").textContent="",3000);
});
