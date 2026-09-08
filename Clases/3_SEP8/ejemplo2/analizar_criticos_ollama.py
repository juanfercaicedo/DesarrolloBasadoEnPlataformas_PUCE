#!/usr/bin/env python3
"""Analiza un HTML con Ollama y guarda únicamente errores críticos en Markdown."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def consultar_ollama(url: str, modelo: str, codigo: str) -> str:
    instrucciones = """Analiza el HTML proporcionado como auditor experto en accesibilidad WCAG 2.2 nivel AA.

Encuentra únicamente errores CRÍTICOS o de impacto ALTO que puedan impedir el acceso,
comprensión o uso del formulario. No inventes problemas y no incluyas recomendaciones menores,
estéticas, de estilo, rendimiento ni mejoras opcionales. Si no encuentras errores críticos o
altos, escribe exactamente: "No se detectaron errores críticos o altos.".

Responde SOLO en Markdown con esta estructura:
# Errores críticos detectados

Para cada error confirmado:
## [CRÍTICO o ALTO] Título breve
- **Ubicación:** elemento, atributo o selector afectado.
- **Evidencia:** fragmento exacto del código.
- **Problema:** qué falla y a quién afecta.
- **Criterio WCAG:** criterio aplicable, si corresponde.
- **Corrección:** cambio concreto que debe realizarse.

No incluyas una auditoría general ni reescribas el código completo."""
    payload = json.dumps(
        {
            "model": modelo,
            "stream": False,
            "messages": [
                {"role": "system", "content": instrucciones},
                {"role": "user", "content": f"HTML que debes analizar:\n\n```html\n{codigo}\n```"},
            ],
            "options": {"temperature": 0.0, "num_predict": 1800},
        }
    ).encode("utf-8")
    request = Request(
        f"{url.rstrip('/')}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=1800) as response:
            data = json.load(response)
        return data["message"]["content"].strip()
    except (HTTPError, URLError, TimeoutError) as error:
        raise RuntimeError(f"No se pudo conectar con Ollama: {error}") from error
    except (KeyError, TypeError) as error:
        raise RuntimeError("Ollama devolvió una respuesta sin contenido válido") from error


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html", type=Path, default=Path("formulario.html"))
    parser.add_argument("--output", type=Path, default=Path("errores_criticos.md"))
    parser.add_argument("--model", default="qwen2.5-coder:3b")
    parser.add_argument("--ollama-url", default="http://localhost:11434")
    args = parser.parse_args()

    if not args.html.is_file():
        print(f"No existe el archivo HTML: {args.html}", file=sys.stderr)
        return 2

    try:
        codigo = args.html.read_text(encoding="utf-8")
        resultado = consultar_ollama(args.ollama_url, args.model, codigo)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(
            "# Resultado del análisis crítico\n\n"
            f"- **Modelo:** `{args.model}`\n"
            f"- **Archivo analizado:** `{args.html.name}`\n\n"
            f"{resultado}\n",
            encoding="utf-8",
        )
    except (OSError, RuntimeError) as error:
        print(error, file=sys.stderr)
        return 1

    print(f"Errores detectados guardados en: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
