"""
Módulo que contiene todas las  vistas relacionadas
con el módulo de Gestión de Proyectos.
"""
import json
import flask
import flask_login
from flask import Blueprint, render_template, Flask, redirect,request, make_response, jsonify
from server.riesgos import data, model
from server.utils import notion

bp = Blueprint("riesgos", __name__, url_prefix="/riesgos")

# @bp.route("/", methods=("GET", "POST"))
# def view_gestion_riesgos_proyecto():
#     """ Vista que muestra el selector del proyecto """
#     if request.method == "GET":
#         proyectos = QueryDatabase(DB_ID_PROYECTOS).get_key_value()
#         # print(proyectos)
#         context ={"proyectos":proyectos}
#         return render_template("riesgos/seleccionar_proyecto.html", context=context)
    
#     """ Redirigir a la vista de los riesgos de un proyecto en concreto """
#     if request.method == "POST":
#         proyecto_code = request.form.get("proyecto")
#         query = {
#             "filter": {
#                 "property": "Code", "title": {"contains": proyecto_code},
#             }
#         }
#         proyecto_id_meta = QueryDatabase(DB_ID_PROYECTOS,query).get_key_value()
#         proyecto_id_meta = proyecto_id_meta.get(proyecto_code)
#         return redirect(f"gestion_riesgos/{proyecto_id_meta}")
    
# @bp.route("/gestion_riesgos/<proyecto_id_meta>", methods=("GET", "POST"))
# def view_gestion_riesgos(proyecto_id_meta:str):
    
#     """ Vista que muestra la vista de gestion de riesgos de un proyecto """
#     if request.method == "GET":
#         context = generar_ui_proyecto_riesgos_acciones(proyecto_id_meta)
#         query = {
#             "filter": {
#                 "property": "Proyecto", "relation": {"contains": proyecto_id_meta},
#             }
#         }
#         riesgo_asociado_proyecto = QueryDatabase(DB_RIESGOS,query).get_simple()
#         codigos_riesgo_asociado = {"codes": riesgo_asociado_proyecto }
#         respuesta = (render_template("riesgos/riesgos.html",
#                                                    context = context,
#                                                    codigos_riesgo_asociado=codigos_riesgo_asociado))    
#         return respuesta



# @bp.route("/formulario_nuevo_riesgo/<id_proyecto>", methods = ("GET","POST"))
# def formulario_nuevo_riesgo_accion(id_proyecto):
   
#     """ Vista que recibe los datos del formulario para crear un nuevo riesgo.
#         Devuelve datos en formato JSON para que se transformen en el front
#     """
#     if request.method == "POST":
#         data = nuevo_riesgo(request,id_proyecto)
#         print(data)
#         return jsonify(data)
    
# @bp.route("/formulario_nueva_accion/<id_proyecto>", methods= ("GET", "POST"))
# def formulario_nueva_accion(id_proyecto):

#     """ Vista que recibe los datos del formulario para crear una nueva acción.
#         Devuelve datos en formato JSON para que se transformen en el front
#     """
#     if request.method =="POST":
#         data = crear_nueva_accion(request,id_proyecto)
#         print(data)
#         return jsonify(data)
        
# @bp.route("/gestion_riesgos/<proyecto_id_meta>/delete", methods=(["DELETE"]))
# def view_gestion_riesgos_borrar(proyecto_id_meta):
    
#     """ Vista que recibe los datos para borrar un registro de riesgos y sus acciones asociadas """
#     if request.method == "DELETE":
#       return borrar_registro_riesgo(request, proyecto_id_meta)
      
# @bp.route("/gestion_riesgos/<proyecto_id_meta>/update", methods=("GET", "POST"))
# def view_gestion_riesgos_actualizar(proyecto_id_meta):
#     """ Vista que recibe los datos para actualizar el riesgo """
#     if request.method == "POST":
#       return actualizar_registro_riesgo(request, proyecto_id_meta) 
      
# @bp.route("/gestion_riesgos/<proyecto_id_meta>/update-acciones", methods=("GET", "POST"))
# def view_gestion_riesgos_actualizar_accion(proyecto_id_meta):
#     """ Vista que recibe los datos para actualizar las acciones asociadas a un riesgo """
#     if request.method == "POST":
#      return actualizar_registro_acciones(request, proyecto_id_meta)
     


# Vistas empleados en la API de Gestión de Riesgos

@bp.route("/", methods=("GET", "POST"))
# @flask_login.login_required
def riesgos_proyecto():
    if flask.request.method == "GET": 
        data = model.get_all_proyectos()
        return flask.render_template("riesgos/seleccionar_proyecto.html",data=data)
    if flask.request.method == "POST":
        id_proyecto = model.get_id_proyecto(flask.request)
        return flask.redirect(f"gestion_riesgos/{id_proyecto}")
    return "Method not allowed", 405

@bp.route("gestion_riesgos/<id_proyecto>", methods=("GET",))
# @flask_login.login_required
def riesgos_main(id_proyecto: str):
    if flask.request.method == "GET": 
        data = model.get_sistema_riesgos(id_proyecto)
        return flask.render_template("riesgos/riesgos.html",data = data)
    return "Method not allowed", 405


# Vistas de un riesgo

@bp.route("riesgos_app/<id_proyecto>/riesgo/create", methods=("POST",))
# @flask_login.login_required
def riesgo_new(id_proyecto:str):
    if flask.request.method == "POST":
        return model.create_riesgo(flask.request, id_proyecto)
    return "Method not allowed", 405

@bp.route("riesgos_app/riesgo/<id_riesgo>/delete", methods=("DELETE",))
# @flask_login.login_required
def riesgo_delete(id_riesgo:str):
    if flask.request.method == "DELETE":
        return model.delete_riesgo(id_riesgo)
    return "Method not allowed", 405

@bp.route("riesgos_app/riesgo/<id_riesgo>/update", methods=("PUT",))
# @flask_login.login_required
def riesgo_update(id_riesgo:str):
    if flask.request.method == "PUT":
        return model.update_riesgo(flask.request, id_riesgo)
    return "Method not allowed", 405


# Vistas de una acción

@bp.route("riesgos_app/<id_proyecto>/accion/create", methods=("POST",))
# @flask_login.login_required
def accion_new(id_proyecto:str):
    if flask.request.method == "POST":
        return model.create_accion(flask.request, id_proyecto)
    return "Method not allowed", 405

@bp.route("riesgos_app/accion/<id_accion>/delete", methods=("DELETE",))
# @flask_login.login_required
def accion_delete(id_accion:str):
    if flask.request.method == "DELETE":
        return model.delete_accion(id_accion)
    return "Method not allowed", 405

@bp.route("riesgos_app/accion/<id_accion>/update", methods=("PUT",))
# @flask_login.login_required
def accion_update(id_accion:str):
    if flask.request.method == "PUT":
        return model.update_accion(flask.request, id_accion)
    return "Method not allowed", 405

@bp.route("riesgos_app/proyecto/<id_proyecto>/presupuesto", methods=("PUT",))
# @flask_login.login_required
def proyecto_update(id_proyecto:str):
    if flask.request.method == "PUT":
        return model.update_proyecto(flask.request, id_proyecto)
    return "Method not allowed", 405
    
    