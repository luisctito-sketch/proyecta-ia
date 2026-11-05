/*
 * PROYECTA-IA — Capa de procedencia y validación de dominio
 * Autor: Luis Cabezas Tito
 * © 2026 Luis Cabezas Tito. Todos los derechos reservados.
 * Versión: 1.0.1 | 2026-11-05
 * PROVENANCE-ID: PIA-LCT-2026-v1.0.1
 *
 * AVISO: esta capa dificulta el despliegue directo de copias en dominios no autorizados,
 * pero el código del lado cliente siempre puede ser inspeccionado/modificado.
 */
(() => {
  'use strict';
  const VERSION = '1.0.1';
  const OWNER = 'Luis Cabezas Tito';
  const OFFICIAL_HOSTS = new Set(['luisctito-sketch.github.io']);
  const OFFICIAL_URL = 'https://luisctito-sketch.github.io/proyecta-ia/';
  const host = String(window.location.hostname || '').toLowerCase();
  const isOfficial = OFFICIAL_HOSTS.has(host);

  window.PROYECTA_IA_PROVENANCE = Object.freeze({
    product: 'PROYECTA-IA', version: VERSION, owner: OWNER,
    copyright: '© 2026 Luis Cabezas Tito. Todos los derechos reservados.',
    official: isOfficial, officialUrl: OFFICIAL_URL
  });

  function addAttribution() {
    if (document.getElementById('proyectaIaCopyrightBadge')) return;
    const badge = document.createElement('div');
    badge.id = 'proyectaIaCopyrightBadge';
    badge.textContent = `© 2026 ${OWNER} · PROYECTA-IA v${VERSION} · Todos los derechos reservados`;
    badge.setAttribute('aria-label', 'Aviso de derechos de autor de PROYECTA-IA');
    Object.assign(badge.style, {
      position: 'fixed', right: '10px', bottom: '10px', zIndex: '2147482500',
      maxWidth: 'min(560px, calc(100vw - 20px))', padding: '7px 10px',
      borderRadius: '9px', background: 'rgba(8,31,54,.90)', color: '#fff',
      fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', fontWeight: '700',
      lineHeight: '1.25', boxShadow: '0 4px 18px rgba(0,0,0,.18)',
      pointerEvents: 'none', opacity: '.92'
    });
    document.body.appendChild(badge);
  }

  function blockUnofficialCopy() {
    if (isOfficial || document.getElementById('proyectaIaUnofficialBlock')) return;
    const panel = document.createElement('div');
    panel.id = 'proyectaIaUnofficialBlock';
    panel.innerHTML = `
      <div style="max-width:680px;background:#fff;border-radius:20px;padding:32px;box-shadow:0 24px 80px rgba(0,0,0,.32);font-family:Arial,Helvetica,sans-serif;color:#13253a;text-align:center">
        <div style="font-size:42px;font-weight:900;color:#0b63ce;margin-bottom:10px">PROYECTA-IA</div>
        <div style="font-size:22px;font-weight:800;margin-bottom:12px">Despliegue no autorizado / dominio no oficial</div>
        <p style="font-size:15px;line-height:1.55;margin:0 0 16px">Esta copia conserva marcas de procedencia de PROYECTA-IA. El dominio actual no pertenece a la lista oficial autorizada.</p>
        <p style="font-size:14px;line-height:1.5;margin:0 0 18px"><strong>© 2026 Luis Cabezas Tito. Todos los derechos reservados.</strong></p>
        <a href="${OFFICIAL_URL}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#0b63ce;color:white;text-decoration:none;font-weight:800">Ir al sitio oficial</a>
      </div>`;
    Object.assign(panel.style, {
      position:'fixed', inset:'0', zIndex:'2147483647', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'24px', background:'rgba(5,18,32,.94)', overflow:'auto'
    });
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(panel);
  }

  function init() {
    addAttribution();
    if (!isOfficial) blockUnofficialCopy();
    try {
      console.info('%cPROYECTA-IA', 'font-size:20px;font-weight:900;color:#0b63ce',
        `v${VERSION} — © 2026 ${OWNER}. Todos los derechos reservados.`);
    } catch (_) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
