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
from server.jps.model import (
    crear_jp,
    eliminar_jp,
    obtener_jps,
    obtener_id_jp,
    obtener_datos_jp,
    editar_jp
)
from server.utils.notion import QueryDatabase
bp = Blueprint(name="jps", import_name=__name__, url_prefix="/jps")

# VISTAS PARA GESTION JEFES DE PROYECTOS ---> ADMIN ONLY
@bp.route("/")
def index_jp():
    return render_template('jps/index_jps.html')

# view para crear nuevo proyecto
@bp.route('/jps/create', methods=("GET", "POST"))
def formulario_crear_jp():
    if request.method == 'GET':
       return render_template("jps/jps_create.html")
    if request.method == 'POST':
        # model crear nuevo proyecto
        crear_jp(request)
        return render_template("jps/resultado_jps_create.html")

# view para visualizar + editar
@bp.route('/jps/view' , methods=("GET", "POST"))
def info_jps():
    if request.method == "GET":
        jps = obtener_jps()
        return render_template("jps/selector_jps.html",
                               jps=jps)
    if request.method == "POST":
        info:str = obtener_id_jp(request)
        return redirect(f"/jps/jp/view/info/{info}")
        


@bp.route("jp/view/info/<path:id_meta_jp>", methods=("GET", "POST"))
def view_info(id_meta_jp):
    if request.method == "GET":
        info = obtener_datos_jp(id_meta_jp)
        return render_template("jps/jps_visualizacion.html",
                               info=info)
                        
    if request.method == "POST":
        editar_jp(request, id_meta_jp)
        return render_template("jps/resultado_editar.html")





# view para eliminar jps 
@bp.route('/jps/delete', methods=("GET", "POST"))
def delete_jps():
    if request.method == "GET":
        context = obtener_jps()
        return render_template('jps/jps_delete_view.html',
                               context=context)
    if request.method == "POST":
        eliminar_jp(request)
        return render_template("jps/resultado_jps_delete.html")