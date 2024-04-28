from server.proyectos.data import (
    DB_PROYECTOS,
    DB_JPS,
    DB_CLIENTES,
    DB_TRABAJADORES,
)

from server.utils.notion import obtener_ultimo_codigo,Page,ParserNotionResponse,QueryDatabase,RequestData
from flask.wrappers import Request, Response




def obtener_proyectos():
    lista_proyectos = QueryDatabase(DB_PROYECTOS).get_key_value()
    lista_proyectos.keys()
    return lista_proyectos

def obtener_jps():
    lista_jps = QueryDatabase(DB_JPS).get_key_value()
    lista_jps.keys()
    return lista_jps

def obtener_clientes():
    lista_clientes = QueryDatabase(DB_CLIENTES).get_key_value()
    lista_clientes.keys()
    return lista_clientes

def obtener_trabajador():
    lista_trabajador = QueryDatabase(DB_TRABAJADORES).get_key_value()
    lista_trabajador.keys()
    return lista_trabajador

def crear_proyecto(request:Request):
    rd = RequestData()
    
    rd.update("Code","title", request.form.get("codigo_proyecto"))

    code_jps = request.form.get("jp")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_jps},
        }
    }
    id_jp =QueryDatabase(DB_JPS,query).get_simple()
    id_jp = id_jp[0].get("id_meta")
    rd.update("J.P","relation", id_jp)

    code_cliente = request.form.get("cliente")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_cliente},
        }
    }
    id_cliente =QueryDatabase(DB_CLIENTES,query).get_simple()
    id_cliente = id_cliente[0].get("id_meta")
    rd.update("Cliente","relation", id_cliente)

    code_trabajador = request.form.get("trabajadores")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_trabajador},
        }
    }
    code_trabajador = QueryDatabase(DB_TRABAJADORES,query).get_simple()
    code_trabajador = code_trabajador[0].get("id_meta")
    rd.update("Trabajadores","relation", code_trabajador)
   
    rd.update("Servicio","rich_text", request.form.get("servicio"))
    rd.update("Fecha Inicio","date", request.form.get("fecha_inicio"))
    rd.update("Fecha Fin","date", request.form.get("fecha_fin"))
    rd.update("Fecha Fin Prevista","date", request.form.get("fecha_fin_prevista"))

    ParserNotionResponse(Page().create(DB_PROYECTOS,rd).json()).get_simple()

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

def obtener_datos_proyecto(id_meta):
    info = ParserNotionResponse(Page(id_meta).read().json()).get_simple()
    print(info)
    id_jp = info.get("J.P")
    print(id_jp)
    response_jp = ParserNotionResponse(Page(id_jp[0]).read().json()).get_simple()
    response_jp = response_jp.get("Code")
    
    id_cliente = info.get("Cliente")
    response_cliente = ParserNotionResponse(Page(id_cliente[0]).read().json()).get_simple()
    response_cliente = response_cliente.get("Code")

    id_trabajador = info.get("Trabajadores")
    response_trabajador = ParserNotionResponse(Page(id_trabajador[0]).read().json()).get_simple()
    response_trabajador = response_trabajador.get("Code")



    return {"info":info,"trabajador":response_trabajador,"cliente":response_cliente,"jp":response_jp}

def obtener_id_proyecto(request:Request):
    code_proyecto = request.form.get("proyecto")
    query = {
        "filter": {
            "property": "Code",
            "title": {"equals": code_proyecto},
        }
    }

    info_proyecto = QueryDatabase(DB_PROYECTOS, query).get_simple()
    info_proyecto = info_proyecto[0].get("id_meta")
    return info_proyecto

def editar_proyecto(request:Request, id_meta_proyecto):
    rd = RequestData()
    code_jps = request.form.get("jp")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_jps},
        }
    }
    id_jp =QueryDatabase(DB_JPS,query).get_simple()
    id_jp = id_jp[0].get("id_meta")
    rd.update("J.P","relation", id_jp)

    code_cliente = request.form.get("cliente")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_cliente}
        }
    }
    id_cliente =QueryDatabase(DB_CLIENTES,query).get_simple()
    print(id_cliente)
    id_cliente = id_cliente[0].get("id_meta")
    print(id_cliente)
    rd.update("Cliente","relation", id_cliente)

    code_trabajador = request.form.get("trabajadores")
    query= {
        "filter": {
            "property": "Code",
            "title": {"equals": code_trabajador}
        }
    }
    code_trabajador = QueryDatabase(DB_TRABAJADORES,query).get_simple()
    code_trabajador = code_trabajador[0].get("id_meta")
    rd.update("Trabajadores","relation", code_trabajador)
   
    rd.update("Servicio","rich_text", request.form.get("servicio"))
    rd.update("Fecha Inicio","date", request.form.get("fecha_inicio"))
    rd.update("Fecha Fin","date", request.form.get("fecha_fin"))
    rd.update("Fecha Fin Prevista","date", request.form.get("fecha_fin_prevista"))

    ParserNotionResponse(Page(id_meta_proyecto).update(rd))
