# Launch Migration Checklist

Checklist para cerrar la migración de `src/components/ui/Lanzamientos.astro` hacia la nueva estructura atómica sin apurarse y sin dejar deuda escondida.

## Objetivo

La migración se considera lista recién cuando la nueva implementación tenga paridad funcional, visual y de datos con la versión actual.

## 1. Paridad funcional

- [ ] El nuevo entrypoint renderiza la misma sección que hoy resuelve `Lanzamientos.astro`
- [ ] El nuevo componente consume i18n real, no textos hardcodeados temporales
- [ ] El nuevo componente consume el mismo estado derivado de Sanity
- [ ] El CTA mantiene el mismo destino esperado
- [ ] El fallback sin imagen sigue contemplado

## 2. Paridad de contenido

- [ ] Se eliminaron placeholders tipo `PRÓXIMAMENTE`, `Nuevo Lanzamiento`, `VER MÁS` si ya no corresponden
- [ ] Los textos visibles salen de traducciones o de datos reales
- [ ] No hay claves de i18n duplicadas o inconsistentes entre viejo y nuevo
- [ ] La semántica de títulos, descripción y CTA sigue siendo coherente

## 3. Paridad visual

- [ ] El layout nuevo respeta la intención visual del componente actual
- [ ] La sección funciona bien en desktop
- [ ] La sección funciona bien en mobile/responsive
- [ ] La imagen mantiene comportamiento visual correcto
- [ ] El fallback visual sin imagen no rompe el layout

## 4. Integración arquitectónica

- [ ] Hay una sola fuente de verdad para la lógica de datos
- [ ] La estructura atómica no quedó paralela: ya está realmente conectada al flujo real
- [ ] Las páginas (`index`, `en`, `it`, `pt`, `de`, `zh`) apuntan al nuevo entrypoint cuando llegue el momento del swap
- [ ] No quedó lógica nueva metida en el componente viejo por comodidad

## 5. Calidad de tests

- [ ] Los tests importantes validan render/composición/comportamiento, no solo strings del source
- [ ] Hay cobertura del caso con imagen
- [ ] Hay cobertura del caso sin imagen
- [ ] Hay cobertura mínima de i18n conectado
- [ ] Hay cobertura mínima del wiring de páginas

## 6. Condición para matar el viejo

Podés borrar `src/components/ui/Lanzamientos.astro` cuando TODO esto sea verdadero:

- [ ] El nuevo componente ya fue validado manualmente
- [ ] El nuevo componente ya tiene paridad funcional
- [ ] El nuevo componente ya tiene paridad visual
- [ ] El nuevo componente ya está integrado en las páginas reales
- [ ] No queda ninguna dependencia exclusiva del componente viejo
- [ ] El borrado del viejo simplifica, no rompe

## 7. Limpieza final

- [ ] Borrar el componente viejo
- [ ] Borrar código muerto o tests redundantes
- [ ] Dejar una sola arquitectura viva
- [ ] Revisar si `coverage/` debe ignorarse en `.gitignore`
- [ ] Separar cambios de tooling (`.atl/skill-registry.md`) de cambios funcionales si hace falta

## Criterio final

Si no hay paridad real, NO se hace el swap.

Si hay paridad real, se cambia el entrypoint, se valida, y recién ahí se mata el viejo.
