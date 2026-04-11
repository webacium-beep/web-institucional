# Acium Web - Arquitectura y Reglas del Proyecto

Este documento establece las reglas arquitectónicas y de desarrollo para el proyecto Acium Web.

## 1. Arquitectura: Atomic Design Híbrido (Opción B)

Adoptamos una arquitectura basada en **Atomic Design**, pero adaptada para convivir pacíficamente con la arquitectura de **Astro Islands**.

La estructura de la carpeta `src/components/` será la siguiente para los **NUEVOS** componentes:

*   **`atoms/`**: Componentes UI más básicos y pequeños (botones, inputs, etiquetas, iconos estáticos). No tienen lógica de negocio compleja ni estado global. Suelen ser archivos `.astro` o `.tsx` puramente presentacionales.
*   **`molecules/`**: Grupos de átomos que funcionan juntos como una unidad simple (un campo de formulario con su etiqueta, un buscador, una tarjeta de producto simple).
*   **`organisms/`**: Componentes de UI más complejos y grandes que forman secciones diferenciadas de la interfaz (un header, un footer, una grilla de productos). Pueden componerse de moléculas, átomos y otros organismos.
*   **`islands/`**: **¡REGLA DE ORO!** Aquí residen las "Islas" de interactividad de Astro. Son componentes de React (`.tsx`) que manejan estado de cliente pesado, efectos (`useEffect`) o interactividad compleja que requiere hidratación en el cliente (`client:load`, `client:visible`, etc.). Las islas pueden importar componentes de `atoms` o `molecules` si los necesitan, pero su punto de entrada principal reside aquí.

### Regla del Boy Scout (¡NO REFACTORIZAR LO VIEJO!)

**Está estrictamente prohibido refactorizar los componentes antiguos** (`src/components/ui/`) solo por el afán de acomodarlos a la nueva estructura atómica. 

La regla es:
1.  Todo componente **NUEVO** debe seguir la estructura `atoms`, `molecules`, `organisms`, `islands`.
2.  Los componentes antiguos se quedan donde están.
3.  Si un componente antiguo requiere una modificación profunda o se reescribe por completo por un requerimiento de negocio, *entonces y solo entonces* se mueve a la nueva estructura.

## 2. Estilos: Tailwind CSS como Única Fuente de Verdad

El framework principal y (casi) exclusivo para estilos es **Tailwind CSS**.

*   **Preferencia absoluta**: Se debe usar Tailwind mediante clases de utilidad (`className="text-titulo flex items-center..."`).
*   **CSS Tradicional**: Su uso está restringido **única y exclusivamente** a casos donde Tailwind no es suficiente (por ejemplo, animaciones ultra complejas personalizadas que no se pueden abstraer en el `tailwind.config`, pseudo-elementos muy específicos que ensucian demasiado el HTML, o integraciones de terceros). Si se usa CSS, debe estar justificado.
*   **Variables Globales**: Se deben respetar y utilizar las utilidades definidas en `src/styles/global.css`. Actualmente contamos con:
    *   `text-titulo` (22px, Avenir Black)
    *   `text-subtitulo` (18px, Avenir Medium)
    *   `text-parrafo` (16px, Avenir Light)
    *   Y la fuente base configurada en Tailwind (`font-sans`, `font-avenir`).

## 3. Filosofía de Trabajo

*   Asegurar que la interactividad pesada esté encapsulada en la carpeta `islands/` para no penalizar la carga inicial de Astro.
*   Mantener los componentes lo más "tontos" (presentacionales) posible en las carpetas `atoms` y `molecules`.
