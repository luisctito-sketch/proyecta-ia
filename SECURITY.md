# Política de seguridad — PROYECTA-IA 1.0.1

Contacto para reportes de seguridad: **luisctito@outlook.com**.

## Medidas incluidas

- validación de dominio oficial en el cliente;
- bloqueo visual cuando una copia se despliega sin modificar en un dominio no autorizado;
- autoría visible en la interfaz;
- metadatos de copyright y procedencia en HTML;
- marcas de procedencia en archivos fuente;
- manifiesto SHA-256 y firma criptográfica Ed25519;
- sistema central de autenticación por C.I. con reautenticación por módulo.

## Límite técnico importante

PROYECTA-IA 1.0.1 se publica mediante tecnología web estática. Todo HTML, CSS y JavaScript que ejecuta el navegador puede ser inspeccionado por un usuario técnicamente capacitado. Las protecciones de dominio y atribución son medidas de disuasión, detección de copias directas y prueba de procedencia; **no son DRM invulnerable**.

No deben almacenarse secretos, contraseñas maestras, claves privadas ni credenciales de servicios dentro de un repositorio público o JavaScript enviado al navegador.

Para una futura versión con control de acceso fuerte se recomienda mover autenticación y datos sensibles a un backend privado.
