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
    eliminar_proyecto,
    obtener_jps,
    obtener_clientes,
    obtener_trabajador,
    obtener_datos_proyecto,
    obtener_id_proyecto,
    editar_proyecto,
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
       jps = obtener_jps()
       clientes = obtener_clientes()
       trabajador = obtener_trabajador()
       return render_template("proyectos/proyecto_create.html",
                              jps=jps,
                              clientes=clientes,
                              trabajador=trabajador)
    if request.method == 'POST':
        # model crear nuevo proyecto
        crear_proyecto(request)
        return render_template("proyectos/resultado_proyecto_create.html")

# view para visualizar
@bp.route('proyecto/view', methods=("GET", "POST"))
def info_proyecto():
    if request.method == "GET":
        context = obtener_proyectos()
        return render_template("/proyectos/selector_proyecto_ver.html",
                               context=context)
    if request.method == "POST":
        info:str = obtener_id_proyecto(request)
        return redirect(f"/proyecto/proyectos/view/info/{info}")

@bp.route("proyectos/view/info/<path:id_meta_proyecto>", methods=("GET", "POST"))
def view_info(id_meta_proyecto):
    if request.method == "GET":
        jps = obtener_jps()
        clientes = obtener_clientes()
        trabajador = obtener_trabajador()

        info = obtener_datos_proyecto(id_meta_proyecto)
        print(info)
        return render_template("proyectos/proyecto_visualizacion.html",
                               info=info,
                               jps=jps,
                               clientes=clientes,
                               trabajador=trabajador)
    if request.method == "POST":
        editar_proyecto(request, id_meta_proyecto)
        return render_template("proyectos/resultado_editar.html")

# view para eliminar proyecto 
@bp.route('/proyecto/delete', methods=("GET", "POST"))
def delete_proyecto():
    if request.method == "GET":
        context = obtener_proyectos()
        return render_template('proyectos/proyecto_delete_view.html',
                               context=context)
    if request.method == "POST":
        eliminar_proyecto(request)
        return render_template("proyectos/resultado_proyecto_delete.html")

