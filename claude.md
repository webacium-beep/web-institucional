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

## 4. Internacionalización (i18n) y Flujo de Datos

Para mantener el desacoplamiento y la arquitectura limpia, el consumo del diccionario de idiomas (`src/i18n/ui.ts` y utilidades) debe seguir un flujo estrictamente **Top-Down**:

*   **Organismos y Páginas (Astro):** Son los **únicos** responsables de importar utilidades de i18n (ej. `useTranslations`), determinar el idioma actual, extraer los textos del diccionario y pasarlos hacia abajo.
*   **Átomos y Moléculas (Astro/React):** Tienen **estrictamente prohibido** importar diccionarios o utilidades de i18n. Son componentes "tontos" que deben recibir todos los textos de la interfaz exclusivamente como `strings` a través de sus `props`.
*   **Islas (React):** Al igual que los átomos y moléculas, **no deben importar** el diccionario para evitar enviar el JSON completo de idiomas al bundle del cliente. Las páginas u organismos que instancian la isla deben inyectarle los textos ya traducidos mediante props (ej. `translations={{ title: "Hola" }}`).

### 4.1. Principio de Ownership de Diccionarios

Los diccionarios del proyecto se organizan por **ownership real del contenido**, no por nombres lindos de secciones ni por conveniencia momentánea.

La regla es:

*   **Shared** → copy transversal reutilizable por múltiples páginas (ej. navegación, footer, selector de idioma).
*   **Page-owned** → copy que pertenece a una página concreta, aunque el nombre de la key parezca genérico.

Ejemplo importante:

*   Las keys actuales `about.*`, `world.*`, `franchise.*`, `engraving.*`, `newsroom.*`, etc. **hoy pertenecen a Home**, porque representan secciones del Home.
*   **NO** deben reinterpretarse automáticamente como diccionarios globales o como dueñas de páginas futuras solo porque el nombre lo sugiera.

### 4.2. Estado Actual y Transición Permitida

Actualmente el proyecto convive con dos capas:

1. `src/i18n/ui.ts`
   * mantiene el diccionario monolítico histórico
   * hoy contiene copy **shared + home**
   * sigue siendo la fuente activa para Header, Footer y secciones actuales del Home

2. Diccionarios de página nuevos
   * se crean como módulos separados
   * el primer caso ya introducido es `src/i18n/about-page.ts`
   * se usan de forma aditiva, sin romper el comportamiento actual

Esto significa que la transición es **progresiva**, no una reescritura masiva.

### 4.3. Estructura Objetivo de Diccionarios

La arquitectura objetivo para i18n es:

*   `src/i18n/locales.ts`
    * fuente única del tipo `Locales`
    * fuente única de `SUPPORTED_LOCALES`

*   `src/i18n/ui.ts`
    * diccionario legado activo mientras Home/shared sigan allí
    * no debe seguir creciendo indiscriminadamente con contenido de nuevas páginas

*   `src/i18n/about-page.ts`
    * diccionario exclusivo de la página About Us
    * namespace propio: `aboutPage.*`

*   futuros módulos page-owned:
    * `src/i18n/world-page.ts`
    * `src/i18n/franchise-page.ts`
    * `src/i18n/newsroom-page.ts`
    * etc.

### 4.4. Reglas de Naming

Las keys nuevas deben nombrarse de acuerdo al owner real del contenido.

Reglas:

*   contenido shared → prefijos compartidos como `nav.*`, `footer.*`, `selector.*`
*   contenido de página About → `aboutPage.*`
*   futuras páginas deben usar su propio namespace explícito

Ejemplo correcto:

```ts
'aboutPage.heroTitle'
```

Ejemplo incorrecto para una página nueva:

```ts
'about.heroTitle'
```

Ese formato sería incorrecto porque colisiona semánticamente con el `about.*` actual del Home.

### 4.5. Regla de Crecimiento

Cuando aparezca una página nueva con contenido propio, el flujo correcto es:

1. crear un diccionario dedicado para esa página
2. definir un namespace propio y explícito
3. agregar solo las keys de esa página
4. resolver sus textos desde la página o template dueño del contenido
5. evitar meter esas nuevas keys dentro de `ui.ts` salvo que realmente sean shared

La regla general es:

> `ui.ts` NO debe recibir contenido editorial nuevo de páginas nuevas si ese contenido tiene owner específico.

### 4.6. Helpers Permitidos y Responsabilidades

Actualmente existen dos niveles de helpers:

#### `normalizeLocale(lang)`

* vive en `src/i18n/utils.ts`
* usa `SUPPORTED_LOCALES` de `src/i18n/locales.ts`
* normaliza cualquier valor inválido a `es`

#### `useTranslations(lang)`

* helper legado/general
* consume el diccionario de `ui.ts`
* debe seguir usándose para:
  * navegación shared
  * footer shared
  * selector shared
  * Home mientras siga dependiendo del monolito actual

#### `usePageTranslations(lang, dictionary)`

* helper nuevo y genérico para diccionarios page-owned
* recibe el `lang` actual y el diccionario específico de página
* hace fallback a español
* permite crecer página por página sin tocar el contrato legacy de `useTranslations()`

### 4.7. Consumo Correcto por Tipo de Owner

#### Shared

Componentes como:

* `Header.astro`
* `FooterSection.astro`
* selector de idioma

deben seguir consumiendo `useTranslations(...)` mientras su copy viva en el diccionario shared/legacy.

#### Home

Las secciones actuales del Home siguen consumiendo `useTranslations(...)` porque su copy todavía vive dentro del monolito actual.

Esto es válido y esperado hasta una migración específica de Home.

#### About Page

`src/components/templates/AboutPage.astro` debe consumir su diccionario propio vía:

* `aboutPage`
* `usePageTranslations(lang, aboutPage)`

Regla: la página About **NO** debe volver a pedirle contenido de página a `ui.ts` si ese contenido ya es suyo.

### 4.8. Qué Está Prohibido

Está prohibido:

*   seguir agregando contenido de páginas nuevas dentro de `ui.ts` por comodidad
*   usar namespaces ambiguos que parezcan shared cuando el contenido no lo es
*   mezclar en un mismo módulo copy de múltiples owners sin una razón arquitectónica real
*   hacer que componentes bajos (átomos, moléculas, islas) importen diccionarios directamente
*   crear un diccionario “genérico de secciones” si esas secciones en realidad pertenecen a una página específica

### 4.9. Estrategia de Migración Futura

La migración correcta es incremental:

1. mantener Home/shared funcionando con `ui.ts`
2. crear diccionarios nuevos page-owned para páginas nuevas
3. migrar owners existentes solo mediante changes específicos y acotados
4. recién cuando un owner deje de depender del monolito, remover sus keys del diccionario legado

Esto evita:

*   refactors gigantes sin red de seguridad
*   pérdida de ownership semántico
*   cambios masivos difíciles de verificar

### 4.10. Objetivo Arquitectónico

El sistema i18n debe escalar como un conjunto de **módulos con ownership claro**, no como una bolsa global de strings.

La decisión actual busca:

*   separar shared de page-owned content
*   evitar que Home “se coma” el crecimiento de páginas nuevas
*   permitir que About, y futuras páginas, evolucionen con sus propios contratos
*   mantener compatibilidad con el sistema actual mientras la migración ocurre por fases

## 5. Navegación y Rutas Localizadas

La navegación del proyecto **NO** debe resolverse con strings sueltos dispersos por componentes. La regla actual es que los enlaces internos localizados se definan mediante una **fuente de verdad compartida** y se consuman desde los componentes que renderizan navegación.

### 5.1. Fuente de verdad para rutas internas

El archivo `src/lib/site-navigation.ts` centraliza la resolución de rutas internas del sitio.

Actualmente expone:

* `PAGE_ROUTE_ID`: enum-like object con identificadores semánticos de páginas (`home`, `about`, etc.).
* `getLocalizedPageHref(page, lang)`: helper que recibe un `PageRouteId` y el idioma actual, normaliza el locale y devuelve la URL correcta.

Reglas actuales de resolución:

* `home`
  * `es` → `/#site-top`
  * resto → `/{lang}#site-top`
* `about`
  * `es` → `/about`
  * resto → `/{lang}/about`

### 5.2. Cuándo usar `site-navigation.ts`

Siempre que un componente necesite navegar a una página interna del sitio y esa página dependa del locale actual, debe usar `getLocalizedPageHref(...)`.

Esto aplica especialmente a:

* Header / navegación principal
* Footer / mini navegación
* CTAs que lleven a otras páginas internas
* Futuros menús secundarios o breadcrumbs localizados

### 5.3. Qué NO hacer

Está prohibido:

* hardcodear rutas localizadas manualmente en múltiples componentes
  * Ejemplo malo: `lang === 'es' ? '/about' : `/${lang}/about`` repetido en Header, Footer, CTA, etc.
* dejar `href` vacíos en la capa de data cuando el enlace ya es una ruta interna conocida
* usar una fuente de verdad parcial donde el componente "parchee" rutas que la capa de datos no resolvió

La razón es simple: si la navegación crece, duplicar lógica de locales termina rompiendo consistencia.

### 5.4. Contrato actual del Footer

El footer usa `src/lib/footer.ts` como capa de datos.

La navegación del footer se modela con `FooterNavigationItem`, donde:

* `href` es **opcional**
* `routeId` es **opcional**

Regla de uso:

* si el item apunta a una página interna localizada → usar `routeId`
* si el item apunta a una URL fija/manual → usar `href`

Ejemplo correcto:

```ts
{
  id: 'about',
  labelKey: 'nav.about',
  kind: FOOTER_LINK_KIND.PAGE,
  routeId: PAGE_ROUTE_ID.ABOUT,
}
```

Luego `getFooterData(lang)` resuelve los `href` finales usando `getLocalizedPageHref(...)`.

Esto significa que `FooterSection.astro` **no debe inventar rutas** ni parchear links a mano: debe consumir los datos ya resueltos.

### 5.5. Consumo actual por componente

#### Header

`src/components/ui/Header.astro`

* usa `normalizeLocale(locale)` para obtener `safeLocale`
* resuelve el enlace de About con `getLocalizedPageHref(PAGE_ROUTE_ID.ABOUT, safeLocale)`
* mantiene los textos vía `useTranslations(...)`

#### Footer

`src/components/organisms/FooterSection.astro`

* recibe `lang`
* llama `getFooterData(lang)`
* renderiza `footerData.navigation` ya con hrefs finales resueltos

#### CTA del Home About

`src/components/ui/AboutSection.astro`

* obtiene `lang` del locale actual
* resuelve `aboutHref` vía `getLocalizedPageHref(PAGE_ROUTE_ID.ABOUT, lang)`
* lo usa directamente en el CTA que navega a la página About

### 5.6. Regla para futuras páginas

Cuando aparezca una nueva página interna (por ejemplo: `world`, `franchise`, `newsroom`, etc.), el flujo correcto es:

1. agregar un nuevo `PAGE_ROUTE_ID`
2. enseñar a `getLocalizedPageHref(...)` cómo resolver su URL por locale
3. usar ese `routeId` en las capas de datos que correspondan (`footer.ts`, futuras configs, etc.)
4. consumir la helper en componentes de navegación o CTAs

NO saltear el paso 2 ni repartir strings de URLs por la app.

### 5.7. Objetivo arquitectónico

La navegación debe escalar como un **sistema**, no como una colección de links pegados en componentes.

La decisión actual busca:

* evitar duplicación de lógica de locale
* mantener consistencia entre header, footer y CTAs
* permitir crecimiento de páginas sin refactors caóticos
* dejar clara la separación entre:
  * **data/navigation model** (`footer.ts`)
  * **route resolution** (`site-navigation.ts`)
  * **rendering** (`Header.astro`, `FooterSection.astro`, `AboutSection.astro`)
