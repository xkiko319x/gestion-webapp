from server.utils.notion import (
    Database,
    Page,
    ParserNotionResponse,
    QueryDatabase,
    RequestData,
)
from flask.wrappers import Request
from server.riesgos.data import (
    DB_RIESGOS,
    DB_ACCIONES_RIESGOS,
)
from server.proyectos.data import (
    DB_PROYECTOS
)

def obtener_datos_proyecto(id_meta_proyecto:str = None):
    # Obtiene los datos de un proyecto en concreto 
    proyecto = ParserNotionResponse(Page(id_meta_proyecto).read().json()).get_simple()
    return proyecto


def obtener_datos_riesgos(id_meta_proyecto:str = None) -> dict[list]: 
    # Obtiene los riesgos de la base de datos de riesgos de un proyecto concreto 
    if id_meta_proyecto:
        query = {
            "filter": {
                "property": "Proyecto",
                "relation":{"contains" : id_meta_proyecto}
            }
        }
    list_riesgos:list[dict] = QueryDatabase(DB_RIESGOS, query).get_simple()
    return list_riesgos


def obtener_datos_acciones(id_meta_proyecto) -> list[str, str]:
    #Obtiene una lista de acciones para un riesgo de un proyecto 
    if not id_meta_proyecto:
        return []
    query = {
        "filter": {"property": "Proyecto", "relation" :{"contains" :id_meta_proyecto}}
    }
    lista_acciones:list[dict] = QueryDatabase(DB_ACCIONES_RIESGOS, query).get_simple()
    # print(lista de acciones ==========================, lista_acciones)
    return lista_acciones


def generar_ui_proyecto_riesgos_acciones(id_meta_proyecto) -> list:
    # Obtiene los datos necesarios para formar en el front la vista de gestión de riesgos 

    proyecto_data = obtener_datos_proyecto(id_meta_proyecto)
    riesgos_data:list[dict] = obtener_datos_riesgos(id_meta_proyecto)
    acciones_data:list[dict] = obtener_datos_acciones(id_meta_proyecto)
    # Transofrmar datos de los riegos para obtener según el id_meta del riegos su code para las acciones
    id_code_riesgo = {}
    for riesgo in riesgos_data:
        key = riesgo.get("id_meta")
        value = riesgo.get("Code")
        id_code_riesgo.update({key:value})

    lista_acciones_con_code_riesgo = []
    for accion in acciones_data:
        riesgo_asociado = accion.get("Riesgo Asociado")
        try:
            id_meta_riesgo = riesgo_asociado[0]
        except:
            id_meta_riesgo = ''

        code_riesgo = id_code_riesgo.get(id_meta_riesgo, None)
        accion.update({"Riesgo Asociado" : code_riesgo})
        lista_acciones_con_code_riesgo.append(accion)
    return {
        "Proyecto": proyecto_data,
        "Riesgos": riesgos_data,
        "Acciones": lista_acciones_con_code_riesgo,
    }


# def obtener_ultimo_codigo(database_id str):
#     # Obtiene el último registro de una base de datos en Notion 
#     query = {"sorts": [{"property" Created time, direction descending}]}
#     response dict = Database(database_id).read_data(query).json()
#     codes list[dict] = [
#         ParserNotionResponse(item).get_simple() for item in response.get(results)
#     ]
#     last_code = codes[0].get(Code)
#     return last_code


def borrar_registro_riesgo(request:Request, id_meta):
    # Borra el registro de riesgo y las acciones asociadas a este de las bases de datos de Notion

    valor_id = request.get_json()
    query = {
        "filter": {"property": "Riesgo Asociado", "relation": {"contains": valor_id}}
    }
    lista_acciones_con_riesgo_asociado:dict = QueryDatabase(
        DB_ACCIONES_RIESGOS, query
    ).get_key_value()

    lista_acciones_asociadas_eliminar:list = []

    for accion in lista_acciones_con_riesgo_asociado:
        id_meta_accion = lista_acciones_con_riesgo_asociado.get(accion)
        lista_acciones_asociadas_eliminar.append(id_meta_accion)

    for id in lista_acciones_asociadas_eliminar:
        # print(Accion  eliminada ====, id)
        accion_eliminar = Page(id).delete().json()
        accion_eliminar = ParserNotionResponse(accion_eliminar).get_simple()

    pagina_borrar = Page(valor_id).delete().json()
    pagina_borrar = ParserNotionResponse(pagina_borrar).get_simple()


def actualizar_registro_riesgo(request:Request, id_proyecto):
    # Actualiza los valores de un riesgo 
    valores_update = request.get_json()
    id_meta = valores_update.get("Id_meta")
    fecha = valores_update.get("Fecha_deteccion")
    tipo = valores_update.get("Tipo_riesgo")
    causa = valores_update.get("Causa")
    efecto = valores_update.get("Efecto")
    probabilidad = valores_update.get("Probabilidad")
    impacto = valores_update.get("Impacto")
    valor_riesgo = valores_update.get("Valor_riesgo")
    nivel_riesgo = valores_update.get("Nivel_riesgo")
    categoria = valores_update.get("Categoria")
    subcategoria = valores_update.get("Subcategoria")
    area = valores_update.get("Area_afectada")
    ie = valores_update.get("Impacto_Economico")

    rd = RequestData()

    rd.update("Fecha deteccion", "date", fecha)
    rd.update("Tipo", "select", tipo)
    rd.update("Causa", "rich_text", causa)
    rd.update("Categoria", "select", categoria)
    rd.update("Subcategoria", "select", subcategoria)
    rd.update("Efecto", "rich_text", efecto)
    rd.update("Probabilidad", "select", probabilidad)
    rd.update("Impacto", "select", impacto)
    rd.update("Valor riesgo", "number", valor_riesgo)
    rd.update("Nivel riesgo", "select", nivel_riesgo)
    rd.update("Area Afectada", "select", area)
    rd.update("Impacto Economico", "number", ie)
    rd.update("Proyecto", "relation", id_proyecto)

    pagina_actualizada = Page(id_meta).update(rd).json()
    pagina_actualizada = ParserNotionResponse(pagina_actualizada).get_simple()


def actualizar_registro_acciones(request:Request, id_meta_proyecto):
    # Actualiza el registro de una acción asociada a un riesgo 
    accion_data = request.get_json()
    estado = accion_data.get("Estado_del_riesgo")
    estrategia = accion_data.get("Estrategia_de_Respuesta_al_Riesgo")
    actividades = accion_data.get("Actividades_de_Respuesta_Planificadas")
    responsable = accion_data.get("Responsable_del_tratamiento")
    probabiblidad_resuesta = accion_data.get("Probabilidad_respuesta")
    impacto_respuesta = accion_data.get("Impacto_respuesta")
    valor_accion_respuesta = accion_data.get("Valor_riesgo_respuesta")
    riesgo_residual = accion_data.get("Riesgo_residual")
    nivel_respuesta = accion_data.get("Nivel_respuesta")
    estado_accion = accion_data.get("Estado_accion")
    id_meta_accion = accion_data.get(id_meta_accion)

    rd = RequestData()
    rd.update("Estrategia de Respuesta al Riesgo", "select", estrategia)
    rd.update("Actividades de Respuesta Planificadas", "rich_text", actividades)
    rd.update("Responsable del tratamiento", "rich_text", responsable)
    rd.update("Estado Accion", "select", estado_accion)
    rd.update("Probabilidad respuesta", "select", probabiblidad_resuesta)
    rd.update("Impacto respuesta", "select", impacto_respuesta)
    rd.update("Valor riesgo respuesta", "number", valor_accion_respuesta)
    rd.update("Nivel riesgo respuesta", "select", nivel_respuesta)
    rd.update("Riesgo residual", "rich_text", riesgo_residual)
    rd.update("Estado del riesgo", "select", estado)

    pagina_actualizada = Page(id_meta_accion).update(rd).json()
    pagina_actualizada = ParserNotionResponse(pagina_actualizada).get_simple()


def nuevo_riesgo(request :Request, id_proyecto:str):
    # Crea un nuevo registro de riesgo para un proyecto y crea la primera acción asociada a este 
    # Devuelve un diccionario de datos necesario para maquetar el front
    
    valores:dict = request.get_json()
    request_data = RequestData()
    # code = str(int(obtener_ultimo_codigo(DB_RIESGOS)) + 1)
    #request_data.update("Code", "title", code)
    request_data.update("Proyecto", "relation", id_proyecto)
    request_data.update("Fecha deteccion", "date", valores.get("Fecha"))
    request_data.update("Tipo", "select", valores.get("Tipo"))
    request_data.update("Causa", "rich_text", valores.get("Causa"))
    request_data.update("Categoria", "select", valores.get("Categoria"))
    request_data.update("Subcategoria", "select", valores.get("Subcategoria"))
    request_data.update("Probabilidad", "select", valores.get("Probabilidad_riesgo_nuevo"))
    request_data.update("Efecto", "rich_text", valores.get("Efecto"))
    request_data.update("Area Afectada", "select", valores.get("Area"))
    request_data.update("Impacto", "select", valores.get("Impacto_riesgo_nuevo"))
    request_data.update("Valor riesgo", "number", valores.get("Valor_riesgo_nuevo"))
    request_data.update("Nivel riesgo", "select", valores.get("Nivel_riesgo_nuevo"))
    print(request_data)
    nuevo_riesgo = Page().create(DB_RIESGOS, request_data).json()
    nuevo_riesgo = ParserNotionResponse(nuevo_riesgo).get_simple()

    codigo_riesgo:str = nuevo_riesgo.get("Code")
    id_riesgo:str = nuevo_riesgo.get("id_meta")

    rd = RequestData()
    # code = str(int(obtener_ultimo_codigo(DB_ACCIONES_RIESGOS)) + 1)
    #rd.update("Code", "title", code)
    rd.update("Proyecto", "relation", id_proyecto)
    rd.update("Estrategia de Respuesta al Riesgo", "select", valores.get("Estrategia"))
    rd.update(
        "Actividades de Respuesta Planificadas", "rich_text", valores.get("Actividades")
    )
    rd.update("Responsable del tratamiento", "rich_text", valores.get("Responsable"))
    rd.update("Estado Accion", "select", valores.get("Estado_accion"))
    rd.update("Probabilidad respuesta", "select", valores.get("Probabilidad"))
    rd.update("Impacto respuesta", "select", valores.get("Impacto"))
    rd.update("Valor riesgo respuesta", "number", valores.get("Valor_respuesta"))
    rd.update("Nivel riesgo respuesta", "select", valores.get("Nivel_respuesta"))
    rd.update("Riesgo residual", "rich_text", valores.get("Residual"))
    rd.update("Estado del riesgo", "select", valores.get("Estado_riesgo"))
    rd.update("Riesgo Asociado", "relation", id_riesgo)

    nueva_accion = Page().create(DB_ACCIONES_RIESGOS, rd).json()
    nueva_accion = ParserNotionResponse(nueva_accion).get_simple()
    # print(nueva_accion)
    id_meta_nueva_accion = nueva_accion.get("id_meta")
    data = {
        "Code" :codigo_riesgo,
        #"codigo_accion" :code,
        "id_meta": id_riesgo,
        "id_meta_nueva_accion" :id_meta_nueva_accion
    }
    return data


def crear_nueva_accion(request:Request, id_proyecto:str):
    # Crea un nuevo registro de acción para un riesgo de un proyecto 
    # Devuelve un diccionario de datos necesario para maquetar el front
    valores:dict = request.get_json()
    print(valores)
    code_riesgo = valores.get("Riesgo")
    query = {
        "filter": {
            "and": [
                {"property": "Proyecto", 
                            "relation": {"contains": id_proyecto}
                        },
                { "property" : "Code",
                            "title" :{"contains": code_riesgo},
                        }
            ]
            }
    }

    riesgos = QueryDatabase(DB_RIESGOS, query).get_key_value()
    id_riesgo = riesgos.get(code_riesgo)

    rd = RequestData()
    # code = str(int(obtener_ultimo_codigo(DB_ACCIONES_RIESGOS)) + 1)
    # rd.update(Code, title, code)
    rd.update("Proyecto", "relation", id_proyecto)
    rd.update("Estrategia de Respuesta al Riesgo", "select", valores.get("Estrategia"))
    rd.update("Actividades de Respuesta Planificadas", "rich_text", valores.get("Actividades"))
    rd.update("Responsable del tratamiento", "rich_text", valores.get("Responsable"))
    rd.update("Estado Accion", "select", valores.get("Estado_accion"))
    rd.update("Probabilidad respuesta", "select", valores.get("Probabilidad"))
    rd.update("Impacto respuesta", "select", valores.get("Impacto"))
    rd.update("Valor riesgo respuesta", "number", valores.get("Valor_respuesta"))
    rd.update("Nivel riesgo respuesta", "select", valores.get("Nivel_respuesta"))
    rd.update("Riesgo residual", "rich_text", valores.get("Residual"))
    rd.update("Estado del riesgo", "select", valores.get("Estado_riesgo"))
    rd.update("Riesgo Asociado", "relation", id_riesgo)
    nueva_accion = Page().create(DB_ACCIONES_RIESGOS, rd).json()
    nueva_accion = ParserNotionResponse(nueva_accion).get_simple()

    data:dict[str, str] = {
        "codigo_riesgo": code_riesgo,
        # "codigo_accion" :code,
        "id_meta" :id_riesgo,
    }

    return data

"""
Módulo que contiene toda la lógica relacionada con el
módulo del Departamento de Calidad.
"""
import datetime
import flask
import logging
from server.riesgos import data
from server.utils import notion
from server.utils import utils

# Gestión de Riesgos

RIESGO_PREFIX = "RS"
ACCION_PREFIX = "AC"

def anadir_ceros(lenght: int, last: str):
    """Añade 0 a un código hasta conseguir la longuitud deseada"""
    if len(last) < lenght:
        last = "0" + last
        return anadir_ceros(lenght, last)
    return last

class CustomResponse:
    MIMETYPE = "application/json"
    CONTENT_TYPE = "application/json"

    def __init__(self) -> None:
        self.response = {
            "datetime": datetime.datetime.today(),
            "url": flask.request.path,
        }

    def make_succesfull(self, data):
        self.response.update(
            {
                "data": data,
                "message": "OK",
            }
        )
        return flask.jsonify(self.response), 200

    def make_error(self, excep_error):
        self.response.update({"message": "Internal error", "data": str(excep_error)})
        return flask.jsonify(self.response), 400


class Riesgo:
    def __init__(self, id_riesgo: str = None) -> None:
        self.id_riesgo = id_riesgo

    def create(self, client_data: dict) -> dict:
        """Crea un nuevo riesgo en la base de datos..

        Args:
            client_data (dict): datos del riesgo.

        Returns:
            dict: respuesta con el id_riesgo.
        """
        # Obtener el útimo código
        code = anadir_ceros(4,str(int(utils.obtener_ultimo_codigo(data.DB_RIESGOS)[-4:]) + 1))
        id_proyecto = client_data.get("id_proyecto")
        info = notion.ParserNotionResponse(
            notion.Page(id_proyecto).read().json()
        ).get_simple()
        code_proyecto = info.get("Code")
        code = f"{RIESGO_PREFIX}-{code_proyecto}-{code}"
        request_data = notion.RequestData()
        request_data.update("Code", "title", code)
        request_data.update("Fecha deteccion", "date", client_data.get("Fecha"))
        request_data.update("Tipo", "select", client_data.get("Tipo"))
        request_data.update("Causa", "rich_text", client_data.get("Causa"))
        request_data.update("Efecto", "rich_text", client_data.get("Efecto"))
        request_data.update("Area Afectada", "select", client_data.get("Area"))
        request_data.update("Categoria", "select", client_data.get("Categoria"))
        request_data.update("Subcategoria", "select", client_data.get("Subcategoria"))
        request_data.update(
            "Impacto", "select", client_data.get("Impacto_riesgo")
        )
        request_data.update(
            "Valor riesgo", "number", client_data.get("Valor_riesgo")
        )
        request_data.update(
            "Nivel riesgo", "select", client_data.get("Nivel_riesgo")
        )
        request_data.update(
            "Probabilidad", "select", client_data.get("Probabilidad_riesgo")
        )
        request_data.update("Proyecto", "relation", client_data.get("id_proyecto"))
        response_notion = notion.ParserNotionResponse(
            notion.Page().create(data.DB_RIESGOS, request_data).json()
        ).get_simple()
        self.id_riesgo: str = response_notion.get("id_meta")
        # guardar el efecto para respresentarlo en el front
        efecto = response_notion.get("Efecto")
        return {"id_riesgo": self.id_riesgo, "code": code, "efecto": efecto}

    def update(self, client_data: dict) -> dict:
        """Actualiza los valores de un riesgo en la base de datos. Actualiza todos los campos.

        Args:
            client_data (dict): nuevos datos del riesgo.

        Returns:
            dict: respuesta con el id_riesgo.
        """
        request_data = notion.RequestData()
        request_data.update("Causa", "rich_text", client_data.get("Causa"))
        request_data.update("Impacto", "select", client_data.get("Impacto"))
        request_data.update("Efecto", "rich_text", client_data.get("Efecto"))
        request_data.update("Tipo", "select", client_data.get("Tipo_riesgo"))
        request_data.update("Categoria", "select", client_data.get("Categoria"))
        request_data.update("Subcategoria", "select", client_data.get("Subcategoria"))
        request_data.update("Probabilidad", "select", client_data.get("Probabilidad"))
        request_data.update("Valor riesgo", "number", client_data.get("Valor_riesgo"))
        request_data.update("Nivel riesgo", "select", client_data.get("Nivel_riesgo"))
        request_data.update("Area Afectada", "select", client_data.get("Area_afectada"))
        request_data.update(
            "Fecha deteccion", "date", client_data.get("Fecha_deteccion")
        )

        # Actualización riesgo en Notion
        notion.Page(self.id_riesgo).update(request_data)
        return {"id_riesgo": self.id_riesgo}

    def delete(self) -> dict:
        """Elimina un riesgo a partir del atributo id_riesgo.
        de la base de datos. Es una operación irreversible.

        Returns:
            dict: resultado con el id_riesgo.
        """
        
        code = notion.ParserNotionResponse(notion.Page(self.id_riesgo).read().json()).get_simple()
        code = code.get("Code")
    
        notion.Page(self.id_riesgo).delete()
        return {"id_riesgo": self.id_riesgo, "code": code}



def crear_riesgo(request: flask.Request)-> str:
    riesgo = Riesgo()
    riesgo.create(request)
    

class Accion:
    def __init__(self, id_accion: str = None) -> None:
        self.id_accion = id_accion

    def create(self, client_data: dict):
        code = anadir_ceros(4,str(int(utils.obtener_ultimo_codigo(data.DB_ACCIONES_RIESGOS)[-4:]) + 1))
        id_proyecto = client_data.get("id_proyecto")
        info = notion.ParserNotionResponse(
            notion.Page(id_proyecto).read().json()
        ).get_simple()
        code_proyecto = info.get("Code")

        code = f"{ACCION_PREFIX}-{code_proyecto}-{code}"
        request_data = notion.RequestData()
        request_data.update("Code", "title", code)
        request_data.update("Impacto respuesta", "select", client_data.get("Impacto"))
        request_data.update("Riesgo residual", "rich_text", client_data.get("Residual"))
        request_data.update("Estado Accion", "select", client_data.get("Estado_accion"))
        request_data.update(
            "Estado del riesgo", "select", client_data.get("Estado_riesgo")
        )
        request_data.update(
            "Probabilidad respuesta", "select", client_data.get("Probabilidad")
        )
        request_data.update(
            "Nivel riesgo respuesta", "select", client_data.get("Nivel_respuesta")
        )
        request_data.update(
            "Valor riesgo respuesta", "number", client_data.get("Valor_respuesta")
        )
        request_data.update(
            "Responsable del tratamiento", "rich_text", client_data.get("Responsable")
        )
        request_data.update(
            "Estrategia de Respuesta al Riesgo", "select", client_data.get("Estrategia")
        )
        request_data.update(
            "Actividades de Respuesta Planificadas",
            "rich_text",
            client_data.get("Actividades"),
        )
        request_data.update("Proyecto", "relation", client_data.get("id_proyecto"))


        request_data.update("Riesgo Asociado", "relation", client_data.get("id_riesgo"))

        response_notion = notion.ParserNotionResponse(
            notion.Page().create(data.DB_ACCIONES_RIESGOS, request_data).json()
        ).get_simple()

        self.id_accion: str = response_notion.get("id_meta")
        id_riesgo:str = client_data.get("id_riesgo")
        code_riesgo_asociado:str = view_riesgo_asociado(id_riesgo)

        return {"id_accion": self.id_accion, "code": code, "riesgo_asociado":code_riesgo_asociado}

    def update(self, client_data: dict):
        request_data = notion.RequestData()
        request_data.update("Estado Accion", "select", client_data.get("Estado_accion"))
        request_data.update(
            "Riesgo residual", "rich_text", client_data.get("Riesgo_residual")
        )
        request_data.update(
            "Impacto respuesta", "select", client_data.get("Impacto_accion")
        )
        request_data.update(
            "Estado del riesgo", "select", client_data.get("Estado_riesgo")
        )
        request_data.update(
            "Nivel riesgo respuesta", "select", client_data.get("Nivel_accion")
        )
        request_data.update(
            "Probabilidad respuesta",
            "select",
            client_data.get("Probabilidad_accion"),
        )
        request_data.update(
            "Valor riesgo respuesta",
            "number",
            client_data.get("Valor_accion"),
        )
        request_data.update(
            "Responsable del tratamiento",
            "rich_text",
            client_data.get("Responsable"),
        )
        request_data.update(
            "Estrategia de Respuesta al Riesgo",
            "select",
            client_data.get("Estrategia"),
        )
        request_data.update(
            "Actividades de Respuesta Planificadas",
            "rich_text",
            client_data.get("Actividades"),
        )

        notion.Page(self.id_accion).update(request_data)
        return {"id_accion": self.id_accion}

    def delete(self):
        """Elimina una acción a partir del atributo id_accion
        de la base de datos. Es una operación irreversible.

        Returns:
            dict: resultado con el id_accion.
        """
        notion.Page(self.id_accion).delete()
        return {"id_accion": self.id_accion}


def view_riesgo_asociado(id_riesgo):
    code_riesgo_asociado = notion.ParserNotionResponse(notion.Page(id_riesgo).read().json()).get_simple()
    code_riesgo_asociado = code_riesgo_asociado.get("Code")
    return code_riesgo_asociado
    

def get_all_proyectos():
    proyectos = notion.QueryDatabase(data.DB_ID_PROYECTOS).get_key_value()
    print(proyectos)
    return proyectos

def get_id_proyecto(request: flask.Request)->str:
    code_proyecto = request.form.get("proyecto")
    print(code_proyecto)
    query = {
        "filter": {
            "property": "Code",
            "title": {"contains": code_proyecto},
        }
    }
    proyecto_id_meta = notion.QueryDatabase(
        data.DB_ID_PROYECTOS, query
    ).get_key_value()
    id_proyecto = proyecto_id_meta.get(code_proyecto)
    return id_proyecto


def get_proyecto_info(id_proyecto: str)->dict:
    return notion.ParserNotionResponse(notion.Page(id_proyecto).read().json()).get_simple()

def get_riesgos_info(id_proyecto: str) -> list[dict]:
    query = {
        "filter": {"property": "Proyecto","relation": {"contains": id_proyecto}}
    }
    return notion.QueryDatabase(data.DB_RIESGOS, query).get_simple()


def get_acciones_info(id_proyecto:str) -> list[dict]:
    query = {
        "filter": {"property": "Proyecto", "relation": {"contains": id_proyecto}}
    }
    return notion.QueryDatabase(data.DB_ACCIONES_RIESGOS, query).get_simple()


def get_proyecto_riesgos_acciones(proyecto:list[dict], acciones:list[dict], riesgos:list[dict]) -> list:

    # Creamos estructura "id_meta":"Code" con los datos de los Riesgos
    aux_riesgos = {}
    for riesgo in riesgos:
        key = riesgo.get("id_meta")
        value = riesgo.get("Code")
        aux_riesgos.update({key: value})

    # Para cada acción se obtiene el código de riesgo asociado al mismo.
    acciones_data = []
    for accion in acciones:
        riesgo_asociado = accion.get("Riesgo Asociado")
        # Se obtiene el valor del id_riego asociado a la acción.
        try:
            id_riesgo = riesgo_asociado[0]
        except:
            id_riesgo = ""

        # Se obtiene el "Code" del riesgo.
        code_riesgo = aux_riesgos.get(id_riesgo, None)

        # Se actualzia la acción con el código del Riesgo.
        accion.update({"Riesgo Asociado": code_riesgo})
        acciones_data.append(accion)

    # Sobreescribimos los datos originales de las acciones con los nuevos datos.
    acciones = acciones_data

    return {
        "proyecto": proyecto,
        "riesgos": riesgos,
        "acciones": acciones,
    }

def get_sistema_riesgos(id_proyecto:str):
    proyecto = get_proyecto_info(id_proyecto)
    riesgos = get_riesgos_info(id_proyecto)
    acciones = get_acciones_info(id_proyecto)
    return get_proyecto_riesgos_acciones(proyecto,acciones,riesgos)

def create_riesgo(request:  flask.Request, id_proyecto: str):
    response = CustomResponse()
    try: 
        client_data: dict = request.get_json()
        client_data.update({"id_proyecto":id_proyecto})
        data = Riesgo().create(client_data)
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)

def update_riesgo(request:  flask.Request, id_riesgo:str):
    response = CustomResponse()
    try:
        client_data: dict = request.get_json()
        data = Riesgo(id_riesgo).update(client_data)
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)

def delete_riesgo(id_riesgo:str):
    response = CustomResponse()
    try:
        data = Riesgo(id_riesgo).delete()
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)

def comprobar_id_riesgo(client_data:dict):
    if client_data.get("Riesgo_asociado") == '':
        return  client_data.get("id_riesgo")
    else:
        query= {"filter": {"property": "Code", "title": {"contains": client_data.get("Riesgo_asociado")}}}
        id_riesgo = notion.QueryDatabase(data.DB_RIESGOS,query).get_simple()
        id_riesgo = id_riesgo[0].get("id_meta")
        return id_riesgo   

def create_accion(request: flask.Request, id_proyecto:str):
    response = CustomResponse()
    try:
        client_data: dict = request.get_json()
        id_riesgo = comprobar_id_riesgo(client_data)
        if (id_riesgo is not None):
            client_data.update({"id_riesgo":id_riesgo})
        client_data.update({"id_riesgo":id_riesgo})
        client_data.update({"id_proyecto":id_proyecto})
        data = Accion().create(client_data)
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)
    
def update_accion(request: flask.Request, id_accion:str):
    response = CustomResponse()
    try:
        client_data: dict = request.get_json()
        data = Accion(id_accion).update(client_data)
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)
    
def delete_accion(id_accion:str):
    response = CustomResponse()
    try:
        data = Accion(id_accion).delete()
        return response.make_succesfull(data=data)
    except Exception as excep_error:
        logging.error(excep_error)
        return response.make_error(excep_error)
    
# def update_proyecto(request: flask.Request, id_proyecto:str):
#     response = CustomResponse()
#     try:
#         client_data: dict = request.get_json()
#         data = Proyecto(id_proyecto).update(client_data)
#         return response.make_succesfull(data=data)
#     except Exception as excep_error:
#         logging.error(excep_error)
#         return response.make_error(excep_error)
