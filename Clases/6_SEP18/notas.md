## Frameworks
- Podemos aprovechar frameworks CSS modernos que tienen como objetivo acelerar el trabajo y garantizar la coherencia visual.
- Es un **conjunto predifinido de reglas** componentes y utilidades que simplifican el diseño de una página web.
- **Ventajas principales:**
    - Ahorra tiempo
        - Ya trae botones, formularios, rejillas y tipografía
- *Bootstrap:*
    - Componentes ya listos
    - Lo utilizamos cuando la exigencia del diseño es menos
    - Fue desarrollado por twitter(X).
    - Tiene rejillas responsivas y componenetes listos
    - Es el más popular del mundo
´´´html
<div class = "container">
        <div class = "row">
            <div class = "col-4">Columna 1</div>
            <div class = "col-4">Columna 2</div>
            <div class = "col-4">Columna 3</div>
        </div>
</div>
```

- Ya trae clases, container es un tipo de clase de bootstrap
- Ventajas:
    - Gran comunidad y documentación
    - Componentes listos: Menús, bonotes, modales
    - Rejilla responsiva, fácil de usar
- Desventajas:
    - Puede sentirse rígido si no se personaliza
    - CSS pesado si no se optimiza
- *Tailwind:*
    - Es más personalizable
    - Utiliza las personalidades primeros
    - Su enfoque es **utily-first**: ofrece clases pequeñas y específicas para estilos(colores, márgenes, tipografía, etc.)
    - Tiene interfaces mucho más personalizadas

```html
<div class="mx-auto max-w-6xl px-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded bg-blue-100 p-4">Columna 1</div>
        <div class="rounded bg-blue-100 p-4">Columna 2</div>
        <div class="rounded bg-blue-100 p-4">Columna 3</div>
    </div>
</div>
```

- **Ventajas:**
    - Gran flexibilidad
    - Diseños únicos
    - Excelente integración con REACT, VALUE, etc.

- **Desventajas**:
    - Curva de aprendizaje inicial

- Normalmente para las páginas web que va a utilizar un usuario(cliente) podemos utilizar tailwind, y para páginas más administrativas podemos usar Bootstrap

## Buenas prácticas
- No depender al 100% del CSS puro
- Personaliza colores, tipografías y variables para que tu sitio no se vea genérico
- Optimiza en producción, elimina clases o componentes que no uses
- Revisa la accesibilidad, contraste, foco visible y compatibilidad con lectores de pantalla
- Combina lo mejor: puedes usar tailwind de para la base y bootstrap para algunos componentes si el proyecto lo permite
