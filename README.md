# PROYECTA-IA — Acceso central

Repositorio: `proyecta-ia-acceso`

Archivo que utilizan todos los chatbots:
`https://luisctito-sketch.github.io/proyecta-ia-acceso/access.js`

## Actualización de nuevos estudiantes

Cuando exista una nueva lista de estudiantes:

1. Generar las nuevas huellas de C.I. utilizando el mismo `salt` e `iterations`.
2. Actualizar el arreglo `studentHashes` en `access.js`.
3. Reemplazar **solo `access.js`** en este repositorio.
4. Esperar a que GitHub Pages publique el cambio.
5. Todos los chatbots quedan actualizados automáticamente.

NO es necesario editar uno por uno los repositorios de los chatbots.

## Seguridad

Los números de C.I. no están escritos en texto plano en `access.js`; se almacenan huellas derivadas mediante PBKDF2/SHA-256.
Este sistema es una barrera de acceso para el aula, no un sistema institucional de autenticación.


## Actualización 2026-10-22
- Se añadió un nuevo estudiante autorizado a la base central.
- No se modificaron los accesos existentes ni la clave docente.
- Los chatbots enlazados a `access.js` reciben la actualización automáticamente al reemplazar este archivo en GitHub.


## Actualización 2026-11-02 — Botón global al portal principal

Se añadió al archivo central `access.js` un botón flotante global:

`🏠 PROYECTA-IA · Portal`

Destino:

`https://luisctito-sketch.github.io/proyecta-ia/`

### Cómo funciona

- El botón aparece automáticamente después de un acceso autorizado.
- Se incorpora en todos los chatbots que ya cargan este `access.js` central.
- No es necesario editar uno por uno esos repositorios.
- En el propio portal principal el botón se oculta automáticamente.
- Al cerrar sesión el botón también se oculta.
- En impresión no aparece.

### Qué archivo reemplazar en GitHub

Para activar esta función en todos los chatbots, basta con reemplazar **`access.js`** en el repositorio:

`proyecta-ia-acceso`

Los archivos `index.html` y `README.md` de este paquete solo documentan la actualización y pueden reemplazarse también si se desea mantener el repositorio completo al día.
