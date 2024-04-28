"""Módulo empleado durante el desarrollo de la aplicación.
NO USAR EN PRODUCCIÓN!!"""
import logging
import warnings

from app import create_app

if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    logging.basicConfig(level="DEBUG")

    app = create_app()
    app.run(debug=True, host="127.0.0.1", port=5000)