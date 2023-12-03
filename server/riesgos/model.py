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
