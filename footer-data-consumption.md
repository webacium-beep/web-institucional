# Footer data consumption

Esta doc explica **cómo estamos consumiendo hoy toda la data del footer** en `aciumweb`, desde traducciones y assets hasta render final en Astro.

---

## 1. Fuente de verdad

La fuente de verdad del footer vive en:

- `src/lib/footer.ts`

Ese archivo define:

- tipos del dominio del footer
- catálogo de `kind` para links
- catálogo de nombres semánticos para íconos
- objeto canónico `FOOTER_DATA`
- helper `getFooterData()`

### Contratos principales

```ts
FOOTER_LINK_KIND = {
  PAGE: 'page',
  EXTERNAL: 'external',
  EMAIL: 'email',
}

FOOTER_ICON_NAME = {
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  WHATSAPP: 'whatsapp',
  WECHAT: 'wechat',
}
```

### Estructura de data

`FOOTER_DATA` se divide en 3 bloques:

- `navigation`
- `social`
- `contact`

---

## 2. Traducciones del mini menú

Las etiquetas del mini menú **no se duplican** en el footer.

Reusamos keys existentes del header/nav:

- `nav.about`
- `nav.world`
- `nav.franchise`
- `nav.newsroom`

Y agregamos una key específica para footer:

- `footer.privacy`

Estas keys viven en:

- `src/i18n/ui.ts`

### Decisión arquitectónica

No usamos `footer.about`, `footer.world`, etc. porque eso duplicaría contenido y abriría la puerta a inconsistencias entre header y footer.

---

## 3. Cómo se consume en el componente

El render del footer vive en:

- `src/components/organisms/FooterSection.astro`

El flujo actual es:

1. `FooterSection.astro` recibe `lang`
2. resuelve traducciones con `useTranslations(lang)`
3. obtiene la data estructurada con `getFooterData()`
4. mapea nombres semánticos de íconos a assets SVG reales
5. renderiza navegación, sociales y contacto

### Código conceptual

```ts
const t = useTranslations(lang);
const footerData = getFooterData();
```

Luego el menú navega así:

```astro
{footerData.navigation.map((item) => (
  item.href
    ? <a href={item.href}>{t(item.labelKey)}</a>
    : <span>{t(item.labelKey)}</span>
))}
```

Punto importante:

- si `href` existe → renderiza `<a>`
- si `href` está vacío → renderiza `<span>`

Eso evita inventar navegación falsa mientras las rutas reales todavía no estén definidas.

---

## 4. Assets reales del footer

Los assets consumidos por el footer viven en:

- `src/assets/icons/LOGO_FOOTER.svg`
- `src/assets/icons/Íconos_linkedin.svg`
- `src/assets/icons/Íconos_instagram.svg`
- `src/assets/icons/Ícono_Whatsapp.svg`
- `src/assets/icons/Íconos_wechat.svg`

### Mapper actual

En `FooterSection.astro` usamos un mapper semántico:

```ts
const footerIconByName = {
  [FOOTER_ICON_NAME.LINKEDIN]: linkedInIcon,
  [FOOTER_ICON_NAME.INSTAGRAM]: instagramIcon,
  [FOOTER_ICON_NAME.WHATSAPP]: whatsappIcon,
  [FOOTER_ICON_NAME.WECHAT]: wechatIcon,
}
```

### Por qué así

No guardamos imports de assets dentro de `src/lib/footer.ts`.

La data del dominio define el **qué** (`linkedin`, `instagram`, `wechat`).
El componente visual resuelve el **cómo** (qué SVG usar).

Eso baja acoplamiento y deja el contrato más limpio.

---

## 5. Navegación del logo

El logo del footer vuelve al inicio del home usando un anchor compartido:

- `#site-top`

Ese anchor se declara en:

- `src/layouts/Layout.astro`

Y el href del logo se arma así:

- español: `/#site-top`
- otros locales: `/{locale}#site-top`

Esto respeta la estructura i18n actual del proyecto.

---

## 6. Dónde se monta el footer

El footer se monta al final de la home en:

- `src/components/templates/HomePage.astro`

Actualmente la secuencia termina así:

1. `NewsroomSection`
2. `FooterSection`

---

## 7. Estado actual de los href

Hoy el contrato está preparado para crecer, pero no todos los links están completos.

### Ya definido

- contacto email:
  - `mailto:aciummilano@acium.group`

### Pendiente de completar

- rutas reales de `navigation`
- URLs externas de:
  - LinkedIn
  - Instagram
  - WhatsApp
  - WeChat

Mientras estén vacíos, el footer sigue mostrando el contenido sin simular clics falsos.

---

## 8. Cómo extender el footer correctamente

Si el footer crece, la regla es esta:

### Si cambia contenido estructural

Editar:

- `src/lib/footer.ts`

Ejemplos:

- agregar una red social nueva
- agregar un bloque legal nuevo
- cambiar el `kind` de un link
- completar `href` reales

### Si cambia una traducción

Editar:

- `src/i18n/ui.ts`

### Si cambia un ícono o logo

Editar:

- assets en `src/assets/icons/`
- mapper en `src/components/organisms/FooterSection.astro`

### Si cambia layout/estilo

Editar:

- `src/components/organisms/FooterSection.astro`

---

## 9. Regla de diseño que estamos siguiendo

El footer está modelado con esta separación:

- **data model** → `src/lib/footer.ts`
- **translations** → `src/i18n/ui.ts`
- **asset resolution** → `FooterSection.astro`
- **render/layout** → `FooterSection.astro`

Ese corte está bueno porque evita mezclar dominio, copy, assets y presentación en un solo lugar.

Es así de simple.
