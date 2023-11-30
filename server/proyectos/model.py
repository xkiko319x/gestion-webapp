from server.proyectos.data import (
    DB_PROYECTOS,
    DB_JPS,
)

from server.utils.notion import obtener_ultimo_codigo,Page,ParserNotionResponse,QueryDatabase,RequestData
from flask.wrappers import Request, Response




def obtener_proyectos():
    lista_proyectos = QueryDatabase(DB_PROYECTOS).get_key_value()
    lista_proyectos.keys()
    return lista_proyectos

def crear_proyecto(request:Request):
    rd = RequestData()
    
    # code = str(int(obtener_ultimo_codigo(DB_PROYECTOS)) + 1)
    
    #rd.update("Code","title", code)
    rd.update("J.P","rich_text", request.form.get("jp"))
    rd.update("Cliente","rich_text", request.form.get("cliente"))
    rd.update("Trabajadores","rich_text", request.form.get("trabajadores"))
    rd.update("Servicio","rich_text", request.form.get("servicio"))
    rd.update("Fecha Inicio","date", request.form.get("fecha_inicio"))
    rd.update("Fecha Fin","date", request.form.get("fecha_fin"))
    rd.update("Fecha Fin Prevista","date", request.form.get("fecha_fin_prevista"))

    response = ParserNotionResponse(Page().create(DB_PROYECTOS,rd).json()).get_simple()
    #print(response)
    # url:str = response.get("url_meta")
    return response

def eliminar_proyecto(request:Request):
    code_proyecto = request.form.get("proyecto")
    print(code_proyecto)
    query = {
        "filter": {
            "property": "Code",
            "title": {"equals": code_proyecto},
        }
    }

    id_proyecto = QueryDatabase(DB_PROYECTOS, query).get_simple()
    id_proyecto = id_proyecto[0].get("id_meta")
    Page(id_proyecto).delete()
