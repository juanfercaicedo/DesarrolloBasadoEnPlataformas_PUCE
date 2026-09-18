# Diferencias entre las páginas

Las dos páginas presentan el mismo tema: un perfil informativo de Lionel Messi, pero tienen diseños y funcionalidades diferentes. La página de Tailwind usa una composición editorial oscura y personalizada; la página de Bootstrap usa una estructura clara basada en componentes prediseñados.

## Archivos

- [Página con Bootstrap](bootstrap/bootstrap.html)
- [Página con Tailwind CSS](tailwind/tailwind.html)

## 1. Forma de incluir el framework

### Bootstrap

Bootstrap se incluye mediante una hoja de estilos externa dentro de la etiqueta `<head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Tailwind CSS

Tailwind se incluye mediante un script de CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Después de cargarlo, se utilizan directamente sus clases utilitarias en los elementos HTML.

## 2. Forma de construir el diseño

Bootstrap utiliza componentes y un sistema de rejilla prediseñado. Por ejemplo, la sección principal usa:

```html
<section class="card border-0 shadow-sm">
    <div class="row g-0">
        <div class="col-lg-5">Imagen</div>
        <div class="col-lg-7">Contenido</div>
    </div>
</section>
```

- `card` crea una tarjeta de Bootstrap.
- `row` crea una fila.
- `col-lg-5` y `col-lg-7` dividen el espacio en columnas para pantallas grandes.
- `g-0` elimina el espacio entre las columnas.

Tailwind construye el mismo diseño combinando clases pequeñas y específicas:

```html
<section class="overflow-hidden rounded-2xl bg-white shadow-xl">
    <div class="grid lg:grid-cols-2">
        <img class="h-72 w-full object-cover lg:h-full">
        <div class="p-6 sm:p-10">Contenido</div>
    </div>
</section>
```

- `grid` activa CSS Grid.
- `lg:grid-cols-2` crea dos columnas desde el tamaño de pantalla `lg`.
- `rounded-2xl`, `bg-white` y `shadow-xl` aplican borde redondeado, fondo y sombra.
- `p-6 sm:p-10` cambia el espaciado según el tamaño de pantalla.

## 3. Clases de estilo

Bootstrap utiliza nombres de clases más generales y componentes ya preparados:

```html
<a class="btn btn-primary">Visitar sitio oficial</a>
```

La clase `btn btn-primary` proporciona automáticamente la apariencia de un botón principal.

Tailwind permite definir cada característica del botón por separado:

```html
<a class="rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800">
    Visitar sitio oficial
</a>
```

En este caso:

- `rounded-lg` define el redondeado.
- `bg-sky-700` define el color de fondo.
- `px-5 py-3` define el espaciado interno.
- `font-semibold` define el grosor de la letra.
- `text-white` define el color del texto.
- `hover:bg-sky-800` cambia el color cuando el cursor pasa sobre el botón.

## 4. CSS personalizado

La página Bootstrap utiliza algunas clases propias dentro de una etiqueta `<style>`:

```css
.hero {
    background: linear-gradient(135deg, #075985, #0e7490);
}

.profile-card {
    margin-top: -64px;
}
```

Estas reglas son necesarias para personalizar el fondo del encabezado y colocar la tarjeta sobre la sección principal.

La página Tailwind realiza la mayoría de estos estilos directamente en el atributo `class`:

```html
<header class="bg-gradient-to-br from-sky-800 to-cyan-700 text-white">
```

Por eso necesita menos CSS escrito manualmente.

## 5. Diseño responsivo

Los dos frameworks permiten adaptar la página a distintos tamaños de pantalla, pero utilizan sintaxis diferente.

En Bootstrap se usan clases como:

```html
<div class="col-md-4">...</div>
```

La clase `col-md-4` hace que cada elemento ocupe cuatro de las doce columnas desde el punto de quiebre `md`. En pantallas pequeñas, los elementos se colocan uno debajo de otro.

En Tailwind se utiliza:

```html
<section class="grid gap-4 md:grid-cols-3">
```

La clase `grid` activa la cuadrícula y `md:grid-cols-3` crea tres columnas desde el tamaño `md`.

## 6. Comparación general

| Característica | Bootstrap | Tailwind CSS |
|---|---|---|
| Enfoque | Componentes prediseñados | Clases utilitarias |
| Grid | `row`, `col-md-4`, `col-lg-5` | `grid`, `md:grid-cols-3`, `lg:grid-cols-2` |
| Botones | `btn btn-primary` | Combinación de clases de color, tamaño y estado |
| Personalización | Puede requerir CSS adicional | Se realiza directamente con clases |
| Curva inicial | Más sencilla si se conocen sus componentes | Requiere aprender muchas clases |
| Resultado | Diseño rápido y consistente | Diseño más flexible y personalizado |

## 7. Diferencias visuales y funcionalidades actuales

### Página con Tailwind CSS

La versión de Tailwind tiene una apariencia más personalizada y visualmente llamativa:

- Usa un fondo oscuro, colores cyan y una imagen con efecto `grayscale` que recupera el color al pasar el cursor.
- Tiene una navegación sencilla con enlaces a secciones de la misma página.
- Presenta estadísticas como tarjetas de datos, sin depender de componentes prediseñados.
- Utiliza `hover`, `focus`, `transition` y `hover:-translate-y-2` para crear interacciones visuales.
- La cuadrícula de características se adapta con `md:grid-cols-3`.

Ejemplo de una interacción construida con utilidades de Tailwind:

```html
<article class="transition duration-300 hover:-translate-y-2 hover:border-cyan-300/60">
    <h3 class="text-xl font-bold text-white">Técnica</h3>
</article>
```

### Página con Bootstrap

La versión de Bootstrap tiene una apariencia más tradicional de ficha informativa y aprovecha componentes del framework:

- Usa una barra de navegación (`navbar`) que se colapsa en pantallas pequeñas.
- Incluye una alerta (`alert alert-primary`) para mostrar un dato destacado.
- Usa `badge` para clasificar el perfil y sus secciones.
- Presenta los logros mediante componentes `card`.
- Incluye un acordeón (`accordion`) para mostrar y ocultar información sobre el estilo de juego.
- Necesita cargar el archivo JavaScript de Bootstrap para que funcionen el menú móvil y el acordeón.

Ejemplo de un componente interactivo de Bootstrap:

```html
<button class="accordion-button collapsed"
        data-bs-toggle="collapse"
        data-bs-target="#vision">
    Visión
</button>
```

## 8. ¿Por qué se ven diferentes?

Aunque ambas páginas hablan de Messi, no comparten la misma composición:

- Tailwind organiza el contenido como una página editorial: fondo oscuro, tipografía grande, estadísticas y tarjetas con movimiento.
- Bootstrap organiza el contenido como una ficha informativa: barra superior, alerta, tarjetas numéricas y acordeón.
- Tailwind define cada detalle visual mediante clases pequeñas.
- Bootstrap proporciona estilos y comportamientos completos mediante componentes como `navbar`, `alert`, `card` y `accordion`.

## Conclusión

Bootstrap es útil cuando se necesita construir una página rápidamente usando componentes listos y comportamientos JavaScript, como navegación colapsable y acordeones. Tailwind CSS ofrece mayor control visual porque cada clase representa una propiedad específica del diseño y permite crear una interfaz completamente personalizada.

En estos ejemplos, Tailwind se reconoce por su estética oscura, sus transiciones y sus utilidades aplicadas directamente en el HTML. Bootstrap se reconoce por su navbar, alertas, badges, cards y accordion. Los dos producen páginas responsivas, pero cada uno comunica una experiencia visual distinta.
