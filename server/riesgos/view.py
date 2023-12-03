"""
Módulo que contiene todas las  vistas relacionadas
con el módulo de Gestión de Proyectos.
"""
import json
from flask import Blueprint, render_template, Flask, redirect,request, make_response, jsonify

from server.riesgos.model import (
    actualizar_registro_acciones,
    generar_ui_proyecto_riesgos_acciones,
    borrar_registro_riesgo,
    actualizar_registro_riesgo,
    nuevo_riesgo,
    crear_nueva_accion,
)
from server.riesgos.data import (
    DB_ID_PROYECTOS,
    DB_RIESGOS
)

from server.utils.notion import QueryDatabase, Page, RequestData, ParserNotionResponse

bp = Blueprint("riesgos", __name__, url_prefix="/riesgos")

@bp.route("/", methods=("GET", "POST"))
def view_gestion_riesgos_proyecto():
    """ Vista que muestra el selector del proyecto """
    if request.method == "GET":
        proyectos = QueryDatabase(DB_ID_PROYECTOS).get_key_value()
        # print(proyectos)
        context ={"proyectos":proyectos}
        return render_template("riesgos/seleccionar_proyecto.html", context=context)
    
    """ Redirigir a la vista de los riesgos de un proyecto en concreto """
    if request.method == "POST":
        proyecto_code = request.form.get("proyecto")
        query = {
            "filter": {
                "property": "Code", "title": {"contains": proyecto_code},
            }
        }
        proyecto_id_meta = QueryDatabase(DB_ID_PROYECTOS,query).get_key_value()
        proyecto_id_meta = proyecto_id_meta.get(proyecto_code)
        return redirect(f"gestion_riesgos/{proyecto_id_meta}")
    
@bp.route("/gestion_riesgos/<proyecto_id_meta>", methods=("GET", "POST"))
def view_gestion_riesgos(proyecto_id_meta:str):
    
    """ Vista que muestra la vista de gestion de riesgos de un proyecto """
    if request.method == "GET":
        context = generar_ui_proyecto_riesgos_acciones(proyecto_id_meta)
        query = {
            "filter": {
                "property": "Proyecto", "relation": {"contains": proyecto_id_meta},
            }
        }
        riesgo_asociado_proyecto = QueryDatabase(DB_RIESGOS,query).get_simple()
        codigos_riesgo_asociado = {"codes": riesgo_asociado_proyecto }
        respuesta = (render_template("riesgos/ver_riesgos.html",
                                                   context = context,
                                                   codigos_riesgo_asociado=codigos_riesgo_asociado))    
        return respuesta



@bp.route("/formulario_nuevo_riesgo/<id_proyecto>", methods = ("GET","POST"))
def formulario_nuevo_riesgo_accion(id_proyecto):
   
    """ Vista que recibe los datos del formulario para crear un nuevo riesgo.
        Devuelve datos en formato JSON para que se transformen en el front
    """
    if request.method == "POST":
        data = nuevo_riesgo(request,id_proyecto)
        return jsonify(data)
    
@bp.route("/formulario_nueva_accion/<id_proyecto>", methods= ("GET", "POST"))
def formulario_nueva_accion(id_proyecto):

    """ Vista que recibe los datos del formulario para crear una nueva acción.
        Devuelve datos en formato JSON para que se transformen en el front
    """
    if request.method =="POST":
        data = crear_nueva_accion(request,id_proyecto)
        print(data)
        return jsonify(data)
        
@bp.route("/gestion_riesgos/<proyecto_id_meta>/delete", methods=(["DELETE"]))
def view_gestion_riesgos_borrar(proyecto_id_meta):
    
    """ Vista que recibe los datos para borrar un registro de riesgos y sus acciones asociadas """
    if request.method == "DELETE":
      return borrar_registro_riesgo(request, proyecto_id_meta)
      
@bp.route("/gestion_riesgos/<proyecto_id_meta>/update", methods=("GET", "POST"))
def view_gestion_riesgos_actualizar(proyecto_id_meta):
    """ Vista que recibe los datos para actualizar el riesgo """
    if request.method == "POST":
      return actualizar_registro_riesgo(request, proyecto_id_meta) 
      
@bp.route("/gestion_riesgos/<proyecto_id_meta>/update-acciones", methods=("GET", "POST"))
def view_gestion_riesgos_actualizar_accion(proyecto_id_meta):
    """ Vista que recibe los datos para actualizar las acciones asociadas a un riesgo """
    if request.method == "POST":
     return actualizar_registro_acciones(request, proyecto_id_meta)
     



    
    