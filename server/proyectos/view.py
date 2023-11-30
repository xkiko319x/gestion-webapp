"""
Módulo que contiene todas las  vistas relacionadas con el módulo de Recruitment.
"""

import os

from flask import (
    Blueprint,
    current_app,
    redirect,
    render_template,
    request,
)
from requests import Request
from flask_login import login_required
from server.proyectos.model import (
    obtener_proyectos,
    crear_proyecto,
    eliminar_proyecto
)
from server.utils.notion import QueryDatabase
bp = Blueprint(name="proyecto", import_name=__name__, url_prefix="/proyecto")

# VISTAS DE PROYECTOS ---> ADMIN ONLY
@bp.route("/")
def index_proyectos():
    return render_template('proyectos/index_proyecto.html')

# view para crear nuevo proyecto
@bp.route('/proyecto/create', methods=("GET", "POST"))
def formulario_crear_proyecto():
    if request.method == 'GET':
       return render_template("proyectos/proyecto_create.html")
    if request.method == 'POST':
        # model crear nuevo proyecto
        crear_proyecto(request)
        return render_template("proyectos/resultado_proyecto_create.html")

# view para visualizar + editar
@bp.route('/proyecto/view')
def info_proyecto():
    lista = obtener_proyectos()
    return render_template("proyectos/proyecto_visualizacion.html")

# view para eliminar proyecto 
@bp.route('/proyecto/delete', methods=("GET", "POST"))
def delete_proyecto():
    if request.method == "GET":
        context = obtener_proyectos()
        print(context)
        return render_template('proyectos/proyecto_delete_view.html',
                               context=context)
    if request.method == "POST":
        # model ---> eliminar proyecto por id
        eliminar_proyecto(request)
        return render_template("proyectos/resultado_proyecto_delete.html")

