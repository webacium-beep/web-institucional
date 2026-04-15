# Deuda técnica

## Template ADR-Lite

> Usar este formato para registrar deuda técnica con contexto, tradeoffs y criterio de cierre.

```md
## ADR-Lite XXX — Título de la deuda

### Estado

Pendiente | En progreso | Resuelta | Descartada.

### Prioridad

Baja | Media | Alta.

### Owner sugerido

Equipo o rol responsable.

### Fecha objetivo

Por definir o fecha concreta.

### Contexto

Qué existe hoy y en qué parte del sistema vive el problema.

### Problema

Cuál es la deuda concreta y por qué importa.

### Decisión temporal

Qué se decidió hacer por ahora para no frenar el avance.

### Consecuencias

- Costos técnicos actuales.
- Riesgos que seguimos aceptando.
- Limitaciones operativas o de negocio.

### Alternativas consideradas

#### 1. Alternativa A

**Ventaja:** ...  
**Desventaja:** ...

#### 2. Alternativa B

**Ventaja:** ...  
**Desventaja:** ...

### Decisión objetivo

Cuál es la solución correcta a futuro.

### Criterio de cierre

Esta deuda se considera resuelta cuando:

1. ...
2. ...
3. ...
```

---

## ADR-Lite 001 — Migrar video pesado a Sanity

### Estado

Pendiente.

### Prioridad

Media.

### Owner sugerido

Frontend + CMS.

### Fecha objetivo

Por definir.

### Contexto

Actualmente el archivo `src/assets/TERCERA_PRUEBA_DEL_ANILLO.mp4` se encuentra versionado dentro del repositorio y forma parte de los assets locales del proyecto.

### Problema

GitHub ya advierte que el archivo tiene un tamaño aproximado de `59.63 MB`, superando el tamaño recomendado de `50 MB`. Mantener assets multimedia pesados dentro del repositorio aumenta el peso del historial, degrada la experiencia de clonación y deja acoplada la distribución de contenido a una estrategia que no escala bien.

### Decisión temporal

Se mantiene el archivo dentro del repositorio para no frenar el avance actual ni abrir una migración de contenido en este momento.

### Consecuencias

- El repositorio conserva binarios pesados innecesarios para la evolución del código.
- El historial de Git sigue creciendo con una responsabilidad que debería vivir en CMS o storage.
- Se posterga la flexibilidad para que negocio o marketing administren el asset sin depender de despliegues de frontend.

### Alternativas consideradas

#### 1. Mantener el video en el repositorio

**Ventaja:** cero trabajo inmediato.
**Desventaja:** empeora la salud del repositorio y no resuelve el problema estructural.

#### 2. Migrarlo a Git LFS

**Ventaja:** mejora el manejo de binarios grandes dentro del flujo Git.
**Desventaja:** sigue siendo una solución centrada en repositorio, no en gestión de contenido.

#### 3. Migrarlo a Sanity

**Ventaja:** desacopla el asset del repo y habilita una estrategia de contenido administrable desde CMS.
**Desventaja:** requiere definir modelo, carga del asset y consumo desde frontend.

### Decisión objetivo

Migrar `src/assets/TERCERA_PRUEBA_DEL_ANILLO.mp4` para consumirlo desde **Sanity** y reemplazar la referencia local por una fuente administrada desde CMS.

### Criterio de cierre

Esta deuda se considera resuelta cuando:

1. el video esté almacenado y administrado desde Sanity,
2. el frontend consuma la URL o referencia desde CMS,
3. el asset deje de vivir dentro del repositorio.
