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
# from server.jps.model import (
#     crear_jp,
#     eliminar_jp,
#     obtener_jps,
#     obtener_id_jp,
#     obtener_datos_jp,
#     editar_jp
# )
from server.utils.notion import QueryDatabase

bp = Blueprint(name="login", import_name=__name__, url_prefix="/login")

# VISTAS PARA GESTION JEFES DE PROYECTOS ---> ADMIN ONLY
@bp.route("/", methods= ("GET", "POST"))
def login():
    if request.method == "GET":
        return render_template('login.html')
    
    if request.method == "POST":

        return""
