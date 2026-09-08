# Análisis crítico con Ollama

El script usa un único modelo local para analizar el HTML y detectar solamente errores críticos
o de impacto alto relacionados con accesibilidad WCAG 2.2 AA. No modifica el HTML ni genera una
auditoría general.

## Preparacion

1. Inicia Ollama.
2. Descarga el modelo auditor:

```sh
ollama pull qwen2.5-coder:3b
```

3. Instala la dependencia:

```sh
python3 -m pip install -r requirements.txt
```

## Ejecucion

Desde esta carpeta:

```sh
python3 analizar_criticos_ollama.py \
  --html formulario.html \
  --output errores_criticos.md
```

El archivo `errores_criticos.md` contiene los errores confirmados, su evidencia, el criterio WCAG
relacionado y una corrección concreta. Si no existen errores críticos o altos, el modelo lo indica.

Para usar otros modelos:

```sh
python3 analizar_criticos_ollama.py --html formulario.html \
  --model llama3.1:8b --output errores_criticos.md
```

El HTML original nunca se sobrescribe.