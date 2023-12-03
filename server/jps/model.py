from server.jps.data import (
    DB_JPS,
)

from server.utils.notion import obtener_ultimo_codigo,Page,ParserNotionResponse,QueryDatabase,RequestData
from flask.wrappers import Request, Response

def obtener_jps():
    lista_jps = QueryDatabase(DB_JPS).get_key_value()
    lista_jps.keys()
    print(lista_jps)
    return lista_jps


def crear_jp(request:Request):
    rd = RequestData()
    
    rd.update("Code","title", request.form.get("id_jp"))
    rd.update("Nombre","rich_text", request.form.get("nombre"))
    rd.update("Email","rich_text", request.form.get("email"))

    ParserNotionResponse(Page().create(DB_JPS,rd).json()).get_simple()


def eliminar_jp(request:Request):
    code_jp = request.form.get("jp_eliminar")
    query = {
        "filter": {
            "property": "Code",
            "title": {"equals": code_jp},
        }
    }

    id_jp = QueryDatabase(DB_JPS, query).get_simple()
    id_jp = id_jp[0].get("id_meta")
    Page(id_jp).delete()

def obtener_id_jp(request:Request):
    code_jp = request.form.get("jp")
    query = {
        "filter": {
            "property": "Code",
            "title": {"equals": code_jp},
        }
    }
    info_jp = QueryDatabase(DB_JPS, query).get_simple()
    info_jp = info_jp[0].get("id_meta")
    return info_jp



def obtener_datos_jp(id_meta_jp):
    info = ParserNotionResponse(Page(id_meta_jp).read().json()).get_simple()
    print(info)
    id_jp = info.get("Code")
    nombre_jp = info.get("Nombre")
    email_jp = info.get("Email")
    
    return {"id":id_jp, "nombre": nombre_jp, "email": email_jp}

def editar_jp(request:Request, id_meta_jp):
    rd = RequestData()
    rd.update("Code","title", request.form.get("id_jp"))
    rd.update("Nombre","rich_text", request.form.get("nombre"))
    rd.update("Email","rich_text", request.form.get("email"))
    ParserNotionResponse(Page(id_meta_jp).update(rd))


